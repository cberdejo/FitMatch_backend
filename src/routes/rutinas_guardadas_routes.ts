import express, { Router } from 'express';
import { validateCreateRutinaArchivada, validateGetRutinasArchivadas, validateGetRutinasGuardadas } from '../validator/rutina_guardada_validator';
import {  archivarPlantilla, deleteRutinaArchivada, deleteRutinaGuardada, getRutinasArchivadas, getRutinasGuardadas, guardarPlantilla, toggleHiddenPlantilla, toggleHiddenRutinaArchivada, toggleHiddenRutinaGuardada, togglePublico } from '../controller/rutina_guardada_controller';


const router: Router = express.Router();


router.delete('/rutinasGuardadas/:saved_id', deleteRutinaGuardada);
router.get('/rutinasGuardadas/:userId', validateGetRutinasGuardadas, getRutinasGuardadas);


router.delete('/rutinasArchivadas/:saved_id', deleteRutinaArchivada);
router.get('/rutinasArchivadas/:userId', validateGetRutinasArchivadas, getRutinasArchivadas);

router.post('/archivarPlantillaPost',validateCreateRutinaArchivada, archivarPlantilla); 
router.post('/guardarPlantillaPost', validateCreateRutinaArchivada, guardarPlantilla);  


//mismo validador
router.put('/plantillaPostsPublic/:template_id',  togglePublico);
router.put('/plantillaPostHiddenCreada/:template_id', toggleHiddenPlantilla);

//llamarían al mismo validador
router.put('/plantillaPostHiddenGuardada/:template_id/:user_id', toggleHiddenRutinaGuardada);
router.put('/plantillaPostHiddenArchivada/:template_id/:user_id', toggleHiddenRutinaArchivada);

export default router