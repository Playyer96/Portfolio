import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Select, Checkbox } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';
import './panels.css';

const STATUS_OPTIONS = [
  { value: 'online',      label: 'Online' },
  { value: 'local',       label: 'Local only' },
  { value: 'maintenance', label: 'Maintenance' },
];

const CATEGORY_OPTIONS = [
  { value: 'Dev Tools',        label: 'Dev Tools' },
  { value: 'Media',            label: 'Media' },
  { value: 'Media Automation', label: 'Media Automation' },
  { value: 'Monitoring',       label: 'Monitoring' },
  { value: 'Infrastructure',   label: 'Infrastructure' },
  { value: 'Security',         label: 'Security' },
  { value: 'Networking',       label: 'Networking' },
  { value: 'Storage',          label: 'Storage' },
  { value: 'Other',            label: 'Other' },
];

const ICON_OPTIONS = [
  { value: 'server',   label: '[ ] Server (default)' },
  { value: 'git',      label: '[G] Git / Version Control' },
  { value: 'media',    label: '[M] Media / Streaming' },
  { value: 'arr',      label: '[A] Media Automation (*arr)' },
  { value: 'docker',   label: '[D] Docker / Containers' },
  { value: 'storage',  label: '[S] Storage / NAS' },
  { value: 'monitor',  label: '[~] Monitoring' },
  { value: 'network',  label: '[N] Network' },
  { value: 'security', label: '[X] Security' },
  { value: 'proxy',    label: '[P] Reverse Proxy' },
];

const STATUS_COLORS = { online: '#10b981', local: '#f59e0b', maintenance: '#ef4444' };

function ServiceForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item
    ? {
        ...item,
        images:  Array.isArray(item.images)  ? item.images.join(', ')  : (item.images  || ''),
        learned: Array.isArray(item.learned) ? item.learned.join('\n') : (item.learned || ''),
        tags:    Array.isArray(item.tags)    ? item.tags.join(', ')    : (item.tags    || ''),
      }
    : {
        name: '', slug: '', subdomain: '', isPublic: true, url: '', localUrl: '',
        icon: 'server', color: '#629755', status: 'online', description: '',
        category: 'Infrastructure', images: '', learned: '', tags: '',
        uptime: '', since: '', order: 0, featured: false,
      }
  );
  const [saving, setSaving] = useState(false);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        images:  form.images.split(',').map(s => s.trim()).filter(Boolean),
        learned: form.learned.split('\n').map(s => s.trim()).filter(Boolean),
        tags:    form.tags.split(',').map(s => s.trim()).filter(Boolean),
        order:   parseInt(form.order) || 0,
      }, item?._id);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal
      isOpen
      onClose={onCancel}
      title={item ? `Edit · ${item.name}` : 'New Service'}
      onSubmit={handleSubmit}
      loading={saving}
      wide
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Name" style={{ flex: 1 }}>
          <Input value={form.name} onChange={e => set('name', e.target.value)} required />
        </FormField>
        <FormField label="Slug" style={{ flex: 1 }}>
          <Input value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="gitea" />
        </FormField>
        <FormField label="Subdomain" style={{ width: 110 }}>
          <Input value={form.subdomain} onChange={e => set('subdomain', e.target.value)} placeholder="git" />
        </FormField>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Status" style={{ flex: 1 }}>
          <Select value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTIONS} />
        </FormField>
        <FormField label="Category" style={{ flex: 2 }}>
          <Select value={form.category} onChange={e => set('category', e.target.value)} options={CATEGORY_OPTIONS} />
        </FormField>
        <FormField label="Icon" style={{ flex: 2 }}>
          <Select value={form.icon} onChange={e => set('icon', e.target.value)} options={ICON_OPTIONS} />
        </FormField>
        <FormField label="Color" style={{ width: 80 }}>
          <input
            type="color"
            value={form.color}
            onChange={e => set('color', e.target.value)}
            style={{ width: '100%', height: 36, border: 'none', cursor: 'pointer', background: 'none' }}
          />
        </FormField>
      </div>

      <FormField label="Description">
        <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
      </FormField>

      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Public URL" style={{ flex: 2 }}>
          <Input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://git.yourdomain.com" />
        </FormField>
        <FormField label="Local URL" style={{ flex: 2 }}>
          <Input value={form.localUrl} onChange={e => set('localUrl', e.target.value)} placeholder="http://192.168.x.x:port" />
        </FormField>
        <FormField label="Uptime" style={{ flex: 1 }}>
          <Input value={form.uptime} onChange={e => set('uptime', e.target.value)} placeholder="99.9%" />
        </FormField>
        <FormField label="Since" style={{ flex: 1 }}>
          <Input value={form.since} onChange={e => set('since', e.target.value)} placeholder="2024-01" />
        </FormField>
      </div>

      <FormField label="Tags (comma-separated)">
        <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Docker, Git, Caddy" />
      </FormField>

      <FormField label="Screenshot URLs (comma-separated)">
        <Input value={form.images} onChange={e => set('images', e.target.value)} placeholder="https://..." />
      </FormField>

      <FormField label="What I Learned (one item per line)">
        <Textarea
          value={form.learned}
          onChange={e => set('learned', e.target.value)}
          rows={5}
          placeholder={'Configuring Caddy as a reverse proxy with automatic HTTPS\nRunning Gitea Actions for CI/CD'}
        />
      </FormField>

      <div style={{ display: 'flex', gap: 16 }}>
        <FormField label="Order">
          <Input type="number" value={form.order} onChange={e => set('order', e.target.value)} style={{ width: 80 }} />
        </FormField>
        <FormField style={{ paddingTop: 22 }}>
          <Checkbox label="Public (internet-accessible)" checked={!!form.isPublic} onChange={e => set('isPublic', e.target.checked)} />
        </FormField>
        <FormField style={{ paddingTop: 22 }}>
          <Checkbox label="Featured" checked={!!form.featured} onChange={e => set('featured', e.target.checked)} />
        </FormField>
      </div>
    </FormModal>
  );
}

export default function PanelHomelab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch('homelab');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data, id) => {
    if (id) {
      const updated = await authFetch(`homelab/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setItems(prev => prev.map(p => p._id === id ? updated : p));
    } else {
      const created = await authFetch('homelab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setItems(prev => [...prev, created]);
    }
    setModal(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeleting(item._id);
    try {
      await authFetch(`homelab/${item._id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p._id !== item._id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <CrudPanel
        title="Homelab Services"
        items={items}
        loading={loading}
        error={error}
        onAdd={() => setModal({ mode: 'create' })}
        onRefresh={fetchData}
        renderItem={(item) => (
          <ItemCard key={item._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: item.color || '#888',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontSize: 11, color: '#000', fontWeight: 700,
                flexShrink: 0,
              }}>
                {(item.icon || 'srv').slice(0, 3).toUpperCase()}
              </div>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: STATUS_COLORS[item.status] || '#888',
                boxShadow: item.status === 'online' ? `0 0 6px ${STATUS_COLORS.online}` : 'none',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {item.name}
                  {item.subdomain && (
                    <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.6, fontFamily: 'monospace' }}>
                      {item.subdomain}.
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{item.category}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <span style={{
                  fontSize: 9, padding: '2px 7px', fontFamily: 'monospace', fontWeight: 700,
                  letterSpacing: '0.08em',
                  background: `color-mix(in srgb, ${STATUS_COLORS[item.status] || '#888'} 14%, transparent)`,
                  color: STATUS_COLORS[item.status] || '#888',
                  border: `1px solid color-mix(in srgb, ${STATUS_COLORS[item.status] || '#888'} 28%, transparent)`,
                }}>
                  {item.status === 'local' ? 'LOCAL' : (item.status || 'online').toUpperCase()}
                </span>
                {item.learned?.length > 0 && (
                  <span style={{ fontSize: 9, opacity: 0.5 }}>{item.learned.length} lessons</span>
                )}
              </div>
            </div>
            {item.description && (
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8, lineHeight: 1.4 }}>
                {item.description.slice(0, 120)}{item.description.length > 120 ? '...' : ''}
              </div>
            )}
            <ItemActions
              onEdit={() => setModal({ mode: 'edit', item })}
              onDelete={() => handleDelete(item)}
              isDeleting={deleting === item._id}
            />
          </ItemCard>
        )}
      />

      {modal && (
        <ServiceForm
          item={modal.mode === 'edit' ? modal.item : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
