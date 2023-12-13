import {Request, Response, NextFunction} from 'express';
import { getClienteByUserIdService, getTrainerByTrainerIdService, getUsuarioByIdService } from '../service/usuario_service';
import { getCommentByIdService, getReviewByIdService } from '../service/review_service';



/**
 * Validates the like request before proceeding to the next middleware.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export async function validateLike (req: Request, res: Response, next: NextFunction) {

    const { reviewId, userId } = req.body;
    if (
        isNaN(reviewId) ||
        isNaN(userId) 
      ) {
        res.status(400).json({ error: 'Datos incompletos o incorrectos' });
        return;
      }else{
        const user = await getUsuarioByIdService(userId);
        if (!user) {
          res.status(400).json({ error: 'Usuario no encontrado con userId' });
          return;
        }
        req.body.user = user;
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
export async function validateReview  (req: Request, res: Response, next: NextFunction){

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

        const cliente = await  getClienteByUserIdService(userId);
        const trainer = await getTrainerByTrainerIdService(trainerId);
        if (!cliente || !trainer) {
          res.status(400).json({ error: 'cliente no encontrado con userId' });
          return;
        }
        req.body.clientId = cliente.client_id;
    
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
export async function validateComment(req: Request, res: Response, next: NextFunction){

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

export async function validateReviewId(req: Request, res: Response, next: NextFunction){
  const { reviewId } = req.body;
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

export async function validateCommentId(req: Request, res: Response, next: NextFunction){
  const { commentId } = req.body;
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