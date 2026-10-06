import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(usuarioId, onMessage) {
  useEffect(() => {
    // No modo demonstração não existe servidor de WebSocket
    if (!usuarioId || process.env.REACT_APP_DEMO === "true") return undefined;

    const socket = io(`${process.env.REACT_APP_API_URL}/socket`, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("WebSocket conectado:", socket.id);
      socket.emit("join", { usuarioId });
    });

    socket.on("notification", (data) => {
      console.log("Notificacao recebida:", data);
      onMessage(data);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket desconectado.");
    });

    return () => socket.disconnect();
  }, [usuarioId, onMessage]);
}
