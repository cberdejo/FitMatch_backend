import { Request, Response } from 'express';
import { getUsuarioByIdService } from '../service/usuario_service';
import { getPlantillaPostByIdService, getPlantillaPostService } from '../service/plantilla_posts_service';



/**
 * Retrieves a user by their ID.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<any>} A promise that resolves with the user information, or null if an error occurs.
 */
export async function getUserById(userId: number) {
    try {
        return await getUsuarioByIdService(userId);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}


// Función principal para obtener publicaciones de plantillas de entrenamiento
export async function getPlantillaPostsById(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await getPlantillaPostByIdService(userId, page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).json([]);
            return;
        }
        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

export async function getAllPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {
       
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await getPlantillaPostService(page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).json([]);
            return;
        }

        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

