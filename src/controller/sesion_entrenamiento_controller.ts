
import { Request, Response } from 'express';
import { sesionEntrenamientoService } from '../service/sesion_entrenamiento_service';

/**
 * Creates a session of training.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} The created session.
 */
export async function createSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {
        const { template_id, ejercicios, session_name, notes } = req.body;
        const createdSession = await sesionEntrenamientoService.create(template_id, ejercicios, session_name, notes);
        res.status(201).json(createdSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de entrenamiento.' });
    }
}


/**
 * Deletes a training session.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the success message or rejects with an error message.
 */
export async function deleteSesionEntrenamiento(req: Request, res: Response) {
    try {
        const { session_id } = req.params;
        await sesionEntrenamientoService.delete(session_id);
        res.status(200).json({ message: 'Sesión de entrenamiento eliminada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la sesión de entrenamiento.' });
    }
}


/**
 * Edit a session of training.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Promise that resolves when the session is edited.
 */
export async function editSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {
        const session_id = parseInt(req.params.session_id);
        const sessionData = req.body; 

        const updatedSession = await sesionEntrenamientoService.update(session_id, sessionData);
        res.json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la sesión de entrenamiento.' });
    }
}

export async function getSesionsEntrenamientoByTemplateId(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        const session = await sesionEntrenamientoService.getByTemplateId(template_id);
        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la sesión de entrenamiento.' });
    }
}