import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  plan: string;
  balance: number;
  totalSpent: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('nusaai_token');
    if (saved) {
      setToken(saved);
      // Fetch user profile
      axios
        .get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${saved}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('nusaai_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('nusaai_token', newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/register`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('nusaai_token', newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nusaai_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
