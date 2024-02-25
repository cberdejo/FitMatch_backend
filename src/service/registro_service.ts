
import db  from "../config/database";

export const registro_service = {
    getRegisterSessionById(id: number) {
        return db.registro_de_sesion.findUnique({
            where: {register_session_id: id}
        })
    },
    async  getAllRegistersByUserIdAndExerciseId(user_id: number, exercise_id: number) {
        return db.registro_set.findMany({
            where: {
                registro_de_sesion:{
                 user_id: user_id,   
                },
                sets_ejercicios_entrada:{
                    ejercicios_detallados:{
                        exercise_id: exercise_id
                    }
                }
            }
        })
    },

    async getAllRegistersByUserIdAndSessionId(user_id: number, session_id: number) {
        return db.registro_de_sesion.findMany({
            where:{
                user_id: user_id,
                session_id: session_id
            },
            orderBy:{
                date: 'desc'
            }
        })
    },
    async getLastRegisterByUserIdAndSessionId(user_id: number, session_id: number) {
        return db.registro_de_sesion.findMany({
            where:{
                user_id: user_id,
                session_id: session_id
            }, orderBy:{
                date: 'desc'
            },
            take: 1
        })
    },
    async getAllRegisterSetFromRegisterSessionId(register_session_id: number) {
        return db.registro_set.findMany({
            where:{
                registro_de_sesion:{
                    register_session_id: register_session_id
                }
            }
        })
    }, 
    async createRegisterSession(user_id: number, session_id: number) {
        return db.registro_de_sesion.create({
            data:{
                user_id: user_id,
                session_id: session_id    
            }
        });
    },

    getRegisterSetByRegisterSessionIdAndSetId(user_id: number, register_session_id: number,  set_id: number) {
        return db.registro_set.findFirst({
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
        return db.registro_set.create({
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
        return db.registro_set.update({
            where:{
                register_set_id: register_set_id
            }, 
            data:{
                reps: reps,
                weight: weight,
                time: time
            }
        })
    }
}