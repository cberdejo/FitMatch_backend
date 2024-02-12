import express, { Router } from 'express';
import { createExercise, createGroupedDetailedExercises, deleteDetailedExercises, getAllExercises, getAllMaterials, getAllMuscleGroups, getAllTypesRegisters, getExercisesByMaterial, getExercisesByMuscleGroup, getGroupedDetailedExercises, getMaterialsById, getMuscleGroupsById } from '../controller/exercise_controller';
import { paramIdValidation } from '../validator/shared_validator';
import { validateCreateExercises, validateGetExercises } from '../validator/exercise_validator';


const router: Router = express.Router();

router.get('/ejercicios/', validateGetExercises, getAllExercises);


router.get('/grupoMuscular', getAllMuscleGroups);
router.get('/grupoMuscular/:id',paramIdValidation,  getMuscleGroupsById);

router.get ('/material', getAllMaterials);
router.get('/material/:id', paramIdValidation, getMaterialsById);

router.get('/tipoRegistro', getAllTypesRegisters);

router.get ('/ejercicios/grupoMuscular/:muscle_group',  getExercisesByMuscleGroup);
router.get('/ejercicios/material/:material', getExercisesByMaterial);

router.post('/ejercicios',validateCreateExercises, createExercise );

router.get('/ejerciciosDetalladosAgrupados/:session_id', getGroupedDetailedExercises  );
router.post('/ejerciciosDetalladosAgrupados/', createGroupedDetailedExercises  );

router.delete('/ejerciciosDetallados/:id_ejercicio_detallado', deleteDetailedExercises );


export default router;
