import { Request, Response } from 'express';
import { exerciseService, materialService, muscleGroupService, typeRegisterService } from '../service/exercise_service';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';

export async function getAllExercises(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
        if (userId && esNumeroValido(userId)) {
            const exercises = await exerciseService.getAllByUserId(userId);
            res.status(200).json(exercises);
        }else{
            const exercises = await exerciseService.getAll();
            res.status(200).json(exercises);
        }
   
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
}

export async function getAllMuscleGroups(_req: Request, res: Response): Promise<void> {
    try {
        const muscleGroups = await muscleGroupService.getAll();
        res.status(200).json(muscleGroups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los grupos musculares' });
    }
}

export async function getMuscleGroupsById(req: Request, res: Response): Promise<void> {
    try{
        const id = parseInt(req.params.id);
 
        const muscleGroup = await muscleGroupService.getById(id);
        res.status(200).json(muscleGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el grupo musculares' });
    }
}

export async function getAllMaterials(_req: Request, res: Response): Promise<void> {
    try {
        const materials = await materialService.getAll();
        res.status(200).json(materials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los materiales' });
    }
}

export async function getMaterialsById(req: Request, res: Response): Promise<void> {
    try{
        const id = parseInt(req.params.id);
        const material = await materialService.getById(id);
        res.status(200).json(material);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el material' });
    }
}

export async function getAllTypesRegisters(_req: Request, res: Response): Promise<void> {
    try {
        const typeRegisters = await typeRegisterService.getAll();
        res.status(200).json(typeRegisters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los tipos de registros' });
    }
}

export async function getExercisesByMuscleGroup(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.muscle_group);
        if (!esNumeroValido(id)) {
            res.status(400).json({ error: 'El ID debe ser un número' });
        }

        const exercises = await exerciseService.getByMuscleGroup(id);
        res.status(200).json(exercises);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
}


export async function getExercisesByMaterial(req: Request, res: Response): Promise<void> {
    try{ 
        const id = parseInt(req.params.material);
        if (!esNumeroValido(id)) {
            res.status(400).json({ error: 'El ID debe ser un número' });
        }
        const exercises = await exerciseService.getByMaterial(id);
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        
    }
}