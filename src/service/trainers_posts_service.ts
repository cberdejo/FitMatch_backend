import db  from "../config/database";
import { TrainerPost } from "../interfaces/trainers_posts";

   /**
 * Retrieves a sorted list of trainers based on matching criteria with the given user.
 *
 * @param {number} user_id - The ID of the user.
 * @param {number} page - The page number for pagination.
 * @param {number} pageSize - The number of posts per page.
 * @return {Promise<TrainerPost[]>} - A promise that resolves to the sorted list of trainers.
 */
async function getTrainerPostService(user_id: number, page: number, pageSize: number): Promise<TrainerPost[]> {
    try {
        // Calcula el offset basado en la página y el tamaño de página
        const offset = (page - 1) * pageSize;

        return await db.$queryRaw`
            WITH ClienteEmparejamiento AS (
                SELECT 
                    experiencia, 
                    objetivos, 
                    intereses 
                FROM emparejamiento 
                WHERE user_id = ${user_id}
            )
    
            SELECT 
                entrenadores.*, 
                usuario.*
            FROM 
                entrenadores
            JOIN 
                usuario ON entrenadores.user_id = usuario.user_id
            JOIN 
                emparejamiento ON usuario.user_id = emparejamiento.user_id
            JOIN 
                ClienteEmparejamiento ON (emparejamiento.experiencia = ClienteEmparejamiento.experiencia
                                            OR emparejamiento.objetivos = ClienteEmparejamiento.objetivos
                                            OR emparejamiento.intereses = ClienteEmparejamiento.intereses)
            GROUP BY 
                entrenadores.trainer_id
            ORDER BY 
                (SELECT COUNT(*)
                FROM emparejamiento e
                JOIN ClienteEmparejamiento ON (e.experiencia = ClienteEmparejamiento.experiencia
                                                OR e.objetivos = ClienteEmparejamiento.objetivos
                                                OR e.intereses = ClienteEmparejamiento.intereses)
                WHERE e.user_id = entrenadores.user_id
                ) DESC
               LIMIT ${pageSize} OFFSET ${offset}; 
        `;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


    /**
     * Retrieves the reviews for a specific trainer.
     *
     * @param {number} trainer_id - The ID of the trainer.
     * @return {Promise<Array<Review>>} An array of reviews for the trainer.
     */
    async function getTrainerReviewsService(trainer_id:number) {
        return db.reviews.findMany({
            where: {
                trainer_id:trainer_id,
            },
            include: {
                me_gusta: true, 
                comentario_review: true, 
              },
        })
    }

export {
    getTrainerPostService,
    getTrainerReviewsService
}