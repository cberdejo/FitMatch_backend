import express, { Router } from 'express';

import { getBloqueos, verLogs } from '../controller/log_controller';
import { validatePermisos } from '../validator/log_validator';

const logsRouter:Router = express.Router();


logsRouter.get('/logs/:id', validatePermisos,  verLogs); //obtiene logs

logsRouter.get('/bloqueos/:id', validatePermisos, getBloqueos); //bloqueos


export default logsRouter;