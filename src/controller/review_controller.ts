import { Request, Response } from 'express';
import { likeReviewService, getLikeByUserId, dislikeReviewService, addReviewService, answerReviewService, deleteReviewService} from '../service/review_service'; 
import { getClienteByUserIdService } from '../service/usuario_service';

/**
 * Like a review.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves to nothing.
 */
async function likeReview(req: Request, res: Response) {
    try {
        const { reviewId, userId } = req.body;

        const likeExistente = await getLikeByUserId(reviewId, userId);
        let like;
        if (likeExistente) {
          like = await dislikeReviewService(likeExistente.liked_id);
        }else{
          like = await likeReviewService(reviewId, userId);
        }
        res.status(200).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

/**
 * Adds a review to the system.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A Promise that resolves with no value.
 */
async function addReview(req: Request, res: Response) {
    try {
        const { trainerId, userId, rating, reviewContent } = req.body;
        const cliente = await getClienteByUserIdService(userId);
        if (!cliente) {
          res.status(400).json({ error: 'cliente no encontrado con userId' });
          return;
        }
       
        const review = await addReviewService(trainerId, cliente.client_id, rating, reviewContent);
        res.status(201).json(review);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

/**
 * Deletes a review.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Returns a promise that resolves when the review is deleted.
 */
async function deleteReview (req: Request, res: Response) {
    try {
        const { reviewId } = req.body;
        const review = await deleteReviewService(reviewId);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

/**
 * Handles the answering of a review.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the answer is posted.
 */
async function answerReview(req: Request, res: Response) {
    try{
        const { reviewId, userId, answer } = req.body;

        const comment = await answerReviewService(reviewId, userId, answer);
        res.status(201).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
   

}

/**
 * Deletes a comment.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves with no value.
 */
async function deleteComment(req: Request, res: Response) {
    try{
        const { commentId } = req.body;
        const comment = await deleteReviewService(commentId);
        res.status(201).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export { likeReview, addReview, answerReview, deleteReview, deleteComment };