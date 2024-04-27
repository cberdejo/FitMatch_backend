import {Request, Response, NextFunction} from 'express';
import { Etiqueta_In } from '../interfaces/etiquetas_input';
import {plantillaService } from '../service/plantilla_posts_service';
import {esNumeroValido } from '../utils/funciones_auxiliares_validator';




// -------------------
// Validadores para PlantillaPost
// -------------------



export async function validateGetPlantillaPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        
        const userId = req.body.userId ? parseInt(req.body.userId as string) : null;
        const page = parseInt(req.body.page as string) || 1;
        const pageSize = parseInt(req.body.pageSize as string) || 10;

     
        if (userId != null && !esNumeroValido(userId) ){
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




export async function validateCreatePlantillaPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { template_name, description, etiquetas, user_id } = req.body;


    if (!template_name) {
        res.status(400).json({ error: 'El nombre de la plantilla no puede estar vacío.' });
        console.error ('El nombre de la plantilla no puede estar vacío.');
        return;
    }
    if (!description) {
        res.status(400).json({ error: 'La descripción de la plantilla no puede estar vacía.' });
        console.error ('La descripción de la plantilla no puede estar vacía.');
        return;
    }
    if (!etiquetas) {
        res.status(400).json({ error: 'Las etiquetas de la plantilla no pueden estar vacías.' });
        console.error ('Las etiquetas de la plantilla no pueden estar vacías.');
        return;
    }
   
    if (!Array.isArray(etiquetas) || etiquetas.length < 1) {
        res.status(400).json({ error: 'Debes seleccionar al menos una etiqueta.' });
        console.error ('Debes seleccionar al menos una etiqueta.');
        return;
    }
     
    if (!user_id) {
        res.status(400).json({ error: 'El ID del usuario no puede estar vacío.' });
        console.error ('El ID del usuario no puede estar vacío.');
        return;
    }
    if (!esNumeroValido(user_id)) {
        res.status(400).json({ error: 'El ID del usuario debe ser un número.' });
        console.error ('El ID del usuario debe ser un número.');
        return;
    }

    const isValidEtiqueta = (etiqueta: Etiqueta_In) => {
        return etiqueta.objectives || etiqueta.experience || etiqueta.interests || etiqueta.equipment || etiqueta.duration;
         
    };

    if (!etiquetas.every(isValidEtiqueta)) {
        res.status(400).json({ error: 'Cada etiqueta debe tener al menos uno de los siguientes campos no nulos: objetivos, experiencia, intereses, equipo, o duracion.' });
        console.error ('Cada etiqueta debe tener al menos uno de los siguientes campos no nulos: objetivos, experiencia, intereses, equipo, o duracion.');
        return;
    }
    
    next();
}


export async function validateEditPlantillaPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const template_id = parseInt(req.params.template_id);
    const { template_name, description, etiquetas, user_id} = req.body;

    try {
        const plantilla = await plantillaService.getById(template_id);

        if (!plantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada.' });
            return;
        }

        if (!template_name) {
            res.status(400).json({ error: 'El nombre de la plantilla no puede estar vacío.' });
            return;
        } 

        if (!description) {
            res.status(400).json({ error: 'La descripción de la plantilla no puede estar vacía.' });
            return;
        }
        if (!etiquetas) {
            res.status(400).json({ error: 'Las etiquetas de la plantilla no pueden estar vacías.' });
            return;
        } 
        if (!user_id) {
            res.status(400).json({ error: 'El ID del usuario no puede estar vacío.' });
            return;
        }
   

    
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al validar la solicitud.' });
    }
}








