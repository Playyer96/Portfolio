import { useState, useCallback } from 'react';

const useConsoleLog = () => {
  const [logs, setLogs] = useState([]);

  const emit = useCallback((type, msg) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' });
    setLogs(prev => [...prev, { id, type, msg, timestamp }]);
  }, []);

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    emit,
    clear,
  };
};

export default useConsoleLog;
