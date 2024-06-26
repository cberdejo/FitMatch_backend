import express, { Router } from 'express';
import { 
    createPlantillaPost,
    editPlantillaPosts,
    getAllPlantillaPosts,
    deletePlantillaPost,
    getPlantillaPostById,
    duplicatePlantillaPost,


} from '../controller/plantilla_posts_controller';
import { 
    validateGetPlantillaPosts, 
    validateCreatePlantillaPost,
    validateEditPlantillaPost, 
    } from '../validator/plantilla_posts_validator';
    
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();



trainer_postsRouter.post('/plantillaPosts/',validateGetPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.get('/plantillaPosts/:template_id',  getPlantillaPostById);

trainer_postsRouter.post('/plantillaPosts/create', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);


trainer_postsRouter.post('/duplicatePlantilla', duplicatePlantillaPost)
trainer_postsRouter.put('/plantillaPosts/:template_id', upload.single('picture'), validateEditPlantillaPost,  editPlantillaPosts); 
trainer_postsRouter.delete('/plantillaPosts/:template_id',  deletePlantillaPost);




export default trainer_postsRouter;