import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const baseUrl = () => process.env.REACT_APP_API_URL || '/api';

const inputStyle = {
  width: '100%', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box',
  background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#eee', outline: 'none',
};

const cardStyle = {
  display: 'flex', flexDirection: 'column', gap: 16, width: 360, padding: 36,
  background: '#111', borderRadius: 8, border: '1px solid #222',
};

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [mode, setMode] = useState(token ? 'reset' : 'forgot');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null); // { type: 'error'|'success', message }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) setMode('reset');
  }, [token]);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${baseUrl()}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus({ type: 'success', message: data.message });
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${baseUrl()}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: 'error', message: data.message });
      } else {
        setStatus({ type: 'success', message: 'Password updated! Redirecting to login...' });
        setTimeout(() => navigate('/dashboard'), 2500);
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#eee' }}>
      {mode === 'forgot' ? (
        <form onSubmit={handleForgot} style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#eee' }}>Forgot Password</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Enter your email and we'll send you a reset link.</p>
          {status && (
            <p style={{ color: status.type === 'error' ? '#f44' : '#4ade80', fontSize: 13, margin: 0, padding: '8px 12px', background: status.type === 'error' ? '#1a0a0a' : '#0a1a0a', border: `1px solid ${status.type === 'error' ? '#3a1a1a' : '#1a3a1a'}`, borderRadius: 4 }}>
              {status.message}
            </p>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle} autoFocus required disabled={loading} />
          <button type="submit" disabled={loading}
            style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600, background: '#3b82f6', border: 'none', borderRadius: 4, color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            ← Back to login
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#eee' }}>Set New Password</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Choose a strong password for your dashboard.</p>
          {status && (
            <p style={{ color: status.type === 'error' ? '#f44' : '#4ade80', fontSize: 13, margin: 0, padding: '8px 12px', background: status.type === 'error' ? '#1a0a0a' : '#0a1a0a', border: `1px solid ${status.type === 'error' ? '#3a1a1a' : '#1a3a1a'}`, borderRadius: 4 }}>
              {status.message}
            </p>
          )}
          <input type="password" placeholder="New password (min 8 chars)" value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} autoFocus required disabled={loading} />
          <input type="password" placeholder="Confirm new password" value={confirm}
            onChange={e => setConfirm(e.target.value)} style={inputStyle} required disabled={loading} />
          <button type="submit" disabled={loading}
            style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600, background: '#3b82f6', border: 'none', borderRadius: 4, color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
