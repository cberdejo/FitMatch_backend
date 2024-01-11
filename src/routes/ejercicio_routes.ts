import express, { Router } from 'express';
import { validateCreateEjercicio, validateEjercicioMetrics } from '../validator/ejercicio_validator';
import { createEjercicio, getEjerciciosMetrics } from '../controller/ejercicio.controller';


const router: Router = express.Router();

router.post('/ejercicios/', validateCreateEjercicio, createEjercicio);
router.get('/ejercicios/', validateEjercicioMetrics, getEjerciciosMetrics); //Repasar y terminar

export default router