import React, { useState, useEffect } from 'react';
import api from '../axios/axiosBase';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaLock } from 'react-icons/fa';

const Users = () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user');
      setUsers(res.data);
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
      newPassword: ''
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
        foto: editForm.foto
      };

      // Update user info
      await api.put(`/user/${selectedUser.id}`, updateData);

      // Update password if provided
      if (editForm.newPassword) {
        await api.put(`/user/${selectedUser.id}/password`, { newPassword: editForm.newPassword });
      }

      handleCloseModal();
      fetchUsers(); // Refresh the list
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Gerenciar Usuários
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {users.map(user => (
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
          ))}
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

export default Users;