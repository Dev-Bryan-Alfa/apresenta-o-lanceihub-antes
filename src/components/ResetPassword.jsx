import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axios/axiosBase";
import { AiOutlineLock } from "react-icons/ai";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");


  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Token de recuperação inválido ou ausente.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Invalid or expired reset token') {
        setError("Token inválido ou expirado. Solicite um novo link de recuperação.");
      } else {
        setError("Erro ao redefinir senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010821]">
      <div className="w-full max-w-md px-4">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-gradient-to-r from-[#07D99D] to-[#3b8353] bg-clip-text">
            Redefinir Senha
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[#07D99D] font-semibold mb-2">
                Nova Senha:
              </label>
              <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                <AiOutlineLock className="text-[#07D99D] text-xl mr-2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                  placeholder="Digite sua nova senha"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#07D99D] font-semibold mb-2">
                Confirmar Senha:
              </label>
              <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                <AiOutlineLock className="text-[#07D99D] text-xl mr-2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                  placeholder="Confirme sua nova senha"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-gradient-to-r from-[#07D99D] to-[#1e445c] text-white font-bold py-3 rounded-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-[#42ADF0] hover:underline"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
