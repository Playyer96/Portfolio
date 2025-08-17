import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApiLazyReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (endpoint: string, options?: ApiOptions) => Promise<T>;
}

export const useApi = <T = any>(endpoint: string, options: ApiOptions = {}): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [fetchData]);

  const refetch = useCallback((): void => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useApiLazy = <T = any>(): UseApiLazyReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (endpoint: string, options: ApiOptions = {}): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};