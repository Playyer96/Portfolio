import React, { useState, useEffect, useMemo } from 'react';
import './SceneApps.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import LazyImage from '../components/LazyImage';
import ComingSoon from '../components/ComingSoon';
import { fetchApps } from '../data/api';

const COMING_SOON = true;

const PLATFORM_COLORS = {
  android: '#10b981',
  ios:     '#06b6d4',
  desktop: '#8b5cf6',
};

const PLATFORM_LABELS = {
  android: 'ANDROID',
  ios:     'iOS',
  desktop: 'DESKTOP',
};

function starsStr(rating) {
  const r = Math.round(rating || 0);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function formatInstalls(app) {
  if (app.installs) return app.installs;
  if (app.downloads > 0) {
    if (app.downloads >= 1000000) return `${(app.downloads / 1000000).toFixed(1)}M+`;
    if (app.downloads >= 1000)    return `${Math.floor(app.downloads / 1000)}K+`;
    return `${app.downloads}+`;
  }
  return null;
}

const AppSkeleton = ({ idx }) => (
  <div className="app-card-skeleton" style={{ '--card-delay': `${idx * 60}ms` }}>
    <div className="app-sk-icon" />
    <div className="app-sk-body">
      <div className="pb-shimmer" style={{ height: 14, width: '60%' }} />
      <div className="pb-shimmer" style={{ height: 10, width: '85%' }} />
      <div className="pb-shimmer" style={{ height: 10, width: '70%' }} />
    </div>
  </div>
);

const SceneApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [ssIdx, setSsIdx] = useState(0);
  const [filter, setFilter] = useState('all');
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Apps');
    emit('info', '> Fetching app listings...');

    const load = async () => {
      try {
        const data = await fetchApps();
        setApps(data);
        emit('ok', `✓ ${data.length} app(s) loaded`);
      } catch (err) {
        emit('error', `✗ Apps fetch failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
  }, [emit]);

  const filtered = useMemo(() => {
    if (filter === 'all') return apps;
    return apps.filter(a => a.platform === filter);
  }, [apps, filter]);

  const platforms = useMemo(() => ['all', ...new Set(apps.map(a => a.platform).filter(Boolean))], [apps]);

  const handleSelect = (app) => { setSsIdx(0); setSelected(prev => prev?.id === app.id ? null : app); };
  const step = (e, dir) => { e.stopPropagation(); const l = selected?.images?.length || 0; if (l > 1) setSsIdx(i => (i + dir + l) % l); };

  const color = (app) => PLATFORM_COLORS[app?.platform] || '#8b5cf6';

  return (
    <div className="scene-apps">
      <GridBackground />
      <div className="scene-content">

        <h1 className="section-heading">Apps</h1>

        {COMING_SOON ? (
          <ComingSoon
            label="apps"
            hint="// add apps in dashboard → sync from Play Store / App Store"
          />
        ) : (<>

        {platforms.length > 1 && (
          <div className="app-filter-bar">
            {platforms.map(p => (
              <button
                key={p}
                className={`app-filter-btn${filter === p ? ' app-filter-btn--active' : ''}`}
                onClick={() => setFilter(p)}
              >
                {p === 'all' ? 'ALL' : PLATFORM_LABELS[p] || p.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="app-detail-overlay" onClick={() => setSelected(null)}>
            <div
              className="app-detail-card"
              style={{ '--app-color': color(selected) }}
              onClick={e => e.stopPropagation()}
            >
              <div className="app-detail-header">
                <div className="app-detail-header-info">
                  {selected.icon
                    ? <img src={selected.icon} alt={selected.name} className="app-detail-icon" />
                    : <div className="app-detail-icon-fallback">{(selected.name || 'A').slice(0, 2).toUpperCase()}</div>
                  }
                  <span className="app-detail-title">{selected.name}</span>
                  <span className="app-detail-platform">{PLATFORM_LABELS[selected.platform] || (selected.platform || '').toUpperCase()}</span>
                </div>
                <button className="app-detail-close" onClick={() => setSelected(null)} aria-label="Close">x</button>
              </div>

              <div className="app-detail-body">
                <div className="app-screenshots">
                  {selected.images?.length > 0 ? (
                    <>
                      <LazyImage src={selected.images[ssIdx]?.url || selected.images[ssIdx]} alt={`${selected.name} screenshot`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      {selected.images.length > 1 && (
                        <>
                          <button className="app-ss-nav-btn app-ss-prev" onClick={e => step(e, -1)}>&lsaquo;</button>
                          <button className="app-ss-nav-btn app-ss-next" onClick={e => step(e, 1)}>&rsaquo;</button>
                          <div className="app-ss-dots">
                            {selected.images.map((_, i) => (
                              <span key={i} className={`app-ss-dot${i === ssIdx ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setSsIdx(i); }} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="app-screenshot-placeholder">
                      <span style={{ fontSize: 32, opacity: 0.4 }}>[{(selected.name || 'A').slice(0, 2).toUpperCase()}]</span>
                      <span>NO SCREENSHOTS</span>
                      <span style={{ opacity: 0.5, fontSize: 8 }}>Sync from store in dashboard</span>
                    </div>
                  )}
                </div>

                <div className="app-detail-content">
                  <div className="app-detail-stats">
                    {selected.rating > 0 && (
                      <div className="app-stat-item">
                        <span className="app-stat-label">Rating</span>
                        <span className="app-stat-stars">{starsStr(selected.rating)}</span>
                        <span className="app-stat-value" style={{ fontSize: 12, color: '#f59e0b' }}>{selected.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {selected.ratingCount > 0 && (
                      <div className="app-stat-item">
                        <span className="app-stat-label">Reviews</span>
                        <span className="app-stat-value">{selected.ratingCount.toLocaleString()}</span>
                      </div>
                    )}
                    {formatInstalls(selected) && (
                      <div className="app-stat-item">
                        <span className="app-stat-label">Installs</span>
                        <span className="app-stat-value">{formatInstalls(selected)}</span>
                      </div>
                    )}
                    {selected.version && (
                      <div className="app-stat-item">
                        <span className="app-stat-label">Version</span>
                        <span className="app-stat-value" style={{ fontSize: 13 }}>{selected.version}</span>
                      </div>
                    )}
                  </div>

                  {selected.description && <p className="app-detail-desc">{selected.description}</p>}

                  <div className="app-detail-links">
                    {selected.googlePlayUrl && (
                      <a href={selected.googlePlayUrl} target="_blank" rel="noreferrer" className="app-store-link">
                        Google Play &#8599;
                      </a>
                    )}
                    {selected.appStoreUrl && (
                      <a href={selected.appStoreUrl} target="_blank" rel="noreferrer" className="app-store-link">
                        App Store &#8599;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="apps-grid">
            {Array.from({ length: 4 }).map((_, i) => <AppSkeleton key={i} idx={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="app-empty">
            NO APPS FOUND
            <span className="app-empty-sub">Add apps from the dashboard &mdash; then Sync from store to auto-fill ratings &amp; screenshots</span>
          </div>
        ) : (
          <div className="apps-grid">
            {filtered.map((app, idx) => (
              <div
                key={app.id}
                className="app-card"
                style={{ '--app-color': color(app), '--card-delay': `${idx * 60}ms` }}
                onClick={() => handleSelect(app)}
              >
                <div className="app-card-icon-area">
                  {app.icon
                    ? <img src={app.icon} alt={app.name} className="app-icon-img" />
                    : <div className="app-icon-fallback">{(app.name || 'A').slice(0, 2).toUpperCase()}</div>
                  }
                  <span className="app-platform-badge">{PLATFORM_LABELS[app.platform] || (app.platform || '').toUpperCase()}</span>
                </div>
                <div className="app-card-body">
                  <div className="app-card-name">{app.name}</div>
                  {app.description && <p className="app-card-desc">{app.description}</p>}
                  <div className="app-card-stats">
                    {app.rating > 0 && (
                      <>
                        <span className="app-rating">{starsStr(app.rating)}</span>
                        <span className="app-rating-num">{app.rating.toFixed(1)}</span>
                      </>
                    )}
                    {formatInstalls(app) && (
                      <span className="app-installs">{formatInstalls(app)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>)}
      </div>
    </div>
  );
};

export default SceneApps;
