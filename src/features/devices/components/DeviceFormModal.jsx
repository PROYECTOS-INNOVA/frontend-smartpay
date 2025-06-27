import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';


const DeviceFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        serial_number: '',
        model: '',
        type: '',
        mdm_status: 'Activo',
        assigned_user_id: '',
        os_version: '',
        imei: '',

    });

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (initialData) {

            setFormData({
                serial_number: initialData.serial_number || '',
                model: initialData.model || '',
                type: initialData.type || '',
                mdm_status: initialData.mdm_status || 'Activo',
                assigned_user_id: initialData.assigned_user_id || '',
                os_version: initialData.os_version || '',
                imei: initialData.imei || '',
            });
        } else {

            setFormData({
                serial_number: '',
                model: '',
                type: '',
                mdm_status: 'Activo',
                assigned_user_id: '',
                os_version: '',
                imei: '',
            });
        }
        setFormError(null);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        try {

            const dataToSubmit = { ...formData };

            Object.keys(dataToSubmit).forEach(key => {
                if (dataToSubmit[key] === '' || dataToSubmit[key] === null) {
                    delete dataToSubmit[key];
                }
            });

            if (dataToSubmit.assigned_user_id === '') {
                dataToSubmit.assigned_user_id = null;
            }

            await onSubmit(dataToSubmit); 
        } catch (err) {
            console.error("Error al enviar el formulario del dispositivo:", err);
            setFormError(err.message || 'Error desconocido al guardar el dispositivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {initialData ? `Editar Dispositivo: ${initialData.serial_number}` : 'Registrar Nuevo Dispositivo'}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Campos del formulario */}
                                        <div>
                                            <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">Número de Serie</label>
                                            <input
                                                type="text"
                                                name="serial_number"
                                                id="serial_number"
                                                value={formData.serial_number}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                                            <input
                                                type="text"
                                                name="model"
                                                id="model"
                                                value={formData.model}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo (Ej: Smartphone, Tablet)</label>
                                            <input
                                                type="text"
                                                name="type"
                                                id="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="mdm_status" className="block text-sm font-medium text-gray-700">Estado MDM</label>
                                            <select
                                                name="mdm_status"
                                                id="mdm_status"
                                                value={formData.mdm_status}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Bloqueado">Bloqueado</option>
                                                <option value="Liberado">Liberado</option>
                                                {/* Agrega más estados si existen en tu backend */}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="assigned_user_id" className="block text-sm font-medium text-gray-700">Usuario Asignado (ID)</label>

                                            <input
                                                type="text"
                                                name="assigned_user_id"
                                                id="assigned_user_id"
                                                value={formData.assigned_user_id || ''}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="ID del usuario asignado (opcional)"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="os_version" className="block text-sm font-medium text-gray-700">Versión de SO</label>
                                            <input
                                                type="text"
                                                name="os_version"
                                                id="os_version"
                                                value={formData.os_version}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Ej: iOS 17.5.1, Android 14"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="imei" className="block text-sm font-medium text-gray-700">IMEI</label>
                                            <input
                                                type="text"
                                                name="imei"
                                                id="imei"
                                                value={formData.imei}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Número IMEI"
                                            />
                                        </div>

                                        {/* Mensaje de error del formulario */}
                                        {formError && (
                                            <p className="text-sm text-red-600 mt-2">{formError}</p>
                                        )}

                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={onClose}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                disabled={loading}
                                            >
                                                {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Registrar')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeviceFormModal;