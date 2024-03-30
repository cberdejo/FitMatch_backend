import { Request, Response } from 'express';
import {  exerciseService, groupedDetailedExercisesService, materialService, muscleGroupService, typeRegisterService } from '../service/exercise_service';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import {  ejercicios_detallados_agrupados } from '@prisma/client';
import { usuario_service } from '../service/usuario_service';

export async function getAllExercises(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
        
        //filtros
        const name: string | null = req.query.name ? req.query.name as string : null;
        const idGrupoMuscular: number | null = req.query.idGrupoMuscular ? parseInt(req.query.idGrupoMuscular as string) : null;
        const idMaterial: number | null = req.query.idMaterial ? parseInt(req.query.idMaterial as string) : null;

        //paginacion
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 20;

        //Solo voy a filtrar si tengo userId 
        if (userId && esNumeroValido(userId) && esNumeroValido(page) && esNumeroValido(pageSize)) {
            const exercises = await exerciseService.getAllFiltered(userId, page, pageSize, name, idGrupoMuscular, idMaterial);
            res.status(200).json(exercises);
        }else{
            console.log("ejercicios sin filtros");
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
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 20;


        if (!esNumeroValido(id) && esNumeroValido(page) && esNumeroValido(pageSize)) {
            res.status(400).json({ error: 'El ID debe ser un número' });
        }

        const exercises = await exerciseService.getByMuscleGroup(id,page, pageSize);
        res.status(200).json(exercises);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
}


export async function getExercisesByMaterial(req: Request, res: Response): Promise<void> {
    try{ 
        const id = parseInt(req.params.material);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 20;

        if (!esNumeroValido(id) &&  esNumeroValido(page) && esNumeroValido(pageSize)) {
            res.status(400).json({ error: 'El ID debe ser un número' });
            return;
        }
        const exercises = await exerciseService.getByMaterial(id, page, pageSize);
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        
    }
}

export async function createExercise(req: Request, res: Response): Promise<void> {
    try {
        let userId = req.body.user_id;
        const name = req.body.name;
        const description = req.body.description;
        const muscleGroupId = req.body.muscle_group_id;
        const materialId = req.body.material_id;
        const video = req.body.video;

        const user = await usuario_service.getById(userId);
        if (!user) { 
            res.status(400).json({ error: 'Usuario no encontrado' });
            return;
        }
        if (user.profile_id == 1){
            // se trata de un admin
            userId = null;
        }


        const createdExercise = await exerciseService.create( userId, name, description, muscleGroupId, materialId, video);
        res.status(201).json(createdExercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el ejercicio' });
    }
}

export async function getGroupedDetailedExercises(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.session_id);
        if (!esNumeroValido(id)) {
            res.status(400).json({ error: 'El ID debe ser un número' });
            return;
        }

        const groupedDetailedExercises: ejercicios_detallados_agrupados [] | null= await groupedDetailedExercisesService.getBySessionId(id);
        if (!groupedDetailedExercises) {
            res.status(404).json({ error: 'No se encontraron ejercicios detallados agrupados para la sesión' });
            return;
        }
        res.status(200).json(groupedDetailedExercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios detallados agrupados' });
    }
    
}



export async function createGroupedDetailedExercises(req: Request, res: Response): Promise<void> {
    try {
        const { sessionId, order,  exercises } = req.body; 

        const createdGroupedDetailedExercises = await groupedDetailedExercisesService.create(sessionId,order, exercises);
        
        res.status(201).json(createdGroupedDetailedExercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear ejercicios detallados agrupados' });
    }
}



