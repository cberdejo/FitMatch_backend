import { plantillas_de_entrenamiento } from "@prisma/client";
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
    async getPlantillaPosts(userId: number | null, isPublic: boolean = false, isHidden: boolean = false, page: number, pageSize: number): Promise<PlantillaDeEntrenamientoConPromedio[]> {
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
      }
  },
  


/**
 * Retrieves a plantilla (template) from the database based on the provided template ID.
 *
 * @param {number} template_id - The ID of the template to retrieve.
 * @return {Promise} A promise that resolves to the retrieved plantilla.
 */
async  getPlantillaById(template_id:number) : Promise<plantillas_de_entrenamiento | null> {
    try{
        return db.plantillas_de_entrenamiento.findUnique({
            where: {
                template_id:template_id,
            }
        })
    }
    catch(error){
        console.error(error);
        throw error;
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






