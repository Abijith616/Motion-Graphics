/**
 * COLD OPEN — one continuous camera move, no cuts, from the first word to the channel sting.
 * Everything lives in a single "world"; a virtual camera (x, y, zoom, roll) flies through it.
 * Race track → its straight becomes the timeline → the timeline bends into a "?" →
 * the camera dives into the "?"'s dot, which becomes the cyan N of NOOSPHERE.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random} from 'remotion';
import {useCurrentFrame} from '../frame';
import {interpolatePath} from '@remotion/paths';
import {BRAND, tagFont, wordFont} from '../brand/Noosphere';
import {Char, F1Car, Factory, FerrariWord, Car125, Shield, Workshop} from '../components/Ferrari';
import {Q} from '../cues';
import {f, pop, prog} from '../lib';
import {C, H, W, body, head, serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const outE = Easing.bezier(0.16, 1, 0.3, 1);

/* ---------------------------------------------------------------- camera */

type Key = {t: number; x: number; y: number; z: number; r?: number; ease?: (n: number) => number};
const yr = (year: number) => (year - 1929) * 120; // timeline: 120 world px per year

const KEYS: Key[] = [
  {t: 0, x: -520, y: 10, z: 2.3},
  {t: 1.5, x: -25, y: 0, z: 2.0, ease: (n) => n},
  {t: 3.2, x: 0, y: -330, z: 0.62},
  {t: Q.merc - 0.1, x: 0, y: -330, z: 0.64},
  {t: Q.merc + 0.7, x: -350, y: -360, z: 1.05},
  {t: Q.ferr - 0.1, x: -330, y: -360, z: 1.08},
  {t: Q.ferr + 0.7, x: 350, y: -360, z: 1.05},
  {t: Q.scud, x: 360, y: -380, z: 1.12},
  {t: Q.scud + 0.9, x: 520, y: -470, z: 1.55},
  {t: Q.true, x: 530, y: -470, z: 1.6},
  {t: Q.story + 0.6, x: 360, y: -330, z: 1.0},
  {t: Q.backwards, x: 300, y: -260, z: 0.82, r: 0},
  {t: Q.backwards + 0.5, x: 200, y: -240, z: 0.78, r: -7},
  {t: Q.carco - 0.2, x: 600, y: -220, z: 0.8, r: 0},
  {t: Q.firstcar, x: yr(1947), y: -240, z: 0.95},
  {t: Q.founded + 0.1, x: yr(1947) - 40, y: -240, z: 0.98},
  {t: Q.founded + 0.75, x: 0, y: -240, z: 0.98, ease: Easing.bezier(0.7, 0, 0.2, 1)},
  {t: Q.eighteen - 0.1, x: 30, y: -240, z: 1.0},
  {t: Q.eighteen + 1.1, x: yr(1938), y: -230, z: 0.6},
  {t: Q.follow, x: yr(1938), y: -160, z: 0.6},
  {t: Q.follow + 1.0, x: yr(1938), y: 560, z: 0.95},
  {t: Q.wondering + 1.2, x: yr(1938) + 40, y: 580, z: 1.0},
  {t: Q.how + 0.9, x: yr(1938), y: -150, z: 0.62},
  {t: Q.why, x: yr(1938), y: -160, z: 0.6},
  {t: Q.why + 0.9, x: yr(1938), y: -340, z: 0.5},
  {t: Q.welcome - 0.15, x: yr(1938), y: 200, z: 0.62},
  {t: Q.welcome + 0.75, x: yr(1938), y: 330, z: 3.5, ease: Easing.bezier(0.55, 0, 0.25, 1)},
  {t: 60, x: yr(1938), y: 330, z: 3.6},
];

const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const k = interpolate(t, [a.t, b.t], [0, 1], {...clamp, easing: b.ease ?? inOut});
  // zoom is interpolated in log space so dives feel uniform
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k);
  return {x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z, r: (a.r ?? 0) + ((b.r ?? 0) - (a.r ?? 0)) * k};
};

/** Absolutely position content centred at a world point. */
const At: React.FC<{x: number; y: number; s?: number; o?: number; r?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, s = 1, o = 1, r = 0, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${r}deg)`, opacity: o, whiteSpace: 'nowrap', width: 'max-content', ...style}}>{children}</div>
);

const Tag: React.FC<{text: string; color?: string; fg?: string; size?: number}> = ({text, color = C.bg3, fg = C.ink, size = 30}) => (
  <div style={{background: color, color: fg, fontFamily: body, fontWeight: 900, fontSize: size, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: size, whiteSpace: 'nowrap', letterSpacing: size * 0.06, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{text}</div>
);

/* ---------------------------------------------------------------- world parts */

const PAIRS = [
  {x: -1050, car: C.blue, label: ''},
  {x: -350, car: C.silver, label: 'MERCEDES'},
  {x: 350, car: C.rosso, label: 'FERRARI'},
  {x: 1050, car: C.green, label: ''},
];

const carX = (t: number, x0: number, v: number) => {
  const tb = Q.backwards + 0.15;
  if (t < tb) return x0 + v * t;
  const xb = x0 + v * tb;
  const dt = t - tb;
  // brake hard, then roll backwards
  return xb + v * 0.25 * (1 - Math.exp(-dt * 6)) - Math.max(0, dt - 0.25) * 520;
};

const DOT = {x: yr(1938), y: 330};
const LINE = 'M -700 0 C 300 0 700 0 1080 0 C 1460 0 1860 0 2500 0 L 2860 0';
const QMARK = 'M 560 -760 C 540 -1260 1640 -1260 1600 -760 C 1580 -420 1080 -470 1080 -150 L 1080 110';

const World: React.FC<{t: number}> = ({t}) => {
  const fr = useCurrentFrame();
  const scen = 1 - prog(fr, Q.backwards + 0.4, 0.9); // garages/factories fade with the "backwards" turn
  const toLine = prog(fr, Q.carco - 0.5, 1.2); // track band → timeline line
  const toQ = prog(fr, Q.why + 0.05, 1.0, inOut); // timeline → question mark
  const carsO = 1 - prog(fr, Q.carco - 0.6, 0.6);
  const bandH = interpolate(toLine, [0, 1], [190, 10]);
  const shieldFly = prog(fr, Q.backwards + 0.3, 1.6, inOut);
  const shieldP = pop(fr, Q.scud, 11, 0.7);
  const spinY = interpolate(fr, [f(Q.backwards - 0.1), f(Q.backwards + 0.8)], [0, 360], {...clamp, easing: inOut});
  const fadeAll = 1 - prog(fr, Q.why, 0.6);
  const sX = interpolate(shieldFly, [0, 1], [350, yr(1929)]);
  const sY = interpolate(shieldFly, [0, 1], [-480, -205]);
  const sS = interpolate(shieldFly, [0, 1], [1, 0.82]);
  const arc = prog(fr, Q.eighteen + 0.1, 1.3);
  const n18 = Math.round(interpolate(arc, [0, 1], [0, 18]));

  return (
    <>
      {/* ---- factories & garages (carmaker → racing division) */}
      {PAIRS.map((p, i) => {
        const hl = p.label === 'MERCEDES' ? prog(fr, Q.merc, 0.4) : p.label === 'FERRARI' ? prog(fr, Q.ferr, 0.4) : 0;
        const dimO = p.label ? 1 : 0.55;
        const enter = pop(fr, 0.6 + i * 0.18, 13);
        return (
          <React.Fragment key={i}>
            <At x={p.x} y={-760} s={0.85 * enter} o={scen * dimO}>
              <Factory size={420} color={p.label === 'FERRARI' ? '#F1E7D4' : '#D3D7E2'} roof={p.label === 'FERRARI' ? '#A3261E' : '#5A6482'} lit={0.6} />
            </At>
            <svg style={{position: 'absolute', left: p.x - 10, top: -620, overflow: 'visible', opacity: scen * dimO * enter}} width={20} height={200}>
              <line x1="10" y1="0" x2="10" y2="160" stroke={hl ? (p.label === 'FERRARI' ? C.red : C.silver) : C.muted} strokeWidth="7" strokeDasharray="2 16" strokeLinecap="round" />
            </svg>
            <At x={p.x} y={-310} s={0.85 * enter} o={scen * dimO}>
              <div style={{filter: hl ? `drop-shadow(0 0 ${30 * hl}px ${p.label === 'FERRARI' ? 'rgba(232,32,42,0.8)' : 'rgba(205,213,224,0.8)'})` : undefined}}>
                <Workshop size={380} sign={p.label === 'FERRARI' ? C.rosso : p.label === 'MERCEDES' ? '#6E7787' : '#3A4466'} label="RACING" />
              </div>
            </At>
            {p.label && (
              <At x={p.x} y={-560} s={pop(fr, p.label === 'MERCEDES' ? Q.merc : Q.ferr, 12)} o={scen}>
                <Tag text={p.label} color={p.label === 'FERRARI' ? C.rosso : '#5D6679'} size={34} />
              </At>
            )}
          </React.Fragment>
        );
      })}
      {/* captions for the first pair */}
      <At x={-1050} y={-1030} s={pop(fr, 1.1, 13)} o={scen}>
        <Tag text="CARMAKER" color={C.bg3} size={52} />
      </At>
      <At x={-1050} y={-160} s={pop(fr, Q.division, 13)} o={scen}>
        <Tag text="RACING DIVISION" color={C.cyanDeep} size={48} />
      </At>

      {/* ---- the track, which becomes the timeline, which becomes the question mark */}
      <div style={{position: 'absolute', left: -3200, top: -bandH / 2, width: 7400, height: bandH, background: interpolateColor(toLine), opacity: 1 - toQ, borderRadius: 6}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 14 * (1 - toLine), background: 'repeating-linear-gradient(90deg, #E8202A 0 40px, #F2F2F2 40px 80px)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 14 * (1 - toLine), background: 'repeating-linear-gradient(90deg, #E8202A 0 40px, #F2F2F2 40px 80px)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: bandH / 2 - 3, height: 6, opacity: 1 - toLine, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 60px, transparent 60px 120px)', transform: `translateX(${(-fr * 22) % 120}px)`}} />
      </div>
      {toQ > 0 && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
          <path d={interpolatePath(toQ, LINE, QMARK)} stroke={C.ink} strokeWidth={interpolate(toQ, [0, 0.55, 1], [10, 24, 120])} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* ---- race cars */}
      {[
        {x0: -560, v: 330, c: C.rosso, lane: 0, s: 1},
        {x0: -1500, v: 310, c: C.silver, lane: -50, s: 0.92},
        {x0: -2200, v: 300, c: C.blue, lane: 46, s: 0.92},
        {x0: 300, v: 300, c: C.green, lane: -46, s: 0.92},
        {x0: -1050, v: 340, c: '#F28C28', lane: 48, s: 0.9},
      ].map((c, i) => {
        const x = carX(t, c.x0, c.v);
        return (
          <At key={i} x={x} y={c.lane - 30} s={0.62 * c.s} o={carsO}>
            <F1Car size={420} color={c.c} accent={c.c === C.silver ? '#1B1F2A' : '#111'} spin={(x / 38) * 57} />
          </At>
        );
      })}

      {/* ---- the shield: Scuderia Ferrari */}
      <At x={sX} y={sY} s={shieldP * sS * (1 - toQ)} o={fadeAll}>
        <div style={{transform: `perspective(900px) rotateY(${spinY}deg)`}}>
          <Shield size={220} glow={prog(fr, Q.y1929a, 0.5) * 30} />
        </div>
      </At>
      <At x={760} y={-500} o={Math.min(prog(fr, Q.scud + 0.1, 0.5), 1 - prog(fr, Q.story + 0.6, 0.4))}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 64, color: C.ink, whiteSpace: 'nowrap', lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>
          Scuderia
          <br />
          <span style={{color: C.red}}>Ferrari</span>
        </div>
      </At>
      <At x={490} y={-640} s={pop(fr, Q.simple, 10)} o={1 - prog(fr, Q.story + 0.6, 0.4)}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
          <svg width="50" height="50" viewBox="0 0 50 50">
            <path d="M10 26 L21 37 L41 14" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </At>
      {/* "backwards", mirrored */}
      <At x={820} y={-480} o={Math.min(prog(fr, Q.backwards - 0.1, 0.3), 1 - prog(fr, Q.carco, 0.5))}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 120, letterSpacing: 8, color: C.yellow, transform: `scaleX(${interpolate(fr, [f(Q.backwards), f(Q.backwards + 0.6)], [1, -1], {...clamp, easing: inOut})})`, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>BACKWARDS</div>
      </At>

      {/* ---- timeline ticks & years */}
      {new Array(27).fill(0).map((_, i) => {
        const y = 1924 + i;
        const p = prog(fr, Q.carco - 0.2 + i * 0.03, 0.4);
        const big = y % 5 === 0;
        return (
          <React.Fragment key={y}>
            <div style={{position: 'absolute', left: yr(y) - 3, top: -(big ? 34 : 18) * p, width: 6, height: (big ? 68 : 36) * p, background: C.ink, opacity: 0.8 * fadeAll, borderRadius: 3}} />
            {big && y !== 1929 && (
              <At x={yr(y)} y={74} o={p * 0.55 * fadeAll}>
                <div style={{fontFamily: head, fontWeight: 500, fontSize: 40, color: C.muted}}>{y}</div>
              </At>
            )}
          </React.Fragment>
        );
      })}
      <At x={yr(1947)} y={120} s={pop(fr, Q.y1947a, 12)} o={fadeAll}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.ink, textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>1947</div>
      </At>
      <At x={yr(1929)} y={120} s={pop(fr, Q.y1929a, 12)} o={fadeAll}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>1929</div>
      </At>

      {/* ---- 1947: the car company + its first car */}
      <At x={yr(1947)} y={-420} s={pop(fr, Q.carco + 0.2, 13)} o={fadeAll}>
        <div style={{position: 'relative'}}>
          <Factory size={460} color="#F1E7D4" roof="#A3261E" lit={1} />
          <div style={{position: 'absolute', left: 120, top: 92, width: 220, display: 'flex', justifyContent: 'center', background: '#F1E7D4', padding: '6px 0', borderRadius: 6}}>
            <FerrariWord width={180} />
          </div>
        </div>
      </At>
      <At x={yr(1947) + interpolate(prog(fr, Q.firstcar - 0.3, 1.2, outE), [0, 1], [900, 0])} y={-78} s={0.8} o={fadeAll * prog(fr, Q.firstcar - 0.3, 0.3)}>
        <Car125 size={420} bodywork={1} badge driver spin={-prog(fr, Q.firstcar - 0.3, 1.2, outE) * 900} />
      </At>

      {/* ---- 18 years arc */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fadeAll}} width={1} height={1}>
        <path d={`M ${yr(1929)} -520 Q ${yr(1938)} -900 ${yr(1947)} -720`} stroke={C.yellow} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - arc} />
      </svg>
      <At x={yr(1938)} y={-930} s={pop(fr, Q.eighteen + 0.2, 12)} o={fadeAll}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 110, color: C.yellow, whiteSpace: 'nowrap', textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>
          {n18} YEARS <span style={{color: C.ink}}>EARLIER</span>
        </div>
      </At>

      {/* ---- team vs company labels */}
      <At x={yr(1929)} y={250} s={pop(fr, Q.older, 12)} o={fadeAll}>
        <Tag text="THE TEAM" color={C.rosso} size={56} />
      </At>
      <At x={yr(1947)} y={250} s={pop(fr, Q.older + 0.9, 12)} o={fadeAll}>
        <Tag text="THE COMPANY" color={C.bg3} size={56} />
      </At>
      <At x={yr(1929) + 230} y={-420} s={pop(fr, Q.older + 0.5, 9)} r={-12} o={fadeAll}>
        <Tag text="OLDER" color={C.yellow} fg={C.bg0} size={60} />
      </At>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fadeAll}} width={1} height={1}>
        <path
          d={`M ${yr(1929) + 120} 300 Q ${yr(1938)} 470 ${yr(1947) - 160} 300`}
          stroke={C.muted}
          strokeWidth={8}
          fill="none"
          strokeDasharray="2 18"
          strokeLinecap="round"
          opacity={prog(fr, Q.belongs - 0.3, 0.6)}
        />
        <path d={`M ${yr(1947) - 160} 300 l -40 4 m 40 -4 l -14 36`} stroke={C.muted} strokeWidth={8} strokeLinecap="round" opacity={prog(fr, Q.belongs + 0.2, 0.3)} />
      </svg>
      <At x={yr(1938)} y={440} o={prog(fr, Q.belongs, 0.5) * fadeAll}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 52, color: C.muted, letterSpacing: 3}}>belongs to</div>
      </At>

      {/* ---- the audience below the line */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const fan = i < 3;
        const at = fan ? Q.follow + 0.4 + i * 0.12 : Q.wondering + 0.1 + (i - 3) * 0.12;
        const nod = fan && t > Q.know ? Math.sin((t - Q.know) * 9) * 4 * Math.max(0, 1 - (t - Q.know) / 2.5) : 0;
        return (
          <React.Fragment key={i}>
            <At x={yr(1938) - 610 + i * 244} y={700 + nod} s={pop(fr, at, 12)} o={fadeAll}>
              <Char size={210} outfit="shirt" shirt={fan ? C.rosso : [C.blue, C.mint, C.purple][i - 3]} hair={['#2A1E18', '#6B4A2E', '#C9A24D', '#1A1A1A', '#8A5A34', '#3A2A1E'][i]} hairStyle={i % 2 ? 'wavy' : 'short'} mood={fan ? 'smirk' : 'worried'} seed={i} look={fan ? 0.5 : -0.4} />
            </At>
            <At x={yr(1938) - 560 + i * 244} y={530} s={pop(fr, fan ? Q.know + i * 0.15 : Q.how - 0.6 + (i - 3) * 0.15, 10)} o={fadeAll}>
              <div style={{width: 76, height: 76, borderRadius: 38, background: fan ? C.mint : C.yellow, color: C.bg0, fontFamily: head, fontWeight: 700, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.35)'}}>
                {fan ? '✓' : '?'}
              </div>
            </At>
          </React.Fragment>
        );
      })}
      <At x={yr(1938) - 366} y={940} o={prog(fr, Q.follow + 0.6, 0.5) * fadeAll}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 48, color: C.muted, letterSpacing: 4}}>F1 FANS</div>
      </At>
      <At x={yr(1938) + 366} y={940} o={prog(fr, Q.wondering + 0.4, 0.5) * fadeAll}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 48, color: C.muted, letterSpacing: 4}}>EVERYONE ELSE</div>
      </At>

      {/* ---- "before?" between team and company */}
      <At x={yr(1938)} y={-300} s={pop(fr, Q.before, 11)} o={fadeAll}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 90, color: C.ink, letterSpacing: 4, textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>
          TEAM <span style={{color: C.yellow}}>BEFORE</span> COMPANY?
        </div>
      </At>

      {/* ---- the question mark's dot */}
      <At x={yr(1938)} y={330} s={pop(fr, Q.why + 0.75, 9, 0.7)}>
        <div style={{width: 150, height: 150, borderRadius: 75, background: BRAND.cyan, boxShadow: `0 0 ${60 + 30 * Math.sin(fr / 6)}px rgba(51,204,255,0.8)`}} />
      </At>
    </>
  );
};

const interpolateColor = (k: number) => {
  // asphalt → bright timeline ink
  const a = [42, 47, 72];
  const b = [245, 241, 232];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/* ---------------------------------------------------------------- brand sting */

const LETTERS = 'NOOSPHERE'.split('');

const Sting: React.FC<{cam: {x: number; y: number; z: number}}> = ({cam}) => {
  const fr = useCurrentFrame();
  const size = W * 0.19;
  const reveal = prog(fr, Q.welcome + 0.3, 0.8, Easing.bezier(0.5, 0, 0.3, 1)); // paper circle grows from inside the dot
  const unfurl = prog(fr, Q.welcome + 0.55, 0.9, outE); // OOSPHERE slides out of the N
  const focus = prog(fr, Q.welcome + 0.35, 1.2, outE); // rack focus + settle
  const wipe = prog(fr, Q.tagline - 0.15, 0.8, Easing.bezier(0.33, 0, 0.2, 1));
  const tag = prog(fr, Q.tagline + 0.35, 0.7, outE);
  if (fr < f(Q.welcome + 0.3)) return null;

  // the dot's current screen position: the paper world opens out of it
  const dotX = W / 2 + (DOT.x - cam.x) * cam.z;
  const dotY = H / 2 + (DOT.y - cam.y) * cam.z;
  const dotR = 75 * cam.z;
  const nShift = size * 1.61 * (1 - unfurl); // N starts at screen centre
  const originX = W / 2 - size * 1.61 * unfurl;
  const maxR = Math.hypot(W, H);

  const mark = (dark: boolean) => (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: wordFont,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: size * 0.012,
          whiteSpace: 'nowrap',
          transform: `translateX(${nShift}px) scale(${interpolate(reveal, [0, 1], [0.35, 1]) * (1.1 - 0.1 * focus)})`,
          filter: `blur(${(1 - focus) * 6}px)`,
        }}
      >
        {LETTERS.map((l, i) => {
          const p = i === 0 ? 1 : interpolate(unfurl, [0.05 + i * 0.06, 0.45 + i * 0.06], [0, 1], clamp);
          return (
            <span key={i} style={{display: 'inline-block', color: i === 0 ? BRAND.cyan : dark ? BRAND.white : BRAND.grey, opacity: p, transform: `translateX(${(1 - p) * -size * 0.35 * i * 0.3}px)`}}>
              {l}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          textAlign: 'center',
          fontFamily: tagFont,
          fontWeight: 800,
          fontSize: size * 0.16,
          letterSpacing: size * 0.16 * 0.08,
          color: BRAND.white,
          opacity: dark ? tag : 0,
          transform: `translateY(${size * 0.16 * 3.4 + (1 - tag) * 20}px)`,
        }}
      >
        The <span style={{color: BRAND.cyan}}>why</span> behind everything.
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{clipPath: `circle(${interpolate(reveal, [0, 1], [0, maxR * 1.2])}px at ${interpolate(reveal, [0, 1], [dotX, W / 2])}px ${interpolate(reveal, [0, 1], [dotY, H / 2])}px)`}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${BRAND.white} 0%, ${BRAND.paper} 60%, ${BRAND.paperEdge} 100%)`}} />
      {mark(false)}
      <AbsoluteFill style={{clipPath: `circle(${wipe * maxR}px at ${originX}px ${H / 2}px)`}}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${BRAND.ink} 0%, #0C0C0C 55%, ${BRAND.black} 100%)`}} />
        {mark(true)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- root */

export const ColdOpen: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const cam = camAt(t);
  const prev = camAt(Math.max(0, t - 1 / 30));
  const speed = Math.hypot(cam.x - prev.x, cam.y - prev.y) * cam.z; // screen px per frame
  const blur = Math.min(6, Math.max(0, (speed - 30) / 9)) + prog(fr, Q.welcome + 0.3, 0.6) * 8;
  const vignetteWarm = prog(fr, Q.scud, 1);

  return (
    <AbsoluteFill style={{background: C.bg0, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.bg3} 0%, ${C.bg1} 45%, ${C.bg0} 100%)`}} />
      {/* parallax dust (moves at 15% of camera speed) */}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {new Array(90).fill(0).map((_, i) => {
          const depth = 0.08 + random(`d${i}`) * 0.2;
          const x = (((random(`x${i}`) * W * 3 - cam.x * depth * cam.z) % W) + W) % W;
          const y = (((random(`y${i}`) * H * 3 - cam.y * depth * cam.z) % H) + H) % H;
          return <circle key={i} cx={x} cy={y} r={1 + random(`r${i}`) * 2.4} fill={C.ink} opacity={0.12 + 0.3 * (0.5 + 0.5 * Math.sin(fr / 20 + i))} />;
        })}
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 60% 30%, rgba(212,0,0,${0.12 * vignetteWarm}) 0%, transparent 60%)`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transform: `translate(${W / 2}px, ${H / 2}px) rotate(${cam.r}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        <World t={t} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(3,5,15,0.6) 100%)', pointerEvents: 'none'}} />
      <Sting cam={cam} />
    </AbsoluteFill>
  );
};

export const COLD_END = Q.goback - 0.05;
