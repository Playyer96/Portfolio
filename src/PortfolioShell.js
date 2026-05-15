import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useTheme from './hooks/useTheme';
import GameView from './scenes/GameView';
import TweaksPanel from './ui/TweaksPanel';

function HItem({ icon, label, depth = 0, active, onClick, badge, color }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6,
      width: "100%", padding: `4px 8px 4px ${8 + depth * 14}px`,
      background: active ? "var(--pb-accent)" : "transparent",
      color: active ? "#000" : "var(--pb-fg)", border: "none",
      fontFamily: "var(--pb-mono)", fontSize: 11, cursor: "pointer", textAlign: "left",
    }}>
      <span style={{ width: 12, fontSize: 10, color: active ? "#000" : (color || "var(--pb-dim)") }}>{icon}</span>
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {badge && <span style={{
        fontSize: 9, padding: "1px 5px", borderRadius: 2,
        background: active ? "rgba(0,0,0,.2)" : "var(--pb-line)",
        color: active ? "#000" : "var(--pb-dim)",
      }}>{badge}</span>}
    </button>
  );
}

function InspGroup({ icon, iconColor, title, badge, defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--pb-line)" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px", background: "var(--pb-panel)", color: "var(--pb-fg)",
        border: "none", cursor: "pointer", fontFamily: "var(--pb-mono)", fontSize: 11, textAlign: "left",
      }}>
        <span style={{ color: "var(--pb-dim)", width: 10, fontSize: 9 }}>{open ? "▾" : "▸"}</span>
        {icon && (
          <span style={{
            width: 14, height: 14, borderRadius: 2, fontSize: 8,
            background: iconColor || "var(--pb-accent)", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>{icon}</span>
        )}
        <span style={{ flex: 1, fontWeight: 600 }}>{title}</span>
        {badge !== undefined && (
          <span style={{ fontSize: 9, padding: "1px 5px", background: "var(--pb-line)", color: "var(--pb-dim)" }}>{badge}</span>
        )}
      </button>
      {open && <div style={{ background: "var(--pb-bg)" }}>{children}</div>}
    </div>
  );
}

function InspField({ label, value, accent, copyValue, href }) {
  const [copied, setCopied] = React.useState(false);
  const interactive = !!(copyValue || href || false);

  const handleClick = () => {
    if (copyValue) {
      navigator.clipboard?.writeText(copyValue).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const inner = (
    <div
      onClick={handleClick}
      style={{
        display: "grid", gridTemplateColumns: "100px 1fr",
        padding: "4px 10px", borderBottom: "1px solid var(--pb-line)",
        fontFamily: "var(--pb-mono)", fontSize: 10, gap: 8,
        cursor: interactive ? "pointer" : "default",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => { if (interactive) e.currentTarget.style.background = "var(--pb-panel-h)"; }}
      onMouseLeave={e => { if (interactive) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ color: "var(--pb-dim)" }}>{label}</span>
      <span style={{ color: accent ? "var(--pb-accent)" : copied ? "var(--pb-accent)" : "var(--pb-fg)", textAlign: "right" }}>
        {copied ? "Copied! ✓" : value}
        {href && !copied && <span style={{ color: "var(--pb-dim)", marginLeft: 4 }}>↗</span>}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </a>
    );
  }
  return inner;
}

function AnimatorView({ experience }) {
  if (!experience || experience.length === 0)
    return <div style={{ padding: 40, color: "var(--pb-dim)", fontFamily: "var(--pb-mono)", fontSize: 11 }}>No timeline data.</div>;
  const colors = ["var(--pb-accent)", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899"];
  const allStart = experience.map(e => e.startYear || 2017).filter(Boolean);
  const allEnd = experience.map(e => e.endYear || 2026).filter(Boolean);
  const minY = Math.min(...allStart, 2017);
  const maxY = Math.max(...allEnd, 2026);
  const range = maxY - minY || 1;
  const years = Array.from({ length: range + 1 }, (_, i) => minY + i);
  return (
    <div style={{ padding: "20px 28px", height: "100%", overflow: "auto", fontFamily: "var(--pb-mono)" }}>
      <div style={{ fontSize: 10, color: "var(--pb-dim)", letterSpacing: "0.1em", marginBottom: 14 }}>ANIMATOR · CAREER TIMELINE</div>
      <div style={{ position: "relative", height: 24, marginBottom: 6, display: "flex" }}>
        {years.map(y => (
          <div key={y} style={{ flex: 1, fontSize: 9, color: "var(--pb-dim)", borderLeft: "1px solid var(--pb-line)", paddingLeft: 2 }}>{y}</div>
        ))}
      </div>
      {experience.map((e, i) => {
        const s = Math.max(((e.startYear || minY) - minY) / range * 100, 0);
        const w = Math.max(((e.endYear || maxY) - (e.startYear || minY)) / range * 100, 2);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6, gap: 8 }}>
            <div style={{ width: 110, fontSize: 10, color: "var(--pb-dim)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.company}</div>
            <div style={{ flex: 1, height: 18, position: "relative" }}>
              <div style={{
                position: "absolute", left: `${s}%`, width: `${w}%`,
                height: "100%", background: colors[i % colors.length], opacity: 0.85,
                display: "flex", alignItems: "center", paddingLeft: 6, overflow: "hidden",
              }}>
                <span style={{ fontSize: 9, color: "#000", whiteSpace: "nowrap" }}>{e.role}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AssetStoreView({ projects, onSelect }) {
  return (
    <div style={{ padding: 20, height: "100%", overflow: "auto" }}>
      <div style={{ fontSize: 10, color: "var(--pb-dim)", letterSpacing: "0.1em", marginBottom: 14, fontFamily: "var(--pb-mono)" }}>ASSET STORE · PROJECT PREFABS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
        {projects.map((p, i) => (
          <button key={i} onClick={() => onSelect(p)} style={{
            background: "var(--pb-panel)", border: "1px solid var(--pb-line)",
            cursor: "pointer", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = p.color || "var(--pb-accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--pb-line)"}
          >
            <div style={{ aspectRatio: "1", background: p.color || "var(--pb-accent)", position: "relative" }}>
              <div style={{ position: "absolute", top: 4, left: 6, fontSize: 8, color: "rgba(0,0,0,.5)", fontFamily: "var(--pb-mono)", letterSpacing: "0.05em" }}>
                {(p.id || '').toUpperCase()}
              </div>
            </div>
            <div style={{ padding: "6px 8px" }}>
              <div style={{ fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-fg)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name || p.title}</div>
              <div style={{ fontFamily: "var(--pb-mono)", fontSize: 9, color: "var(--pb-dim)", marginTop: 1 }}>.prefab</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfilerView() {
  const metrics = [
    { label: "CPU · main thread", value: 2.1, max: 16, unit: "ms", color: "#10b981" },
    { label: "GPU · render",       value: 4.8, max: 16, unit: "ms", color: "#06b6d4" },
    { label: "Memory · runtime",   value: 142, max: 512, unit: "MB", color: "#f59e0b" },
    { label: "Audio · mixer",      value: 0.2, max: 4,  unit: "ms", color: "#8b5cf6" },
    { label: "Physics · step",     value: 0.9, max: 8,  unit: "ms", color: "#ec4899" },
    { label: "Network · ping",     value: 0.0, max: 4,  unit: "ms", color: "#ef4444" },
  ];
  return (
    <div style={{ padding: "20px 28px", height: "100%", overflow: "auto", fontFamily: "var(--pb-mono)" }}>
      <div style={{ fontSize: 10, color: "var(--pb-dim)", letterSpacing: "0.1em", marginBottom: 14 }}>PROFILER · RUNTIME METRICS</div>
      {metrics.map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 140, fontSize: 10, color: "var(--pb-dim)", flexShrink: 0 }}>{m.label}</div>
          <div style={{ flex: 1, height: 10, background: "var(--pb-panel)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(m.value / m.max) * 100}%`, background: m.color, opacity: 0.8 }} />
          </div>
          <div style={{ width: 56, fontSize: 10, color: "var(--pb-fg)", textAlign: "right", flexShrink: 0 }}>{m.value} {m.unit}</div>
        </div>
      ))}
    </div>
  );
}

function BottomProfiler() {
  const phaseRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const [bars, setBars] = React.useState(() => Array.from({ length: 80 }, (_, i) => Math.sin((i / 80) * Math.PI * 4) * 0.5 + 0.5));
  React.useEffect(() => {
    const animate = () => {
      phaseRef.current += 0.04;
      setBars(Array.from({ length: 80 }, (_, i) => Math.sin((i / 80) * Math.PI * 4 + phaseRef.current) * 0.5 + 0.5));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  const metrics = [
    { label: "CPU", value: "2.1ms", color: "#10b981" },
    { label: "GPU", value: "4.8ms", color: "#06b6d4" },
    { label: "Memory", value: "142MB", color: "#f59e0b" },
    { label: "Draw calls", value: "48", color: "var(--pb-accent)" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "var(--pb-mono)" }}>
      <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 1, padding: "6px 12px", borderBottom: "1px solid var(--pb-line)" }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, height: `${Math.max(v * 46, 2)}px`, background: v > 0.7 ? "#f59e0b" : "var(--pb-accent)", opacity: 0.75 }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "8px 12px", gap: 8, alignItems: "center" }}>
        {metrics.map((m, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, color: "var(--pb-dim)", letterSpacing: "0.1em" }}>{m.label}</div>
            <div style={{ fontSize: 14, color: m.color, fontWeight: 600, marginTop: 2 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomAssets({ projects, navigate, setSelectedProject }) {
  return (
    <div style={{ height: "100%", overflow: "auto", display: "flex", gap: 10, padding: "10px 12px", alignItems: "flex-start", flexWrap: "wrap" }}>
      {projects.map((p, i) => (
        <button key={i} onClick={() => { setSelectedProject(p); navigate('/projects'); }}
          style={{ background: "var(--pb-panel)", border: "1px solid var(--pb-line)", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 72, fontFamily: "var(--pb-mono)", transition: "border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = p.color || "var(--pb-accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--pb-line)"}
        >
          <div style={{ width: 40, height: 40, background: p.color || "var(--pb-accent)", borderRadius: 2 }} />
          <div style={{ fontSize: 9, color: "var(--pb-fg)", textAlign: "center", wordBreak: "break-word", lineHeight: 1.3 }}>{p.name || p.title}</div>
          <div style={{ fontSize: 8, color: "var(--pb-dim)" }}>.prefab</div>
        </button>
      ))}
    </div>
  );
}

function InspectorIntro({ about }) {
  const tz = about?.timezone || 'America/Bogota';
  const startDate = about?.careerStartDate || '2019-03-01';
  const yearsActive = Math.floor((Date.now() - new Date(startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const [colTime, setColTime] = React.useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: tz })
  );
  React.useEffect(() => {
    const id = setInterval(() => {
      setColTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: tz }));
    }, 1000);
    return () => clearInterval(id);
  }, [tz]);

  const email    = about?.email || '';
  const github   = about?.socials?.find(s => s.name === 'GitHub');
  const linkedin = about?.socials?.find(s => s.name === 'LinkedIn');
  const insta    = about?.socials?.find(s => s.name === 'Instagram');

  return (
    <div>
      <InspGroup icon="i" iconColor="var(--pb-accent)" title="Identity">
        <InspField label="Name"       value={about?.name || '—'} />
        <InspField label="Role"       value={about?.role || '—'} />
        <InspField label="Location"   value={about?.locationDisplay || '—'} />
        <InspField label="Local Time" value={colTime} />
        <InspField label="Experience" value={about ? `${yearsActive}+ years` : '—'} accent />
      </InspGroup>
      <InspGroup icon="@" iconColor="#0a66c2" title="Engagement">
        <InspField label="Status"    value={about?.availability || 'Available Now'} accent />
        <InspField label="Start"     value={about?.availabilityStart || 'Immediately'} />
        {email && <InspField label="Email"     value={`${email.split('@')[0]}@…`} copyValue={email} href={`mailto:${email}`} />}
        {github   && <InspField label="GitHub"    value={github.handle}   href={github.url} />}
        {linkedin && <InspField label="LinkedIn"  value={linkedin.handle} href={linkedin.url} />}
        {insta    && <InspField label="Instagram" value={insta.handle}    href={insta.url} />}
      </InspGroup>
      <InspGroup icon="◆" iconColor="#888" title="Transform" defaultOpen={false}>
        <InspField label="Position" value="(0, 0, 0)" />
        <InspField label="Rotation" value="(0, 0, 0)" />
        <InspField label="Scale"    value="(1, 1, 1)" />
      </InspGroup>
    </div>
  );
}

function InspectorAbout({ about }) {
  const bioPreview = about?.bio?.[0]?.slice(0, 60) || 'Full bio on /about';
  const eduCount = about?.education?.length || '—';
  return (
    <div>
      <InspGroup icon="§" iconColor="var(--pb-accent)" title="Document">
        <InspField label="Content" value={bioPreview + '...'} />
      </InspGroup>
      <InspGroup icon="^" iconColor="#f59e0b" title="Education">
        <InspField label="Focus" value="CS, interactive systems" />
      </InspGroup>
      <InspGroup icon="#" iconColor="#10b981" title="Working At">
        <InspField label="Last" value={about?.role || 'See /experience'} />
      </InspGroup>
    </div>
  );
}

function InspectorProject({ project }) {
  return (
    <div>
      <InspGroup icon="◆" iconColor={project.color || "var(--pb-accent)"} title={project.name || project.title}>
        <InspField label="ID" value={project.id || 'N/A'} />
        <InspField label="Year" value={project.year || 'N/A'} />
      </InspGroup>
      <InspGroup icon="*" iconColor="var(--pb-accent)" title="Highlights">
        <div style={{ padding: "8px 10px", fontSize: 10, color: "var(--pb-fg)", lineHeight: 1.5 }}>
          {project.summary || project.description || 'No description'}
        </div>
      </InspGroup>
      <InspGroup icon="%" iconColor="#06b6d4" title="Stack">
        <div style={{ padding: "8px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(project.technologies || []).map((t, i) => (
            <span key={i} style={{
              fontSize: 9, background: "var(--pb-panel)", color: "var(--pb-fg)",
              padding: "3px 6px", borderRadius: 2,
            }}>{t}</span>
          ))}
        </div>
      </InspGroup>
      <InspGroup icon="▶" iconColor="#f59e0b" title="Process" defaultOpen={false}>
        <InspField label="Phase" value="3 stages" />
      </InspGroup>
    </div>
  );
}

function calcInspDuration(period) {
  if (!period) return '';
  const sep = period.indexOf(' - ');
  if (sep === -1) return '';
  const monthMap = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const parseDate = (s) => {
    s = s.trim().toLowerCase();
    if (s === 'present') return new Date(2026, 4);
    const year = parseInt(s.match(/\d{4}/)?.[0]);
    if (!year) return null;
    for (const [a, mo] of Object.entries(monthMap)) { if (s.includes(a)) return new Date(year, mo); }
    return new Date(year, 0);
  };
  const start = parseDate(period.slice(0, sep));
  const end   = parseDate(period.slice(sep + 3));
  if (!start || !end) return '';
  const total = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (total < 1) return '';
  const y = Math.floor(total / 12), m = total % 12;
  return y === 0 ? `${m} months` : m === 0 ? `${y} years` : `${y}y ${m}mo`;
}

function InspectorExperience({ experience, about }) {
  const work = experience.filter(e => e.type === 'Work');
  const edu  = experience.filter(e => e.type === 'Education');
  const allTech = [...new Set(work.flatMap(e => e.technologies || []))];
  const totalYears = work.reduce((acc, e) => {
    const d = calcInspDuration(e.period);
    const m = d.match(/(\d+)y/);
    return acc + (m ? parseInt(m[1]) : 0);
  }, 0);
  const primaryEngines = allTech.filter(t => ['Unity', 'Unreal', 'React', 'Node.js'].includes(t)).join(', ') || 'Unity, Unreal';
  const xrTech = allTech.filter(t => ['HoloLens 2', 'AR Foundation', 'ARCore', 'MRTK3', 'OpenXR'].includes(t)).join(', ') || 'HoloLens, ARCore';
  const webTech = allTech.filter(t => ['React', 'Node.js', 'WebSocket', 'Next.js', 'Three.js'].includes(t)).join(', ') || 'React, Node.js';
  return (
    <div>
      <InspGroup icon="↑" iconColor="var(--pb-accent)" title="Career · Overview">
        <InspField label="Work roles"  value={`${work.length} positions`} />
        <InspField label="Education"   value={`${edu.length} entries`} />
        <InspField label="Total exp."  value={`${totalYears}+ years`} accent />
        <InspField label="Status"      value={about?.availability || 'Available Now'} accent />
      </InspGroup>
      <InspGroup icon="≡" iconColor="#888" title="Engines & Tools" defaultOpen={false}>
        <InspField label="Primary"  value={primaryEngines} />
        <InspField label="XR / AR"  value={xrTech} />
        <InspField label="Web"      value={webTech} />
      </InspGroup>
      <div style={{ padding: "8px 10px 4px", fontFamily: "var(--pb-mono)", fontSize: 9, color: "var(--pb-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        — click any card to inspect —
      </div>
    </div>
  );
}

const SKILL_CAT_COLORS = {
  Engine:    '#06b6d4',
  Language:  '#10b981',
  Platform:  '#a78bfa',
  Specialty: '#f59e0b',
};

function SkillRow({ name, category, core }) {
  const cc = SKILL_CAT_COLORS[category] || 'var(--pb-dim)';
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto",
      padding: "4px 10px", borderBottom: "1px solid var(--pb-line)",
      fontFamily: "var(--pb-mono)", fontSize: 10, gap: 8, alignItems: "center",
    }}>
      <span style={{ color: core ? "var(--pb-fg)" : "var(--pb-dim)" }}>{name}</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{
          fontSize: 8, padding: "1px 5px", borderRadius: 2, letterSpacing: "0.05em",
          background: `color-mix(in srgb,${cc} 15%,transparent)`,
          border: `1px solid color-mix(in srgb,${cc} 35%,transparent)`,
          color: cc,
        }}>{category.toUpperCase()}</span>
        {core && <span style={{ fontSize: 8, color: "var(--pb-accent)", fontWeight: 700, letterSpacing: "0.05em" }}>Core</span>}
      </div>
    </div>
  );
}

function deriveSkills(role, highlights) {
  const r = role.toLowerCase();
  const h = highlights.join(' ').toLowerCase();
  const skills = [];
  if (r.includes('unity'))                                                        skills.push({ name: 'C# / .NET',         category: 'Language',  core: true });
  if (r.includes('unity'))                                                        skills.push({ name: 'Unity Engine',       category: 'Engine',    core: true });
  if (r.includes('unreal'))                                                       skills.push({ name: 'Unreal Engine',      category: 'Engine',    core: true });
  if (r.includes('unreal'))                                                       skills.push({ name: 'C++',                category: 'Language',  core: true });
  if (r.includes('ar') || r.includes('hololens'))                                 skills.push({ name: 'AR / XR',            category: 'Platform',  core: false });
  if (h.includes('sports') || h.includes('fsx') || h.includes('calibration'))    skills.push({ name: 'Physics / Sim',      category: 'Specialty', core: false });
  if (h.includes('vial') || h.includes('logistica'))                              skills.push({ name: '3D Visualization',   category: 'Specialty', core: false });
  if (h.includes('arena') || h.includes('stardust'))                              skills.push({ name: 'Multiplayer / Net',  category: 'Specialty', core: false });
  return skills;
}

function InspectorExperienceItem({ item }) {
  const duration  = calcInspDuration(item.period);
  const engines   = item.technologies || [];
  const isCurrent = item.period.toLowerCase().includes('present');
  const isWork    = item.type === 'Work';
  const skills    = isWork ? deriveSkills(item.role, item.highlights) : [];

  const sep = item.period.indexOf(' - ');
  const startStr = sep !== -1 ? item.period.slice(0, sep) : item.period;
  const endStr   = sep !== -1 ? item.period.slice(sep + 3) : '';

  return (
    <div>
      {/* GameObject header */}
      <div style={{
        padding: "10px 10px 8px", borderBottom: "1px solid var(--pb-line)",
        fontFamily: "var(--pb-mono)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{
            width: 14, height: 14, borderRadius: 2, background: isWork ? "var(--pb-accent)" : "#3b82f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, color: "#000", flexShrink: 0,
          }}>{isWork ? "W" : "E"}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pb-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.company}</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, padding: "1px 6px", background: "var(--pb-line)", color: "var(--pb-dim)" }}>{item.type}</span>
          {isCurrent && <span style={{ fontSize: 9, padding: "1px 6px", background: "color-mix(in srgb,var(--pb-accent) 15%,transparent)", color: "var(--pb-accent)", fontWeight: 700 }}>ACTIVE</span>}
          {engines.map((e, i) => <span key={i} style={{ fontSize: 9, padding: "1px 6px", background: "var(--pb-line)", color: "var(--pb-dim)" }}>{e}</span>)}
        </div>
      </div>

      {/* Transform component */}
      <InspGroup icon="⊕" iconColor="#888" title="Transform" defaultOpen={false}>
        <InspField label="Start"    value={startStr} />
        <InspField label="End"      value={endStr || 'Present'} />
        <InspField label="Duration" value={duration || '—'} accent />
        <InspField label="Role"     value={item.role} />
      </InspGroup>

      {/* Skills component - only for work */}
      {isWork && skills.length > 0 && (
        <InspGroup icon="*" iconColor="var(--pb-accent)" title="Skills.cs">
          {skills.map((s, i) => <SkillRow key={i} name={s.name} category={s.category} core={s.core} />)}
        </InspGroup>
      )}

      {/* Shipped titles - richer than the scene chips */}
      {isWork && item.highlights.length > 0 && (
        <InspGroup icon="◈" iconColor="var(--pb-accent)" title="Shipped Prefabs">
          {item.highlights.map((h, i) => (
            <div key={i} style={{
              padding: "5px 10px", borderBottom: "1px solid var(--pb-line)",
              fontFamily: "var(--pb-mono)", fontSize: 10,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: "var(--pb-accent)", flexShrink: 0, opacity: 0.7 }} />
              <span style={{ color: "var(--pb-fg)", flex: 1 }}>{h}</span>
              <span style={{ color: "var(--pb-dim)", fontSize: 9 }}>.prefab</span>
            </div>
          ))}
        </InspGroup>
      )}

      {/* Education details */}
      {!isWork && (
        <InspGroup icon="▣" iconColor="#3b82f6" title="Degree Component">
          <InspField label="Program"     value={item.company} />
          <InspField label="Institution" value={item.role} />
          <InspField label="Period"      value={item.period} />
          {item.highlights[0] && <InspField label="Location" value={item.highlights[0]} />}
        </InspGroup>
      )}
    </div>
  );
}

function InspectorStack({ technologies }) {
  const cats = {};
  (technologies || []).forEach(t => {
    const c = t.category || 'tools';
    cats[c] = (cats[c] || 0) + 1;
  });
  const catMeta = [
    { key: 'engines',   icon: '!', color: '#3b82f6', label: 'Engines' },
    { key: 'languages', icon: '\u039B', color: '#f59e0b', label: 'Languages' },
    { key: 'web',       icon: '\u2295', color: '#10b981', label: 'Web' },
    { key: 'xr3d',      icon: '\u25B3', color: '#8b5cf6', label: 'XR/3D' },
    { key: 'tools',     icon: '+', color: '#ec4899', label: 'Tools' },
  ];
  const total = (technologies || []).length;
  const catCount = Object.keys(cats).length;
  return (
    <div>
      <InspGroup icon="≡" iconColor="var(--pb-accent)" title="Graph Statistics">
        <InspField label="Categories" value={String(catCount)} />
        <InspField label="Total items" value={total > 0 ? String(total) : '40+'} accent />
      </InspGroup>
      {catMeta.map(m => (
        <InspGroup key={m.key} icon={m.icon} iconColor={m.color} title={m.label} defaultOpen={false}>
          <InspField label="Count" value={String(cats[m.key] || 0)} />
        </InspGroup>
      ))}
    </div>
  );
}

function InspectorContact({ about }) {
  const email    = about?.email || '';
  const github   = about?.socials?.find(s => s.name === 'GitHub');
  const linkedin = about?.socials?.find(s => s.name === 'LinkedIn');
  const insta    = about?.socials?.find(s => s.name === 'Instagram');
  return (
    <div>
      <InspGroup icon="○" iconColor="var(--pb-accent)" title="Availability">
        <InspField label="Status"     value={about?.availability || 'Available Now'} accent />
        <InspField label="Start date" value={about?.availabilityStart || 'Immediately'} />
      </InspGroup>
      <InspGroup icon="~" iconColor="#0a66c2" title="Channels">
        {email    && <InspField label="Email"     value={`${email.split('@')[0]}@…`} copyValue={email} href={`mailto:${email}`} />}
        {github   && <InspField label="GitHub"    value={github.handle}   href={github.url} />}
        {linkedin && <InspField label="LinkedIn"  value={linkedin.handle} href={linkedin.url} />}
        {insta    && <InspField label="Instagram" value={insta.handle}    href={insta.url} />}
      </InspGroup>
      <InspGroup icon="◎" iconColor="#10b981" title="Engagement Types">
        <InspField label="Roles" value={about?.availabilityRoles || 'Full-time, contract'} />
        <InspField label="Focus" value={about?.availabilityFocus || 'Real problems'} />
      </InspGroup>
    </div>
  );
}

function InspectorServer() {
  const [stats, setStats] = React.useState(null);
  React.useEffect(() => {
    const base = process.env.REACT_APP_API_URL || '/api';
    fetch(`${base}/homelab`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!Array.isArray(data)) return;
        setStats({
          total:  data.length,
          online: data.filter(s => s.status === 'online').length,
          local:  data.filter(s => s.status === 'local').length,
          cats:   new Set(data.map(s => s.category).filter(Boolean)).size,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <InspGroup icon="⬡" iconColor="var(--pb-accent)" title="Network · Homelab">
        <InspField label="Services"    value={stats ? String(stats.total)  : '…'} />
        <InspField label="Online"      value={stats ? String(stats.online) : '…'} accent />
        <InspField label="Local only"  value={stats ? String(stats.local)  : '…'} />
        <InspField label="Categories"  value={stats ? String(stats.cats)   : '…'} />
      </InspGroup>
      <InspGroup icon="◎" iconColor="#0a66c2" title="Infrastructure" defaultOpen={false}>
        <InspField label="Runtime"  value="Docker + systemd" />
        <InspField label="Access"   value="Caddy + Tailscale" />
        <InspField label="Uptime"   value="24 / 7" accent />
      </InspGroup>
      <InspGroup icon="~" iconColor="#10b981" title="Self-Hosted" defaultOpen={false}>
        <InspField label="Git"    value="Gitea" />
        <InspField label="Media"  value="Jellyfin" />
        <InspField label="Arr"    value="Sonarr / Radarr" />
      </InspGroup>
    </div>
  );
}

function InspectorBlog() {
  return (
    <div>
      <InspGroup icon="//" iconColor="#06b6d4" title="Blog · Dev Log">
        <InspField label="Sources"  value="Medium RSS + Custom" />
        <InspField label="Feed"     value="Auto-synced · 30 min" />
        <InspField label="Config"   value="MEDIUM_USERNAME env" accent />
      </InspGroup>
      <InspGroup icon="~" iconColor="var(--pb-accent)" title="Custom Posts" defaultOpen={false}>
        <InspField label="Manage"   value="/dashboard → Blog" />
        <InspField label="Formats"  value="Markdown / Rich Text" />
      </InspGroup>
    </div>
  );
}

function InspectorApps() {
  return (
    <div>
      <InspGroup icon="[]" iconColor="#8b5cf6" title="Apps · Distribution">
        <InspField label="Stores"   value="Google Play + App Store" />
        <InspField label="Sync"     value="On demand from dashboard" accent />
        <InspField label="Data"     value="Rating, installs, screenshots" />
      </InspGroup>
      <InspGroup icon="*" iconColor="#10b981" title="Auto-Sync" defaultOpen={false}>
        <InspField label="Play Store" value="google-play-scraper" />
        <InspField label="App Store"  value="iTunes Lookup API" />
        <InspField label="Trigger"    value="Dashboard → Sync button" />
      </InspGroup>
    </div>
  );
}

function InspectorPlugins() {
  return (
    <div>
      <InspGroup icon="<>" iconColor="#f59e0b" title="Plugins · Asset Store">
        <InspField label="Stores"   value="Unity + Unreal" />
        <InspField label="Manage"   value="/dashboard → Plugins" />
        <InspField label="Data"     value="Price, rating, screenshots" accent />
      </InspGroup>
      <InspGroup icon="%" iconColor="#3b82f6" title="Platforms" defaultOpen={false}>
        <InspField label="Unity"    value="C# · Asset Store" />
        <InspField label="Unreal"   value="C++ · Marketplace" />
      </InspGroup>
    </div>
  );
}

function InspectorCV({ about }) {
  const cv = about?.cv || {};
  return (
    <div>
      <InspGroup icon="≡" iconColor="var(--pb-accent)" title={`CV · ${cv.year || '2025'}`}>
        <InspField label="Format" value="PDF" />
        <InspField label="Pages"  value={cv.pages || '1'} />
        <InspField label="Size"   value={cv.size  || '—'} />
      </InspGroup>
      <InspGroup icon="✓" iconColor="#10b981" title="Download">
        <div style={{ padding: "10px", textAlign: "center" }}>
          <a href={cv.path || '/CV-Danilo-Vanegas-2025.pdf'} download style={{
            background: "var(--pb-accent)", color: "#000", padding: "8px 16px",
            fontFamily: "var(--pb-mono)", fontSize: 10, fontWeight: 600,
            textDecoration: "none", display: "inline-block", borderRadius: 2,
            cursor: "pointer",
          }}>Download</a>
        </div>
      </InspGroup>
    </div>
  );
}

function PortfolioShell({ children, about = null, projects = [], experience = [], technologies = [], selectedProject, setSelectedProject, selectedExperience }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const [bottomTab, setBottomTab] = React.useState("console");
  const [sceneTab, setSceneTab] = React.useState("Scene");
  const [hier, setHier] = React.useState({ projects: true, experience: false, lighting: false });
  const [renderMode, setRenderMode] = React.useState("shaded");
  const [playing, setPlaying] = React.useState(false);
  const [hSearch, setHSearch] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(null);
  const [showExitModal, setShowExitModal] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = windowWidth < 900;

  // Fullscreen API
  React.useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' });
  const [logs, setLogs] = React.useState(() => [
    { id: 'boot-1', type: 'ok',   msg: '> portfolio_main  Awake ()', timestamp: ts() },
    { id: 'boot-2', type: 'info', msg: '> SceneManager    LoadScene("01_intro")', timestamp: ts() },
    { id: 'boot-3', type: 'info', msg: '> API             Connecting to backend…', timestamp: ts() },
  ]);

  const shellEmit = React.useCallback((type, msg) => {
    setLogs(prev => [...prev.slice(-48), { id: Math.random().toString(36).slice(2), type, msg, timestamp: ts() }]);
  }, []);

  // Route mapping
  const routePath = location.pathname || '/';
  const routeMap = {
    '/': 'intro',
    '/about': 'about',
    '/projects': 'projects',
    '/experience': 'experience',
    '/stack': 'stack',
    '/contact': 'contact',
    '/cv': 'cv',
    '/server': 'server',
    '/blog': 'blog',
    '/apps': 'apps',
    '/plugins': 'plugins',
  };
  const scene = routeMap[routePath] || 'intro';

  const dark = theme === 'dark';
  const accentMap = {
    lime: ["oklch(82% 0.20 130)", "oklch(50% 0.18 130)"],
    cyan: ["oklch(80% 0.16 200)", "oklch(48% 0.17 200)"],
    amber: ["oklch(82% 0.18 80)", "oklch(55% 0.17 80)"],
    magenta: ["oklch(75% 0.22 340)", "oklch(48% 0.20 340)"],
  };
  const [accentDark, accentLight] = accentMap[accent] || accentMap.lime;

  const vars = dark ? {
    "--pb-bg": "#1a1a1c", "--pb-panel": "#222226", "--pb-panel-h": "#2c2c30",
    "--pb-fg": "#e8e6e1", "--pb-dim": "#888880", "--pb-line": "#34343a",
    "--pb-accent": accentDark, "--pb-grid": "rgba(255,255,255,.04)",
  } : {
    "--pb-bg": "#cfcec8", "--pb-panel": "#e6e4dd", "--pb-panel-h": "#d8d6cf",
    "--pb-fg": "#1a1a18", "--pb-dim": "#666660", "--pb-line": "#b8b6af",
    "--pb-accent": accentLight, "--pb-grid": "rgba(0,0,0,.06)",
  };

  // Log scene changes
  React.useEffect(() => {
    shellEmit('info', `> SceneManager    LoadScene("${
      { intro:'01_intro', about:'02_about', projects:'03_projects',
        experience:'04_trajectory', stack:'05_stack', contact:'06_contact', cv:'07_cv',
        server:'08_server', blog:'09_blog', apps:'10_apps', plugins:'11_plugins' }[scene] || scene
    }")`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Log when API data arrives
  React.useEffect(() => {
    if (projects.length > 0) shellEmit('ok', `> API             ${projects.length} project prefabs loaded`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  React.useEffect(() => {
    if (experience.length > 0) shellEmit('ok', `> API             ${experience.length} timeline entries loaded`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.length]);

  // Log play mode changes (skip initial mount)
  const playMountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!playMountedRef.current) { playMountedRef.current = true; return; }
    if (playing) shellEmit('ok',   '> Application     EnterPlayMode()');
    else         shellEmit('info', '> Application     ExitPlayMode()');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Menu logic
  React.useEffect(() => {
    if (openMenu === null) return;
    const onDown = (e) => {
      if (!e.target.closest?.("[data-pb-menu]")) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenu]);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("pb-hier-search")?.focus();
        return;
      }
      if (e.key === "Escape") { setOpenMenu(null); setShowExitModal(false); return; }
      // F = toggle fullscreen (only when not typing)
      if (e.key === "f" && !e.target.closest("input, button, textarea, [contenteditable]")) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      // Space = toggle play (only when not typing in an input)
      if (e.key === " " && !e.target.closest("input, button, textarea, [contenteditable]")) {
        e.preventDefault();
        setPlaying(p => {
          if (!p) setSceneTab("Game");
          else     setSceneTab("Scene");
          return !p;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = (s) => !hSearch || s.toLowerCase().includes(hSearch.toLowerCase());
  const filteredProjects    = React.useMemo(() => projects.filter(p  => matches(p.name    || p.title || '')), [projects,    hSearch]);  // eslint-disable-line react-hooks/exhaustive-deps
  const filteredExperience  = React.useMemo(() => experience.filter(e => matches(e.company || '')),           [experience,  hSearch]);  // eslint-disable-line react-hooks/exhaustive-deps

  const sceneLabel = {
    intro: "01_intro.scene",
    about: "02_about.scene",
    projects: selectedProject ? `03_projects · ${selectedProject.name || selectedProject.title}` : "03_projects.scene",
    experience: "04_trajectory.scene",
    stack: "05_stack.scene",
    contact: "06_contact.scene",
    cv: "07_cv.scene",
    server: "08_server.scene",
    blog: "09_blog.scene",
    apps: "10_apps.scene",
    plugins: "11_plugins.scene",
  }[scene] || "untitled.scene";

  return (
    <div style={{
      ...vars,
      "--pb-mono": "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
      "--pb-display": "'Space Grotesk', system-ui, sans-serif",
      background: "var(--pb-bg)", color: "var(--pb-fg)",
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "var(--pb-mono)", overflow: "hidden",
    }}>
      {/* Title bar */}
      <div style={{
        height: 30, background: "var(--pb-panel)", borderBottom: "1px solid var(--pb-line)",
        display: "flex", alignItems: "center", padding: "0 12px", gap: 14, fontSize: 11,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { c: "#ff5f56", title: "Quit",       action: () => setShowExitModal(true) },
            { c: "#ffbd2e", title: "Minimize",   action: () => {} },
            { c: "#27c93f", title: "Fullscreen", action: toggleFullscreen },
          ].map(({ c, title, action }) => (
            <button
              key={c}
              title={title}
              onClick={action}
              style={{
                width: 12, height: 12, borderRadius: "50%", background: c,
                border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
                transition: "filter 0.12s",
              }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.25)"}
              onMouseLeave={e => e.currentTarget.style.filter = "none"}
            />
          ))}
        </div>
        <span style={{ color: "var(--pb-dim)" }}>{isMobile ? (about?.name || 'portfolio') : (about?.projectFilename || 'portfolio.unityproj')}</span>
        {!isMobile && <div style={{ display: "flex", gap: 0, marginLeft: 16, color: "var(--pb-dim)", fontSize: 11, position: "relative" }} data-pb-menu>
          {[
            { l: "File", items: [
              { l: "Open CV (PDF)", a: () => window.open(about?.cv?.path || '/CV-Danilo-Vanegas-2025.pdf', "_blank") },
              { l: "Email me",   a: () => { window.location.href = `mailto:${about?.email || ''}`; } },
              { l: "Copy email", a: () => navigator.clipboard?.writeText(about?.email || '') },
              { l: "—" },
              { l: "Export as JSON", a: () => {
                const blob = new Blob([JSON.stringify({ about, projects, experience }, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob); a.download = `${about?.name?.toLowerCase().replace(' ', '-') || 'portfolio'}.json`; a.click();
              }},
            ]},
            { l: "Edit", items: [
              { l: "Find in Hierarchy… (⌘K)", a: () => document.getElementById("pb-hier-search")?.focus() },
              { l: "Toggle theme", a: toggleTheme },
              { l: "Reset view", a: () => { navigate('/'); setSceneTab("Scene"); } },
            ]},
            { l: "GameObject", items: projects.map((p) => (
              { l: `Select · ${p.name || p.title}`, a: () => { setSelectedProject(p); navigate('/projects'); } }
            ))},
            { l: "Window", items: [
              { l: "Scene",    a: () => setSceneTab("Scene") },
              { l: "Game",     a: () => setSceneTab("Game") },
              { l: "Animator", a: () => setSceneTab("Animator") },
              { l: "Profiler", a: () => setSceneTab("Profiler") },
              { l: "Console",  a: () => setBottomTab("console") },
              { l: "—" },
              { l: "Server ↗",  a: () => navigate('/server') },
            ]},
            { l: "Help", items: about?.socials?.map(s => ({
                l: `${s.name} ↗`, a: () => window.open(s.url, "_blank"),
              })) || [
              { l: "GitHub ↗",    a: () => window.open("https://github.com/Playyer96", "_blank") },
              { l: "LinkedIn ↗",  a: () => window.open("https://linkedin.com/in/danisvs", "_blank") },
            ]},
          ].map((m, idx) => (
            <div key={m.l} style={{ position: "relative" }}>
              <button
                onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                onMouseEnter={() => { if (openMenu !== null) setOpenMenu(idx); }}
                style={{
                  background: openMenu === idx ? "var(--pb-panel-h)" : "transparent",
                  border: "none", color: "var(--pb-dim)", padding: "4px 10px",
                  fontFamily: "var(--pb-mono)", fontSize: 11, cursor: "pointer",
                }}>{m.l}</button>
              {openMenu === idx && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, minWidth: 220,
                  background: "var(--pb-panel)", border: "1px solid var(--pb-line)",
                  boxShadow: "0 8px 24px rgba(0,0,0,.4)", zIndex: 200, padding: "4px 0",
                }}>
                  {m.items.map((it, j) => it.l === "—" ? (
                    <div key={j} style={{ height: 1, background: "var(--pb-line)", margin: "4px 0" }} />
                  ) : (
                    <button key={j}
                      onClick={() => { it.a?.(); setOpenMenu(null); }}
                      style={{
                        display: "block", width: "100%", padding: "5px 14px", textAlign: "left",
                        background: "transparent", border: "none", color: "var(--pb-fg)",
                        fontFamily: "var(--pb-mono)", fontSize: 11, cursor: "pointer",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--pb-accent)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      {it.l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center", fontSize: 11 }}>
          {!isMobile && <span style={{ color: "var(--pb-accent)" }}>● {about?.availability?.toLowerCase() || 'available now'}</span>}
          <div style={{ position: "relative" }} data-pb-menu>
            <button
              onClick={() => setOpenMenu(openMenu === "settings" ? null : "settings")}
              title="Settings"
              style={{
                background: openMenu === "settings" ? "var(--pb-panel-h)" : "transparent",
                border: "1px solid var(--pb-line)", color: "var(--pb-dim)", padding: "2px 8px",
                fontFamily: "var(--pb-mono)", fontSize: 10, cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              {dark ? "◑" : "○"}
            </button>
            {openMenu === "settings" && (
              <div style={{
                position: "absolute", top: "100%", right: 0, minWidth: 180,
                background: "var(--pb-panel)", border: "1px solid var(--pb-line)",
                boxShadow: "0 8px 24px rgba(0,0,0,.4)", zIndex: 200, padding: "10px 14px",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ color: "var(--pb-dim)", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--pb-mono)" }}>Theme</span>
                    <button
                      onClick={toggleTheme}
                      style={{
                        padding: "4px 10px", background: "var(--pb-panel-h)", color: "var(--pb-fg)",
                        border: "1px solid var(--pb-line)", cursor: "pointer", fontSize: 11,
                        fontFamily: "var(--pb-mono)", textAlign: "left",
                      }}
                    >
                      {theme === "dark" ? "◐ Dark" : "○ Light"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ color: "var(--pb-dim)", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--pb-mono)" }}>Accent</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {['lime', 'cyan', 'amber', 'magenta'].map(color => (
                        <button
                          key={color}
                          onClick={() => setAccent(color)}
                          style={{
                            width: 22, height: 22, borderRadius: 2,
                            border: accent === color ? "2px solid var(--pb-fg)" : "2px solid transparent",
                            cursor: "pointer",
                            backgroundColor: {
                              lime: '#a8ff60',
                              cyan: '#60d8ff',
                              amber: '#ffc060',
                              magenta: '#ff60c8',
                            }[color],
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        height: 38, background: "var(--pb-panel)", borderBottom: "1px solid var(--pb-line)",
        display: "flex", alignItems: "center", padding: "0 12px", gap: 8, fontSize: 11, flexShrink: 0,
      }}>
        {!isMobile && <>
          <button
            onClick={() => {
              if (playing) { setPlaying(false); setSceneTab("Scene"); }
              else { setPlaying(true); setSceneTab("Game"); }
            }}
            style={{
              padding: "4px 12px", background: playing ? "var(--pb-line)" : "var(--pb-accent)",
              color: playing ? "var(--pb-fg)" : "#000",
              border: "none", cursor: "pointer", fontFamily: "var(--pb-mono)", fontSize: 11, fontWeight: 700,
            }}>{playing ? "■ STOP" : "▶ PLAY"}</button>
          <button
            onClick={() => setPlaying(false)}
            style={{
              padding: "4px 10px", background: "transparent", color: "var(--pb-fg)",
              border: "1px solid var(--pb-line)", cursor: "pointer", fontFamily: "var(--pb-mono)", fontSize: 11,
            }}>||</button>
        </>}
        <button
          onClick={() => {
            const order = ["intro","about","projects","experience","stack","blog","apps","plugins","contact","cv","server"];
            const i = order.indexOf(scene);
            navigate('/' + (order[(i + 1) % order.length] === 'intro' ? '' : order[(i + 1) % order.length]));
          }}
          title="Step to next scene"
          style={{
            padding: "4px 10px", background: "transparent", color: "var(--pb-fg)",
            border: "1px solid var(--pb-line)", cursor: "pointer", fontFamily: "var(--pb-mono)", fontSize: 11,
          }}>›</button>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--pb-dim)", fontSize: 10 }}>{isMobile ? '' : 'scene'}</span>
        <span style={{ color: "var(--pb-fg)", padding: "2px 10px", background: "var(--pb-line)", fontSize: isMobile ? 10 : 11, maxWidth: isMobile ? 160 : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sceneLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Hierarchy — hidden on mobile */}
        {!isMobile && <div style={{
          width: 240, borderRight: "1px solid var(--pb-line)",
          background: "var(--pb-panel)", display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{
            height: 28, padding: "0 10px", display: "flex", alignItems: "center",
            borderBottom: "1px solid var(--pb-line)", fontSize: 11, color: "var(--pb-fg)",
            background: "var(--pb-panel-h)", fontWeight: 600, gap: 6,
          }}>
            <span>Hierarchy</span>
            <input id="pb-hier-search" value={hSearch} onChange={(e) => setHSearch(e.target.value)}
              placeholder="⌕ search (⌘K)"
              style={{
                marginLeft: "auto", width: 130, background: "var(--pb-bg)",
                border: "1px solid var(--pb-line)", color: "var(--pb-fg)",
                fontFamily: "var(--pb-mono)", fontSize: 10, padding: "2px 6px", outline: "none",
              }} />
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "6px 0" }}>
            <HItem icon="▾" label="portfolio_main" />
            <HItem icon="◆" label="01_intro" depth={1}
              active={scene === "intro"}
              onClick={() => navigate('/')} />
            <HItem icon="◆" label="02_about" depth={1}
              active={scene === "about"}
              onClick={() => navigate('/about')} />
            <HItem
              icon={hier.projects ? "▾" : "▸"}
              label="03_projects" depth={1}
              badge={String(projects.length)}
              active={scene === "projects"}
              onClick={() => { setHier(h => ({...h, projects: !h.projects})); navigate('/projects'); }} />
            {hier.projects && filteredProjects.map((p, i) => (
              <HItem key={i} icon="◆" label={p.name || p.title} depth={2}
                color={p.color}
                active={scene === "projects" && selectedProject?.id === p.id}
                onClick={() => { setSelectedProject(p); navigate('/projects'); }} />
            ))}
            <HItem
              icon={hier.experience ? "▾" : "▸"}
              label="04_trajectory" depth={1}
              badge={String(experience.length)}
              active={scene === "experience"}
              onClick={() => { setHier(h => ({...h, experience: !h.experience})); navigate('/experience'); }} />
            {hier.experience && filteredExperience.map((e, i) => (
              <HItem key={i} icon="◇" label={e.company} depth={2}
                onClick={() => navigate('/experience')} />
            ))}
            <HItem icon="◆" label="05_stack" depth={1}
              active={scene === "stack"}
              onClick={() => navigate('/stack')} />
            <HItem icon="◆" label="06_contact" depth={1}
              active={scene === "contact"}
              onClick={() => navigate('/contact')} />
            <HItem icon="⬡" label="08_server" depth={1}
              active={scene === "server"}
              onClick={() => navigate('/server')} />
            <HItem icon="◆" label="09_blog" depth={1}
              active={scene === "blog"}
              onClick={() => navigate('/blog')} />
            <HItem icon="◆" label="10_apps" depth={1}
              active={scene === "apps"}
              onClick={() => navigate('/apps')} />
            <HItem icon="◆" label="11_plugins" depth={1}
              active={scene === "plugins"}
              onClick={() => navigate('/plugins')} />

          </div>
        </div>}

        {/* Center column: scene tabs + viewport + bottom panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Scene tabs — hidden on mobile */}
          {!isMobile && <div style={{
            height: 26, display: "flex", borderBottom: "1px solid var(--pb-line)",
            background: "var(--pb-panel)", fontSize: 10, flexShrink: 0,
          }}>
            {["Scene", "Game", "Animator", "Asset Store", "Profiler"].map((t) => (
              <button key={t} onClick={() => setSceneTab(t)} style={{
                padding: "0 14px", display: "flex", alignItems: "center", gap: 6,
                background: sceneTab === t ? "var(--pb-bg)" : "transparent",
                borderRight: "1px solid var(--pb-line)", border: "none",
                color: sceneTab === t ? "var(--pb-fg)" : "var(--pb-dim)",
                fontFamily: "var(--pb-mono)", fontSize: 10, cursor: "pointer",
              }}>
                <span style={{
                  width: 8, height: 8, background: sceneTab === t ? "var(--pb-accent)" : "var(--pb-line)",
                }} />
                {t}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", padding: "0 6px", gap: 2 }}>
              {["shaded","wire","uv"].map((m) => (
                <button key={m} onClick={() => setRenderMode(m)} style={{
                  background: renderMode === m ? "var(--pb-accent)" : "transparent",
                  color: renderMode === m ? "#000" : "var(--pb-dim)",
                  border: "none", padding: "2px 8px", fontFamily: "var(--pb-mono)",
                  fontSize: 10, cursor: "pointer",
                }}>{m}</button>
              ))}
            </div>
          </div>}

          {/* Viewport */}
          <div style={{
            flex: 1, position: "relative", minHeight: 0, background: "var(--pb-bg)",
            filter: !isMobile && renderMode === "wire" ? "invert(0.04) contrast(1.4) saturate(0)" :
                    !isMobile && renderMode === "uv" ? "hue-rotate(60deg) saturate(2)" : "none",
            paddingBottom: isMobile ? 56 : 0,
          }}>
            {renderMode === "wire" && (
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0 7px, rgba(255,255,255,.04) 7px 8px), repeating-linear-gradient(90deg, transparent 0 7px, rgba(255,255,255,.04) 7px 8px)",
              }} />
            )}
            {playing && (
              <div style={{
                position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                background: "#c00", color: "#fff", padding: "2px 10px",
                fontFamily: "var(--pb-mono)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.1em", zIndex: 10, animation: "pb-pulse 1s infinite",
              }}>● REC · RUNTIME</div>
            )}
            {sceneTab === "Scene" && children}

            {sceneTab === "Game" && (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {children}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", border: "2px solid var(--pb-accent)", zIndex: 20 }} />
                <div style={{ position: "absolute", top: 8, left: 10, zIndex: 21, fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-accent)", letterSpacing: "0.1em" }}>GAME VIEW</div>
                <div style={{ position: "absolute", top: 8, right: 10, zIndex: 21, fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-dim)" }}>1920×1080</div>
              </div>
            )}

            {sceneTab === "Animator" && <AnimatorView experience={experience} />}

            {sceneTab === "Asset Store" && (
              <AssetStoreView
                projects={projects}
                onSelect={(p) => { setSelectedProject(p); navigate('/projects'); }}
              />
            )}

            {sceneTab === "Profiler" && <ProfilerView />}

            {/* Scene viewport HUD */}
            {(sceneTab === "Scene" || sceneTab === "Game") && !playing && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}>
                <div style={{
                  position: "absolute", top: 8, left: 10,
                  fontFamily: "var(--pb-mono)", fontSize: 9, color: "var(--pb-dim)",
                  letterSpacing: "0.07em", background: "var(--pb-bg)",
                  padding: "2px 8px", border: "1px solid var(--pb-line)", opacity: 0.65,
                }}>{sceneLabel}</div>
                <div style={{
                  position: "absolute", top: 8, right: 10,
                  fontFamily: "var(--pb-mono)", fontSize: 9, color: "var(--pb-dim)", letterSpacing: "0.06em",
                }}>SPACE to play</div>
                <div style={{
                  position: "absolute", bottom: 8, left: 10,
                  fontFamily: "var(--pb-mono)", fontSize: 9, color: "var(--pb-dim)", opacity: 0.45, letterSpacing: "0.04em",
                }}>X: 0.000 &nbsp; Y: 0.000 &nbsp; Z: 1.000</div>
                <div style={{
                  position: "absolute", bottom: 8, right: 10,
                  fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-dim)", opacity: 0.35,
                }}>⊕</div>
              </div>
            )}
          </div>

          {/* Bottom dock — hidden on mobile */}
          {!isMobile && <div style={{
            height: 200, borderTop: "1px solid var(--pb-line)",
            display: "flex", flexDirection: "column", background: "var(--pb-panel)", flexShrink: 0,
          }}>
            <div style={{
              height: 26, display: "flex", alignItems: "center",
              borderBottom: "1px solid var(--pb-line)", fontSize: 10, gap: 0,
              background: "var(--pb-panel-h)",
            }}>
              {[
                { k: "console", l: "Console", n: logs.length },
                { k: "profiler", l: "Profiler", n: 1 },
                { k: "assets", l: "Asset Browser", n: projects.length },
              ].map((t) => (
                <button key={t.k} onClick={() => setBottomTab(t.k)} style={{
                  padding: "0 14px", height: "100%", display: "flex", alignItems: "center", gap: 6,
                  background: bottomTab === t.k ? "var(--pb-panel)" : "transparent",
                  borderRight: "1px solid var(--pb-line)", border: "none",
                  color: bottomTab === t.k ? "var(--pb-fg)" : "var(--pb-dim)",
                  fontFamily: "var(--pb-mono)", fontSize: 10, cursor: "pointer", fontWeight: 600,
                }}>
                  {t.l}
                  <span style={{ background: "var(--pb-line)", padding: "1px 5px", fontSize: 9 }}>{t.n}</span>
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ color: "var(--pb-dim)", padding: "0 12px", fontSize: 10 }}>
                {bottomTab === "console" && `${logs.length} messages · 0 errors · 0 warnings`}
                {bottomTab === "profiler" && "live · 120 fps"}
                {bottomTab === "assets" && `${projects.length} prefabs`}
              </span>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "var(--pb-panel)", padding: bottomTab === "profiler" ? 0 : 0 }}>
              {bottomTab === "console" && (
                <div style={{ fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-dim)", padding: 12 }}>
                  {logs.length === 0 ? (
                    <div style={{ color: "var(--pb-dim)", fontStyle: "italic" }}>No logs yet. Navigate to a scene.</div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={log.id || i} style={{
                        marginBottom: 3, display: "flex", gap: 10, alignItems: "baseline",
                        color: log.type === 'error' ? '#ff6b6b' : log.type === 'ok' ? 'var(--pb-accent)' : 'inherit',
                      }}>
                        <span style={{ color: "color-mix(in srgb, var(--pb-accent) 50%, var(--pb-dim))", flexShrink: 0, fontSize: 9 }}>{log.timestamp}</span>
                        <span>{log.msg || log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
              {bottomTab === "profiler" && <BottomProfiler />}
              {bottomTab === "assets" && <BottomAssets projects={projects} navigate={navigate} setSelectedProject={setSelectedProject} />}
            </div>
          </div>}
        </div>

        {/* Inspector — hidden on mobile */}
        {!isMobile && <div style={{
          width: 340, borderLeft: "1px solid var(--pb-line)",
          background: "var(--pb-panel)", display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{
            height: 28, padding: "0 10px", display: "flex", alignItems: "center", gap: 6,
            borderBottom: "1px solid var(--pb-line)", fontSize: 11, color: "var(--pb-fg)",
            background: "var(--pb-panel-h)", fontWeight: 600,
          }}>
            <span>Inspector</span>
            <span style={{ marginLeft: "auto", color: "var(--pb-dim)", fontSize: 10 }}>◇ ⊕</span>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {scene === "intro"       && <InspectorIntro about={about} />}
            {scene === "about"       && <InspectorAbout about={about} />}
            {scene === "tweaks"      && <TweaksPanel accent={accent} accentDark={accentDark} accentLight={accentLight} onSetAccent={setAccent} />}
            {scene === "experience"  && selectedExperience && <InspectorExperienceItem item={selectedExperience} />}
            {scene === "experience"  && !selectedExperience && <InspectorExperience experience={experience} about={about} />}
            {scene === "stack"       && <InspectorStack technologies={technologies} />}
            {scene === "contact"     && <InspectorContact about={about} />}
            {scene === "cv"          && <InspectorCV about={about} />}
            {scene === "server"      && <InspectorServer />}
            {scene === "blog"        && <InspectorBlog />}
            {scene === "apps"        && <InspectorApps />}
            {scene === "plugins"     && <InspectorPlugins />}
          </div>
          <div style={{ borderTop: "1px solid var(--pb-line)", background: "var(--pb-panel)", padding: 16, textAlign: "center" }}>
            <div style={{ color: "var(--pb-dim)", fontFamily: "var(--pb-mono)", fontSize: 11 }}>Drag a brief here, or</div>
            <a href={`mailto:${about?.email || 'vanegasdanilo7@gmail.com'}`} style={{
              color: "var(--pb-accent)", textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: 6,
            }}>
              + start a conversation
            </a>
          </div>
        </div>}
      </div>

      {/* Status bar — hidden on mobile */}
      {!isMobile && <div style={{
        height: 22, background: "var(--pb-panel)", borderTop: "1px solid var(--pb-line)",
        display: "flex", alignItems: "center", padding: "0 12px", fontSize: 10, gap: 16, flexShrink: 0,
      }}>
        <span style={{ color: playing ? "#c00" : "var(--pb-accent)" }}>● {playing ? "playing" : "ready"}</span>
        <span style={{ color: "var(--pb-dim)" }}>portfolio.v3 · {sceneLabel}</span>
        <span style={{ color: "var(--pb-dim)" }}>
          {projects.length} prefabs · {experience.length} timeline tracks
        </span>
        <span style={{ marginLeft: "auto", color: "var(--pb-dim)" }}>render: {renderMode}</span>
        <span style={{ color: "var(--pb-dim)" }}>· main · 0 conflicts</span>
        <a href={about?.socials?.find(s => s.name === 'GitHub')?.url || 'https://github.com/Playyer96'} target="_blank" rel="noreferrer"
          style={{ color: "var(--pb-fg)", textDecoration: "none" }}>Unity 6 / Next 15 ↗</a>
      </div>}

      {/* ── Mobile bottom navigation ──────────────────────────────────────── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 56,
          background: "var(--pb-panel)", borderTop: "1px solid var(--pb-line)",
          display: "flex", alignItems: "stretch", zIndex: 50,
          fontFamily: "var(--pb-mono)",
          overflowX: "auto", overflowY: "hidden",
          scrollbarWidth: "none",
        }}>
          {[
            { path: '/',           label: 'Home',     icon: '⌂' },
            { path: '/about',      label: 'About',    icon: '○' },
            { path: '/projects',   label: 'Projects', icon: '◆' },
            { path: '/experience', label: 'Work',     icon: '↑' },
            { path: '/stack',      label: 'Stack',    icon: '≡' },
            { path: '/blog',       label: 'Blog',     icon: '//' },
            { path: '/apps',       label: 'Apps',     icon: '[]' },
            { path: '/plugins',    label: 'Plugins',  icon: '<>' },
            { path: '/contact',    label: 'Contact',  icon: '~' },
            { path: '/server',     label: 'Server',   icon: '⬡' },
          ].map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  flex: "0 0 auto", minWidth: 52, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 2, border: "none", cursor: "pointer",
                  background: "transparent",
                  color: isActive ? "var(--pb-accent)" : "var(--pb-dim)",
                  borderTop: isActive ? "2px solid var(--pb-accent)" : "2px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                  padding: "4px 4px 0",
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
                <span style={{ fontSize: 8, letterSpacing: "0.04em", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Exit confirmation modal ───────────────────────────────────────── */}
      {showExitModal && (
        <div
          onClick={() => setShowExitModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--pb-panel)", border: "1px solid var(--pb-line)",
              width: 340, fontFamily: "var(--pb-mono)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Modal title bar */}
            <div style={{
              height: 28, background: "var(--pb-panel-h)", borderBottom: "1px solid var(--pb-line)",
              display: "flex", alignItems: "center", padding: "0 12px", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "var(--pb-dim)", letterSpacing: "0.06em" }}>
                portfolio.exe — confirm quit
              </span>
            </div>

            {/* Modal body */}
            <div style={{ padding: "22px 20px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--pb-fg)", marginBottom: 8, fontFamily: "var(--pb-display)", letterSpacing: "-0.01em" }}>
                Quit Portfolio?
              </div>
              <div style={{ fontSize: 11, color: "var(--pb-dim)", lineHeight: 1.65, marginBottom: 22 }}>
                Any unsaved changes will be lost.<br />
                Are you sure you want to exit?
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowExitModal(false)}
                  style={{
                    padding: "6px 18px", background: "var(--pb-panel-h)", color: "var(--pb-fg)",
                    border: "1px solid var(--pb-line)", cursor: "pointer",
                    fontFamily: "var(--pb-mono)", fontSize: 11, letterSpacing: "0.04em",
                  }}
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    // Try closing the tab; fall back to opening GitHub profile
                    const closed = window.close();
                    if (closed === undefined) {
                      window.location.href = about?.socials?.find(s => s.name === 'GitHub')?.url || 'https://github.com/Playyer96';
                    }
                  }}
                  style={{
                    padding: "6px 18px", background: "#ff5f56", color: "#fff",
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--pb-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                  }}
                >
                  Quit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Game View full-screen overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {playing && (
          <GameView
            projects={projects}
            experience={experience}
            technologies={technologies}
            about={about}
            accent={dark ? accentDark : accentLight}
            onExit={() => { setPlaying(false); setSceneTab("Scene"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PortfolioShell;
