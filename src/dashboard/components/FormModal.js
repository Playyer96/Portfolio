import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#151515', border: '1px solid #2a2a2a', borderRadius: 12,
    width: '90%', maxWidth: 640, maxHeight: '85vh', overflow: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid #222',
  },
  title: { fontSize: 15, fontWeight: 600, color: '#eee', margin: 0 },
  close: {
    background: 'none', border: 'none', color: '#555', cursor: 'pointer',
    fontSize: 20, lineHeight: 1, padding: '4px 8px', borderRadius: 4,
  },
  body: { padding: 20 },
  footer: {
    display: 'flex', justifyContent: 'flex-end', gap: 8,
    padding: '12px 20px', borderTop: '1px solid #222',
  },
};

const fieldStyles = {
  container: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#888', marginBottom: 4, fontWeight: 500 },
  input: {
    width: '100%', padding: '8px 10px', fontSize: 13,
    background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    color: '#eee', outline: 'none', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '8px 10px', fontSize: 13,
    background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    color: '#eee', outline: 'none', resize: 'vertical', minHeight: 80,
    fontFamily: 'inherit', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '8px 10px', fontSize: 13,
    background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    color: '#eee', outline: 'none', boxSizing: 'border-box',
  },
  checkbox: { width: 18, height: 18, cursor: 'pointer', accentColor: '#3b82f6' },
  helper: { fontSize: 11, color: '#555', marginTop: 4 },
  row: { display: 'flex', gap: 12 },
  flex1: { flex: 1 },
  btnPrimary: {
    padding: '8px 16px', fontSize: 13, fontWeight: 600,
    background: '#3b82f6', border: 'none', borderRadius: 6, color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  },
  btnSecondary: {
    padding: '8px 16px', fontSize: 13,
    background: '#222', border: '1px solid #333', borderRadius: 6, color: '#aaa',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '4px 10px', fontSize: 12,
    background: 'transparent', border: '1px solid #f44', borderRadius: 4, color: '#f44',
    cursor: 'pointer',
  },
  tag: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', background: '#1a1a1a', border: '1px solid #333',
    borderRadius: 4, fontSize: 12, color: '#aaa',
  },
  tagRemove: {
    background: 'none', border: 'none', color: '#666', cursor: 'pointer',
    fontSize: 14, padding: 0, lineHeight: 1,
  },
  arrayContainer: {
    display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 0',
  },
};

export function FormField({ label, helper, children, style }) {
  return (
    <div style={{ ...fieldStyles.container, ...style }}>
      {label && <label style={fieldStyles.label}>{label}</label>}
      {children}
      {helper && <div style={fieldStyles.helper}>{helper}</div>}
    </div>
  );
}

export function Input(props) {
  return <input {...props} style={{ ...fieldStyles.input, ...props.style }} />;
}

export function Textarea(props) {
  return <textarea {...props} style={{ ...fieldStyles.textarea, ...props.style }} />;
}

export function Select({ options, ...props }) {
  return (
    <select {...props} style={{ ...fieldStyles.select, ...props.style }}>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input type="checkbox" {...props} style={fieldStyles.checkbox} />
      <span style={{ fontSize: 13, color: '#ccc' }}>{label}</span>
    </label>
  );
}

export const displayValue = (v) => {
  if (v == null || typeof v === 'boolean') return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object') return v.name || v.title || v.label || JSON.stringify(v);
  return String(v);
};

export function ArrayInput({ values, onChange, placeholder }) {
  const [input, setInput] = React.useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
      setInput('');
    }
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder || 'Add item...'}
          style={{ ...fieldStyles.input, flex: 1 }}
        />
        <button type="button" onClick={add} style={fieldStyles.btnPrimary}>Add</button>
      </div>
      <div style={fieldStyles.arrayContainer}>
        {values.map((v, i) => (
          <span key={i} style={fieldStyles.tag}>
            {displayValue(v)}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} style={fieldStyles.tagRemove}>&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FormModal({ isOpen, onClose, title, onSubmit, submitLabel, loading, children, wide }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{ ...S.modal, maxWidth: wide ? 800 : 640 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={S.header}>
              <h2 style={S.title}>{title}</h2>
              <button type="button" onClick={onClose} style={S.close}>&times;</button>
            </div>
            <form onSubmit={onSubmit}>
              <div style={S.body}>{children}</div>
              <div style={S.footer}>
                <button type="button" onClick={onClose} style={fieldStyles.btnSecondary}>Cancel</button>
                <button type="submit" disabled={loading} style={{ ...fieldStyles.btnPrimary, opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Saving...' : submitLabel || 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
