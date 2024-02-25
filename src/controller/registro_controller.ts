import { Request, Response } from 'express';
import { registro_service } from '../service/registro_service';
export async function getAllRegistersByUserIdAndExerciseId(req: Request, res: Response) {
    
    try {
        const userId = parseInt(req.params.user_id);
        const exercise_Id = parseInt(req.params.exercise_Id);
        
        const registers = await registro_service.getAllRegistersByUserIdAndExerciseId(userId, exercise_Id);
        return res.status(200).json(registers);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}

export async function getAllRegistersByUserIdAndSessionId(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.user_id);
        const sessionId = parseInt(req.params.session_id);

        const registers = await registro_service.getAllRegistersByUserIdAndSessionId(userId, sessionId);
        return res.status(200).json(registers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
} 

export async function getLastRegisterByUserIdAndSessionId(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.user_id);
        const sessionId = parseInt(req.params.session_id);
        const registers = await registro_service.getLastRegisterByUserIdAndSessionId(userId, sessionId);
        return res.status(200).json(registers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}

export async function getAllRegisterSetFromRegisterSessionId(req: Request, res: Response) {
    try {
        const sessionId = parseInt(req.params.id);
        const registers = await registro_service.getAllRegisterSetFromRegisterSessionId(sessionId);
        return res.status(200).json(registers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}

export async function createRegisterSession(req: Request, res: Response) {
    try {
        const { user_id, session_id } = req.body;
        const register = await registro_service.createRegisterSession(user_id, session_id);
        return res.status(200).json(register);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el registro.' });
    }
}

export async function addRegisterSet(req: Request, res: Response) {
    try {
        const { user_id, register_session_id, set_id, reps, weight, time} = req.body;
        const existingRegisterSet = await registro_service.getRegisterSetByRegisterSessionIdAndSetId(user_id, register_session_id, set_id);
        if (existingRegisterSet) {
            const updatedRegisterSet = await registro_service.updateRegisterSet(existingRegisterSet.register_set_id, reps, weight, time);
            return res.status(200).json(updatedRegisterSet);
        }else {
            const newRegisterSet = await registro_service.createRegisterSet(register_session_id, set_id, reps, weight, time);
            return res.status(200).json(newRegisterSet);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el registro.' });
    }
}