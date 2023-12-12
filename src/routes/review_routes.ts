import express, { Router } from 'express';
import { likeReview, addReview } from '../controller/review_controller';

const reviewRouter: Router = express.Router();

reviewRouter.post('/like', likeReview);
reviewRouter.post('/review', addReview);

export default reviewRouter;