import { NextFunction, Request, Response } from "express";
import { esNumeroValido } from "../utils/funciones_auxiliares_validator";

export async function paramIdValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = parseInt(req.params.id);

    if (!esNumeroValido(id)) {
        res.status(400).json({ error: 'El template_id es obligatorio y debe ser un número válido.' });
        return;
    }


    next();
}