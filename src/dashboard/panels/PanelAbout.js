import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Checkbox, ArrayInput, displayValue } from '../components/FormModal';

const styles = {
  card: {
    padding: 20, background: '#111', borderRadius: 8,
    border: '1px solid #222', marginBottom: 16,
  },
  label: { fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 14, color: '#ccc', margin: '0 0 16px' },
  sub: { fontSize: 12, color: '#888', marginBottom: 4 },
  btn: {
    padding: '8px 16px', fontSize: 13, fontWeight: 600,
    background: '#3b82f6', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer',
  },
};

function Field({ label, value }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value || '\u2014'}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h3>
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
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <textarea value={p} onChange={e => update(i, e.target.value)}
            style={{
              flex: 1, padding: '6px 10px', fontSize: 13, background: '#1a1a1a',
              border: '1px solid #333', borderRadius: 6, color: '#eee', resize: 'vertical',
              minHeight: 40, fontFamily: 'inherit',
            }}
          />
          <button type="button" onClick={() => remove(i)}
            style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: 18, padding: 4 }}>&times;</button>
        </div>
      ))}
      <button type="button" onClick={add}
        style={{ padding: '4px 12px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#aaa', cursor: 'pointer' }}
      >+ Bio Paragraph</button>
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
        <div key={i} style={{ padding: 12, marginBottom: 8, background: '#1a1a1a', borderRadius: 6, border: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input value={item.title} onChange={e => update(i, 'title', e.target.value)}
              placeholder="Title"
              style={{ flex: 1, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }}
            />
            <input value={item.iconKey} onChange={e => update(i, 'iconKey', e.target.value)}
              placeholder="Icon key"
              style={{ width: 120, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }}
            />
            <button type="button" onClick={() => remove(i)}
              style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: 16 }}>&times;</button>
          </div>
          <textarea value={item.desc} onChange={e => update(i, 'desc', e.target.value)}
            placeholder="Description"
            style={{ width: '100%', padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee', resize: 'vertical', minHeight: 40, fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
      ))}
      <button type="button" onClick={add}
        style={{ padding: '4px 12px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#aaa', cursor: 'pointer' }}
      >+ Value</button>
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
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Name"
            style={{ flex: 1, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
          <input value={item.handle} onChange={e => update(i, 'handle', e.target.value)} placeholder="Handle"
            style={{ flex: 1, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
          <input value={item.url} onChange={e => update(i, 'url', e.target.value)} placeholder="URL"
            style={{ flex: 1, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
          <button type="button" onClick={() => remove(i)}
            style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: 16 }}>&times;</button>
        </div>
      ))}
      <button type="button" onClick={add}
        style={{ padding: '4px 12px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#aaa', cursor: 'pointer' }}
      >+ Social</button>
    </div>
  );
}

function CVEditor({ value, onChange }) {
  const cv = value || {};
  const update = (f, v) => onChange({ ...cv, [f]: v });
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input value={cv.path || ''} onChange={e => update('path', e.target.value)} placeholder="Path"
        style={{ flex: 1, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
      <input value={cv.year || ''} onChange={e => update('year', e.target.value)} placeholder="Year"
        style={{ width: 80, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
      <input value={cv.pages || ''} onChange={e => update('pages', e.target.value)} placeholder="Pages"
        style={{ width: 80, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
      <input value={cv.size || ''} onChange={e => update('size', e.target.value)} placeholder="Size"
        style={{ width: 100, padding: '6px 8px', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 4, color: '#eee' }} />
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

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 13 }}>Loading...</div>;
  if (error) return (
    <div>
      <p style={{ color: '#f66', fontSize: 13 }}>{error}</p>
      <button onClick={fetchData} style={{ padding: '6px 14px', fontSize: 12, background: '#222', border: '1px solid #444', borderRadius: 4, color: '#aaa', cursor: 'pointer' }}>Retry</button>
    </div>
  );
  if (!doc) return <div style={{ padding: 40, textAlign: 'center', color: '#555', fontSize: 13 }}>No about data found. Run the seed script.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: '#eee' }}>About</h1>
        </div>
        <button type="button" onClick={() => { setForm({ ...doc }); setEditing(true); }} style={styles.btn}>Edit</button>
      </div>

      <div style={styles.card}>
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
            <p key={i} style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, margin: '0 0 8px' }}>{displayValue(p)}</p>
          ))}
        </Section>

        <Section title="Values">
          {(doc.values || []).map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, minWidth: 100 }}>{displayValue(v.iconKey)}</span>
              <span style={{ fontSize: 13, color: '#eee', fontWeight: 600, minWidth: 100 }}>{displayValue(v.title)}</span>
              <span style={{ fontSize: 12, color: '#888' }}>{displayValue(v.desc)}</span>
            </div>
          ))}
        </Section>

        <Section title="Socials">
          {(doc.socials || []).map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>
              <span style={{ color: '#888' }}>{displayValue(s.name)}:</span> {displayValue(s.handle)} <span style={{ color: '#555' }}>({displayValue(s.url)})</span>
            </div>
          ))}
        </Section>

        <Section title="CV">
          {doc.cv ? (
            <div style={{ fontSize: 12, color: '#aaa' }}>
              <span style={{ color: '#888' }}>Path:</span> {doc.cv.path} &middot; {doc.cv.year} &middot; {doc.cv.pages}p &middot; {doc.cv.size}
            </div>
          ) : <span style={{ color: '#555', fontSize: 12 }}>None</span>}
        </Section>

        <Section title="Marquee">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(doc.marqueeItems || []).map((m, i) => (
              <span key={i} style={{ padding: '2px 8px', background: '#1a1a1a', borderRadius: 4, fontSize: 12, color: '#aaa', border: '1px solid #2a2a2a' }}>{displayValue(m)}</span>
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
