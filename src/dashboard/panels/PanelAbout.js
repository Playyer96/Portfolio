import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Checkbox, ArrayInput, displayValue } from '../components/FormModal';
import './panels.css';

function Field({ label, value }) {
  return (
    <div>
      <div className="pa-label">{label}</div>
      <div className="pa-value">{value || '—'}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="pa-section">
      <h3 className="pa-section__title">{title}</h3>
      {children}
    </div>
  );
}

function BioEditor({ value, onChange }) {
  const [items, setItems] = React.useState(value || []);
  React.useEffect(() => { setItems(value || []); }, [value]);
  const update = (i, v) => {
    const next = [...items]; next[i] = v; setItems(next); onChange(next);
  };
  const remove = (i) => { const next = items.filter((_, j) => j !== i); setItems(next); onChange(next); };
  const add = () => { const next = [...items, '']; setItems(next); onChange(next); };
  return (
    <div>
      {items.map((p, i) => (
        <div key={i} className="pe-row">
          <textarea value={p} onChange={e => update(i, e.target.value)} className="pe-textarea" />
          <button type="button" onClick={() => remove(i)} className="pe-remove">&times;</button>
        </div>
      ))}
      <button type="button" onClick={add} className="pe-add-btn">+ Bio Paragraph</button>
    </div>
  );
}

function ValuesEditor({ value, onChange }) {
  const [items, setItems] = React.useState(value || []);
  React.useEffect(() => { setItems(value || []); }, [value]);
  const update = (i, field, v) => {
    const next = items.map((item, j) => j === i ? { ...item, [field]: v } : item);
    setItems(next); onChange(next);
  };
  const remove = (i) => { const next = items.filter((_, j) => j !== i); setItems(next); onChange(next); };
  const add = () => { const next = [...items, { title: '', iconKey: 'FiZap', desc: '' }]; setItems(next); onChange(next); };
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="pe-nested">
          <div className="pe-row">
            <input value={item.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Title" className="pe-input" />
            <input value={item.iconKey} onChange={e => update(i, 'iconKey', e.target.value)} placeholder="Icon key" className="pe-input" style={{ flex: '0 0 120px' }} />
            <button type="button" onClick={() => remove(i)} className="pe-remove">&times;</button>
          </div>
          <textarea value={item.desc} onChange={e => update(i, 'desc', e.target.value)} placeholder="Description" className="pe-textarea" />
        </div>
      ))}
      <button type="button" onClick={add} className="pe-add-btn">+ Value</button>
    </div>
  );
}

function SocialsEditor({ value, onChange }) {
  const [items, setItems] = React.useState(value || []);
  React.useEffect(() => { setItems(value || []); }, [value]);
  const update = (i, field, v) => {
    const next = items.map((item, j) => j === i ? { ...item, [field]: v } : item);
    setItems(next); onChange(next);
  };
  const remove = (i) => { const next = items.filter((_, j) => j !== i); setItems(next); onChange(next); };
  const add = () => { const next = [...items, { name: '', handle: '', url: '' }]; setItems(next); onChange(next); };
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="pe-row">
          <input value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Name" className="pe-input" />
          <input value={item.handle} onChange={e => update(i, 'handle', e.target.value)} placeholder="Handle" className="pe-input" />
          <input value={item.url} onChange={e => update(i, 'url', e.target.value)} placeholder="URL" className="pe-input" />
          <button type="button" onClick={() => remove(i)} className="pe-remove">&times;</button>
        </div>
      ))}
      <button type="button" onClick={add} className="pe-add-btn">+ Social</button>
    </div>
  );
}

function CVEditor({ value, onChange }) {
  const cv = value || {};
  const update = (f, v) => onChange({ ...cv, [f]: v });
  return (
    <div className="pe-row">
      <input value={cv.path || ''} onChange={e => update('path', e.target.value)} placeholder="Path" className="pe-input" />
      <input value={cv.year || ''} onChange={e => update('year', e.target.value)} placeholder="Year" className="pe-input" style={{ flex: '0 0 80px' }} />
      <input value={cv.pages || ''} onChange={e => update('pages', e.target.value)} placeholder="Pages" className="pe-input" style={{ flex: '0 0 80px' }} />
      <input value={cv.size || ''} onChange={e => update('size', e.target.value)} placeholder="Size" className="pe-input" style={{ flex: '0 0 100px' }} />
    </div>
  );
}

export default function PanelAbout() {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('about');
      const d = Array.isArray(data) ? data[0] : data;
      setDoc(d);
      setForm(d || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const updated = await authFetch(`about/${doc._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setDoc(updated); setEditing(false);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  if (loading) return <div className="cp__loading">Loading...</div>;
  if (error) return (
    <div className="cp__error">
      <p className="cp__error-text">{error}</p>
      <button onClick={fetchData} className="cp__retry-btn">Retry</button>
    </div>
  );
  if (!doc) return <div className="cp__loading">No about data found. Run the seed script.</div>;

  return (
    <div>
      <div className="cp__header">
        <div className="cp__title-row">
          <h1 className="cp__title">About</h1>
        </div>
        <button type="button" onClick={() => { setForm({ ...doc }); setEditing(true); }} className="cp__add-btn">
          Edit
        </button>
      </div>

      <div className="pa-card">
        <Section title="Hero">
          <Field label="Hero Text" value={doc.heroText} />
          <Field label="Name" value={doc.name} />
          <Field label="Title" value={doc.title} />
          <Field label="Subtitle" value={doc.subtitle} />
          <Field label="Role" value={doc.role} />
        </Section>

        <Section title="Location & Contact">
          <Field label="Location" value={doc.location} />
          <Field label="Email" value={doc.email} />
          <Field label="Availability" value={doc.availability} />
        </Section>

        <Section title="Bio">
          {(doc.bio || []).map((p, i) => (
            <p key={i} className="pa-bio-para">{displayValue(p)}</p>
          ))}
        </Section>

        <Section title="Values">
          {(doc.values || []).map((v, i) => (
            <div key={i} className="pa-values-item">
              <span className="pa-values__icon">{displayValue(v.iconKey)}</span>
              <span className="pa-values__title">{displayValue(v.title)}</span>
              <span className="pa-values__desc">{displayValue(v.desc)}</span>
            </div>
          ))}
        </Section>

        <Section title="Socials">
          {(doc.socials || []).map((s, i) => (
            <div key={i} className="pa-social-item">
              <span className="pa-social__name">{displayValue(s.name)}:</span>{' '}
              {displayValue(s.handle)}{' '}
              <span className="pa-social__url">({displayValue(s.url)})</span>
            </div>
          ))}
        </Section>

        <Section title="CV">
          {doc.cv ? (
            <div className="pa-cv-info">
              <span>{doc.cv.path}</span> &middot; {doc.cv.year} &middot; {doc.cv.pages}p &middot; {doc.cv.size}
            </div>
          ) : <span className="pp-sub">None</span>}
        </Section>

        <Section title="Marquee">
          <div className="pa-marquee-list">
            {(doc.marqueeItems || []).map((m, i) => (
              <span key={i} className="pa-marquee-item">{displayValue(m)}</span>
            ))}
          </div>
        </Section>
      </div>

      <FormModal isOpen={editing} onClose={() => setEditing(false)} title="Edit About" onSubmit={handleSave} loading={saving} wide>
        <FormField label="Hero Text">
          <Input value={form.heroText || ''} onChange={e => update('heroText', e.target.value)} />
        </FormField>
        <div style={{ display: 'flex', gap: 12 }}>
          <FormField label="Name" style={{ flex: 1 }}>
            <Input value={form.name || ''} onChange={e => update('name', e.target.value)} />
          </FormField>
          <FormField label="Title" style={{ flex: 1 }}>
            <Input value={form.title || ''} onChange={e => update('title', e.target.value)} />
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <FormField label="Subtitle" style={{ flex: 1 }}>
            <Input value={form.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
          </FormField>
          <FormField label="Role" style={{ flex: 1 }}>
            <Input value={form.role || ''} onChange={e => update('role', e.target.value)} />
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <FormField label="Location" style={{ flex: 1 }}>
            <Input value={form.location || ''} onChange={e => update('location', e.target.value)} />
          </FormField>
          <FormField label="Email" style={{ flex: 1 }}>
            <Input type="email" value={form.email || ''} onChange={e => update('email', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Bio" helper="Each paragraph is a separate entry.">
          <BioEditor value={form.bio} onChange={v => update('bio', v)} />
        </FormField>
        <FormField label="Values" helper="iconKey examples: FiZap, FiTool, FiRefreshCw, FiBarChart2">
          <ValuesEditor value={form.values} onChange={v => update('values', v)} />
        </FormField>
        <FormField label="Social Links">
          <SocialsEditor value={form.socials} onChange={v => update('socials', v)} />
        </FormField>
        <FormField label="CV">
          <CVEditor value={form.cv} onChange={v => update('cv', v)} />
        </FormField>
        <FormField label="Marquee Items" helper="Technologies shown in the marquee banner.">
          <ArrayInput values={form.marqueeItems || []} onChange={v => update('marqueeItems', v)} />
        </FormField>
        <FormField label="Availability">
          <Input value={form.availability || ''} onChange={e => update('availability', e.target.value)} />
        </FormField>
      </FormModal>
    </div>
  );
}
