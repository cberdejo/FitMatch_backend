import {Request, Response, NextFunction} from 'express';
import { Etiqueta_In } from '../interfaces/etiquetas_input';
import { plantillaService } from '../service/plantilla_posts_service';
import { getUsuarioByIdService } from '../service/usuario_service';

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


   