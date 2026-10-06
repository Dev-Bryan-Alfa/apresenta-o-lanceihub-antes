import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import axiosBase from '../axios/axiosBase';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import Context from '../context/Context';

const isNewUserNotification = (notification = {}) => {
  const type = (notification.tipo || notification.type || '').toLowerCase();
  return type.includes('novo usu') && type.includes('cad'); // tolerate charset glitches
};

const NotificationBell = () => {
  const { user } = useAuth();
  const { isAdmin } = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id || !isAdmin) return;
    try {
      const response = await axiosBase.get(`/notificacoes/user/${user.id}`);
      const onlyNewUsers = response.data.filter(isNewUserNotification);
      setNotifications(onlyNewUsers);
      setUnreadCount(onlyNewUsers.filter((n) => !n.lida).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user?.id || !isAdmin) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, user, isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useWebSocket(
    isAdmin ? user?.id : null,
    useCallback(
      (data) => {
        if (!isNewUserNotification(data) || !isAdmin) return;
        setNotifications((prev) => [data, ...prev]);
        if (!data.lida) {
          setUnreadCount((prev) => prev + 1);
        }
      },
      [isAdmin],
    ),
  );

  const markAsRead = async (id) => {
    try {
      await axiosBase.patch(`/notificacoes/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.lida);
    await Promise.all(unread.map((n) => markAsRead(n.id)));
  };

  const toggleDropdown = () => {
    if (!isAdmin) return;
    setDropdownOpen(!dropdownOpen);
  };

  if (!isAdmin) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#5524E8]/20 transition-colors duration-200 border border-purple-600/40"
        title="Notificacoes de novos usuarios"
        aria-label="Notificacoes de novos usuarios"
      >
        <IoNotificationsOutline size={24} className="text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] px-1 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0b1029] border border-purple-500/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/30">
            <h3 className="text-lg font-semibold text-white">Novos usuarios</h3>
            <button
              onClick={markAllAsRead}
              className="text-xs text-purple-300 hover:text-purple-100 transition"
            >
              Marcar tudo como lido
            </button>
          </div>
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum novo usuario por aqui.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    notification.lida
                      ? 'bg-gray-800/80 border border-gray-700'
                      : 'bg-purple-600/20 border border-purple-500'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-white text-sm font-semibold">
                    {notification.titulo || 'Novo usuario cadastrado'}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    {notification.mensagem || notification.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {notification.createdAt
                      ? new Date(notification.createdAt).toLocaleString('pt-BR')
                      : ''}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
