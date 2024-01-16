import { Request, Response } from 'express';
import { commentService, likeCommentService, likeReviewService, reviewService, } from '../service/review_service'; 
import {  getUsuarioByIdService } from '../service/usuario_service';
import { reviews, usuario } from '@prisma/client';


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

        const likeExistente = await likeReviewService.getLikeByUserId(reviewId, userId);
        let like;
        if (likeExistente) {
          like = await likeReviewService.dislike(likeExistente.liked_review_id);
        }else{
          like = await likeReviewService.like(reviewId, userId);
        }
        res.status(200).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}


async function likeComment(req: Request, res: Response) {
    try {
        const { commentId, userId } = req.body;

        const likeExistente = await likeCommentService.getLikeByUserId(commentId, userId);
        let like;
        if (likeExistente) {
          like = await likeCommentService.dislike(likeExistente.liked_comment_id);
        }else{
          like = await likeCommentService.like(commentId, userId);
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
        const { templateId, userId, rating, reviewContent } = req.body;
  
        const review: reviews= await reviewService.create(templateId, userId, rating, reviewContent);
        const user: usuario | null= await getUsuarioByIdService(userId);
 
        if (!user) {
            res.status(400).json({ error: 'username no encontrado con userId' });
            return;
        } 
        if (!review) {
            res.status(400).json({ error: 'review no creado' });
            return;
        }
        
        const reviewExtended  = {
            username: user.username,
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
        const review = await reviewService.delete(reviewId);
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
        const comment = await commentService.create(reviewId, userId, answer);

        const user = await getUsuarioByIdService(userId);
        if (!user) {
            res.status(400).json({ error: 'user no encontrado con userId' });
            return;
        }
        const extendedComment = {
            username: user.username,
            ...comment
        }  
        
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
        const comment = await commentService.delete(commentId);
        res.status(200).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export { likeReview, addReview, answerReview, deleteReview, deleteComment, likeComment };