import express, { Router } from 'express';
import { createUsuario, editUsuario, getUsuarioById, getUsuarioByEmail, getUsuarios, verifyUsuarios, decodeToken, verifyEmailToken } from '../controller/usuario_controller';

const usuarioRouter: Router = express.Router();

usuarioRouter.get('/usuarios', getUsuarios);

usuarioRouter.post('/usuarios', createUsuario);
usuarioRouter.post('/email_token',verifyEmailToken);

usuarioRouter.put('/usuarios', editUsuario);

usuarioRouter.get('/usuarios/id/:id', getUsuarioById);
usuarioRouter.get('/usuarios/email/:email', getUsuarioByEmail);

usuarioRouter.post('/verificar', verifyUsuarios);
usuarioRouter.get('/token/:token', decodeToken );


export default usuarioRouter;