import { registro_service } from "../service/registro_service";
import { sesionEntrenamientoService } from "../service/sesion_entrenamiento_service";
import { esNumeroValido } from "../utils/funciones_auxiliares_validator";
import { Request, Response, NextFunction } from "express";
export async function paramUserIdAndSessionIdValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = parseInt(req.params.user_id);
    const sessionId = parseInt(req.params.session_id);
    if (!esNumeroValido(userId)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    } 

    if (!esNumeroValido(sessionId)) {
        res.status(400).json({ error: 'El session_id es obligatorio y debe ser un número válido.' });
    }


    next();
}

export async function paramUserIdAndExerciseIdValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = parseInt(req.params.user_id);
    const exercise_Id = parseInt(req.params.exercise_Id);
    if (!esNumeroValido(userId)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    } 

    if (!esNumeroValido(exercise_Id)) {
        res.status(400).json({ error: 'El session_id es obligatorio y debe ser un número válido.' });
    }


    next();
}

export async function validateCreateRegistro(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, session_id} = req.body;
    if (!esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    }
     
    if (!esNumeroValido(session_id)) {
        res.status(400).json({ error: 'El session_id es obligatorio y debe ser un número válido.' });
    }
    next();
}
export async function validateAddRegistroSet(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { register_session_id,  set_id, } = req.body;

    if (!esNumeroValido(register_session_id)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    } 
    if (!esNumeroValido(set_id)) {
        res.status(400).json({ error: 'El set_id es obligatorio y debe ser un número válido.' });
        return;
    }

    const existingRegisterSession= await registro_service.getRegisterSessionById(register_session_id);
    if (!existingRegisterSession) {
        res.status(400).json({ error: 'La sesión de registro no existe.' });
        return;
    }
    const isSetInSession: boolean = await sesionEntrenamientoService.isSetIdInTrainingSession( existingRegisterSession.session_id,set_id);


    if (isSetInSession==false) {
        res.status(400).json({ error: 'El set_id no pertenece a la sesión de entrenamiento.' });
        return;
    }

    next();

}

