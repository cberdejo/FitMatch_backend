import express, { Router } from 'express';
import { 
    createUsuario,
    editUsuario,
    getUsuarioById,
    getUsuarioByEmail,
    getUsuarios,
    verifyUsuarios,
    decodeToken,
    getUsuarioToken,
    checkOtp,
    sendOtp,
    toggleBanUser,
     } from '../controller/usuario_controller';
import { upload } from '../config/cloudinary';
import { validateCreateUsuario, validateGetUsuarioByEmail,  validateVerifyUsuarios } from '../validator/usuario_validators';
import { paramIdValidation } from '../validator/shared_validator';
import { validatePermisos } from '../validator/log_validator';

const usuarioRouter: Router = express.Router();

usuarioRouter.get('/usuarios/:id', validatePermisos,  getUsuarios);
usuarioRouter.put('/usuarios/ban/:id/:ban_id', validatePermisos,  toggleBanUser);
usuarioRouter.get('/usuarioToken/:id', paramIdValidation, getUsuarioToken);
usuarioRouter.post('/usuarios', upload.single('profile_picture'), validateCreateUsuario, createUsuario);
usuarioRouter.put('/usuarios/:id', upload.single('profile_picture'), paramIdValidation, editUsuario);


usuarioRouter.get('/usuarios/id/:id', paramIdValidation, getUsuarioById);
usuarioRouter.get('/usuarios/email/:email', validateGetUsuarioByEmail,  getUsuarioByEmail);


usuarioRouter.post('/verificar', validateVerifyUsuarios, verifyUsuarios);
usuarioRouter.get('/token/:token', decodeToken );

usuarioRouter.post('/otp/check', checkOtp );
usuarioRouter.post('/otp/send', sendOtp );

export default usuarioRouter;