import { Link } from 'react-router-dom';
import { useState } from 'react';

const LandingPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Gracias por suscribirte! Te enviaremos información a ${email}`);
        setEmail('');
    };

    return (
        <div className="bg-gray-100 font-sans antialiased"> 
            {/* Header */}
            <header className="text-gray-700 body-font bg-white shadow-lg sticky top-0 z-50"> 
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <img src="/assets/logo.png" alt="SmartPay Logo" width="50" className="mr-2" /> 
                        <span className="ml-2 text-3xl font-extrasemibold text-gray-900"> 
                            Smart<span className="text-blue-600">Pay</span> 
                        </span>
                    </Link>
                    <nav className="md:ml-auto flex flex-wrap items-center text-lg justify-center font-semisemibold"> 
                        <Link to="/features" className="mr-6 hover:text-blue-600 transition-colors duration-300">Funcionalidades</Link>
                        <Link to="/pricing" className="mr-6 hover:text-blue-600 transition-colors duration-300">Precios</Link>
                        <Link to="/about" className="mr-6 hover:text-blue-600 transition-colors duration-300">Nosotros</Link>
                        <Link to="/contact" className="mr-6 hover:text-blue-600 transition-colors duration-300">Contacto</Link>
                    </nav>
                    <Link to="/login" className="inline-flex items-center bg-blue-600 text-white border-0 py-3 px-8 focus:outline-none hover:bg-blue-700 rounded-full text-lg mt-4 md:mt-0 font-semibold shadow-md hover:shadow-lg transition-all duration-300"> {/* Botón más grande, redondeado y con sombra */}
                        Iniciar Sesión
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-gray-700 body-font bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative"> {/* Gradiente más suave, fondo más dinámico */}
                <div className="container mx-auto flex px-5 py-32 md:flex-row flex-col items-center relative z-10"> {/* Más padding vertical */}
                    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                        <h1 className="title-font sm:text-5xl text-4xl mb-6 font-extrasemibold text-gray-900 leading-tight"> {/* Texto más grande, más audaz y mejor interlineado */}
                            Control total sobre tus <span className="text-blue-600">ventas a crédito</span> de dispositivos móviles
                        </h1>
                        <p className="mb-10 leading-relaxed text-lg text-gray-700 max-w-lg"> {/* Texto más grande y con más espacio */}
                            SmartPay te permite **administrar, bloquear y rastrear** dispositivos vendidos a crédito de manera eficiente. Reduce la morosidad y aumenta tu tasa de recuperación con nuestra plataforma inteligente.
                        </p>
                        <div className="flex justify-center flex-wrap gap-4"> {/* Gap entre botones */}
                            <Link to="/demo" className="inline-flex text-white bg-blue-600 border-0 py-3 px-8 focus:outline-none hover:bg-blue-700 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"> {/* Botón primario más impactante */}
                                Solicitar Demo
                            </Link>
                            <Link to="/features" className="inline-flex text-gray-800 bg-white border border-gray-300 py-3 px-8 focus:outline-none hover:bg-gray-100 rounded-full text-xl font-semisemibold shadow-md hover:shadow-lg transition-all duration-300"> {/* Botón secundario más suave */}
                                Ver Funcionalidades
                            </Link>
                        </div>
                    </div>
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 relative">
                        <img className="object-cover object-center rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" alt="hero" src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" />
                        {/* Puedes añadir una superposición o gradiente sutil a la imagen para un look más moderno */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-10 rounded-2xl"></div>
                    </div>
                </div>
                {/* Opcional: Elementos de fondo abstractos para un look más moderno */}
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            </section>

            {/* Features Section */}
            <section className="text-gray-700 body-font bg-white py-28"> {/* Más padding vertical */}
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h2 className="text-base text-blue-600 tracking-widest font-semibold title-font mb-2 uppercase">PLATAFORMA INTEGRAL</h2> {/* Texto más grande y negrita */}
                        <h1 className="sm:text-4xl text-3xl font-extrasemibold title-font text-gray-900">Controla tus dispositivos con SmartPay</h1>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {/* Feature 1 */}
                        <div className="p-4 md:w-1/3">
                            <div className="flex rounded-lg h-full bg-gray-50 p-8 flex-col border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"> {/* Bordes más visibles al hover, sombra al hover */}
                                <div className="flex items-center mb-4"> {/* Margen inferior consistente */}
                                    <div className="w-10 h-10 mr-4 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 shadow-md"> {/* Tamaño del icono, margen y sombra */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold">Bloqueo Remoto</h2> {/* Texto más grande y audaz */}
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        Bloquea dispositivos de manera remota cuando los pagos están atrasados, incentivando a tus clientes a mantenerse al día.
                                    </p>
                                    <Link to="/features#blocking" className="mt-4 text-blue-600 inline-flex items-center font-semisemibold hover:text-blue-800 transition-colors duration-300"> {/* Más margen superior, negrita */}
                                        Aprende más
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-4 md:w-1/3">
                            <div className="flex rounded-lg h-full bg-gray-50 p-8 flex-col border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 mr-4 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold">Rastreo GPS</h2>
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        Localiza dispositivos en tiempo real con nuestro sistema de geolocalización integrado para mayor seguridad y recuperación.
                                    </p>
                                    <Link to="/features#tracking" className="mt-4 text-blue-600 inline-flex items-center font-semisemibold hover:text-blue-800 transition-colors duration-300">
                                        Aprende más
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-4 md:w-1/3">
                            <div className="flex rounded-lg h-full bg-gray-50 p-8 flex-col border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 mr-4 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold">Gestión de Pagos</h2>
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        Sistema completo de administración de pagos con recordatorios automáticos y múltiples métodos de pago integrados.
                                    </p>
                                    <Link to="/features#payments" className="mt-4 text-blue-600 inline-flex items-center font-semisemibold hover:text-blue-800 transition-colors duration-300">
                                        Aprende más
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="text-gray-700 body-font bg-gray-100 py-28"> {/* Fondo sutil, más padding vertical */}
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h2 className="text-base text-blue-600 tracking-widest font-semibold title-font mb-2 uppercase">PROCESO SIMPLE</h2>
                        <h1 className="sm:text-4xl text-3xl font-extrasemibold title-font text-gray-900">Cómo funciona SmartPay en 4 pasos</h1> {/* Título más específico */}
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-gray-700 mt-4">
                            Nuestra plataforma se integra fácilmente con tu negocio para ofrecer seguridad y control en cada venta a crédito, en solo unos clics.
                        </p>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {/* Step 1 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="flex rounded-lg h-full bg-white p-8 flex-col border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"> {/* Sombra más pronunciada, hover efecto */}
                                <div className="flex items-center mb-6"> {/* Margen inferior del número */}
                                    <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 font-semibold text-2xl shadow-inner"> {/* Número más grande, sombra interior */}
                                        1
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold ml-4">Registra el dispositivo</h2> {/* Margen y negrita */}
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        Registra cada dispositivo vendido en nuestro sistema con los datos del cliente y los términos del crédito de forma rápida.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Step 2 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="flex rounded-lg h-full bg-white p-8 flex-col border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 font-semibold text-2xl shadow-inner">
                                        2
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold ml-4">Instala nuestra app</h2>
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        El cliente instala la aplicación SmartPay en su dispositivo para habilitar las funciones de seguridad y monitoreo.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Step 3 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="flex rounded-lg h-full bg-white p-8 flex-col border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 font-semibold text-2xl shadow-inner">
                                        3
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold ml-4">Monitorea pagos</h2>
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        Nuestro sistema monitorea los pagos automáticamente y envía recordatorios a los clientes para mantenerlos al día.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Step 4 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="flex rounded-lg h-full bg-white p-8 flex-col border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 font-semibold text-2xl shadow-inner">
                                        4
                                    </div>
                                    <h2 className="text-gray-900 text-xl title-font font-semibold ml-4">Acción inteligente</h2>
                                </div>
                                <div className="flex-grow">
                                    <p className="leading-relaxed text-base text-gray-700">
                                        En caso de morosidad, el sistema puede bloquear el dispositivo o alertarte para que tomes acción inmediata.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="text-white body-font bg-blue-700 py-28 relative overflow-hidden"> {/* Fondo azul más oscuro, más padding, overflow hidden */}
                <div className="absolute inset-0 bg-pattern-dots opacity-10 z-0"></div> {/* Patrón de fondo sutil */}
                <div className="container px-5 mx-auto relative z-10">
                    <div className="flex flex-wrap -m-4 text-center">
                        <div className="p-4 sm:w-1/4 w-1/2">
                            <h2 className="title-font font-extrasemibold sm:text-5xl text-4xl mb-2 text-white">98%</h2> {/* Texto más grande y blanco */}
                            <p className="leading-relaxed text-blue-100 text-lg">Tasa de Recuperación</p> {/* Texto más claro */}
                        </div>
                        <div className="p-4 sm:w-1/4 w-1/2">
                            <h2 className="title-font font-extrasemibold sm:text-5xl text-4xl mb-2 text-white">24/7</h2>
                            <p className="leading-relaxed text-blue-100 text-lg">Monitoreo Continuo</p>
                        </div>
                        <div className="p-4 sm:w-1/4 w-1/2">
                            <h2 className="title-font font-extrasemibold sm:text-5xl text-4xl mb-2 text-white">500+</h2>
                            <p className="leading-relaxed text-blue-100 text-lg">Clientes Satisfechos</p>
                        </div>
                        <div className="p-4 sm:w-1/4 w-1/2">
                            <h2 className="title-font font-extrasemibold sm:text-5xl text-4xl mb-2 text-white">99.9%</h2>
                            <p className="leading-relaxed text-blue-100 text-lg">Disponibilidad del Servicio</p> {/* Más descriptivo */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="text-gray-700 body-font bg-white py-28">
                <div className="container px-5 mx-auto">
                    <h1 className="text-4xl font-extrasemibold title-font text-gray-900 mb-16 text-center">Lo que dicen nuestros clientes</h1> {/* Título más grande y enfático */}
                    <div className="flex flex-wrap -m-4">
                        {/* Testimonial 1 */}
                        <div className="p-4 md:w-1/2 w-full">
                            <div className="h-full bg-gray-50 p-10 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"> {/* Más padding, bordes redondeados, sombra y hover */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-8 h-8 text-blue-400 mb-6" viewBox="0 0 975.036 975.036"> {/* Icono más grande y con color de marca */}
                                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                                </svg>
                                <p className="leading-relaxed mb-8 text-lg text-gray-700"> {/* Texto más grande, más espacio */}
                                    "SmartPay ha transformado nuestro negocio de venta de celulares a crédito. Antes teníamos un 30% de morosidad, ahora es menos del 5%. ¡Los clientes pagan a tiempo sabiendo que su dispositivo puede ser bloqueado, lo que nos ha dado una tranquilidad enorme!"
                                </p>
                                <a className="inline-flex items-center">
                                    <img alt="testimonial" src="https://randomuser.me/api/portraits/men/32.jpg" className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center border-2 border-blue-600" /> {/* Imagen más grande, con borde */}
                                    <span className="flex-grow flex flex-col pl-4">
                                        <span className="title-font font-semibold text-gray-900 text-lg">Carlos Méndez</span> {/* Negrita y tamaño */}
                                        <span className="text-gray-600 text-sm">Dueño, Celulares MX</span> {/* Color más oscuro */}
                                    </span>
                                </a>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="p-4 md:w-1/2 w-full">
                            <div className="h-full bg-gray-50 p-10 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-8 h-8 text-blue-400 mb-6" viewBox="0 0 975.036 975.036">
                                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                                </svg>
                                <p className="leading-relaxed mb-8 text-lg text-gray-700">
                                    "La plataforma es increíblemente fácil de usar. Podemos ver el estado de todos nuestros dispositivos en un solo lugar y tomar acción inmediata cuando es necesario. ¡Y el soporte técnico es excepcional, siempre están ahí para ayudar!"
                                </p>
                                <a className="inline-flex items-center">
                                    <img alt="testimonial" src="https://randomuser.me/api/portraits/women/44.jpg" className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center border-2 border-blue-600" />
                                    <span className="flex-grow flex flex-col pl-4">
                                        <span className="title-font font-semibold text-gray-900 text-lg">María Fernández</span>
                                        <span className="text-gray-600 text-sm">Gerente, TechCredito</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-gray-700 body-font bg-gradient-to-tr from-blue-500 to-indigo-600 py-28 text-white"> {/* Gradiente más fuerte, texto blanco, más padding */}
                <div className="container px-5 mx-auto">
                    <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto bg-white p-10 rounded-xl shadow-2xl relative z-10 text-gray-900"> {/* Fondo blanco, más padding, sombra más grande */}
                        <div className="flex-grow">
                            <h1 className="text-3xl font-extrasemibold title-font mb-2">¿Listo para transformar tu negocio?</h1> {/* Texto más grande y audaz */}
                            <p className="leading-relaxed text-lg text-gray-700">
                                Comienza hoy mismo con SmartPay y **reduce la morosidad** en tus ventas a crédito. ¡Es más fácil de lo que crees!
                            </p>
                        </div>
                        <Link to="/signup" className="flex-shrink-0 text-white bg-blue-600 border-0 py-4 px-10 focus:outline-none hover:bg-blue-700 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-8 sm:mt-0 sm:ml-10"> {/* Botón más grande y espacioso */}
                            Registrarse Gratis
                        </Link>
                    </div>
                </div>
                {/* Fondo abstracto para la sección CTA */}
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0c766715?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80")' }}></div> {/* Imagen de fondo abstracta */}
            </section>

            {/* FAQ Section */}
            <section className="text-gray-700 body-font bg-gray-100 py-28"> {/* Fondo sutil, más padding */}
                <div className="container px-5 mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="sm:text-4xl text-3xl font-extrasemibold title-font text-gray-900 mb-4">Preguntas Frecuentes</h1>
                        <div className="flex mt-6 justify-center">
                            <div className="w-20 h-1 rounded-full bg-blue-600 inline-flex"></div> {/* Línea más gruesa y más ancha */}
                        </div>
                    </div>
                    <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                        <div className="w-full lg:w-1/2 px-4 py-3"> {/* Más padding vertical */}
                            <details className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"> {/* Más padding, sombra, hover efecto */}
                                <summary className="font-semibold cursor-pointer focus:outline-none text-gray-900 text-lg flex items-center justify-between"> {/* Negrita, más grande, alineación */}
                                    ¿Cómo funciona el bloqueo de dispositivos?
                                    <svg className="w-5 h-5 text-blue-600 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="mt-4 text-gray-700 leading-relaxed text-base border-t border-gray-100 pt-4"> {/* Más margen, borde superior */}
                                    Nuestra aplicación se instala en el dispositivo del cliente. Si un pago se atrasa, nuestro sistema envía primero recordatorios automáticos. Si el pago no se realiza, podemos bloquear el dispositivo remotamente, permitiendo solo llamadas de emergencia hasta que se regularice la situación.
                                </p>
                            </details>
                            <details className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                <summary className="font-semibold cursor-pointer focus:outline-none text-gray-900 text-lg flex items-center justify-between">
                                    ¿Es legal bloquear los dispositivos?
                                    <svg className="w-5 h-5 text-blue-600 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="mt-4 text-gray-700 leading-relaxed text-base border-t border-gray-100 pt-4">
                                    Sí, siempre que los términos del bloqueo estén claramente establecidos en el contrato que el cliente firma al adquirir el dispositivo a crédito. Proveemos plantillas de contratos que cumplen con las regulaciones locales para asegurar la legalidad.
                                </p>
                            </details>
                        </div>
                        <div className="w-full lg:w-1/2 px-4 py-3">
                            <details className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                <summary className="font-semibold cursor-pointer focus:outline-none text-gray-900 text-lg flex items-center justify-between">
                                    ¿Qué métodos de pago aceptan?
                                    <svg className="w-5 h-5 text-blue-600 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="mt-4 text-gray-700 leading-relaxed text-base border-t border-gray-100 pt-4">
                                    Integramos con múltiples pasarelas de pago para aceptar tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo en establecimientos autorizados. Estamos constantemente añadiendo nuevas opciones para tu comodidad.
                                </p>
                            </details>
                            <details className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                <summary className="font-semibold cursor-pointer focus:outline-none text-gray-900 text-lg flex items-center justify-between">
                                    ¿Cómo protegen la privacidad de los datos?
                                    <svg className="w-5 h-5 text-blue-600 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <p className="mt-4 text-gray-700 leading-relaxed text-base border-t border-gray-100 pt-4">
                                    La privacidad y seguridad de los datos son nuestra prioridad. Cumplimos con las regulaciones de protección de datos más estrictas. Los datos de ubicación solo se activan en caso de morosidad y los clientes son notificados sobre qué datos recopilamos y cómo los usamos, siempre con su consentimiento.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="text-gray-700 body-font bg-blue-600 py-32 text-white"> {/* Fondo azul, más padding, texto blanco */}
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col text-center w-full mb-16"> {/* Más margen inferior */}
                        <h1 className="sm:text-4xl text-3xl font-extrasemibold title-font mb-4 text-white">Ponte en Contacto con SmartPay</h1> {/* Título más grande, audaz y blanco */}
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-blue-100"> {/* Texto más claro */}
                            ¿Tienes preguntas, necesitas una demostración personalizada o quieres saber más sobre cómo SmartPay puede beneficiar tu negocio? Déjanos tu correo y te contactaremos a la brevedad.
                        </p>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full bg-white p-10 rounded-xl shadow-2xl"> {/* Fondo blanco para el formulario, más padding, sombra */}
                            <div className="relative mb-6 w-full sm:w-3/4 lg:w-2/3"> {/* Más margen inferior, tamaño del input */}
                                <label htmlFor="email_contact" className="leading-7 text-sm text-gray-600 sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email_contact"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu dirección de email"
                                    required
                                    className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-800 py-3 px-5 leading-8 transition-colors duration-200 ease-in-out shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-600 border-0 py-3 px-10 focus:outline-none hover:bg-blue-700 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Recibir Información
                            </button>
                        </form>
                        <div className="text-center mt-10"> {/* Más margen superior */}
                            <p className="text-md text-blue-100">
                                O si prefieres, escríbenos directamente a <Link to="mailto:contacto@smartpay.com" className="text-white font-semibold hover:underline">contacto@smartpay.com</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-gray-600 body-font bg-gray-900 text-white border-t border-gray-800 pt-16"> {/* Fondo oscuro, más padding, texto blanco */}
                <div className="container px-5 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                    <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                        <Link to="/" className="flex title-font font-medium items-center md:justify-start justify-center text-white"> {/* Texto blanco */}
                            <img src="/assets/logo.png" alt="SmartPay Logo" width="50" className="mr-2" /> {/* Logo invertido para verse en fondo oscuro, ajustado brillo */}
                            <span className="ml-3 text-3xl font-extrasemibold text-white">Smart<span className="text-blue-500">Pay</span></span> {/* Texto blanco, azul claro para contraste */}
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">Control inteligente para tus ventas a crédito.</p> {/* Texto más claro */}
                        <div className="mt-4 flex justify-center md:justify-start space-x-4">
                            {/* Iconos de Redes Sociales (ejemplo) */}
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <h2 className="title-font font-semibold text-white tracking-widest text-lg mb-3">PRODUCTO</h2>
                            <nav className="list-none mb-10">
                                <li><Link to="/features" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Funcionalidades</Link></li>
                                <li><Link to="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Precios</Link></li>
                                <li><Link to="/demo" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Demo</Link></li>
                            </nav>
                        </div>
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <h2 className="title-font font-semibold text-white tracking-widest text-lg mb-3">EMPRESA</h2>
                            <nav className="list-none mb-10">
                                <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Nosotros</Link></li>
                                <li><Link to="/team" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Equipo</Link></li>
                                <li><Link to="/careers" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Carreras</Link></li>
                            </nav>
                        </div>
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <h2 className="title-font font-semibold text-white tracking-widest text-lg mb-3">SOPORTE</h2>
                            <nav className="list-none mb-10">
                                <li><Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">FAQ</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Contacto</Link></li>
                                <li><Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Términos</Link></li>
                            </nav>
                        </div>
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <h2 className="title-font font-semibold text-white tracking-widest text-lg mb-3">LEGAL</h2>
                            <nav className="list-none mb-10">
                                <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Privacidad</Link></li>
                                <li><Link to="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Cookies</Link></li>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 mt-10">
                    <div className="container mx-auto py-6 px-5 flex flex-wrap flex-col sm:flex-row">
                        <p className="text-gray-400 text-sm text-center sm:text-left">© {new Date().getFullYear()} SmartPay. Todos los derechos reservados.</p>
                        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                            {/* Puedes añadir enlaces a políticas específicas o más iconos de redes */}
                            <Link to="/sitemap" className="text-gray-400 ml-4 hover:text-blue-400 transition-colors duration-300">Mapa del sitio</Link>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;