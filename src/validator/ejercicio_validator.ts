import { NextFunction, Request, Response } from "express";
import { esFechaValida, esNumeroValido } from "../utils/funciones_auxiliares_validator";


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


/**
 * Validates the ejercicio metrics based on the provided request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} Returns nothing.
 */
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
