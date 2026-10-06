import React from 'react';

const InputField = React.memo(({ label, field, value, onChange, unit = '', type = 'text' }) => {
  return (
    <div className="mb-4">
      <label className="block text-green-400 text-sm font-semibold mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          className="w-full rounded-md bg-gray-900 border border-gray-700 text-gray-100 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder={label}
        />
        {unit && <span className="absolute right-3 top-2 text-gray-400 select-none">{unit}</span>}
      </div>
    </div>
  );
});

const TransferenciaDocumentacao = ({ formData, onChange }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl text-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField label="ITBI" field="tdItbi" value={formData.tdItbi} onChange={onChange} unit="R$" />
      <InputField label="Registro da Arrematação" field="tdRegistro" value={formData.tdRegistro} onChange={onChange} unit="R$" />
      <InputField label="Custas Judiciais" field="tdCustas" value={formData.tdCustas} onChange={onChange} unit="R$" />
      <InputField label="Escritura Pública" field="tdEscritura" value={formData.tdEscritura} onChange={onChange} unit="R$" />
      <InputField label="Outros Custos" field="tdOutros" value={formData.tdOutros} onChange={onChange} unit="R$" />
    </div>
  );
};

export default TransferenciaDocumentacao;
