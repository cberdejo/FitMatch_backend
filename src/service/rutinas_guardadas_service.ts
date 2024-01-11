import { plantillas_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";


export const rutinaGuardadaService = {
    /**
     * Creates a new entry in the database for a saved routine.
     *
     * @param {Object} data - An object containing the user_id and template_id.
     * @return {Promise} A promise that resolves to the newly created entry.
     */
    async create(data: { user_id: number; template_id: number; }) {
        return db.rutinas_guardadas.create({
            data,
        });
    },

    /**
     * Deletes a record from the database with the given saved_id.
     *
     * @param {number} saved_id - The ID of the record to be deleted.
     * @return {Promise<void>} - A Promise that resolves to undefined.
     */
    async delete(saved_id: number) {
        return db.rutinas_guardadas.delete({
            where: { saved_id },
        });
    },


    /**
     * Retrieves a list of training templates that have been saved by a user.
     *
     * @param {number} userId - The ID of the user.
     * @param {number} page - The page number.
     * @param {number} pageSize - The number of items per page.
     * @returns {Promise<plantillas_de_entrenamiento[]>} - A promise that resolves to an array of training templates.
     */
    async getGuardadasPlantillaPosts(userId: number, page: number, pageSize: number): Promise<plantillas_de_entrenamiento[]> {
        try {
            const offset = (page - 1) * pageSize;
    
            // Primero, obtenemos los IDs de las plantillas guardadas por el usuario
            const plantillasGuardadas = await db.rutinas_guardadas.findMany({
                where: { user_id: userId },
                select: { template_id: true }, // Solo necesitamos los IDs de las plantillas
                skip: offset,
                take: pageSize
            });
    
            // Extraemos los IDs de las plantillas
            const plantillasIds = plantillasGuardadas.map(pg => pg.template_id);
    
            // Luego, obtenemos las plantillas de entrenamiento correspondientes a esos IDs
            return await db.plantillas_de_entrenamiento.findMany({
                where: { template_id: { in: plantillasIds } },
                include: {
                    reviews: {
                        include: {
                            usuario: {
                                select: {
                                    username: true
                                }
                            },
                            me_gusta: true,
                            comentario_review: {
                                include: {
                                    usuario: {
                                        select: {
                                            username: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    etiquetas: true
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
   
};
