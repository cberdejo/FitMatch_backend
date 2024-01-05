import db  from "../config/database";
import { plantillaPost } from "../interfaces/plantilla_posts_interfaces";

 
   /**
    * Retrieves a list of plantillaPost objects based on the provided user ID, page number,
    * and page size.
    *
    * @param {number} user_id - The ID of the user.
    * @param {number} page - The page number.
    * @param {number} pageSize - The number of items per page.
    * @return {Promise<plantillaPost[]>} A promise that resolves to an array of plantillaPost objects.
    */
   async function getPlantillaPostService(user_id: number, page: number, pageSize: number): Promise<plantillaPost[]> {
    try {
        const offset = (page - 1) * pageSize;

        const plantillas = await db.plantillas_de_entrenamiento.findMany({
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

        // Mapea los resultados a la estructura de plantillaPost
        return plantillas.map(plantilla => ({
            user_id: plantilla.user_id,
            picture: plantilla.picture,
            description: plantilla.description,
            reviews: plantilla.reviews?.map(review => ({
                ...review,
                username: review.usuario.username,
                me_gusta: review.me_gusta,
                comentario_review: review.comentario_review?.map(comentario => ({
                    ...comentario,
                    username: comentario.usuario.username
                }))
            })),
            etiquetas: plantilla.etiquetas
        }));
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

async function getPlantillaById(template_id:number) {
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

export {
    getPlantillaPostService,
    getReviewsByPlantillaIdService,
    getPlantillaById
}