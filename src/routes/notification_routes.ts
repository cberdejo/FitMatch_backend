import express, { Router } from 'express';
import { paramIdValidation } from '../validator/shared_validator';
import { obtenerNotificacionesPorUsuario, readNotification } from '../controller/notification_controller';
const router: Router = express.Router();

router.get('/notificacion/:id', paramIdValidation, obtenerNotificacionesPorUsuario);
router.put('/notificacion/:id', paramIdValidation, readNotification);

export default router