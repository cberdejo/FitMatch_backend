import { Request, Response } from 'express';
import { getTrainerPostService, getTrainerReviewsService } from '../service/trainers_posts_service';
import { TrainerPost } from '../interfaces/trainers_posts';

/**
 * Retrieves trainer posts for a specific user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves with the response status and the retrieved trainer posts
 */
export async function getTrainerPosts(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.user_id);
        if (!user_id || isNaN(user_id) || user_id <= 0) {
            res.status(400).json({ error: 'El ID del usuario proporcionado no es válido.' });
            return;
        }

        const trainerPosts: TrainerPost[] = await getTrainerPostService(user_id);
        if (trainerPosts && trainerPosts.length > 0) {
            for (const trainer of trainerPosts) {
                const trainerReviews = await getTrainerReviewsService(trainer.trainer_id);
                trainer.reviews = trainerReviews;
            }
        }

        return res.status(200).json(trainerPosts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}