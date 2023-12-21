import express, { Router } from 'express';
import { createUsuario, editUsuario, getUsuarioById, getUsuarioByEmail, getUsuarios, verifyUsuarios, decodeToken, getUserameByClienteId } from '../controller/usuario_controller';
import { upload } from '../config/cloudinary';
import { validateCreateUsuario, validateGetUsuarioByEmail, validateGetUsuarioById, validateVerifyUsuarios } from '../validator/usuario_validators';

const usuarioRouter: Router = express.Router();

usuarioRouter.get('/usuarios',  getUsuarios);
usuarioRouter.post('/usuarios', upload.single('profile_picture'), validateCreateUsuario, createUsuario);
usuarioRouter.put('/usuarios', editUsuario);

usuarioRouter.get('/username/cliente/:clienteId', validateGetUsuarioById ,getUserameByClienteId);


usuarioRouter.get('/usuarios/id/:id', validateGetUsuarioById, getUsuarioById);
usuarioRouter.get('/usuarios/email/:email', validateGetUsuarioByEmail,  getUsuarioByEmail);

usuarioRouter.post('/verificar', validateVerifyUsuarios, verifyUsuarios);
usuarioRouter.get('/token/:token', decodeToken );


export default usuarioRouter;