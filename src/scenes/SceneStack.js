import { useState, useEffect, useMemo } from 'react';
import './SceneStack.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchTechnologies, fetchCategories } from '../data/api';

const SKEL_WIDTHS = [58, 72, 45, 64, 52, 38, 61, 49];

const StackSkeleton = () => {
  const cats = [
    { name: 'ENGINES',   count: 3 },
    { name: 'LANGUAGES', count: 5 },
    { name: 'WEB',       count: 5 },
    { name: 'XR/3D',     count: 4 },
    { name: 'TOOLS',     count: 6 },
  ];
  return (
    <div className="asset-manifest">
      <div className="manifest-head">
        <div className="skel-stk-bar skel-stk-title pb-shimmer" />
        <div className="skel-stk-bar skel-stk-total pb-shimmer" />
      </div>
      {cats.map((cat, ci) => (
        <div key={cat.name} className="manifest-section">
          <div className="manifest-section-head">
            <div className="skel-stk-bar skel-stk-cat pb-shimmer" />
            <div className="skel-stk-bar skel-stk-count pb-shimmer" />
          </div>
          <div className="manifest-items">
            {Array.from({ length: cat.count }).map((_, i) => (
              <div key={i} className="manifest-item-group">
                <div className="manifest-item">
                  <span className="manifest-diamond" style={{ opacity: 0.2 }}>◆</span>
                  <div className="skel-stk-bar pb-shimmer" style={{ width: `${SKEL_WIDTHS[(ci + i) % SKEL_WIDTHS.length]}%`, height: 10 }} />
                  <div className="skel-stk-bar skel-stk-pkg pb-shimmer" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DEFAULT_COLORS = {
  engines: '#3b82f6', languages: '#f59e0b', web: '#10b981',
  xr3d: '#8b5cf6', tools: '#ec4899', hardware: '#ff6b9d',
};
const DEFAULT_LABELS = {
  engines: 'Engines', languages: 'Languages', web: 'Web',
  xr3d: 'XR/3D', tools: 'Tools', hardware: 'Hardware',
};
const DEFAULT_ORDER = ['engines', 'languages', 'web', 'xr3d', 'tools', 'hardware'];

const SceneStack = () => {
  const [tech, setTech] = useState([]);
  const [catMeta, setCatMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Stack');
    emit('info', '> Loading technology stack...');

    Promise.all([
      fetchTechnologies(),
      fetchCategories(),
    ]).then(([techData, catData]) => {
      setTech(techData);
      if (catData?.order) setCatMeta(catData);
      emit('ok', `✓ Loaded ${techData.length} technologies`);
    }).catch(() => emit('error', '✗ Failed to load technologies'))
    .finally(() => setLoading(false));
  }, [emit]);

  const {
    colors: CATEGORY_COLORS = DEFAULT_COLORS,
    labels: CATEGORY_LABELS = DEFAULT_LABELS,
    order: CATEGORY_ORDER = DEFAULT_ORDER,
  } = catMeta;

  // Group tech objects by category, preserving DB order within each group
  const categories = useMemo(() => {
    if (tech.length === 0) return [];
    const grouped = {};
    tech.forEach(t => {
      const cat = t.category || 'tools';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    });
    return CATEGORY_ORDER
      .filter(cat => grouped[cat]?.length > 0)
      .map(cat => ({
        key:   cat,
        name:  CATEGORY_LABELS[cat] || cat,
        color: CATEGORY_COLORS[cat] || '#888',
        items: grouped[cat],
      }));
  }, [tech, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ORDER]);

  const toggleItem = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="scene-stack">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Stack</h1>

        {loading ? (
          <StackSkeleton />
        ) : (
          <div className="asset-manifest">
            <div className="manifest-head">
              <span className="manifest-title">TECHNOLOGY MANIFEST</span>
              <span className="manifest-total">{tech.length} items</span>
            </div>

            {categories.map(cat => (
              <div key={cat.key} className="manifest-section">
                <div className="manifest-section-head" style={{ '--cat-color': cat.color }}>
                  <span className="manifest-cat-name">{cat.name.toUpperCase()}</span>
                  <span className="manifest-cat-count">{cat.items.length}</span>
                </div>
                <div className="manifest-items">
                  {cat.items.map((item, i) => {
                    const packages    = item.packages || [];
                    const key         = `${cat.key}-${item.name}`;
                    const isOpen      = !!expanded[key];
                    const hasPackages = packages.length > 0;
                    return (
                      <div key={i} className="manifest-item-group">
                        <div
                          className={`manifest-item${hasPackages ? ' manifest-item--expandable' : ''}${isOpen ? ' manifest-item--open' : ''}`}
                          onClick={hasPackages ? () => toggleItem(key) : undefined}
                        >
                          <span className="manifest-diamond">◆</span>
                          <span className="manifest-item-name">{item.name}</span>
                          {hasPackages && (
                            <span className="manifest-expand-hint">
                              <span className="manifest-pkg-count">{packages.length} pkg</span>
                              <span className="manifest-chevron">{isOpen ? '▾' : '▸'}</span>
                            </span>
                          )}
                        </div>
                        {hasPackages && isOpen && (
                          <div className="manifest-packages">
                            {packages.map((pkg, j) => (
                              <div key={j} className="manifest-pkg-item">
                                <span className="manifest-pkg-bullet">·</span>
                                <span className="manifest-pkg-name">{pkg}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneStack;
