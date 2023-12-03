import express, { Router } from 'express';
import { getTrainerPosts } from '../controller/trainers_posts_controller';

const trainer_postsRouter: Router = express.Router();

trainer_postsRouter.get('/trainersPosts/:user_id', getTrainerPosts);

export default trainer_postsRouter;