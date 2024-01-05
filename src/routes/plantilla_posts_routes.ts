import express, { Router } from 'express';
import { getPlantillaPosts } from '../controller/plantilla_posts_controller';
import { validateGetPlantillaPosts } from '../validator/plantilla_posts_validator';

const trainer_postsRouter: Router = express.Router();

trainer_postsRouter.get('/trainersPosts/:user_id/', validateGetPlantillaPosts, getPlantillaPosts);

export default trainer_postsRouter;