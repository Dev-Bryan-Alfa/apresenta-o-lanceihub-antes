import React, { useState, useEffect, useContext } from 'react';
import api from '../axios/axiosBase';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaLock, FaFileContract, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Context from '../context/Context';
import { MdPayment } from "react-icons/md";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    contato: '',
    dataNascimento: '',
    foto: '',
    newPassword: ''
  });
  const [admin, setAdmin] = useState(false);
  const [countUsers, setCountUsers] = useState(null);
  const { isAdmin } = useContext(Context);

  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      nav('/');
      return;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getCouponCountdown = (payment) => {
    if (!payment?.expiresIn || !payment?.paymentId?.toLowerCase().includes('cupom')) return null;
    const diff = new Date(payment.expiresIn) - new Date();
    if (diff <= 0) return 'Cupom expirado';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `Cupom expira em ${days}d ${hours}h`;
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user');
      setUsers(res.data);

      const { data: count } = await api.get('/user/count');
      setCountUsers(count);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      nome: user.nome || '',
      email: user.email || '',
      contato: user.contato || '',
      dataNascimento: user.dataNascimento ? user.dataNascimento.split('T')[0] : '',
      foto: user.foto || '',
      newPassword: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setEditForm({
      nome: '',
      email: '',
      contato: '',
      dataNascimento: '',
      foto: '',
      newPassword: ''
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        nome: editForm.nome,
        email: editForm.email,
        contato: editForm.contato,
        dataNascimento: editForm.dataNascimento,
        foto: editForm.foto,
        admin
      };

      await api.put(`/user/${selectedUser.id}`, updateData);

      if (editForm.newPassword) {
        await api.put(`/user/${selectedUser.id}/password`, { newPassword: editForm.newPassword });
      }

      handleCloseModal();
      fetchUsers();
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      alert('Erro ao atualizar usuário');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00071E] to-[#001122] flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Carregando...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00071E] to-[#001122] flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00071E] to-[#001122] p-4 sm:p-6">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => nav(-1)}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-purple-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white px-6 py-3 rounded-lg shadow-lg hover:from-[#6024AF] hover:to-[#310092] transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Gerenciar Usuários
        </h1>

        <div className="bg-gradient-to-br from-[#00071E] to-[#360239] rounded-2xl p-8 shadow-2xl border border-[#BAA9FF]/30 mb-8 hover:shadow-[#BAA9FF]/20 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#BAA9FF]/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#BAA9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#BAA9FF] text-lg font-medium">Total de Usuários</p>
                <p className="text-white text-4xl font-bold">{countUsers?.total || 0}</p>
              </div>
            </div>
            <button
              onClick={() => nav('/admin/users/count')}
              className="bg-transparent border-2 border-[#BAA9FF] text-[#BAA9FF] font-medium py-3 px-6 rounded-xl hover:bg-[#BAA9FF] hover:text-[#1B2238] transition-all duration-300 hover:shadow-lg hover:shadow-[#BAA9FF]/50"
            >
              Ver Detalhes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {users.map(user => {
            const couponCountdown = getCouponCountdown(user.payment);
            return (
              <div key={user.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                    {user.nome ? user.nome.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">{user.nome || 'Nome não informado'}</h3>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <FaEnvelope className="text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaPhone className="text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{user.contato || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaCalendar className="text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">
                      {user.dataNascimento ? new Date(user.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MdPayment size={17} className="text-purple-400 mr-2 flex-shrink-0" />
                    {
                      user?.payment?.status === 'active' ? (
                        <span className="text-gray-300">{user?.payment?.paymentId === 'cupom_registered' ? 'Cupom' : 'Pago'}</span>
                      ) : (
                        <span className="text-gray-300">Pendente</span>
                      )
                    }
                  </div>
                  <div className="flex items-center text-sm">
                    <FaFileContract size={17} className="text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{user?.payment?.planName || 'Desconhecido'}</span>
                  </div>
                  {couponCountdown && (
                    <div className="flex items-center text-sm">
                      <FaClock className="text-purple-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{couponCountdown}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Calculadoras: {user._count?.calculadoras || 0}
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                      Checklists: {user._count?.checklists || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <FaEdit className="mr-2" /> Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Editar Usuário</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaUser className="inline mr-2" /> Nome
                </label>
                <input
                  type="text"
                  value={editForm.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaEnvelope className="inline mr-2" /> Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaPhone className="inline mr-2" /> Contato
                </label>
                <input
                  type="text"
                  value={editForm.contato}
                  onChange={(e) => handleInputChange('contato', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaCalendar className="inline mr-2" /> Data de Nascimento
                </label>
                <input
                  type="date"
                  value={editForm.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaLock className="inline mr-2" /> Nova Senha (opcional)
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Deixe em branco para manter a atual"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 transition-colors"
                />
                <label className="text-sm font-medium text-gray-300 select-none">
                  % Admin
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                <FaSave className="mr-2" /> Salvar
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
