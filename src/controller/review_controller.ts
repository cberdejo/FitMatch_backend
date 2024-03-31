import { Request, Response } from 'express';
import { commentService, likeCommentService, likeReviewService, reviewService, } from '../service/review_service'; 
import {  usuario_service } from '../service/usuario_service';
import { me_gusta_comentarios, reviews, usuario } from '@prisma/client';
import { filtroReview } from '../interfaces/filtros';
import { fetchCrearNotificaciones } from './notification_controller';
import { plantillaService } from '../service/plantilla_posts_service';



async function getReviewsByTemplateId(req: Request, res: Response) {
    
    try {
        const templateId: number | null = req.query.templateId? parseInt(req.query.templateId as string) : null;
        const reviewOrder: filtroReview | null  = req.query.reviewOrder? req.query.reviewOrder as filtroReview : null;
        const page = req.query.page? (parseInt(req.query.page as string) || 1): null;
        const pageSize = req.query.pageSize? (parseInt(req.query.pageSize as string) || 10): null;

        const reviews = await reviewService.getReviewsByTemplateId(templateId, reviewOrder, page, pageSize);
        res.status(200).json(reviews);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });

    }
}


async function likeReview(req: Request, res: Response) {
    try {
        const { reviewId, userId } = req.body;

        const likeExistente = await likeReviewService.getLikeByUserId(reviewId, userId);
        let like;
        if (likeExistente) {
          like = await likeReviewService.dislike(likeExistente.liked_review_id);
        }else{
          like = await likeReviewService.like(reviewId, userId);
          //Notificar al dueño de la review que se le ha mandado like 
          const userGivingLike = await usuario_service.getById(userId);
          const reviewInfo = await reviewService.getById(reviewId);
          if (userGivingLike && reviewInfo) {
              
              const userReview = await usuario_service.getById(reviewInfo.user_id);
              if (userReview) {
                  
                const notificationMessage = `${userGivingLike.username} le ha dado like a tu review`;
                await fetchCrearNotificaciones('LIKE_REVIEW', notificationMessage, [reviewInfo.user_id]);
            
                }
            }
        }
        res.status(200).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}


async function likeComment(req: Request, res: Response) {
    try {
        const { commentId, userId } = req.body;

        const likeExistente: me_gusta_comentarios | null = await likeCommentService.getLikeByUserId(commentId, userId);
        let like;
        if (likeExistente) {
          like = await likeCommentService.dislike(likeExistente.liked_comment_id);
        }else{
          like = await likeCommentService.like(commentId, userId);
        
           // Obtener la información del usuario que da like
           const userGivingLike = await usuario_service.getById(userId);
           const commentInfo = await commentService.getById(commentId);

           if (userGivingLike && commentInfo) {
               // Notificar al autor del comentario
               const notificationMessage = `${userGivingLike.username} le ha dado like a tu comentario`;
               // Supongamos que `commentInfo.user_id` contiene el ID del autor del comentario
               await fetchCrearNotificaciones('LIKE_COMMENT', notificationMessage, [commentInfo.user_id]);
           }
        }
        if (!like) {
            res.status(400).json({ error: 'like no creado' });
        }
        res.status(200).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}



async function addReview(req: Request, res: Response) {
    try {
        const { templateId, userId, rating, reviewContent } = req.body;
  
        const review: reviews= await reviewService.create(templateId, userId, rating, reviewContent);
        const user: usuario | null= await usuario_service.getById(userId);
 
        if (!user) {
            res.status(400).json({ error: 'username no encontrado con userId' });
            return;
        } 
        if (!review) {
            res.status(400).json({ error: 'review no creado' });
            return;
        }
        
        const reviewExtended  = {
            username: user.username,
            profile_picture: user.profile_picture,
            ...review

        }

        //Mandar notificación al autor del templateId, que se ha hecho una reseña 
         const template = await plantillaService.getById(templateId);
        if (template){
                // Notificar al autor del template sobre la nueva review
            const notificationMessage = `${user.username} ha realizado una nueva review en tu plantilla '${template.template_name}'`;
            await fetchCrearNotificaciones('NEW_REVIEW', notificationMessage, [template.user_id]);
        }
    
 

        res.status(200).json(reviewExtended);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

async function deleteReview (req: Request, res: Response) {
    try {
        const reviewId = parseInt(req.params.id);
        const review = await reviewService.delete(reviewId);
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}


async function answerReview(req: Request, res: Response) {
    try{
        const { userId, reviewId, answer } = req.body;
        const comment = await commentService.create(reviewId, userId, answer);
        if (!comment) {
            res.status(400).json({ error: 'Respuesta no pudo ser creada.' });
            return;
        }

        const user = await usuario_service.getById(userId);
        if (!user) {
            res.status(400).json({ error: 'user no encontrado con userId' });
            return;
        }
        const extendedComment = {
            username: user.username,
            profile_picture: user.profile_picture,
            ...comment
        }  

        //NOTIFICACION
        const review = await reviewService.getById(reviewId);
        if (!review) {
            res.status(400).json({ error: 'Reseña no encontrada' });
            return;
        }

        // Envío de notificación al autor de la reseña
        const notificationMessage = `${user.username} ha respondido a tu reseña`;
        await fetchCrearNotificaciones('REVIEW_RESPONSE', notificationMessage, [review.user_id]);
        
        res.status(200).json(extendedComment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
   
}



async function deleteComment(req: Request, res: Response) {
    try{
        const commentId = parseInt(req.params.id);
        const comment = await commentService.delete(commentId);
        res.status(200).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Ocurrio un error al procesar la solicitud.' });
    }
}

export {getReviewsByTemplateId, likeReview, addReview, answerReview, deleteReview, deleteComment, likeComment };