import { plantillas_de_entrenamiento } from "@prisma/client";

export type PlantillaDeEntrenamientoConPromedio = plantillas_de_entrenamiento & {
    rating_average: number;
    num_reviews: number;
  };
  