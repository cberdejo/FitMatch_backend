import { Request, Response } from 'express';
import { likeReviewService, getLikeByUserId, dislikeReviewService, addReviewService, answerReviewService, deleteReviewService, answerCommentService} from '../service/review_service'; 
import { getClienteByUserIdService, getUsuarioByIdService } from '../service/usuario_service';
import { extendedComentarioReviews, extendedReviews } from '../interfaces/trainers_posts';


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
        const username = await getUsuarioByIdService(userId);

        if (!username) {
            res.status(400).json({ error: 'username no encontrado con userId' });
            return;
        } 
        if (!review) {
            res.status(400).json({ error: 'review no creado' });
            return;
        }
        
        const reviewExtended : extendedReviews = {
            username: username.username,
            ...review

        }
        res.status(200).json(reviewExtended);

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
        const reviewId = parseInt(req.params.id);
        const review = await deleteReviewService(reviewId);
        res.status(200).json(review);
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
        const { userId, reviewId, answer } = req.body;
        const comment = await answerReviewService(reviewId, userId, answer);

        const user = await getUsuarioByIdService(userId);
        if (!user) {
            res.status(400).json({ error: 'user no encontrado con userId' });
            return;
        }
        const extendedComment: extendedComentarioReviews = {
            username: user.username,
            ...comment
        }  as extendedComentarioReviews
        
        res.status(200).json(extendedComment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
   
}

/**
 * Handles the request to answer a comment.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves with no value.
 */
async function answerComment(req: Request, res: Response) {
    try{
        const { reviewId, commentId, userId, answer } = req.body;

        const comment = await answerCommentService(reviewId, commentId, userId, answer);
        const user = await getUsuarioByIdService(userId);
        if (!user) {
            res.status(400).json({ error: 'user no encontrado con userId' });
            return;
        }
        const extendedComment: extendedComentarioReviews = {
            username: user.username,
            ...comment
        }  as extendedComentarioReviews
        
        res.status(200).json(extendedComment);
    
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
        const commentId = parseInt(req.params.id);
        const comment = await deleteReviewService(commentId);
        res.status(200).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export { likeReview, addReview, answerReview, deleteReview, deleteComment, answerComment };