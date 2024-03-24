import { Request, Response } from 'express';
import { registro_service } from '../service/registro_service';
import { usuario_service } from '../service/usuario_service';
import { isValid, parseISO } from 'date-fns';
export async function getAllRegistersByUserIdAndExerciseId(req: Request, res: Response) {
    
    try {
        const userId = parseInt(req.params.user_id);
        const detailed_exercise_Id = parseInt(req.params.detailed_exercise_Id);
        
        const registers = await registro_service.getAllRegistersByUserIdAndExerciseId(userId, detailed_exercise_Id);

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
export async function getSesionesWithRegisterByUserId(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.id);
        const fechaString: string | undefined = req.query.date? req.query.date as string: undefined;
        let fecha: Date | undefined;
        if (fechaString) {
            const parsedDate = parseISO(fechaString); // Parsea la fecha usando date-fns
            if (isValid(parsedDate)) { // Verifica si la fecha es válida
                fecha = parsedDate;
            } else {
                return res.status(400).json({ error: 'Formato de fecha inválido. Por favor, use YYYY-MM-DD.' });
            }
        }
        const sesiones = await registro_service.getSesionesWithRegisterByUserId(userId, fecha);

        if (!sesiones || sesiones.length === 0) {
            return res.status(204).json({ message: 'No existen sesiones para el usuario con id ' + userId });
        }
        return res.status(200).json(sesiones);

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
      const {
        create,
        user_id,
        register_session_id,
        register_set_id,
        set_id,
        reps,
        weight,
        time,
      } = req.body;
  
      const canUpdate = register_set_id !== undefined && (reps !== null || weight !== null || time !== null);
      const canCreate = create !== undefined && create === true;
  
      const existingRegisterSet = await registro_service.getRegisterSetByRegisterSessionIdAndSetId(user_id!, register_session_id!, set_id!);
      const weightSystem = await usuario_service.getWeightSystemByUserId(user_id!);
      if (existingRegisterSet && canUpdate) {
          const updatedWeight = weightSystem === 'imperial' ? weight / 2.20462 : weight;
        const updatedRegisterSet = await registro_service.updateRegisterSet(register_set_id!, reps, updatedWeight, time);
        return res.status(200).json(updatedRegisterSet);
      } else if (!existingRegisterSet || canCreate) {

        const newWeight = weightSystem === 'imperial' ? weight / 2.20462 : weight; 
       
        const newRegisterSet = await registro_service.createRegisterSet(register_session_id!, set_id!, 
            reps==0 ? undefined : reps,
            newWeight==0 ? undefined : newWeight,
            time ==0 ? undefined : time);
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

export async function deleteRegisterSet (req: Request, res: Response) {
    try {
        const registerSetId = parseInt(req.params.id);
        const deletedRegisterSet = await registro_service.deleteRegisterSet(registerSetId);
        return res.status(200).json(deletedRegisterSet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}

export async function deleteRegisterSession (req: Request, res: Response) {
    try {
        const registerSessionId = parseInt(req.params.id);
        const deletedRegisterSession = await registro_service.deleteRegisterSession(registerSessionId);
        return res.status(200).json(deletedRegisterSession);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los registros.' });
    }
}