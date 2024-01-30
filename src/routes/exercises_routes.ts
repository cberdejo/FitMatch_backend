import express, { Router } from 'express';
import { getAllExercises, getAllMaterials, getAllMuscleGroups, getAllTypesRegisters, getExercisesByMaterial, getExercisesByMuscleGroup, getMaterialsById, getMuscleGroupsById } from '../controller/exercise_controller';
import { paramIdValidation } from '../validator/shared_validator';


const router: Router = express.Router();

router.get('/ejercicios/', getAllExercises);


router.get('/grupoMuscular', getAllMuscleGroups);
router.get('/grupoMuscular/:id',paramIdValidation,  getMuscleGroupsById);

router.get ('/material', getAllMaterials);
router.get('/material/:id', paramIdValidation, getMaterialsById);

router.get('/tipoRegistro', getAllTypesRegisters);

router.get ('/ejercicios/grupoMuscular/:muscle_group',  getExercisesByMuscleGroup);
router.get('/ejercicios/material/:material', getExercisesByMaterial);



export default router;
