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

export async function getSessionWithRegistersByUserIdAndSessionId(req: Request, res: Response) {
    try {
        const sessionId = parseInt(req.params.session_id);
        const userId = parseInt(req.params.user_id);

        const session = await registro_service.getSessionWithRegistersByUserIdAndSessionId(userId,sessionId);
        // console.log(JSON.stringify(session, null, 2));
        return res.status(200).json(session);
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
        const { create, user_id, register_session_id, register_set_id, set_id, reps, weight, time } = req.body;
        
        const canUpdate:boolean = register_set_id && (reps !== null || weight !== null || time !== null);
        const canCreate:boolean = create && create == true;
        const existingRegisterSet = await registro_service.getRegisterSetByRegisterSessionIdAndSetId(user_id, register_session_id, set_id);

        if (existingRegisterSet && canUpdate) {
            const updatedRegisterSet = await registro_service.updateRegisterSet(register_set_id, reps, weight, time);
            return res.status(200).json(updatedRegisterSet);
        } else if (!existingRegisterSet || canCreate) {
            const newRegisterSet = await registro_service.createRegisterSet(register_session_id, set_id, reps, weight, time);
            return res.status(200).json(newRegisterSet);
        } else {
            return res.status(400).json({ error: 'No se proporcionaron datos válidos para actualizar el registro.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear o actualizar el registro.' });
    }
}

export async function getLastRegistersByUserIdAndTemplateId (req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.user_id);
        const template_id = parseInt(req.params.template_id);
        const registers = await registro_service.getLastRegistersByUserIdAndTemplateId(userId, template_id);
        if (!registers) {
            return res.status(204).json({ error: 'No existen sesiones para la plantilla del id ' + template_id });
        }
        return res.status(200).json(registers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}

export async function terminarRegistroDeSesion (req:Request, res: Response){
    try {
        const register_id = parseInt(req.params.id);
        const register = await registro_service.terminarRegistroDeSesion(register_id);
        return res.status(200).json(register);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}