import { comentario_review, etiquetas, me_gusta, reviews } from "@prisma/client";

export interface plantillaPost {
    user_id: number;
    picture: string | null;
    description: string | null;
    reviews?: extendedReviews[];
    etiquetas: etiquetas[]; 
}
export interface extendedReviews extends reviews {
    username: string;
    me_gusta?: me_gusta[];
    comentario_review?: extendedComentarioReviews[];
}

export interface extendedComentarioReviews extends comentario_review {
    username: string;
}

