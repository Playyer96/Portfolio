import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../data/api';
import FormModal, { FormField, Input, Textarea, Checkbox, displayValue } from '../components/FormModal';
import CrudPanel, { ItemCard, ItemActions } from '../components/CrudPanel';
import './panels.css';

const dateStr = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

function BlogForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { title: '', slug: '', content: '', excerpt: '', tags: [], published: false, publishDate: '' });
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append(k, Array.isArray(v) ? v.join(',') : v);
        else if (k === 'publishDate') fd.append(k, v || '');
        else fd.append(k, v);
      });
      if (file) fd.append('featuredImage', file);
      await onSave(fd, item?._id);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal isOpen onClose={onCancel} title={item ? 'Edit Post' : 'New Post'} onSubmit={handleSubmit} loading={saving} wide>
      <FormField label="Title">
        <Input value={form.title || ''} onChange={e => update('title', e.target.value)} required />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Slug" style={{ flex: 1 }} helper="URL-friendly identifier">
          <Input value={form.slug || ''} onChange={e => update('slug', e.target.value)} required />
        </FormField>
        <FormField label="Publish Date" style={{ flex: 1 }}>
          <Input type="date" value={form.publishDate ? form.publishDate.substring(0, 10) : ''} onChange={e => update('publishDate', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Excerpt" helper="Brief summary for cards and previews.">
        <Textarea value={form.excerpt || ''} onChange={e => update('excerpt', e.target.value)} />
      </FormField>
      <FormField label="Content (Markdown)" helper="Full post content. Supports Markdown.">
        <Textarea value={form.content || ''} onChange={e => update('content', e.target.value)} style={{ minHeight: 200 }} />
      </FormField>
      <FormField label="Tags" helper="Comma-separated tags">
        <Input
          value={Array.isArray(form.tags) ? form.tags.map(t => displayValue(t)).join(', ') : form.tags || ''}
          onChange={e => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        />
      </FormField>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormField>
          <Checkbox label="Published" checked={!!form.published} onChange={e => update('published', e.target.checked)} />
        </FormField>
        <FormField label="Featured Image" style={{ flex: 1 }}>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="ff__file-input" />
          {form.featuredImage && (
            <div className="ff__file-info">
              {typeof form.featuredImage === 'object' ? displayValue(form.featuredImage.url || form.featuredImage) : form.featuredImage}
            </div>
          )}
        </FormField>
      </div>
    </FormModal>
  );
}

export default function PanelBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await authFetch('blog');
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
      const updated = await authFetch(`blog/${id}`, { method: 'PUT', body: fd });
      setItems(prev => prev.map(p => p._id === id ? updated : p));
    } else {
      const created = await authFetch('blog', { method: 'POST', body: fd });
      setItems(prev => [created, ...prev]);
    }
    setModal(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete post "${item.title}"?`)) return;
    setDeleting(item._id);
    try {
      await authFetch(`blog/${item._id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p._id !== item._id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <CrudPanel
        title="Blog"
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
                  <span className="pp-name">{item.title}</span>
                  {item.published
                    ? <span className="pp-badge pp-badge--success">PUBLISHED</span>
                    : <span className="pp-badge pp-badge--warning">DRAFT</span>
                  }
                </div>
                <div className="pp-sub">/blog/{item.slug}</div>
                {item.excerpt && <div className="pp-detail">{item.excerpt}</div>}
                <div className="pp-sub">
                  {dateStr(item.publishDate || item.createdAt)}
                  {item.tags?.length > 0 && ` · ${item.tags.map(t => displayValue(t)).join(', ')}`}
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
        <BlogForm
          item={modal._id ? modal : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
