import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {f, pop, prog} from '../lib';
import {C, H, W, body, head, serif} from '../theme';

/** Speech bubble, pops at `at`; tail points down-left (or down-right with flip). */
export const Bubble: React.FC<{at: number; out?: number; x: number; y: number; text: React.ReactNode; size?: number; width?: number; flip?: boolean; color?: string; fg?: string; italic?: boolean}> = ({
  at,
  out,
  x,
  y,
  text,
  size = 40,
  width = 560,
  flip,
  color = '#F7F3EA',
  fg = '#1C1C28',
  italic,
}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, at, 12);
  const e = out === undefined ? 0 : prog(fr, out, 0.3);
  if (fr < f(at)) return null;
  return (
    <div style={{position: 'absolute', left: x - width / 2, top: y, width, transform: `translateY(-100%) scale(${p * (1 - e * 0.3)})`, transformOrigin: flip ? '85% 100%' : '15% 100%', opacity: Math.min(1, p * 1.5) * (1 - e)}}>
      <div style={{background: color, color: fg, borderRadius: 36, padding: `${size * 0.55}px ${size * 0.8}px`, fontFamily: italic ? serif : body, fontStyle: italic ? 'italic' : undefined, fontWeight: 900, fontSize: size, lineHeight: 1.2, textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.35)'}}>{text}</div>
      <svg width="60" height="40" style={{position: 'absolute', bottom: -34, left: flip ? undefined : 70, right: flip ? 70 : undefined, transform: flip ? 'scaleX(-1)' : undefined}}>
        <path d="M0 0 L50 0 L8 38 Z" fill={color} />
      </svg>
    </div>
  );
};

/** Animated red X over whatever is placed beneath it (absolute, centred at x,y). */
export const Cross: React.FC<{at: number; x: number; y: number; size?: number; color?: string; out?: number}> = ({at, x, y, size = 220, color = C.red, out}) => {
  const fr = useCurrentFrame();
  const a = prog(fr, at, 0.18);
  const b = prog(fr, at + 0.12, 0.18);
  const e = out === undefined ? 0 : prog(fr, out, 0.3);
  if (fr < f(at)) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: 1 - e, overflow: 'visible'}}>
      <line x1="12" y1="12" x2={12 + 76 * a} y2={12 + 76 * a} stroke={color} strokeWidth="12" strokeLinecap="round" />
      <line x1="88" y1="12" x2={88 - 76 * b} y2={12 + 76 * b} stroke={color} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
};

/** Round check / cross badge. */
export const Badge: React.FC<{ok?: boolean; size?: number}> = ({ok = true, size = 80}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: ok ? C.mint : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(0,0,0,0.4)'}}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 50 50">
      {ok ? <path d="M10 26 L21 37 L41 14" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M13 13 L37 37 M37 13 L13 37" stroke="#fff" strokeWidth="8" strokeLinecap="round" />}
    </svg>
  </div>
);

/** Rubber stamp that slams down. */
export const Stamp: React.FC<{at: number; text: string; x: number; y: number; color?: string; rot?: number; size?: number}> = ({at, text, x, y, color = C.red, rot = -12, size = 90}) => {
  const fr = useCurrentFrame();
  if (fr < f(at)) return null;
  const p = prog(fr, at, 0.16);
  const s = interpolate(p, [0, 1], [2.4, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`,
        opacity: p,
        border: `${size * 0.09}px solid ${color}`,
        color,
        fontFamily: head,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.08,
        padding: `${size * 0.05}px ${size * 0.3}px`,
        borderRadius: size * 0.15,
        whiteSpace: 'nowrap',
        background: 'rgba(8,11,24,0.25)',
        mixBlendMode: 'normal',
      }}
    >
      {text}
    </div>
  );
};

/** Curved arrow that draws itself (absolute, in screen space). */
export const Arrow: React.FC<{at: number; d: string; color?: string; width?: number; dur?: number; dash?: boolean; out?: number; head_?: boolean}> = ({at, d, color = C.muted, width = 8, dur = 0.6, dash, out, head_ = true}) => {
  const fr = useCurrentFrame();
  const p = prog(fr, at, dur);
  const e = out === undefined ? 0 : prog(fr, out, 0.3);
  const id = `ar${Math.abs(d.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))}`;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - e, overflow: 'visible'}}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill={color} />
        </marker>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={W + 400} height={H + 400}>
          <path d={d} stroke="white" strokeWidth={width + 6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={dash ? '2 16' : undefined} mask={`url(#${id}m)`} />
      {head_ && p > 0.97 && <path d={d} stroke="transparent" fill="none" markerEnd={`url(#${id})`} strokeWidth={width} />}
    </svg>
  );
};

/** Polaroid photo frame with caption. */
export const Polaroid: React.FC<{caption?: string; w?: number; h?: number; children?: React.ReactNode; tone?: string}> = ({caption, w = 260, h = 220, children, tone = '#CFC5AE'}) => (
  <div style={{background: '#F6F1E4', padding: 14, paddingBottom: caption ? 54 : 14, borderRadius: 6, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', position: 'relative'}}>
    <div style={{width: w, height: h, background: tone, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2}}>{children}</div>
    {caption && <div style={{position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 26, color: '#3A2A1E'}}>{caption}</div>}
  </div>
);

/** Horizontal speed lines across the frame (for passing cars). */
export const SpeedLines: React.FC<{o?: number; y0?: number; y1?: number; n?: number; color?: string}> = ({o = 1, y0 = 300, y1 = 900, n = 26, color = '#FFFFFF'}) => {
  const fr = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      {new Array(n).fill(0).map((_, i) => {
        const y = y0 + random(`sl${i}`) * (y1 - y0);
        const len = 120 + random(`sll${i}`) * 380;
        const sp = 50 + random(`sls${i}`) * 50;
        const x = ((random(`slx${i}`) * (W + 800) + fr * sp) % (W + 800)) - 400;
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke={color} strokeWidth={2 + random(`slw${i}`) * 3} strokeLinecap="round" opacity={0.15 + random(`slo${i}`) * 0.25} />;
      })}
    </svg>
  );
};

/** Pointing hand (index finger to the right). */
export const Hand: React.FC<{size?: number; skin?: string}> = ({size = 160, skin = C.skin}) => (
  <svg viewBox="0 0 160 100" width={size} height={(size * 100) / 160}>
    <rect x="0" y="30" width="40" height="44" rx="8" fill="#2D3557" />
    <path d="M36 30 L84 30 Q92 30 92 38 L92 40 L148 40 Q158 40 158 48 Q158 56 148 56 L92 56 L92 80 Q92 90 82 90 L46 90 Q36 90 36 80 Z" fill={skin} />
    <path d="M60 56 L88 56 M60 68 L88 68 M60 80 L86 80" stroke="#C99A7A" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Rising sparkles around a point (for the logo, trophies). */
export const Sparkles: React.FC<{x: number; y: number; r?: number; at: number; color?: string; n?: number}> = ({x, y, r = 200, at, color = C.yellow, n = 12}) => {
  const fr = useCurrentFrame();
  if (fr < f(at)) return null;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {new Array(n).fill(0).map((_, i) => {
        const t = ((fr - f(at)) / 40 + random(`sp${i}`)) % 1;
        const a = random(`spa${i}`) * Math.PI * 2;
        const rr = r * (0.4 + random(`spr${i}`) * 0.6);
        const cx = x + Math.cos(a) * rr;
        const cy = y + Math.sin(a) * rr - t * 60;
        const s = 6 + random(`sps${i}`) * 8;
        return <path key={i} d={`M${cx} ${cy - s} L${cx + s * 0.3} ${cy} L${cx} ${cy + s} L${cx - s * 0.3} ${cy} Z M${cx - s} ${cy} L${cx} ${cy + s * 0.3} L${cx + s} ${cy} L${cx} ${cy - s * 0.3} Z`} fill={color} opacity={Math.sin(t * Math.PI)} />;
      })}
    </svg>
  );
};

/** Big serif title text, centred. */
export const Title: React.FC<{at: number; out?: number; text: React.ReactNode; y?: number; size?: number; color?: string; x?: number; italic?: boolean}> = ({at, out, text, y = 540, size = 120, color = C.ink, x = 960, italic}) => {
  const fr = useCurrentFrame();
  const p = prog(fr, at, 0.6);
  const e = out === undefined ? 0 : prog(fr, out, 0.35);
  return (
    <div style={{position: 'absolute', left: x - 900, width: 1800, top: y - size * 0.62, textAlign: 'center', fontFamily: serif, fontStyle: italic ? 'italic' : undefined, fontWeight: 900, fontSize: size, color, opacity: p * (1 - e), transform: `translateY(${(1 - p) * 30 - e * 20}px) scale(${0.94 + 0.06 * p})`, lineHeight: 1.1, textShadow: '0 10px 40px rgba(0,0,0,0.45)'}}>
      {text}
    </div>
  );
};

/** Ground strip at the bottom of the frame. */
export const Ground: React.FC<{y?: number; color?: string; o?: number}> = ({y = 860, color = '#141B36', o = 1}) => (
  <div style={{position: 'absolute', left: -100, right: -100, top: y, bottom: -100, background: `linear-gradient(180deg, ${color} 0%, ${C.bg0} 100%)`, opacity: o, borderTop: `4px solid rgba(255,255,255,0.06)`}} />
);

/** Road (side view) with moving dashes. */
export const Road: React.FC<{y?: number; speed?: number; o?: number; color?: string}> = ({y = 820, speed = 0, o = 1, color = '#3A3A44'}) => {
  const fr = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: -100, right: -100, top: y, height: 120, background: color, opacity: o, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, height: 10, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 80px, transparent 80px 160px)', transform: `translateX(${(-fr * speed) % 160}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: 'rgba(0,0,0,0.25)'}} />
    </div>
  );
};

/** Count-up number. */
export const Count: React.FC<{at: number; from: number; to: number; dur?: number; style?: React.CSSProperties; pad?: number; suffix?: string; prefix?: string}> = ({at, from, to, dur = 1, style, suffix = '', prefix = ''}) => {
  const fr = useCurrentFrame();
  const p = prog(fr, at, dur);
  return <span style={style}>{prefix + Math.round(from + (to - from) * p) + suffix}</span>;
};

export const Caption: React.FC<{at: number; out?: number; text: React.ReactNode; x?: number; y?: number; size?: number; color?: string}> = ({at, out, text, x = 960, y = 960, size = 44, color = C.muted}) => {
  const fr = useCurrentFrame();
  const p = prog(fr, at, 0.45);
  const e = out === undefined ? 0 : prog(fr, out, 0.3);
  return (
    <div style={{position: 'absolute', left: x - 800, width: 1600, top: y - size, textAlign: 'center', fontFamily: body, fontWeight: 900, fontSize: size, color, opacity: p * (1 - e), transform: `translateY(${(1 - p) * 20}px)`, textShadow: '0 4px 20px rgba(0,0,0,0.5)', letterSpacing: 1}}>
      {text}
    </div>
  );
};
