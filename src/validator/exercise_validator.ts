import {Request, Response, NextFunction} from 'express';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';


export async function validateGetExercises(req: Request, res: Response, next: NextFunction) {

    const idGrupoMuscular: number | null = req.query.idGrupoMuscular ? parseInt(req.query.idGrupoMuscular as string) : null;
    const idMaterial: number | null = req.query.idMaterial ? parseInt(req.query.idMaterial as string) : null;

   
    if (idGrupoMuscular && !esNumeroValido(idGrupoMuscular)) {
        res.status(400).json({ error: 'El ID del grupo muscular debe ser un número' });
        return ;
    }

    if (idMaterial && !esNumeroValido(idMaterial)) {
        res.status(400).json({ error: 'El ID del material debe ser un número' });
        return ;
    }

    return next();

}

export async function validateCreateExercises(req: Request, res: Response, next: NextFunction) {
    const userId = req.body;
    const name = req.body;

    const muscleGroupId = req.body;
    const materialId = req.body; 

    if (!esNumeroValido(userId)) {
        res.status(400).json({ error: 'El ID del usuario debe ser un número' });
        return ;
    }
    if (!name) {
        res.status(400).json({ error: 'El nombre del ejercicio no puede estar vacío.' });
        return ;
    }
    if (!esNumeroValido(muscleGroupId)) {
        res.status(400).json({ error: 'El ID del grupo muscular debe ser un número' });
        return ;
    }
    if (!esNumeroValido(materialId)) {
        res.status(400).json({ error: 'El ID del material debe ser un número' });
        return ;
    }

    return next();

}
  