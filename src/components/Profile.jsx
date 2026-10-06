import React, { useRef, useState } from "react";
import axios from "axios";
import api from "../axios/axiosBase";

export default function Profile({ user, token, onLogout }) {
  const [photo, setPhoto] = useState(user.photo || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");
  const fileInput = useRef();

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("photo", e.target.files[0]);
      try {
        const res = await api.post("/api/profile/photo", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPhoto(res.data.photoUrl);
        setSuccess("Foto alterada com sucesso!");
        setErro("");
      } catch {
        setErro("Erro ao alterar foto.");
        setSuccess("");
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErro("");
    setSuccess("");
    if (newPassword.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }
    try {
      await api.post("/api/profile/password", {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErro("Senha atual incorreta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#010821] via-[#0B1536] to-[#101a36] px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#42ACF0]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/10 relative z-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#8B5CF6] bg-clip-text mb-8 text-center drop-shadow-lg">
          Meu Perfil
        </h2>
        <div className="flex flex-col items-center mb-8 w-full">
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            className="hidden"
            onChange={handlePhotoChange}
          />
          <div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#5524E8] to-[#42ACF0] border-4 border-[#5524E8] flex items-center justify-center cursor-pointer mb-3 overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-[#5524E8]/50"
            onClick={() => fileInput.current.click()}
            title="Alterar foto"
          >
            {photo ? (
              <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl text-white">👤</span>
            )}
          </div>
          <button
            onClick={() => fileInput.current.click()}
            className="bg-gradient-to-r from-[#5524E8] to-[#42ACF0] text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-[#6024AF] hover:to-[#42ACF0] hover:shadow-[#5524E8]/50 transition-all duration-300 transform hover:scale-105"
          >
            Alterar Foto
          </button>
          <div className="text-center mt-4">
            <div className="text-lg font-semibold text-[#5524E8]">{user.name}</div>
            <div className="text-sm text-gray-300">{user.email}</div>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-6 w-full">
          <div>
            <label className="block text-sm font-semibold text-[#5524E8] mb-2">Senha atual</label>
            <input
              type="password"
              placeholder="Senha atual"
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5524E8] mb-2">Nova senha</label>
            <input
              type="password"
              placeholder="Nova senha"
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5524E8] mb-2">Confirmar nova senha</label>
            <input
              type="password"
              placeholder="Confirmar nova senha"
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-[#5524E8]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#42ACF0] focus:border-[#42ACF0] outline-none transition-all duration-300"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {erro && <div className="text-red-400 text-center font-semibold bg-red-400/10 rounded-lg p-2">{erro}</div>}
          {success && <div className="text-[#42ACF0] text-center font-semibold bg-[#42ACF0]/10 rounded-lg p-2">{success}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5524E8] to-[#42ACF0] text-white font-bold py-4 rounded-xl shadow-lg hover:from-[#6024AF] hover:to-[#42ACF0] hover:shadow-[#5524E8]/50 transition-all duration-300 transform hover:scale-105 mt-4"
          >
            Alterar Senha
          </button>
        </form>
        {/* <button
          onClick={onLogout}
          className="w-full mt-8 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-3 rounded-lg shadow hover:brightness-110 transition"
        >
          Sair
        </button> */}
      </div>
    </div>
  );
}
