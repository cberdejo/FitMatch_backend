export interface UpdateSessionData {
    session_name?: string;
    session_date?: Date;
    notes?: string;
    order: number;
    ejercicios_detallados_agrupados?: Array<{
        order: number;
        ejercicios_detallados: Array<{
            exercise_id: number;
            order: number;
            register_type_id: number;
            notes?: string;
            sets_ejercicios_entrada?: Array<{ 
                set_order: number;
                reps?: number;
                time?: number; 
                min_reps?: number;
                max_reps?: number;
                min_time?: number;
                max_time?: number;
            }>;
        }>;
    }>;
}
