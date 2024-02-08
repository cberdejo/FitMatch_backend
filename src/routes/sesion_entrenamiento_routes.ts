import express, { Router } from 'express';
import { validateCreateSesionEntrenamiento } from '../validator/sesion_entrenamiento_validator';
import { createSesionEntrenamiento, deleteSesionEntrenamiento, editSesionEntrenamiento, getSesionsEntrenamientoBySessionId, getSesionsEntrenamientoByTemplateId } from '../controller/sesion_entrenamiento_controller';


const router: Router = express.Router();

router.post('/sesionEntrenamiento/', validateCreateSesionEntrenamiento, createSesionEntrenamiento);
router.delete('/sesionEntrenamiento/:session_id', deleteSesionEntrenamiento);
router.put('/sesionEntrenamiento/:sessionId', editSesionEntrenamiento);
router.get('/sesionEntrenamientoTemplate/:template_id', getSesionsEntrenamientoByTemplateId);
router.get('/sesionEntrenamiento/:session_id', getSesionsEntrenamientoBySessionId);


export default router