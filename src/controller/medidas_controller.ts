import { Request, Response } from 'express'; 
import { fotosProgresoService, medidaService } from '../service/medidas_service';
import { deleteImageFromCloudinary, postImage } from '../config/cloudinary';
import { getPublicIdFromUrl } from '../utils/funciones_auxiliares_controller';
import { medidaCreacion } from '../interfaces/medida_creacion';
import { usuario_service } from '../service/usuario_service';

const toDouble = (value:string) => isNaN(parseFloat(value)) ? undefined : parseFloat(value);
const fromInchesToCm = (value?:number) => (value != undefined) ? value * 2.54: undefined;
 const fromLbsToKg = (value?:number) => (value != undefined) ? value / 0.453592 : undefined;
export async function createMedidas ( req : Request, res: Response){

    try { 
        
    const userId  = parseInt(req.body.user_id);
    let weight = toDouble(req.body.weight);
    let rightArm = toDouble(req.body.right_arm);
    let leftArm = toDouble(req.body.left_arm);
    let rightLeg = toDouble(req.body.upper_right_leg);
    let leftLeg = toDouble(req.body.upper_left_leg);  
    let neck = toDouble(req.body.neck);
    let shoulders = toDouble(req.body.shoulders);
    let waist = toDouble(req.body.waist);
    let leftCalve = toDouble(req.body.left_calve);
    let rightCalve = toDouble(req.body.right_calve);
    let chest = toDouble(req.body.chest);
    let leftForearm = toDouble(req.body.left_forearm);
    let rightForearm = toDouble(req.body.right_forearm);
   
    const weightSystem = await usuario_service.getWeightSystemByUserId(userId);
    //Realizamos la conversión si es necesario
    if (weightSystem==='imperial'){
        weight = fromLbsToKg(weight);
        rightArm = fromInchesToCm(rightArm);
        leftArm = fromInchesToCm(leftArm);
        rightLeg = fromInchesToCm(rightLeg);
        leftLeg = fromInchesToCm(leftLeg);
        neck = fromInchesToCm(neck);
        shoulders = fromInchesToCm(shoulders);
        waist = fromInchesToCm(waist);
        leftCalve = fromInchesToCm(leftCalve);
        rightCalve = fromInchesToCm(rightCalve);
        chest = fromInchesToCm(chest);
        leftForearm = fromInchesToCm(leftForearm);
        rightForearm = fromInchesToCm(rightForearm);

    }

    const newMedida : medidaCreacion = { 
        user_id: userId,
        weight: weight,
        right_arm: rightArm,
        left_arm: leftArm,
        upper_right_leg: rightLeg,
        upper_left_leg: leftLeg,
        neck: neck,
        shoulders: shoulders,
        waist: waist,
        left_calve: leftCalve,
        right_calve: rightCalve,
        chest: chest, 
        left_forearm: leftForearm,
        right_forearm: rightForearm

    };

    const pictures = req.files;

    const createdMedida = await medidaService.createMedidas(newMedida);
    let cloudinary_picture;
    if (pictures) {
        for (const picture of pictures as Express.Multer.File[]) {
            cloudinary_picture = await postImage(picture);
             await fotosProgresoService.create(cloudinary_picture, createdMedida.measurement_id);
        }
    }

    res.status(201).json(createdMedida);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

 export async function getAllMedidas ( req : Request, res: Response){ 

    try { 
        const userId = parseInt(req.params.userId);
        const medidas = await medidaService.getAllMedidas(userId); 
        if (!medidas || medidas.length === 0) {
            res.status(204).send();
            return;
        }
        res.status(200).json(medidas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export  async function deleteMedidas(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const deleted = await medidaService.deleteMedidas(id);
        if (!deleted) {
            res.status(404).json({ error: 'Medida no encontrada.' });
            return;
        }
        res.status(200).json({ message: 'Medida eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export async function updateMedidas(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
             
    const userId  = parseInt(req.body.user_id);
    const weight = toDouble(req.body.weight);
    const rightArm = toDouble(req.body.right_arm);
    const leftArm = toDouble(req.body.left_arm);
    const rightLeg = toDouble(req.body.upper_right_leg);
    const leftLeg = toDouble(req.body.upper_left_leg);  
     const neck = toDouble(req.body.neck);
     const shoulders = toDouble(req.body.shoulders);
     const waist = toDouble(req.body.waist);
    const leftCalve = toDouble(req.body.left_calve);
    const rightCalve = toDouble(req.body.right_calve);
    const chest = toDouble(req.body.chest);

    const newMedida : medidaCreacion = { 
        user_id: userId,
        weight: weight,
        right_arm: rightArm,
        left_arm: leftArm,
        upper_right_leg: rightLeg,
        upper_left_leg: leftLeg,
        neck: neck,
        shoulders: shoulders,
        waist: waist,
        left_calve: leftCalve,
        right_calve: rightCalve,
        chest: chest, 

    };
        const updated = await medidaService.updateMedidas(id, newMedida);

        if (!updated) {
            res.status(404).json({ error: 'Medida no encontrada.' });
            return;
        }

        const pictures = req.files;
        if (updated && pictures) {
            let cloudinary_picture;
            const existingProgressPictures = await fotosProgresoService.getByMeasurementId(updated.measurement_id);
            //elimino imagenes actuales 
            if (existingProgressPictures) {
                for (const picture of existingProgressPictures) {
                    const publicImageId = getPublicIdFromUrl(picture.imagen);
                    // Eliminar la imagen existente
                    await deleteImageFromCloudinary(publicImageId);
                }
            }
            //independientemente de si existían fotos anteriormente o no, debo subir las nuevas 
            for (const picture of pictures as Express.Multer.File[]) {
                cloudinary_picture = await postImage(picture);
                await fotosProgresoService.create(cloudinary_picture, updated.measurement_id);
            }

          
        }
           

        res.status(200).json({ message: 'Medida actualizada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}