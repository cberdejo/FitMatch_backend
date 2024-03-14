import express, { Router } from 'express';
import { paramUserIdAndExerciseIdValidation, paramUserIdAndSessionIdValidation, validateCreateRegistro, validateAddRegistroSet, paramUserIdAndTemplateIdValidation } from '../validator/registro_validator';
import {paramIdValidation} from '../validator/shared_validator'
import { addRegisterSet, createRegisterSession, deleteRegisterSet, getAllRegisterSetFromRegisterSessionId, getAllRegistersByUserIdAndExerciseId, getAllRegistersByUserIdAndSessionId, getLastRegisterByUserIdAndSessionId, getLastRegistersByUserIdAndTemplateId, getSesionesWithRegisterByUserId, getSessionWithRegistersByUserIdAndSessionId, terminarRegistroDeSesion } from '../controller/registro_controller';

const router: Router = express.Router();


//Obtener todos los registros de un ejercicio de un user_id
router.get('/registros/:user_id/:exercise_Id', paramUserIdAndExerciseIdValidation, getAllRegistersByUserIdAndExerciseId);
// obtener todos los registros de una sesión de ejercicios de un user_id ordenados por fecha
router.get('/registrosSession/:user_id/:session_id',paramUserIdAndSessionIdValidation, getAllRegistersByUserIdAndSessionId);
//obtener el anterior  registro de un ejercicio de una sesión 
router.get('/registroSessionAnterior/:user_id/:session_id/',paramUserIdAndSessionIdValidation, getLastRegisterByUserIdAndSessionId);
//obtener los sets de registros de una sessión de registo sin incluir a la sesión
router.get('/registros/:id', paramIdValidation, getAllRegisterSetFromRegisterSessionId);
//obtener los sets de registros de una sessión de registo incluyendo a la sesión
router.get('/sesionRegistros/:user_id/:session_id', paramUserIdAndSessionIdValidation, getSessionWithRegistersByUserIdAndSessionId);
//obtener la última sesión de entrenamiento realizada por un usario dado un template id
router.get('/registrosSessionPlantilla/:user_id/:template_id', paramUserIdAndTemplateIdValidation, getLastRegistersByUserIdAndTemplateId);

//Obtener todos las sesiones de entrenamiento realizadas y sus registros (Con fecha en query)
router.get('/registrosSessionPlantilla/:id', paramIdValidation, getSesionesWithRegisterByUserId);

//crear un registro de sesión para una sesión de entrenamiento
router.post('/registrosSession', validateCreateRegistro, createRegisterSession) 
//crear un registro set
router.post('/registros/', validateAddRegistroSet, addRegisterSet) 

//registro set
router.delete('/registros/:id', paramIdValidation, deleteRegisterSet);

//terminar un registro de sesión
router.put('/registrosSession/:id', paramIdValidation, terminarRegistroDeSesion);


export default router