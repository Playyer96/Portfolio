import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiSettings, FiFileText, FiPackage, FiSmartphone, FiGrid, FiHome, FiCpu } from 'react-icons/fi';
import { login, authFetch } from '../data/api';
import PanelAbout from './panels/PanelAbout';
import PanelProjects from './panels/PanelProjects';
import PanelExperience from './panels/PanelExperience';
import PanelTechnologies from './panels/PanelTechnologies';
import PanelBlog from './panels/PanelBlog';
import PanelPlugins from './panels/PanelPlugins';
import PanelApps from './panels/PanelApps';

const NAV_ITEMS = [
  { id: 'home',       label: 'Overview',     icon: FiHome },
  { id: 'about',      label: 'About',        icon: FiSettings },
  { id: 'projects',   label: 'Projects',     icon: FiGrid },
  { id: 'experience', label: 'Experience',   icon: FiFileText },
  { id: 'technologies', label: 'Technologies', icon: FiCpu },
  { id: 'blog',       label: 'Blog',         icon: FiFileText },
  { id: 'plugins',    label: 'Plugins',      icon: FiPackage },
  { id: 'apps',       label: 'Apps',         icon: FiSmartphone },
];

const inputBase = {
  width: '100%', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box',
  background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#eee', outline: 'none',
};

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.token) {
        localStorage.setItem('auth_token', result.token);
        onLogin(result.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#eee' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360, padding: 36, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#eee' }}>Dashboard Login</h2>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Sign in to manage your portfolio content.</p>
        {error && (
          <p style={{ color: '#f44', fontSize: 13, margin: 0, padding: '8px 12px', background: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: 4 }}>
            {error}
          </p>
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={inputBase} autoFocus required disabled={loading} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={inputBase} required disabled={loading} />
        <button type="submit" disabled={loading}
          style={{
            padding: '10px 12px', fontSize: 14, fontWeight: 600,
            background: loading ? '#2563eb' : '#3b82f6', border: 'none', borderRadius: 4,
            color: '#fff', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
}

function DashboardShell({ user, onLogout, children }) {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: '#ccc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ width: 220, background: '#111', borderRight: '1px solid #222', padding: '16px 0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #222', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#eee' }}>Portfolio Dashboard</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{user?.email}</div>
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', width: '100%', border: 'none',
                background: tab === item.id ? '#1a1a1a' : 'transparent', color: tab === item.id ? '#3b82f6' : '#888',
                cursor: 'pointer', fontSize: 13, textAlign: 'left',
                borderLeft: tab === item.id ? '2px solid #3b82f6' : '2px solid transparent',
              }}>
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', border: 'none',
            background: 'transparent', color: '#666', cursor: 'pointer', fontSize: 13, marginTop: 8,
          }}>
          <FiLogOut size={14} /> Logout
        </button>
      </nav>
      <main style={{ flex: 1, padding: 24, overflow: 'auto', minWidth: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
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
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px', color: '#eee' }}>Overview</h1>
      <p style={{ fontSize: 13, color: '#666', margin: '0 0 24px' }}>Welcome back, {user?.username || 'admin'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Projects', count: '—', color: '#3b82f6' },
          { label: 'Blog Posts', count: '—', color: '#10b981' },
          { label: 'Plugins', count: '—', color: '#f59e0b' },
          { label: 'Apps', count: '—', color: '#ec4899' },
        ].map(s => (
          <div key={s.label} style={{ padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
            <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.count}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222', fontSize: 12, color: '#666', lineHeight: 1.6 }}>
        Use the sidebar to manage your portfolio content. Select About, Projects, Experience, Technologies, Blog, Plugins, or Apps to start editing.
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authFetch('auth/me')
        .then(data => {
          if (data?.email) setUser(data);
          else localStorage.removeItem('auth_token');
        })
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
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
          default:             return <Overview user={user} />;
        }
      }}
    </DashboardShell>
  );
}
