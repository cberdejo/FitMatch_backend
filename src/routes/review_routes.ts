import express, { Router } from 'express';
import { likeReview } from '../controller/review_controller';

const reviewRouter: Router = express.Router();

reviewRouter.post('/like', likeReview);

export default reviewRouter;