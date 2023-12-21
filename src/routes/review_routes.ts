import express, { Router } from 'express';
import { likeReview, addReview, answerReview, deleteReview, deleteComment, answerComment } from '../controller/review_controller';
import { validateAddReview, validateAnswerComment, validateAnswerReview, validateDeleteComment, validateDeleteReview, validateLikeReview } from '../validator/review_validator';


const reviewRouter: Router = express.Router();

reviewRouter.post('/like',validateLikeReview, likeReview);

reviewRouter.post('/review', validateAddReview, addReview);
reviewRouter.delete('/review/:id', validateDeleteReview, deleteReview);

reviewRouter.post('/commentReview',validateAnswerReview , answerReview);
reviewRouter.post('/commentComment',validateAnswerComment , answerComment);

reviewRouter.delete('/comment/:id', validateDeleteComment, deleteComment);
export default reviewRouter;