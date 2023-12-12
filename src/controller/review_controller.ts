import { Request, Response } from 'express';
import { likeReviewService, getLikeByUserId, dislikeReviewService, addReviewService} from '../service/review_service'; 

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

async function addReview(req: Request, res: Response) {
    try {
        const { trainerId, clientId, rating, reviewContent } = req.body;
        if (!trainerId || !clientId || !rating || !reviewContent) {
            res.status(400).json({ error: 'Datos incompletos o incorrectos' });
            return;
        }

        const review = await addReviewService(trainerId, clientId, rating, reviewContent);
        res.status(201).json(review);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export { likeReview, addReview}