import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GameView.css';

const SECTIONS = [
  { id: 'hero',     label: '00 / HERO' },
  { id: 'projects', label: '01 / PROJECTS' },
  { id: 'stack',    label: '02 / STACK' },
  { id: 'contact',  label: '03 / CONTACT' },
];

const CATEGORY_COLORS = {
  engines: '#3b82f6',
  languages: '#f59e0b',
  web: '#10b981',
  xr3d: '#8b5cf6',
  tools: '#ec4899',
};

// ─── Boot screen ────────────────────────────────────────────────────────────
const BootScreen = ({ accent }) => (
  <motion.div
    className="gv-boot"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="gv-boot-inner">
      <motion.div
        className="gv-boot-title"
        style={{ color: accent }}
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ repeat: Infinity, duration: 0.75 }}
      >
        INITIALIZING RUNTIME
      </motion.div>
      <div className="gv-boot-bar">
        <motion.div
          className="gv-boot-fill"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
      <div className="gv-boot-sub">danilo-vanegas.build · v3.0.0 · GAME VIEW</div>
    </div>
  </motion.div>
);

// ─── Hero ────────────────────────────────────────────────────────────────────
const HeroSection = ({ accent, projects, about }) => {
  const projectCount = projects.length || 8;
  const careerStart = about?.careerStartDate || '2019-03-01';
  const yearsActive  = Math.floor((Date.now() - new Date(careerStart).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const heroName = (about?.heroText || about?.name || 'Danilo Vanegas').split(' ');
  const nameLine1 = heroName[0] || 'DANILO';
  const nameLine2 = heroName.slice(1).join(' ') || 'VANEGAS';

  return (
    <motion.div
      key="hero"
      className="gv-section gv-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
    >
      <div className="gv-hero-body">
        <motion.div
          className="gv-hero-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="gv-pulse-dot" style={{ background: accent }} />
          {about?.title || 'Software Engineer & Creative Developer'}
        </motion.div>

        <motion.h1
          className="gv-hero-name"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {nameLine1}<br />{nameLine2}
        </motion.h1>

        <motion.div
          className="gv-hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { v: `${projectCount}+`, l: 'Projects shipped' },
            { v: `${yearsActive}+`, l: 'Years active' },
            { v: '40+',             l: 'Technologies' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="gv-stat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 + i * 0.08 }}
            >
              <div className="gv-stat-val" style={{ color: accent }}>{s.v}</div>
              <div className="gv-stat-lbl">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="gv-hero-ctas"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <a href="/projects" className="gv-cta gv-cta-primary" style={{ '--ca': accent }}>View Projects</a>
          <a href={`mailto:${about?.email || 'vanegasdanilo7@gmail.com'}`} className="gv-cta gv-cta-secondary">Contact</a>
          <a href={about?.cv?.path || '/CV-Danilo-Vanegas-2025.pdf'} download className="gv-cta gv-cta-ghost">Download CV</a>
        </motion.div>

        <motion.div
          className="gv-availability"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span className="gv-pulse-dot gv-pulse-sm" style={{ background: accent }} />
          {about?.availability || 'Available for hire'} · {about?.availabilityStart || 'Now'} · {about?.location?.split(',').slice(-2).join(',').trim() || 'Colombia (UTC-5)'}
        </motion.div>
      </div>

      {/* Decorative inspector-style panel */}
      <motion.div
        className="gv-hero-deco"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="gv-deco-box" style={{ '--dca': accent }}>
          <div className="gv-deco-section-label">TRANSFORM</div>
          {[
            ['Position', '0.000,  0.000,  0.000'],
            ['Rotation', '0.000,  0.000,  0.000'],
            ['Scale',    '1.000,  1.000,  1.000'],
          ].map(([k, v]) => (
            <div key={k} className="gv-deco-row">
              <span className="gv-deco-key">{k}</span>
              <span className="gv-deco-val">{v}</span>
            </div>
          ))}
          <div className="gv-deco-divider" style={{ background: accent }} />
          <div className="gv-deco-section-label">IDENTITY</div>
          {[
            ['Class', 'DaniloVanegas'],
            ['Tag',   'Player'],
            ['Layer', 'Default'],
          ].map(([k, v]) => (
            <div key={k} className="gv-deco-row">
              <span className="gv-deco-key">{k}</span>
              <span className="gv-deco-val" style={{ color: accent }}>{v}</span>
            </div>
          ))}
          <div className="gv-deco-divider" style={{ background: accent }} />
          <div className="gv-deco-section-label">STATUS</div>
          {[
            ['Active', 'true'],
            ['Layer',  '0'],
          ].map(([k, v]) => (
            <div key={k} className="gv-deco-row">
              <span className="gv-deco-key">{k}</span>
              <span className="gv-deco-val" style={{ color: v === 'true' ? accent : undefined }}>{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Projects ─────────────────────────────────────────────────────────────────
const ProjectsSection = ({ accent, projects }) => {
  const [active, setActive] = useState(0);
  const featured = projects.length > 0 ? projects.slice(0, 5) : [];

  return (
    <motion.div
      key="projects"
      className="gv-section gv-projects"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      <div className="gv-sec-head">
        <div className="gv-sec-label">01 / SELECTED WORKS</div>
        <div className="gv-sec-count">{projects.length || 8} projects total</div>
      </div>

      {featured.length === 0 ? (
        <div className="gv-empty">Fetching project data…</div>
      ) : (
        <div className="gv-proj-layout">
          {/* List */}
          <div className="gv-proj-list">
            {featured.map((p, i) => (
              <motion.button
                key={p.id || i}
                className={`gv-proj-row${i === active ? ' active' : ''}`}
                style={{ '--ra': p.color || accent }}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                <span className="gv-proj-idx">0{i + 1}</span>
                <span className="gv-proj-name">{p.name}</span>
                <span className="gv-proj-year">{p.year || '—'}</span>
                <span className="gv-proj-arrow">→</span>
              </motion.button>
            ))}
          </div>

          {/* Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="gv-proj-detail"
              style={{ '--da': featured[active]?.color || accent }}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.28 }}
            >
              {featured[active]?.images?.[0] ? (
                <div className="gv-proj-img-wrap">
                  <img
                    src={featured[active].images[0]}
                    alt={featured[active].name}
                    className="gv-proj-img"
                  />
                </div>
              ) : (
                <div className="gv-proj-img-placeholder" style={{ background: featured[active]?.color || accent }}>
                  <span className="gv-proj-ph-label">{featured[active]?.id?.toUpperCase() || 'PROJECT'}</span>
                </div>
              )}
              <div className="gv-proj-detail-name">{featured[active]?.name}</div>
              <div className="gv-proj-detail-desc">{featured[active]?.description}</div>
              <div className="gv-proj-tags">
                {(featured[active]?.technologies || []).slice(0, 6).map((t, i) => (
                  <span key={i} className="gv-tag">{t}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

// ─── Stack ────────────────────────────────────────────────────────────────────
const StackSection = ({ accent, technologies }) => {
  const groups = (technologies || []).reduce((acc, t) => {
    const cat = t.category || 'tools';
    if (!acc[cat]) acc[cat] = { name: cat, items: [] };
    acc[cat].items.push(t.name);
    return acc;
  }, {});

  const catLabels = { engines: 'Engines', languages: 'Languages', web: 'Web', xr3d: 'XR / 3D', tools: 'Tools' };
  const categoryList = Object.entries(groups).map(([key, val]) => ({
    cat: catLabels[key] || key,
    color: CATEGORY_COLORS[key] || '#888',
    items: val.items,
  }));
  const totalTechs = (technologies || []).length;
  const domainCount = categoryList.length;

  return (
    <motion.div
      key="stack"
      className="gv-section gv-stack"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      <div className="gv-sec-head">
        <div className="gv-sec-label">02 / TECHNOLOGY STACK</div>
        <div className="gv-sec-count">{totalTechs}+ technologies · {domainCount} domains</div>
      </div>
      <div className="gv-stack-grid">
        {categoryList.map((cat, ci) => (
          <motion.div
            key={cat.cat}
            className="gv-stack-cat"
            style={{ '--cc': cat.color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.07 }}
          >
            <div className="gv-cat-head">
              <div className="gv-cat-dot" />
              <div className="gv-cat-name">{cat.cat.toUpperCase()}</div>
            </div>
            <div className="gv-cat-items">
              {cat.items.map((item, ii) => (
                <motion.div
                  key={ii}
                  className="gv-cat-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ci * 0.07 + ii * 0.045 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Contact ──────────────────────────────────────────────────────────────────
const ContactSection = ({ accent, about }) => {
  const socials = about?.socials || [];
  const locationStr = about?.locationDisplay || about?.location || 'Colombia (UTC-5)';
  const timezone = about?.timezone ? `UTC${about.timezone.replace('America/', '-')}` : 'UTC-5';

  const links = [
    { label: 'Email', href: `mailto:${about?.email || 'vanegasdanilo7@gmail.com'}`, text: about?.email || 'vanegasdanilo7@gmail.com' },
    ...socials.map(s => ({
      label: s.name,
      href: s.url,
      text: s.handle ? `${s.name.toLowerCase()}/${s.handle}` : s.url,
    })),
  ];

  return (
    <motion.div
      key="contact"
      className="gv-section gv-contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="gv-contact-heading"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        LET'S BUILD<br />SOMETHING.
      </motion.div>

      <motion.p
        className="gv-contact-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Available for full-time roles, contract work, and creative collaborations.<br />
        Based in {locationStr} — open to remote worldwide.
      </motion.p>

      <div className="gv-contact-links">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="gv-contact-link"
            style={{ '--la': accent }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.09 }}
          >
            <span className="gv-cl-label">{link.label}</span>
            <span className="gv-cl-text">{link.text}</span>
            <span className="gv-cl-arrow">↗</span>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="gv-avail-badge"
        style={{ '--ba': accent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.88 }}
      >
        <span className="gv-pulse-dot" style={{ background: accent }} />
        {about?.availability || 'Available Now'}
      </motion.div>
    </motion.div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const GameView = ({ projects = [], experience = [], technologies = [], about = null, accent = 'oklch(82% 0.20 130)', onExit }) => {
  const [booting, setBooting] = useState(true);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 950);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onExit(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setSection(s => Math.min(s + 1, SECTIONS.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setSection(s => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  return (
    <motion.div
      className="gv-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="gv-bg-grid" />
      <div className="gv-scanlines" />

      <AnimatePresence>
        {booting && <BootScreen key="boot" accent={accent} />}
      </AnimatePresence>

      {!booting && (
        <>
          {/* Corner brackets */}
          {['tl', 'tr', 'bl', 'br'].map(pos => (
            <div key={pos} className={`gv-corner gv-corner-${pos}`} style={{ '--cc': accent }} />
          ))}

          {/* HUD */}
          <div className="gv-hud-tl">
            <motion.span
              style={{ color: accent }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >●</motion.span>
            {' '}REC · GAME VIEW
          </div>
          <div className="gv-hud-tr">{SECTIONS[section].label} · {section + 1} / {SECTIONS.length}</div>
          <div className="gv-hud-bl">← → NAVIGATE &nbsp;·&nbsp; ESC EXIT</div>

          {/* Side nav */}
          <nav className="gv-sidenav">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                className={`gv-dot-btn${i === section ? ' active' : ''}`}
                style={{ '--da': accent }}
                onClick={() => setSection(i)}
                title={s.label}
              />
            ))}
          </nav>

          {/* Arrow nav */}
          <div className="gv-arrow-nav">
            <button className="gv-arrow-btn" onClick={() => setSection(s => Math.max(s - 1, 0))}    disabled={section === 0}                  >←</button>
            <span   className="gv-arrow-sep">{section + 1} / {SECTIONS.length}</span>
            <button className="gv-arrow-btn" onClick={() => setSection(s => Math.min(s + 1, SECTIONS.length - 1))} disabled={section === SECTIONS.length - 1}>→</button>
          </div>

          {/* Exit */}
          <button className="gv-exit" onClick={onExit}>■ EXIT</button>

          {/* Section content */}
          <AnimatePresence mode="wait">
            {section === 0 && <HeroSection     key="hero"     accent={accent} projects={projects} about={about} />}
            {section === 1 && <ProjectsSection key="projects" accent={accent} projects={projects} />}
            {section === 2 && <StackSection    key="stack"    accent={accent} technologies={technologies} />}
            {section === 3 && <ContactSection  key="contact"  accent={accent} about={about} />}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default GameView;
