import { Request, Response } from 'express';
import { ejercicioService } from '../service/ejercicio_service';


/**
 * Creates a new ejercicio.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the ejercicio is created.
 */
export async function createEjercicio(req: Request, res: Response): Promise<void> {
    try {
        const { name, description } = req.body;
        const nuevoEjercicio = await ejercicioService.create({ name, description });
        res.status(201).json(nuevoEjercicio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el ejercicio.' });
    }
}

// En tu archivo de controladores (por ejemplo, ejerciciosController.js)
export async function getEjerciciosMetrics(req: Request, res: Response) {
    try {
        const { user_id, exercise_id, fecha_inicio, fecha_final } = req.query;

        console.log(user_id, exercise_id, fecha_inicio, fecha_final);
        const ejercicios = await ejercicioService.getEjerciciosMetrics(0,0, new Date(), new Date());
        res.json(ejercicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios.' });
    }
}