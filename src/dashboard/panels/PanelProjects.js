import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Checkbox, ArrayInput, displayValue } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';
import './panels.css';

function ProjectForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { name: '', year: new Date().getFullYear(), role: '', descriptions: [], technologies: [], responsibilities: [], link: '', githubLink: '', liveLink: '', videoUrl: '', featured: false });
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
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit Project' : 'New Project'} onSubmit={handleSubmit} loading={saving} wide>
      <FormField label="Name">
        <Input value={form.name || ''} onChange={e => update('name', e.target.value)} required />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Year" style={{ flex: 1 }}>
          <Input type="number" value={form.year || ''} onChange={e => update('year', parseInt(e.target.value) || '')} />
        </FormField>
        <FormField label="Role" style={{ flex: 1 }}>
          <Input value={form.role || ''} onChange={e => update('role', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Descriptions" helper="Each paragraph is a separate entry.">
        <ArrayInput values={form.descriptions || []} onChange={v => update('descriptions', v)} />
      </FormField>
      <FormField label="Technologies">
        <ArrayInput values={form.technologies || []} onChange={v => update('technologies', v)} />
      </FormField>
      <FormField label="Responsibilities">
        <ArrayInput values={form.responsibilities || []} onChange={v => update('responsibilities', v)} />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Project Link" style={{ flex: 1 }}>
          <Input value={form.link || ''} onChange={e => update('link', e.target.value)} />
        </FormField>
        <FormField label="GitHub Link" style={{ flex: 1 }}>
          <Input value={form.githubLink || ''} onChange={e => update('githubLink', e.target.value)} />
        </FormField>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Live Demo Link" style={{ flex: 1 }}>
          <Input value={form.liveLink || ''} onChange={e => update('liveLink', e.target.value)} />
        </FormField>
        <FormField label="Video URL" style={{ flex: 1 }}>
          <Input value={form.videoUrl || ''} onChange={e => update('videoUrl', e.target.value)} />
        </FormField>
      </div>
      <FormField>
        <Checkbox label="Featured project" checked={!!form.featured} onChange={e => update('featured', e.target.checked)} />
      </FormField>
    </FormModal>
  );
}

export default function PanelProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('projects');
      const projects = Array.isArray(data) && data[0]?.projects ? data[0].projects : [];
      setItems(projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (form) => {
    if (modal?.item) {
      const updated = await authFetch(`projects/${modal.item.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setItems(prev => prev.map(p => p.id === modal.item.id ? updated : p));
    } else {
      const created = await authFetch('projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setItems(prev => [...prev, created]);
    }
    setModal(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete project "${item.name}"?`)) return;
    setDeleting(item.id);
    try {
      await authFetch(`projects/${item.id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p.id !== item.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <CrudPanel
        title="Projects"
        items={items}
        loading={loading}
        error={error}
        onRefresh={fetchData}
        onAdd={() => setModal({ item: null })}
        renderItem={(item) => (
          <ItemCard key={item.id}>
            <div className="pp-row">
              <div className="pp-info">
                <div className="pp-name-row">
                  <span className="pp-name">{item.name}</span>
                  {item.featured && <span className="pp-badge pp-badge--accent">FEATURED</span>}
                </div>
                <div className="pp-meta">{item.role} &middot; {item.year}</div>
                {item.descriptions?.[0] && <div className="pp-detail">{displayValue(item.descriptions[0])}</div>}
              </div>
              <ItemActions
                onEdit={() => setModal({ item })}
                onDelete={() => handleDelete(item)}
                isDeleting={deleting === item.id}
              />
            </div>
          </ItemCard>
        )}
      />
      {modal && (
        <ProjectForm
          item={modal.item}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
