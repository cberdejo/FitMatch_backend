import express, { Router } from 'express';
import { validateCreateSesionEntrenamiento, validateEditSesionEntrenamiento } from '../validator/sesion_entrenamiento_validator';
import { createSesionEntrenamiento, deleteSesionEntrenamiento, editSesionEntrenamiento, getSesionsEntrenamientoByTemplateId } from '../controller/sesion_entrenamiento_controller';

const router: Router = express.Router();

router.post('/sesionEntrenamiento/', validateCreateSesionEntrenamiento, createSesionEntrenamiento);
router.delete('/sesionEntrenamiento/:session_id', deleteSesionEntrenamiento);
router.put('/sesionEntrenamiento/:session_id', validateEditSesionEntrenamiento, editSesionEntrenamiento);
router.get('/sesionEntrenamiento/:template_id', getSesionsEntrenamientoByTemplateId);
    

export default router