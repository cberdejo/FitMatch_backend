import { reviews } from "@prisma/client";

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
    reviews?: reviews[]; 
}

