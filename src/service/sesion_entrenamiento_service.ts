import {  sesion_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";



export const sesionEntrenamientoService = {
    /**
     * Creates a new session of training using the specified template ID.
     *
     * @param {number} template_id - The ID of the template to use for the session.
     * @return {Promise} A promise that resolves to the created session.
     */
    // async create(template_id: number, ejercicios: any[], session_name: string, notes: string) {
    //     return db.$transaction(async (prisma) => {
    //         const sesion = await prisma.sesion_de_entrenamiento.create({
    //             data: { 
    //                 template_id: template_id,
    //                 session_name: session_name,
    //                 notes: notes
    //              }
    //         });
    
    //         for (const ejercicio of ejercicios) {
    //             await prisma.ejercicios_detallados.create({
    //                 data: {
    //                     ...ejercicio,
    //                     session_id: sesion.session_id,
    //                 }
    //             });
    //         }
    
    //         return sesion;
    //     });
    // },

    async create(template_id: number, session_name: string, notes: string, order: number) {
        return db.sesion_de_entrenamiento.create({
            data: {
                template_id: template_id,
                session_name: session_name,
                notes: notes,
                order: order
            }
        })
        
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


    
// async  updateSession(session_id: number,  template_id: number, sessionUpdateData: {
//     session_name?: string,
//     notes?: string,
//     order?: number,
//     session_date?: Date,
  
  
// }): Promise<sesion_de_entrenamiento> {
//     const updatedSession = await db.sesion_de_entrenamiento.update({
//         where: { session_id: session_id , template_id: template_id},
//         data: {
//             ...sessionUpdateData,
           
//         },
//         include: {
//             ejercicios_detallados_agrupados: true,
//         },
//     });

//     return updatedSession;
// },
    async update(sessionId: number, sessionData: {
        session_name?: string,
        session_date?: Date,
        notes?: string,
        order: number,
        ejercicios_detallados_agrupados?: Array<{ // Hacer esta propiedad opcional
            order: number,
            ejercicios_detallados: Array<{
                exercise_id: number,
                order: number,
                register_type_id: number,
                notes?: string
            }>
        }>
    }): Promise<sesion_de_entrenamiento | null> {
        try {
            const transaction = await db.$transaction(async (prisma) => {
                // Actualiza primero la sesión de entrenamiento con los datos básicos proporcionados
                await prisma.sesion_de_entrenamiento.update({
                    where: { session_id: sessionId },
                    data: {
                        session_name: sessionData.session_name,
                        session_date: sessionData.session_date,
                        notes: sessionData.notes,
                        order: sessionData.order
                    },
                });

                // Verificar si ejercicios_detallados_agrupados fue proporcionado antes de intentar eliminar y reinsertar
                if (sessionData.ejercicios_detallados_agrupados) {
                    // Eliminar todos los grupos de ejercicios detallados existentes para esta sesión
                    await prisma.ejercicios_detallados_agrupados.deleteMany({
                        where: { session_id: sessionId },
                    });

                    // Reinserta los grupos de ejercicios detallados y sus ejercicios detallados
                    for (const grupo of sessionData.ejercicios_detallados_agrupados) {
                        await prisma.ejercicios_detallados_agrupados.create({
                            data: {
                                session_id: sessionId,
                                order: grupo.order,
                                ejercicios_detallados: {
                                    create: grupo.ejercicios_detallados.map(ejercicio => ({
                                        exercise_id: ejercicio.exercise_id,
                                        order: ejercicio.order,
                                        register_type_id: ejercicio.register_type_id,
                                        notes: ejercicio.notes,
                                    })),
                                },
                            },
                        });
                    }
                }

                // Retorna la sesión de entrenamiento actualizada con los nuevos grupos de ejercicios detallados (si se proporcionaron)
                return prisma.sesion_de_entrenamiento.findUnique({
                    where: { session_id: sessionId },
                    include: {
                        ejercicios_detallados_agrupados: {
                            include: {
                                ejercicios_detallados: true,
                            },
                        },
                    },
                });
            });

            return transaction;
        } catch (error) {
            console.error('Error al actualizar la sesión de entrenamiento:', error);
            throw error;
        } finally {
            await db.$disconnect();
        }
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
        include: {
            ejercicios_detallados_agrupados: {
                include: {
                    ejercicios_detallados: {
                        include: {
                            sets_ejercicios_entrada: true
                        }
                    }
                }
            }
        }
    });
   },

   async getByTemplateId (template_id: number) {
       return db.sesion_de_entrenamiento.findMany({
           where: { template_id:template_id },
           orderBy: { order: 'asc' },
        //    include: {
        //        ejercicios_detallados_agrupados: {
        //         include: {
        //             ejercicios_detallados: {
        //                 include: {
        //                     sets_ejercicios_entrada: true
        //                 }
        //             }
        //         }
        //        }
        //    }
       })
   }
};
