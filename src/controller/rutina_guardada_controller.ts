import { Request, Response } from 'express';
import { rutinaArchivadaService, rutinaGuardadaService } from '../service/rutinas_guardadas_service';
import { PlantillaDeEntrenamientoConPromedio } from '../interfaces/posts';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import { plantillaService } from '../service/plantilla_posts_service';


/**
 * Retrieves the saved routines for a specific user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves with the saved routines.
 */
export async function getRutinasGuardadas(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId );
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const rutinas: PlantillaDeEntrenamientoConPromedio[] = await rutinaGuardadaService.getGuardadasPlantillaPosts(userId,page, pageSize);
        res.status(200).json(rutinas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las rutinas guardadas.' });
    }
    
}


/**
 * Deletes a saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A Promise that resolves when the routine is deleted.
 */
export async function deleteRutinaGuardada(req: Request, res: Response): Promise<void> {
    try {
        const { saved_id } = req.params;
        await rutinaGuardadaService.delete(parseInt(saved_id));
        res.status(200).json({ message: 'Rutina eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la rutina.' });
    }
}

export async function archivarPlantilla(req: Request, res: Response): Promise<void> {
    try {
        const {template_id, user_id} = req.body;
        const plantilla = await rutinaArchivadaService.archivarPlantilla(template_id, user_id);
        res.status(200).json(plantilla);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function guardarPlantilla(req: Request, res: Response): Promise<void> {
    try{
        const {template_id, user_id} = req.body;
        const plantilla = await rutinaGuardadaService.guardarPlantilla(template_id, user_id);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }

}

export async function togglePublico(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        

        if (!esNumeroValido(template_id)) {
            res.status(400).json({ error: 'El identificador de la plantilla no es válido.' });
            return;
        }
        const plantilla = await plantillaService.togglePublic(template_id);
        res.status(200).json(plantilla);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function toggleHiddenPlantilla(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        
        if (!esNumeroValido(template_id)) {
            res.status(400).json({ error: 'El identificador de la plantilla no es válido.' });
            return;
        }
      
        const plantilla = await plantillaService.toggleHiddenCreada(template_id);
        
        res.status(200).json(plantilla);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function toggleHiddenRutinaGuardada(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        const user_id = parseInt(req.params.user_id);
        
        const plantilla = await rutinaGuardadaService.toggleHiddenRutinaGuardada(template_id, user_id);
        res.status(200).json(plantilla);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function toggleHiddenRutinaArchivada(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        const user_id = parseInt(req.params.user_id);
        
        const plantilla = await rutinaGuardadaService.toggleHiddenRutinaArchivada(template_id, user_id);
        res.status(200).json(plantilla);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}




/**
 * Retrieves the saved routines for a specific user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves with the saved routines.
 */
export async function getRutinasArchivadas(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId );
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const rutinas: PlantillaDeEntrenamientoConPromedio[] = await rutinaArchivadaService.getArchivadasPlantillaPosts(userId,page, pageSize);
        res.status(200).json(rutinas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las rutinas guardadas.' });
    }
    
}


/**
 * Deletes a saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A Promise that resolves when the routine is deleted.
 */
export async function deleteRutinaArchivada(req: Request, res: Response): Promise<void> {
    try {
        const { archived_id } = req.params;
        await rutinaArchivadaService.delete(parseInt(archived_id));
        res.status(200).json({ message: 'Rutina eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la rutina.' });
    }
}
