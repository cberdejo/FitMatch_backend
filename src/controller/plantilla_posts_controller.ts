import { Request, Response } from 'express';

import { deleteImageFromCloudinary, postImage } from '../config/cloudinary';
import { plantillaService } from '../service/plantilla_posts_service';
import { rutinaGuardadaService } from '../service/rutinas_guardadas_service';





/**
 * Retrieves all plantilla posts by user ID.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */
export async function getAllPlantillaPostsById(req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts = await plantillaService.getPlantillaPosts(userId, page, pageSize);
       
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

        const plantillaPosts = await plantillaService.getPlantillaPosts(null, page, pageSize);
       
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
 * Creates a new plantilla post.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function createPlantillaPost(req: Request, res: Response): Promise<void> {
    try {
        const {template_name, description, etiquetas, user_id} = req.body;
        const picture = req.file;

        let cloudinary_picture;
        if (picture) {
            cloudinary_picture = await postImage(picture);
        }

        const data = {
            template_name: template_name,
            description: description,
            picture: cloudinary_picture || null,
            etiquetas: etiquetas,
            user_id: parseInt(user_id)
            
        };

        
        const response = await plantillaService.postPlantilla(data);
        await rutinaGuardadaService.create({user_id: parseInt(user_id), template_id: response.template_id});
        res.status(201).json(response);
    } catch (error) {

        console.error(error);
       
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

/**
 * Edit the plantilla posts.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function editPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        const templateData = req.body; 

        const updatedSession = await plantillaService.update(template_id, templateData);
        res.json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la sesión de entrenamiento.' });
    }
}

/**
 * Deletes a plantilla post.
 *
 * @param {Request} req - the request object.
 * @param {Response} res - the response object.
 * @return {Promise<void>} Promise that resolves when the plantilla post is deleted.
 */
export async function deletePlantillaPost(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);
        const deletedSession = await plantillaService.delete(template_id);
        if (deletedSession.picture){
           await deleteImageFromCloudinary(deletedSession.picture);
        }
       
        res.status(200).json({ message: 'Plantilla eliminada con él.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la plantilla.' });
    }
}












