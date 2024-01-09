import {Request, Response, NextFunction} from 'express';
import { Etiqueta_In } from '../interfaces/etiquetas_input';
import {  ejercicioDetallesService,  plantillaService, sesionEntrenamientoService } from '../service/plantilla_posts_service';
import { getUsuarioByIdService } from '../service/usuario_service';

// -------------------
// Funciones auxiliares
// -------------------


// Función auxiliar para validar si un valor es un número válido
function esNumeroValido(valor: any) {
    return !isNaN(valor) && valor > 0;
}

function esFechaValida(fecha: any): boolean {
    return !isNaN(Date.parse(fecha));
}

// Función auxiliar para validar tipos de ejercicio
function validarTipoEjercicio(tipoEjercicio: string) {
    const tiposValidos = ['reps', 'time', 'weight'];
    return tiposValidos.includes(tipoEjercicio);
}

// Función auxiliar para validar campos de ejercicio según su tipo
function validarCamposEjercicio(tipoEjercicio: string, ejercicio:any) {
    switch (tipoEjercicio) {
        case 'reps':
            return ejercicio.target_sets != null && ejercicio.target_reps != null;
        case 'time':
            return ejercicio.target_time != null;
        case 'weight':
            return ejercicio.target_sets != null && ejercicio.target_reps != null;
        default:
            return false;
    }
}
// Función auxiliar para validar campos de set
function validarCamposSet(tipoEjercicio: string, set:any): string | null {
    switch (tipoEjercicio) {
        case 'reps':
            if (set.reps === null) return 'Reps es obligatorio en cada set de fuerza.';
            break;
        case 'time':
            if (set.time === null) return 'Time es obligatorio en cada set de tiempo.';
            break;
        case 'weight':
            if (set.weight === null || set.reps === null) return 'Weight y Reps son obligatorios en cada set de peso.';
            break;
       
        default:
            break;
    }
    return null;
}
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

        if (!esNumeroValido(userId) ){
            res.status(400).json({ error: 'El usuario proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(page)){
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(pageSize)){
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

     
        if (!esNumeroValido(page)){
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(pageSize)){
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
    if (!esNumeroValido(user_id)) {
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

    if (!esNumeroValido(template_id)) {
        res.status(400).json({ error: 'El template_id es obligatorio y debe ser un número válido.' });
        return;
    }

    if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
        res.status(400).json({ error: 'Debe incluir al menos un ejercicio.' });
        return;
    }

    for (const ejercicio of ejercicios) {
        if (!validarTipoEjercicio(ejercicio.type)) {
            res.status(400).json({ error: 'Tipo de ejercicio inválido.' });
            return;
        }

        if (!validarCamposEjercicio(ejercicio.type, ejercicio)) {
            res.status(400).json({ error: 'Campos requeridos faltantes o inválidos para el tipo de ejercicio.' });
            return;
        }
    }

    next();
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
    if (!esNumeroValido(template_id)) {
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
    const { name, description,  } = req.body;

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


export async function validateEjercicioMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, exercise_id, fecha_inicio, fecha_final } = req.query;

    if ( !user_id || !esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número.' });
        return;
    }
    if (!exercise_id  ||  !esNumeroValido(exercise_id)) {
        res.status(400).json({ error: 'El exercise_id debe ser un número.' });
        return;
    }
    if ( fecha_inicio && !esFechaValida(fecha_inicio)) {
        res.status(400).json({ error: 'La fecha de inicio no es válida.' });
        return;
    }
    if (fecha_final && !esFechaValida(fecha_final)) {
        res.status(400).json({ error: 'La fecha final no es válida.' });
        return;
    }
    
    if ((fecha_inicio && fecha_final) && fecha_final < fecha_inicio) {
        res.status(400).json({ error: 'La fecha de finalización debe ser posterior a la fecha de inicio.' });
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
    if (!esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El user_id debe ser un número.' });
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

    const tipoEjercicio = detailedExercise.type;


    if (validarTipoEjercicio(tipoEjercicio)) {
        return 'Tipo de ejercicio inválido.';
    }

    for (const set of ejercicio.sets) {
        const error_mssg = validarCamposSet(tipoEjercicio, set);
       if (error_mssg) {
            return error_mssg;
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
