import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', {});
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);

  // useEffect(() => {
  //   if (!JSON.parse(localStorage.getItem('user') || 'null')) {
  //     setUser(null)
  //   }
  // }, localStorage.getItem('user'))


  const login = (userData, token) => {
    console.log(userData)
    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    console.log('limpando')
    localStorage.clear()
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Helper global p/ interceptors
let globalAuthSetter = null;
let globalAuthGetter = null;

export function setAuth(auth) {
  if (globalAuthSetter) globalAuthSetter(auth);
}

export function getAuth() {
  return globalAuthGetter ? globalAuthGetter() : {};
}

export function AuthBridge() {
  const { accessToken, logout, login } = useAuth();

  globalAuthSetter = ({ accessToken: newToken }) => {
    // Atualiza apenas o token sem mexer no user
    login({}, newToken);
  };

  globalAuthGetter = () => ({ accessToken, logout });
  return null;
}
