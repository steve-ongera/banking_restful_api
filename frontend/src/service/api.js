import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  logout: () => api.post('/logout/'),
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/', data),
};

// Account services
export const accountService = {
  getAccounts: () => api.get('/accounts/'),
  getBalance: () => api.get('/accounts/balance/'),
};

// Transaction services
export const transactionService = {
  getAll: () => api.get('/transactions/'),
  create: (data) => api.post('/transactions/', data),
};

export default api;