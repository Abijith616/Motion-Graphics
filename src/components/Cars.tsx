/**
 * Vehicles, side view, facing right. Flat vector with selective shading:
 * vertical body gradient, one specular streak, soft contact shadow.
 * `blur` (0→1) = how fast the car is moving: wheels go from visible spokes to a motion-blurred disc,
 * the body vibrates slightly, and (optionally) dust/heat trails behind.
 */
import React, {useId} from 'react';
import {random} from 'remotion';
import {useCurrentFrame} from '../frame';
import {HORSE, HORSE_T} from '../brand/ferrariPaths';
import {C, head} from '../theme';
import {Svg} from './Art';

/** Lighten (amt>0) or darken (amt<0) a #RRGGBB colour. */
export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)));
  return `#${ch.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

const useSvgId = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, '');

/** Vertical body gradient: light top, base, dark underside. */
const BodyGrad: React.FC<{id: string; color: string}> = ({id, color}) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={shade(color, 0.28)} />
    <stop offset="0.45" stopColor={color} />
    <stop offset="1" stopColor={shade(color, -0.42)} />
  </linearGradient>
);

export const Wheel: React.FC<{x: number; y: number; r: number; spin?: number; kind?: 'wire' | 'disc' | 'f1'; spokes?: boolean; blur?: number; band?: string; hub?: string}> = ({
  x,
  y,
  r,
  spin = 0,
  kind,
  spokes = true,
  blur = 0,
  band,
  hub = '#C9CED8',
}) => {
  const k = kind ?? (spokes ? 'wire' : 'disc');
  const sharp = 1 - blur;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* tyre */}
      <circle r={r} fill="#141419" />
      <circle r={r * 0.93} fill="none" stroke="#24242C" strokeWidth={r * 0.1} />
      <path d={`M${-r * 0.75} ${-r * 0.55} A${r * 0.93} ${r * 0.93} 0 0 1 ${r * 0.2} ${-r * 0.9}`} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
      {band && <circle r={r * 0.8} fill="none" stroke={band} strokeWidth={r * 0.05} />}
      <g transform={`rotate(${spin})`}>
        {/* tread marks make rotation readable when slow */}
        {new Array(16).fill(0).map((_, i) => (
          <rect key={i} x={-r * 0.03} y={-r * 0.99} width={r * 0.06} height={r * 0.1} fill="#33333D" opacity={sharp} transform={`rotate(${i * 22.5})`} />
        ))}
        {k === 'wire' && (
          <>
            <circle r={r * 0.7} fill="#2A2B33" />
            {new Array(28).fill(0).map((_, i) => {
              const a = (i / 28) * Math.PI * 2;
              const b = a + (i % 2 ? 0.35 : -0.35);
              return <line key={i} x1={Math.cos(b) * r * 0.16} y1={Math.sin(b) * r * 0.16} x2={Math.cos(a) * r * 0.68} y2={Math.sin(a) * r * 0.68} stroke={hub} strokeWidth={r * 0.022} opacity={0.9 * sharp} />;
            })}
            <circle r={r * 0.7} fill="none" stroke={shade(hub, -0.2)} strokeWidth={r * 0.05} />
            {/* knock-off spinner */}
            <path d={`M0 ${-r * 0.24} L${r * 0.07} 0 L0 ${r * 0.24} L${-r * 0.07} 0 Z M${-r * 0.24} 0 L0 ${r * 0.07} L${r * 0.24} 0 L0 ${-r * 0.07} Z`} fill={shade(hub, 0.2)} />
          </>
        )}
        {k === 'disc' && (
          <>
            <circle r={r * 0.62} fill={shade(hub, -0.35)} />
            <circle r={r * 0.5} fill={shade(hub, -0.1)} />
            {new Array(5).fill(0).map((_, i) => (
              <circle key={i} cx={Math.cos((i / 5) * Math.PI * 2) * r * 0.32} cy={Math.sin((i / 5) * Math.PI * 2) * r * 0.32} r={r * 0.07} fill={shade(hub, -0.45)} opacity={sharp} />
            ))}
          </>
        )}
        {k === 'f1' && (
          <>
            <circle r={r * 0.66} fill="#1D1E25" />
            {new Array(10).fill(0).map((_, i) => (
              <rect key={i} x={-r * 0.035} y={-r * 0.62} width={r * 0.07} height={r * 0.46} fill="#3A3C48" opacity={sharp} transform={`rotate(${i * 36})`} />
            ))}
            <circle r={r * 0.6} fill="none" stroke="#4A4D5C" strokeWidth={r * 0.04} />
          </>
        )}
      </g>
      {/* motion blur disc */}
      <circle r={r * 0.68} fill={k === 'wire' ? shade(hub, -0.45) : '#2C2E38'} opacity={blur * 0.85} />
      <circle r={r * 0.4} fill="none" stroke="#FFFFFF" strokeOpacity={0.08 * blur} strokeWidth={r * 0.12} />
      <circle r={r * 0.15} fill={k === 'f1' ? '#C9A227' : hub} />
    </g>
  );
};

/** Dust (vintage, open roads) or heat shimmer streaks (modern) trailing behind (to the left). */
const Trail: React.FC<{kind: 'dust' | 'heat'; amount: number; groundY: number; x0: number; seed?: number}> = ({kind, amount, groundY, x0, seed = 1}) => {
  const fr = useCurrentFrame();
  if (amount <= 0.01) return null;
  return (
    <g opacity={amount}>
      {kind === 'dust'
        ? new Array(9).fill(0).map((_, i) => {
            const life = ((fr / 26 + i / 9 + random(`dl${seed}${i}`) * 0.1) % 1);
            const x = x0 - life * 260 - random(`dx${seed}${i}`) * 30;
            const y = groundY - 6 - life * 34 - random(`dy${seed}${i}`) * 12;
            const r = 10 + life * 34;
            return <circle key={i} cx={x} cy={y} r={r} fill="#CDBB98" opacity={0.42 * (1 - life)} />;
          })
        : new Array(5).fill(0).map((_, i) => {
            const y = groundY - 30 - i * 14;
            const len = 120 + random(`hl${seed}${i}`) * 160;
            return <line key={i} x1={x0 - 10} y1={y} x2={x0 - 10 - len} y2={y} stroke="#FFFFFF" strokeOpacity={0.12 + 0.08 * Math.sin(fr / 3 + i)} strokeWidth={3} strokeLinecap="round" />;
          })}
    </g>
  );
};

/** Badge: yellow shield with the horse (small, for car flanks). */
const SideBadge: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 L271 0 L271 230 Q271 340 135 368 Q0 340 0 230 Z" fill={C.yellow} stroke="#111" strokeWidth="14" />
    <rect x="0" y="0" width="271" height="26" fill={C.green} />
    <rect x="0" y="26" width="271" height="12" fill="#fff" />
    <rect x="0" y="38" width="271" height="16" fill={C.red} />
    <g transform="translate(50 60) scale(0.72)">
      {HORSE.map((d, i) => (
        <path key={i} d={d} transform={HORSE_T} fill="#0A0A0A" />
      ))}
    </g>
  </g>
);

const useVibe = (blur: number, seed = 0) => {
  const fr = useCurrentFrame();
  return blur > 0 ? Math.sin(fr * 1.9 + seed) * 1.3 * blur + Math.sin(fr * 0.7 + seed) * 0.6 * blur : 0;
};

/* ------------------------------------------------------------------ 1930s Grand Prix car */

export const VintageCar: React.FC<{size?: number; color?: string; spin?: number; badge?: boolean; num?: string; driver?: boolean; helmet?: string; flag?: string; blur?: number; dust?: number}> = ({
  size = 420,
  color = C.rosso,
  spin = 0,
  badge,
  num,
  driver = true,
  helmet = '#7A4A2A',
  blur = 0,
  dust,
}) => {
  const fr = useCurrentFrame();
  const g = useSvgId('vg');
  const chrome = useSvgId('vc');
  const vy = useVibe(blur);
  const scarf = Math.sin(fr / 2.2) * 5;
  return (
    <Svg vb="0 0 520 200" size={size}>
      <defs>
        <BodyGrad id={g} color={color} />
        <linearGradient id={chrome} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6FA" />
          <stop offset="0.5" stopColor="#9EA5B4" />
          <stop offset="1" stopColor="#5D6474" />
        </linearGradient>
      </defs>
      <Trail kind="dust" amount={dust ?? blur * 0.9} groundY={188} x0={60} />
      <ellipse cx="262" cy="191" rx="232" ry="8" fill="#000" opacity="0.3" />
      <g transform={`translate(0 ${vy})`}>
        {/* driver: shoulders, arms to the wheel, leather helmet, goggles, scarf */}
        {driver && (
          <g>
            <path d={`M206 70 Q190 ${64 + scarf} 168 ${70 + scarf * 1.4} Q186 ${74 + scarf} 204 78 Z`} fill="#F2EDE2" />
            <path d="M206 92 Q206 66 232 62 Q258 62 260 88 L260 94 Z" fill="#3A3330" />
            <path d="M240 82 Q262 76 276 78" stroke="#3A3330" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="280" cy="78" r="6" fill={C.skin} />
            <circle cx="236" cy="52" r="20" fill={C.skin} />
            <path d="M215 54 Q214 30 236 30 Q258 30 258 50 Q246 42 226 46 Z" fill={helmet} />
            <path d="M216 56 Q214 66 222 70" stroke={helmet} strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="234" y="42" width="26" height="11" rx="5" fill="#2A2420" />
            <circle cx="250" cy="47.5" r="4.2" fill="#BFE4FF" />
            <circle cx="249" cy="46.5" r="1.4" fill="#fff" />
          </g>
        )}
        {/* steering wheel rim + windscreen */}
        <ellipse cx="282" cy="80" rx="4" ry="14" fill="none" stroke="#2A2A30" strokeWidth="3.5" />
        <path d="M268 82 L276 66 L292 66 L290 84 Z" fill="#CFE9FF" opacity="0.55" />
        {/* body */}
        <path d="M24 118 C30 96 70 88 130 86 L196 84 C206 72 222 68 240 68 L262 70 C272 72 276 80 280 86 L430 86 C462 87 478 96 484 108 L488 126 C488 136 480 142 468 142 L70 144 C40 144 24 134 24 118 Z" fill={`url(#${g})`} />
        <path d="M70 94 C140 88 300 88 440 92" stroke="#fff" strokeOpacity="0.38" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M206 86 L206 140 M330 88 L330 140" stroke={shade(color, -0.35)} strokeWidth="1.5" opacity="0.6" />
        {/* bonnet louvres */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${352 + i * 13} 100 l7 16`} stroke={shade(color, -0.45)} strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* radiator shell + grille */}
        <path d="M474 94 Q494 96 494 118 Q494 140 474 142 Z" fill={`url(#${chrome})`} />
        <path d="M478 100 Q489 102 489 118 Q489 134 478 136 Z" fill="#26262E" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="479" y1={104 + i * 7} x2="487" y2={104 + i * 7} stroke="#6C7282" strokeWidth="1.3" />
        ))}
        {/* exhaust */}
        <path d="M300 128 C260 132 190 134 120 132" stroke={`url(#${chrome})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="120" cy="132" r="4" fill="#2A2A30" />
        {num && (
          <g>
            <circle cx="98" cy="114" r="18" fill="#F7F3EA" />
            <circle cx="98" cy="114" r="18" fill="none" stroke={shade(color, -0.4)} strokeWidth="2" />
            <text x="98" y="122.5" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="23" fill="#16161C">
              {num}
            </text>
          </g>
        )}
        {badge && <SideBadge x={334} y={96} s={0.1} />}
      </g>
      <Wheel x={128} y={146} r={44} spin={spin} kind="wire" blur={blur} />
      <Wheel x={418} y={146} r={44} spin={spin} kind="wire" blur={blur} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ modern Formula One car */

export const F1Car: React.FC<{size?: number; color?: string; accent?: string; spin?: number; num?: string; blur?: number; trail?: number}> = ({
  size = 520,
  color = C.rosso,
  accent = '#111',
  spin = 0,
  num,
  blur = 0,
  trail,
}) => {
  const g = useSvgId('fg');
  const vy = useVibe(blur, 2) * 0.6;
  const dark = shade(color, -0.5);
  return (
    <Svg vb="0 0 640 180" size={size}>
      <defs>
        <BodyGrad id={g} color={color} />
      </defs>
      <Trail kind="heat" amount={trail ?? blur * 0.8} groundY={150} x0={30} seed={3} />
      <ellipse cx="320" cy="172" rx="300" ry="7" fill="#000" opacity="0.32" />
      <g transform={`translate(0 ${vy})`}>
        {/* rear wing: endplate, main plane + DRS flap, beam wing */}
        <path d="M18 34 L70 34 L70 112 L30 112 Q18 112 18 100 Z" fill={dark} />
        <path d="M22 36 L92 38 L92 50 L22 50 Z" fill={`url(#${g})`} />
        <path d="M24 54 L90 56 L90 64 L24 62 Z" fill={accent} />
        <path d="M40 96 L96 100 L96 106 L40 104 Z" fill={accent} />
        <rect x="88" y="60" width="8" height="52" fill={accent} />
        {/* floor + plank + diffuser */}
        <path d="M40 132 L598 130 L606 138 L46 142 Z" fill="#17171D" />
        <path d="M34 120 L72 112 L82 138 L40 142 Z" fill="#202028" />
        {/* engine cover → airbox → shark fin */}
        <path d="M86 112 C120 96 180 82 240 74 L262 56 C266 50 276 48 286 50 L298 54 L304 82 L440 88 L440 128 L86 130 Z" fill={`url(#${g})`} />
        <path d="M100 100 C150 84 210 72 262 56" stroke={accent} strokeWidth="5" fill="none" opacity="0.85" />
        <path d="M268 56 Q278 52 290 55 L292 70 L270 70 Z" fill="#101014" />
        {/* sidepod with undercut */}
        <path d="M200 98 C250 90 330 90 392 96 L400 122 C340 126 260 128 210 126 Z" fill={shade(color, 0.08)} />
        <path d="M206 120 C270 126 340 124 398 120 L400 128 L210 130 Z" fill={shade(color, -0.45)} />
        <path d="M222 98 L262 96 L264 106 L224 108 Z" fill="#101014" />
        {/* cockpit, helmet, halo */}
        <path d="M300 84 Q330 72 372 74 L388 86 Z" fill="#101014" />
        <circle cx="348" cy="72" r="15" fill={C.yellow} />
        <path d="M336 70 Q348 62 362 68 L362 76 L336 76 Z" fill="#14141A" />
        <path d="M350 70 L360 70" stroke="#6FD3FF" strokeWidth="2" />
        <path d="M318 82 Q344 52 384 60 L392 84" stroke="#202028" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M388 86 L450 90 C520 100 570 112 604 120 L606 128 L440 130 Z" fill={`url(#${g})`} />
        <path d="M420 96 C480 100 540 110 600 120" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" fill="none" />
        {/* front wing: elements + endplate */}
        <path d="M548 132 L640 128 L640 136 L548 140 Z" fill={accent} />
        <path d="M556 124 L636 120 L636 127 L556 130 Z" fill={`url(#${g})`} />
        <path d="M624 112 L640 112 L640 140 L622 140 Z" fill={dark} />
        {/* livery stripe + highlight */}
        <path d="M150 96 C220 86 300 84 340 86" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" fill="none" />
        <path d="M120 116 L440 112" stroke={accent} strokeWidth="6" opacity="0.6" />
        {num && (
          <text x="470" y="114" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="24" fill="#fff">
            {num}
          </text>
        )}
        {/* suspension arms */}
        <path d="M470 108 L500 128 M478 118 L500 130" stroke="#22222A" strokeWidth="3" />
        <path d="M150 112 L122 126 M160 120 L122 130" stroke="#22222A" strokeWidth="3" />
      </g>
      <Wheel x={122} y={128} r={41} spin={spin} kind="f1" blur={blur} band="#E8C547" />
      <Wheel x={500} y={130} r={37} spin={spin} kind="f1" blur={blur} band="#E8C547" />
    </Svg>
  );
};

/* ------------------------------------------------------------------ the 1947 125 S */

/** Bare ladder frame + V12; `bodywork` 0→1 fades in a red cycle-wing spider body. */
export const Car125: React.FC<{size?: number; spin?: number; bodywork?: number; driver?: boolean; badge?: boolean; blur?: number; dust?: number}> = ({
  size = 460,
  spin = 0,
  bodywork = 0,
  driver = true,
  badge,
  blur = 0,
  dust,
}) => {
  const g = useSvgId('cg');
  const vy = useVibe(blur, 4);
  return (
    <Svg vb="0 0 520 200" size={size}>
      <defs>
        <BodyGrad id={g} color={C.rosso} />
      </defs>
      <Trail kind="dust" amount={dust ?? blur * 0.6} groundY={188} x0={70} seed={5} />
      <ellipse cx="265" cy="192" rx="230" ry="7" fill="#000" opacity="0.3" />
      <g transform={`translate(0 ${vy})`}>
        {/* ladder frame */}
        <path d="M60 128 L470 128" stroke="#9AA1B2" strokeWidth="8" strokeLinecap="round" />
        <path d="M80 128 L120 96 L420 96 L460 128" stroke="#B8BECC" strokeWidth="5" fill="none" strokeLinejoin="round" />
        {[150, 210, 300, 380].map((x) => (
          <line key={x} x1={x} y1="96" x2={x - 12} y2="128" stroke="#B8BECC" strokeWidth="4" />
        ))}
        <rect x="444" y="78" width="26" height="52" rx="5" fill="#5B6072" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="448" y1={84 + i * 9} x2="466" y2={84 + i * 9} stroke="#8D93A6" strokeWidth="2" />
        ))}
        {/* V12: block, red cam covers, plugs, exhaust headers */}
        <rect x="300" y="72" width="130" height="50" rx="8" fill="#7C8294" />
        <rect x="300" y="72" width="130" height="10" rx="5" fill="#9CA2B4" />
        <rect x="306" y="60" width="118" height="16" rx="6" fill={C.rosso} />
        <rect x="306" y="60" width="118" height="5" rx="2" fill="#fff" opacity="0.3" />
        {new Array(6).fill(0).map((_, i) => (
          <circle key={i} cx={318 + i * 19} cy="68" r="3" fill="#F2D9A0" />
        ))}
        {new Array(6).fill(0).map((_, i) => (
          <path key={i} d={`M${314 + i * 19} 112 Q${300 + i * 12} 140 ${180 + i * 6} 136`} stroke="#C9CED8" strokeWidth="3" fill="none" opacity="0.8" />
        ))}
        <path d="M190 120 L196 80 Q200 70 212 72 L218 120 Z" fill="#6B3A1F" />
        <line x1="262" y1="104" x2="290" y2="74" stroke="#2A2A30" strokeWidth="5" />
        <ellipse cx="262" cy="74" rx="6" ry="20" fill="none" stroke="#2A2A30" strokeWidth="5" transform="rotate(-30 262 74)" />
        {driver && (
          <g>
            <path d="M206 96 Q208 66 226 62 Q246 60 248 84 L248 98 Z" fill="#E9E4D8" />
            <circle cx="226" cy="52" r="19" fill={C.skin} />
            <path d="M207 52 Q207 31 227 31 Q246 31 246 50 Q234 42 214 48 Z" fill="#2A1E18" />
            <rect x="226" y="44" width="22" height="9" rx="4" fill="#1D1D24" />
            <circle cx="240" cy="48.5" r="3.4" fill="#BFE4FF" />
            <path d="M232 96 L258 80" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
          </g>
        )}
        {/* bodywork: spider body + cycle wings */}
        <g opacity={bodywork}>
          <path d="M40 124 C44 100 90 92 140 90 L196 88 C206 76 220 74 232 74 L262 76 L278 88 L440 88 C474 90 486 100 488 116 C490 134 480 140 466 140 L66 142 C46 142 40 136 40 124 Z" fill={`url(#${g})`} />
          <path d="M60 98 C150 90 320 90 470 96" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M72 96 Q128 64 184 96 L176 100 Q128 76 80 100 Z" fill={`url(#${g})`} />
          <path d="M362 96 Q418 64 474 96 L466 100 Q418 76 370 100 Z" fill={`url(#${g})`} />
          <path d="M474 98 Q492 100 492 118 Q492 136 474 138 Z" fill="#26262E" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="476" y1={104 + i * 8} x2="488" y2={104 + i * 8} stroke="#8A90A0" strokeWidth="1.5" />
          ))}
          <path d="M264 80 L272 66 L290 66 L288 84 Z" fill="#CFE9FF" opacity="0.55" />
          {badge && <SideBadge x={336} y={100} s={0.095} />}
        </g>
      </g>
      <Wheel x={128} y={146} r={42} spin={spin} kind="wire" blur={blur} />
      <Wheel x={418} y={146} r={42} spin={spin} kind="wire" blur={blur} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ road cars */

export const RoadCar: React.FC<{size?: number; color?: string; spin?: number; badge?: boolean; blur?: number}> = ({size = 440, color = C.rosso, spin = 0, badge, blur = 0}) => {
  const g = useSvgId('rg');
  const vy = useVibe(blur, 6) * 0.5;
  return (
    <Svg vb="0 0 520 200" size={size}>
      <defs>
        <BodyGrad id={g} color={color} />
      </defs>
      <ellipse cx="260" cy="190" rx="232" ry="7" fill="#000" opacity="0.3" />
      <g transform={`translate(0 ${vy})`}>
        <path d="M30 140 C26 114 52 106 74 104 L150 96 C186 62 220 54 252 54 L318 56 C350 60 372 76 392 94 L456 102 C492 108 498 122 496 136 L492 150 L36 152 Z" fill={`url(#${g})`} />
        <path d="M168 96 C196 68 222 64 252 64 L300 65 L302 96 Z" fill="#BFE4FF" opacity="0.85" />
        <path d="M312 66 C342 70 360 80 376 96 L312 96 Z" fill="#BFE4FF" opacity="0.85" />
        <path d="M190 72 L214 66" stroke="#fff" strokeWidth="4" opacity="0.7" strokeLinecap="round" />
        <path d="M60 112 C180 102 360 102 480 112" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" fill="none" />
        <path d="M36 140 L494 140 L492 150 L36 152 Z" fill="#000" opacity="0.25" />
        {/* chrome bumper, oval grille, round lamp, door line + handle */}
        <path d="M470 140 L500 138" stroke="#E8EBF2" strokeWidth="6" strokeLinecap="round" />
        <path d="M30 142 L60 142" stroke="#E8EBF2" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="492" cy="124" rx="6" ry="11" fill="#26262E" />
        <circle cx="478" cy="112" r="7" fill="#FFF3C4" stroke="#E8EBF2" strokeWidth="2" />
        <path d="M304 100 L306 146" stroke={shade(color, -0.4)} strokeWidth="2" />
        <rect x="284" y="108" width="16" height="4" rx="2" fill="#E6E6E6" />
        {badge && <SideBadge x={420} y={104} s={0.055} />}
      </g>
      <Wheel x={118} y={150} r={36} spin={spin} kind="wire" blur={blur} hub="#DADDE6" />
      <Wheel x={410} y={150} r={36} spin={spin} kind="wire" blur={blur} hub="#DADDE6" />
    </Svg>
  );
};

/** Plain family car (for "it isn't a family car"). */
export const FamilyCar: React.FC<{size?: number; color?: string}> = ({size = 360, color = '#7A8BA8'}) => {
  const g = useSvgId('mg');
  return (
    <Svg vb="0 0 420 200" size={size}>
      <defs>
        <BodyGrad id={g} color={color} />
      </defs>
      <ellipse cx="210" cy="188" rx="190" ry="7" fill="#000" opacity="0.25" />
      <path d="M24 150 L24 116 Q26 96 60 92 L110 88 Q140 44 200 42 L270 44 Q320 48 344 90 L384 96 Q400 100 400 120 L400 150 Z" fill={`url(#${g})`} />
      <path d="M124 88 Q150 54 200 52 L232 52 L232 88 Z M244 52 L270 53 Q310 56 328 88 L244 88 Z" fill="#BFE4FF" opacity="0.8" />
      <Wheel x={100} y={152} r={30} kind="disc" />
      <Wheel x={320} y={152} r={30} kind="disc" />
    </Svg>
  );
};
