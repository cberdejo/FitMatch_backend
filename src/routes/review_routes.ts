import express, { Router } from 'express';
import { likeReview, addReview, answerReview, deleteReview, deleteComment, likeComment, getReviewsByTemplateId } from '../controller/review_controller';
import { validateAddReview,  validateAnswerReview, validateDeleteComment, validateDeleteReview,  validateLikeComment, validateLikeReview } from '../validator/review_validator';


const reviewRouter: Router = express.Router();


reviewRouter.get('/review/', getReviewsByTemplateId);


reviewRouter.post('/likeReview',validateLikeReview, likeReview);
reviewRouter.post('/likeComment',validateLikeComment, likeComment);

reviewRouter.post('/review', validateAddReview, addReview);
reviewRouter.delete('/review/:id', validateDeleteReview, deleteReview);

reviewRouter.post('/commentReview',validateAnswerReview , answerReview);


reviewRouter.delete('/comment/:id', validateDeleteComment, deleteComment);
export default reviewRouter;