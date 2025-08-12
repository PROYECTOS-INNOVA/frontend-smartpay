import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, PhoneIcon, HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'; // Importa nuevos íconos

// Importa SweetAlert2 y el wrapper de React
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Crea una instancia de SweetAlert2 con capacidad para React
const MySwal = withReactContent(Swal);

// Define la URL base de tu API principal
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const RegisterPage = () => {
    // Definimos los estados para cada campo del formulario
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '', // Añadido para que coincida con el backend
        password: '',
        confirmPassword: '',
        dni: '',
        phone: '',
        address: '',
        city_id: 'b1c7d9e4-0a6f-4b3c-8e2d-1a7f0c9b5d3a', // Ejemplo: deberías obtenerlo de tu backend o permitir selección
        role_id: 'c1b2a3d4-e5f6-7890-1234-56789abcdef0', // Ejemplo: ID de rol de "Cliente"
        prefix: '+57', // Ejemplo: prefijo de Colombia. Podrías hacer un select para esto.
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Ya no necesitamos error ni debugMessage aquí, SweetAlert lo maneja

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones en el frontend
        if (formData.password !== formData.confirmPassword) {
            MySwal.fire({
                icon: 'error',
                title: 'Error de Validación',
                text: 'Las contraseñas no coinciden.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Preparamos los datos para enviar al backend
        const userData = {
            city_id: formData.city_id,
            dni: formData.dni,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            prefix: formData.prefix,
            phone: formData.phone,
            address: formData.address,
            username: formData.username.toLowerCase(), // Normalizar a minúsculas
            password: formData.password,
            role_id: formData.role_id,
            state: "Active", // Por defecto, activo al registrarse
        };

        try {
            // La URL para registrar usuarios es /api/v1/users (POST)
            const response = await axios.post(`${API_BASE_URL}/api/v1/users`, userData);

            if (response.data && response.status === 201) {
                MySwal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    navigate('/login'); // Redirige al login después de un registro exitoso
                });
            } else {
                MySwal.fire({
                    icon: 'warning',
                    title: 'Problema en el Registro',
                    text: 'Respuesta inesperada del servidor. Inténtalo de nuevo.',
                    footer: `<pre><code>${JSON.stringify(response.data, null, 2)}</code></pre>`,
                    confirmButtonText: 'Entendido'
                });
            }
        } catch (err) {
            console.error("Error durante el registro:", err);
            let errorMessage = 'Ocurrió un error inesperado al registrarte.';
            let debugDetails = '';

            if (axios.isAxiosError(err)) {
                if (err.response) {
                    errorMessage = err.response.data.detail || err.response.statusText || 'Error en los datos de registro.';
                    debugDetails = `Detalles del error (API): ${JSON.stringify(err.response.data, null, 2)}`;
                } else if (err.request) {
                    errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o que el Backend Gateway API esté funcionando.';
                    debugDetails = 'El backend no respondió.';
                } else {
                    errorMessage = `Error al configurar la solicitud: ${err.message}`;
                    debugDetails = `Mensaje de error Axios: ${err.message}`;
                }
            } else {
                errorMessage = `Error interno: ${err.message}`;
                debugDetails = `Error JS: ${err.message}`;
            }

            MySwal.fire({
                icon: 'error',
                title: 'Error en el Registro',
                text: errorMessage,
                footer: debugDetails ? `<h5>Detalles de Depuración:</h5><pre><code>${debugDetails}</code></pre>` : '',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased relative"
            style={{
                backgroundImage: 'url(/assets/images/background-login.png)', // Usamos la misma imagen de fondo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md"></div>

            <div className="relative z-10 flex w-full max-w-6xl h-[650px] bg-white rounded-xl shadow-2xl overflow-hidden"> {/* Aumentado el alto para más campos */}
                <div
                    className="hidden lg:flex w-1/2 relative justify-center items-end p-8"
                    style={{
                        backgroundImage: 'url(/assets/images/login.png)', // Puedes usar una imagen diferente para el registro si quieres
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                    <Link to="/landing" className="absolute top-6 left-6 text-white text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 z-20">
                        <ArrowRightIcon className="h-4 w-4 transform rotate-180" />
                        Volver al inicio
                    </Link>

                    <div className="relative text-white p-6 pb-12 w-full text-center z-10">
                        <h1 className="text-4xl font-extrabold leading-tight mb-4">
                            Regístrate en SmartPay
                        </h1>
                        <p className="text-lg opacity-90">
                            Crea tu cuenta y empieza a gestionar tus finanzas hoy mismo.
                        </p>
                        <div className="flex justify-center mt-8 space-x-2">
                            <span className="h-2 w-2 rounded-full bg-white opacity-50"></span>
                            <span className="h-2 w-8 rounded-full bg-white"></span>
                            <span className="h-2 w-2 rounded-full bg-white opacity-50"></span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto"> {/* Añadido overflow-y-auto para scroll si hay muchos campos */}
                    <div className="flex justify-center mb-6">
                        <img src="/assets/logo.png" alt="Logo SmartPay" className="h-12 w-auto" />
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Crear Cuenta</h2>
                    <p className="text-gray-600 text-center mb-8">
                        Ingresa tus datos para registrarte.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4"> {/* Reducido el espacio para más campos */}
                        {/* First Name */}
                        <div>
                            <label htmlFor="first_name" className="input-label">
                                Nombre
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Tu nombre"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="last_name" className="input-label">
                                Apellido
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Tu apellido"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="input-label">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <EnvelopeIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="ejemplo@dominio.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="input-label">
                                Nombre de usuario
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Define tu nombre de usuario"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* DNI */}
                        <div>
                            <label htmlFor="dni" className="input-label">
                                DNI / Cédula
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <IdentificationIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="text"
                                    id="dni"
                                    name="dni"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Tu número de identificación"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="input-label">
                                Teléfono
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <PhoneIcon className="h-4 w-4" />
                                </span>
                                {/* Podrías agregar un select para 'prefix' si el usuario necesita cambiarlo */}
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Tu número de teléfono (ej: 3101234567)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="input-label">
                                Dirección
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <HomeIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="Tu dirección principal"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Role ID (Para propósitos de registro de usuario general, "Cliente" suele ser el predeterminado) */}
                        <div>
                            <label htmlFor="role_id" className="input-label">
                                Tipo de Cuenta
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <BuildingOfficeIcon className="h-4 w-4" />
                                </span>
                                <select
                                    id="role_id"
                                    name="role_id"
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    required
                                >
                                    {/* Estos IDs de rol son ejemplos. DEBERÍAS OBTENERLOS DE TU BACKEND o saberlos de antemano. */}
                                    <option value="c1b2a3d4-e5f6-7890-1234-56789abcdef0">Cliente</option>
                                    <option value="a2b3c4d5-e6f7-8901-2345-67890abcdef0">Vendedor</option>
                                    {/* No deberías permitir registrar admins o superadmins desde un formulario público.
                                    Si necesitas registrarlos, hazlo desde un panel de administración. */}
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="input-label">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LockClosedIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="block w-full pl-10 pr-10 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="•••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="input-label">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <LockClosedIcon className="h-4 w-4" />
                                </span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="block w-full pl-10 pr-10 py-2 rounded-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    placeholder="•••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-900 mt-6"
                        >
                            Registrarse
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        ¿Ya tienes una cuenta? {' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;