import React, { useRef, useEffect, useCallback, useState } from 'react';

// Joint positions are [x, y] relative to hip center at (0, 0).
// Y axis: negative = up, positive = down.

const CLIPS = {
  idle: {
    label: 'Idle',
    color: '#10b981',
    duration: 90,
    pose(t) {
      const b = Math.sin(t * Math.PI * 2);
      return {
        rootY: b,
        neck:     [0,       -43 + b * 0.5],
        head:     [b * 0.5, -62 + b * 0.5],
        lSh:  [-13, -41], rSh:  [13, -41],
        lEl:  [-28 + b * 0.4, -25], rEl:  [28 - b * 0.4, -25],
        lHa:  [-30 + b * 0.4, -8],  rHa:  [30 - b * 0.4, -8],
        lHi:  [-8, 0],  rHi:  [8, 0],
        lKn:  [-9, 30], rKn:  [9, 30],
        lFt:  [-8, 61], rFt:  [8, 61],
      };
    },
  },
  walk: {
    label: 'Walk',
    color: '#06b6d4',
    duration: 60,
    pose(t) {
      const s = Math.sin(t * Math.PI * 2);
      const bob = Math.abs(s) * 4 - 1;
      return {
        rootY: -bob,
        neck: [s * 1.5, -44],
        head: [s * 2,   -62],
        lSh: [-13, -41], rSh: [13, -41],
        lEl: [-28 - s * 9,  -30 + Math.abs(s) * 5], rEl: [28 + s * 9,  -30 + Math.abs(s) * 5],
        lHa: [-30 - s * 11, -15 + Math.abs(s) * 4], rHa: [30 + s * 11, -15 + Math.abs(s) * 4],
        lHi: [-8, 0], rHi: [8, 0],
        lKn: [-9 - s * 2,  28 - s * 11], rKn: [9 + s * 2,  28 + s * 11],
        lFt: [-8 - s * 4,  61 - Math.max(0, s) * 19], rFt: [8 + s * 4, 61 + Math.min(0, s) * 19],
      };
    },
  },
  jump: {
    label: 'Jump',
    color: '#f59e0b',
    duration: 80,
    pose(t) {
      let rootY, lKn, rKn, lFt, rFt, lEl, rEl, lHa, rHa;
      if (t < 0.25) {
        const p = t / 0.25;
        rootY = p * 10; lKn = [-9, 30 - p * 6]; rKn = [9, 30 - p * 6];
        lFt = [-8, 62 - p * 2]; rFt = [8, 62 - p * 2];
        lEl = [-30, -25 + p * 8]; rEl = [30, -25 + p * 8];
        lHa = [-32, -8 + p * 10]; rHa = [32, -8 + p * 10];
      } else if (t < 0.5) {
        const p = (t - 0.25) / 0.25;
        rootY = 10 - p * 42; lKn = [-9, 24 + p * 10]; rKn = [9, 24 + p * 10];
        lFt = [-8, 60 + p * 10]; rFt = [8, 60 + p * 10];
        lEl = [-28 - p * 14, -17 - p * 22]; rEl = [28 + p * 14, -17 - p * 22];
        lHa = [-30 - p * 12, 2 - p * 28]; rHa = [30 + p * 12, 2 - p * 28];
      } else if (t < 0.75) {
        const p = (t - 0.5) / 0.25;
        rootY = -32 + p * 22; lKn = [-9, 34 - p * 12]; rKn = [9, 34 - p * 12];
        lFt = [-12 - p * 2, 70 - p * 22]; rFt = [12 + p * 2, 70 - p * 22];
        lEl = [-42 + p * 8, -39 + p * 12]; rEl = [42 - p * 8, -39 + p * 12];
        lHa = [-42 + p * 8, -26 + p * 12]; rHa = [42 - p * 8, -26 + p * 12];
      } else {
        const p = (t - 0.75) / 0.25;
        rootY = -10 + p * 22; lKn = [-9, 22 + p * 16]; rKn = [9, 22 + p * 16];
        lFt = [-14 + p * 6, 48 + p * 15]; rFt = [14 - p * 6, 48 + p * 15];
        lEl = [-34 + p * 6, -27 + p * 12]; rEl = [34 - p * 6, -27 + p * 12];
        lHa = [-34 + p * 6, -14 + p * 8]; rHa = [34 - p * 6, -14 + p * 8];
      }
      return {
        rootY,
        neck: [0, -44], head: [0, -62],
        lSh: [-13, -41], rSh: [13, -41],
        lEl, rEl, lHa, rHa,
        lHi: [-8, 0], rHi: [8, 0],
        lKn, rKn, lFt, rFt,
      };
    },
  },
  attack: {
    label: 'Attack',
    color: '#ef4444',
    duration: 50,
    pose(t) {
      let rEl, rHa, lEl, lHa, neck;
      let impact = false, swordTip = null;
      if (t < 0.28) {
        const p = t / 0.28;
        rEl = [28 + p * 22, -32 - p * 10]; rHa = [32 + p * 28, -18 - p * 22];
        lEl = [-28, -22]; lHa = [-30, -6]; neck = [p * 3, -44];
      } else if (t < 0.55) {
        const p = (t - 0.28) / 0.27;
        rEl = [50 - p * 75, -42 + p * 32]; rHa = [60 - p * 95, -40 + p * 32];
        lEl = [-28, -22]; lHa = [-30, -6]; neck = [3 - p * 6, -44];
        impact = true;
        swordTip = [rHa[0] + 32, rHa[1] - 4];
      } else {
        const p = (t - 0.55) / 0.45;
        rEl = [-25 + p * 54, -10 - p * 12]; rHa = [-35 + p * 66, 5 - p * 14];
        lEl = [-28, -22]; lHa = [-30, -6]; neck = [-3 + p * 3, -44];
      }
      return {
        rootY: 0, neck, head: [neck[0], neck[1] - 18],
        lSh: [-13, -41], rSh: [13, -41],
        lEl, rEl, lHa, rHa,
        lHi: [-8, 0], rHi: [8, 0],
        lKn: [-9, 30], rKn: [9, 30],
        lFt: [-8, 61], rFt: [8, 61],
        impact, swordTip,
      };
    },
  },
  celebrate: {
    label: 'Celebrate',
    color: '#8b5cf6',
    duration: 90,
    pose(t) {
      const wave = Math.sin(t * Math.PI * 4);
      const jump = Math.abs(Math.sin(t * Math.PI * 2));
      return {
        rootY: -jump * 15,
        neck: [wave * 3, -44],
        head: [wave * 4.5, -62],
        lSh: [-13, -41], rSh: [13, -41],
        lEl: [-40 - wave * 5, -52 - wave * 7],  rEl: [40 + wave * 5, -52 + wave * 7],
        lHa: [-46 - wave * 9, -70 - wave * 10], rHa: [46 + wave * 9, -70 + wave * 10],
        lHi: [-8, 0], rHi: [8, 0],
        lKn: [-9 - jump * 5, 30 - jump * 16], rKn: [9 + jump * 5, 30 - jump * 16],
        lFt: [-8 - jump * 9, 61 - jump * 22],  rFt: [8 + jump * 9, 61 - jump * 22],
      };
    },
  },
};

function drawFigure(ctx, cx, groundY, pose, color) {
  const { rootY = 0, neck, head, lSh, rSh, lEl, rEl, lHa, rHa, lHi, rHi, lKn, rKn, lFt, rFt, impact, swordTip } = pose;
  const cy = groundY + rootY;
  const J = ([x, y]) => ({ x: cx + x, y: cy + y });

  const nJ = J(neck), hJ = J(head);
  const lShJ = J(lSh), rShJ = J(rSh);
  const lElJ = J(lEl), rElJ = J(rEl);
  const lHaJ = J(lHa), rHaJ = J(rHa);
  const lHiJ = J(lHi), rHiJ = J(rHi);
  const lKnJ = J(lKn), rKnJ = J(rKn);
  const lFtJ = J(lFt), rFtJ = J(rFt);
  const hip  = { x: cx, y: cy };

  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };

  // Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(cx, groundY + 63, Math.max(8, 20 - Math.abs(rootY) * 0.4), 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Skeleton
  line(hip, nJ);
  line(nJ, hJ);
  ctx.beginPath(); ctx.arc(hJ.x, hJ.y, 13, 0, Math.PI * 2); ctx.stroke();

  // Eyes
  const eyeY = hJ.y - 3;
  ctx.beginPath(); ctx.arc(hJ.x - 5, eyeY, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hJ.x + 5, eyeY, 2, 0, Math.PI * 2); ctx.fill();

  line(nJ, lShJ); line(lShJ, lElJ); line(lElJ, lHaJ);
  line(nJ, rShJ); line(rShJ, rElJ); line(rElJ, rHaJ);
  line(hip, lHiJ); line(lHiJ, lKnJ); line(lKnJ, lFtJ);
  line(hip, rHiJ); line(rHiJ, rKnJ); line(rKnJ, rFtJ);

  if (impact && swordTip) {
    const stJ = J(swordTip);
    ctx.save();
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ffff00'; ctx.shadowBlur = 18;
    line(rHaJ, stJ);
    ctx.beginPath(); ctx.arc(stJ.x, stJ.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,0,0.4)'; ctx.fill();
    ctx.restore();
  }
}

export default function AnimatorCanvas({ accent = '#a8ff60' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stRef = useRef({ clip: 'idle', frame: 0, playing: true, speed: 1, t: 0 });
  const [clipName, setClipName] = useState('idle');
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [tVal, setTVal] = useState(0);

  const drawFigureCb = useCallback(drawFigure, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const s = stRef.current;
      const clip = CLIPS[s.clip];
      if (!clip) { rafRef.current = requestAnimationFrame(loop); return; }

      if (s.playing) {
        s.frame = (s.frame + s.speed) % clip.duration;
        s.t = s.frame / clip.duration;
        setTVal(s.t);
      }

      const pose = clip.pose(s.t);

      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      canvas.width = cw; canvas.height = ch;

      ctx.fillStyle = '#1a1a1c'; ctx.fillRect(0, 0, cw, ch);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 1;
      for (let gx = 0; gx < cw; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke(); }
      for (let gy = 0; gy < ch; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke(); }

      // Ground
      const groundY = ch * 0.6;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.setLineDash([5, 10]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, groundY + 63); ctx.lineTo(cw, groundY + 63); ctx.stroke();
      ctx.setLineDash([]);

      // Figure
      ctx.strokeStyle = clip.color; ctx.fillStyle = clip.color;
      ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowColor = clip.color; ctx.shadowBlur = 5;
      drawFigureCb(ctx, cw / 2, groundY, pose, clip.color);
      ctx.shadowBlur = 0;

      // Watermark
      ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`${clip.label.toUpperCase()}.anim`, cw - 12, 12);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFigureCb]);

  const pickClip = (name) => {
    stRef.current.clip = name; stRef.current.frame = 0; stRef.current.t = 0;
    setClipName(name); setTVal(0);
  };
  const togglePlay = () => {
    const next = !stRef.current.playing;
    stRef.current.playing = next; setPlaying(next);
  };
  const pickSpeed = (v) => { stRef.current.speed = v; setSpeed(v); };

  const clip = CLIPS[clipName];
  const mono = "'JetBrains Mono', monospace";

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: mono, background: '#1a1a1c', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ height: 28, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        <span>ANIMATOR · INTERACTIVE PREVIEW</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: clip?.color, fontWeight: 700 }}>{clipName.toUpperCase()}</span>
          <span>·</span>
          <span>{Math.floor(tVal * (clip?.duration || 60))} / {clip?.duration || 60} fr</span>
        </div>
      </div>

      {/* Clip tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {Object.entries(CLIPS).map(([key, c]) => (
          <button key={key} onClick={() => pickClip(key)} style={{
            flex: 1, padding: '7px 4px',
            background: clipName === key ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: 'none', borderBottom: clipName === key ? `2px solid ${c.color}` : '2px solid transparent',
            color: clipName === key ? c.color : 'rgba(255,255,255,0.28)',
            fontFamily: mono, fontSize: 9, cursor: 'pointer', letterSpacing: '0.06em', transition: 'all 0.15s',
          }}>
            {c.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Controls */}
      <div style={{ height: 50, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, flexShrink: 0 }}>
        <button onClick={togglePlay} style={{
          width: 28, height: 28, background: clip?.color || accent, color: '#000',
          border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {playing ? '▐▌' : '▶'}
        </button>

        {/* Timeline scrubber */}
        <div style={{ flex: 1, position: 'relative', height: 20, cursor: 'pointer' }}>
          <div style={{ position: 'absolute', inset: '8px 0', background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', inset: '8px 0', right: `${(1 - tVal) * 100}%`, background: clip?.color || accent, opacity: 0.45, borderRadius: 2 }} />
          {[0.25, 0.5, 0.75].map(pos => (
            <div key={pos} style={{ position: 'absolute', left: `${pos * 100}%`, top: 3, bottom: 3, width: 1, background: 'rgba(255,255,255,0.12)' }} />
          ))}
          <div style={{ position: 'absolute', left: `${tVal * 100}%`, top: 2, bottom: 2, width: 2, background: clip?.color || accent, transform: 'translateX(-50%)', borderRadius: 2 }} />
          <input type="range" min={0} max={1} step={0.001} value={tVal}
            onChange={e => {
              const v = parseFloat(e.target.value);
              stRef.current.t = v;
              stRef.current.frame = v * (clip?.duration || 60);
              stRef.current.playing = false;
              setTVal(v); setPlaying(false);
            }}
            style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>SPEED</span>
          {[0.25, 0.5, 1, 2].map(s => (
            <button key={s} onClick={() => pickSpeed(s)} style={{
              padding: '2px 6px',
              background: speed === s ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${speed === s ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)'}`,
              color: speed === s ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)',
              fontFamily: mono, fontSize: 9, cursor: 'pointer',
            }}>{s}x</button>
          ))}
        </div>
      </div>
    </div>
  );
}
