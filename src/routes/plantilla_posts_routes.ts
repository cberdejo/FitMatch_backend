import express, { Router } from 'express';
import { 
    createPlantillaPost,
    editPlantillaPosts,
    getAllPlantillaPosts,
    deletePlantillaPost,

} from '../controller/plantilla_posts_controller';
import { 
    validateGetPlantillaPosts, 
    validateCreatePlantillaPost, 
    } from '../validator/plantilla_posts_validator';
    
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();



trainer_postsRouter.get('/plantillaPosts/',validateGetPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.post('/plantillaPosts/', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);
trainer_postsRouter.put('/plantillaPosts/:template_id',  editPlantillaPosts); //falta validador
trainer_postsRouter.delete('/plantillaPosts/:template_id',  deletePlantillaPost);



export default trainer_postsRouter;