import React, { useState, useEffect, useMemo } from 'react';
import './ScenePlugins.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import LazyImage from '../components/LazyImage';
import ComingSoon from '../components/ComingSoon';
import { fetchPlugins } from '../data/api';

const COMING_SOON = true;

const STORE_COLORS = { unity: '#f59e0b', unreal: '#0db7f0' };
const STORE_LABELS = { unity: 'UNITY STORE', unreal: 'UNREAL MKTPL' };

function starsStr(rating) {
  const r = Math.round(rating || 0);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function getPreviewImage(plugin) {
  if (!plugin.images?.length) return null;
  const img = plugin.images[0];
  return img?.url || (typeof img === 'string' ? img : null);
}

const PluginSkeleton = ({ idx }) => (
  <div className="plugin-card-skeleton" style={{ '--card-delay': `${idx * 60}ms` }}>
    <div className="plugin-sk-preview" />
    <div className="plugin-sk-body">
      <div className="pb-shimmer" style={{ height: 14, width: '65%' }} />
      <div className="pb-shimmer" style={{ height: 10, width: '85%' }} />
      <div className="pb-shimmer" style={{ height: 10, width: '70%' }} />
    </div>
  </div>
);

const ScenePlugins = () => {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [ssIdx, setSsIdx] = useState(0);
  const [filter, setFilter] = useState('all');
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Plugins');
    emit('info', '> Loading asset store listings...');

    const load = async () => {
      try {
        const data = await fetchPlugins();
        setPlugins(data);
        emit('ok', `✓ ${data.length} plugin(s) loaded`);
      } catch (err) {
        emit('error', `✗ Plugins fetch failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
  }, [emit]);

  const stores = useMemo(() => {
    const found = [...new Set(plugins.map(p => p.storeType).filter(Boolean))];
    return found.length > 1 ? ['all', ...found] : [];
  }, [plugins]);

  const filtered = useMemo(() => {
    if (filter === 'all') return plugins;
    return plugins.filter(p => p.storeType === filter);
  }, [plugins, filter]);

  const handleSelect = (p) => { setSsIdx(0); setSelected(prev => prev?.id === p.id ? null : p); };
  const step = (e, dir) => {
    e.stopPropagation();
    const l = selected?.images?.length || 0;
    if (l > 1) setSsIdx(i => (i + dir + l) % l);
  };

  const color = (p) => STORE_COLORS[p?.storeType] || 'var(--pb-accent)';

  const getImgSrc = (img) => img?.url || (typeof img === 'string' ? img : null);

  return (
    <div className="scene-plugins">
      <GridBackground />
      <div className="scene-content">

        <h1 className="section-heading">Plugins</h1>

        {COMING_SOON ? (
          <ComingSoon
            label="plugins"
            hint="// add Unity / Unreal plugins via the dashboard"
          />
        ) : (<>

        {stores.length > 0 && (
          <div className="plugin-filter-bar">
            {stores.map(s => (
              <button
                key={s}
                className={`plugin-filter-btn${filter === s ? ' plugin-filter-btn--active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? 'ALL' : STORE_LABELS[s] || s.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="plugin-detail-overlay" onClick={() => setSelected(null)}>
            <div
              className="plugin-detail-card"
              style={{ '--plg-color': color(selected) }}
              onClick={e => e.stopPropagation()}
            >
              <div className="plugin-detail-header">
                <div className="plugin-detail-header-info">
                  <span className="plugin-detail-store">{STORE_LABELS[selected.storeType] || (selected.storeType || '').toUpperCase()}</span>
                  <span className="plugin-detail-name">{selected.name}</span>
                  {selected.price && (
                    <span style={{ fontFamily: 'var(--pb-mono)', fontSize: 13, fontWeight: 700, color: 'var(--pb-fg)', marginLeft: 'auto' }}>
                      {selected.price}
                    </span>
                  )}
                </div>
                <button className="plugin-detail-close" onClick={() => setSelected(null)} aria-label="Close">x</button>
              </div>

              <div className="plugin-detail-body">
                <div className="plugin-screenshots">
                  {selected.images?.length > 0 ? (
                    <>
                      <LazyImage src={getImgSrc(selected.images[ssIdx])} alt={`${selected.name} screenshot`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {selected.images.length > 1 && (
                        <>
                          <button className="plugin-ss-nav plugin-ss-prev" onClick={e => step(e, -1)}>&lsaquo;</button>
                          <button className="plugin-ss-nav plugin-ss-next" onClick={e => step(e, 1)}>&rsaquo;</button>
                          <div className="plugin-ss-dots">
                            {selected.images.map((_, i) => (
                              <span key={i} className={`plugin-ss-dot${i === ssIdx ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setSsIdx(i); }} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="plugin-screenshot-placeholder">
                      <span style={{ fontSize: 28, opacity: 0.3 }}>[{(selected.name || 'P').slice(0, 3).toUpperCase()}]</span>
                      <span>NO SCREENSHOTS</span>
                    </div>
                  )}
                </div>

                <div className="plugin-detail-content">
                  <div className="plugin-detail-meta">
                    {selected.rating > 0 && (
                      <div className="plugin-meta-item">
                        <span className="plugin-meta-label">Rating</span>
                        <span className="plugin-meta-stars">{starsStr(selected.rating)}</span>
                        <span className="plugin-meta-value" style={{ fontSize: 12, color: '#f59e0b' }}>{Number(selected.rating).toFixed(1)}</span>
                      </div>
                    )}
                    {selected.version && (
                      <div className="plugin-meta-item">
                        <span className="plugin-meta-label">Version</span>
                        <span className="plugin-meta-value">{selected.version}</span>
                      </div>
                    )}
                    {selected.price && (
                      <div className="plugin-meta-item">
                        <span className="plugin-meta-label">Price</span>
                        <span className="plugin-meta-value">{selected.price}</span>
                      </div>
                    )}
                  </div>

                  {selected.description && <p className="plugin-detail-desc">{selected.description}</p>}

                  {selected.technologies?.length > 0 && (
                    <div className="plugin-detail-techs">
                      {selected.technologies.map(t => (
                        <span key={t} className="plugin-detail-tech">{t}</span>
                      ))}
                    </div>
                  )}

                  {(selected.unityStoreUrl || selected.unrealStoreUrl) && (
                    <a
                      href={selected.unityStoreUrl || selected.unrealStoreUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="plugin-store-link"
                    >
                      {selected.storeType === 'unity' ? 'Unity Asset Store' : 'Unreal Marketplace'} &#8599;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="plugins-grid">
            {Array.from({ length: 4 }).map((_, i) => <PluginSkeleton key={i} idx={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="plugin-empty">
            NO PLUGINS FOUND
            <span className="plugin-empty-sub">Add plugins from the dashboard</span>
          </div>
        ) : (
          <div className="plugins-grid">
            {filtered.map((plugin, idx) => {
              const preview = getPreviewImage(plugin);
              return (
                <div
                  key={plugin.id}
                  className="plugin-card"
                  style={{ '--plg-color': color(plugin), '--card-delay': `${idx * 60}ms` }}
                  onClick={() => handleSelect(plugin)}
                >
                  <div className="plugin-card-preview">
                    {preview
                      ? <img src={preview} alt={plugin.name} className="plugin-preview-img" />
                      : (
                        <div className="plugin-preview-fallback">
                          <span className="plugin-preview-fallback-code">[{(plugin.name || 'PLG').slice(0, 4).toUpperCase()}]</span>
                          <span className="plugin-preview-fallback-label">.cs / .cpp</span>
                        </div>
                      )
                    }
                    <span className={`plugin-store-badge plugin-store-badge--${plugin.storeType}`}>
                      {STORE_LABELS[plugin.storeType] || (plugin.storeType || '').toUpperCase()}
                    </span>
                    {plugin.price && (
                      <span className="plugin-price-badge">{plugin.price}</span>
                    )}
                  </div>
                  <div className="plugin-card-body">
                    <div className="plugin-card-name">{plugin.name}</div>
                    {plugin.description && <p className="plugin-card-desc">{plugin.description}</p>}
                    <div className="plugin-card-footer">
                      {plugin.rating > 0 && (
                        <span className="plugin-rating">{starsStr(plugin.rating)}</span>
                      )}
                      {plugin.technologies?.slice(0, 2).map(t => (
                        <span key={t} className="plugin-tech-tag">{t}</span>
                      ))}
                      {plugin.version && <span className="plugin-version">v{plugin.version}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>)}
      </div>
    </div>
  );
};

export default ScenePlugins;
