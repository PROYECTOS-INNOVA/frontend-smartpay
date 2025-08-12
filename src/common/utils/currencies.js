// src/utils/currencies.js

export const CURRENCIES = {
    ARS: { symbol: 'ARS', locale: 'es-AR', name: 'Pesos Argentinos' },
    BOB: { symbol: 'BOB', locale: 'es-BO', name: 'Boliviano Boliviano' },
    BRL: { symbol: 'BRL', locale: 'pt-BR', name: 'Reales Brasileños' },
    CLP: { symbol: 'CLP', locale: 'es-CL', name: 'Pesos Chilenos' },
    COP: { symbol: 'COP', locale: 'es-CO', name: 'Pesos Colombianos' },
    CRC: { symbol: 'CRC', locale: 'es-CR', name: 'Colones Costarricenses' },
    CUP: { symbol: 'CUP', locale: 'es-CU', name: 'Pesos Cubanos' },
    DOP: { symbol: 'DOP', locale: 'es-DO', name: 'Pesos Dominicanos' },
    USD: { symbol: 'USD', locale: 'en-US', name: 'Dólar Estadounidense' },
    GTQ: { symbol: 'GTQ', locale: 'es-GT', name: 'Quetzales Guatemaltecos' },
    HNL: { symbol: 'HNL', locale: 'es-HN', name: 'Lempiras Hondureñas' },
    HTG: { symbol: 'HTG', locale: 'fr-HT', name: 'Gourdes Haitianas' },
    MXN: { symbol: 'MXN', locale: 'es-MX', name: 'Pesos Mexicanos' },
    NIO: { symbol: 'NIO', locale: 'es-NI', name: 'Córdobas Nicaragüenses' },
    PAB: { symbol: 'PAB', locale: 'es-PA', name: 'Balboas Panameñas' },
    PEN: { symbol: 'PEN', locale: 'es-PE', name: 'Soles Peruanos' },
    PYG: { symbol: 'PYG', locale: 'es-PY', name: 'Guaraníes Paraguayos' },
    UYU: { symbol: 'UYU', locale: 'es-UY', name: 'Pesos Uruguayos' },
    VES: { symbol: 'VES', locale: 'es-VE', name: 'Bolívares Soberanos Venezolanos' },
};

/**
 * Obtiene el nombre completo de una moneda dado su código.
 * @param {string} code - El código de la moneda (ej. 'USD', 'COP').
 * @returns {string} El nombre de la moneda o el código si no se encuentra.
 */
export const getCurrencyName = (code) => {
    return CURRENCIES[code] ? CURRENCIES[code].name : code;
};

/**
 * Obtiene el símbolo (código ISO) de una moneda dado su código.
 * @param {string} code - El código de la moneda (ej. 'USD', 'COP').
 * @returns {string} El símbolo de la moneda o una cadena vacía si no se encuentra.
 */
export const getCurrencySymbol = (code) => {
    return CURRENCIES[code] ? CURRENCIES[code].symbol : '';
};

/**
 * Formatea un valor numérico como una cadena de moneda.
 * Utiliza Intl.NumberFormat para un formato robusto y localizado.
 * @param {number} value - El número a formatear.
 * @param {string} currencyCode - El código ISO 4217 de la moneda (ej. 'USD', 'COP').
 * @returns {string} El valor formateado como moneda, o una cadena vacía si el valor no es un número.
 */
export const formatCurrency = (value, currencyCode) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return ''; // Retorna una cadena vacía o maneja el error como prefieras
    }

    const currencyInfo = CURRENCIES[currencyCode];

    if (!currencyInfo) {
        // Fallback si la moneda no está definida en nuestra lista.
        // Podríamos intentar formatear con el locale por defecto y el código como símbolo.
        console.warn(`Currency code '${currencyCode}' not found in CURRENCIES. Falling back to default locale.`);
        try {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        } catch (error) {
            console.error(`Error formatting unknown currency ${currencyCode}:`, error);
            return `${value.toFixed(2)} ${currencyCode}`; // Último recurso
        }
    }

    try {
        return new Intl.NumberFormat(currencyInfo.locale, {
            style: 'currency',
            currency: currencyCode, // Usa el código ISO, no el symbol del objeto
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch (error) {
        console.error(`Error formatting currency ${currencyCode}:`, error);
        // En caso de error, puedes decidir cómo quieres mostrarlo.
        // Por ejemplo, solo el número con dos decimales y el símbolo.
        return `${currencyInfo.symbol} ${value.toFixed(2)}`;
    }
};

/**
 * Formatea un valor numérico simple (sin símbolo de moneda).
 * Útil para mostrar cantidades que no son directamente dinero, pero necesitan formato numérico.
 * @param {number} value - El número a formatear.
 * @param {string} locale - El código de idioma y región (ej. 'es-CO').
 * @param {object} options - Opciones adicionales para Intl.NumberFormat.
 * @returns {string} El valor formateado como número.
 */
export const formatNumber = (value, locale = 'es-CO', options = {}) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }
    try {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            ...options,
        }).format(value);
    } catch (error) {
        console.error("Error formatting number:", error);
        return value.toFixed(2);
    }
};