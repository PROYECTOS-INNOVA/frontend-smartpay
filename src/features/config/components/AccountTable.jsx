import { TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const AccountTable = ({ accounts, onDelete }) => {

    const handleDelete = (factory_reset_protection_id) => {
            e.preventDefault();
            onDelete(factory_reset_protection_id);
        };

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ACCOUNT ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            NOMBRE
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {accounts && accounts.length > 0 ? (
                        accounts.map((account) => {
                            const isActive = account.state?.toLowerCase() === 'active';
                            const statusClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                            const statusText = isActive ? 'Activo' : 'Inactivo';

                            return (
                                <tr key={account.account_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.account_id || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => {}}
                                            className={`inline-flex items-center px-2 py-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${statusClasses}`}
                                            title={`Cambiar a ${isActive ? 'Inactivo' : 'Activo'}`}
                                        >
                                            {statusText}
                                            {isActive ? (
                                                <LockOpenIcon className="h-4 w-4 ml-1" />
                                            ) : (
                                                <LockClosedIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={  () => handleDelete(account.factory_reset_protection_id) }
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar Cuenta"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay cuentas para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AccountTable;