import {Request, Response, NextFunction} from 'express';
import { plantillaService } from '../service/plantilla_posts_service';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import { commentService, reviewService } from '../service/review_service';




/**
 * Validates the like request before proceeding to the next middleware.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export async function validateLikeReview(req: Request, res: Response, next: NextFunction) {
  const { reviewId, userId } = req.body;
  
  if (!esNumeroValido(reviewId) || !esNumeroValido(userId)) {
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  } 
  const review = await reviewService.getById(reviewId);
  if (!review) {
    res.status(400).json({ error: 'review no encontrado con reviewId' });
    return;
  }

  return next();
  
}

/**
 * Validates the like comment request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call.
 * @return {Promise<void>} - This function does not return a value.
 */
export async function validateLikeComment(req: Request, res: Response, next: NextFunction) {
  const { commentId, userId } = req.body;
  if (!esNumeroValido(commentId) || !esNumeroValido(userId)) {
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  } 

  const comment = await commentService.getById(commentId);

  if (!comment) {
    res.status(400).json({ error: 'comment no encontrado con commentId' });
    return;
  }
  

  return next();
  
}


/**
 * Validates the review data received in the request body. 
 * Checks if the userId,  rating, and reviewContent are valid.
 * If any of the data is invalid, it sends a 400 error response with an error message.
 * Otherwise, it calls the next middleware function.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {void} 
 */
export async function validateAddReview  (req: Request, res: Response, next: NextFunction){

    const { templateId, userId, rating, reviewContent } = req.body;
    if (!esNumeroValido(templateId) ){
        res.status(400).json({ error: 'templateId no valido' });
        return;
    }
    if (!esNumeroValido(userId) ){
        res.status(400).json({ error: 'userId no valido' });
        return;
    }
    if (
        !esNumeroValido(rating) ||
        rating < 0 ||
        rating > 5   
      ) {
        res.status(400).json({ error: 'Review incorrecta' });
        return;
      }
      if (!reviewContent){
        res.status(400).json({ error: 'reviewContent no valido' });
        return;
      }

   
      const plantilla = await plantillaService.getById(templateId);
      

      if ( !plantilla) {
        res.status(400).json({ error: 'plantilla no encontrado con userId' });
        return;
      }
      
      next();
          
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

  const { userId, reviewId,  answer } = req.body;
    if (
      !esNumeroValido(reviewId) ||
      !esNumeroValido(userId) ||
        !answer
      ) {
        res.status(400).json({ error: 'Datos incompletos o incorrectos' });
        return;
      }else{
        const review = await reviewService.getById(reviewId);
      
        if (!review  ) {
          res.status(400).json({ error: 'review no encontrado ' });
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
    !esNumeroValido(reviewId)
  ){
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  }else{
    const review = await reviewService.getById(reviewId);
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
    !esNumeroValido(commentId)
  ){
    res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    return;
  }else{
    const comment = await commentService.getById(commentId);
    if (!comment) {
      res.status(400).json({ error: 'comment no encontrado con commentId' });
      return;
    }
    next();
  }
}

