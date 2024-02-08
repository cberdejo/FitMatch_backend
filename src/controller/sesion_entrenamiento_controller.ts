
import { Request, Response } from 'express';
import { sesionEntrenamientoService } from '../service/sesion_entrenamiento_service';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';


/**
 * Creates a session of training.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} The created session.
 */
// export async function createSesionEntrenamiento(req: Request, res: Response): Promise<void> {
//     try {
//         const { template_id, ejercicios, session_name, notes } = req.body;
//         const createdSession = await sesionEntrenamientoService.create(template_id, ejercicios, session_name, notes);
//         res.status(201).json(createdSession);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al crear la sesión de entrenamiento.' });
//     }
// }

export async function createSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {
        const  { template_id, session_name, notes, order} = req.body;
        const createdSession = await sesionEntrenamientoService.create(template_id, session_name, notes, order);
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





export async function editSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {

        const sessionId = parseInt(req.params.sessionId);
        if (!esNumeroValido(sessionId)) {
            console.log('Error: El ID de la sesión debe ser un número.', sessionId);
            res.status(400).json({ error: 'El ID de la sesión debe ser un número.' });
            return;
        }

        const sessionData = req.body;
        
        const updatedSession = await sesionEntrenamientoService.update(sessionId, sessionData);
      
        if (!updatedSession) {

            res.status(404).json({ error: 'Sesión de entrenamiento no encontrada.' });
            return;
        }

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

export async function getSesionsEntrenamientoBySessionId(req: Request, res: Response): Promise<void> {
    try {
        const session_id = parseInt(req.params.session_id);
        const session = await sesionEntrenamientoService.getById(session_id);
        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la sesión de entrenamiento.' });
    }
}