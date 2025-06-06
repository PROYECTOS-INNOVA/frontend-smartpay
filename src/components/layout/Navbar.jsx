import { MagnifyingGlassIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ setSidebarOpen }) => {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm md:shadow-md">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

                {/* Mobile menu button y Logo/Título para móvil */}
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
                        aria-label="Abrir menú lateral"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    {/* Logo/Título de la app solo visible en móvil */}
                    <Link to="/landing" className="md:hidden flex items-center space-x-2 ml-4 text-slate-800 font-bold text-lg">
                        {/* Asegúrate que la ruta /assets/logo.png sea correcta */}
                        <img src="/assets/logo.png" alt="Logo SmartPay" className="h-8 w-8 object-contain" />
                        <span>SmartPay</span>
                    </Link>
                </div>

                {/* Título de la App o breadcrumbs (solo en desktop, alternativo al search) */}
                {/* Puedes elegir entre el buscador o un título/breadcrumbs. Aquí mantengo el buscador. */}
                <div className="flex-1 max-w-xl mx-auto hidden sm:block">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar en SmartPay..."
                            className="block w-full pl-10 pr-4 py-2 text-sm border rounded-full bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Íconos y perfil de usuario */}
                <div className="flex items-center space-x-4">
                    {/* Botón de Notificaciones */}
                    <button
                        className="p-2 text-slate-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-full transition-colors duration-150 ease-in-out relative"
                        aria-label="Notificaciones"
                    >
                        <BellIcon className="h-6 w-6" />
                        {/* Indicador de nuevas notificaciones (opcional) */}
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    </button>

                    {/* Perfil de usuario */}
                    <div className="flex items-center space-x-2 cursor-pointer group relative">
                        <UserCircleIcon className="h-9 w-9 text-blue-500 group-hover:text-blue-600 transition-colors duration-150 ease-in-out" />
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-800">Admin</p>
                            <p className="text-xs text-slate-500">Administrador</p>
                        </div>
                        {/* Mini-menú de perfil al hacer hover (opcional, necesitarías JS para la funcionalidad completa) */}
                        {/*
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden group-hover:block">
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar Sesión</Link>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;