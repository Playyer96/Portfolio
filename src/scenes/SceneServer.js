import React, { useState, useEffect, useMemo } from 'react';
import {
  FiGitBranch, FiPlay, FiRadio, FiAnchor, FiServer,
  FiHardDrive, FiMonitor, FiWifi, FiShield, FiBox,
} from 'react-icons/fi';
import './SceneServer.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import LazyImage from '../components/LazyImage';
import { fetchHomelab } from '../data/api';

const ICON_MAP = {
  git:      FiGitBranch,
  media:    FiPlay,
  arr:      FiRadio,
  docker:   FiAnchor,
  server:   FiServer,
  storage:  FiHardDrive,
  monitor:  FiMonitor,
  network:  FiWifi,
  security: FiShield,
  proxy:    FiBox,
};

function ServiceIcon({ icon, size = 20 }) {
  const Icon = ICON_MAP[icon] || FiServer;
  return <Icon size={size} strokeWidth={1.5} />;
}

// Derive a short ASCII label from icon key for the card top bar
const ICON_LABEL = {
  git: 'GIT', media: 'MED', arr: 'ARR', docker: 'DKR', server: 'SRV',
  storage: 'STR', monitor: 'MON', network: 'NET', security: 'SEC', proxy: 'PRX',
};

const StatusDot = ({ status, live }) => {
  const resolved = live || status || 'online';
  return <span className={`srv-status-dot srv-status-dot--${resolved}`} />;
};

const CardSkeleton = ({ idx }) => (
  <div className="srv-card-skeleton" style={{ '--card-delay': `${idx * 60}ms` }}>
    <div className="srv-sk-top" />
    <div className="srv-sk-body">
      <div className="srv-sk-bar pb-shimmer" style={{ width: '40%', height: 22 }} />
      <div className="srv-sk-bar pb-shimmer" style={{ width: '60%', height: 14 }} />
      <div className="srv-sk-bar pb-shimmer" style={{ width: '90%', height: 10 }} />
      <div className="srv-sk-bar pb-shimmer" style={{ width: '75%', height: 10 }} />
    </div>
  </div>
);

const SceneServer = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [liveStatus, setLiveStatus] = useState({});
  const [pinging, setPinging] = useState(false);
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Server');
    emit('info', '> Polling homelab network...');

    const load = async () => {
      try {
        const data = await fetchHomelab();
        setServices(data);
        const online = data.filter(s => s.status === 'online').length;
        emit('ok', `✓ ${data.length} service(s) indexed — ${online} configured online`);

        // Kick off live ping check
        if (data.length > 0) {
          setPinging(true);
          emit('info', '> Network        Pinging public endpoints...');
          try {
            const base = process.env.REACT_APP_API_URL || '/api';
            const res = await fetch(`${base}/homelab/ping`);
            if (res.ok) {
              const result = await res.json();
              setLiveStatus(result);
              const liveOnline = Object.values(result).filter(v => v === 'online').length;
              emit('ok', `✓ Network        ${liveOnline}/${data.length} services responding`);
            }
          } catch {
            emit('warn', '! Network        Ping check unavailable');
          } finally {
            setPinging(false);
          }
        }
      } catch (err) {
        emit('error', `✗ Host unreachable: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [emit]);

  const stats = useMemo(() => ({
    total:  services.length,
    online: services.filter(s => s.status === 'online').length,
    local:  services.filter(s => s.status === 'local').length,
    liveConfirmed: Object.values(liveStatus).filter(v => v === 'online').length,
  }), [services, liveStatus]);

  const handleSelect = (svc) => {
    setCarouselIdx(0);
    setSelected(prev => prev?.id === svc.id ? null : svc);
  };

  const step = (e, dir) => {
    e.stopPropagation();
    const len = selected?.images?.length || 0;
    if (len > 1) setCarouselIdx(i => (i + dir + len) % len);
  };

  const getLiveBadge = (svc) => {
    const live = liveStatus[svc.id];
    if (svc.status === 'local' || !svc.isPublic) return null;
    if (pinging) return <span className="srv-live-badge srv-live-badge--pinging">PINGING</span>;
    if (live === 'online')      return <span className="srv-live-badge srv-live-badge--live">LIVE</span>;
    if (live === 'unreachable') return <span className="srv-live-badge srv-live-badge--down">DOWN</span>;
    if (live === 'degraded')    return <span className="srv-live-badge srv-live-badge--degraded">DEGRADED</span>;
    return null;
  };

  return (
    <div className="scene-server">
      <GridBackground />
      <div className="scene-content">

        <div className="srv-heading-row">
          <h1 className="section-heading">Server</h1>
          <div className="srv-host-badge">
            <span className="srv-host-led" />
            <span>atlas.local &middot; 24/7</span>
          </div>
        </div>

        {/* ── Homelab project overview ─────────────────────────────── */}
        <div className="srv-project-card">
          <div className="srv-project-header">
            <span className="srv-project-label">PROJECT / homelab-v1.prefab</span>
            <div className="srv-project-tags">
              {['Docker', 'Linux', 'Self-hosted', 'Caddy', 'Tailscale', 'Proxmox'].map(t => (
                <span key={t} className="srv-project-tag">{t}</span>
              ))}
            </div>
          </div>
          <div className="srv-project-body">
            <div className="srv-project-image-area">
              <div className="srv-project-image-placeholder">
                <span className="srv-project-image-text">[ server rack ]</span>
                <span className="srv-project-image-sub">Add screenshot via dashboard</span>
              </div>
            </div>
            <div className="srv-project-content">
              <h2 className="srv-project-title">Home Server &amp; Self-Hosted Infrastructure</h2>
              <p className="srv-project-desc">
                A production-grade homelab running 24/7 on dedicated hardware. Hosts personal
                development tools, media stack, and automation services — all containerized with
                Docker, secured behind Caddy reverse proxy, and reachable globally via Tailscale
                VPN without exposing any ports.
              </p>
              <div className="srv-project-highlights">
                <div className="srv-highlight">
                  <span className="srv-highlight-marker">&#62;</span>
                  Configured automated HTTPS with Let&apos;s Encrypt via Caddy for all public subdomains
                </div>
                <div className="srv-highlight">
                  <span className="srv-highlight-marker">&#62;</span>
                  Zero-trust network access through Tailscale — internal services reachable from anywhere
                </div>
                <div className="srv-highlight">
                  <span className="srv-highlight-marker">&#62;</span>
                  Fully containerized stack: each service isolated, resource-limited, auto-restarting
                </div>
                <div className="srv-highlight">
                  <span className="srv-highlight-marker">&#62;</span>
                  Automated media pipeline from indexers to Jellyfin with zero manual intervention
                </div>
                <div className="srv-highlight">
                  <span className="srv-highlight-marker">&#62;</span>
                  Self-hosted Git with CI/CD runners — GitHub Actions syntax, running locally
                </div>
              </div>
            </div>
          </div>
        </div>

        {!loading && services.length > 0 && (
          <div className="srv-stats-bar">
            <div className="srv-stat-item">
              <span className="srv-stat-label">Services</span>
              <span className="srv-stat-value srv-stat-value--dim">{stats.total}</span>
            </div>
            <div className="srv-stat-item">
              <span className="srv-stat-label">Configured</span>
              <span className="srv-stat-value">{stats.online}</span>
            </div>
            <div className="srv-stat-item">
              <span className="srv-stat-label">Live now</span>
              <span className="srv-stat-value">
                {pinging ? <span className="srv-pinging-dot">...</span> : stats.liveConfirmed}
              </span>
            </div>
            <div className="srv-stat-item">
              <span className="srv-stat-label">Local only</span>
              <span className="srv-stat-value srv-stat-value--amber">{stats.local}</span>
            </div>
          </div>
        )}

        {selected && (
          <div className="srv-detail-overlay" onClick={() => setSelected(null)}>
            <div
              className="srv-detail-card"
              style={{ '--srv-color': selected.color || 'var(--pb-accent)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="srv-detail-grid" />

              <div className="srv-detail-header">
                <div className="srv-detail-header-left">
                  <span className="srv-detail-icon">
                    <ServiceIcon icon={selected.icon} size={16} />
                  </span>
                  <span className="srv-detail-path">
                    {selected.isPublic && selected.url
                      ? selected.url.replace(/^https?:\/\//, '')
                      : `${selected.subdomain || selected.slug}.local`}
                  </span>
                  <span className={`srv-detail-badge srv-detail-badge--${selected.status || 'online'}`}>
                    {selected.status === 'local' ? 'LOCAL ONLY' : (selected.status || 'online').toUpperCase()}
                  </span>
                  {(() => {
                    const live = liveStatus[selected.id];
                    if (selected.status === 'local' || !selected.isPublic) return null;
                    if (live === 'online')      return <span className="srv-detail-badge srv-detail-badge--live">LIVE</span>;
                    if (live === 'unreachable') return <span className="srv-detail-badge srv-detail-badge--down">DOWN</span>;
                    return null;
                  })()}
                </div>
                <button className="srv-detail-close" onClick={() => setSelected(null)} aria-label="Close">
                  x
                </button>
              </div>

              <div className="srv-detail-body">
                <div className="srv-carousel">
                  {selected.images?.length > 0 ? (
                    <>
                      <LazyImage
                        src={selected.images[carouselIdx]}
                        alt={`${selected.name} screenshot ${carouselIdx + 1}`}
                        style={{ width: '100%', height: '100%' }}
                      />
                      {selected.images.length > 1 && (
                        <>
                          <button className="srv-carousel-btn srv-carousel-prev" onClick={e => step(e, -1)}>&lsaquo;</button>
                          <button className="srv-carousel-btn srv-carousel-next" onClick={e => step(e, 1)}>&rsaquo;</button>
                          <div className="srv-carousel-dots">
                            {selected.images.map((_, i) => (
                              <span
                                key={i}
                                className={`srv-carousel-dot${i === carouselIdx ? ' active' : ''}`}
                                onClick={e => { e.stopPropagation(); setCarouselIdx(i); }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="srv-carousel-placeholder">
                      <span className="srv-carousel-placeholder-icon">
                        <ServiceIcon icon={selected.icon} size={48} />
                      </span>
                      <span className="srv-carousel-placeholder-text">NO SCREENSHOTS YET</span>
                    </div>
                  )}
                </div>

                <div className="srv-detail-content">
                  <div className="srv-detail-name">{selected.name}</div>
                  <p className="srv-detail-desc">{selected.description}</p>

                  {selected.tags?.length > 0 && (
                    <div className="srv-detail-tags">
                      {selected.tags.map(t => (
                        <span key={t} className="srv-detail-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  {selected.learned?.length > 0 && (
                    <div className="srv-detail-learned">
                      <div className="srv-detail-learned-label">{'// what i learned'}</div>
                      <ul className="srv-detail-learned-list">
                        {selected.learned.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(selected.uptime || selected.since || selected.category) && (
                    <div className="srv-detail-meta">
                      {selected.uptime && (
                        <div className="srv-meta-item">
                          <span>uptime</span>
                          <span>{selected.uptime}</span>
                        </div>
                      )}
                      {selected.since && (
                        <div className="srv-meta-item">
                          <span>since</span>
                          <span>{selected.since}</span>
                        </div>
                      )}
                      {selected.category && (
                        <div className="srv-meta-item">
                          <span>category</span>
                          <span>{selected.category}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selected.isPublic && selected.url && (
                    <a href={selected.url} target="_blank" rel="noreferrer" className="srv-detail-link">
                      Visit &#8599;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="srv-grid">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} idx={i} />)}
          </div>
        ) : services.length === 0 ? (
          <div className="srv-empty">
            <span>NO SERVICES INDEXED</span>
            <span className="srv-empty-sub">Run seed-homelab.js then add entries from the dashboard</span>
          </div>
        ) : (
          <div className="srv-grid">
            {services.map((svc, idx) => (
              <div
                key={svc.id}
                data-svc={svc.name}
                className={`srv-card${selected?.id === svc.id ? ' srv-card--selected' : ''}`}
                style={{ '--srv-color': svc.color || 'var(--pb-accent)', '--card-delay': `${idx * 60}ms` }}
                onClick={() => handleSelect(svc)}
              >
                <div className="srv-card-top">
                  <div className="srv-card-rack">
                    <span className="srv-rack-label">{ICON_LABEL[svc.icon] || 'SRV'}</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`srv-rack-led${i === 0 ? ' srv-rack-led--active' : ''}`} />
                    ))}
                  </div>
                  <StatusDot status={svc.status} live={liveStatus[svc.id]} />
                </div>

                <div className="srv-card-body">
                  <div className="srv-card-icon-row">
                    <span className="srv-card-icon">
                      <ServiceIcon icon={svc.icon} size={22} />
                    </span>
                    {svc.subdomain && (
                      <span className="srv-card-subdomain">{svc.subdomain}.</span>
                    )}
                    {getLiveBadge(svc)}
                  </div>
                  <div className="srv-card-name">{svc.name}</div>
                  <p className="srv-card-desc">{svc.description}</p>
                  <div className="srv-card-footer">
                    <span className={`srv-card-status srv-card-status--${svc.status || 'online'}`}>
                      {svc.status === 'local' ? 'LOCAL ONLY' : (svc.status || 'online').toUpperCase()}
                    </span>
                    {svc.tags?.slice(0, 2).map(t => (
                      <span key={t} className="srv-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneServer;
