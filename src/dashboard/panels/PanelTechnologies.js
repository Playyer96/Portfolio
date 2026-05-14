import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Select, ArrayInput, displayValue } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';

const CATEGORY_OPTIONS = [
  { value: 'engines', label: 'Engines' },
  { value: 'languages', label: 'Languages' },
  { value: 'web', label: 'Web' },
  { value: 'xr3d', label: 'XR/3D' },
  { value: 'tools', label: 'Tools' },
  { value: 'hardware', label: 'Hardware' },
];

function TechForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', category: 'tools', packages: [] });
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit Technology' : 'New Technology'} onSubmit={handleSubmit} loading={saving}>
      <FormField label="Name">
        <Input value={form.name || ''} onChange={e => update('name', e.target.value)} required />
      </FormField>
      <FormField label="Category">
        <Select value={form.category || 'tools'} onChange={e => update('category', e.target.value)} options={CATEGORY_OPTIONS} />
      </FormField>
      <FormField label="Packages / Libraries" helper="Related tools and libraries.">
        <ArrayInput values={form.packages || []} onChange={v => update('packages', v)} />
      </FormField>
    </FormModal>
  );
}

export default function PanelTechnologies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('technologies');
      const techs = Array.isArray(data) && data[0]?.technologies ? data[0].technologies : [];
      setItems(techs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (form) => {
    if (modal?.index !== undefined) {
      const updated = await authFetch(`technologies/${modal.index}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setItems(prev => prev.map((p, i) => i === modal.index ? updated : p));
    } else {
      await authFetch('technologies', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      await fetchData();
    }
    setModal(null);
  };

  const handleDelete = async (index) => {
    const item = items[index];
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeleting(index);
    try {
      await authFetch(`technologies/${index}`, { method: 'DELETE' });
      setItems(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <CrudPanel
        title="Technologies"
        items={items}
        loading={loading}
        error={error}
        onRefresh={fetchData}
        onAdd={() => setModal({ index: undefined })}
        renderItem={(item, i) => {
          const cat = CATEGORY_OPTIONS.find(o => o.value === item.category);
          return (
            <ItemCard key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#eee' }}>{item.name}</span>
                    <span style={{ fontSize: 10, padding: '1px 6px', background: '#2a2a2a', borderRadius: 3, color: '#888' }}>{cat?.label || item.category}</span>
                  </div>
                  {item.packages?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {item.packages.map((p, j) => (
                        <span key={j} style={{ padding: '1px 6px', background: '#1a1a1a', borderRadius: 3, border: '1px solid #2a2a2a', fontSize: 11, color: '#777' }}>{displayValue(p)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <ItemActions
                  onEdit={() => setModal({ index: i, item })}
                  onDelete={() => handleDelete(i)}
                  isDeleting={deleting === i}
                />
              </div>
            </ItemCard>
          );
        }}
      />
      {modal && (
        <TechForm
          item={modal.item}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
