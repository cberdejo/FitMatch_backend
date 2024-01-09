import express, { Router } from 'express';
import { 
    createPlantillaPost,
    createSesionEntrenamiento,
    deleteSesionEntrenamiento,
    editPlantillaPosts,
    editSesionEntrenamiento,
    getAllPlantillaPosts,
    getAllPlantillaPostsById,
    deletePlantillaPost,
    createEjercicio,
    createRutinaGuardada,
    deleteRutinaGuardada,
    createSesionEntrenamientoEntrada,
    deleteSesionEntrenamientoEntrada,
    editSesionEntrenamientoEntrada
} from '../controller/plantilla_posts_controller';
import { 
    validateGetPlantillaPostsById, 
    validateGetAllPlantillaPosts, 
    validateCreatePlantillaPost, 
    validateCreateSesionEntrenamiento, 
    validateEditSesionEntrenamiento, 
    validateCreateEjercicio, 
    validateCreateRutinaGuardada,
    validateSesionEntrenamientoEntrada,
    validateEditSesionEntrenamientoEntrada} from '../validator/plantilla_posts_validator';
import { upload } from '../config/cloudinary';

const trainer_postsRouter: Router = express.Router();

//Plantilla de entrenamiento
trainer_postsRouter.get('/plantillaPosts/:user_id/', validateGetPlantillaPostsById, getAllPlantillaPostsById);
trainer_postsRouter.get('/plantillaPosts/',validateGetAllPlantillaPosts,  getAllPlantillaPosts);
trainer_postsRouter.post('/plantillaPosts/', upload.single('picture'), validateCreatePlantillaPost, createPlantillaPost);
trainer_postsRouter.put('/plantillaPosts/:template_id',  editPlantillaPosts); //falta validador
trainer_postsRouter.delete('/plantillaPosts/:template_id',  deletePlantillaPost);

//Sesión de entrenamiento
trainer_postsRouter.post('/sesionEntrenamiento/', validateCreateSesionEntrenamiento, createSesionEntrenamiento);
trainer_postsRouter.delete('/sesionEntrenamiento/:session_id', deleteSesionEntrenamiento);
trainer_postsRouter.put('/sesionEntrenamiento/:session_id', validateEditSesionEntrenamiento, editSesionEntrenamiento);

//Ejercicios
trainer_postsRouter.post('/ejercicios/', validateCreateEjercicio, createEjercicio);

//Rutinas guardadas
trainer_postsRouter.post('/rutinasGuardadas/', validateCreateRutinaGuardada, createRutinaGuardada);
trainer_postsRouter.delete('/rutinasGuardadas/:saved_id', deleteRutinaGuardada);

//Sesion de entrenamiento de entrada
trainer_postsRouter.post('/sesionEntrenamientoEntrada/', validateSesionEntrenamientoEntrada, createSesionEntrenamientoEntrada);
trainer_postsRouter.delete('/sesionEntrenamientoEntrada/:entry_id', deleteSesionEntrenamientoEntrada);
trainer_postsRouter.put('/sesionEntrenamientoEntrada/:entry_id', validateEditSesionEntrenamientoEntrada, editSesionEntrenamientoEntrada);


export default trainer_postsRouter;