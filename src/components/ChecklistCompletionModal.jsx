import React from 'react';

const ChecklistCompletionModal = ({ isOpen, onClose, loteName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#07D99D] to-[#259b78] rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          {/* Ícone de sucesso */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-[#07D99D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Parabéns! 🎉
          </h2>

          {/* Mensagem */}
          <p className="text-white text-lg mb-2">
            Você completou todos os itens do checklist!
          </p>
          <p className="text-white/90 text-base mb-6">
            {loteName ? `Lote: ${loteName}` : 'Seu checklist foi finalizado com sucesso.'}
          </p>

          {/* Detalhes */}
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              Você está pronto para prosseguir com a arrematação. 
              Todos os tópicos foram analisados e marcados como concluídos.
            </p>
          </div>

          {/* Botão */}
          <button
            onClick={onClose}
            className="bg-white text-[#07D99D] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg"
          >
            Continuar
          </button>
        </div>

        {/* Animação de confetes (CSS) */}
        <style jsx>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotateZ(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotateZ(720deg);
              opacity: 0;
            }
          }
          
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #fff;
            animation: confetti-fall 3s linear;
          }
        `}</style>

        {/* Confetes animados */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                background: ['#fff', '#259b78', '#42ADF0'][Math.floor(Math.random() * 3)],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistCompletionModal;
