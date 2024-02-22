import express, { Router } from 'express';
import { 
    createPlantillaPost,
    editPlantillaPosts,
    getAllPlantillaPosts,
    deletePlantillaPost,
    getPlantillaPostById,
    toggleHiddenPlantilla,
    togglePublico,
    archivarPlantilla,
    guardarPlantilla,
    toggleHiddenRutinaGuardada,
    toggleHiddenRutinaArchivada,

} from '../controller/plantilla_posts_controller';
import { 
    validateGetPlantillaPosts, 
    validateCreatePlantillaPost,
    validateEditPlantillaPost, 
    } from '../validator/plantilla_posts_validator';
    
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();



trainer_postsRouter.get('/plantillaPosts/',validateGetPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.get('/plantillaPosts/:template_id',  getPlantillaPostById);

trainer_postsRouter.post('/plantillaPosts/', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);

trainer_postsRouter.post('/archivarPlantillaPost', archivarPlantilla); //validador
trainer_postsRouter.post('/guardarPlantillaPost', guardarPlantilla);  //validador

trainer_postsRouter.put('/plantillaPosts/:template_id', upload.single('picture'), validateEditPlantillaPost,  editPlantillaPosts); 
trainer_postsRouter.delete('/plantillaPosts/:template_id',  deletePlantillaPost);

//mismo validador
trainer_postsRouter.put('/plantillaPostsPublic/:template_id',  togglePublico);
trainer_postsRouter.put('/plantillaPostHiddenCreada/:template_id', toggleHiddenPlantilla);

//llamarían al mismo validador
trainer_postsRouter.put('/plantillaPostHiddenGuardada/:template_id/:user_id', toggleHiddenRutinaGuardada);
trainer_postsRouter.put('/plantillaPostHiddenArchivada/:template_id/:user_id', toggleHiddenRutinaArchivada);


export default trainer_postsRouter;