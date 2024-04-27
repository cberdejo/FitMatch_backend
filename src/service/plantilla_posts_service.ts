import { plantillas_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";
import { Etiqueta_In } from "../interfaces/etiquetas_input";
import { PlantillaDeEntrenamientoConPromedio } from "../interfaces/posts";


export const plantillaService = {
  
  async getPlantillaPosts(
    userId: number | null,
    isPublic: boolean | null,
    isHidden: boolean | null,
    page: number,
    pageSize: number,
    name: string | null,
    experiences: string[],
    objectives: string[],
    interests: string[],
    equipment: string[],
    duration: string[]
  ): Promise<PlantillaDeEntrenamientoConPromedio[]> {
    try {
      const offset = (page - 1) * pageSize;
      
      // Preparando la cláusula where inicial, omitiendo campos que sean null
      let whereClause: any = {};
      if (isPublic !== null) whereClause.public = isPublic;
      if (isHidden !== null) whereClause.hidden = isHidden;
      
      // Añadiendo filtro por userId si está presente
      if (userId !== null) whereClause.user_id = userId;
      
      // Añadiendo filtro por nombre si está presente
      if (name !== null) whereClause.template_name = { contains: name };
  
      // Añadiendo filtros para etiquetas si están presentes
      if (experiences.length || objectives.length || interests.length || equipment.length || duration.length) {
        whereClause.etiquetas = {
          some: {
            OR: [
              ...experiences.map(experience => ({ experience: { equals: experience } })),
              ...objectives.map(objective => ({ objectives: { equals: objective } })),
              ...interests.map(interest => ({ interests: { equals: interest } })),
              ...equipment.map(equip => ({ equipment: { equals: equip } })),
              ...duration.map(dur => ({ duration: { equals: dur } })),
            ],
          },
        };
      }
  
      const plantillaPosts = await db.plantillas_de_entrenamiento.findMany({
        where: whereClause,
        skip: offset,
        take: pageSize,
        include: {
          etiquetas: true,
          usuario: {
            select: {
              username: true,
              bio: true,
            },
          },
        },
      });
  
      const plantillasConPromedio = getAggregatedReviewsForTemplates(plantillaPosts);
      return plantillasConPromedio;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
 

  


/**
 * Retrieves a plantilla (template) from the database based on the provided template ID.
 *
 * @param {number} template_id - The ID of the template to retrieve.
 * @return {Promise} A promise that resolves to the retrieved plantilla.
 */
async getById(id: number): Promise<PlantillaDeEntrenamientoConPromedio | null> {
  try {
    const plantilla = await db.plantillas_de_entrenamiento.findUnique({
      where: {
        template_id: id,
      },
      include: {
        etiquetas: true,
        usuario: {
            select: {
                username: true,
                bio: true,
            }
        }
    }
    });

    if (!plantilla) {
      return null;
    }

    const plantillasConPromedio = await getAggregatedReviewsForTemplates([plantilla]);

    return plantillasConPromedio.length > 0 ? plantillasConPromedio[0] : null;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    db.$disconnect();
  }
},

async  postPlantilla(plantilla: {
    template_name: string; 
    user_id: number;
    description: string; 
    picture: string | null; 
    etiquetas: Etiqueta_In[];
  }) {
    try {
      // Iniciar una transacción
      const result = await db.$transaction(async (prisma) => {
        // Crear el objeto de datos, incluyendo 'picture' solo si no es null
        const plantillaData: any = {
          template_name: plantilla.template_name,
          description: plantilla.description,
          user_id: plantilla.user_id,
        };
        if (plantilla.picture !== null) {
          plantillaData.picture = plantilla.picture;
        }
  
       
        const createdPlantilla = await prisma.plantillas_de_entrenamiento.create({
          data: plantillaData,
        });
  
        
        const etiquetasToInsert = plantilla.etiquetas.map(etiqueta => ({
          ...etiqueta,
          template_id: createdPlantilla.template_id,
        }));
  
        await prisma.etiquetas.createMany({
          data: etiquetasToInsert,
        });
  
        return createdPlantilla;
      });
  
      return result;
  
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async  duplicatePlantillaWithSessions(userId: number, templateId: number) {
    return await db.$transaction(async (prisma) => {
        // Obtener la plantilla original
        const originalPlantilla = await prisma.plantillas_de_entrenamiento.findUnique({
            where: { template_id: templateId },
            include: { sesion_de_entrenamiento: { 
              include: {
                ejercicios_detallados_agrupados: {
                  include:{
                    ejercicios_detallados: {
                      include: {
                        sets_ejercicios_entrada: true
                      }
                    }
                  }
                }
              }
            }, etiquetas: true }, 
        });
        if (!originalPlantilla) {
            throw new Error('Plantilla no encontrada');
        }

        // Duplicar la plantilla
        const duplicatedPlantilla = await prisma.plantillas_de_entrenamiento.create({
            data: {
                user_id: userId, // nuevo user
                template_name: originalPlantilla.template_name + ' (duplicada)',
                description: originalPlantilla.description,
            },
        });

        //Añadir las etiquetas 
        if (originalPlantilla.etiquetas && originalPlantilla.etiquetas.length > 0) {
          const etiquetasData = originalPlantilla.etiquetas.map(etiqueta => {
              // Excluir `tag` y otros campos no deseados de la etiqueta original
              const { tag_id, template_id, ...etiquetaData } = etiqueta;
      
              return {
                  ...etiquetaData, // Usa los datos filtrados de la etiqueta
                  template_id: duplicatedPlantilla.template_id, // Asocia la etiqueta a la nueva plantilla duplicada
              };
          });
      
          await prisma.etiquetas.createMany({
              data: etiquetasData,
          });
      }
      
        // Duplicar cada sesión de entrenamiento asociada y sus relaciones
        if (originalPlantilla.sesion_de_entrenamiento) {
          for (const session of originalPlantilla.sesion_de_entrenamiento) {
              // Excluir `session_id` para generar uno nuevo
              const { session_id,template_id, ejercicios_detallados_agrupados, ...sessionData } = session;
              const duplicatedSession = await prisma.sesion_de_entrenamiento.create({
                  data: {
                      ...sessionData,
                      template_id: duplicatedPlantilla.template_id,
                  },
              });

              // Duplicar ejercicios detallados agrupados y sus relaciones
              for (const groupedExercise of session.ejercicios_detallados_agrupados) {
                  const { grouped_detailed_exercised_id, session_id, ejercicios_detallados, ...groupedExerciseData } = groupedExercise;
                  const duplicatedGroupedExercise = await prisma.ejercicios_detallados_agrupados.create({
                      data: {
                          ...groupedExerciseData,
                          session_id: duplicatedSession.session_id,
                      },
                  });

                  // Duplicar ejercicios detallados y sets de entrada
                  for (const detailedExercise of groupedExercise.ejercicios_detallados) {
                      const { detailed_exercise_id, grouped_detailed_exercised_id, sets_ejercicios_entrada, ...detailedExerciseData } = detailedExercise;
                      const duplicatedDetailedExercise = await prisma.ejercicios_detallados.create({
                          data: {
                              ...detailedExerciseData,
                              grouped_detailed_exercised_id: duplicatedGroupedExercise.grouped_detailed_exercised_id,
                          },
                      });

                      // Duplicar sets de ejercicios de entrada
                      for (const setEntry of detailedExercise.sets_ejercicios_entrada) {
                          const { set_id, detailed_exercise_id, ...setEntryData } = setEntry;
                          await prisma.sets_ejercicios_entrada.create({
                              data: {
                                  ...setEntryData,
                                  detailed_exercise_id: duplicatedDetailedExercise.detailed_exercise_id,
                              },
                          });
                      }
                  }
              }
          }
      }

      return duplicatedPlantilla;
  });
},

  
  async update(template_id: number, plantilla: {
    template_name: string; 
    user_id: number;
    description: string; 
    picture: string | null; 
    etiquetas: Etiqueta_In[];
  }) {
    try {
      // Iniciar una transacción
      const result = await db.$transaction(async (prisma) => {
        // Actualizar los datos de la plantilla
        const plantillaData: any = {
          template_name: plantilla.template_name,
          description: plantilla.description,
          user_id: plantilla.user_id,
          
        };

        if (plantilla.picture !== null) {
          plantillaData.picture = plantilla.picture;
        }

        const updatedPlantilla = await prisma.plantillas_de_entrenamiento.update({
          where: { template_id: template_id },
          data: plantillaData,
        });

        //ACTUALIZAR LAS ETIQUETAS
        await prisma.etiquetas.deleteMany({
          where: { template_id: template_id }
       });

      // Crear nuevas etiquetas
      const etiquetasToInsert = plantilla.etiquetas.map(etiqueta => ({
        ...etiqueta,
        template_id: updatedPlantilla.template_id,
      }));

      await prisma.etiquetas.createMany({
        data: etiquetasToInsert,
      });

        return updatedPlantilla;
      });

      return result;

    } catch (error) {
      console.error(error);
      throw error;
    }
  },


    /**
     * Deletes a template with the given template ID.
     *
     * @param {number} template_id - The ID of the template to be deleted.
     * @return {Promise<void>} A promise that resolves when the template is deleted.
     */
    async delete (template_id: number) {
        return db.plantillas_de_entrenamiento.delete({
            where: { template_id },
        });
    }, 

    async togglePublic(template_id: number) {
      const template = await db.plantillas_de_entrenamiento.findUnique({
        where: { template_id },
      });
      if (template) {
        const newPublicValue = template.public ? false : true;
        return db.plantillas_de_entrenamiento.update({
          where: { template_id },
          data: { public: newPublicValue },
        })
      }
      return null;
    

    }, 
    async toggleHiddenCreada(template_id: number) {
      return await db.$transaction(async (prisma) => {
        const template = await prisma.plantillas_de_entrenamiento.findUnique({
          where: { template_id: template_id },
          include: {
            sesion_de_entrenamiento: {
              include: {
                registro_de_sesion: true,
              }
            }
          }
        });
    
        if (!template) {
          return null; // O manejar el caso de que la plantilla no exista.
        }
    
        // Determinar los nuevos valores basados en el estado actual.
        const newHiddenValue = !template.hidden;
        const publicValue = newHiddenValue ? undefined : false;
    
        // Actualizar la plantilla.
        const updatedTemplate = await prisma.plantillas_de_entrenamiento.update({
          where: { template_id },
          data: { hidden: newHiddenValue, public: publicValue },
        });
    
        // Comprobar si se debe eliminar la plantilla.
        const shouldDeleteRutina = template.sesion_de_entrenamiento.every(sesion => sesion.registro_de_sesion.length === 0);
    
        if (shouldDeleteRutina) {
          await prisma.plantillas_de_entrenamiento.delete({
            where: { template_id: template.template_id },
          });
    
          return null; // O manejar el caso de eliminación de la plantilla.
        }
    
        return updatedTemplate;
      }).catch((error) => {
        console.error('Error en toggleHiddenCreada:', error);
        throw error; // O manejar el error de manera más específica.
      });
    }
    
}
 
export const getAggregatedReviewsForTemplates = async (templates: plantillas_de_entrenamiento[]): Promise<PlantillaDeEntrenamientoConPromedio[]> => {
  const aggregates = templates.map(async (template) => {
    const aggregateRating = await db.reviews.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        rating: true
      },
      where: {
        template_id: template.template_id,
      }
    });
    
    return {
      ...template,
      rating_average: aggregateRating._avg.rating || 0,
      num_reviews: aggregateRating._count.rating || 0
    };
  });
  
  return Promise.all(aggregates);
};






