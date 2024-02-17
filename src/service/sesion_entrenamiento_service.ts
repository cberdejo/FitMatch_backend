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
                                            create: ejercicio.sets_ejercicios_entrada?.map(set => ({  
                                                set_order: set.set_order,
                                                reps: set.reps,
                                                time: set.time,
                                                min_reps: set.min_reps,
                                                max_reps: set.max_reps,
                                                min_time: set.min_time,
                                                max_time: set.max_time, 
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

function checkIfUpdateIsNeeded(currentSession: any, sessionData: UpdateSessionData): boolean {
    // Asegurarse de que ambos, la sesión actual y los datos de la sesión a actualizar,
    // tienen ejercicios detallados agrupados definidos y no son undefined
    const currentGroups = currentSession.ejercicios_detallados_agrupados || [];
    const updateGroups = sessionData.ejercicios_detallados_agrupados || [];
  
    // Comprobar si la cantidad de ejercicios detallados agrupados coincide
    if (currentGroups.length !== updateGroups.length) {
      return true;
    }
  
    // Comprobar cada grupo de ejercicios detallados agrupados por coincidencia
    for (let i = 0; i < currentGroups.length; i++) {
      const currentGroup = currentGroups[i];
      const updateGroup = updateGroups[i];
  
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
  
        // Comprobar los sets de ejercicios
        const currentSets = currentExercise.sets_ejercicios_entrada ?? [];
        const updateSets = updateExercise.sets_ejercicios_entrada ?? [];
        
        if (currentSets.length !== updateSets.length) {
          return true;
        }
  
        // Comprobar cada set de ejercicios dentro del ejercicio
        for (let k = 0; k < currentSets.length; k++) {
          const currentSet = currentSets[k];
          const updateSet = updateSets[k];
  
          // Comprobar si los campos del set coinciden
          if (currentSet.set_order !== updateSet.set_order || 
              currentSet.reps !== updateSet.reps || 
              currentSet.time !== updateSet.time || 
              currentSet.min_reps !== updateSet.min_reps || 
              currentSet.max_reps !== updateSet.max_reps || 
              currentSet.min_time !== updateSet.min_time || 
              currentSet.max_time !== updateSet.max_time) {
            return true;
          }
        }
      }
    }
  
    // Si llegamos aquí, significa que no se encontraron diferencias que requieran una actualización
    return false;
  }
  
  