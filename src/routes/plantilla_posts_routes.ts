import express, { Router } from 'express';
import { getAllPlantillaPosts, getPlantillaPostsById } from '../controller/plantilla_posts_controller';
import { validateGetPlantillaPostsById, validateGetAllPlantillaPosts } from '../validator/plantilla_posts_validator';

const trainer_postsRouter: Router = express.Router();

trainer_postsRouter.get('/plantillaPosts/:user_id/', validateGetPlantillaPostsById, getPlantillaPostsById);
trainer_postsRouter.get('/plantillaPosts/',validateGetAllPlantillaPosts,  getAllPlantillaPosts);

export default trainer_postsRouter;