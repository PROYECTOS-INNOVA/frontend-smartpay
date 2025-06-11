import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const Step4_Summary = ({ onFinalize, onBack, registrationData }) => {
    const { customerInfo, contractInfo, deviceInfo } = registrationData;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Resumen y Confirmación</h2>
            <p className="text-gray-600">Por favor, revisa la información antes de finalizar el registro.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Cliente */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> {customerInfo?.name}</p>
                    <p><strong>DNI:</strong> {customerInfo?.dni}</p>
                    <p><strong>Email:</strong> {customerInfo?.email}</p>
                    <p><strong>Teléfono:</strong> {customerInfo?.phone}</p>
                    <p><strong>Dirección:</strong> {customerInfo?.address}</p>
                </div>

                {/* Información del Contrato */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Contrato de Venta</h3>
                    <p><strong>Archivo:</strong> {contractInfo?.fileName || 'No subido'}</p>
                    {contractInfo?.url && (
                        <p className="text-sm text-gray-500">
                            <a href={contractInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Ver Contrato (Simulado)
                            </a>
                        </p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del Dispositivo</h3>
                    <p><strong>Número de Serie:</strong> {deviceInfo?.deviceSerial || 'Pendiente'}</p>
                    <p><strong>Modelo:</strong> {deviceInfo?.deviceModel || 'Pendiente'}</p>
                    <p><strong>IMEI 1:</strong> {deviceInfo?.imei1 || 'Pendiente'}</p>
                    <p><strong>IMEI 2:</strong> {deviceInfo?.imei2 || 'N/A'}</p>
                    <p><strong>Batería:</strong> {deviceInfo?.batteryPercentage ? `${deviceInfo.batteryPercentage}%` : 'Pendiente'}</p>
                    <p><strong>Última Ubicación:</strong> {deviceInfo?.lastLocation ? `Lat: ${deviceInfo.lastLocation.latitude.toFixed(4)}, Lon: ${deviceInfo.lastLocation.longitude.toFixed(4)}` : 'Pendiente'}</p>

                    {deviceInfo?.qrCodeData && (
                        <div className="mt-4">
                            <p className="font-medium text-gray-700 mb-2">QR de Aprovisionamiento:</p>
                            <div className="border p-2 rounded-md bg-white inline-block">
                                <QRCodeSVG value={deviceInfo.qrCodeData} size={128} level="H" />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 break-words">
                                Data: {deviceInfo.qrCodeData}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button type="button" onClick={onBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Anterior
                </button>
                <button type="button" onClick={onFinalize}
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Confirmar y Finalizar Registro
                </button>
            </div>
        </div>
    );
};

export default Step4_Summary;