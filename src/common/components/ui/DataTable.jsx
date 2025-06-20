// src/common/components/ui/DataTable.jsx
import React from 'react';
// Asegúrate de que estos iconos se usen en algún lugar o elimínalos si no son necesarios en este DataTable genérico
// Estos iconos son más específicos del CustomerTable.jsx que usa este DataTable
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';


// El componente genérico DataTable ahora acepta 'columns' y 'data'
const DataTable = ({ columns, data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay datos disponibles para mostrar.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Mapea las columnas para crear los encabezados de la tabla */}
                        {columns.map((column, index) => (
                            <th
                                key={column.Header || index} // Usa Header como key o index si no hay Header
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.Header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mapea los datos (rows) */}
                    {data.map((item, rowIndex) => (
                        <tr key={item.user_id || item.id || rowIndex}> {/* Usa user_id, id o rowIndex como key */}
                            {/* Mapea las columnas para renderizar cada celda de la fila */}
                            {columns.map((column, colIndex) => (
                                <td
                                    key={column.accessor || colIndex} // Usa accessor como key o colIndex
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {/* Si la columna tiene una función Cell, úsala para renderizar */}
                                    {column.Cell ? (
                                        <column.Cell value={item[column.accessor]} row={{ original: item }} />
                                    ) : (
                                        // Si no, usa el accessor para obtener el valor
                                        item[column.accessor]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { DataTable }; // Exporta como nombrado, ya que CustomerTable.jsx lo importa así