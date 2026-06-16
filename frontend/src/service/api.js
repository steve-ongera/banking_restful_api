import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url, 'Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/register/', userData),
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.account) {
        localStorage.setItem('account', JSON.stringify(response.data.account));
      }
      // Set the default header immediately after login so subsequent
      // requests in the same call stack have the token
      api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
    }
    return response;
  },
  logout: () => {
    return api.post('/logout/', {}).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('account');
      delete api.defaults.headers.common['Authorization'];
    });
  },
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/', data),
};

export const accountService = {
  getAccounts: () => api.get('/accounts/'),
  getBalance: () => api.get('/accounts/balance/'),
};

export const transactionService = {
  getAll: () => api.get('/transactions/'),
  create: (data) => api.post('/transactions/', data),
};

// Restore token on page load
const savedToken = localStorage.getItem('token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Token ${savedToken}`;
}

export default api;