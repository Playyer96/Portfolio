import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

// Fallback data for when API calls fail
const FALLBACK_DATA: Record<string, any> = {
  '/technologies': [{
    technologies: [
      { text: 'React' },
      { text: 'TypeScript' },
      { text: 'JavaScript' },
      { text: 'Node.js' },
      { text: 'Python' },
      { text: 'HTML5' },
      { text: 'CSS 3' },
      { text: 'Git' },
      { text: 'GitHub' },
      { text: 'Docker' },
      { text: 'Unity Engine' },
      { text: 'C#' }
    ]
  }],
  '/projects': [{
    projects: [
      {
        _id: '1',
        name: 'Portfolio Website',
        descriptions: ['A modern portfolio website built with React and TypeScript'],
        technologies: [{ name: 'React' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' }],
        responsibilities: ['Frontend Development', 'UI/UX Design', 'Performance Optimization'],
        link: 'https://github.com'
      },
      {
        _id: '2',
        name: 'Web Application',
        descriptions: ['Full-stack web application with modern technologies'],
        technologies: [{ name: 'Node.js' }, { name: 'React' }, { name: 'MongoDB' }],
        responsibilities: ['Full-stack Development', 'Database Design', 'API Development']
      }
    ]
  }],
  '/experience': [{
    experience: [
      {
        _id: '1',
        title: 'Software Developer',
        company: 'Tech Company',
        date: '2023 - Present',
        description: 'Developing modern web applications using React and TypeScript'
      }
    ]
  }],
  '/about': [{
    about: {
      description: 'Passionate software developer with experience in modern web technologies.',
      skills: ['React', 'TypeScript', 'Node.js', 'Python']
    }
  }]
};

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
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!endpoint) return;

    const abortController = new AbortController();
    
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: abortController.signal,
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: T = await response.json();
        if (!abortController.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return; // Request was cancelled, don't update state
        }
        
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.warn('API Error, using fallback data:', err);
        
        // Use fallback data if available
        const fallbackData = FALLBACK_DATA[endpoint];
        if (fallbackData) {
          setData(fallbackData as T);
          setError(null); // Clear error since we have fallback data
        } else {
          setError(errorMessage);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [endpoint, JSON.stringify(options), refetchTrigger]);

  const refetch = useCallback((): void => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

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
      console.warn('API Error, using fallback data:', err);
      
      // Use fallback data if available
      const fallbackData = FALLBACK_DATA[endpoint];
      if (fallbackData) {
        setData(fallbackData as T);
        setError(null);
        return fallbackData as T;
      } else {
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};