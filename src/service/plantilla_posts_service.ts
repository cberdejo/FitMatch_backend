import { plantillas_de_entrenamiento, rutinas_guardadas } from "@prisma/client";
import db  from "../config/database";
import { Etiqueta_In } from "../interfaces/etiquetas_input";
import { PlantillaDeEntrenamientoConPromedio } from "../interfaces/posts";


export const plantillaService = {
    /**
    * Retrieves a list of plantillaPost objects based on the provided user ID, page number,
    * and page size.
    *
    * @param {number} user_id - The ID of the user.
    * @param {number} page - The page number.
    * @param {number} pageSize - The number of items per page.
    * @return {Promise<plantillaPost[]>} A promise that resolves to an array of plantillaPost objects.
    */
    async getPlantillaPosts( userId: number | null, isPublic: boolean = false, isHidden: boolean = false, page: number, pageSize: number): Promise<PlantillaDeEntrenamientoConPromedio[]> {
      try {
          const offset = (page - 1) * pageSize;
          const whereClause = userId ? { user_id: userId, public: isPublic, hidden: isHidden } : { public: isPublic, hidden: isHidden };

        
          const plantillaPosts = await db.plantillas_de_entrenamiento.findMany({
              where: whereClause,
              skip: offset,
              take: pageSize,
              include: {
                  etiquetas: true,
                  usuario: {
                      select: {
                          username: true,
                      }
                  }
              }
          });
          
       
        const plantillasConPromedio = getAggregatedReviewsForTemplates(plantillaPosts);

        return plantillasConPromedio;
        
     
        
      } catch (error) {
          console.error(error);
          throw error;
      } finally {
          db.$disconnect();
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

  async guardarPlantilla(template_id: number, user_id: number) {
    try {
      const result = await db.$transaction(async (prisma) => {
        // Verificar si la plantilla está archivada
        const archivada = await prisma.rutinas_archivadas.findFirst({
          where: {
            template_id: template_id,
            user_id: user_id,
          },
        });
  
        // Si está archivada, eliminarla de plantillas_de_entrenamiento
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
      const template = await db.plantillas_de_entrenamiento.findUnique({
        where: { template_id },
      });
      if (template) {
        const newHiddenValue = template.hidden ? false : true;
        const publicValue = newHiddenValue ? undefined : false;
        return db.plantillas_de_entrenamiento.update({
          where: { template_id },
          data: { hidden: newHiddenValue , public: publicValue},
        })
      }
      /*
        En caso de que no haya ningún registro de un set en ninguna sesión de entrenamiento, se borrará de la tabla plantillas_de_entrenamiento
      */
      return null;
    }, 
    async toggleHiddenRutinaGuardada(template_id: number, user_id:number) {
      const rutina_guardada: rutinas_guardadas | null = await db.rutinas_guardadas.findFirst({
        where: { AND: {template_id: template_id,user_id: user_id }},
       
      });
      
      if (rutina_guardada) {
        const newHiddenValue = rutina_guardada.hidden ? false : true;
        
        return db.rutinas_guardadas.update({
          where: {saved_id: rutina_guardada.saved_id},
          data: { hidden: newHiddenValue },
        });

        /*
        En caso de que no haya ningún registro de set asociado a un set de en sets_ejercicios_entrada de una sesión perteneciente a una sesión de 
        entrenamiento de la plantilla de entrenamiento de id template_id, se borrará de la tabla rutinas_guardadas
        */

      }
      return null;
    },
   
    async toggleHiddenRutinaArchivada(template_id: number, user_id:number) {
      const rutinas_archivadas = await db.rutinas_archivadas.findFirst({
        where: { template_id: template_id, user_id: user_id },
       
      });
      
      if (rutinas_archivadas) {
        const newHiddenValue = rutinas_archivadas.hidden ? false : true;
        
        return db.rutinas_archivadas.update({
          where: {archived_id: rutinas_archivadas.archived_id},
          data: { hidden: newHiddenValue },
        });

        /*
          Si no hay ningún registro de ningún set y se elimina de archivado, se deberá borrar de la tabla rutinas_archivadas
        */

      }
      return null;
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






