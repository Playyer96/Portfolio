import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTheme from './hooks/useTheme';
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

function PortfolioShell({ children, projects = [], experience = [], selectedProject, setSelectedProject }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [bottomTab, setBottomTab] = React.useState("console");
  const [sceneTab, setSceneTab] = React.useState("Scene");
  const [hier, setHier] = React.useState({ projects: true, experience: false, lighting: false });
  const [renderMode, setRenderMode] = React.useState("shaded");
  const [playing, setPlaying] = React.useState(false);
  const [hSearch, setHSearch] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(null);
  const [transformTool, setTransformTool] = React.useState(1);
  const [logs, setLogs] = React.useState([]);

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
  };
  const scene = routeMap[routePath] || 'intro';

  const dark = theme === 'dark';
  const accentMap = {
    lime: ["oklch(82% 0.20 130)", "oklch(50% 0.18 130)"],
    cyan: ["oklch(80% 0.16 200)", "oklch(48% 0.17 200)"],
    amber: ["oklch(82% 0.18 80)", "oklch(55% 0.17 80)"],
    magenta: ["oklch(75% 0.22 340)", "oklch(48% 0.20 340)"],
  };
  const accent = "lime"; // TODO: wire to tweaks
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
      }
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = (s) => !hSearch || s.toLowerCase().includes(hSearch.toLowerCase());
  const filteredProjects = projects.filter((p) => matches(p.name || p.title || ''));
  const filteredExperience = experience.filter((e) => matches(e.company || ''));

  const sceneLabel = {
    intro: "01_intro.scene",
    about: "02_about.scene",
    projects: selectedProject ? `03_projects · ${selectedProject.name || selectedProject.title}` : "03_projects.scene",
    experience: "04_trajectory.scene",
    stack: "05_stack.scene",
    contact: "06_contact.scene",
    cv: "07_cv.scene",
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
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: "var(--pb-dim)" }}>danilo-vanegas.unityproj</span>
        <div style={{ display: "flex", gap: 0, marginLeft: 16, color: "var(--pb-dim)", fontSize: 11, position: "relative" }} data-pb-menu>
          {[
            { l: "File", items: [
              { l: "Open CV (PDF)", a: () => window.open("/cv.pdf", "_blank") },
              { l: "Email me", a: () => { window.location.href = `mailto:vanegasdanilo7@gmail.com`; } },
              { l: "Copy email", a: () => navigator.clipboard?.writeText("vanegasdanilo7@gmail.com") },
              { l: "—" },
              { l: "Export as JSON", a: () => {
                const blob = new Blob([JSON.stringify({ projects, experience }, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob); a.download = "danilo-vanegas.json"; a.click();
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
            ]},
            { l: "Help", items: [
              { l: "GitHub ↗",   a: () => window.open("https://github.com/danilovanegas", "_blank") },
              { l: "LinkedIn ↗", a: () => window.open("https://linkedin.com/in/danilovanegas", "_blank") },
              { l: "X ↗",        a: () => window.open("https://x.com/danilovanegas", "_blank") },
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
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center", fontSize: 11 }}>
          <span style={{ color: "var(--pb-accent)" }}>● available · Q3 '26</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        height: 38, background: "var(--pb-panel)", borderBottom: "1px solid var(--pb-line)",
        display: "flex", alignItems: "center", padding: "0 12px", gap: 8, fontSize: 11, flexShrink: 0,
      }}>
        {[
          { i: "⤧", title: "Pan (Q)" },
          { i: "⤨", title: "Move (W)" },
          { i: "⤩", title: "Rotate (E)" },
          { i: "⤪", title: "Scale (R)" },
          { i: "⤫", title: "Rect (T)" },
        ].map((t, idx) => (
          <button key={idx} title={t.title}
            onClick={() => setTransformTool(idx)}
            style={{
              width: 28, height: 24, background: transformTool === idx ? "var(--pb-accent)" : "transparent",
              color: transformTool === idx ? "#000" : "var(--pb-fg)",
              border: "1px solid var(--pb-line)", cursor: "pointer", fontSize: 12,
            }}>{t.i}</button>
        ))}
        <div style={{ width: 12 }} />
        <button
          onClick={() => { setPlaying(true); setSceneTab("Game"); }}
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
          }}>⏸</button>
        <button
          onClick={() => {
            const order = ["intro","about","projects","experience","stack","contact","cv"];
            const i = order.indexOf(scene);
            navigate('/' + (order[(i + 1) % order.length] === 'intro' ? '' : order[(i + 1) % order.length]));
          }}
          title="Step to next scene"
          style={{
            padding: "4px 10px", background: "transparent", color: "var(--pb-fg)",
            border: "1px solid var(--pb-line)", cursor: "pointer", fontFamily: "var(--pb-mono)", fontSize: 11,
          }}>⏭</button>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--pb-dim)", fontSize: 10 }}>scene</span>
        <span style={{ color: "var(--pb-fg)", padding: "2px 10px", background: "var(--pb-line)", fontSize: 11 }}>
          {sceneLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Hierarchy */}
        <div style={{
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

            <div style={{ height: 14 }} />
            <div style={{ padding: "4px 10px", fontSize: 9, color: "var(--pb-dim)", letterSpacing: "0.1em" }}>LIGHTING</div>
            <HItem icon="○" label="directional_light" depth={1} />
            <HItem icon="○" label="ambient_fill" depth={1} />
            <HItem icon="○" label="post_process_volume" depth={1} />

            <div style={{ height: 14 }} />
            <div style={{ padding: "4px 10px", fontSize: 9, color: "var(--pb-dim)", letterSpacing: "0.1em" }}>CAMERAS</div>
            <HItem icon="📷" label="main_camera" depth={1} />
          </div>
        </div>

        {/* Center column: scene tabs + viewport + bottom panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Scene tabs */}
          <div style={{
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
          </div>

          {/* Viewport */}
          <div style={{
            flex: 1, position: "relative", minHeight: 0, background: "var(--pb-bg)",
            filter: renderMode === "wire" ? "invert(0.04) contrast(1.4) saturate(0)" :
                    renderMode === "uv" ? "hue-rotate(60deg) saturate(2)" : "none",
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
          </div>

          {/* Bottom dock */}
          <div style={{
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
            <div style={{ flex: 1, overflow: "auto", background: "var(--pb-panel)", padding: "12px" }}>
              {bottomTab === "console" && (
                <div style={{ fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-dim)" }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: 4, color: log.type === 'error' ? '#ff6b6b' : 'inherit' }}>
                      {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div style={{
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
          <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
            <div style={{ fontFamily: "var(--pb-mono)", fontSize: 10, color: "var(--pb-dim)" }}>
              <div>Scene: {sceneLabel}</div>
              {selectedProject && (
                <>
                  <div style={{ marginTop: 12, color: "var(--pb-fg)" }}>
                    Project: {selectedProject.name || selectedProject.title}
                  </div>
                  {selectedProject.description && (
                    <div style={{ marginTop: 8, fontSize: 9, color: "var(--pb-fg)" }}>
                      {selectedProject.description}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--pb-line)", background: "var(--pb-panel)", padding: 16, textAlign: "center" }}>
            <div style={{ color: "var(--pb-dim)", fontFamily: "var(--pb-mono)", fontSize: 11 }}>Drag a brief here, or</div>
            <a href="mailto:vanegasdanilo7@gmail.com" style={{
              color: "var(--pb-accent)", textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: 6,
            }}>
              + start a conversation
            </a>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
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
        <a href="https://github.com/danilovanegas" target="_blank" rel="noreferrer"
          style={{ color: "var(--pb-fg)", textDecoration: "none" }}>Unity 6 / Next 15 ↗</a>
      </div>

      <TweaksPanel />
    </div>
  );
}

export default PortfolioShell;
