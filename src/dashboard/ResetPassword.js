import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { getApiBase } from '../data/api';
import { PASSWORD_MIN_LENGTH } from '../constants';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [mode, setMode] = useState(token ? 'reset' : 'forgot');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) setMode('reset');
  }, [token]);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${getApiBase()}/auth/forgot-password`, {
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
    if (password.length < PASSWORD_MIN_LENGTH) {
      setStatus({ type: 'error', message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${getApiBase()}/auth/reset-password`, {
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
    <div className="db-login">
      {mode === 'forgot' ? (
        <form onSubmit={handleForgot} className="db-login__form">
          <h2 className="db-login__title">Forgot Password</h2>
          <p className="db-login__subtitle">Enter your email and we'll send you a reset link.</p>
          {status && (
            <p className={status.type === 'error' ? 'db-login__error' : 'db-login__success'}>
              {status.message}
            </p>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="db-login__input" autoFocus required disabled={loading} />
          <button type="submit" disabled={loading} className="db-login__btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="db-login__forgot">
            ← Back to login
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="db-login__form">
          <h2 className="db-login__title">Set New Password</h2>
          <p className="db-login__subtitle">Choose a strong password for your dashboard.</p>
          {status && (
            <p className={status.type === 'error' ? 'db-login__error' : 'db-login__success'}>
              {status.message}
            </p>
          )}
          <input type="password" placeholder="New password (min 8 chars)" value={password}
            onChange={e => setPassword(e.target.value)} className="db-login__input" autoFocus required disabled={loading} />
          <input type="password" placeholder="Confirm new password" value={confirm}
            onChange={e => setConfirm(e.target.value)} className="db-login__input" required disabled={loading} />
          <button type="submit" disabled={loading} className="db-login__btn">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
