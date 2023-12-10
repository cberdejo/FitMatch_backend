import { comentario_review, me_gusta, reviews } from "@prisma/client";

export interface TrainerPost {
    trainer_id: number;
    user_id: number;
    picture: string;
    description: string;
    price: number;
    username: string;
    email: string;
    profile_picture: string;
    profile_id: number;
    birth: Date;
    reviews?: extendedReviews[]; 
}
export interface extendedReviews extends reviews {
    username: string;
    me_gusta?: me_gusta[];
    comentario_review?: extendedComentarioReviews[];
}

export interface extendedComentarioReviews extends comentario_review {
    username: string;
}
