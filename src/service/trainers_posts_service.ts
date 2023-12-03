import db  from "../config/database";
import { TrainerPost } from "../interfaces/trainers_posts";

    /**
     * Retrieves a sorted list of trainers based on matching criteria with the given user.
     *
     * @param {number} user_id - The ID of the user.
     * @return {Promise<TrainerPost[]>} - A promise that resolves to the sorted list of trainers.
     */
    async function getTrainerPostService(user_id:number): Promise<TrainerPost[]> {
        try{
            return  await db.$queryRaw`
           -- Primero, obtenemos los atributos de emparejamiento del cliente con id_user = 2
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
                ) DESC;
            `;
                    
        }catch(error){
            console.log(error);
            throw error
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
            }
        })
    }

export {
    getTrainerPostService,
    getTrainerReviewsService
}