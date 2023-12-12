import { Request, Response } from 'express';
import { likeReviewService, getLikeByUserId, dislikeReviewService} from '../service/review_service'; 

async function likeReview(req: Request, res: Response) {
    try {
        const { reviewId, userId } = req.body;

        const likeExistente = await getLikeByUserId(reviewId, userId);
        let like;
        if (likeExistente) {
          like = await dislikeReviewService(likeExistente.liked_id);
        }else{
          like = await likeReviewService(reviewId, userId);
        }
        res.status(200).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export { likeReview }