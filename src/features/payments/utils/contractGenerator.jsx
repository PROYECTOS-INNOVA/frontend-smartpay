// src/pages/payments/utils/contractGenerator.js
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom'; // <--- Use ReactDOM for client-side rendering
import React from 'react';
import ContractContent from '../components/ContractContent'; // Import the new component

export const generateContractPdf = async ({ customer, device, authenticatedUser, paymentPlan, initialPayment, generatedInstallments }) => {
    return new Promise((resolve, reject) => {
        // For React 18+, you should use createRoot:
        // import { createRoot } from 'react-dom/client';
        // const root = createRoot(container);
        // root.render(<ContractContent ... />);
        // root.unmount(); // instead of ReactDOM.unmountComponentAtNode(container);

        try {
            // Crea un contenedor temporal en el DOM
            const container = document.createElement('div');
            // Mueve el contenedor fuera de la vista para que no afecte el layout
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            // Renderiza el componente React en el contenedor temporal
            // Si estás en React 18+, usa createRoot:
            // const root = ReactDOM.createRoot(container);
            // root.render(
            //     <ContractContent
            //         customer={customer}
            //         device={device}
            //         authenticatedUser={authenticatedUser}
            //         paymentPlan={paymentPlan}
            //         initialPayment={initialPayment}
            //         generatedInstallments={generatedInstallments}
            //     />
            // );
            // Para versiones anteriores o para compatibilidad más simple:
            ReactDOM.render(
                <ContractContent
                    customer={customer}
                    device={device}
                    authenticatedUser={authenticatedUser}
                    paymentPlan={paymentPlan}
                    initialPayment={initialPayment}
                    generatedInstallments={generatedInstallments}
                />,
                container
            );

            // Configuración para html2pdf
            const options = {
                margin: 10,
                filename: 'contrato_compraventa.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true }, // useCORS es importante si tienes imágenes de fuentes externas
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                // pagebreak: { mode: ['css', 'avoid-all', 'legacy'] } // Puedes comentar esta línea si tienes problemas de saltos y ajustar en el CSS.
            };

            // Genera el PDF
            html2pdf().from(container).set(options).outputPdf('blob')
                .then((pdfBlob) => {
                    // Limpia el componente y el contenedor del DOM
                    // Para React 18+, usa root.unmount();
                    ReactDOM.unmountComponentAtNode(container);
                    document.body.removeChild(container);
                    resolve(pdfBlob);
                })
                .catch(error => {
                    // Asegúrate de limpiar también en caso de error
                    // Para React 18+, usa root.unmount();
                    ReactDOM.unmountComponentAtNode(container);
                    document.body.removeChild(container);
                    console.error("Error generating PDF with html2pdf:", error);
                    reject(error);
                });

        } catch (error) {
            console.error("Error preparing PDF generation:", error);
            reject(error);
        }
    });
};