import { useAuth } from '@/context/AuthContext';
import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function useApi() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(
    async <T,>(config: AxiosRequestConfig): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios({
          ...config,
          baseURL: API_URL,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...config.headers,
          },
        });
        setLoading(false);
        return res.data;
      } catch (err: any) {
        setLoading(false);
        if (err.response?.status === 401) {
          logout();
        }
        const msg =
          err.response?.data?.error || err.message || 'An unexpected error occurred';
        setError(msg);
        throw err;
      }
    },
    [token, logout],
  );

  return { apiCall, loading, error };
}
