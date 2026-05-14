import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiSettings, FiFileText, FiPackage, FiSmartphone, FiGrid, FiHome } from 'react-icons/fi';
import { login, authFetch } from '../data/api';

const NAV_ITEMS = [
  { id: 'home',   label: 'Overview',     icon: FiHome },
  { id: 'about',  label: 'About',        icon: FiSettings },
  { id: 'projects', label: 'Projects',   icon: FiGrid },
  { id: 'experience', label: 'Experience', icon: FiFileText },
  { id: 'blog',   label: 'Blog',         icon: FiFileText },
  { id: 'plugins', label: 'Plugins',     icon: FiPackage },
  { id: 'apps',   label: 'Apps',         icon: FiSmartphone },
];

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result?.token) {
      localStorage.setItem('auth_token', result.token);
      onLogin(result.user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#eee' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, padding: 32, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Dashboard Login</h2>
        {error && <p style={{ color: '#f44', fontSize: 13, margin: 0 }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#eee', fontSize: 14 }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#eee', fontSize: 14 }} />
        <button type="submit" style={{ padding: '10px 12px', background: '#3b82f6', border: 'none', borderRadius: 4, color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
      </form>
    </div>
  );
}

function DashboardShell({ user, onLogout, children }) {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#ccc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ width: 220, background: '#111', borderRight: '1px solid #222', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
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
                cursor: 'pointer', fontSize: 13, textAlign: 'left', borderLeft: tab === item.id ? '2px solid #3b82f6' : '2px solid transparent',
              }}>
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', border: 'none', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: 13, marginTop: 8 }}>
          <FiLogOut size={14} /> Logout
        </button>
      </nav>
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
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
      <p style={{ fontSize: 12, color: '#444', marginTop: 24 }}>
        Dashboard ready for content management. Use the sidebar to navigate.
      </p>
    </div>
  );
}

function PlaceholderPanel({ title, description }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px', color: '#eee' }}>{title}</h1>
      <p style={{ fontSize: 13, color: '#666', margin: '0 0 24px' }}>{description || 'CRUD management coming soon.'}</p>
      <div style={{ padding: 40, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center', color: '#555', fontSize: 13 }}>
        This panel will contain the {title.toLowerCase()} management interface.
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
      authFetch('auth/me').then(data => {
        if (data?.email) setUser(data);
        else localStorage.removeItem('auth_token');
      }).catch(() => localStorage.removeItem('auth_token'))
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
          case 'home': return <Overview user={user} />;
          case 'about': return <PlaceholderPanel title="About" description="Edit your personal info, bio, values, social links, and CV." />;
          case 'projects': return <PlaceholderPanel title="Projects" description="Add, edit, reorder, or remove portfolio projects." />;
          case 'experience': return <PlaceholderPanel title="Experience" description="Manage work history and education timeline entries." />;
          case 'blog': return <PlaceholderPanel title="Blog" description="Write, edit, publish, and manage blog posts." />;
          case 'plugins': return <PlaceholderPanel title="Plugins" description="Manage Unity/Unreal Asset Store plugins and packages." />;
          case 'apps': return <PlaceholderPanel title="Apps" description="Manage App Store and Google Play app listings." />;
          default: return <Overview user={user} />;
        }
      }}
    </DashboardShell>
  );
}
