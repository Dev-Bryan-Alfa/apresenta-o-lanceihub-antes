import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../axios/axiosBase";

export default function ResetPasswordModal({ isOpen, onClose }) {
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
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#010821]">
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
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07D99D] text-[#010821]"
              placeholder="Digite sua nova senha"
              required
              minLength={8}
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#07D99D] font-semibold mb-2">
              Confirmar Senha:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07D99D] text-[#010821]"
              placeholder="Confirme sua nova senha"
              required
              minLength={8}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !token}
              className="flex-1 bg-[#07D99D] text-white py-2 rounded-lg hover:bg-[#06b889] transition disabled:opacity-50"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
