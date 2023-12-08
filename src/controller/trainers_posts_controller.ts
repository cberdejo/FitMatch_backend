import { Request, Response } from 'express';
import { getTrainerPostService, getTrainerReviewsService } from '../service/trainers_posts_service'
import { getUserByClientIdService } from '../service/usuario_service';


/**
 * Retrieves trainer posts for a specific user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves with the response status and the retrieved trainer posts
 */
export async function getTrainerPosts(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1; // Obtiene el número de página de los parámetros de consulta, por defecto es 1
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Obtiene el tamaño de página de los parámetros de consulta, por defecto es 10

        if (!userId || isNaN(userId) || userId <= 0) {
            res.status(400).json({ error: 'El ID del usuario proporcionado no es válido.' });
            return;
        }

        // Modifica getTrainerPostService para aceptar parámetros de paginación
        const trainerPosts = await getTrainerPostService(userId, page, pageSize);
        if (!trainerPosts || trainerPosts.length === 0) {
            res.status(404).json({ message: 'No se encontraron publicaciones de entrenadores.' });
            return;
        }

        for (const trainer of trainerPosts) {
            trainer.reviews = await Promise.all(
                (await getTrainerReviewsService(trainer.trainer_id)).map(async (review) => {
                    const user = await getUserByClientIdService(review.client_id);
                    return { ...review, username: user?.username ?? 'Anónimo' };
                })
            );
        }

        res.status(200).json(trainerPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}
