import React, { useMemo, Fragment } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';

// Componente para el filtro de columna predeterminado
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
            // Evita que el clic en el input de filtro active el ordenamiento de la columna
            onClick={(e) => e.stopPropagation()}
            placeholder={`Buscar en ${count} registros...`}
            className="mt-1 block w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm
                       focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
        />
    );
}

export const DataTable = ({ columns, data, showFilters = true }) => {
    // Usar useMemo para memorizar las columnas y los datos, optimizando el rendimiento
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => data, [data]);

    // Define el componente de filtro por defecto para todas las columnas
    const defaultColumn = useMemo(() => ({
        Filter: DefaultColumnFilter,
    }), []);

    // Inicializa la instancia de react-table con las funcionalidades deseadas
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            defaultColumn,
            // Aquí puedes añadir opciones adicionales de react-table si las necesitas
        },
        useFilters, // Habilita los filtros
        useSortBy // Habilita el ordenamiento
    );

    // Si no hay datos, muestra un mensaje
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-4">No hay datos disponibles.</p>;
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            {/* Este div con 'overflow-x-auto' es la clave para la responsividad de desplazamiento */}
            <div className="overflow-x-auto">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {headerGroups.map((headerGroup) => (
                            <Fragment key={headerGroup.id}>
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => {
                                        const headerProps = column.getHeaderProps(column.getSortByToggleProps());
                                        const { key, ...restHeaderProps } = headerProps;

                                        return (
                                            <th
                                                key={key}
                                                {...restHeaderProps}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider group cursor-pointer relative"
                                                title={`Ordenar por ${column.render('Header')}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    {column.render('Header')}
                                                    <span className="ml-2">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ArrowDownIcon className="h-3.5 w-3.5 text-gray-700" />
                                                            ) : (
                                                                <ArrowUpIcon className="h-3.5 w-3.5 text-gray-700" />
                                                            )
                                                        ) : (
                                                            column.canSort && <ArrowsUpDownIcon className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                                {showFilters && (
                                    <tr className="filter-row">
                                        {headerGroup.headers.map(column => (
                                            <th
                                                key={`${column.id}-filter`}
                                                className="px-2 pb-2 pt-1 text-left align-top"
                                                onClick={(e) => e.stopPropagation()} // Evita que el clic en el filtro ordene la columna
                                            >
                                                {column.canFilter ? column.render('Filter') : null}
                                            </th>
                                        ))}
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
                                    {row.cells.map(cell => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                                    No hay datos disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};