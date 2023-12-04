import express, { Router } from 'express';
import { createUsuario, editUsuario, getUsuarioById, getUsuarioByEmail, getUsuarios, verifyUsuarios, decodeToken, getUserameByClienteId } from '../controller/usuario_controller';

const usuarioRouter: Router = express.Router();

usuarioRouter.get('/usuarios', getUsuarios);
usuarioRouter.post('/usuarios', createUsuario);
usuarioRouter.put('/usuarios', editUsuario);

usuarioRouter.get('/username/cliente/:clienteId', getUserameByClienteId);


usuarioRouter.get('/usuarios/id/:id', getUsuarioById);
usuarioRouter.get('/usuarios/email/:email', getUsuarioByEmail);

usuarioRouter.post('/verificar', verifyUsuarios);
usuarioRouter.get('/token/:token', decodeToken );


export default usuarioRouter;