import { Request, Response } from 'express';
import { deleteImageFromCloudinary, postImage } from '../config/cloudinary';
import { plantillaService } from '../service/plantilla_posts_service';
import { rutinaGuardadaService } from '../service/rutinas_guardadas_service';
import { getPublicIdFromUrl } from '../utils/funciones_auxiliares_controller';
import { PlantillaDeEntrenamientoConPromedio } from '../interfaces/posts';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';



/**
 * Retrieves all plantilla posts.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
export async function getAllPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {

        
        const userId: number | null = req.query.userId ? parseInt(req.query.userId as string) : null;
        const isPublic: boolean = req.query.isPublic !== 'false';
        const isHidden: boolean = req.query.isHidden === 'true';
       

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const plantillaPosts: PlantillaDeEntrenamientoConPromedio[] = await plantillaService.getPlantillaPosts( userId, isPublic, isHidden, page, pageSize);
       
        if (!plantillaPosts || plantillaPosts.length === 0) {
            res.status(204).send();
            return;
        }
      
        res.status(200).json(plantillaPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

export async function getPlantillaPostById(req: Request, res: Response): Promise<void> {
    try {
        const template_id = parseInt(req.params.template_id);

        if (!esNumeroValido(template_id)) {
            res.status(400).json({ error: 'El identificador de la plantilla no es válido.' });
            return;
        }

        const plantilla: PlantillaDeEntrenamientoConPromedio | null = await plantillaService.getById(template_id);
      
        if (!plantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada.' });
            return;
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });

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
        const { template_name, description, etiquetas, user_id} = req.body;
        const picture = req.file;

        // Obtener la plantilla existente para acceder a la imagen actual
        const existingPlantilla = await plantillaService.getById(template_id);
        if (!existingPlantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada.' });
            return;
        }

        let cloudinary_picture;
        if (existingPlantilla.picture && picture) {
            // Obtener el ID público de la imagen existente
            const publicImageId = getPublicIdFromUrl(existingPlantilla.picture);

            // Eliminar la imagen existente
           console.log(publicImageId);
            await deleteImageFromCloudinary(publicImageId);

            // Subir la nueva imagen
            cloudinary_picture = await postImage(picture);
        } else if (picture) {
            // No hay imagen existente, pero hay una nueva imagen para subir
            cloudinary_picture = await postImage(picture);
        } else {
            // Mantener la imagen actual si no hay una nueva imagen
            cloudinary_picture = existingPlantilla.picture;
        }

        const data = {
            template_name: template_name,
            description: description,
            picture: cloudinary_picture,
            etiquetas: etiquetas,
            user_id: parseInt(user_id)
        };

        // Actualizar la plantilla
        const response = await plantillaService.update(template_id, data);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
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












