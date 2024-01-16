export function aplanarRespuesta(plantilla: { reviews: any[]; }) {
    return {
        ...plantilla,
        reviews: plantilla.reviews.map((review: { usuario: { username: any; }; me_gusta_reviews: string | any[]; comentario_review: any[]; }) => {
            return {
                ...review,
                username: review.usuario.username,
                meGustaCount: review.me_gusta_reviews.length, // Contar los "Me gusta" de la review
                comentario_review: review.comentario_review.map((comment: { usuario: { username: any; }; me_gusta_comentarios: string | any[]; }) => {
                    return {
                        ...comment,
                        username: comment.usuario.username,
                        meGustaCount: comment.me_gusta_comentarios.length // Contar los "Me gusta" del comentario
                    };
                })
            };
        })
    };
}
