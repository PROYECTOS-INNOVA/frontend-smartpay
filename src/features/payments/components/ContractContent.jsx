// src/pages/payments/components/ContractContent.jsx
import React from 'react';

const ContractContent = ({ customer, device, authenticatedUser, paymentPlan, initialPayment, generatedInstallments }) => {
    // Formateadores para números y fechas
    const formatCurrency = (value) => value?.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="contract-document p-8 bg-white text-gray-800 text-sm leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
            <style>
                {`
                .contract-document h1 {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .contract-document h2 {
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                .contract-document p {
                    margin-bottom: 5px;
                }
                .contract-document table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                .contract-document th, .contract-document td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .contract-document th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                .contract-document .clause-title {
                    font-weight: bold;
                    margin-top: 10px;
                }
                .contract-document .signature-area {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 50px;
                    text-align: center;
                }
                .contract-document .signature-block {
                    flex: 1;
                    padding: 0 20px;
                }
                .contract-document .signature-line {
                    border-top: 1px solid black;
                    margin-top: 30px;
                    margin-bottom: 5px;
                }
                `}
            </style>

            <h1>CONTRATO DE COMPRAVENTA Y PLAN DE PAGOS</h1>
            <p className="text-right">Fecha de Emisión: {formatDate(new Date().toISOString())}</p>

            <h2>PARTES CONTRATANTES:</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><strong>VENDEDOR:</strong></p>
                    <p>Nombre: {authenticatedUser ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}` : 'N/A'}</p>
                    <p>Identificación: {authenticatedUser ? authenticatedUser.dni : 'N/A'}</p>
                    <p>Email: {authenticatedUser ? authenticatedUser.email : 'N/A'}</p>
                </div>
                <div>
                    <p><strong>COMPRADOR:</strong></p>
                    <p>Nombre: {customer ? `${customer.first_name} ${customer.last_name}` : 'N/A'}</p>
                    <p>Identificación: {customer ? customer.dni : 'N/A'}</p>
                    <p>Dirección: {customer ? `${customer.address}, ${customer.city_id}` : 'N/A'}</p>
                    <p>Teléfono: {customer ? `${customer.prefix} ${customer.phone}` : 'N/A'}</p>
                </div>
            </div>

            <h2>OBJETO DEL CONTRATO (DISPOSITIVO):</h2>
            <table>
                <thead>
                    <tr>
                        <th>Campo</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Nombre</td><td>{device ? device.name : 'N/A'}</td></tr>
                    <tr><td>Marca</td><td>{device ? device.brand : 'N/A'}</td></tr>
                    <tr><td>Modelo</td><td>{device ? device.model : 'N/A'}</td></tr>
                    <tr><td>IMEI</td><td>{device ? device.imei : 'N/A'}</td></tr>
                    <tr><td>Número de Serie</td><td>{device ? device.serial_number : 'N/A'}</td></tr>
                    <tr><td>Precio de Venta</td><td>${formatCurrency(device?.price_usd)} COP</td></tr>
                </tbody>
            </table>

            <h2>PLAN DE PAGOS:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Campo</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Saldo a Financiar</td><td>${formatCurrency(paymentPlan?.balance_to_finance)} COP</td></tr>
                    <tr><td>Cuotas</td><td>{paymentPlan ? `${paymentPlan.quotas}` : 'N/A'}</td></tr>
                    <tr><td>Monto por Cuota</td><td>${formatCurrency(paymentPlan?.monto_cuota)} COP</td></tr>
                    <tr><td>Frecuencia</td><td>{paymentPlan ? `${paymentPlan.frecuencia_dias} días` : 'N/A'}</td></tr>
                    <tr><td>Fecha de Inicio del Plan</td><td>{paymentPlan ? paymentPlan.initial_date : 'N/A'}</td></tr>
                </tbody>
            </table>

            <h2>PAGO INICIAL:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Campo</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Valor</td><td>${formatCurrency(initialPayment?.value)} COP</td></tr>
                    <tr><td>Método</td><td>{initialPayment ? initialPayment.method : 'N/A'}</td></tr>
                    <tr><td>Fecha de Pago</td><td>{initialPayment ? initialPayment.date : 'N/A'}</td></tr>
                </tbody>
            </table>

            {generatedInstallments && generatedInstallments.length > 0 && (
                <>
                    <h2>TABLA DE CUOTAS PROGRAMADAS:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Cuota</th>
                                <th>Fecha Vencimiento</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedInstallments.map((item) => (
                                <tr key={item.number}>
                                    <td>{item.number}</td>
                                    <td>{formatDate(item.dueDate)}</td>
                                    <td>${formatCurrency(item.amount)} COP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <h2>CLÁUSULAS DEL CONTRATO:</h2>
            <p className="clause-title">PRIMERA - OBJETO:</p>
            <p>El VENDEDOR transfiere al COMPRADOR la propiedad del dispositivo descrito en este contrato, y el COMPRADOR lo adquiere, obligándose a pagar el precio de venta en la forma y términos aquí estipulados.</p>

            <p className="clause-title">SEGUNDA - PRECIO Y FORMA DE PAGO:</p>
            <p>El precio total del dispositivo es el indicado en la sección 'Objeto del Contrato'. El COMPRADOR realizará un pago inicial de ${formatCurrency(initialPayment?.value)} COP y el saldo restante de ${formatCurrency(paymentPlan?.balance_to_finance)} COP se financiará bajo el 'Plan de Pagos' detallado, consistente en {paymentPlan?.quotas || 'N/A'} cuotas de ${formatCurrency(paymentPlan?.monto_cuota)} COP cada una. Cada cuota deberá ser pagada en la frecuencia de {paymentPlan?.frecuencia_dias || 'N/A'} días a partir de la 'Fecha de Inicio del Plan'.</p>

            <p className="clause-title">TERCERA - INCUMPLIMIENTO:</p>
            <p>El incumplimiento en el pago de dos (2) o más cuotas consecutivas facultará al VENDEDOR a dar por terminado unilateralmente el presente contrato y a exigir la restitución inmediata del dispositivo, sin perjuicio de las acciones legales para el cobro de las sumas adeudadas y los intereses moratorios correspondientes.</p>

            <p className="clause-title">CUARTA - ENTREGA Y RIESGO:</p>
            <p>El dispositivo será entregado al COMPRADOR una vez verificado el pago inicial. A partir de la entrega, el riesgo de pérdida o deterioro del dispositivo recaerá exclusivamente sobre el COMPRADOR.</p>

            <p className="clause-title">QUINTA - GARANTÍA:</p>
            <p>El VENDEDOR garantiza el buen funcionamiento del dispositivo por un período de [NÚMERO] meses a partir de la fecha de entrega, cubriendo defectos de fabricación. Esta garantía no cubre daños por mal uso, accidentes, manipulación por terceros no autorizados o desgaste natural.</p>

            <p className="clause-title">SEXTA - JURISDICCIÓN Y LEY APLICABLE:</p>
            <p>Para todos los efectos legales de este contrato, las partes se someten a la jurisdicción de los tribunales de Pitalito, Huila, Colombia, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros. La ley aplicable será la de la República de Colombia.</p>

            <p className="clause-title">SÉPTIMA - NOTIFICACIONES:</p>
            <p>Cualquier notificación, requerimiento, o comunicación entre las partes deberá realizarse por escrito a las direcciones de domicilio y correos electrónicos consignados en la sección de 'Partes Contratantes' de este documento.</p>

            <p className="mt-8">En constancia, se firma el presente en dos ejemplares de igual valor y contenido, en la ciudad de Pitalito, Huila, a los {new Date().getDate()} días del mes de {new Date().toLocaleString('es-CO', { month: 'long' })} de {new Date().getFullYear()}.</p>

            <div className="signature-area">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <p><strong>VENDEDOR</strong></p>
                    <p>Nombre: {authenticatedUser ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}` : 'N/A'}</p>
                    <p>C.C./NIT: {authenticatedUser ? authenticatedUser.dni : 'N/A'}</p>
                </div>
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <p><strong>COMPRADOR</strong></p>
                    <p>Nombre: {customer ? `${customer.first_name} ${customer.last_name}` : 'N/A'}</p>
                    <p>C.C.: {customer ? customer.dni : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ContractContent;