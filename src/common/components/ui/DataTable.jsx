import React from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Opcional: Iconos para estado

const UserTable = ({ users, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="overflow-x-auto shadow-lg rounded-lg">
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.dni}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {`${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`.trim()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.role?.name || 'N/A'} {/* Accede a user.role.name */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.city?.name || 'N/A'} {/* Accede a user.city.name */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.state === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.state === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(user)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    title="Editar usuario"
                                >
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                </button>
                                <button
                                    onClick={() => onDelete(user.user_id)}
                                    className="text-red-600 hover:text-red-900 mr-3"
                                    title="Eliminar usuario"
                                >
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>
                                <button
                                    onClick={() => onToggleStatus(user.user_id, user.state)}
                                    className={`${user.state === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                                    title={`Cambiar a ${user.state === 'active' ? 'Inactivo' : 'Activo'}`}
                                >
                                    {user.state === 'active' ? (
                                        <XCircleIcon className="h-5 w-5 inline-block" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 inline-block" />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;