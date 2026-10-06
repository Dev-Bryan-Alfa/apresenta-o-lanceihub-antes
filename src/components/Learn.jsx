import React, { useState } from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';

const Learn = () => {
  const [showEmail, setShowEmail] = useState(false);

  const handleSupportClick = () => {
    setShowEmail(!showEmail);
  };

  return (
    <div className="min-h-screen bg-[#010821] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AiOutlinePlayCircle size={48} className="text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
              Vídeo Aula: Como Usar o LanceiHub
            </h1>
          </div>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Aprenda passo a passo como utilizar todas as funcionalidades da plataforma LanceiHub.
            Este tutorial completo vai te guiar desde o básico até as ferramentas avançadas.
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-purple-400/40">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/KKU4r8wvAk8"
              title="Tutorial Completo - Como Usar o LanceiHub"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-xl shadow-lg"
            ></iframe>
          </div>

          {/* Video Info */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Duração: Aproximadamente 10 minutos</h3>
            <p className="text-purple-200">
              Este vídeo cobre: Navegação no dashboard, uso das calculadoras, criação de checklists,
              gerenciamento de propostas e muito mais.
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-3xl shadow-2xl p-4 border border-purple-400/40 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold text-purple-400">Documentação</h4>
            <p className="text-sm text-purple-200">Acesse nossa documentação completa</p>
          </div> */}
          <div
            className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-3xl shadow-2xl p-4 border border-purple-400/40 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={handleSupportClick}
          >
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-semibold text-purple-400">Suporte</h4>
            <p className="text-sm text-purple-200">Entre em contato com nossa equipe</p>
            {showEmail && (
              <p className="text-sm text-purple-100 mt-2">contato@lanceihub.com</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-3xl shadow-2xl p-4 border border-purple-400/40 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-purple-400">Dicas</h4>
            <p className="text-sm text-purple-200">Dicas avançadas e melhores práticas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;