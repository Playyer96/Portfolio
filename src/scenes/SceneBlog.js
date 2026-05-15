import React, { useState, useEffect, useMemo } from 'react';
import './SceneBlog.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import LazyImage from '../components/LazyImage';
import ComingSoon from '../components/ComingSoon';
import { fetchBlogPosts, fetchMediumPosts } from '../data/api';

const COMING_SOON = true;

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toISOString().split('T')[0];
}

function stars(n) {
  const r = Math.round(n || 0);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

const ArticleSkeleton = ({ idx }) => (
  <div className="blog-skeleton" style={{ '--art-delay': `${idx * 50}ms` }}>
    <div className="blog-sk-thumb" />
    <div className="blog-sk-body">
      <div className="blog-sk-bar pb-shimmer" style={{ width: '30%', height: 9 }} />
      <div className="blog-sk-bar pb-shimmer" style={{ width: '75%', height: 16 }} />
      <div className="blog-sk-bar pb-shimmer" style={{ width: '55%', height: 16 }} />
      <div className="blog-sk-bar pb-shimmer" style={{ width: '90%', height: 10 }} />
      <div className="blog-sk-bar pb-shimmer" style={{ width: '70%', height: 10 }} />
    </div>
  </div>
);

const SceneBlog = () => {
  const [custom, setCustom] = useState([]);
  const [medium, setMedium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Blog');
    emit('info', '> Fetching articles...');

    const load = async () => {
      try {
        const [customData, mediumRes] = await Promise.allSettled([
          fetchBlogPosts(true),
          fetchMediumPosts(),
        ]);

        const c = customData.status === 'fulfilled' ? customData.value : [];
        const m = mediumRes.status === 'fulfilled' && Array.isArray(mediumRes.value) ? mediumRes.value : [];

        setCustom(c);
        setMedium(m);
        emit('ok', `✓ ${c.length} custom · ${m.length} medium articles loaded`);
        if (m.length === 0) emit('warn', '! Medium RSS: set MEDIUM_USERNAME in backend .env');
      } catch (err) {
        emit('error', `✗ Blog fetch failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
  }, [emit]);

  const articles = useMemo(() => {
    const mapped = [
      ...custom.map(p => ({
        id:       p.id,
        title:    p.title,
        link:     null,
        date:     p.publishDate || p.createdAt,
        tags:     p.tags || [],
        thumb:    p.featuredImage?.url || null,
        excerpt:  p.excerpt || '',
        readTime: Math.max(1, Math.round((p.content?.split(' ')?.length || 0) / 200)),
        source:   'custom',
      })),
      ...medium.map(m => ({
        id:       m.id,
        title:    m.title,
        link:     m.link,
        date:     m.pubDate,
        tags:     m.tags || [],
        thumb:    m.thumbnail,
        excerpt:  m.excerpt,
        readTime: m.readTime || 5,
        source:   'medium',
      })),
    ];
    mapped.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    if (filter === 'medium') return mapped.filter(a => a.source === 'medium');
    if (filter === 'custom') return mapped.filter(a => a.source === 'custom');
    return mapped;
  }, [custom, medium, filter]);

  const total = custom.length + medium.length;

  return (
    <div className="scene-blog">
      <GridBackground />
      <div className="scene-content">

        <h1 className="section-heading">Blog</h1>

        {COMING_SOON ? (
          <ComingSoon
            label="blog"
            hint="// set MEDIUM_USERNAME in backend .env to pull from Medium"
          />
        ) : (<>

        <div className="blog-feed-header">
          <span className="blog-feed-meta">
            DEV LOG &middot; {total} article{total !== 1 ? 's' : ''}
            {medium.length > 0 && ` · medium.com`}
          </span>
          <div className="blog-filters">
            {['all', 'medium', 'custom'].map(f => (
              <button
                key={f}
                className={`blog-filter-btn${filter === f ? ' blog-filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="blog-feed">
            {Array.from({ length: 4 }).map((_, i) => <ArticleSkeleton key={i} idx={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="blog-empty">
            NO ARTICLES FOUND
            <span className="blog-empty-sub">
              {filter !== 'all' ? `Switch filter or add ${filter === 'medium' ? 'MEDIUM_USERNAME to backend .env' : 'custom posts via the dashboard'}` : 'Add posts via the dashboard or set MEDIUM_USERNAME'}
            </span>
          </div>
        ) : (
          <div className="blog-feed">
            {articles.map((art, idx) => {
              const inner = (
                <>
                  <div className="blog-thumb">
                    {art.thumb
                      ? <LazyImage src={art.thumb} alt={art.title} style={{ width: '100%', height: '100%' }} />
                      : <div className="blog-thumb-placeholder">//</div>
                    }
                  </div>
                  <div className="blog-article-body">
                    <div className="blog-article-meta-row">
                      <span className={`blog-source-badge blog-source-badge--${art.source}`}>
                        {art.source.toUpperCase()}
                      </span>
                      <span>{formatDate(art.date)}</span>
                      <span>{art.readTime} min read</span>
                    </div>
                    <h2 className="blog-article-title">{art.title}</h2>
                    {art.excerpt && <p className="blog-article-excerpt">{art.excerpt}</p>}
                    <div className="blog-article-footer">
                      {art.tags?.length > 0 && (
                        <div className="blog-article-tags">
                          {art.tags.slice(0, 4).map(t => (
                            <span key={t} className="blog-tag">{t}</span>
                          ))}
                        </div>
                      )}
                      <span className="blog-read-link">
                        {art.source === 'medium' ? 'Read on Medium' : 'Read'} &rsaquo;
                      </span>
                    </div>
                  </div>
                </>
              );

              return art.link ? (
                <a
                  key={art.id}
                  href={art.link}
                  target="_blank"
                  rel="noreferrer"
                  className="blog-article"
                  style={{ '--art-delay': `${idx * 50}ms` }}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={art.id}
                  className="blog-article"
                  style={{ '--art-delay': `${idx * 50}ms` }}
                >
                  {inner}
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

export { stars };
export default SceneBlog;
