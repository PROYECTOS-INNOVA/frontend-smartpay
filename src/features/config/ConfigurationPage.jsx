import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, LockClosedIcon, MagnifyingGlassIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { getFactoryReset } from '../../api/factory_reset_protection';
import ConfigurationTable from './components/ConfigurationTable';

function ConfigurationPage() {
  const CLIENT_ID = "631597337466-dt7qitq7tg2022rhje5ib5sk0eua6t79.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:8000/api/v1/google/auth/callback";
  const SCOPE = "profile email https://www.googleapis.com/auth/userinfo.profile";

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  const fetchAccounts = useCallback(async () => {
          setLoading(true);
          setError(null);
          try {
              const data = await getFactoryReset();
              setAccounts(data);
          } catch (err) {
              console.error('Error al cargar clientes:', err);
              setError('No se pudieron cargar los clientes. Inténtalo de nuevo más tarde.');
              toast.error('Error al cargar clientes.');
          } finally {
              setLoading(false);
          }
      }, []); 

  // Este useEffect se encargará de cargar los clientes y roles solo una vez al montar el componente.
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]); 

  const login = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-screen">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-3 text-lg text-gray-700">Cargando cuentas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg shadow-md">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Error al cargar datos</h3>
                <p className="text-base">{error}</p>
                <button
                    onClick={fetchAccounts}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // FILTRADO: Ahora el filtrado se realiza sobre el array `accounts` que ya está en el estado
    const filteredAccounts = accounts.filter(account => {
        const searchLower = searchTerm.toLowerCase();

        return (account.email.includes(searchLower));
    });

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <LockClosedIcon className="h-8 w-8 mr-2 text-blue-600" />
                    Cuentas Factory Reset Protection
                </h1>
                <button
                    onClick={() => login()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Añadir Nueva cuenta
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500"
                        placeholder="Buscar cliente por nombre, usuario, email, DNI o estado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredAccounts.length === 0 && !searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes para mostrar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Añade un nuevo cliente para empezar a gestionarlos.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                            Añadir Primer Cliente
                        </button>
                    </div>
                </div>
            ) : filteredAccounts.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "<span className="font-semibold text-blue-600">{searchTerm}</span>" no arrojó resultados. Intenta con otro término.
                    </p>
                </div>
            ) : (
                <ConfigurationTable
                    accounts={filteredAccounts}
                />
            )}
        </div>
    );
}

export default ConfigurationPage;
 