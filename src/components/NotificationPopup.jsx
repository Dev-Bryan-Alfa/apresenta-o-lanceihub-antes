import React, { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const NotificationPopup = ({ notification, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg border border-purple-500/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">Nova Notificação</h4>
            <p className="text-sm opacity-90">{notification.mensagem || notification.message || notification}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Fechar notificação"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
