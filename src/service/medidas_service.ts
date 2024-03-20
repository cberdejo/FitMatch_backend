import { medidas } from "@prisma/client";
import db  from "../config/database";
import { medidaCreacion } from "../interfaces/medida_creacion";

export const medidaService = {

    async createMedidas(medida: medidaCreacion) {

        try {
            return await db.medidas.create({
                data: medida
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    
    },
    async getAllMedidas(userId:number) {
        try {
            return await db.medidas.findMany({
                where: {
                    user_id: userId
                }, 
                include: {
                    fotos_progreso: true
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    },
    async deleteMedidas(id:number) {
        try {
            return await db.medidas.delete({
                where: {
                    measurement_id: id
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    }, 
    async updateMedidas(id:number, medida:medidaCreacion) {
        try {
            return await db.medidas.update({
                where: {
                    measurement_id: id
                },
                data: medida
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    }

}

export const fotosProgresoService = {

    async create(fotoProgreso:string, measurement_id:number) {
        try {
            return await db.fotos_progreso.create({
                data: {
                    imagen: fotoProgreso,
                    measurement_id: measurement_id
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    }, 
    async getByMeasurementId(measurement_id:number) {
        try {
            return await db.fotos_progreso.findMany({
                where: {
                    measurement_id: measurement_id
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error('Ocurrio un error al procesar la solicitud.');
        }
    }
}