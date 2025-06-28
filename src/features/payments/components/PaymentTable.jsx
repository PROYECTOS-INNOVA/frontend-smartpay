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
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                        </th> */}
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
                            // Usa payment_id directamente, ya que el API Gateway lo devolverá
                            <tr key={payment.payment_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(() => {
                                        const rawValue = payment.value !== undefined && payment.value !== null
                                            ? payment.value
                                            : payment.amount; // En tu caso, payment.value es lo que viene del API
                                        if (rawValue === undefined || rawValue === null) {
                                            return 'N/A';
                                        }
                                        const numericValue = parseFloat(rawValue);
                                        if (isNaN(numericValue)) {
                                            return 'N/A';
                                        }
                                        return new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(numericValue);
                                    })()}
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.plan?.user?.first_name || payment.plan?.user?.last_name
                                        ? `${payment.plan.user.first_name || ''} ${payment.plan.user.last_name || ''}`.trim()
                                        : 'N/A'}
                                </td> */}

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* CAMBIO CLAVE PARA EL DISPOSITIVO: Acceder a payment.device */}
                                    {payment.device?.model || payment.device?.serial_number
                                        ? `${payment.device.model || ''} (${payment.device.serial_number || ''})`.trim()
                                        : 'N/A'}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.state?.toLowerCase() === 'approved' ||
                                                payment.state?.toLowerCase() === 'active' ||
                                                payment.state?.toLowerCase() === 'completado'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {(() => {
                                            const state = payment.state?.toLowerCase();
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
                                                case 'active':
                                                    return 'Activo';
                                                case 'completado':
                                                    return 'Completado';
                                                default:
                                                    return 'Desconocido';
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