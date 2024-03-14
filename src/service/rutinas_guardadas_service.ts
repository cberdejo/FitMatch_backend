import db  from "../config/database";
import { PlantillaDeEntrenamientoConPromedio } from "../interfaces/posts";
import { getAggregatedReviewsForTemplates } from "./plantilla_posts_service";



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

    

  async guardarPlantilla(template_id: number, user_id: number) {
    try {
      const result = await db.$transaction(async (prisma) => {
        const guardada = await prisma.rutinas_guardadas.findFirst({
          where: {
            template_id: template_id,
            user_id: user_id,
          }
        }); 
        if (guardada) {
          return await prisma.rutinas_guardadas.update({
            where: {
              saved_id: guardada.saved_id,
            }, 
            data: {
              hidden: !guardada.hidden
            }
          })
        }

        // Verificar si la plantilla está archivada
        const archivada = await prisma.rutinas_archivadas.findFirst({
          where: {
            template_id: template_id,
            user_id: user_id,
          },
        });
  
        // Si está archivada, eliminarla de archivada
        if (archivada) {
          await prisma.rutinas_archivadas.delete({
            where: {
             archived_id: archivada.archived_id,
            },
          });
        }

        
  
        // Añadir la plantilla a rutinas_guardadas, ya sea que estuviera archivada o no
        const activada = await prisma.rutinas_guardadas.create({
          data: {
            template_id: template_id,
            user_id: user_id,
          },
        });
  
        return activada;
      });
  
      return result;
  
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      db.$disconnect();
    }
  },
  


   
    async getGuardadasPlantillaPosts(userId: number, page: number, pageSize: number): Promise<PlantillaDeEntrenamientoConPromedio[]> {
        try {
            const offset = (page - 1) * pageSize;
    
            // Primero, obtenemos los IDs de las plantillas guardadas por el usuario
            const plantillasGuardadas = await db.rutinas_guardadas.findMany({
                where: { 
                  user_id: userId,
                  hidden: false
                },
                select: { template_id: true }, // Solo necesitamos los IDs de las plantillas
                skip: offset,
                take: pageSize
            });
    
            // Extraemos los IDs de las plantillas
            const plantillasIds = plantillasGuardadas.map(pg => pg.template_id);
    
            // Luego, obtenemos las plantillas de entrenamiento correspondientes a esos IDs
            const plantillas =  await db.plantillas_de_entrenamiento.findMany({
                where: { 
                    template_id: { in: plantillasIds } ,
                },
                include: {
                    etiquetas: true,
                    usuario: {
                        select: {
                            username: true,
                        }
                    }
                }
            });

            const plantillasConPromedioYReviewsNum: PlantillaDeEntrenamientoConPromedio[] = await getAggregatedReviewsForTemplates(plantillas);
            return plantillasConPromedioYReviewsNum;

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await db.$disconnect();
        }
    },

  
      async toggleHiddenRutinaGuardada(template_id: number, user_id:number) {
        const rutina_guardada = await db.rutinas_guardadas.findFirst({
          where: { AND: {template_id: template_id,user_id: user_id }},
          include: {
            plantillas_de_entrenamiento:{
              include:{
                sesion_de_entrenamiento: {
                  include: {
                    registro_de_sesion: {
                      where: {
                        user_id: user_id
                      }
                    } 
                  }
                }
              }
            }
          }
         
        });
        
        if (rutina_guardada) {
          const newHiddenValue = rutina_guardada.hidden ? false : true;
          
          const updatedRutinaGuardada = db.rutinas_guardadas.update({
            where: {saved_id: rutina_guardada.saved_id},
            data: { hidden: newHiddenValue },
          });
          
          /*
          En caso de que no haya ningún registro de sesión  asociado a una sesión  de 
          entrenamiento de la plantilla de entrenamiento de id template_id, se borrará de la tabla rutinas_guardadas
          */

          const shouldDeleteRutina = rutina_guardada.plantillas_de_entrenamiento.sesion_de_entrenamiento.every(
            (sesion) => sesion.registro_de_sesion.length === 0
          );

          if (shouldDeleteRutina) {
            await db.rutinas_guardadas.delete({
              where: { saved_id: rutina_guardada.saved_id },
            });
          }
         
          return updatedRutinaGuardada;
        }

        return null;
      },
     
     
    
   
};

export const rutinaArchivadaService = {
   
    async create(data: { user_id: number; template_id: number; }) {
        return db.rutinas_archivadas.create({
            data,
        });
    },

  
    async delete(archived_id: number) {
        return db.rutinas_archivadas.delete({
            where: { archived_id:archived_id },
        });
    },


   
    async getArchivadasPlantillaPosts(userId: number, page: number, pageSize: number): Promise<PlantillaDeEntrenamientoConPromedio[]> {
        try {
            const offset = (page - 1) * pageSize;
    
            // Primero, obtenemos los IDs de las plantillas guardadas por el usuario
            const plantillasGuardadas = await db.rutinas_archivadas.findMany({
                where: {
                   user_id: userId,
                   hidden: false
                  },
                select: { template_id: true }, // Solo necesitamos los IDs de las plantillas
                skip: offset,
                take: pageSize
            });
    
            // Extraemos los IDs de las plantillas
            const plantillasIds = plantillasGuardadas.map(pg => pg.template_id);
    
            // Luego, obtenemos las plantillas de entrenamiento correspondientes a esos IDs
            const plantillas =  await db.plantillas_de_entrenamiento.findMany({
                where: { 
                    template_id: { in: plantillasIds } ,
                },
                include: {
                    etiquetas: true,
                    usuario: {
                        select: {
                            username: true,
                        }
                    }
                }
            });
            
            const plantillasConPromedioYReviewsNum: PlantillaDeEntrenamientoConPromedio[] = await getAggregatedReviewsForTemplates(plantillas);
            return plantillasConPromedioYReviewsNum;

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await db.$disconnect();
        }
    },
    async archivarPlantilla(template_id: number, user_id:number) {
        try {
          const result = await db.$transaction(async (prisma) => {
            await prisma.rutinas_guardadas.deleteMany({
              where: {
                template_id: template_id,
                user_id: user_id
              }
            });
            const archivada = await prisma.rutinas_archivadas.create({
              data: {
                template_id: template_id,
                user_id: user_id,
              }
            });
            return archivada;
          });
    
          return result;
    
        } catch (error) {
          console.error(error);
            throw error;
        } finally {
          db.$disconnect();
        }
      },
    
      async toggleHiddenRutinaArchivada(template_id: number, user_id:number) {
        const rutinas_archivadas = await db.rutinas_archivadas.findFirst({
          where: { template_id: template_id, user_id: user_id },
          include: {
            plantillas_de_entrenamiento: {
              include: {
                sesion_de_entrenamiento: {
                  include: {
                    registro_de_sesion: {
                      where: {
                        user_id: user_id
                      }
                    }
                  }
                }
              }
            }
          }
         
        });
        
        if (rutinas_archivadas) {
          const newHiddenValue = rutinas_archivadas.hidden ? false : true;
          
          const updatedRutinaArchivada = db.rutinas_archivadas.update({
            where: {archived_id: rutinas_archivadas.archived_id},
            data: { hidden: newHiddenValue },
          });
  
          const shouldDeleteRutina = rutinas_archivadas.plantillas_de_entrenamiento.sesion_de_entrenamiento.every(
            (sesion) => sesion.registro_de_sesion.length === 0
          );

          if (shouldDeleteRutina) {
            await db.rutinas_archivadas.delete({
              where: { archived_id: rutinas_archivadas.archived_id },
            });
          }
         
          return updatedRutinaArchivada;
        }
        return null;
      }
};

