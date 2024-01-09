import { Request, Response } from 'express';
import {  ejercicioService, plantillaService, rutinaGuardadaService, sesionEntrenamientoEntradaService, sesionEntrenamientoService} from '../service/plantilla_posts_service';
import { postImage } from '../config/cloudinary';



// -------------------
// Controladores para Plantillas de Entrenamiento
// -------------------


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
            user_id: user_id
            
        };
        
        const response = await plantillaService.postPlantilla(data);
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
        await plantillaService.delete(template_id);
        res.status(200).json({ message: 'Plantilla eliminada con él.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la plantilla.' });
    }
}


// -------------------
// Controladores para Sesiones de Entrenamiento
// -------------------


/**
 * Creates a session of training.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} The created session.
 */
export async function createSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {
        const { template_id, ejercicios } = req.body;
        const createdSession = await sesionEntrenamientoService.create(template_id, ejercicios);
        res.status(201).json(createdSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de entrenamiento.' });
    }
}


/**
 * Deletes a training session.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the success message or rejects with an error message.
 */
export async function deleteSesionEntrenamiento(req: Request, res: Response) {
    try {
        const { session_id } = req.params;
        await sesionEntrenamientoService.delete(session_id);
        res.status(200).json({ message: 'Sesión de entrenamiento eliminada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la sesión de entrenamiento.' });
    }
}


/**
 * Edit a session of training.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Promise that resolves when the session is edited.
 */
export async function editSesionEntrenamiento(req: Request, res: Response): Promise<void> {
    try {
        const session_id = parseInt(req.params.session_id);
        const sessionData = req.body; 

        const updatedSession = await sesionEntrenamientoService.update(session_id, sessionData);
        res.json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la sesión de entrenamiento.' });
    }
}


// -------------------
// Controladores para Ejercicios
// -------------------


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


// -------------------
// Controladores para Rutinas Guardadas
// -------------------


/**
 * Creates a new saved routine.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Promise that resolves when the routine is created.
 */
export async function createRutinaGuardada(req: Request, res: Response): Promise<void> {
    try {
        const { user_id, template_id } = req.body;
        const nuevaRutina = await rutinaGuardadaService.create({ user_id, template_id });
        res.status(201).json(nuevaRutina);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la rutina.' });
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

// -------------------
// Controladores para Sesiones de entrada
// -------------------

/**
 * Creates a session of entrenamiento entrada.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - Promise that resolves with void.
 */
export async function createSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const { user_id, session_id, ejercicios } = req.body;
        const sesionEntrada = await sesionEntrenamientoEntradaService.create(user_id, session_id, ejercicios);
        res.status(201).json(sesionEntrada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de entrenamiento de entrada.' });
    }
}

/**
 * Deletes a session entrenamiento entrada.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the session entrenamiento entrada is deleted.
 */
export async function deleteSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const entry_id = parseInt(req.params.entry_id);
        await sesionEntrenamientoEntradaService.delete(entry_id);
        res.status(200).json({ message: 'Sesión de entrenamiento de entrada eliminada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la sesión de entrenamiento de entrada.' });
    }
}

/**
 * Edit a session training entry.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */
export async function editSesionEntrenamientoEntrada(req: Request, res: Response): Promise<void> {
    try {
        const entry_id = parseInt(req.params.entry_id);
        const updateData = req.body; // Asegúrate de que esto contenga los campos que deseas actualizar
        const updatedSession = await sesionEntrenamientoEntradaService.edit(entry_id, updateData);
        res.status(200).json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar la sesión de entrenamiento de entrada.' });
    }
}
