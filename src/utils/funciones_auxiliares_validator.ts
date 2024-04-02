// -------------------
// Funciones auxiliares
// -------------------


// Función auxiliar para validar si un valor es un número válido
export function esNumeroValido(valor: any) {
    return valor && !isNaN(valor) && valor > 0;
}

export function esFechaValida(fecha: any): boolean {
    return !isNaN(Date.parse(fecha));
}

// Función auxiliar para validar tipos de ejercicio
export function validarTipoEjercicio(tipoEjercicio: string) {
    const tiposValidos = ['reps', 'time', 'weight'];
    return tiposValidos.includes(tipoEjercicio);
}

// Función auxiliar para validar campos de ejercicio según su tipo
export function validarCamposEjercicio(tipoEjercicio: string, ejercicio:any) {
    switch (tipoEjercicio) {
        case 'reps':
            return ejercicio.target_sets != null && ejercicio.target_reps != null;
        case 'time':
            return ejercicio.target_time != null;
        case 'weight':
            return ejercicio.target_sets != null && ejercicio.target_reps != null;
        default:
            return false;
    }
}
// Función auxiliar para validar campos de set
export function validarCamposSet(tipoEjercicio: string, set:any): string | null {
    switch (tipoEjercicio) {
        case 'reps':
            if (set.reps === null) return 'Reps es obligatorio en cada set de fuerza.';
            break;
        case 'time':
            if (set.time === null) return 'Time es obligatorio en cada set de tiempo.';
            break;
        case 'weight':
            if (set.weight === null || set.reps === null) return 'Weight y Reps son obligatorios en cada set de peso.';
            break;
       
        default:
            break;
    }
    return null;
}