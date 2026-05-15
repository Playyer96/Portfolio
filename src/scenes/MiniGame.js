import React, { useRef, useEffect, useCallback, useState } from 'react';

const TECHS = [
  'Unity','C#','React','Unreal','C++','WebGL','ARCore','MRTK3',
  'Three.js','MongoDB','Docker','OpenXR','Blender','TypeScript','Node.js','Python',
];
const W = 700, H = 420;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const wrap = (v, max) => ((v % max) + max) % max;

function spawnRocks(count, level) {
  const out = [];
  for (let i = 0; i < count; i++) {
    let x, y;
    do { x = Math.random() * W; y = Math.random() * H; }
    while (dist({ x, y }, { x: W / 2, y: H / 2 }) < 130);
    const a = Math.random() * Math.PI * 2;
    const spd = 0.55 + Math.random() * 0.55 + level * 0.22;
    const r = 28 + Math.random() * 22;
    out.push({
      x, y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      radius: r,
      label: TECHS[Math.floor(Math.random() * TECHS.length)],
      hp: r > 38 ? 2 : 1,
      rot: 0, rotSpd: (Math.random() - 0.5) * 0.022,
    });
  }
  return out;
}

function initState(level = 1) {
  return {
    ship: { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: -Math.PI / 2, radius: 10 },
    bullets: [], rocks: spawnRocks(4 + level, level), particles: [],
    keys: {}, score: 0, lives: 3, level, lastShot: 0, inv: 0, frame: 0,
  };
}

export default function MiniGame({ accent = '#a8ff60' }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState('start');
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  const start = useCallback(() => {
    gameRef.current = initState(1);
    setScore(0);
    setPhase('playing');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const down = (e) => {
      if (gameRef.current) gameRef.current.keys[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    const up = (e) => { if (gameRef.current) gameRef.current.keys[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    const loop = () => {
      const g = gameRef.current;
      if (!g) return;
      g.frame++;
      const { ship, bullets, rocks, particles, keys } = g;

      if (keys['ArrowLeft']  || keys['KeyA']) ship.angle -= 0.055;
      if (keys['ArrowRight'] || keys['KeyD']) ship.angle += 0.055;
      const thrust = keys['ArrowUp'] || keys['KeyW'];
      if (thrust) { ship.vx += Math.cos(ship.angle) * 0.15; ship.vy += Math.sin(ship.angle) * 0.15; }
      ship.vx = Math.max(-5.5, Math.min(5.5, ship.vx)) * 0.979;
      ship.vy = Math.max(-5.5, Math.min(5.5, ship.vy)) * 0.979;
      ship.x = wrap(ship.x + ship.vx, W); ship.y = wrap(ship.y + ship.vy, H);

      if ((keys['Space'] || keys['ShiftLeft']) && g.frame - g.lastShot > 9) {
        g.lastShot = g.frame;
        bullets.push({
          x: ship.x + Math.cos(ship.angle) * 14, y: ship.y + Math.sin(ship.angle) * 14,
          vx: Math.cos(ship.angle) * 7.5 + ship.vx * 0.5,
          vy: Math.sin(ship.angle) * 7.5 + ship.vy * 0.5,
          life: 55,
        });
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x = wrap(b.x + b.vx, W); b.y = wrap(b.y + b.vy, H);
        if (--b.life <= 0) bullets.splice(i, 1);
      }
      for (const r of rocks) { r.x = wrap(r.x + r.vx, W); r.y = wrap(r.y + r.vy, H); r.rot += r.rotSpd; }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.93; p.vy *= 0.93;
        if (--p.life <= 0) particles.splice(i, 1);
      }

      outer: for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        for (let ri = rocks.length - 1; ri >= 0; ri--) {
          const r = rocks[ri];
          if (dist(b, r) < r.radius) {
            bullets.splice(bi, 1);
            r.hp--;
            for (let pi = 0; pi < 7; pi++) {
              const pa = Math.random() * Math.PI * 2;
              particles.push({ x: r.x, y: r.y, vx: Math.cos(pa) * (1.5 + Math.random() * 3), vy: Math.sin(pa) * (1.5 + Math.random() * 3), life: 22 + Math.random() * 18, maxLife: 40, spark: true });
            }
            if (r.hp <= 0) {
              particles.push({ x: r.x, y: r.y - 10, vx: 0, vy: -0.5, life: 45, maxLife: 45, text: `+${10 + Math.floor(r.radius)}` });
              rocks.splice(ri, 1);
              g.score += 10 + Math.floor(r.radius);
              setScore(g.score);
              if (r.radius > 36) {
                for (let si = 0; si < 2; si++) {
                  const sa = Math.random() * Math.PI * 2;
                  const ss = 1.2 + Math.random() * 1.5;
                  rocks.push({
                    x: r.x + Math.cos(sa) * 18, y: r.y + Math.sin(sa) * 18,
                    vx: Math.cos(sa) * ss, vy: Math.sin(sa) * ss,
                    radius: r.radius * 0.52,
                    label: TECHS[Math.floor(Math.random() * TECHS.length)],
                    hp: 1, rot: r.rot, rotSpd: (Math.random() - 0.5) * 0.03,
                  });
                }
              }
            }
            continue outer;
          }
        }
      }

      if (g.inv <= 0) {
        for (const r of rocks) {
          if (dist(ship, r) < ship.radius + r.radius - 5) {
            g.lives--;
            g.inv = 110;
            for (let pi = 0; pi < 18; pi++) {
              const pa = Math.random() * Math.PI * 2;
              particles.push({ x: ship.x, y: ship.y, vx: Math.cos(pa) * (2 + Math.random() * 4), vy: Math.sin(pa) * (2 + Math.random() * 4), life: 35, maxLife: 35, spark: true });
            }
            ship.x = W / 2; ship.y = H / 2; ship.vx = 0; ship.vy = 0;
            if (g.lives <= 0) {
              setHi(prev => Math.max(prev, g.score));
              setPhase('dead');
              cancelAnimationFrame(rafRef.current);
              window.removeEventListener('keydown', down);
              window.removeEventListener('keyup', up);
              return;
            }
            break;
          }
        }
      } else g.inv--;

      if (rocks.length === 0) {
        g.level++;
        rocks.push(...spawnRocks(4 + g.level * 2, g.level));
      }

      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      canvas.width = cw; canvas.height = ch;
      const scale = Math.min(cw / W, ch / H);
      const ox = (cw - W * scale) / 2, oy = (ch - H * scale) / 2;
      ctx.save(); ctx.translate(ox, oy); ctx.scale(scale, scale);

      ctx.fillStyle = '#12121a'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 36) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 36) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      for (const p of particles) {
        ctx.globalAlpha = (p.life / p.maxLife) * 0.9;
        if (p.text) {
          ctx.fillStyle = accent; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.x, p.y);
        } else if (p.spark) {
          ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      for (const r of rocks) {
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
        ctx.strokeStyle = r.hp > 1 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)';
        ctx.lineWidth = r.hp > 1 ? 2 : 1.5;
        ctx.beginPath();
        for (let pi = 0; pi < 7; pi++) {
          const ang = (pi / 7) * Math.PI * 2;
          const jitter = 0.77 + ((r.label.charCodeAt(pi % r.label.length) * 13 + pi * 7) % 25) / 100;
          const rv = r.radius * jitter;
          pi === 0 ? ctx.moveTo(Math.cos(ang) * rv, Math.sin(ang) * rv) : ctx.lineTo(Math.cos(ang) * rv, Math.sin(ang) * rv);
        }
        ctx.closePath(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = `${Math.max(8, Math.min(11, r.radius * 0.32))}px monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(r.label.length > 8 ? r.label.slice(0, 7) + '…' : r.label, 0, 0);
        ctx.restore();
      }

      const blink = g.inv > 0 && Math.floor(g.frame / 4) % 2 === 0;
      if (!blink) {
        ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle + Math.PI / 2);
        ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.shadowColor = accent; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(9, 9); ctx.lineTo(0, 5); ctx.lineTo(-9, 9);
        ctx.closePath(); ctx.stroke();
        if (thrust) {
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(0, 16 + Math.random() * 7); ctx.lineTo(4, 7); ctx.stroke();
        }
        ctx.restore();
      }

      ctx.shadowColor = accent; ctx.shadowBlur = 8; ctx.fillStyle = accent;
      for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.shadowBlur = 0;

      ctx.font = 'bold 11px monospace'; ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.textAlign = 'left'; ctx.fillText(`SCORE  ${g.score}`, 12, 12); ctx.fillText(`LVL  ${g.level}`, 12, 28);
      ctx.textAlign = 'right'; ctx.fillStyle = accent;
      ctx.fillText('♥'.repeat(g.lives) + '♡'.repeat(Math.max(0, 3 - g.lives)), W - 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillText(`ROCKS  ${rocks.length}`, W - 12, 28);
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '9px monospace'; ctx.textBaseline = 'bottom';
      ctx.fillText('WASD · MOVE    SPACE · SHOOT', W / 2, H - 6);
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [phase, accent]);

  const mono = "'JetBrains Mono', monospace";
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#12121a', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {phase !== 'playing' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,18,26,0.9)', gap: 18, fontFamily: mono }}>
          {phase === 'dead' ? (<>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>GAME OVER</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#ff5f56', letterSpacing: '0.1em' }}>■ DESTROYED ■</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>SCORE&nbsp;&nbsp;{score}&nbsp;&nbsp;·&nbsp;&nbsp;BEST&nbsp;&nbsp;{hi}</div>
          </>) : (<>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em' }}>PORTFOLIO · MINI GAME</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: '0.06em' }}>ASTEROID.EXE</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', textAlign: 'center', lineHeight: 2.2, letterSpacing: '0.05em' }}>
              WASD · MOVE &nbsp;·&nbsp; SPACE · SHOOT<br />
              DESTROY THE TECH STACK TO LEVEL UP
            </div>
            {hi > 0 && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>BEST  {hi}</div>}
          </>)}
          <button onClick={start} style={{ marginTop: 4, padding: '8px 28px', background: accent, color: '#000', border: 'none', fontFamily: mono, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em' }}>
            {phase === 'dead' ? '↺  RETRY' : '▶  PLAY'}
          </button>
        </div>
      )}
    </div>
  );
}
