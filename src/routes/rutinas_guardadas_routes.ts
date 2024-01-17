import express, { Router } from 'express';
import { validateCreateRutinaGuardada, validateGetRutinasGuardadas } from '../validator/rutina_guardada_validator';
import { createRutinaGuardada, deleteRutinaGuardada, getRutinasGuardadas } from '../controller/rutina_guardada_controller';


const router: Router = express.Router();

router.post('/rutinasGuardadas/', validateCreateRutinaGuardada, createRutinaGuardada);
router.delete('/rutinasGuardadas/:saved_id', deleteRutinaGuardada);
router.get('/rutinasGuardadas/:userId', validateGetRutinasGuardadas, getRutinasGuardadas);


export default router