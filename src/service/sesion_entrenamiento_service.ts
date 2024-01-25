import { sesion_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";



export const sesionEntrenamientoService = {
    /**
     * Creates a new session of training using the specified template ID.
     *
     * @param {number} template_id - The ID of the template to use for the session.
     * @return {Promise} A promise that resolves to the created session.
     */
    async create(template_id: number, ejercicios: any[], session_name: string, notes: string) {
        return db.$transaction(async (prisma) => {
            const sesion = await prisma.sesion_de_entrenamiento.create({
                data: { 
                    template_id: template_id,
                    session_name: session_name,
                    notes: notes
                 }
            });
    
            for (const ejercicio of ejercicios) {
                await prisma.ejercicios_detallados.create({
                    data: {
                        ...ejercicio,
                        session_id: sesion.session_id,
                    }
                });
            }
    
            return sesion;
        });
    },

    /**
     * Deletes a session by session ID.
     *
     * @param {any} session_id - the ID of the session to be deleted
     * @return {Promise<any>} - a promise that resolves to the result of the deletion
     */
    async delete(session_id:any) {
        return await db.sesion_de_entrenamiento.delete({
            where: { session_id: parseInt(session_id) },
        });
    },

    /**
     * Updates a session with the given session ID and session data.
     *
     * @param {number} session_id - The ID of the session to update.
     * @param {Partial<sesion_de_entrenamiento>} sessionData - The partial session data to update.
     * @return {Promise<sesion_de_entrenamiento>} - The updated session.
     */
    async update(session_id: number, sessionData: Partial<sesion_de_entrenamiento>): Promise<sesion_de_entrenamiento> {
        return db.sesion_de_entrenamiento.update({
            where: { session_id },
            data: sessionData,
        });
    },

   /**
    * Retrieves a training session by its ID.
    *
    * @param {number} session_id - The ID of the session.
    * @return {Promise<object>} A Promise that resolves to the training session object.
    */
   async getById (session_id: number) {

    return db.sesion_de_entrenamiento.findUnique({
        where: { session_id },
    });
   },

   async getByTemplateId (template_id: number) {
       return db.sesion_de_entrenamiento.findMany({
           where: { template_id:template_id },
           orderBy: { order: 'asc' },
       })
   }
};
