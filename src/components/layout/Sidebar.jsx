import { NavLink } from 'react-router-dom';
import {
    Squares2X2Icon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    BellIcon,
    LockClosedIcon,
    XMarkIcon,
    // Si necesitas un ícono de Logout en el futuro:
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { FaHome } from 'react-icons/fa'; 

const navigation = [
    { name: 'Dashboard', icon: Squares2X2Icon, href: '/' },
    { name: 'Gestión de clientes', icon: UserGroupIcon, href: '/customers' },
    { name: 'Gestión de dispositivos', icon: DevicePhoneMobileIcon, href: '/devices' },
    { name: 'Pagos y facturación', icon: CreditCardIcon, href: '/payments' },
    { name: 'Configuración de agente', icon: Cog6ToothIcon, href: '/agent-config' },
    { name: 'Reportes y análisis', icon: ChartBarIcon, href: '/reports' },
    { name: 'Recordatorios de pago', icon: BellIcon, href: '/payment-reminders' },
    { name: 'Bloqueo automático', icon: LockClosedIcon, href: '/auto-block' },
];

// Nota: Reemplaza 'blue-xxx' y 'slate-xxx' con tus colores primarios/secundarios 
// si los tienes definidos de forma personalizada en tu tailwind.config.js
// Por ejemplo, si 'primary-600' es tu azul principal, usa eso.

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white shadow-lg 
                           transform transition-transform duration-300 ease-in-out 
                           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                           md:translate-x-0 md:static md:flex md:flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                            {/* Asegúrate que la ruta /assets/logo.png sea correcta y que el logo se vea bien */}
                            <img src="/assets/logo.png" alt="Logo SmartPay" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            SmartPay
                        </span>
                    </div>
                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-label="Cerrar menú lateral"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/'} // Para que Dashboard no esté activo en subrutas
                            className={({ isActive }) =>
                                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-md' // Active state
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white' // Inactive state
                                }`
                            }
                            onClick={() => {
                                if (sidebarOpen) { // Cierra el sidebar en móvil al hacer clic en un enlace
                                    setSidebarOpen(false);
                                }
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors duration-150 ease-in-out
                                        ${isActive
                                                ? 'text-white' // Active icon color
                                                : 'text-slate-400 group-hover:text-slate-300' // Inactive icon color
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Puedes añadir una sección de "Footer" al sidebar aquí si lo deseas, por ejemplo, para un enlace de logout o perfil */}
                <div className="px-3 py-4 mt-auto border-t border-slate-700">
                    <NavLink
                        to="/Landing" // o a una página de perfil
                        className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150 ease-in-out"
                    >
                        <FaHome className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400 group-hover:text-slate-300" />
                        Landing Page
                    </NavLink>
                    <NavLink
                        to="/login" // o a una página de perfil
                        className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150 ease-in-out"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400 group-hover:text-slate-300" />
                        Cerrar Sesión
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;