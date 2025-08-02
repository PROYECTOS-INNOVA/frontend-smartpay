// src/components/Navbar.jsx

import { useState, useEffect } from 'react'; // Necesitamos useState para el dropdown del usuario
import { MagnifyingGlassIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
// import { UserCircleIcon } from '@heroicons/react/24/solid'; // Si quieres un icono de usuario sólido
// import { User } from 'lucide-react'; // Si prefieres este icono de usuario
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider'; // Asegúrate de que la ruta sea correcta
import { showNewUserAlert, userNotStore } from '../../utils/auth';

const Navbar = ({ setSidebarOpen }) => {
    const [isStore, setIsStore] = useState(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const fetchUserData = async () => {
        console.log('Fetching user data...');
        
        await showNewUserAlert(user, null, logout, navigate);
        await userNotStore(user, logout, navigate);
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || null)
        setIsStore(user?.store || null);
        fetchUserData()
    }, [])


    const [userDropdownOpen, setUserDropdownOpen] = useState(false); // Estado para el dropdown del usuario

    const displayName = user?.name || 'Invitado'; // Uso de encadenamiento opcional para más seguridad
    const displayRole = isStore ? `${isStore?.nombre} - ${user?.role}` : user?.role || 'N/A'; // Uso de encadenamiento opcional

    // Definición de colores primarios para consistencia
    const primaryBlueText = 'text-blue-600 hover:text-blue-700 focus:text-blue-700'; // Azul para iconos y texto interactivo
    const primaryRingBlue = 'focus:ring-blue-500'; // Anillo de enfoque azul
    const buttonHoverBg = 'hover:bg-blue-50'; // Fondo de hover ligero para botones/enlaces

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

                {/* Left Section: Mobile Menu Button and Logo (for smaller screens) */}
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className={`md:hidden p-2 rounded-md ${primaryBlueText} focus:outline-none focus:ring-2 focus:ring-inset ${primaryRingBlue}`}
                        aria-label="Abrir menú lateral"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    {/* Logo para móviles (aparece cuando la sidebar está oculta) */}
                    <Link to="/dashboard" className="flex items-center space-x-2 ml-4 mr-6 md:hidden">
                        {/* Asegúrate de que la ruta de tu logo sea correcta */}
                        <img src="/assets/logo.png" alt="Logo SmartPay" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-bold text-gray-800">SmartPay</span>
                    </Link>
                </div>

                {/* Center Section: Search Bar (Hidden on extra small screens, centered on medium/large) */}
                {/* <div className="flex-1 max-w-xl mx-auto hidden sm:flex justify-center">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar en SmartPay..."
                            className="block w-full pl-10 pr-4 py-2 text-sm border rounded-full bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 transition duration-150 ease-in-out"
                        />
                    </div>
                </div> */}

                {/* Right Section: Notifications and User Profile */}
                <div className="flex items-center space-x-4 ml-auto"> {/* ml-auto empuja los elementos a la derecha */}

                    {/* Notificaciones (solo para roles específicos) */}
                    {/* {(user && (user.role === 'Superadmin' || user.role === 'Vendedor')) && (
                        <button
                            className={`p-2 rounded-full text-gray-500 ${buttonHoverBg} ${primaryBlueText} focus:outline-none focus:ring-2 focus:ring-offset-2 ${primaryRingBlue} relative transition-colors duration-150 ease-in-out`}
                            aria-label="Notificaciones"
                        >
                            <BellIcon className="h-6 w-6" />
                            
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        </button>
                    )} */}

                    {/* User Profile / Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center space-x-2 p-1 rounded-full text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                            aria-expanded={userDropdownOpen}
                            aria-haspopup="true"
                        >
                            {/* Puedes usar UserCircleIcon de Heroicons si no tienes una imagen de perfil */}
                            {/* <UserCircleIcon className="h-9 w-9" /> */}
                            {/* O la imagen de perfil si tienes una URL */}
                            <img
                                className="h-9 w-9 rounded-full object-cover"
                                src={user?.profile_picture_url || '../assets/default-user.svg'} // Fallback a una imagen genérica
                                alt="Foto de perfil"
                            />
                            <div className="hidden sm:block text-left mr-2"> {/* Agregado mr-2 para un poco de espacio */}
                                <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                                <p className="text-xs text-gray-500">{displayRole}</p>
                            </div>
                            {/* Icono para indicar dropdown si lo deseas */}
                            {/* <ChevronDownIcon className="h-4 w-4 text-gray-400 hidden sm:block" /> */}
                        </button>

                        {/* User Dropdown Content */}
                        {userDropdownOpen && user && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                            >
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setUserDropdownOpen(false)} // Cierra dropdown al hacer clic
                                >
                                    Mi Perfil
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setUserDropdownOpen(false); // Cierra dropdown al cerrar sesión
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;