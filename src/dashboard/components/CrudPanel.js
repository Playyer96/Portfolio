import React, { useState } from 'react';

const S = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 600, margin: 0, color: '#eee' },
  addBtn: {
    padding: '8px 16px', fontSize: 13, fontWeight: 600,
    background: '#3b82f6', border: 'none', borderRadius: 6, color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  },
  loadingBox: {
    padding: 40, textAlign: 'center', color: '#666', fontSize: 13,
  },
  errorBox: {
    padding: 20, background: '#1a0a0a', border: '1px solid #3a1a1a',
    borderRadius: 8, textAlign: 'center',
  },
  errorText: { color: '#f66', fontSize: 13, margin: '0 0 12px' },
  retryBtn: {
    padding: '6px 14px', fontSize: 12, background: '#222',
    border: '1px solid #444', borderRadius: 4, color: '#aaa', cursor: 'pointer',
  },
  emptyBox: {
    padding: 40, background: '#111', borderRadius: 8, border: '1px solid #222',
    textAlign: 'center', color: '#555', fontSize: 13,
  },
};

export default function CrudPanel({
  title,
  items,
  loading,
  error,
  onRefresh,
  renderItem,
  onAdd,
  emptyMessage = 'No items yet.',
  loadingMessage = 'Loading...',
}) {
  if (loading) {
    return (
      <div>
        <div style={S.header}>
          <h1 style={S.title}>{title}</h1>
        </div>
        <div style={S.loadingBox}>{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={S.header}>
          <h1 style={S.title}>{title}</h1>
        </div>
        <div style={S.errorBox}>
          <p style={S.errorText}>{error}</p>
          <button type="button" onClick={onRefresh} style={S.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={S.title}>{title}</h1>
          {items && <span style={{ fontSize: 12, color: '#555' }}>({items.length})</span>}
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd} style={S.addBtn}>
            + Add New
          </button>
        )}
      </div>
      {(!items || items.length === 0) ? (
        <div style={S.emptyBox}>{emptyMessage}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}

export function ItemCard({ children, style }) {
  return (
    <div style={{
      padding: 16, background: '#111', borderRadius: 8,
      border: '1px solid #222', ...style
    }}>
      {children}
    </div>
  );
}

export function ItemActions({ onEdit, onDelete, isDeleting }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {onEdit && (
        <button type="button" onClick={onEdit}
          style={{
            padding: '4px 10px', fontSize: 12, background: '#1a1a2a',
            border: '1px solid #333', borderRadius: 4, color: '#3b82f6', cursor: 'pointer',
          }}
        >Edit</button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} disabled={isDeleting}
          style={{
            padding: '4px 10px', fontSize: 12, background: '#1a0a0a',
            border: '1px solid #3a1a1a', borderRadius: 4, color: '#f44',
            cursor: 'pointer', opacity: isDeleting ? 0.5 : 1,
          }}
        >{isDeleting ? '...' : 'Delete'}</button>
      )}
    </div>
  );
}
