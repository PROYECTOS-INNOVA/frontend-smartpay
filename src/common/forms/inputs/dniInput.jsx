import { useEffect, useState } from "react";

export const DniInput = ({ handleChange, formData, setFormData, isNewCustomer }) => {    
    const [modoDocumento, setModoDocumento] = useState("numeric");
    const [documento, setDocumento] = useState("");

    const toggleModo = () => {
        setModoDocumento(prev => (prev === "numeric" ? "alphanumeric" : "numeric"));
        setDocumento(""); // limpiar cuando cambia el modo
    };

    useEffect(()=>{
        setDocumento(formData.dni)
    }, [formData])

    const handleLocalChange = (e) => {
        let valor = e.target.value.toUpperCase();

        if (modoDocumento === "numeric") {
            valor = valor.replace(/[^0-9]/g, "");
        } else {
            valor = valor.replace(/[^A-Z0-9]/g, "");
        }

        setDocumento(valor);

        // ⬇️ Simular evento y pasar al helper
        handleChange(
            {
                target: {
                    name: "dni",
                    value: valor,
                },
            },
            formData,
            setFormData,
            isNewCustomer
        );
    };

    return (
        <div className="relative mb-4">
            <input
                name="dni"
                type="text"
                value={documento}
                onChange={handleLocalChange}
                maxLength={20}
                autoComplete="off"
                required
                placeholder="Documento"
                className="uppercase pr-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
                type="button"
                onClick={toggleModo}
                title="Cambiar modo de entrada"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-xs text-gray-500 hover:text-blue-600 focus:outline-none"
            >
                {modoDocumento === "numeric" ? "123" : "ABC"}
            </button>
        </div>
    );
};
