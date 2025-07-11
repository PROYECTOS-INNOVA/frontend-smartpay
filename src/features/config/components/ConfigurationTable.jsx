import { PencilIcon } from '@heroicons/react/24/outline';

const ConfigurationTable = ({ configurations, onEdit }) => {
    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LLAVE
                        </th>
                        <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DESCRIPCIÓN
                        </th>
                        <th scope="col" className="w-1/2 max-w-md px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            VALOR
                        </th>
                         <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {configurations && configurations.length > 0 ? (
                        configurations.map((configuration) => {
                            return (
                                <tr key={configuration.configuration_id}>
                                    <td className="w-1/6 px-6 py-3 py-4 whitespace-nowrap text-sm text-gray-900">{configuration.key}</td>
                                    <td className="w-1/4 px-6 py-3 whitespace-nowrap text-sm text-gray-900">{configuration.description}</td>
                                    <td className="w-1/2 max-w-md px-6 py-4 text-sm text-gray-900 whitespace-normal break-words">{configuration.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={ () => onEdit(configuration)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            title="Editar configuración"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay configuraciones para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ConfigurationTable;