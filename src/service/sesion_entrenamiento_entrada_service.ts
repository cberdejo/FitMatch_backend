import db  from "../config/database";


export const sesionEntrenamientoEntradaService = {
    async create(user_id: number, session_id: number, ejercicios: any[]): Promise<any> {
        return db.$transaction(async (prisma) => {
            const sesionEntrada = await prisma.sesion_de_entrenamiento_entrada.create({
                data: {
                    user_id: user_id,
                    session_id: session_id,
               
                }
            });

            for (const ejercicio of ejercicios) {
                const ejercicioEntrada = await prisma.ejercicios_entrada.create({
                    data: {
                        entry_session_id: sesionEntrada.entry_session_id,
                        detailed_exercise_id: ejercicio.detailed_exercise_id,
                        notes: ejercicio.notes,
                        
                    }
                });

                for (const set of ejercicio.sets) {
                    await prisma.sets_ejercicios_entrada.create({
                        data: {
                            entry_exercise_id: ejercicioEntrada.entry_exercise_id,
                            set_order: set.set_order,
                            video: set.video,
                            reps: set.reps,
                            time: set.time,
                           
                        }
                    });
                }
            }

            return sesionEntrada;
        });
    },

    /**
     * Retrieves a record from the database by its entry session ID.
     *
     * @param {number} entry_session_id - The ID of the entry session.
     * @return {Promise} A promise that resolves to the retrieved record.
     */
    async getById (entry_session_id: number) {
        
        return db.sesion_de_entrenamiento_entrada.findUnique({
            where: { entry_session_id },
        });
    },

    /**
     * Edits an entry in the database.
     *
     * @param {number} entry_id - The ID of the entry to be edited.
     * @param {any} updateData - The data to be updated.
     * @return {Promise<any>} - A promise that resolves to the updated entry.
     */
    async edit(entry_id: number, updateData: any) {
        return db.sesion_de_entrenamiento_entrada.update({
            where: { entry_session_id: entry_id },
            data: updateData,
        });
    },

    /**
     * Deletes the entry with the specified ID from the training session.
     *
     * @param {number} entry_id - The ID of the entry to be deleted.
     * @return {Promise<void>} - A promise that resolves when the deletion is complete.
     */
    async delete(entry_id: number) {
        return db.sesion_de_entrenamiento_entrada.delete({
            where: { entry_session_id: entry_id },
           
        });
    },
};

