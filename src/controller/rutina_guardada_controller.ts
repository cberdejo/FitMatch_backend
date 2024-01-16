import { Request, Response } from 'express';
import { rutinaGuardadaService } from '../service/rutinas_guardadas_service';

/**
 * Creates a new saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Promise that resolves when the routine is created.
 */
export async function createRutinaGuardada(req: Request, res: Response): Promise<void> {
    try {
        const { user_id, template_id } = req.body;
        const nuevaRutina = await rutinaGuardadaService.create({ user_id, template_id });
        res.status(201).json(nuevaRutina);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la rutina.' });
    }
}

/**
 * Retrieves the saved routines for a specific user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves with the saved routines.
 */
export async function getRutinasGuardadas(req: Request, res: Response) {
    try {
        const userId = parseInt(req.query.user_id as string) || 0;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const rutinas = await rutinaGuardadaService.getGuardadasPlantillaPosts(userId,page, pageSize);
        res.status(200).json(rutinas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las rutinas guardadas.' });
    }
}


/**
 * Deletes a saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A Promise that resolves when the routine is deleted.
 */
export async function deleteRutinaGuardada(req: Request, res: Response): Promise<void> {
    try {
        const { saved_id } = req.params;
        await rutinaGuardadaService.delete(parseInt(saved_id));
        res.status(200).json({ message: 'Rutina eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la rutina.' });
    }
}
