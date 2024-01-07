import { Request, Response } from 'express';
import { getPlantillaPostByIdService, getPlantillaPostService , postPlantillaService, putPlantillaService} from '../service/plantilla_posts_service';
import { postImage } from '../config/cloudinary';

// Función principal para obtener publicaciones de plantillas de entrenamiento
export async function getPlantillaPostsById(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await getPlantillaPostByIdService(userId, page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).json([]);
            return;
        }
        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

/**
 * Retrieves all plantilla posts.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
export async function getAllPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {
       
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await getPlantillaPostService(page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).json([]);
            return;
        }

        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

export async function createPlantillaPost(req: Request, res: Response): Promise<void> {
    try {
        const {template_name, description, etiquetas} = req.body;
        const picture = req.file;

        let cloudinary_picture;
        if (picture) {
            cloudinary_picture = await postImage(picture);
        }

        const data = {
            template_name: template_name,
            description: description,
            picture: cloudinary_picture || null,
            etiquetas: etiquetas
            
        };
        
        const response = await postPlantillaService(data);
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function editPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {
        const plantillaPost = req.body;
        const response = await putPlantillaService(plantillaPost);
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

