import express, { Router } from 'express';
import { likeReview, addReview, answerReview, deleteReview, deleteComment } from '../controller/review_controller';
import { validateComment, validateCommentId, validateLike, validateReview, validateReviewId } from '../validator/review_validator';


const reviewRouter: Router = express.Router();

reviewRouter.post('/like',validateLike, likeReview);

reviewRouter.post('/review', validateReview, addReview);
reviewRouter.delete('/review', validateReviewId, deleteReview);

reviewRouter.post('/comment',validateComment , answerReview);
reviewRouter.delete('/comment', validateCommentId, deleteComment);
export default reviewRouter;