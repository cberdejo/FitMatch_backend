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


   
    async getGuardadasPlantillaPosts(userId: number, page: number, pageSize: number) {
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
            const plantillas =  await db.plantillas_de_entrenamiento.findMany({
                where: { template_id: { in: plantillasIds } },
                include: {
                    
                    etiquetas: true
                }
            });

            return plantillas;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
   
};
