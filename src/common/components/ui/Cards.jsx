// src/common/components/ui/Cards.jsx

import {
    DevicePhoneMobileIcon,
    LockClosedIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    QuestionMarkCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    UsersIcon, // Nuevo icono para clientes/usuarios, si es necesario
    ClipboardDocumentListIcon // Nuevo icono para planes, si es necesario
} from '@heroicons/react/24/outline';

const iconMap = {
    // Tus iconos existentes
    device: DevicePhoneMobileIcon,
    block: LockClosedIcon,
    sold: ShoppingCartIcon,
    payment: CurrencyDollarIcon,
    // Puedes añadir más iconos si los necesitas para otros tipos de tarjetas
    users: UsersIcon, // Ejemplo: para un card de "Total Clientes"
    plans: ClipboardDocumentListIcon, // Ejemplo: para un card de "Planes Activos"
};

const colorMap = {
    // Fondo claro y texto oscuro para el icono
    green: 'bg-green-50 text-green-600', // Fondo muy claro, texto verde fuerte
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600', // Un azul más claro para el fondo del icono
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
};

const Cards = ({ title, value, icon = 'device', color = 'blue', change = null, className = '' }) => {
    const IconComponent = iconMap[icon] || QuestionMarkCircleIcon;
    const iconColorStyle = colorMap[color] || colorMap.blue; // Fallback a azul si el color no se encuentra

    // Lógica para el cambio porcentual
    const isPositiveChange = change && change.startsWith('+');
    const isNegativeChange = change && change.startsWith('-');
    let changeColorClass = 'text-gray-500'; // Color por defecto si no hay cambio o es 0
    if (isPositiveChange) {
        changeColorClass = 'text-green-600'; // Verde más vibrante
    } else if (isNegativeChange) {
        changeColorClass = 'text-red-600'; // Rojo más vibrante
    }

    return (
        <div
            // Clases de la tarjeta: fondo blanco, padding, bordes redondeados, sombra sutil, transición suave
            className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 ${className}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col"> {/* Envuelve el título y el valor para mejor control */}
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p> {/* margin-bottom para separar */}
                    <p className="text-3xl font-bold text-gray-900">{value}</p> {/* Texto más oscuro para el valor */}
                </div>
                {/* Contenedor del icono: padding, redondeado completo, y los colores dinámicos */}
                <div className={`p-3 rounded-full ${iconColorStyle} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6" /> {/* Icono ligeramente más pequeño */}
                </div>
            </div>

            {/* Sección de cambio, solo si 'change' no es nulo/undefined */}
            {change !== null && (
                <p className={`text-sm mt-3 flex items-center font-medium ${changeColorClass}`}> {/* mt-3 para más espacio */}
                    {isPositiveChange && <ArrowUpIcon className="h-4 w-4 mr-1" />} {/* Iconos de flecha un poco más grandes */}
                    {isNegativeChange && <ArrowDownIcon className="h-4 w-4 mr-1" />}
                    {change}
                </p>
            )}
        </div>
    );
};

export default Cards;