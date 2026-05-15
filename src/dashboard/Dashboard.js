import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiSettings, FiFileText, FiPackage, FiSmartphone, FiGrid, FiHome, FiCpu, FiServer } from 'react-icons/fi';
import { login, authFetch } from '../data/api';
import { AUTH_TOKEN_KEY } from '../constants';
import PanelAbout from './panels/PanelAbout';
import PanelProjects from './panels/PanelProjects';
import PanelExperience from './panels/PanelExperience';
import PanelTechnologies from './panels/PanelTechnologies';
import PanelBlog from './panels/PanelBlog';
import PanelPlugins from './panels/PanelPlugins';
import PanelApps from './panels/PanelApps';
import PanelHomelab from './panels/PanelHomelab';
import './Dashboard.css';

const NAV_ITEMS = [
  { id: 'home',         label: 'Overview',      icon: FiHome },
  { id: 'about',        label: 'About',         icon: FiSettings },
  { id: 'projects',     label: 'Projects',      icon: FiGrid },
  { id: 'experience',   label: 'Experience',    icon: FiFileText },
  { id: 'technologies', label: 'Technologies',  icon: FiCpu },
  { id: 'blog',         label: 'Blog',          icon: FiFileText },
  { id: 'plugins',      label: 'Plugins',       icon: FiPackage },
  { id: 'apps',         label: 'Apps',          icon: FiSmartphone },
  { id: 'homelab',      label: 'Homelab',       icon: FiServer },
];

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token);
        onLogin(result.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="db-login">
      <form onSubmit={handleSubmit} className="db-login__form">
        <h2 className="db-login__title">Dashboard Login</h2>
        <p className="db-login__subtitle">Sign in to manage your portfolio content.</p>
        {error && <p className="db-login__error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="db-login__input"
          autoFocus
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="db-login__input"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="db-login__btn">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button type="button" onClick={() => navigate('/reset-password')} className="db-login__forgot">
          Forgot password?
        </button>
      </form>
    </div>
  );
}

function DashboardShell({ user, onLogout, children }) {
  const [tab, setTab] = useState('home');

  return (
    <div className="db-shell">
      <nav className="db-nav">
        <div className="db-nav__header">
          <div className="db-nav__name">Portfolio Dashboard</div>
          <div className="db-nav__email">{user?.email}</div>
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`db-nav-item${tab === item.id ? ' db-nav-item--active' : ''}`}
            >
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
        <div className="db-nav__spacer" />
        <button onClick={onLogout} className="db-nav-item db-nav-item--logout">
          <FiLogOut size={14} /> Logout
        </button>
      </nav>
      <main className="db-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {children(tab)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Overview({ user }) {
  return (
    <div>
      <h1 className="db-overview__title">Overview</h1>
      <p className="db-overview__subtitle">Welcome back, {user?.username || 'admin'}</p>
      <div className="db-stat-grid">
        {['Projects', 'Blog Posts', 'Plugins', 'Apps'].map(label => (
          <div key={label} className="db-stat-card">
            <div className="db-stat-card__label">{label}</div>
            <div className="db-stat-card__count">—</div>
          </div>
        ))}
      </div>
      <div className="db-hint">
        Use the sidebar to manage your portfolio content. Select About, Projects, Experience, Technologies, Blog, Plugins, or Apps to start editing.
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      authFetch('auth/me')
        .then(data => {
          if (data?.email) setUser(data);
          else localStorage.removeItem(AUTH_TOKEN_KEY);
        })
        .catch(() => localStorage.removeItem(AUTH_TOKEN_KEY))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  if (loading) return null;
  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      {(tab) => {
        switch (tab) {
          case 'home':         return <Overview user={user} />;
          case 'about':        return <PanelAbout />;
          case 'projects':     return <PanelProjects />;
          case 'experience':   return <PanelExperience />;
          case 'technologies': return <PanelTechnologies />;
          case 'blog':         return <PanelBlog />;
          case 'plugins':      return <PanelPlugins />;
          case 'apps':         return <PanelApps />;
          case 'homelab':      return <PanelHomelab />;
          default:             return <Overview user={user} />;
        }
      }}
    </DashboardShell>
  );
}
