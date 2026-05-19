import axios from 'axios';

// এখানে আপনার Vercel-এর লাইভ ব্যাকএন্ড লিংকটি সরাসরি বসিয়ে দেওয়া হলো
const API = axios.create({
  baseURL: 'https://net-pulse-backend-eight.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
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