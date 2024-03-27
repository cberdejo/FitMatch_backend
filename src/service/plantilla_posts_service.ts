import { plantillas_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";
import { Etiqueta_In } from "../interfaces/etiquetas_input";
import { PlantillaDeEntrenamientoConPromedio } from "../interfaces/posts";


export const plantillaService = {
  
  async getPlantillaPosts(
    userId: number | null,
    isPublic: boolean = false,
    isHidden: boolean = false,
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
      
      // Preparando la cláusula where inicial
      let whereClause: any = {
        public: isPublic,
        hidden: isHidden,
      };
      
      // Añadiendo filtro por userId si está presente
      if (userId) whereClause.user_id = userId;
      
      // Añadiendo filtro por nombre si está presente
      if (name) whereClause.template_name = { contains: name };
  
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
        where: { template_id: template_id },
        include: {
          sesion_de_entrenamiento: {
            include: {
              registro_de_sesion: true,
            }
          }
        }
      });
      if (template) {
        const newHiddenValue = template.hidden ? false : true;
        const publicValue = newHiddenValue ? undefined : false;
        const updatedTemplate = db.plantillas_de_entrenamiento.update({
          where: { template_id },
          data: { hidden: newHiddenValue , public: publicValue},
        })

        /*
        En caso de que no haya ningún registro de un set en ninguna sesión de entrenamiento, se borrará de la tabla plantillas_de_entrenamiento
        */

        const shouldDeleteRutina = template.sesion_de_entrenamiento.every(
          (sesion) => sesion.registro_de_sesion.length === 0
        );

        if (shouldDeleteRutina) {
          await db.plantillas_de_entrenamiento.delete({
            where: { template_id: template.template_id },
          });
        }
        return updatedTemplate;
       
      }
     
      return null;
    }, 

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






