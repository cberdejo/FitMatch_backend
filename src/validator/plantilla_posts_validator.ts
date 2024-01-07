import {Request, Response, NextFunction} from 'express';
import { Etiqueta_In } from '../interfaces/etiquetas_input';
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
    const { template_name, description, etiquetas } = req.body;

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

    const isValidEtiqueta = (etiqueta: Etiqueta_In) => {
        return etiqueta.objectives || etiqueta.experience || etiqueta.interests || etiqueta.equipment;
    };

    if (!etiquetas.every(isValidEtiqueta)) {
        res.status(400).json({ error: 'Cada etiqueta debe tener al menos uno de los siguientes campos no nulos: objetivos, experiencia, intereses, equipo.' });
        return;
    }
    
    next();
}
   
   