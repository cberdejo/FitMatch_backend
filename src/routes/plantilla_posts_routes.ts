import express, { Router } from 'express';
import { createPlantillaPost, getAllPlantillaPosts, getPlantillaPostsById } from '../controller/plantilla_posts_controller';
import { validateGetPlantillaPostsById, validateGetAllPlantillaPosts, validateCreatePlantillaPost } from '../validator/plantilla_posts_validator';
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();

trainer_postsRouter.get('/plantillaPosts/:user_id/', validateGetPlantillaPostsById, getPlantillaPostsById);
trainer_postsRouter.get('/plantillaPosts/',validateGetAllPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.post('/plantillaPosts/', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);
export default trainer_postsRouter;