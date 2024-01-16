


import { NextFunction, Request, Response } from "express";
import { esNumeroValido, validarCamposEjercicio, validarTipoEjercicio } from "../utils/funciones_auxiliares_validator";


/**
 * Validates the creation of a training session.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {void}
 */
export async function validateCreateSesionEntrenamiento(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { template_id, ejercicios, session_name } = req.body;

    if (!esNumeroValido(template_id)) {
        res.status(400).json({ error: 'El template_id es obligatorio y debe ser un número válido.' });
        return;
    }

    if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
        res.status(400).json({ error: 'Debe incluir al menos un ejercicio.' });
        return;
    }
    if (!session_name) {
        res.status(400).json({ error: 'El nombre de la sesión es obligatorio.' });
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