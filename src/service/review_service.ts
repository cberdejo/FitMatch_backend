import { reviews } from "@prisma/client";
import db  from "../config/database";


export const reviewService = {
    /**
     * Adds a review to the database.
     *
     * @param {number} templateId - The ID of the template for the review.
     * @param {number} userId - The ID of the user who wrote the review.
     * @param {number} rating - The rating given to the review.
     * @param {string} reviewContent - The content of the review.
     * @return {Promise<reviews>} - A promise that resolves to the created review, or null if there was an error.
     */
    async  create(templateId: number, userId: number, rating: number, reviewContent: string): Promise<reviews> {
        try {
            return await db.reviews.create({
                data: {
                    user_id: userId,
                    template_id: templateId,
                    rating: rating,
                    review_content: reviewContent
                }
            }); 
        } catch (error) {
            console.error('Error al crear review:', error);
            throw error;
        }
    },
    async  delete(review_id: number) {
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
    },
    /**
     * Retrieves a review by its ID from the database.
     *
     * @param {number} review_id - The ID of the review to retrieve.
     * @return {Promise<Review | null>} A promise that resolves to the review object if found, or null if not found.
     */
    async  getById(review_id: number) {
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
        
}

export const likeReviewService = {
    /**
     * Creates a new like for a review.
     *
     * @param {number} review_id - The ID of the review to like.
     * @param {number} user_id - The ID of the user who is liking the review.
     * @return {Promise<any>} A promise that resolves with the created like, or null if there was an error.
     */
    async  like(review_id: number, user_id: number) {
        try {
            return await db.me_gusta_reviews.create({
                data: {
                    review_id: review_id,
                    user_id: user_id
                }
            }); 
        } catch (error) {
            console.error('Error al darle me gusta:', error);
            return null;
        }
    },

    /**
     * Retrieves the like record associated with a specific review and user.
     *
     * @param {number} review_id - The ID of the review.
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Like | null>} The like record if found, otherwise null.
     */
    async  getLikeByUserId(review_id: number, user_id: number) {
        try {
            return await db.me_gusta_reviews.findFirst({
                where: {
                    review_id: review_id,
                    user_id: user_id
                }
            }); 
        } catch (error) {
            console.error('Error al obtener el me gusta:', error);
            return null;
        }
    },

    /**
     * Deletes the like from a review made by a user.
     *
     * @param {number} review_id - The ID of the review.
     * @param {number} user_id - The ID of the user.
     * @return {Promise} A Promise that resolves to the number of deleted likes, or null if an error occurred.
     */
    async  dislike(liked_id: number) {
        try {
            return await db.me_gusta_reviews.delete({
            where : {
                liked_review_id: liked_id,
                }
            }); 
        } catch (error) {
            console.error('Error al quitar el me gusta:', error);
            return null;
        }
    },

}

export const likeCommentService = {
  
    /**
     * Like a comment.
     *
     * @param {number} comment_id - The ID of the comment to be liked.
     * @param {number} user_id - The ID of the user who is liking the comment.
     * @return {Promise<type>} - A Promise that resolves to the created like record, or null if an error occurs.
     */
    async  like(comment_id: number, user_id: number) {
        try {
            return await db.me_gusta_comentarios.create({
                data: {
                    comment_id: comment_id,
                    user_id: user_id
                }
            }); 
        } catch (error) {
            console.error('Error al darle me gusta:', error);
            return null;
        }
    },

    
    /**
     * Retrieves a like by comment ID and user ID.
     *
     * @param {number} comment_id - The ID of the comment.
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Like | null>} - The retrieved like object or null if not found.
     */
    async  getLikeByUserId(comment_id: number, user_id: number) {
        try {
            return await db.me_gusta_comentarios.findFirst({
                where: {
                    comment_id: comment_id,
                    user_id: user_id
                }
            }); 
        } catch (error) {
            console.error('Error al obtener el me gusta:', error);
            return null;
        }
    },

   
    /**
     * Deletes a liked comment from the database.
     *
     * @param {number} liked_comment_id - The ID of the liked comment to delete.
     * @return {Promise<any>} - A Promise that resolves to the result of the deletion operation.
     */
    async  dislike(liked_comment_id: number) {
        try {
            return await db.me_gusta_comentarios.delete({
            where : {
                liked_comment_id: liked_comment_id,
                }
            }); 
        } catch (error) {
            console.error('Error al quitar el me gusta:', error);
            return null;
        }
    },

}

export const commentService  = {

    /**
     * Creates a comment for a review with the given review ID, user ID, and answer content.
     *
     * @param {number} review_id - The ID of the review.
     * @param {number} user_id - The ID of the user.
     * @param {string} answer - The content of the answer.
     * @return {Promise<CommentReview | null>} A Promise that resolves to the created comment or null if an error occurs.
     */
    async  create(review_id: number, user_id: number, answer: string) {
        try {
            return await db.comentario_review.create({
                data: {
                    review_id: review_id,
                    user_id: user_id,
                    content: answer
                }
            }); 
        } catch (error) {
            console.error('Error al responder review:', error);
            return null;
        }
    },
        

    /**
     * Deletes a comment from the database.
     *
     * @param {number} comment_id - The ID of the comment to be deleted.
     * @return {Promise<any>} - A Promise that resolves to the result of the deletion, or null if an error occurs.
     */
    async  delete(comment_id: number) {
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
    },



    /**
     * Retrieves a comment by its ID from the service.
     *
     * @param {number} comment_id - The ID of the comment to retrieve.
     * @return {Promise<Comment | null>} A promise that resolves to the retrieved comment or null if an error occurs.
     */
    async  getById(comment_id: number) {
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


}