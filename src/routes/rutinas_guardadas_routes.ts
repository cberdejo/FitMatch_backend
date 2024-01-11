import express, { Router } from 'express';
import { validateCreateRutinaGuardada } from '../validator/rutina_guardada_validator';
import { createRutinaGuardada, deleteRutinaGuardada, getRutinasGuardadas } from '../controller/rutina_guardada_controller';
import { validateGetPlantillaPostsById } from '../validator/plantilla_posts_validator';

const router: Router = express.Router();

router.post('/rutinasGuardadas/', validateCreateRutinaGuardada, createRutinaGuardada);
router.delete('/rutinasGuardadas/:saved_id', deleteRutinaGuardada);
router.get('/rutinasGuardadas/:user_id', validateGetPlantillaPostsById, getRutinasGuardadas);


export default router