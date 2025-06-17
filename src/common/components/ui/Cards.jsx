import {
    DevicePhoneMobileIcon,
    LockClosedIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    QuestionMarkCircleIcon,
    ArrowUpIcon, 
    ArrowDownIcon, 
} from '@heroicons/react/24/outline';

const iconMap = {
    device: DevicePhoneMobileIcon,
    block: LockClosedIcon,
    sold: ShoppingCartIcon,
    payment: CurrencyDollarIcon,
};

const colorMap = {
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
};

const Cards = ({ title, value, icon = 'device', color = 'blue', change = '0%', className = '' }) => {
    const IconComponent = iconMap[icon] || QuestionMarkCircleIcon;
    const iconColorStyle = colorMap[color] || colorMap.blue;

    const isPositiveChange = change.startsWith('+');
    const isNegativeChange = change.startsWith('-');
    let changeColorClass = 'text-gray-500';
    if (isPositiveChange) {
        changeColorClass = 'text-green-500';
    } else if (isNegativeChange) {
        changeColorClass = 'text-red-500';
    }

    return (
        <div
            className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 ${className}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                    {change && ( // Mostrar cambio solo si existe
                        <p className={`text-xs mt-2 flex items-center font-medium ${changeColorClass}`}>
                            {isPositiveChange && <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />}
                            {isNegativeChange && <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />}
                            {change}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${iconColorStyle}`}>
                    <IconComponent className="h-7 w-7" />
                </div>
            </div>
        </div>
    );
};

export default Cards;