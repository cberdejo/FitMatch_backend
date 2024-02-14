import {  sesion_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";
import { UpdateSessionData } from "../interfaces/update_sesion";



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


    

    async update(sessionId: number, sessionData: UpdateSessionData): Promise<sesion_de_entrenamiento | null> {
        try {
            const transaction = await db.$transaction(async (prisma) => {
                // Actualiza primero la sesión de entrenamiento con los datos básicos proporcionados
                const currentSession= await prisma.sesion_de_entrenamiento.update({
                    where: { session_id: sessionId },
                    data: {
                        session_name: sessionData.session_name,
                        session_date: sessionData.session_date,
                        notes: sessionData.notes,
                        order: sessionData.order
                    },
                    include: {
                        ejercicios_detallados_agrupados: {
                            include: {
                                ejercicios_detallados:{
                                    include: {
                                        ejercicios: true
                                    }
                                },
                            }
                        }
                    }
                });

                const needsUpdate = checkIfUpdateIsNeeded(currentSession, sessionData);
                if ( needsUpdate) {
                    // Eliminar todos los grupos de ejercicios detallados existentes para esta sesión
                    await prisma.ejercicios_detallados_agrupados.deleteMany({
                        where: { session_id: sessionId },
                    });

                    // Reinsertar los grupos de ejercicios detallados y sus ejercicios detallados
                    for (const grupo of sessionData.ejercicios_detallados_agrupados!) {
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
                                        sets_ejercicios_entrada: {
                                            create: ejercicio.sets_ejercicios_entrada.map(set => ({
                                                set_order: set.set_order,
                                                reps: set.reps,
                                                time: set.time,
                                                weight: set.weight,
                                            }))
                                        }
                                    })),
                                    
                                    
                                },
                            },
                        });

                    
                        
                    }
                    
                }

                // Retornar la sesión de entrenamiento actualizada con los nuevos grupos de ejercicios detallados (si se proporcionaron)
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
                            ejercicios: true,
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

function checkIfUpdateIsNeeded(currentSession: any, sessionData:UpdateSessionData) {

    //Comprobar si la nueva sesión de entrenamiento tiene ejercicios detallados agrupados
    if (!sessionData.ejercicios_detallados_agrupados) {
        return false;
    }

    // Comprobar si la cantidad de ejercicios detallados agrupados coincide
    if (currentSession.ejercicios_detallados_agrupados.length !== sessionData.ejercicios_detallados_agrupados?.length) {
        return true;
    }
    
    // Comprobar cada grupo de ejercicios detallados agrupados por coincidencia
    for (let i = 0; i < currentSession.ejercicios_detallados_agrupados.length; i++) {
        const currentGroup = currentSession.ejercicios_detallados_agrupados[i];
        const updateGroup = sessionData.ejercicios_detallados_agrupados[i];

        // Comprobar si los campos del grupo coinciden
        if (currentGroup.order !== updateGroup.order ||
            currentGroup.ejercicios_detallados.length !== updateGroup.ejercicios_detallados.length) {
            return true;
        }

        // Comprobar cada ejercicio detallado dentro del grupo
        for (let j = 0; j < currentGroup.ejercicios_detallados.length; j++) {
            const currentExercise = currentGroup.ejercicios_detallados[j];
            const updateExercise = updateGroup.ejercicios_detallados.find(e => e.exercise_id === currentExercise.exercise_id);

            // Si no se encuentra un ejercicio correspondiente en los datos de actualización, o si alguno de los campos no coincide
            if (!updateExercise ||
                currentExercise.exercise_id !== updateExercise.exercise_id ||
                currentExercise.register_type_id !== updateExercise.register_type_id ||
                currentExercise.notes !== updateExercise.notes ||
                currentExercise.order !== updateExercise.order) {
                return true;
            }

            //Comprobar que los sets no hayan cambiado el tamaño
            if (updateExercise.sets_ejercicios_entrada.length !== currentExercise.sets_ejercicios_entrada.length) {
                return true;
            }
            //Comprobar sets
            for (let k = 0; k < updateExercise.sets_ejercicios_entrada.length; k++) {
                const currentSet = currentExercise.sets_ejercicios_entrada[k];
                const updateSet = updateExercise.sets_ejercicios_entrada[k];
                if (!updateSet || 
                    currentSet.set_order !== updateSet.set_order || 
                    currentSet.reps !== updateSet.reps || 
                    currentSet.time !== updateSet.time || 
                    currentSet.weight !== updateSet.weight) {
                    return true;
                }
            }
        }
    }

    // Si llegamos aquí, significa que no se encontraron diferencias que requieran una actualización
    return false;
    
}