import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Ahora exportamos el componente como una exportación por defecto
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    size = 'lg',
    hideFooter = false
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Fondo del overlay */}
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={onClose}
            ></div>

            {/* Contenedor principal del modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
                                shadow-xl transform transition-all my-8 w-full ${sizeClasses[size] || sizeClasses.lg}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Cabecera del Modal */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pt-5 flex justify-between items-start border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                            {title || "Modal"}
                        </h3>
                        <button
                            type="button"
                            className="p-1 -m-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100
                                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                            onClick={onClose}
                        >
                            <span className="sr-only">Cerrar</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Contenido del Modal */}
                    <div className="px-4 py-5 sm:p-6 text-sm text-gray-700">
                        {children}
                    </div>

                    {/* Footer del Modal (acciones) */}
                    {!hideFooter && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                            {actions ? actions : (
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cerrar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;