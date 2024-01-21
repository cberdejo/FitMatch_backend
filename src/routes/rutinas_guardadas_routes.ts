import express, { Router } from 'express';
import { validateCreateRutinaArchivada, validateCreateRutinaGuardada, validateGetRutinasArchivadas, validateGetRutinasGuardadas } from '../validator/rutina_guardada_validator';
import { createRutinaArchivada, createRutinaGuardada, deleteRutinaArchivada, deleteRutinaGuardada, getRutinasArchivadas, getRutinasGuardadas } from '../controller/rutina_guardada_controller';


const router: Router = express.Router();

router.post('/rutinasGuardadas/', validateCreateRutinaGuardada, createRutinaGuardada);
router.delete('/rutinasGuardadas/:saved_id', deleteRutinaGuardada);
router.get('/rutinasGuardadas/:userId', validateGetRutinasGuardadas, getRutinasGuardadas);

router.post('/rutinasArchivadas/', validateCreateRutinaArchivada, createRutinaArchivada);
router.delete('/rutinasArchivadas/:saved_id', deleteRutinaArchivada);
router.get('/rutinasArchivadas/:userId', validateGetRutinasArchivadas, getRutinasArchivadas);

export default router