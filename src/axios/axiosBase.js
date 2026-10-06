import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MODO_DEMO } from "../demo/ativarDemo";

// baseURL ajusta para seu backend fazer logica de colocar no env para não precisar ajustar toda hora
//  const API_BASE = "https://api.lanceihub.com.br";
 const API_BASE = "https://api.lanceihub.com";

// const API_BASE = 'http://localhost:3001';


const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // importante para enviar cookie HttpOnly
});
// Modo demonstração (GitHub Pages): as chamadas são respondidas com dados fictícios
if (MODO_DEMO) api.defaults.adapter = axios.defaults.adapter;
// Essas funções serão conectadas ao AuthContext
let getAccessToken = () => {
  // const { accessToken } = useAuth()
  // return accessToken // localStorage get
  return JSON.parse(localStorage.getItem("accessToken"));
};
let setAccessTokenExternal = (token) => {
  localStorage.setItem("accessToken", JSON.stringify(token));
}; // localStorage set
// Configura quem fornece e quem atualiza o token
export function setupAuthHandlers(getTokenFn, setTokenFn) {
  getAccessToken = getTokenFn;
  setAccessTokenExternal = setTokenFn;
}
// Request interceptor — adiciona Authorization se tiver token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
// Variáveis de controle para refresh
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};
// Response interceptor — tenta refresh em caso de 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (!originalConfig) return Promise.reject(err);
    if (err.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        // aguarda o refresh terminar
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalConfig.headers["Authorization"] = "Bearer " + token;
              resolve(api(originalConfig));
            },
            reject,
          });
        });
      }
      originalConfig._retry = true;
      isRefreshing = true;
      try {
        const resp = await axios.post(`${API_BASE}/auth/refresh`, null, {
          withCredentials: true,
        });
        const newAccessToken = resp.data.accessToken;
        // Atualiza no AuthContext
        setAccessTokenExternal(newAccessToken);
        processQueue(null, newAccessToken);
        // Repete requisição original
        originalConfig.headers["Authorization"] = "Bearer " + newAccessToken;
        return api(originalConfig);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessTokenExternal(null); // limpa token se refresh falhar
        // console.log('oi né, refresca nunca?')
        localStorage.setItem("user", JSON.stringify({}));
        window.location.reload();
        return Promise.reject(refreshErr);
        // setUser(null) refresh expirado ou inválido
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);
export default api;