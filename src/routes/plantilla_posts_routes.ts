import express, { Router } from 'express';
import { 
    createPlantillaPost,
    editPlantillaPosts,
    getAllPlantillaPosts,
    getAllPlantillaPostsById,
    deletePlantillaPost,

} from '../controller/plantilla_posts_controller';
import { 
    validateGetPlantillaPostsById, 
    validateGetAllPlantillaPosts, 
    validateCreatePlantillaPost, 
    } from '../validator/plantilla_posts_validator';
    
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();


trainer_postsRouter.get('/plantillaPosts/:user_id/', validateGetPlantillaPostsById, getAllPlantillaPostsById);
trainer_postsRouter.get('/plantillaPosts/',validateGetAllPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.post('/plantillaPosts/', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);
trainer_postsRouter.put('/plantillaPosts/:template_id',  editPlantillaPosts); //falta validador
trainer_postsRouter.delete('/plantillaPosts/:template_id',  deletePlantillaPost);



export default trainer_postsRouter;