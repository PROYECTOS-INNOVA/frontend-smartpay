import React from 'react';
import { PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'; // Asegúrate de importar los nuevos iconos

const UserTable = ({ users, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DNI
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre Completo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ciudad
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
                    {users.map((user) => {
                        const isActive = user.state?.toLowerCase() === 'active';
                        const statusClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                        const statusText = isActive ? 'Activo' : 'Inactivo';

                        return (
                            <tr key={user.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.dni}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {`${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`.trim()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.city?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Botón/Span clickeable para cambiar el estado */}
                                    <button
                                        onClick={() => onToggleStatus(user.user_id, user.state)}
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
                                        onClick={() => onEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        title="Editar Usuario"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    {/* El botón de ArrowsUpDownIcon que tenías para el estado ahora se elimina */}
                                    {/* <button
                                        onClick={() => onToggleStatus(user.user_id, user.state)}
                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                        title="Cambiar Estado"
                                    >
                                        <ArrowsUpDownIcon className="h-5 w-5" />
                                    </button> */}
                                    <button
                                        onClick={() => onDelete(user.user_id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Eliminar Usuario"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;