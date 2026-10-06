import React, { useState } from 'react';
import api from '../axios/axiosBase';

export default function ContactModal({ isOpen, onClose, partnerName }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [contato, setContato] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/contact', {
        nome,
        email,
        contato,
        mensagem,
        partnerName,
      });

      setMessage('Mensagem enviada com sucesso!');
      setNome('');
      setEmail('');
      setContato('');
      setMensagem('');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 3000);
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#42ACF0]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Neon Borders */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Borda externa neon */}
          <div
            className="absolute -inset-1 rounded-3xl pointer-events-none z-10 p-[3px] animate-neonSlide"
            style={{
              background: 'linear-gradient(120deg, #5524E8, #42ACF0, #8B5CF6, #5524E8)',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Card Content */}
          <div className="relative z-20 w-full bg-white/5 backdrop-blur-xl rounded-3xl flex flex-col md:flex-row overflow-hidden border border-white/10 shadow-2xl">
            {/* Lado esquerdo: Formulário */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-center gap-6 p-8 md:p-14 bg-[#010821]/90 backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-2 mb-6">
                <h2 className="text-4xl font-extrabold font-montserrat text-transparent bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#8B5CF6] bg-clip-text text-center drop-shadow-lg tracking-wide">
                  Entrar em Contato
                </h2>
                <p className="text-gray-300 text-center">Entre em contato com <strong className="text-[#42ACF0]">{partnerName}</strong></p>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[#5524E8] font-semibold text-base mb-2">Nome:</label>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5524E8] font-semibold text-base mb-2">E-mail:</label>
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5524E8] font-semibold text-base mb-2">Contato:</label>
                  <input
                    type="text"
                    placeholder="Digite seu contato (telefone, etc.)"
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
                    value={contato}
                    onChange={e => setContato(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5524E8] font-semibold text-base mb-2">Mensagem:</label>
                  <textarea
                    placeholder="Descreva o que você precisa..."
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300 h-32 resize-none"
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className="p-4 bg-[#42ACF0]/10 text-[#42ACF0] rounded-xl border border-[#42ACF0]/20 font-semibold">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-400/10 text-red-400 rounded-xl border border-red-400/20 font-semibold">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-white/20 hover:border-[#42ACF0]/50 transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#5524E8] to-[#42ACF0] text-white font-bold py-4 rounded-xl shadow-lg hover:from-[#6024AF] hover:to-[#42ACF0] hover:shadow-[#5524E8]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </div>
            </form>
            {/* Lado direito: Card visual */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#5524E8] via-[#42ACF0] to-[#010821] p-12 relative">
              <div className="absolute inset-0 bg-black/40 rounded-tr-3xl rounded-br-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="LogoHorizontal.png"
                  alt="Lancei Hub"
                  className="w-100 h-100 mb-10 p-4"
                  style={{ filter: "drop-shadow(0 0 12px rgba(85, 36, 232, 0.5))" }}
                />
                {/* <h2 className="text-2xl font-extrabold font-montserrat text-white text-center drop-shadow-lg tracking-wide">
                  Lancei Hub
                </h2> */}
                {/* <p className="text-gray-300 text-center mt-4 text-sm">
                  Sua plataforma de oportunidades em leilões
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
