import React from 'react';

// Selo fixo que deixa claro que esta é a versão antiga, rodando só com dados fictícios.
export default function DemoBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        bottom: 12,
        zIndex: 99999,
        background: 'rgba(17, 17, 17, 0.85)',
        color: '#fff',
        font: '600 12px/1.3 Inter, system-ui, sans-serif',
        padding: '8px 12px',
        borderRadius: 999,
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 24px)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      LanceiHub · versão antiga (demonstração com dados fictícios)
    </div>
  );
}
