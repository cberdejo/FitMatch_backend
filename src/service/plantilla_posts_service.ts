import { plantillas_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";
import { Etiqueta_In } from "../interfaces/etiquetas_input";


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
    async getPlantillaPosts(userId: number | null, isPublic: boolean = false, isHidden: boolean = false, page: number, pageSize: number) {
      try {
          const offset = (page - 1) * pageSize;
          const whereClause = userId ? { user_id: userId, public: isPublic, hidden: isHidden } : { public: isPublic, hidden: isHidden };
        
          const plantillaPosts = await db.plantillas_de_entrenamiento.findMany({
              where: whereClause,
              skip: offset,
              take: pageSize,
              include: {
                etiquetas: true
              }
          });
  
          return plantillaPosts;
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
                template_id:template_id
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
  
  
     /**
     * Actualiza una plantilla de entrenamiento basándose en el ID proporcionado y los datos para actualizar.
     *
     * @param {number} template_id - El ID de la plantilla de entrenamiento a actualizar.
     * @param {Partial<plantillas_de_entrenamiento>} updateData - Un objeto que contiene los campos a actualizar.
     * @return {Promise<plantillas_de_entrenamiento>} - Una promesa que se resuelve con la plantilla de entrenamiento actualizada.
     */
     async update(template_id: number, updateData: Partial<plantillas_de_entrenamiento>): Promise<plantillas_de_entrenamiento> {
        return db.plantillas_de_entrenamiento.update({
            where: { template_id },
            data: updateData,
        });
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
 
   






