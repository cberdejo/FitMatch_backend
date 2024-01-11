import db  from "../config/database";

export const ejercicioService = {
    /**
     * Create a new record in the database.
     *
     * @param {object} data - The data object containing the name and description.
     * @return {Promise<object>} The created record.
     */
    async create(data: { name: string; description: string; }) {
        return db.ejercicios.create({
            data,
        });
    },

    /**
     * Retrieves a record from the database by its ID.
     *
     * @param {number} ejercicio_id - The ID of the record to retrieve.
     * @return {Promise<Exercise>} The retrieved record.
     */
    async getById (ejercicio_id: number) {

        return db.ejercicios.findUnique({
            where: { exercise_id: ejercicio_id },
        });
    },

// terminar
    async getEjerciciosMetrics(user_id: number, exercise_id:number, fecha_inicio:Date, fecha_final:Date) {
       return {
        user_id,
        exercise_id,
        fecha_inicio,
        fecha_final
       }
    }
};

export const ejercicioDetallesService = {
    /**
     * Retrieves a record from the database by its detailed_exercise_id.
     *
     * @param {number} detailed_exercise_id - The ID of the detailed exercise.
     * @return {Promise} A promise that resolves to the retrieved record.
     */
    async getById (detailed_exercise_id: number) {

        return db.ejercicios_con_detalles.findUnique({
            where: { detailed_exercise_id: detailed_exercise_id },
        });
    },
    
}

