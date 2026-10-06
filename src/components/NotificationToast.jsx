import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosBase from '../axios/axiosBase';
import { useAuth } from '../context/AuthContext';
const NotificationToast = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);
  const fetchNotifications = async () => {
    try {
      const response = await axiosBase.get('/notification');
      const newNotifications = response.data.filter(n => !n.read);
      newNotifications.forEach(notification => {
        toast(notification.message, {
          type: notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'info',
          position: 'top-right',
          autoClose: 5000,
        });
        markAsRead(notification.id);
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  const markAsRead = async (id) => {
    try {
      await axiosBase.put(`/notification/${id}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  return <ToastContainer />;
};
export default NotificationToast;