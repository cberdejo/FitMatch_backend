import {Request, Response, NextFunction} from 'express';
import { Etiqueta_In } from '../interfaces/etiquetas_input';
import { ejercicioDetallesService, plantillaService, sesionEntrenamientoService } from '../service/plantilla_posts_service';
import { getUsuarioByIdService } from '../service/usuario_service';

// -------------------
// Validadores para PlantillaPost
// -------------------



/**
 * Validates the request for getting plantilla posts. 
 * Ensures that userId is a valid number and greater than 0.
 * Verifies that page and pageSize are positive integers.
 * If any validation fails, it responds with an appropriate error message and a 400 status code.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @return {Promise<void>} - Returns nothing.
 */


export async function validateGetPlantillaPostsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        if (!userId || isNaN(userId) || userId <= 0) {
            res.status(400).json({ error: 'El ID del usuario proporcionado no es válido.' });
            return;
        }

        if (isNaN(page) || page <= 0) {
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }

        if (isNaN(pageSize) || pageSize <= 0) {
            res.status(400).json({ error: 'El tamaño de página proporcionado no es válido.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al validar la solicitud.' });
    }
   
}


/**
 * Validates the parameters for the getAllPlantillaPosts function.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} A promise that resolves to nothing.
 */
export async function validateGetAllPlantillaPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
       
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

     
        if (isNaN(page) || page <= 0) {
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }

        if (isNaN(pageSize) || pageSize <= 0) {
            res.status(400).json({ error: 'El tamaño de página proporcionado no es válido.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al validar la solicitud.' });
    }
   
}

/**
 * Validates the request body for creating a plantilla.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function to call
 * @return {Promise<void>} - a promise that resolves to void
 */
export async function validateCreatePlantillaPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { template_name, description, etiquetas, user_id } = req.body;

    if (!template_name) {
        res.status(400).json({ error: 'El nombre de la plantilla no puede estar vacío.' });
        return;
    }
    if (!description) {
        res.status(400).json({ error: 'La descripción de la plantilla no puede estar vacía.' });
        return;
    }
    if (!etiquetas) {
        res.status(400).json({ error: 'Las etiquetas de la plantilla no pueden estar vacías.' });
        return;
    }
   
    if (!Array.isArray(etiquetas) || etiquetas.length < 1) {
        res.status(400).json({ error: 'Debes seleccionar al menos una etiqueta.' });
        return;
    }
     
    if (!user_id) {
        res.status(400).json({ error: 'El ID del usuario no puede estar vacío.' });
        return;
    }
    if (isNaN(user_id)) {
        res.status(400).json({ error: 'El ID del usuario debe ser un número.' });
        return;
    }

    const isValidEtiqueta = (etiqueta: Etiqueta_In) => {
        return etiqueta.objectives || etiqueta.experience || etiqueta.interests || etiqueta.equipment;
    };

    if (!etiquetas.every(isValidEtiqueta)) {
        res.status(400).json({ error: 'Cada etiqueta debe tener al menos uno de los siguientes campos no nulos: objetivos, experiencia, intereses, equipo.' });
        return;
    }
    
    next();
}

/**
 * Validates an edit plantilla post.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @return {Promise<void>} a promise that resolves to void
 */
export async function validateEditPlantillaPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const template_id = parseInt(req.params.template_id);

    try {
        const plantilla = await plantillaService.getPlantillaById(template_id);

        if (!plantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada.' });
            return;
        }

        if (plantilla.public) {
            res.status(403).json({ error: 'No se puede modificar una plantilla que ya es pública.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al validar la solicitud.' });
    }
}

// -------------------
// Validadores para SesionEntrenamiento
// -------------------


/**
 * Validates the creation of a training session.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {void}
 */
export async function validateCreateSesionEntrenamiento(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { template_id, ejercicios } = req.body;

    if (!template_id) {
        res.status(400).json({ error: 'El template_id es obligatorio.' });
        return;
    }
    if (isNaN(template_id)) {
        res.status(400).json({ error: 'El template_id debe ser un número.' });
        return;
    }

    if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
        res.status(400).json({ error: 'Debe incluir al menos un ejercicio.' });
        return;
    }

    for (const ejercicio of ejercicios) {
        const { target_sets, target_reps, target_time, armrap } = ejercicio;
        const isSetsAndReps = target_sets != null && target_reps != null;
        const isTimeBased = target_time != null;
        const isAmrap = armrap != null;

        if ([isSetsAndReps, isTimeBased, isAmrap].filter(Boolean).length !== 1) {
            res.status(400).json({ error: 'Debe especificar exactamente uno de los siguientes: target_sets y target_reps, target_time o armrap.' });
            return;
        }
    }

    return next();
}


/**
 * Validates the edit session of training.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call.
 * @return {Promise<void>} - Resolves with void.
 */
export async function validateEditSesionEntrenamiento(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { template_id } = req.body; // Replace 'other_fields' with actual field names

    if (!template_id) {
        res.status(400).json({ error: 'El template_id es obligatorio.' });
        return;
    }
    if (isNaN(template_id)) {
        res.status(400).json({ error: 'El template_id debe ser un número.' });
        return;
    }

   

    next();
}

// -------------------
// Validadores para Ejercicio
// -------------------


/**
 * Validates the creation of an ejercicio.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} Returns nothing.
 */
export async function validateCreateEjercicio(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, description } = req.body;

    if (!name) {
        res.status(400).json({ error: 'El nombre del ejercicio es obligatorio.' });
        return;
    }

    if (!description) {
         res.status(400).json({ error: 'La descripción del ejercicio es obligatoria.' });
        return;
    }

    next();
}

// -------------------
// Validadores para RutinaGuardada
// -------------------



/**
 * Validates the request body for creating a saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves to void.
 */
export async function validateCreateRutinaGuardada(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, template_id } = req.body;

    if (!user_id) {
        res.status(400).json({ error: 'El user_id es obligatorio.' });
        return;
    }

    if (!template_id) {
        res.status(400).json({ error: 'El template_id es obligatorio.' });
        return;
    }
    const template = await plantillaService.getPlantillaById(template_id);
    const user = await getUsuarioByIdService(user_id);

    if (!template || !user) {
        res.status(400).json({ error: 'Plantilla o usuario no encontrado.' });
        return;
    }


    next();
}

// -------------------
// Validadores para Sesion de Entrenamiento Entrada
// -------------------


// Función para validar el user_id y el session_id
async function validateUserAndSession(user_id: number, session_id: number): Promise<string | null> {
    if (!user_id || isNaN(user_id) || !session_id || isNaN(session_id)) {
        return 'El user_id y el session_id son obligatorios y deben ser números.';
    }

    const userExists = await getUsuarioByIdService(user_id);
    const sessionExists = await sesionEntrenamientoService.getById(session_id);

    if (!userExists || !sessionExists) {
        return 'Usuario o sesión de entrenamiento no encontrada.';
    }

    return null;
}

// Función para validar un ejercicio y sus sets
async function validateEjercicio(ejercicio: any): Promise<string | null> {
    if (!ejercicio.detailed_exercise_id) {
        return 'El detailed_exercise_id es obligatorio en cada ejercicio.';
    }

    const detailedExercise = await ejercicioDetallesService.getById(ejercicio.detailed_exercise_id);
    if (!detailedExercise) {
        return 'Ejercicio con detailed_exercise_id no encontrado.';
    }


    for (const set of ejercicio.sets) {
        // Si target_sets y target_reps o armrap son nulos, entonces reps debe ser nulo y time debe tener algún valor
        if ((detailedExercise.target_sets === null && detailedExercise.target_reps === null) || detailedExercise.armrap === null) {
            if (set.reps !== null || set.time === null) {
               return 'Para ejercicios con target_sets y target_reps o armrap nulos, reps debe ser nulo y time debe tener algún valor.' ;
               
            }
        }

        // Si target_sets y target_reps o armrap no son nulos, entonces time debe ser nulo y reps debe tener algún valor
        if (detailedExercise.target_sets !== null || detailedExercise.target_reps !== null || detailedExercise.armrap) {
            if (set.time !== null || set.reps === null) {
                return 'Para ejercicios con target_sets y target_reps o armrap no nulos, time debe ser nulo y reps debe tener algún valor.';
               
            }
        }
    }

    return null;
}
   

/**
 * Validates the session training input.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function in the middleware chain
 * @return {Promise<void>} - a promise that resolves to void
 */
export async function validateSesionEntrenamientoEntrada(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, session_id, ejercicios } = req.body;

    //user_id y session_id son obligatorios y deben ser números y existir un usuario y una sesion de entrenamiento en la bbd
    const userAndSessionError = await validateUserAndSession(user_id, session_id);

    if (userAndSessionError) {
        res.status(400).json({ error: userAndSessionError });
        return;
    }

    //ejercicios debe de ser un array mayor que 0
    if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
        res.status(400).json({ error: 'Los ejercicios son obligatorios y deben ser un array.' });
        return;
    }

    for (const ejercicio of ejercicios) {
        //Se valida cada ejercicio: debe existir un ejercicio con detalles asociado al ejercicio de entrada y debe tener sets/reps apuntado o time
        const ejercicioError = await validateEjercicio(ejercicio);
        if (ejercicioError) {
            res.status(400).json({ error: ejercicioError });
            return;
        }
    }

    next();
}

/**
 * Validates the edit of a session training entry.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} Promise that resolves to undefined.
 */
export async function validateEditSesionEntrenamientoEntrada(req: Request, res: Response, next: NextFunction): Promise<void> {
   const {entry_session_id} = req.body;
    if (!entry_session_id) {
        res.status(400).json({ error: 'El entry_session_id es obligatorio.' });
        return;
    }
    if (isNaN(entry_session_id)) {
        res.status(400).json({ error: 'El entry_session_id debe ser un número.' });
        return;
    }
    next();
}
