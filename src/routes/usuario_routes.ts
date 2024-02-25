import express, { Router } from 'express';
import { 
    createUsuario,
    editUsuario,
    getUsuarioById,
    getUsuarioByEmail,
    getUsuarios,
    verifyUsuarios,
    decodeToken,
     } from '../controller/usuario_controller';
import { upload } from '../config/cloudinary';
import { validateCreateUsuario, validateGetUsuarioByEmail,  validateVerifyUsuarios } from '../validator/usuario_validators';
import { paramIdValidation } from '../validator/shared_validator';

const usuarioRouter: Router = express.Router();

usuarioRouter.get('/usuarios',  getUsuarios);
usuarioRouter.post('/usuarios', upload.single('profile_picture'), validateCreateUsuario, createUsuario);
usuarioRouter.put('/usuarios', editUsuario);


usuarioRouter.get('/usuarios/id/:id', paramIdValidation, getUsuarioById);
usuarioRouter.get('/usuarios/email/:email', validateGetUsuarioByEmail,  getUsuarioByEmail);

usuarioRouter.post('/verificar', validateVerifyUsuarios, verifyUsuarios);
usuarioRouter.get('/token/:token', decodeToken );


export default usuarioRouter;