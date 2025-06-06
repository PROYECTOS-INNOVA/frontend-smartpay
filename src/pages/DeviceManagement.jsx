import { useState, useRef, useEffect } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import {
    DevicePhoneMobileIcon,
    PencilIcon,
    TrashIcon,
    LockClosedIcon,
    LockOpenIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
// import QRCode from 'qrcode.react'; // Eliminamos la importación de qrcode.react

const DeviceManagement = () => {
    const [devices, setDevices] = useState([
        { id: 1, imei: '123456789012345', model: 'Galaxy S21', brand: 'Samsung', client: 'Juan Pérez', status: 'active' },
        { id: 2, imei: '234567890123456', model: 'iPhone 13', brand: 'Apple', client: 'María García', status: 'blocked' },
        { id: 3, imei: '345678901234567', model: 'Redmi Note 10', brand: 'Xiaomi', client: 'Carlos López', status: 'pending' },
        { id: 4, imei: '456789012345678', model: 'Pixel 6', brand: 'Google', client: 'Ana Ramírez', status: 'active' },
        { id: 5, imei: '567890123456789', model: 'P40 Pro', brand: 'Huawei', client: 'Pedro Gómez', status: 'blocked' },
        { id: 6, imei: '678901234567890', model: 'OnePlus 9', brand: 'OnePlus', client: 'Laura Fernández', status: 'active' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [formData, setFormData] = useState({
        imei: '',
        brand: '',
        model: '',
        status: 'active',
        clientName: '',
        dni: '',
        installments: 1,
        provisioningDate: new Date().toISOString().split('T')[0],
    });

    const formRef = useRef(null);

    useEffect(() => {
        if (selectedDevice) {
            setFormData({
                imei: selectedDevice.imei,
                brand: selectedDevice.brand,
                model: selectedDevice.model,
                status: selectedDevice.status,
                clientName: selectedDevice.clientName || '',
                dni: selectedDevice.dni || '',
                installments: selectedDevice.installments || 1,
                provisioningDate: selectedDevice.provisioningDate || new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData({
                imei: '',
                brand: '',
                model: '',
                status: 'active',
                clientName: '',
                dni: '',
                installments: 1,
                provisioningDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [selectedDevice, isModalOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Datos a guardar/actualizar:", formData);
        if (selectedDevice) {
            setDevices(prevDevices =>
                prevDevices.map(device =>
                    device.id === selectedDevice.id ? { ...device, ...formData } : device
                )
            );
            console.log('Dispositivo actualizado:', formData);
        } else {
            const newDevice = {
                id: devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1,
                client: formData.clientName,
                ...formData
            };
            setDevices(prevDevices => [...prevDevices, newDevice]);
            console.log('Nuevo dispositivo creado:', newDevice);
        }
        setIsModalOpen(false);
        setSelectedDevice(null);
    };

    const handleDeleteDevice = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este dispositivo?")) {
            setDevices(prevDevices => prevDevices.filter(device => device.id !== id));
            console.log(`Dispositivo con ID ${id} eliminado.`);
        }
    };

    const handleToggleStatus = (id) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id
                    ? { ...device, status: device.status === 'active' ? 'blocked' : 'active' }
                    : device
            )
        );
    };

    const columns = [
        { Header: 'IMEI', accessor: 'imei' },
        { Header: 'Marca', accessor: 'brand' },
        { Header: 'Modelo', accessor: 'model' },
        { Header: 'Cliente', accessor: 'clientName' },
        { Header: 'DNI', accessor: 'dni' },
        { Header: 'Cuotas', accessor: 'installments' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => {
                const statusMap = {
                    active: { text: 'Activo', color: 'bg-green-100 text-green-800' },
                    blocked: { text: 'Bloqueado', color: 'bg-red-100 text-red-800' },
                    pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
                };
                return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[value].color}`}>
                        {statusMap[value].text}
                    </span>
                );
            }
        },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-1 sm:space-x-2 justify-center">
                    <button
                        className="p-1 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                            setSelectedDevice(row.original);
                            setIsModalOpen(true);
                        }}
                        title="Editar"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDevice(row.original.id)}
                        title="Eliminar"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                        className={`p-1 ${row.original.status === 'active' ? 'text-gray-500 hover:text-gray-700' : 'text-green-500 hover:text-green-700'}`}
                        onClick={() => handleToggleStatus(row.original.id)}
                        title={row.original.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                    >
                        {row.original.status === 'active' ? (
                            <LockClosedIcon className="h-5 w-5" />
                        ) : (
                            <LockOpenIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de dispositivos</h1>
                <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                    onClick={() => {
                        setSelectedDevice(null);
                        setIsModalOpen(true);
                    }}
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nuevo dispositivo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="bg-white p-6 rounded-lg shadow md:col-span-12 lg:col-span-10 xl:col-span-12">
                    <DataTable columns={columns} data={devices} />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedDevice ? `Editar dispositivo: ${selectedDevice.imei}` : 'Nuevo dispositivo'}
                size="4xl"
                actions={
                    <>
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            form="device-form"
                        >
                            {selectedDevice ? 'Actualizar' : 'Crear'}
                        </button>
                    </>
                }
            >
                <form id="device-form" className="space-y-4" onSubmit={handleFormSubmit} ref={formRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">

                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                                <input
                                    type="text"
                                    id="dni"
                                    name="dni"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.dni}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="installments" className="block text-sm font-medium text-gray-700">Número de Cuotas</label>
                                    <input
                                        type="number"
                                        id="installments"
                                        name="installments"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.installments}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="provisioningDate" className="block text-sm font-medium text-gray-700">Fecha de Aprovisionamiento</label>
                                    <input
                                        type="date"
                                        id="provisioningDate"
                                        name="provisioningDate"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.provisioningDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Activo</option>
                                    <option value="blocked">Bloqueado</option>
                                    <option value="pending">Pendiente</option>
                                </select>
                            </div>
                        </div>

                        {/* Columna Derecha: Imagen del Código QR */}
                        <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Escanea para Aprovisionar</h3>
                            <img
                                src="/assets/qr.png"
                                alt="Código QR de ejemplo"
                                className="border border-gray-300 p-2 rounded-md shadow-sm"
                                style={{ width: '256px', height: '256px' }} // Aseguramos que tenga el mismo tamaño que el QR anterior
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DeviceManagement;