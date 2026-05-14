import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Select, Checkbox } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';
import './panels.css';

const PLATFORM_OPTIONS = [
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'desktop', label: 'Desktop' },
];

const PLATFORM_LABELS = { android: 'Android', ios: 'iOS', desktop: 'Desktop' };

function AppForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', slug: '', description: '', platform: 'android', appStoreUrl: '', googlePlayUrl: '', downloads: 0, rating: 0, featured: false });
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState(null);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (files) Array.from(files).forEach(f => fd.append('images', f));
      await onSave(fd, item?._id);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit App' : 'New App'} onSubmit={handleSubmit} loading={saving} wide>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Name" style={{ flex: 1 }}>
          <Input value={form.name || ''} onChange={e => update('name', e.target.value)} required />
        </FormField>
        <FormField label="Slug" style={{ flex: 1 }}>
          <Input value={form.slug || ''} onChange={e => update('slug', e.target.value)} required />
        </FormField>
      </div>
      <FormField label="Description">
        <Textarea value={form.description || ''} onChange={e => update('description', e.target.value)} />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Platform" style={{ flex: 1 }}>
          <Select value={form.platform || 'android'} onChange={e => update('platform', e.target.value)} options={PLATFORM_OPTIONS} />
        </FormField>
        <FormField label="Downloads" style={{ flex: 1 }}>
          <Input type="number" value={form.downloads || 0} onChange={e => update('downloads', parseInt(e.target.value) || 0)} />
        </FormField>
        <FormField label="Rating" style={{ flex: 1 }}>
          <Input type="number" step="0.1" min="0" max="5" value={form.rating || 0} onChange={e => update('rating', parseFloat(e.target.value) || 0)} />
        </FormField>
      </div>
      <FormField label="App Store URL">
        <Input value={form.appStoreUrl || ''} onChange={e => update('appStoreUrl', e.target.value)} />
      </FormField>
      <FormField label="Google Play URL">
        <Input value={form.googlePlayUrl || ''} onChange={e => update('googlePlayUrl', e.target.value)} />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField>
          <Checkbox label="Featured" checked={!!form.featured} onChange={e => update('featured', e.target.checked)} />
        </FormField>
        <FormField label="Images" style={{ flex: 1 }}>
          <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} className="ff__file-input" />
          {form.images?.length > 0 && (
            <div className="ff__file-info">{form.images.length} image(s) on file</div>
          )}
        </FormField>
      </div>
    </FormModal>
  );
}

export default function PanelApps() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('apps');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (fd, id) => {
    if (id) {
      const updated = await authFetch(`apps/${id}`, { method: 'PUT', body: fd });
      setItems(prev => prev.map(p => p._id === id ? updated : p));
    } else {
      const created = await authFetch('apps', { method: 'POST', body: fd });
      setItems(prev => [...prev, created]);
    }
    setModal(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeleting(item._id);
    try {
      await authFetch(`apps/${item._id}`, { method: 'DELETE' });
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
        title="Apps"
        items={items}
        loading={loading}
        error={error}
        onRefresh={fetchData}
        onAdd={() => setModal({})}
        renderItem={(item) => (
          <ItemCard key={item._id}>
            <div className="pp-row">
              <div className="pp-info">
                <div className="pp-name-row">
                  <span className="pp-name">{item.name}</span>
                  <span className="pp-badge pp-badge--dim">{PLATFORM_LABELS[item.platform] || item.platform}</span>
                  {item.featured && <span className="pp-badge pp-badge--accent">FEATURED</span>}
                </div>
                {item.description && <div className="pp-detail">{item.description}</div>}
                <div className="pp-sub">
                  {item.downloads > 0 && `${item.downloads.toLocaleString()} downloads · `}
                  {item.rating > 0 && `★ ${item.rating.toFixed(1)}`}
                </div>
              </div>
              <ItemActions
                onEdit={() => setModal({ ...item })}
                onDelete={() => handleDelete(item)}
                isDeleting={deleting === item._id}
              />
            </div>
          </ItemCard>
        )}
      />
      {modal && (
        <AppForm
          item={modal._id ? modal : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
