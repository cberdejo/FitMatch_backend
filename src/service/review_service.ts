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

/**
 * Creates a comment for a review with the given review ID, user ID, and answer content.
 *
 * @param {number} review_id - The ID of the review.
 * @param {number} user_id - The ID of the user.
 * @param {string} answer - The content of the answer.
 * @return {Promise<CommentReview | null>} A Promise that resolves to the created comment or null if an error occurs.
 */
async function answerReviewService(review_id: number, user_id: number, answer: string) {
    try {
        return await db.comentario_review.create({
            data: {
                review_id: review_id,
                user_id: user_id,
                content: answer
            }
        }); 
    } catch (error) {
        console.error('Error al responder reseña:', error);
        return null;
    }
}

/**
 * Deletes a review from the database.
 *
 * @param {number} review_id - The ID of the review to be deleted.
 * @return {Promise<any>} - A promise that resolves to the deleted review, or null if an error occurs.
 */
async function deleteReviewService(review_id: number) {
    try {
        return await db.reviews.delete({
           where : {
              review_id: review_id,
            }
        }); 
    } catch (error) {
        console.error('Error al darle me gusta:', error);
        return null;
    }
}

/**
 * Deletes a comment from the database.
 *
 * @param {number} comment_id - The ID of the comment to be deleted.
 * @return {Promise<any>} - A Promise that resolves to the result of the deletion, or null if an error occurs.
 */
async function deleteCommentService(comment_id: number) {
    try {
        return await db.comentario_review.delete({
           where : {
              comment_id: comment_id,
            }
        }); 
    } catch (error) {
        console.error('Error al darle me gusta:', error);
        return null;
    }
}

/**
 * Retrieves a review by its ID from the database.
 *
 * @param {number} review_id - The ID of the review to retrieve.
 * @return {Promise<Review | null>} A promise that resolves to the review object if found, or null if not found.
 */
async function getReviewByIdService(review_id: number) {
    try {
        return await db.reviews.findUnique({
            where: {
                review_id: review_id
            }
        }); 
    } catch (error) {
        console.error('Error al obtener la review:', error);
        return null;
    }
}

/**
 * Retrieves a comment by its ID from the service.
 *
 * @param {number} comment_id - The ID of the comment to retrieve.
 * @return {Promise<Comment | null>} A promise that resolves to the retrieved comment or null if an error occurs.
 */
async function getCommentByIdService(comment_id: number) {
    try {
        return await db.comentario_review.findUnique({
            where: {
                comment_id: comment_id
            }
        }); 
    } catch (error) {
        console.error('Error al obtener el comentario:', error);
        return null;
    }
}

/**
 * Creates a new comment for a review in the comment_responded table.
 *
 * @param {number} review_id - The ID of the review.
 * @param {number} comment_responded - The ID of the comment being responded to.
 * @param {number} user_id - The ID of the user creating the comment.
 * @param {string} answer - The content of the comment.
 * @return {Promise<any>} - A promise that resolves to the created comment, or null if there was an error.
 */
async function answerCommentService(review_id: number, comment_responded: number, user_id: number, answer: string) {
    try {
        return await db.comentario_review.create({
            data: {
                comment_responded: comment_responded,
                user_id: user_id,
                content: answer,
                review_id: review_id
            }
        }); 
    } catch (error) {
        console.error('Error al responder al comentario:', error);
        return null;
    }
}
export {
    likeReviewService,
    getLikeByUserId,
    dislikeReviewService,
    addReviewService,
    answerReviewService,
    deleteReviewService,
    deleteCommentService,
    getReviewByIdService,
    getCommentByIdService,
    answerCommentService
 }