import React from 'react';
import './CrudPanel.css';

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
        <div className="cp__header">
          <h1 className="cp__title">{title}</h1>
        </div>
        <div className="cp__loading">{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="cp__header">
          <h1 className="cp__title">{title}</h1>
        </div>
        <div className="cp__error">
          <p className="cp__error-text">{error}</p>
          <button type="button" onClick={onRefresh} className="cp__retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cp__header">
        <div className="cp__title-row">
          <h1 className="cp__title">{title}</h1>
          {items && <span className="cp__count">({items.length})</span>}
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd} className="cp__add-btn">
            + Add New
          </button>
        )}
      </div>
      {(!items || items.length === 0) ? (
        <div className="cp__empty">{emptyMessage}</div>
      ) : (
        <div className="cp__list">
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}

export function ItemCard({ children, className }) {
  return (
    <div className={`cp-card${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export function ItemActions({ onEdit, onDelete, isDeleting }) {
  return (
    <div className="cp-actions">
      {onEdit && (
        <button type="button" onClick={onEdit} className="cp-actions__edit">
          Edit
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} disabled={isDeleting} className="cp-actions__delete">
          {isDeleting ? '...' : 'Delete'}
        </button>
      )}
    </div>
  );
}
