import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/profile');
        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, user: currentUser } = response.data.data;
    localStorage.setItem('token', token);
    setUser(currentUser);
    return currentUser;
  };

  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token, user: currentUser } = response.data.data;
    localStorage.setItem('token', token);
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
