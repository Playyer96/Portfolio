import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FormModal.css';

export function FormField({ label, helper, children, style }) {
  return (
    <div className="ff__container" style={style}>
      {label && <label className="ff__label">{label}</label>}
      {children}
      {helper && <div className="ff__helper">{helper}</div>}
    </div>
  );
}

export function Input({ className, ...props }) {
  return <input {...props} className={`ff__input${className ? ` ${className}` : ''}`} />;
}

export function Textarea({ className, ...props }) {
  return <textarea {...props} className={`ff__textarea${className ? ` ${className}` : ''}`} />;
}

export function Select({ options, className, ...props }) {
  return (
    <select {...props} className={`ff__select${className ? ` ${className}` : ''}`}>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="ff__checkbox-label">
      <input type="checkbox" {...props} className="ff__checkbox" />
      <span>{label}</span>
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
      <div className="ff__array-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder || 'Add item...'}
          className="ff__input"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={add} className="fm-btn-primary">Add</button>
      </div>
      <div className="ff__array-wrap">
        {values.map((v, i) => (
          <span key={i} className="ff__tag">
            {displayValue(v)}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="ff__tag-remove">&times;</button>
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
          className="fm-overlay"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={`fm-modal${wide ? ' fm-modal--wide' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="fm-header">
              <h2 className="fm-title">{title}</h2>
              <button type="button" onClick={onClose} className="fm-close">&times;</button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="fm-body">{children}</div>
              <div className="fm-footer">
                <button type="button" onClick={onClose} className="fm-btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="fm-btn-primary">
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
