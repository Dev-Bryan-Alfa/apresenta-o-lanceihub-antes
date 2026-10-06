import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axios/axiosBase";
import { AiOutlineMail } from "react-icons/ai";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      if (err.response?.status === 400) {
        // E-mail não existe, redirecionar para página de cadastro
        setError("E-mail não encontrado. Você pode se registrar agora.");
        setTimeout(() => {
          onClose();
          navigate("/cadastro");
        }, 3000);
      } else {
        setError(err.response?.data?.message || "Erro ao enviar e-mail. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full max-w-5xl px-2 md:px-0">
          {/* Neon Borders */}
          <div className="relative rounded-3xl overflow-visible">
            {/* Borda externa neon */}
            <div
              className="absolute -inset-1 rounded-3xl pointer-events-none z-10 p-[3px] animate-neonSlide"
              style={{
                background: 'linear-gradient(120deg, #8B5CF6, #7C3AED, #8B5CF6, #7C3AED)',
                backgroundSize: '200% 200%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Card Content */}
            <div className="relative z-20 w-full bg-white/5 rounded-3xl flex flex-col md:flex-row overflow-hidden">
              {/* Lado esquerdo: Formulário */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col justify-center gap-6 p-8 md:p-14 bg-[#101a36]/90 backdrop-blur-md"
              >
                <div className="flex flex-col items-center gap-2 mb-2">
                  <h2 className="text-4xl font-extrabold font-montserrat text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-center drop-shadow-lg tracking-wide">
                    Recuperar Senha
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-purple-400 font-semibold text-base">E-mail:</label>
                  <div className="flex items-center bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-lg px-3 py-2 shadow-inner border border-purple-400/40">
                    <AiOutlineMail className="text-purple-400 text-xl mr-2" />
                    <input
                      type="email"
                      placeholder="Digite seu e-mail"
                      className="flex-1 bg-transparent outline-none text-white font-medium placeholder-purple-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 text-green-300 rounded-lg text-center font-semibold backdrop-blur-sm">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 text-red-300 rounded-lg text-center font-semibold backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl border border-gray-500/40"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all duration-300 disabled:opacity-50 border border-purple-400/40"
                  >
                    {loading ? "Enviando..." : "Enviar Link"}
                  </button>
                </div>
              </form>
              {/* Lado direito: Card visual */}
              <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 p-12 relative">
                <div className="absolute inset-0 bg-black/60 rounded-tr-3xl rounded-br-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-6xl mb-4">🔐</div>
                  <h2 className="text-2xl font-extrabold font-montserrat text-white text-center drop-shadow-lg tracking-wide">
                    Lancei Hub
                  </h2>
                  <p className="text-purple-200 text-center mt-4 text-sm">
                    Recupere sua senha de forma segura
                  </p>
                  <div className="mt-6 flex flex-col items-center space-y-2">
                    <div className="w-16 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full"></div>
                    <div className="w-12 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full opacity-60"></div>
                    <div className="w-8 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full opacity-40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
