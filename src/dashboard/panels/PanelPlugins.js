import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Select, Checkbox, ArrayInput, displayValue } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';
import './panels.css';

function PluginForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', slug: '', description: '', storeType: 'unity', unityStoreUrl: '', unrealStoreUrl: '', price: '', version: '1.0.0', technologies: [], featured: false });
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState(null);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'technologies') fd.append(k, Array.isArray(v) ? v.join(',') : v);
        else fd.append(k, v);
      });
      if (files) Array.from(files).forEach(f => fd.append('images', f));
      await onSave(fd, item?._id);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit Plugin' : 'New Plugin'} onSubmit={handleSubmit} loading={saving} wide>
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
        <FormField label="Store Type" style={{ flex: 1 }}>
          <Select value={form.storeType || 'unity'} onChange={e => update('storeType', e.target.value)}
            options={[{ value: 'unity', label: 'Unity Asset Store' }, { value: 'unreal', label: 'Unreal Marketplace' }]} />
        </FormField>
        <FormField label="Price" style={{ flex: 1 }}>
          <Input value={form.price || ''} onChange={e => update('price', e.target.value)} placeholder="Free, $29.99, etc." />
        </FormField>
        <FormField label="Version" style={{ flex: 1 }}>
          <Input value={form.version || '1.0.0'} onChange={e => update('version', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Unity Store URL">
        <Input value={form.unityStoreUrl || ''} onChange={e => update('unityStoreUrl', e.target.value)} />
      </FormField>
      <FormField label="Unreal Store URL">
        <Input value={form.unrealStoreUrl || ''} onChange={e => update('unrealStoreUrl', e.target.value)} />
      </FormField>
      <FormField label="Technologies">
        <ArrayInput values={(form.technologies || []).map(t => displayValue(t))} onChange={v => update('technologies', v)} />
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

export default function PanelPlugins() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('plugins');
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
      const updated = await authFetch(`plugins/${id}`, { method: 'PUT', body: fd });
      setItems(prev => prev.map(p => p._id === id ? updated : p));
    } else {
      const created = await authFetch('plugins', { method: 'POST', body: fd });
      setItems(prev => [...prev, created]);
    }
    setModal(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeleting(item._id);
    try {
      await authFetch(`plugins/${item._id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p._id !== item._id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const storeLabel = (type) => type === 'unreal' ? 'Unreal' : 'Unity';

  return (
    <>
      <CrudPanel
        title="Plugins & Packages"
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
                  <span className="pp-badge pp-badge--dim">{storeLabel(item.storeType)}</span>
                  {item.featured && <span className="pp-badge pp-badge--accent">FEATURED</span>}
                </div>
                {item.description && <div className="pp-detail">{item.description}</div>}
                <div className="pp-sub">
                  {item.price ? `${item.price} · ` : ''}
                  v{item.version}
                  {item.technologies?.length > 0 && ` · ${item.technologies.map(t => displayValue(t)).join(', ')}`}
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
        <PluginForm
          item={modal._id ? modal : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
