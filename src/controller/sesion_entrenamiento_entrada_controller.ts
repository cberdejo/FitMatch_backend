import { Request, Response } from 'express';
import { sesionEntrenamientoEntradaService } from '../service/sesion_entrenamiento_entrada_service';



/**
 * Creates a session of entrenamiento entrada.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - Promise that resolves with void.
 */
export async function createSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const { user_id, session_id, ejercicios } = req.body;
        const sesionEntrada = await sesionEntrenamientoEntradaService.create(user_id, session_id, ejercicios);
        res.status(201).json(sesionEntrada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de entrenamiento de entrada.' });
    }
}

/**
 * Deletes a session entrenamiento entrada.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the session entrenamiento entrada is deleted.
 */
export async function deleteSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const entry_id = parseInt(req.params.entry_id);
        await sesionEntrenamientoEntradaService.delete(entry_id);
        res.status(200).json({ message: 'Sesión de entrenamiento de entrada eliminada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la sesión de entrenamiento de entrada.' });
    }
}

/**
 * Edit a session training entry.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */
export async function editSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const entry_id = parseInt(req.params.entry_id);
        const updateData = req.body; // Asegúrate de que esto contenga los campos que deseas actualizar
        const updatedSession = await sesionEntrenamientoEntradaService.edit(entry_id, updateData);
        res.status(200).json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la sesión de entrenamiento de entrada.' });
    }
}
