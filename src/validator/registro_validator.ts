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
    const exercise_Id = parseInt(req.params.detailed_exercise_Id);
    if (!esNumeroValido(userId)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    } 

    if (!esNumeroValido(exercise_Id)) {
        res.status(400).json({ error: 'El exercise_Id es obligatorio y debe ser un número válido.' });
    }


    next();
}

export async function paramUserIdAndTemplateIdValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = parseInt(req.params.user_id);
    const template_id = parseInt(req.params.template_id);
    if (!esNumeroValido(userId)) {
        res.status(400).json({ error: 'El user_id es obligatorio y debe ser un número válido.' });
        return;
    } 

    if (!esNumeroValido(template_id)) {
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
    const { user_id, register_session_id, set_id } = req.body;

    // Verifica si alguno de los parámetros se proporciona, entonces ambos deben ser proporcionados y válidos
    if ( register_session_id || set_id) {
      

        if (!esNumeroValido(register_session_id) ) {
             console.error('El register_session_id debe ser un número válido y es obligatorio si se proporcionan user_id o set_id.');
            res.status(400).json({ error: 'register_session_id debe ser un número válido y es obligatorio si se proporcionan user_id o set_id.' });
            return;
        }

        if (!esNumeroValido(set_id) ) {
             console.error('El set_id debe ser un número válido y es obligatorio si se proporcionan user_id o register_session_id.');
            res.status(400).json({ error: 'set_id debe ser un número válido y es obligatorio si se proporcionan user_id o register_session_id.' });
            return;
        }

        // Si ambos existen y son válidos, verifica la existencia de los registros asociados
        const existingRegisterSession = await registro_service.getRegisterSessionById(register_session_id);
        if (!existingRegisterSession) {
            console.error('La sesión de registro proporcionada no existe.');
            res.status(400).json({ error: 'La sesión de registro proporcionada no existe.' });
            return;
        }

        const isSetInSession = await sesionEntrenamientoService.isSetIdInTrainingSession(existingRegisterSession.session_id, set_id);
        if (!isSetInSession) {
            console.error('El set_id no pertenece a la sesión de entrenamiento proporcionada.');
            res.status(400).json({ error: 'El set_id no pertenece a la sesión de entrenamiento proporcionada.' });
            return;
        }
    }

    if (!esNumeroValido(user_id)){
        console.error('user_id es obligatorio y debe ser un número válido');
        res.status(400).json({ error: 'user_id es obligatorio y debe ser un número válido'  });
        return;
    } 

    next();
}

