import axios from 'axios';


const API = axios.create({

  baseURL: (import.meta.env.VITE_API_URL || 'https://net-pulse-backend.vercel.app').replace(/\/$/, '') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <--- এই ফাইলে এই লাইনটি এখানে যোগ করা হয়েছে
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;