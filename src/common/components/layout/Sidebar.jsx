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
    ArrowLeftOnRectangleIcon, 
    UsersIcon,
} from '@heroicons/react/24/outline';
import { FaHome } from 'react-icons/fa';

import { useAuth } from '../../context/AuthProvider';


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout, testChangeRole } = useAuth();

    const superadminNavItems = [
        { name: 'Dashboard', icon: Squares2X2Icon, href: '/dashboard' },
        { name: 'Gestión de Usuarios', icon: UsersIcon, href: '/user-management' },
        { name: 'Gestión de Clientes', icon: UserGroupIcon, href: '/customers-management' },
        { name: 'Gestión de Vendedores', icon: UserGroupIcon, href: '/vendors-management' },
        { name: 'Gestión de Dispositivos', icon: DevicePhoneMobileIcon, href: '/devices-management' },
        { name: 'Pagos y Facturación', icon: CreditCardIcon, href: '/payments-management' },
        { name: 'Reportes y Análisis', icon: ChartBarIcon, href: '/reports' },
    ];

    const adminNavItems = [ 
        { name: 'Dashboard', icon: Squares2X2Icon, href: '/dashboard' },
        { name: 'Gestión de Clientes', icon: UserGroupIcon, href: '/customers-management' },
        { name: 'Gestión de Vendedores', icon: UserGroupIcon, href: '/vendors-management' },
        { name: 'Gestión de Dispositivos', icon: DevicePhoneMobileIcon, href: '/devices-management' },
        { name: 'Pagos y Facturación', icon: CreditCardIcon, href: '/payments-management' },
    ];

    const vendedorNavItems = [
        { name: 'Dashboard', icon: Squares2X2Icon, href: '/dashboard' },
        { name: 'Gestión de Clientes', icon: UserGroupIcon, href: '/customers-management' },
        { name: 'Gestión de Dispositivos', icon: DevicePhoneMobileIcon, href: '/devices-management' },
        { name: 'Pagos y Facturación', icon: CreditCardIcon, href: '/payments-management' },
    ];

    const clienteNavItems = [
        { name: 'Dashboard', icon: DevicePhoneMobileIcon, href: '/clien/dashboard' },
        { name: 'Mis Dispositivos', icon: DevicePhoneMobileIcon, href: '/my-devices' },
        { name: 'Realizar Pago', icon: CreditCardIcon, href: '/make-payment' },
    ];

    let navigationToRender = [];

    let showRoleSwitcher = false;

    if (user) {
        switch (user.role) {
            case 'Superadmin':
                navigationToRender = superadminNavItems;
                showRoleSwitcher = true;
                break;
            case 'Admin': 
                navigationToRender = adminNavItems;
                showRoleSwitcher = true;
                break;
            case 'Vendedor':
                navigationToRender = vendedorNavItems;
                break;
            case 'Cliente':
                navigationToRender = clienteNavItems;
                break;
            default:
                navigationToRender = [];
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white shadow-lg
                            transform transition-transform duration-300 ease-in-out
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:translate-x-0 md:static md:flex md:flex-col`}
            >
                <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                            <img src="/assets/logo.png" alt="Logo SmartPay" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            SmartPay
                        </span>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-label="Cerrar menú lateral"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navigationToRender.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/dashboard'}
                            className={({ isActive }) =>
                                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`
                            }
                            onClick={() => {
                                if (sidebarOpen) {
                                    setSidebarOpen(false);
                                }
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors duration-150 ease-in-out
                                        ${isActive
                                                ? 'text-white'
                                                : 'text-slate-400 group-hover:text-slate-300'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>


                <div className="px-3 py-4 mt-auto border-t border-slate-700">

                    {user && (
                        <div className="text-slate-300 text-sm mb-4">
                            Hola, <span className="font-semibold">{user.name}</span> (<span className="font-semibold">{user.role}</span>)
                        </div>
                    )}


                    {showRoleSwitcher && import.meta.env.DEV && (
                        <div className="mb-4">
                            <label htmlFor="role-switcher" className="block text-slate-400 text-sm font-medium mb-1">
                                Cambiar Rol (DEV)
                            </label>
                            <select
                                id="role-switcher"
                                onChange={(e) => testChangeRole(e.target.value)}
                                value={user ? user.role : ''}
                                className="w-full p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {['Superadmin', 'Admin', 'Vendedor', 'Cliente'].map(roleOption => (
                                    <option key={roleOption} value={roleOption}>
                                        {roleOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}


                    <NavLink
                        to="/landing"
                        className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150 ease-in-out"
                        onClick={() => { if (sidebarOpen) setSidebarOpen(false); }}
                    >
                        <FaHome className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400 group-hover:text-slate-300" />
                        Landing Page
                    </NavLink>

                    <button
                        onClick={() => {
                            logout();
                            if (sidebarOpen) setSidebarOpen(false);
                        }}
                        className="group flex items-center w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150 ease-in-out mt-2"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400 group-hover:text-slate-300" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;