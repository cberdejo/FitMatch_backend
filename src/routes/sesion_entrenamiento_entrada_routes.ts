import express, { Router } from 'express';
import { validateEditSesionEntrenamientoEntrada, validateSesionEntrenamientoEntrada } from '../validator/sesion_entrenamiento_entrada_validator';
import { createSesionEntrenamientoEntrada, deleteSesionEntrenamientoEntrada, editSesionEntrenamientoEntrada } from '../controller/sesion_entrenamiento_entrada_controller';

const router: Router = express.Router();

router.post('/sesionEntrenamientoEntrada/', validateSesionEntrenamientoEntrada, createSesionEntrenamientoEntrada);
router.delete('/sesionEntrenamientoEntrada/:entry_id', deleteSesionEntrenamientoEntrada);
router.put('/sesionEntrenamientoEntrada/:entry_id', validateEditSesionEntrenamientoEntrada, editSesionEntrenamientoEntrada);



export default router