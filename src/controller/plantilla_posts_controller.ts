import { Request, Response } from 'express';
import { deleteImageFromCloudinary, postImage } from '../config/cloudinary';
import { plantillaService } from '../service/plantilla_posts_service';
import { rutinaGuardadaService } from '../service/rutinas_guardadas_service';
import { getPublicIdFromUrl } from '../utils/funciones_auxiliares_controller';
import { PlantillaDeEntrenamientoConPromedio } from '../interfaces/posts';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';



export async function getAllPlantillaPosts(req: Request, res: Response): Promise<void> {
    try {

        
        const userId: number | null = req.body.userId ? parseInt(req.body.userId as string) : null;
        const isPublic: boolean | null = req.body.isPublic == null ? null : req.body.isPublic !== 'false';
        const isHidden: boolean | null = req.body.isHidden == null ? null : req.body.isHidden === 'true';
        
        

                //filtros
        const name: string | null = req.body.name ? req.body.name as string : null;

        const experiences = req.body.experience ? (req.body.experience as string).split(',') : [];
        const objectives = req.body.objective ? (req.body.objective as string).split(',') : [];   
        const interests = req.body.interests ? (req.body.interests as string).split(',') : [];     
        const  equipment = req.body.equipment ? (req.body.equipment as string).split(',') : [];
        const duration = req.body.duration ? (req.body.duration as string).split(',') : [];

        const page = parseInt(req.body.page as string) || 1;
        const pageSize = parseInt(req.body.pageSize as string) || 100;

        const plantillaPosts: PlantillaDeEntrenamientoConPromedio[] = 
        await plantillaService.getPlantillaPosts( userId, isPublic, isHidden, page, pageSize, name, experiences, objectives, interests, equipment, duration);
       
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
   
        res.status(200).json(plantilla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });

    }
}


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


export async function duplicatePlantillaPost (req: Request, res: Response): Promise<void> {
    try {
        const userId = parseInt(req.body.user_id);
        const templateId = parseInt(req.body.template_id);
        
        const duplicatedTemplate = await plantillaService.duplicatePlantillaWithSessions(userId, templateId);
        res.status(201).json(duplicatedTemplate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
}

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












