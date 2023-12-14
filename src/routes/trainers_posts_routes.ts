import express, { Router } from 'express';
import { getTrainerPosts } from '../controller/trainers_posts_controller';
import { validateGetTrainerPosts } from '../validator/trainer_posts_validator';

const trainer_postsRouter: Router = express.Router();

trainer_postsRouter.get('/trainersPosts/:user_id/', validateGetTrainerPosts, getTrainerPosts);

export default trainer_postsRouter;