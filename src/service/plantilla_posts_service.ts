import { plantillas_de_entrenamiento } from "@prisma/client";
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
 
   /**
    * Retrieves a list of plantillaPost objects based on the provided user ID, page number,
    * and page size.
    *
    * @param {number} user_id - The ID of the user.
    * @param {number} page - The page number.
    * @param {number} pageSize - The number of items per page.
    * @return {Promise<plantillaPost[]>} A promise that resolves to an array of plantillaPost objects.
    */
   async function getPlantillaPostByIdService(user_id: number, page: number, pageSize: number): Promise<plantillas_de_entrenamiento[]> {
    try {
        const offset = (page - 1) * pageSize;

        return await db.plantillas_de_entrenamiento.findMany({
            where: {
                user_id: user_id
            },
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
}

async function getPlantillaPostService(page: number, pageSize: number): Promise<plantillas_de_entrenamiento[]> {
    try {
        const offset = (page - 1) * pageSize;

        return await db.plantillas_de_entrenamiento.findMany({
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
}





   
/**
 * Retrieves reviews by plantilla id from the database.
 *
 * @param {number} template_id - The id of the plantilla.
 * @return {Promise} A promise that resolves to an array of reviews.
 */
async function getReviewsByPlantillaIdService(template_id:number) {
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
}

/**
 * Retrieves a plantilla (template) from the database based on the provided template ID.
 *
 * @param {number} template_id - The ID of the template to retrieve.
 * @return {Promise} A promise that resolves to the retrieved plantilla.
 */
async function getPlantillaByIdService(template_id:number) {
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
}

async function postPlantillaService(plantilla: {
    template_name: string; 
    description: string; 
    picture: string | null; 
    etiquetas: Etiqueta_In[];
  }) {
      try {
          // Código de la función
      } catch (error) {
          console.error(error);
          throw error;
      }
  }
 async function putPlantillaService(plantilla: plantillas_de_entrenamiento) {
    try{
        return db.plantillas_de_entrenamiento.update({
            where: {
                template_id: plantilla.template_id
            },
            data: plantilla
        })
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export {
    getPlantillaPostByIdService,
    getPlantillaPostService,
    getReviewsByPlantillaIdService,
    getPlantillaByIdService,
    postPlantillaService,
    putPlantillaService
}