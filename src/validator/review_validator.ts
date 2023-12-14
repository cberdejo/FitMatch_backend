import {Request, Response, NextFunction} from 'express';
import {  getTrainerByTrainerIdService, getUsuarioByIdService } from '../service/usuario_service';
import { getCommentByIdService, getReviewByIdService } from '../service/review_service';



/**
 * Validates the like request before proceeding to the next middleware.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export async function validateLikeReview (req: Request, res: Response, next: NextFunction) {

    const { reviewId, userId } = req.body;
    if (
        isNaN(reviewId) ||
        isNaN(userId) 
      ) {
        res.status(400).json({ error: 'Datos incompletos o incorrectos' });
        return;
      }else{
        next();
      }
      
}
/**
 * Validates the review data received in the request body. 
 * Checks if the trainerId, clientId, rating, and reviewContent are valid.
 * If any of the data is invalid, it sends a 400 error response with an error message.
 * Otherwise, it calls the next middleware function.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {void} 
 */
export async function validateAddReview  (req: Request, res: Response, next: NextFunction){

    const { trainerId, userId, rating, reviewContent } = req.body;
    if (
        isNaN(trainerId) ||
        isNaN(userId) ||
        isNaN(rating) ||
        rating < 0 ||
        rating > 5 ||
        !reviewContent
      ) {
        res.status(400).json({ error: 'Datos incompletos o incorrectos' });
        return;
      }else{

   
        const trainer = await getTrainerByTrainerIdService(trainerId);
        if ( !trainer) {
          res.status(400).json({ error: 'cliente no encontrado con userId' });
          return;
        }
      
        next();
      }
      
}

/**
 * Validates the comment by checking if the required parameters are present and valid.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @return {void} - no return value
 */
export async function validateAnswerReview(req: Request, res: Response, next: NextFunction){

    const { reviewId, userId, answer } = req.body;
    if (
        isNaN(reviewId) ||
        isNaN(userId) ||
        !answer
      ) {
        res.status(400).json({ error: 'Datos incompletos o incorrectos' });
        return;
      }else{
        const review = await getReviewByIdService(reviewId);
        const user = await getUsuarioByIdService(userId);
        if (!review || !user) {
          res.status(400).json({ error: 'review no encontrado con reviewId' });
          return;
        }
        next();
      }
      
}

/**
 * Validates the deletion of a review.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called in the middleware chain.
 * @return {Promise<void>} Returns nothing.
 */
export async function validateDeleteReview(req: Request, res: Response, next: NextFunction){
  const  reviewId  = parseInt(req.params.id);
  if (
    isNaN(reviewId)
  ){
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  }else{
    const review = await getReviewByIdService(reviewId);
    if (!review) {
      res.status(400).json({ error: 'review no encontrado con reviewId' });
      return;
    }
    next();
  }
}

/**
 * Validates a comment ID before deleting it.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - Nothing is returned from this function.
 */
export async function validateDeleteComment(req: Request, res: Response, next: NextFunction){
  const commentId = parseInt(req.params.id);
  if (
    isNaN(commentId)
  ){
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  }else{
    const comment = await getCommentByIdService(commentId);
    if (!comment) {
      res.status(400).json({ error: 'comment no encontrado con commentId' });
      return;
    }
    next();
  }
}