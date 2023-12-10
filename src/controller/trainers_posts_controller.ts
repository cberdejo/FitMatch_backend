import { Request, Response } from 'express';
import { getTrainerPostService, getTrainerReviewsService } from '../service/trainers_posts_service'
import { getUserByClientIdService, getUsuarioByIdService } from '../service/usuario_service';

import { extendedComentarioReviews, extendedReviews } from '../interfaces/trainers_posts';



/**
 * Retrieves a user by their ID.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<any>} A promise that resolves with the user information, or null if an error occurs.
 */
async function getUserById(userId: number) {
    try {
        return await getUsuarioByIdService(userId);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}


async function processComments(comments: any[]): Promise<extendedComentarioReviews[]> {
    return Promise.all(comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return { ...comment, username: user?.username ?? 'Anónimo' };
    }));
}


/**
 * Processes a review and returns the processed review.
 *
 * @param {any} review - The review object to be processed.
 * @return {any} - The processed review object.
 */
async function processReview(review: any) {
    if (!review || !review.client_id) {
        return null;
    }
    const user = await getUserByClientIdService(review.client_id);

    const reviewExtended: extendedReviews = {
        ...review,
        username: user?.username ?? 'Anónimo',
    };
    

    if (reviewExtended.comentario_review) {
        review.comentario_review = await processComments(review.comentario_review);
    }

    return review;
}

// Función principal para obtener publicaciones de entrenadores
export async function getTrainerPosts(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        if (!userId || isNaN(userId) || userId <= 0) {
            res.status(400).json({ error: 'El ID del usuario proporcionado no es válido.' });
            return;
        }

        const trainerPosts = await getTrainerPostService(userId, page, pageSize);
        if (!trainerPosts || trainerPosts.length === 0) {
            res.status(404).json({ message: 'No se encontraron publicaciones de entrenadores.' });
            return;
        }

        for (const trainer of trainerPosts) {
            trainer.reviews = await Promise.all(
                (await getTrainerReviewsService(trainer.trainer_id)).map(processReview)
            );
        }

        res.status(200).json(trainerPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}
