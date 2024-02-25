import express, { Router } from 'express';
import { paramUserIdAndExerciseIdValidation, paramUserIdAndSessionIdValidation, validateCreateRegistro, validateAddRegistroSet } from '../validator/registro_validator';
import {paramIdValidation} from '../validator/shared_validator'
import { addRegisterSet, createRegisterSession, getAllRegisterSetFromRegisterSessionId, getAllRegistersByUserIdAndExerciseId, getAllRegistersByUserIdAndSessionId, getLastRegisterByUserIdAndSessionId } from '../controller/registro_controller';

const router: Router = express.Router();


//Obtener todos los registros de un ejercicio de un user_id
router.get('/registros/:user_id/:exercise_Id', paramUserIdAndExerciseIdValidation, getAllRegistersByUserIdAndExerciseId);
// obtener todos los registros de una sesión de ejercicios de un user_id ordenados por fecha
router.get('/registrosSession/:user_id/:session_id',paramUserIdAndSessionIdValidation, getAllRegistersByUserIdAndSessionId);
//obtener el anterior los registros de un ejercicio de una sesión
router.get('/registroSessionAnterior/:user_id/:session_id/',paramUserIdAndSessionIdValidation, getLastRegisterByUserIdAndSessionId);
//obtener los sets de registros de una sessión de registo
router.get('/registros/:id', paramIdValidation, getAllRegisterSetFromRegisterSessionId);

//crear un registro de sesión para una sesión de entrenamiento
router.post('/registrosSession', validateCreateRegistro, createRegisterSession) 
//crear un registro set
router.post('/registros/', validateAddRegistroSet, addRegisterSet) 
export default router