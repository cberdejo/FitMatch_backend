import { Request, Response } from 'express';
import { getUsuarioByIdService } from '../service/usuario_service';
import { getPlantillaPostService } from '../service/plantilla_posts_service';



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
export async function getPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await getPlantillaPostService(userId, page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).json([]);
            return;
        }

        // Si necesitas realizar alguna lógica adicional con las plantillas, puedes hacerlo aquí.
        // Por ejemplo, si necesitas procesar las revisiones de cada plantilla, aquí sería el lugar.
        // Por ahora, se asume que getPlantillaPostService ya maneja esto.

        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}
