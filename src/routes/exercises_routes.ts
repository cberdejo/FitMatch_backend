import express, { Router } from 'express';
import { getAllExercises, getAllMaterials, getAllMuscleGroups, getAllTypesRegisters, getExercisesByMaterial, getExercisesByMuscleGroup, getMaterialsById, getMuscleGroupsById } from '../controller/exercise_controller';
import { paramIdValidation } from '../validator/shared_validator';


const router: Router = express.Router();

router.get('/ejercicios/', getAllExercises);


router.get('/grupo_muscular', getAllMuscleGroups);
router.get('/grupo_muscular/:id',paramIdValidation,  getMuscleGroupsById);

router.get ('/material', getAllMaterials);
router.get('/material/:id', paramIdValidation, getMaterialsById);

router.get('/tipo_registro', getAllTypesRegisters);

router.get ('/ejercicios/:muscle_group',  getExercisesByMuscleGroup);
router.get('/ejercicios/:material', getExercisesByMaterial);



export default router;
