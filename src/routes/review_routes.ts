import express, { Router } from 'express';
import { likeReview, addReview, answerReview, deleteReview, deleteComment } from '../controller/review_controller';
import { validateAddReview, validateAnswerReview, validateDeleteComment, validateDeleteReview, validateLikeReview } from '../validator/review_validator';


const reviewRouter: Router = express.Router();

reviewRouter.post('/like',validateLikeReview, likeReview);

reviewRouter.post('/review', validateAddReview, addReview);
reviewRouter.delete('/review', validateDeleteReview, deleteReview);

reviewRouter.post('/comment',validateAnswerReview , answerReview);
reviewRouter.delete('/comment', validateDeleteComment, deleteComment);
export default reviewRouter;