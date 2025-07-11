import React, { useState } from 'react';
import ContractPDFGenerator from './ContractPDFGenerator';

const ContractDemo = () => {
  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNumberInput = (field, value) => {
    const numValue = parseFloat(value) || 0;
    handleInputChange(field, numValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Generador de Contratos PDF
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">Configuración del Contrato</h2>
              
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600">Información de la Empresa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => handleInputChange('ruc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de la Empresa</label>
                  <input
                    type="text"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Borrower Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600">Información del Prestatario</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.borrowerName}
                      onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                    <input
                      type="text"
                      value={formData.borrowerDNI}
                      onChange={(e) => handleInputChange('borrowerDNI', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={formData.borrowerPhone}
                      onChange={(e) => handleInputChange('borrowerPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.borrowerEmail}
                      onChange={(e) => handleInputChange('borrowerEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.borrowerAddress}
                    onChange={(e) => handleInputChange('borrowerAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600">Información Financiera</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto Principal (S/)</label>
                    <input
                      type="number"
                      value={formData.principal}
                      onChange={(e) => handleNumberInput('principal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (Meses)</label>
                    <input
                      type="number"
                      value={formData.months}
                      onChange={(e) => handleNumberInput('months', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Interés (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.interestRate}
                      onChange={(e) => handleNumberInput('interestRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuota Inicial (S/)</label>
                    <input
                      type="number"
                      value={formData.initialPayment}
                      onChange={(e) => handleNumberInput('initialPayment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showAmortizationTable"
                    checked={formData.showAmortizationTable}
                    onChange={(e) => handleInputChange('showAmortizationTable', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showAmortizationTable" className="text-sm font-medium text-gray-700">
                    Mostrar tabla de amortización
                  </label>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600">Información del Equipo</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={formData.equipment.brand}
                      onChange={(e) => handleInputChange('equipment.brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      value={formData.equipment.model}
                      onChange={(e) => handleInputChange('equipment.model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IMEI</label>
                    <input
                      type="text"
                      value={formData.equipment.imei}
                      onChange={(e) => handleInputChange('equipment.imei', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Vista Previa del Contrato</h2>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ContractPDFGenerator {...formData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDemo; 