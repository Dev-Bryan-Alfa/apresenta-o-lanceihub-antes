import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios/axiosBase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from './context/AuthContext';
import Context from './context/Context';

function UsersCount() {
  const [countUsers, setCountUsers] = useState(null);
  const [total, setTotal] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useContext(Context);

  async function getUsersCount() {
    try {
      setLoading(true);
      setError(null);
      const { data: count } = await api.get('/user/count');
      setTotal(count.total);
      delete count['total'];
      setCountUsers(count);

      const { data: allUsers } = await api.get('/user');
      setUsers(allUsers);
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      nav('/');
      return;
    }
    getUsersCount();
  }, []);

  // Transform data for chart
  const chartData = countUsers
    ? Object.keys(countUsers)
      .map((key) => ({
        monthYear: key,
        count: countUsers[key],
      }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
    : [];

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users]);

  const formatPaymentStatus = (payment) => {
    if (!payment) return 'Sem assinatura';
    if (payment.status === 'active') return 'Ativo';
    return payment.status || 'Desconhecido';
  };

  const formatExpiry = (expiresIn) => {
    if (!expiresIn) return 'Sem expiração registrada';
    const diff = new Date(expiresIn) - new Date();
    if (diff <= 0) return 'Expirado';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h restantes`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010821] to-[#0a1a3a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010821] to-[#0a1a3a] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-purple-500/20">
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={getUsersCount}
            className="mt-4 bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white px-4 py-2 rounded-lg hover:from-[#6024AF] hover:to-[#310092] transition-all duration-300 shadow-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00071E] to-[#001122] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
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

        {/* Total Users Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border border-purple-500/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Total de Usuários</h2>
            <p className="text-4xl font-extrabold text-purple-600">{total}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Novos Usuários por Mês/Ano</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis
                dataKey="monthYear"
                stroke="#ccc"
                fontSize={12}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year}`;
                }}
              />
              <YAxis stroke="#ccc" fontSize={12} />
              <Tooltip
                labelFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `Mês ${month}/${year}`;
                }}
                formatter={(value) => [`${value} usuários`, 'Novos Usuários']}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #5524E8',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              />
              <Bar dataKey="count" fill="#6E00B3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed List */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 mt-8 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Detalhes por Mês/Ano</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((item) => (
              <div key={item.monthYear} className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                <div className="text-sm text-gray-300">
                  Mês {item.monthYear.split('-')[1]} / Ano {item.monthYear.split('-')[0]}
                </div>
                <div className="text-lg font-semibold text-[#B069DB]">
                  {item.count} novos usuários
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Users Detail */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 mt-8 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Novos usuários (mais recentes)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUsers.map((u) => (
              <div key={u.id} className="bg-white/5 p-4 rounded-lg border border-purple-500/10 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">{u.nome || 'Sem nome'}</p>
                    <p className="text-gray-400 text-sm">{u.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-purple-600/30 text-purple-200 border border-purple-500/40">
                    {formatPaymentStatus(u.payment)}
                  </span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>CPF: {u.cpf || '—'}</p>
                  <p>Contato: {u.contato || '—'}</p>
                  <p>Cadastro: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}</p>
                  <p>Plano: {u.payment?.planName || '—'}</p>
                  <p>Pagamento: {u.payment?.paymentId === 'cupom_registered' ? 'Cupom' : (u.payment?.paymentId || '—')}</p>
                  <p>Expiração: {formatExpiry(u.payment?.expiresIn)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersCount;
