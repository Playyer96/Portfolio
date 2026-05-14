import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Select, ArrayInput, displayValue } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';

const ITEM_COLORS = ['#f9004d', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'];

function ExperienceForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { title: '', subtitle: '', date: '', icon: 'WorkIcon', iconBackground: ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)], responsibilities: [] });
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
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit Experience' : 'New Experience'} onSubmit={handleSubmit} loading={saving}>
      <FormField label="Title" helper="Company or institution name">
        <Input value={form.title || ''} onChange={e => update('title', e.target.value)} required />
      </FormField>
      <FormField label="Subtitle" helper="Your role or degree">
        <Input value={form.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
      </FormField>
      <FormField label="Date" helper="e.g. Mar 2021 - Present">
        <Input value={form.date || ''} onChange={e => update('date', e.target.value)} />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Icon" style={{ flex: 1 }}>
          <Select
            value={form.icon || 'WorkIcon'}
            onChange={e => update('icon', e.target.value)}
            options={[
              { value: 'WorkIcon', label: 'Work' },
              { value: 'SchoolIcon', label: 'Education' },
            ]}
          />
        </FormField>
        <FormField label="Icon Color" style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={form.iconBackground || '#f9004d'} onChange={e => update('iconBackground', e.target.value)}
              style={{ width: 36, height: 36, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
            <Input value={form.iconBackground || '#f9004d'} onChange={e => update('iconBackground', e.target.value)}
              style={{ fontFamily: 'monospace', width: 110 }} />
          </div>
        </FormField>
      </div>
      <FormField label="Responsibilities" helper="List key responsibilities or achievements.">
        <ArrayInput values={form.responsibilities || []} onChange={v => update('responsibilities', v)} />
      </FormField>
    </FormModal>
  );
}

export default function PanelExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('experience');
      const exp = Array.isArray(data) && data[0]?.experience ? data[0].experience : [];
      setItems(exp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (form) => {
    if (modal?.index !== undefined) {
      const updated = await authFetch(`experience/${modal.index}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setItems(prev => prev.map((p, i) => i === modal.index ? updated : p));
    } else {
      await authFetch('experience', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      await fetchData();
    }
    setModal(null);
  };

  const handleDelete = async (index) => {
    const item = items[index];
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setDeleting(index);
    try {
      await authFetch(`experience/${index}`, { method: 'DELETE' });
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
        title="Experience"
        items={items}
        loading={loading}
        error={error}
        onRefresh={fetchData}
        onAdd={() => setModal({ index: undefined })}
        renderItem={(item, i) => (
          <ItemCard key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                    background: ITEM_COLORS[i % ITEM_COLORS.length], flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#eee' }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: '#555' }}>({item.icon === 'SchoolIcon' ? 'Education' : 'Work'})</span>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{item.subtitle}</div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{item.date}</div>
                {item.responsibilities?.slice(0, 2).map((r, j) => (
                  <div key={j} style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>&bull; {displayValue(r)}</div>
                ))}
                {item.responsibilities?.length > 2 && (
                  <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>+{item.responsibilities.length - 2} more</div>
                )}
              </div>
              <ItemActions
                onEdit={() => setModal({ index: i, item })}
                onDelete={() => handleDelete(i)}
                isDeleting={deleting === i}
              />
            </div>
          </ItemCard>
        )}
      />
      {modal && (
        <ExperienceForm
          item={modal.item}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
