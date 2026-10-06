import { useCallback, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import api from '../axios/axiosBase';
import { useAuth } from '../context/AuthContext';
import Context from '../context/Context';

const isNewUserNotification = (notification = {}) => {
  const type = (notification.tipo || '').toLowerCase();
  return type.includes('novo usu') && type.includes('cad');
};

export default function Notificacao() {
  const { user } = useAuth();
  const { isAdmin } = useContext(Context);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotificacoes = useCallback(async () => {
    if (!user?.id || !isAdmin) return;
    try {
      const response = await api.get(`/notificacoes/user/${user.id}`);
      setNotificacoes(response.data.filter(isNewUserNotification));
    } catch (error) {
      console.error('Erro ao buscar notificacoes:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notificacoes/${id}/read`);
      setNotificacoes((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)),
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleNewNotification = useCallback(
    (data) => {
      if (!isNewUserNotification(data) || !isAdmin) return;
      setNotificacoes((prev) => [data, ...prev]);
    },
    [isAdmin],
  );

  useWebSocket(isAdmin ? user?.id : null, handleNewNotification);

  useEffect(() => {
    fetchNotificacoes();
  }, [fetchNotificacoes]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Notificacoes</h1>
        <p className="text-gray-400">Apenas administradores veem notificacoes de novos usuarios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Notificacoes</h1>
        <div className="text-center">Carregando notificacoes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Notificacoes de novos usuarios</h1>

      {notificacoes.length === 0 ? (
        <div className="text-center text-gray-400">
          Nenhuma notificacao encontrada.
        </div>
      ) : (
        <div className="space-y-4">
          {notificacoes.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border transition-all ${
                notif.lida
                  ? 'bg-gray-800 border-gray-700 opacity-75'
                  : 'bg-gray-700 border-purple-500 shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{notif.titulo || 'Novo usuario cadastrado'}</h3>
                  <p className="text-gray-300 mb-2">{notif.mensagem}</p>
                  {notif.createdAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(notif.createdAt).toLocaleString('pt-BR')}
                    </p>
                  )}
                  {notif.tipo && (
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-600 text-xs rounded">
                      {notif.tipo}
                    </span>
                  )}
                </div>
                {!notif.lida && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    Marcar como Lida
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
