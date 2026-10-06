import { useAuth } from '../context/AuthContext';

export default function useAuthHook() {
  const { user, accessToken, login, logout } = useAuth();

  return {
    user,
    accessToken,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };
}
