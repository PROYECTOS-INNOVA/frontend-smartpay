import React from 'react';
import ContractPDFGenerator from './ContractPDFGenerator';

const ContractExample = () => {
  // Example data for the contract
  const contractData = {
    // Company information
    ruc: '2065074545',
    companyName: 'STOCKSMART S.A.C',
    companyAddress: 'CALLE MARAÑON # 367',
    representativeName: 'JUAN CARLOS DIAZ DACOSTA',
    representativeDNI: '48794319',
    representativePhone: '925608708',
    representativeEmail: 'JUANDIAZ00897@GMAIL.COM',
    
    // Borrower information
    borrowerName: 'CARLOS MARTÍNEZ RODRÍGUEZ',
    borrowerDNI: '87654321',
    borrowerPhone: '987654321',
    borrowerEmail: 'carlos.martinez@email.com',
    borrowerAddress: 'JR. LIMA 456, MIRAFLORES',
    
    // Financial information
    principal: 3500,
    months: 18,
    interestRate: 12.5,
    initialPayment: 700,
    
    // Equipment information
    equipment: {
      brand: 'Apple',
      model: 'iPhone 15',
      imei: '987654321098765'
    },
    
    // Contract date
    contractDate: new Date('2024-01-15'),
    
    // Show amortization table
    showAmortizationTable: true
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Ejemplo de Contrato de Préstamo
      </h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Datos del Contrato:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Prestatario:</strong> {contractData.borrowerName}
          </div>
          <div>
            <strong>DNI:</strong> {contractData.borrowerDNI}
          </div>
          <div>
            <strong>Monto:</strong> S/ {contractData.principal.toLocaleString()}
          </div>
          <div>
            <strong>Plazo:</strong> {contractData.months} meses
          </div>
          <div>
            <strong>Equipo:</strong> {contractData.equipment.brand} {contractData.equipment.model}
          </div>
          <div>
            <strong>IMEI:</strong> {contractData.equipment.imei}
          </div>
        </div>
      </div>

      <ContractPDFGenerator {...contractData} />
    </div>
  );
};

export default ContractExample; 