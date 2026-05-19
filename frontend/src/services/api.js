import axios from 'axios';

// এখানে Vercel-এর লাইভ ব্যাকএন্ড লিংকটি সরাসরি বসিয়ে দেওয়া হলো এবং withCredentials ট্রু করা হলো
const API = axios.create({
  // Use VITE_API_URL from environment (set in Vercel) with a safe fallback.
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