import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axiosBase";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [contato, setContato] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/user/create", { nome, email, senha, cpf, contato, dataNascimento });
      setMessage("Usuário criado com sucesso! Você pode fazer login agora.");
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      setContato("");
      setDataNascimento("");
      setTimeout(() => {
        nav("/login");
      }, 3000);
    } catch (err) {
      setError("Erro ao criar usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010821]">
      <div className="w-full max-w-6xl px-2 md:px-0">
        {/* Neon Borders */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Borda externa neon */}
          <div
            className="absolute -inset-1 rounded-3xl pointer-events-none z-10 p-[3px] animate-neonSlide"
            style={{
              background: 'linear-gradient(120deg, #5524E8, #6024AF, #5524E8, #6024AF)',
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
              className="flex-1 flex flex-col justify-center gap-4 p-6 md:p-10 bg-gradient-to-br from-[#010821] to-[#0a1a3a] backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <h2 className="text-4xl font-extrabold font-montserrat text-transparent bg-gradient-to-r from-[#07D99D] to-[#3b8353] bg-clip-text text-center drop-shadow-lg tracking-wide">
                  Criar Conta
                </h2>
                <p className="text-white text-center">Preencha os dados para se registrar.</p>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-white font-semibold text-base">Nome:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>
                <label className="text-white font-semibold text-base">E-mail:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <label className="text-white font-semibold text-base">Senha:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <label className="text-white font-semibold text-base">CPF:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="text"
                    placeholder="Digite seu CPF"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    required
                  />
                </div>
                <label className="text-white font-semibold text-base">Contato (Opcional):</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="text"
                    placeholder="Digite seu contato"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={contato}
                    onChange={e => setContato(e.target.value)}
                  />
                </div>
                <label className="text-white font-semibold text-base">Data de Nascimento (Opcional):</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <input
                    type="date"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400 border-none"
                    value={dataNascimento}
                    onChange={e => setDataNascimento(e.target.value)}
                  />
                </div>
              </div>

              {message && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6024AF] to-[#190B70] text-white font-bold py-2 rounded-lg shadow hover:brightness-110 transition mt-2 text-lg tracking-wide disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar Conta"}
              </button>
              <button
                type="button"
                onClick={() => nav("/login")}
                className="w-full bg-transparent border border-[#6024AF] text-[#6024AF] font-bold py-2 rounded-lg shadow hover:bg-[#6024AF] hover:text-white transition mt-2 text-lg tracking-wide"
              >
                Já tenho conta
              </button>
            </form>
            {/* Lado direito: Card visual */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#07D99D] via-[#42ADF0] to-[#010821] p-12 relative">
              <div className="absolute inset-0 bg-black/60 rounded-tr-3xl rounded-br-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="teste4.png"
                  alt="Lancei Hub"
                  className="w-100 h-100 mb-6 p-3"
                  style={{ filter: "drop-shadow(0 0 12px #fff8)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
