
import { ejercicios_detallados_agrupados } from "@prisma/client";
import db  from "../config/database";

export const exerciseService = {

    async create(userId : number, name : string, description : string, muscle_group_id : number, material_id : number) {
        return await db.ejercicios.create({
            data: {
                name: name,
                description: description,
                user_id: userId,
                muscle_group_id: muscle_group_id,
                material_id: material_id
            }
        })
        
    },
    async getAll() {
        return await db.ejercicios.findMany({   
        })
    }, 
    async getByMuscleGroup (id: number, page: number, pageSize: number)  {
        const offset = (page - 1) * pageSize;
        return await db.ejercicios.findMany({
            where: {muscle_group_id:id},
            skip: offset,
            take: pageSize,
        })
    },

    async getByMaterial (id: number, page: number, pageSize: number)  {
        const offset = (page - 1) * pageSize;

        return await db.ejercicios.findMany({
            where: {material_id:id},
            skip: offset,
            take: pageSize,
        })
    },

    getAllByUserId(userId: number, page: number, pageSize: number) {
       
        const offset = (page - 1) * pageSize;
        return db.ejercicios.findMany({
            where: {
                OR: [
                    { user_id: null },
                    { user_id: userId }
                ]
            },
            skip: offset,
            take: pageSize,
        });
    },


    async getAllFiltered(
        userId: number, 
        page: number, 
        pageSize: number, 
        name: string | null, 
        idGrupoMuscular: number | null, 
        idMaterial: number | null
      ) {
        try {
          const offset = (page - 1) * pageSize;
          let whereClause: {
            muscle_group_id?: number;
            material_id?: number;
            name?: {
                startsWith : string;
            };
          } = {};
    
          if (idGrupoMuscular) {
            whereClause.muscle_group_id = idGrupoMuscular;
          }
    
          if (idMaterial) {
            whereClause.material_id = idMaterial;
          }
    
          if (name) {
            // Convertimos el nombre a minúsculas para la búsqueda
            //const lowerCasedName = name.toLowerCase();
            whereClause.name = {
                startsWith: name,

            };
          }
    
          const exercises = await db.ejercicios.findMany({
            where: {
              OR: [
                { user_id: null },
                { user_id: userId }
              ],
              ...whereClause,
            },
            skip: offset,
            take: pageSize,
          });
    
          return exercises;
        } catch (error) {
          console.error('Error al obtener ejercicios filtrados:', error);
          throw error;
        }finally {
            await db.$disconnect();
        }
  
      },

      async getGropuedDetailedExercises(session_id: number): Promise<ejercicios_detallados_agrupados []| null> {

          try {
            return await db.ejercicios_detallados_agrupados.findMany({
                where: {
                session_id: session_id
                }, include: {
                    ejercicios_detallados: {
                        include: {
                            tipo_de_registro: true,
                            ejercicios: true
                        }, 
                    }
                }
            });
          } catch (error) {
            console.error(error);
            throw error;
          } finally {
            await db.$disconnect();
          }
      }
    
      
    }
      

export const muscleGroupService = {
    async getAll() {
        return await db.grupo_muscular.findMany({   
        })
    },
    async getById(id: number) {
        return await db.grupo_muscular.findUnique({
            where: {muscle_group_id:id}
        })
    }
}

export const materialService = {
    async getAll() {
        return await db.material.findMany({   
        })
    },

    async getById(id: number) {
        return await db.material.findUnique({
            where: {material_id:id}
        })
    }
}

export const typeRegisterService = {
    async getAll() {
        return await db.tipo_de_registro.findMany({   
        })
    }
}