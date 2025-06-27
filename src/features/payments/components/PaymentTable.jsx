import React from 'react';

const PaymentTable = ({ payments }) => {
    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID Pago
                        </th> */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dispositivo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        {/* Puedes añadir más columnas según los datos de pago */}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {payments && payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment.payment_id || payment.id}> {/* Usa payment_id del API o id si es dummy */}
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.payment_id || payment.id}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(() => {
                                        // Primero, intenta obtener el valor de 'value', si no, de 'amount'
                                        const rawValue = payment.value !== undefined && payment.value !== null
                                            ? payment.value
                                            : payment.amount;

                                        // Si rawValue no existe o es null/undefined, devuelve 'N/A'
                                        if (rawValue === undefined || rawValue === null) {
                                            return 'N/A';
                                        }

                                        // Intenta convertir a número
                                        const numericValue = parseFloat(rawValue);

                                        // Si la conversión no resultó en un número válido, devuelve 'N/A'
                                        if (isNaN(numericValue)) {
                                            return 'N/A';
                                        }

                                        // Formatear a pesos colombianos (COP)
                                        return new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 2, // Asegura al menos 2 decimales
                                            maximumFractionDigits: 2, // Asegura no más de 2 decimales
                                        }).format(numericValue);
                                    })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* Para el Cliente: payment.customer.first_name y payment.customer.last_name */}
                                    {/* Usamos el operador de encadenamiento opcional (?) y un fallback seguro */}
                                    {payment.customer?.first_name || payment.customer?.last_name
                                        ? `${payment.customer.first_name || ''} ${payment.customer.last_name || ''}`.trim()
                                        : 'N/A'}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* Para el Dispositivo: payment.device.model y payment.device.serial_number */}
                                    {/* Asumo que 'serial_number' es el campo correcto según tu diagrama DB 'device'.
      Si en tu API Gateway lo mapeaste a 'serial', usa 'payment.device?.serial'. */}
                                    {payment.device?.model || payment.device?.serial_number
                                        ? `${payment.device.model || ''} (${payment.device.serial_number || ''})`.trim()
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            // Convertimos el estado a minúsculas para una comparación insensible a mayúsculas/minúsculas
                                            // Y comparamos con 'approved' para el color verde
                                            payment.state?.toLowerCase() === 'approved' ||
                                                payment.state?.toLowerCase() === 'active' || // Mantener 'active' si aplica a otros contextos
                                                payment.state?.toLowerCase() === 'completado' // Si en algún momento viene 'Completado' y es verde
                                                ? 'bg-green-100 text-green-800' // Clase para el color verde
                                                : 'bg-red-100 text-red-800' // Clase para el color rojo (para Pending, Rejected, Failed, Returned)
                                            }`}
                                    >
                                        {/* Mapeo para mostrar el estado en español */}
                                        {(() => {
                                            const state = payment.state?.toLowerCase(); // Asegurarse de trabajar con minúsculas
                                            switch (state) {
                                                case 'pending':
                                                    return 'Pendiente';
                                                case 'approved':
                                                    return 'Aprobado';
                                                case 'rejected':
                                                    return 'Rechazado';
                                                case 'failed':
                                                    return 'Fallido';
                                                case 'returned':
                                                    return 'Devuelto';
                                                case 'active': // Si 'active' se usa y quieres que sea 'Activo'
                                                    return 'Activo';
                                                case 'completado': // Si 'Completado' podría venir de algún lugar
                                                    return 'Completado';
                                                default:
                                                    return 'Desconocido'; // Por si acaso hay un estado no manejado
                                            }
                                        })() || 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay pagos para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTable;