import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, H, W, body, head} from '../theme';
import {bob, f, pop, prog} from '../lib';

/** Space-like backdrop: radial glow, drifting dust, soft vignette. */
export const Stage: React.FC<{tint?: string; glow?: string; children?: React.ReactNode; seed?: number; dust?: number}> = ({
  tint = C.bg2,
  glow = C.bg3,
  children,
  seed = 1,
  dust = 60,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, ${glow} 0%, ${tint} 38%, ${C.bg0} 100%)`, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {new Array(dust).fill(0).map((_, i) => {
          const x = random(`x${seed}${i}`) * W;
          const y = random(`y${seed}${i}`) * H;
          const r = 1 + random(`r${seed}${i}`) * 2.6;
          const sp = 0.2 + random(`s${seed}${i}`) * 0.6;
          const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 20 + i));
          return <circle key={i} cx={(x + frame * sp) % W} cy={y + Math.sin(frame / 60 + i) * 8} r={r} fill={C.ink} opacity={tw * 0.5} />;
        })}
      </svg>
      {children}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(3,5,15,0.55) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/** Absolutely position a child centered at (x,y) with transform. */
export const Place: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  r?: number;
  o?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = W / 2, y = H / 2, s = 1, r = 0, o = 1, w = 400, h = 400, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      transform: `scale(${s}) rotate(${r}deg)`,
      opacity: o,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <div style={{flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>
);

/** Pop-in placement: springs scale from 0 at time `at` (seconds); optional exit. */
export const Pop: React.FC<{
  at: number;
  out?: number;
  x?: number;
  y?: number;
  s?: number;
  w?: number;
  h?: number;
  float?: number;
  rot?: number;
  children: React.ReactNode;
}> = ({at, out, x, y, s = 1, w, h, float = 0, rot = 0, children}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at);
  const e = out === undefined ? 0 : prog(frame, out, 0.35);
  if (frame < f(at)) return null;
  return (
    <Place x={x} y={(y ?? H / 2) + bob(frame, float, 0.8, at)} s={s * p * (1 - e * 0.4)} o={Math.min(1, p * 1.5) * (1 - e)} w={w} h={h} r={rot}>
      {children}
    </Place>
  );
};

/** Text that rises in word by word. */
export const Words: React.FC<{
  text: string;
  at: number;
  out?: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  font?: 'head' | 'body';
  weight?: number;
  stagger?: number;
  width?: number;
  align?: 'center' | 'left';
  highlight?: Record<string, string>;
  upper?: boolean;
}> = ({text, at, out, x = W / 2, y = H / 2, size = 64, color = C.ink, font = 'body', weight = 900, stagger = 0.07, width = 1500, align = 'center', highlight = {}, upper}) => {
  const frame = useCurrentFrame();
  const e = out === undefined ? 0 : prog(frame, out, 0.35);
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? x - width / 2 : x,
        top: y - size,
        width,
        textAlign: align,
        fontFamily: font === 'head' ? head : body,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.15,
        color,
        opacity: 1 - e,
        transform: `translateY(${-e * 20}px)`,
        textTransform: upper ? 'uppercase' : undefined,
        letterSpacing: font === 'head' ? 1 : 0,
        textShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      {words.map((w, i) => {
        const p = prog(frame, at + i * stagger, 0.45);
        const key = w.replace(/[^\w$.-]/g, '');
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, color: highlight[key] ?? color, marginRight: size * 0.25}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Rounded label pill. */
export const Pill: React.FC<{text: string; color?: string; fg?: string; size?: number; icon?: React.ReactNode}> = ({text, color = C.bg3, fg = C.ink, size = 34, icon}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.35,
      padding: `${size * 0.3}px ${size * 0.7}px`,
      background: color,
      color: fg,
      borderRadius: size,
      fontFamily: body,
      fontWeight: 900,
      fontSize: size,
      whiteSpace: 'nowrap',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    }}
  >
    {icon}
    {text}
  </div>
);

/** Big year number with a quick count-up. */
export const Year: React.FC<{year: number; at: number; out?: number; x?: number; y?: number; size?: number; color?: string; from?: number}> = ({
  year,
  at,
  out,
  x = W / 2,
  y = H / 2,
  size = 220,
  color = C.ink,
  from,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 0.7);
  const e = out === undefined ? 0 : prog(frame, out, 0.35);
  const shown = from === undefined ? year : Math.round(from + (year - from) * p);
  if (frame < f(at)) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 600,
        top: y - size * 0.6,
        width: 1200,
        textAlign: 'center',
        fontFamily: head,
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1.2,
        opacity: Math.min(1, p * 2) * (1 - e),
        transform: `scale(${0.85 + 0.15 * p})`,
        letterSpacing: 6,
        textShadow: '0 10px 40px rgba(0,0,0,0.4)',
      }}
    >
      {shown}
    </div>
  );
};

/** Section title card used at chapter breaks. */
export const Chapter: React.FC<{num: string; title: string; at: number; out: number; color?: string}> = ({num, title, at, out, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 0.8);
  const e = prog(frame, out - 0.4, 0.4);
  const line = prog(frame, at + 0.2, 0.9);
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - e}}>
      <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, letterSpacing: 12, color, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>{num}</div>
      <div style={{width: 520 * line, height: 5, borderRadius: 4, background: color, margin: '26px 0'}} />
      <div style={{fontFamily: head, fontWeight: 700, fontSize: 130, letterSpacing: 6, color: C.ink, opacity: p, transform: `translateY(${(1 - p) * -20}px)`, textTransform: 'uppercase'}}>{title}</div>
    </div>
  );
};

/** Dashed connector line that draws itself. */
export const Connector: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string; dur?: number; dash?: boolean; width?: number; out?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  at,
  color = C.muted,
  dur = 0.6,
  dash = true,
  width = 6,
  out,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  const e = out === undefined ? 0 : prog(frame, out, 0.3);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - e}}>
      <defs>
        <mask id={`m${x1}${y1}${x2}${y2}`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={width + 4} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
        </mask>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? '2 18' : undefined} mask={`url(#m${x1}${y1}${x2}${y2})`} />
    </svg>
  );
};

/** Soft glowing circle behind a focal object. */
export const Glow: React.FC<{x: number; y: number; r: number; color: string; o?: number}> = ({x, y, r, color, o = 0.35}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 68%)`, opacity: o}} />
);
