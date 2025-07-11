// src/utils/helpers.js

/**
 * Capitaliza la primera letra de una cadena.
 * @param {string} string - La cadena de entrada.
 * @returns {string} La cadena con la primera letra capitalizada.
 */
export const capitalizeFirstLetter = (string) => {
    if (!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Formatea una fecha ISO a un formato legible.
 * @param {string} isoString - La cadena de fecha ISO.
 * @returns {string} La fecha formateada.
 */
export const formatDisplayDate = (isoString) => {
    console.error("Error", isoString)
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Formato 24 horas
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Fecha inválida';
    }
};