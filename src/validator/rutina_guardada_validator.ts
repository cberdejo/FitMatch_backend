import { NextFunction, Request, Response } from "express";
import { esNumeroValido } from "./funciones_auxiliares";
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
    const template = await plantillaService.getPlantillaById(template_id);
    const user = await getUsuarioByIdService(user_id);

    if (!template || !user) {
        res.status(400).json({ error: 'Plantilla o usuario no encontrado.' });
        return;
    }


    next();
}
