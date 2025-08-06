import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let refreshingPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && 
        error.response?.data?.tokenExpired && 
        !originalRequest._retry) {
      
      if (!refreshingPromise) {
        refreshingPromise = api.post('/auth/refresh')
          .then((response) => {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
          })
          .catch(() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/user/login';
            throw error;
          })
          .finally(() => {
            refreshingPromise = null;
          });
      }
      
      try {
        const newToken = await refreshingPromise;
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
