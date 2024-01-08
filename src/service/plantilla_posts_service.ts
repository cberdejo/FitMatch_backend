import { plantillas_de_entrenamiento, sesion_de_entrenamiento } from "@prisma/client";
import db  from "../config/database";
import { Etiqueta_In } from "../interfaces/etiquetas_input";

/*
[
  {
   
    template_id: number,
    user_id: number,
    template_name: string,
    description: string | null,
    picture: string | null,


    // Relación con reviews
    reviews: [
      {
        // Campos de reviews
        review_id: number,
        user_id: number,
        template_id: number,
        rating: number,
        review_content: string,
        timestamp: Date,
        // ... otros campos de reviews

        // Usuario que escribió la reseña
        usuario: {
          username: string
        },

        // Relación con me_gusta
        me_gusta: [
          {
            // Campos de me_gusta
            liked_id: number,
            review_id: number,
            user_id: number
            // ... otros campos de me_gusta
          },
          
        ],

        // Relación con comentario_review
        comentario_review: [
          {
            // Campos de comentario_review
            comment_id: number,
            review_id: number,
            user_id: number,
            content: string,
            timestamp: Date,
            comment_responded: number | null,
            // ... otros campos de comentario_review

            // Usuario que escribió el comentario
            usuario: {
              username: string
            }
          },
          // ... más objetos comentario_review
        ]
      },
      // ... más objetos reviews
    ],

    // Relación con etiquetas
    etiquetas: [
      {
        // Campos de etiquetas
        tag_id: number,
        template_id: number,
        objetivos: string | null,
        experiencia: string | null,
        intereses: string | null
        // ... otros campos de etiquetas
      },
     
    ]
  },
  
]
*/

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
    async  getPlantillaPosts(userId: number | null, page: number, pageSize: number): Promise<plantillas_de_entrenamiento[]> {
        try {
            const offset = (page - 1) * pageSize;
            const whereClause = userId ? { user_id: userId } : {};
    
            return await db.plantillas_de_entrenamiento.findMany({
                where: whereClause,
                skip: offset,
                take: pageSize,
                include: {
                    reviews: {
                        include: {
                            usuario: {
                                select: {
                                    username: true
                                }
                            },
                            me_gusta: true,
                            comentario_review: {
                                include: {
                                    usuario: {
                                        select: {
                                            username: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    etiquetas: true
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

/**
 * Retrieves reviews by plantilla id from the database.
 *
 * @param {number} template_id - The id of the plantilla.
 * @return {Promise} A promise that resolves to an array of reviews.
 */
async  getReviewsByPlantillaId(template_id:number) {
    try{
        return db.reviews.findMany({
            where: {
                template_id:template_id,
            },
            include: {
                me_gusta: true, 
                comentario_review: true, 
                }, 
        })
    }catch(error){
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
 
   

export const sesionEntrenamientoService = {
    /**
     * Creates a new session of training using the specified template ID.
     *
     * @param {number} template_id - The ID of the template to use for the session.
     * @return {Promise} A promise that resolves to the created session.
     */
    async create(template_id: number, ejercicios: any[]) {
        return db.$transaction(async (prisma) => {
            const sesion = await prisma.sesion_de_entrenamiento.create({
                data: { template_id }
            });
    
            for (const ejercicio of ejercicios) {
                await prisma.ejercicios_con_detalles.create({
                    data: {
                        ...ejercicio,
                        session_id: sesion.session_id,
                    }
                });
            }
    
            return sesion;
        });
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

    /**
     * Updates a session with the given session ID and session data.
     *
     * @param {number} session_id - The ID of the session to update.
     * @param {Partial<sesion_de_entrenamiento>} sessionData - The partial session data to update.
     * @return {Promise<sesion_de_entrenamiento>} - The updated session.
     */
    async update(session_id: number, sessionData: Partial<sesion_de_entrenamiento>): Promise<sesion_de_entrenamiento> {
        return db.sesion_de_entrenamiento.update({
            where: { session_id },
            data: sessionData,
        });
    },
};


export const ejercicioService = {
    /**
     * Create a new record in the database.
     *
     * @param {object} data - The data object containing the name and description.
     * @return {Promise<object>} The created record.
     */
    async create(data: { name: string; description: string; }) {
        return db.ejercicios.create({
            data,
        });
    },
};

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
};



