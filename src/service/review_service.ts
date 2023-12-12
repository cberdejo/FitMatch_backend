import db  from "../config/database";


/**
 * Creates a new like for a review.
 *
 * @param {number} review_id - The ID of the review to like.
 * @param {number} user_id - The ID of the user who is liking the review.
 * @return {Promise<any>} A promise that resolves with the created like, or null if there was an error.
 */
async function likeReviewService(review_id: number, user_id: number) {
    try {
        return await db.me_gusta.create({
            data: {
                review_id: review_id,
                user_id: user_id
            }
        }); 
    } catch (error) {
        console.error('Error al darle me gusta:', error);
        return null;
    }
}

/**
 * Retrieves the like record associated with a specific review and user.
 *
 * @param {number} review_id - The ID of the review.
 * @param {number} user_id - The ID of the user.
 * @return {Promise<Like | null>} The like record if found, otherwise null.
 */
async function getLikeByUserId(review_id: number, user_id: number) {
    try {
        return await db.me_gusta.findFirst({
            where: {
                review_id: review_id,
                user_id: user_id
            }
        }); 
    } catch (error) {
        console.error('Error al obtener el me gusta:', error);
        return null;
    }
}

/**
 * Deletes the like from a review made by a user.
 *
 * @param {number} review_id - The ID of the review.
 * @param {number} user_id - The ID of the user.
 * @return {Promise} A Promise that resolves to the number of deleted likes, or null if an error occurred.
 */
async function dislikeReviewService(liked_id: number) {
    try {
        return await db.me_gusta.delete({
           where : {
              liked_id: liked_id,
            }
        }); 
    } catch (error) {
        console.error('Error al quitar el me gusta:', error);
        return null;
    }
}

/**
 * Add a review to the database.
 *
 * @param {number} trainerId - The ID of the trainer.
 * @param {number} clientId - The ID of the client.
 * @param {number} rating - The rating given to the trainer.
 * @param {string} reviewContent - The content of the review.
 * @return {Promise<any>} A promise that resolves to the created review object or null if there was an error.
 */
async function addReviewService(trainerId: number, clientId: number, rating: number, reviewContent: string) {
    try {
        return await db.reviews.create({
            data: {
                trainer_id: trainerId,
                client_id: clientId,
                rating: rating,
                review_content: reviewContent
            }
        }); 
    } catch (error) {
        console.error('Error al darle me gusta:', error);
        return null;
    }
}

export {likeReviewService, getLikeByUserId, dislikeReviewService, addReviewService}