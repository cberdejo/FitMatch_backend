import { NextFunction, Request, Response } from "express";
import { esNumeroValido } from "../utils/funciones_auxiliares_validator";
import { plantillaService } from "../service/plantilla_posts_service";
import { getUsuarioByIdService } from "../service/usuario_service";



/**
 * Validates the request body for creating a saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves to void.
 */
export async function validateCreateRutinaGuardada(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, template_id } = req.body;

    if (!user_id) {
        res.status(400).json({ error: 'El user_id es obligatorio.' });
        return;
    }
    if (!esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El user_id debe ser un número.' });
        return;
    }

    if (!template_id) {
        res.status(400).json({ error: 'El template_id es obligatorio.' });
        return;
    }
    const template = await plantillaService.getById(template_id);
    const user = await getUsuarioByIdService(user_id);

    if (!template || !user) {
        res.status(400).json({ error: 'Plantilla o usuario no encontrado.' });
        return;
    }


    next();
}

export async function validateGetRutinasGuardadas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = parseInt( req.params.userId) 
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        if (!esNumeroValido(userId) ){
            res.status(400).json({ error: 'El usuario proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(page)){
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(pageSize)){
            res.status(400).json({ error: 'El tamaño de página proporcionado no es válido.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al validar la solicitud.' });
    }
}
    

export async function validateCreateRutinaArchivada(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { user_id, template_id } = req.body;

    if (!user_id) {
        res.status(400).json({ error: 'El user_id es obligatorio.' });
        return;
    }
    if (!esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El user_id debe ser un número.' });
        return;
    }

    if (!template_id) {
        res.status(400).json({ error: 'El template_id es obligatorio.' });
        return;
    }
    const template = await plantillaService.getById(template_id);
    const user = await getUsuarioByIdService(user_id);

    if (!template || !user) {
        res.status(400).json({ error: 'Plantilla o usuario no encontrado.' });
        return;
    }


    next();
}

export async function validateGetRutinasArchivadas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = parseInt( req.params.userId) 
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        if (!esNumeroValido(userId) ){
            res.status(400).json({ error: 'El usuario proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(page)){
            res.status(400).json({ error: 'El número de página proporcionado no es válido.' });
            return;
        }
        if (!esNumeroValido(pageSize)){
            res.status(400).json({ error: 'El tamaño de página proporcionado no es válido.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al validar la solicitud.' });
    }
}
