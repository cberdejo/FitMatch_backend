import { NextFunction, Request, Response } from "express";
import { validarCamposSet, validarTipoEjercicio } from "../utils/funciones_auxiliares_validator";

import { getUsuarioByIdService } from "../service/usuario_service";
import { sesionEntrenamientoService } from "../service/sesion_entrenamiento_service";
import { ejercicioDetallesService } from "../service/ejercicio_service";




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
