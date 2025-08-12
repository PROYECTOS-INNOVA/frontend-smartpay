import React from 'react';
import ContractPDFGenerator from '../src/components/ContractPDFGenerator';

const ContractDemoPage = () => {
  // Sample contract data
  const sampleContractData = {
    // Company information
    ruc: '2065074545',
    companyName: 'STOCKSMART S.A.C',
    companyAddress: 'CALLE MARAÑON # 367',
    representativeName: 'JUAN CARLOS DIAZ DACOSTA',
    representativeDNI: '48794319',
    representativePhone: '925608708',
    representativeEmail: 'JUANDIAZ00897@GMAIL.COM',
    
    // Borrower information
    borrowerName: 'MARÍA GONZÁLEZ LÓPEZ',
    borrowerDNI: '12345678',
    borrowerPhone: '999888777',
    borrowerEmail: 'maria.gonzalez@email.com',
    borrowerAddress: 'AV. ARENALES 123, LIMA',
    
    // Financial information
    principal: 2500,
    months: 12,
    interestRate: 15,
    initialPayment: 500,
    
    // Equipment information
    equipment: {
      brand: 'Samsung',
      model: 'Galaxy A54',
      imei: '123456789012345'
    },
    
    // Contract date
    contractDate: new Date(),
    
    // Show amortization table
    showAmortizationTable: true
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Generador de Contratos PDF
          </h1>
          <p className="text-lg text-gray-600">
            Componente React para generar contratos de préstamo profesionales
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Datos del Contrato de Ejemplo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Prestatario</h3>
              <p className="text-sm">{sampleContractData.borrowerName}</p>
              <p className="text-sm text-gray-600">DNI: {sampleContractData.borrowerDNI}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Monto del Préstamo</h3>
              <p className="text-lg font-bold">S/ {sampleContractData.principal.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{sampleContractData.months} meses</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Tasa de Interés</h3>
              <p className="text-lg font-bold">{sampleContractData.interestRate}%</p>
              <p className="text-sm text-gray-600">Anual</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Equipo</h3>
              <p className="text-sm">{sampleContractData.equipment.brand}</p>
              <p className="text-sm">{sampleContractData.equipment.model}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Características del Componente:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>✅ Generación automática de tabla de amortización</li>
              <li>✅ Cálculo de intereses compuestos</li>
              <li>✅ Formato de moneda peruana (PEN)</li>
              <li>✅ Conversión de números a palabras</li>
              <li>✅ PDF de alta calidad con paginación automática</li>
              <li>✅ Diseño responsivo y profesional</li>
              <li>✅ Cumplimiento legal peruano</li>
            </ul>
          </div>
        </div>

        {/* Contract Component */}
        <ContractPDFGenerator {...sampleContractData} />
      </div>
    </div>
  );
};

export default ContractDemoPage; 