
import { sesion_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";



export const registro_service = {
    async getSesionesWithRegisterByUserId(user_id: number, fecha?: Date) {

        let fechaInicio = fecha ? new Date(fecha.setHours(0, 0, 0, 0)) : new Date(0);
        let fechaFin = fecha ? new Date(fecha.setHours(23, 59, 59, 999)) : undefined;

        let whereClause = {
            registro_de_sesion: {
                some: {
                    user_id: user_id,
                    finished: true,
                    final_date: {
                        gte: fechaInicio,
                        ...(fechaFin && { lte: fechaFin }), 
                    },
                },
            },
        };

        try {
            return await db.sesion_de_entrenamiento.findMany({
                where: whereClause,
               
               
                include:{
                    
                    ejercicios_detallados_agrupados: {
                        include: {
                            ejercicios_detallados: {
                              
                                include: {
                                    sets_ejercicios_entrada: {
                                        include: {
                                            registro_set: {

                                                where: {
                                                    registro_de_sesion:{
                                                        user_id: user_id,
                                                        finished: true,
                                                        final_date: {
                                                            gte: fechaInicio,
                                                            ...(fechaFin && { lte: fechaFin }), 
                                                        },
                                                    }
                                                   
                                                }
                                            }
                                        }
                                    },
                                    ejercicios: true
                                }
                            }
                        }
                    }, 
                    registro_de_sesion: {
                        where: {
                            
                            user_id: user_id,
                            finished: true,
                            final_date: {
                                gte: fechaInicio,
                                ...(fechaFin && { lte: fechaFin }), 
                              
                            }
                        },
                        orderBy: {
                            final_date: 'desc'
                        }
                    }
                }
            });
          
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getRegisterSessionById(id: number) {
        try{
            return await db.registro_de_sesion.findUnique({
                where: {register_session_id: id}
            })
        }catch (error) {
            console.error(error);
            throw error;
        } finally{
            await db.$disconnect();
        }
    },
    async  getAllRegistersByUserIdAndExerciseId(user_id: number, detailed_exercise_id: number) {
        try{
            const registros =  await db.registro_set.findMany({
                where: {
                    registro_de_sesion:{
                    user_id: user_id,   
                    },
                    sets_ejercicios_entrada:{
                        ejercicios_detallados:{
                            detailed_exercise_id: detailed_exercise_id,
                        }
                    }
                }, 
                orderBy: {
                    timestamp: 'asc'
                },
                include: {
                    sets_ejercicios_entrada: {
                        include: {
                            ejercicios_detallados: {
                                include: {
                                    ejercicios: true
                                }
                            }
                        }
                    }
                }
            })
               // Transformar los datos para aplanar la estructura
            //    const registrosAplanados = registros.map(registro => {
            //     // Accediendo directamente, ya que no son arreglos según lo mencionado
            //     const ejercicioDetallado = registro.sets_ejercicios_entrada?.ejercicios_detallados;
            //     const ejercicio = ejercicioDetallado?.ejercicios;
            
            //     return {
            //         registro_set_id: registro.set_id,
            //         register_session_id: registro.register_session_id,
            //         set_id: registro.set_id,
            //         reps: registro.reps,
            //         weight: registro.weight,
            //         time: registro.time,
            //         timestamp: registro.timestamp,
            //         video: registro.video,
            //         nombre_ejercicio: ejercicio?.name, // Acceso condicional, ya que ejercicio puede ser undefined
            //     };
            // });
            

        return registros;
        }catch (error) {
            console.error(error);
            throw error;
        } finally{
            await db.$disconnect();
        }
    },

    async getAllRegistersByUserIdAndSessionId(user_id: number, session_id: number) {
        try{
            return await db.registro_de_sesion.findMany({
                where:{
                    user_id: user_id,
                    session_id: session_id
                },
                orderBy:{
                    date: 'desc'
                }
                })
        }catch (error) {
            console.error(error);
            throw error;
        } finally{
            await db.$disconnect();
        }
    },

    async getAllRegistersBySessionId(session_id: number, prismaContext?: any) {
        try{
            const prisma = prismaContext || db; // Usa el contexto de transacción si se proporciona, de lo contrario usa la instancia global
             return await prisma.registro_de_sesion.findMany({
                where:{
                    
                    session_id: session_id
                },
                orderBy:{
                    date: 'desc'
                }
                })
        }catch (error) {
            console.error(error);
            throw error;
        } 
    },

    async getSessionWithRegistersByUserIdAndSessionId(user_id: number, session_id: number ) {
        try {
            return await db.sesion_de_entrenamiento.findUnique({
                where:{
                    session_id: session_id
                },
                include:{
                    registro_de_sesion: {
                        where:{
                            user_id: user_id
                        },
                       
                    },
                    ejercicios_detallados_agrupados: {
                        include: {
                            ejercicios_detallados: {
                                include: {
                                    sets_ejercicios_entrada: {
                                        include: {
                                            registro_set: {
                                                where:{
                                                    registro_de_sesion:{
                                                        user_id: user_id
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    ejercicios: true
                                }
                            }
                        }
                    }
                }
            });

       

        }catch (error) {
            console.error(error);
            throw error;
        } finally{
            await db.$disconnect();
        }
    },
    async getLastRegisterByUserIdAndSessionId(user_id: number, session_id: number) {
        return await db.registro_de_sesion.findMany({
            where:{
                user_id: user_id,
                session_id: session_id
            }, orderBy:{
                date: 'desc'
            },
            take: 1
        })
    },
    async getLastRegistersByUserIdAndTemplateId(user_id: number, template_id: number): Promise<{sesion: sesion_de_entrenamiento, finished: boolean} | null> {
        const lastRegister = await db.registro_de_sesion.findFirst({
            where: {
                user_id: user_id,
                sesion_de_entrenamiento: {
                    activa: true,
                    template_id: template_id
                }
            }, 
            include: {
                sesion_de_entrenamiento: true
            },
            orderBy: {
                date: 'desc'
            },
        });
    
        // Si el último registro sigue activo, lo retornamos directamente
        if (lastRegister && !lastRegister.finished) {
            return {sesion: lastRegister.sesion_de_entrenamiento, finished: false};
        }
    
        // Intentamos encontrar la siguiente sesión disponible si el último registro ya finalizó
        if (lastRegister && lastRegister.finished) {
            const nextSession = await db.sesion_de_entrenamiento.findFirst({
                where: {
                    template_id: template_id,
                    activa: true,
                    order: {
                        gt: lastRegister.sesion_de_entrenamiento.order
                    }
                },
            });
    
            if (nextSession) {
                return {sesion: nextSession, finished: true};
            }
        }
    
        // Si no hay registros o no encontramos una sesión siguiente, buscamos la primera sesión
        const firstSesion = await db.sesion_de_entrenamiento.findFirst({
            where: {
                template_id: template_id,
                activa: true
            }, 
            orderBy: {
                order: 'asc'
            }, 
            take: 1
        });
    
        return firstSesion ? {sesion: firstSesion, finished: true} : null;
    },
    
    async getAllRegisterSetFromRegisterSessionId(register_session_id: number) {
        return await db.registro_set.findMany({
            where:{
                registro_de_sesion:{
                    register_session_id: register_session_id
                }, 
                
            }
        })
    }, 
    async createRegisterSession(user_id: number, session_id: number) {
        return await db.registro_de_sesion.create({
            data:{
                user_id: user_id,
                session_id: session_id,
               
            }
        });
    },

    async getRegisterSetByRegisterSessionIdAndSetId(user_id: number, register_session_id: number,  set_id: number) {
        return await db.registro_set.findFirst({
            where:{
                registro_de_sesion:{
                    user_id: user_id,
                    register_session_id: register_session_id,
                },
                set_id: set_id
            }
        })
    },

    async createRegisterSet(register_session_id: number, set_id: number, reps?: number, weight?: number, time?: number) {
        return await db.registro_set.create({
            data:{
                register_session_id: register_session_id,
                set_id: set_id,
                reps: reps,
                weight: weight,
                time: time
            }
        })
    },

    async updateRegisterSet(register_set_id: number, reps?: number, weight?: number, time?: number) {
        try {
            return await db.registro_set.update({
                where:{
                    register_set_id: register_set_id
                }, 
                data:{
                    reps: reps,
                    weight: weight,
                    time: time
                }
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
       
    },
    async  terminarRegistroDeSesion(register_session_id: number) {
        try {
            const registroActual = await db.registro_de_sesion.findUnique({
                where: {
                    register_session_id: register_session_id
                },
                select: {
                    finished: true 
                }
            });
    
            if (registroActual) {
              
                const finalizar = !registroActual.finished;
                return await db.registro_de_sesion.update({
                    where: {
                        register_session_id: register_session_id
                    },
                    data: {
                        finished: finalizar,
                        final_date: finalizar ? new Date() : null 
                    }
                });
            } else {
                console.error('Registro no encontrado');
                throw new Error('Registro no encontrado');
            }
    
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await db.$disconnect();
        }
    },
    
    async deleteRegisterSet(register_set_id: number) {
        return await db.registro_set.delete({
            where:{
                register_set_id: register_set_id
            }
        })
    },
    async deleteRegisterSession(register_session_id: number) {
        return await db.registro_de_sesion.delete({
            where:{
                register_session_id: register_session_id
            }
        })
    }
}