import axios from 'axios';

// Не добавляйте базовый URL автоматически, т.к. Next.js API routes 
// относительны к текущему домену
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Интерцепторы для отладки
api.interceptors.request.use(
  config => {
    console.log('Request:', config);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

// Вспомогательные функции для аутентификации
export const authService = {
  async register(username: string, password: string) {
    return api.post('/api/auth/register', { username, password });
  },
  
  async login(username: string, password: string) {
    return api.post('/api/auth/login', { username, password });
  },
};

export default api;