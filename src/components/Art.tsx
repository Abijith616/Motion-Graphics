import React from 'react';
import {useCurrentFrame} from '../frame';
import {C, body, head} from '../theme';

type SvgP = {size?: number; children?: React.ReactNode};
export const Svg: React.FC<SvgP & {vb: string; w?: number; h?: number}> = ({vb, size = 300, children}) => {
  const [, , vw, vh] = vb.split(' ').map(Number);
  return (
    <svg viewBox={vb} width={size} height={(size * vh) / vw} style={{overflow: 'visible'}}>
      {children}
    </svg>
  );
};

const blink = (frame: number, seed = 0) => ((frame + seed * 37) % 110 < 4 ? 0.15 : 1);

/** Round-headed character. `role` changes outfit. */
export const Person: React.FC<{
  size?: number;
  shirt?: string;
  skin?: string;
  hair?: string;
  role?: 'plain' | 'coat' | 'judge' | 'suit' | 'kid';
  mood?: 'neutral' | 'happy' | 'worried' | 'shock';
  seed?: number;
  look?: number;
}> = ({size = 200, shirt = C.blue, skin = C.skin, hair = '#3A2A2A', role = 'plain', mood = 'neutral', seed = 0, look = 0}) => {
  const frame = useCurrentFrame();
  const b = blink(frame, seed);
  const breathe = Math.sin(frame / 18 + seed) * 2;
  const body_ = role === 'judge' ? '#1B1F33' : role === 'coat' ? '#F2F6FF' : shirt;
  return (
    <Svg vb="0 0 200 300" size={size}>
      <ellipse cx="100" cy="292" rx="70" ry="8" fill="#000" opacity="0.25" />
      <path d={`M30 290 Q30 ${170 + breathe} 100 ${165 + breathe} Q170 ${170 + breathe} 170 290 Z`} fill={body_} />
      {role === 'coat' && (
        <>
          <path d={`M100 ${168 + breathe} L86 290 L114 290 Z`} fill={shirt} />
          <rect x="120" y="215" width="26" height="18" rx="4" fill="#D5DEEF" />
        </>
      )}
      {role === 'suit' && (
        <>
          <path d={`M78 ${170 + breathe} L100 230 L122 ${170 + breathe} Z`} fill="#fff" />
          <path d="M100 185 L92 200 L100 250 L108 200 Z" fill={C.red} />
        </>
      )}
      {role === 'judge' && <path d={`M80 ${170 + breathe} L100 205 L120 ${170 + breathe} Z`} fill="#fff" />}
      <circle cx="100" cy={110 + breathe * 0.6} r="62" fill={skin} />
      {role === 'judge' ? (
        <path d={`M38 ${110 + breathe * 0.6} Q36 40 100 42 Q164 40 162 ${110 + breathe * 0.6} L170 160 Q150 140 152 105 Q140 70 100 70 Q60 70 48 105 Q50 140 30 160 Z`} fill="#F0F0F0" />
      ) : (
        <path d={`M40 ${100 + breathe * 0.6} Q42 46 100 46 Q158 46 160 ${100 + breathe * 0.6} Q140 70 100 72 Q60 70 40 ${100 + breathe * 0.6}`} fill={hair} />
      )}
      <g transform={`translate(${look * 8} ${breathe * 0.6})`}>
        <ellipse cx="78" cy="112" rx="8" ry={10 * b * (mood === 'shock' ? 1.3 : 1)} fill="#1A1A2E" />
        <ellipse cx="122" cy="112" rx="8" ry={10 * b * (mood === 'shock' ? 1.3 : 1)} fill="#1A1A2E" />
        {mood === 'happy' && <path d="M82 138 Q100 156 118 138" stroke="#1A1A2E" strokeWidth="5" fill="none" strokeLinecap="round" />}
        {mood === 'neutral' && <path d="M88 142 L112 142" stroke="#1A1A2E" strokeWidth="5" strokeLinecap="round" />}
        {mood === 'worried' && (
          <>
            <path d="M86 146 Q100 136 114 146" stroke="#1A1A2E" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M66 94 L88 98 M134 94 L112 98" stroke="#1A1A2E" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {mood === 'shock' && <ellipse cx="100" cy="146" rx="9" ry="12" fill="#1A1A2E" />}
      </g>
    </Svg>
  );
};

/** Old rotary telephone. */
export const Phone: React.FC<{size?: number; color?: string; ring?: boolean}> = ({size = 260, color = C.blue, ring}) => {
  const frame = useCurrentFrame();
  const shake = ring ? Math.sin(frame * 2.2) * 4 : 0;
  return (
    <Svg vb="0 0 260 220" size={size}>
      <ellipse cx="130" cy="212" rx="110" ry="8" fill="#000" opacity="0.25" />
      <path d="M30 200 L55 110 Q60 95 80 95 L180 95 Q200 95 205 110 L230 200 Z" fill={color} />
      <path d="M30 200 L230 200 L226 186 L34 186 Z" fill="#000" opacity="0.18" />
      <circle cx="130" cy="150" r="40" fill="#fff" opacity="0.92" />
      {new Array(10).fill(0).map((_, i) => {
        const a = (i / 10) * Math.PI * 1.6 + 0.5;
        return <circle key={i} cx={130 + Math.cos(a) * 26} cy={150 + Math.sin(a) * 26} r="6" fill={color} opacity="0.7" />;
      })}
      <circle cx="130" cy="150" r="10" fill={color} />
      <g transform={`rotate(${shake} 130 70)`}>
        <path d="M20 70 Q20 40 50 40 L210 40 Q240 40 240 70 L240 82 Q240 92 228 92 L200 92 Q190 92 190 82 L190 72 L70 72 L70 82 Q70 92 60 92 L32 92 Q20 92 20 82 Z" fill={color} />
        <path d="M20 70 Q20 40 50 40 L210 40 Q240 40 240 70 L70 66 Z" fill="#fff" opacity="0.15" />
      </g>
    </Svg>
  );
};

/** Corporate tower (AT&T / Bell). */
export const Tower: React.FC<{size?: number; color?: string; label?: string; lit?: number}> = ({size = 360, color = C.blue, label, lit = 1}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 240 420" size={size}>
      <ellipse cx="120" cy="414" rx="115" ry="8" fill="#000" opacity="0.25" />
      <rect x="40" y="70" width="160" height="340" rx="6" fill={color} />
      <rect x="40" y="70" width="40" height="340" fill="#fff" opacity="0.07" />
      <rect x="160" y="70" width="40" height="340" fill="#000" opacity="0.15" />
      <path d="M40 70 L120 20 L200 70 Z" fill={color} />
      <path d="M120 20 L200 70 L160 70 Z" fill="#000" opacity="0.15" />
      <rect x="117" y="0" width="6" height="24" fill={C.muted} />
      <circle cx="120" cy="0" r="6" fill={C.red} opacity={0.5 + 0.5 * Math.sin(frame / 8)} />
      {new Array(9).fill(0).map((_, r) =>
        new Array(4).fill(0).map((__, c) => {
          const on = ((r * 7 + c * 3) % 5 !== 0 ? 1 : 0.25) * lit;
          return <rect key={`${r}${c}`} x={55 + c * 36} y={95 + r * 34} width="22" height="18" rx="3" fill={C.gold} opacity={0.2 + 0.7 * on} />;
        }),
      )}
      <rect x="95" y="370" width="50" height="40" rx="4" fill="#0B1230" />
      {label && (
        <text x="120" y="62" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="26" fill="#fff">
          {label}
        </text>
      )}
    </Svg>
  );
};

/** University campus building with a clock tower (Berkeley). */
export const Campus: React.FC<{size?: number; color?: string; accent?: string}> = ({size = 460, color = '#E9E2CF', accent = C.blue}) => (
  <Svg vb="0 0 460 360" size={size}>
    <ellipse cx="230" cy="352" rx="225" ry="8" fill="#000" opacity="0.25" />
    <rect x="200" y="40" width="60" height="300" fill={color} />
    <rect x="230" y="40" width="30" height="300" fill="#000" opacity="0.08" />
    <path d="M194 40 L230 0 L266 40 Z" fill={accent} />
    <circle cx="230" cy="80" r="18" fill="#fff" stroke={accent} strokeWidth="5" />
    <path d="M230 80 L230 68 M230 80 L239 84" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    <rect x="214" y="110" width="32" height="50" rx="16" fill={accent} opacity="0.6" />
    <rect x="20" y="170" width="420" height="170" fill={color} />
    <rect x="20" y="170" width="420" height="22" fill={accent} />
    <path d="M10 170 L230 120 L450 170 Z" fill={color} />
    <path d="M230 120 L450 170 L230 170 Z" fill="#000" opacity="0.08" />
    {new Array(7).fill(0).map((_, i) => (
      <rect key={i} x={45 + i * 56} y="205" width="18" height="135" fill="#fff" opacity="0.55" />
    ))}
    {new Array(6).fill(0).map((_, i) => (
      <rect key={i} x={70 + i * 56} y="225" width="22" height="40" rx="11" fill={accent} opacity="0.35" />
    ))}
    <rect x="205" y="285" width="50" height="55" rx="25" fill="#2A2F45" />
  </Svg>
);

/** CRT terminal with scrolling text lines. */
export const Terminal: React.FC<{size?: number; color?: string; screen?: string; lines?: number; text?: string}> = ({size = 320, color = '#D9D2BE', screen = C.mint, lines = 6, text}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 300 290" size={size}>
      <ellipse cx="150" cy="282" rx="130" ry="8" fill="#000" opacity="0.25" />
      <rect x="20" y="10" width="260" height="210" rx="22" fill={color} />
      <rect x="20" y="180" width="260" height="40" rx="0" fill="#000" opacity="0.08" />
      <rect x="45" y="32" width="210" height="150" rx="14" fill="#0B1A16" />
      {text ? (
        <text x="150" y="118" textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize="40" fill={screen}>
          {text}
        </text>
      ) : (
        new Array(lines).fill(0).map((_, i) => {
          const w = 40 + ((i * 53 + Math.floor(frame / 6) * 17) % 120);
          return <rect key={i} x="62" y={48 + i * 20} width={w} height="9" rx="4" fill={screen} opacity={0.85} />;
        })
      )}
      <rect x="62" y={48 + lines * 20} width="12" height="12" fill={screen} opacity={Math.floor(frame / 12) % 2} />
      <rect x="110" y="220" width="80" height="30" fill={color} />
      <rect x="40" y="250" width="220" height="30" rx="10" fill={color} />
      <rect x="40" y="250" width="220" height="10" fill="#000" opacity="0.1" />
    </Svg>
  );
};

/** 90s beige desktop PC with monitor. */
export const PC: React.FC<{size?: number; screen?: string; children?: React.ReactNode}> = ({size = 320, screen = C.cyan}) => (
  <Svg vb="0 0 320 300" size={size}>
    <ellipse cx="160" cy="292" rx="150" ry="8" fill="#000" opacity="0.25" />
    <rect x="10" y="230" width="300" height="56" rx="8" fill="#E2DAC4" />
    <rect x="210" y="248" width="70" height="8" rx="4" fill="#9C947E" />
    <circle cx="40" cy="258" r="7" fill={C.mint} />
    <rect x="50" y="20" width="220" height="190" rx="16" fill="#E2DAC4" />
    <rect x="68" y="36" width="184" height="140" rx="8" fill="#0D1636" />
    <rect x="80" y="50" width="70" height="10" rx="5" fill={screen} />
    <rect x="80" y="70" width="140" height="8" rx="4" fill={screen} opacity="0.6" />
    <rect x="80" y="86" width="110" height="8" rx="4" fill={screen} opacity="0.6" />
    <rect x="80" y="102" width="150" height="8" rx="4" fill={screen} opacity="0.6" />
    <rect x="130" y="210" width="60" height="20" fill="#CFC6AE" />
  </Svg>
);

/** Magnetic tape reel. */
export const TapeReel: React.FC<{size?: number; spin?: number; color?: string}> = ({size = 220, spin = 0, color = C.gold}) => (
  <Svg vb="0 0 220 220" size={size}>
    <g transform={`rotate(${spin} 110 110)`}>
      <circle cx="110" cy="110" r="104" fill="#2B3352" />
      <circle cx="110" cy="110" r="88" fill="#4A3B2A" />
      <circle cx="110" cy="110" r="52" fill={color} />
      {[0, 120, 240].map((a) => (
        <circle key={a} cx={110 + Math.cos((a * Math.PI) / 180) * 30} cy={110 + Math.sin((a * Math.PI) / 180) * 30} r="12" fill="#2B3352" />
      ))}
      <circle cx="110" cy="110" r="10" fill="#fff" />
    </g>
    <text x="110" y="214" textAnchor="middle" fontFamily={body} fontWeight={900} fontSize="0">
      tape
    </text>
  </Svg>
);

/** Document / source file. state: plain | dirty (red AT&T mark) | clean (green check) */
export const Doc: React.FC<{size?: number; color?: string; state?: 'plain' | 'dirty' | 'clean' | 'code'; label?: string}> = ({size = 120, color = '#F4F7FF', state = 'plain', label}) => (
  <Svg vb="0 0 100 130" size={size}>
    <path d="M8 4 L68 4 L92 28 L92 122 Q92 126 88 126 L12 126 Q8 126 8 122 Z" fill={color} />
    <path d="M68 4 L68 28 L92 28 Z" fill="#000" opacity="0.15" />
    {[42, 56, 70, 84, 98].map((y, i) => (
      <rect key={y} x="20" y={y} width={i % 2 ? 44 : 60} height="7" rx="3.5" fill={state === 'code' ? (i % 2 ? C.cyan : C.purple) : '#9AA6C4'} opacity="0.8" />
    ))}
    {state === 'dirty' && (
      <>
        <circle cx="74" cy="104" r="18" fill={C.red} />
        <path d="M66 96 L82 112 M82 96 L66 112" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </>
    )}
    {state === 'clean' && (
      <>
        <circle cx="74" cy="104" r="18" fill={C.mint} />
        <path d="M65 104 L72 111 L84 97" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
    {label && (
      <text x="50" y="26" textAnchor="middle" fontFamily={body} fontWeight={900} fontSize="13" fill="#5A6788">
        {label}
      </text>
    )}
  </Svg>
);

/** Gavel. `swing` 0..1 rotates down. */
export const Gavel: React.FC<{size?: number; swing?: number}> = ({size = 260, swing = 0}) => (
  <Svg vb="0 0 260 220" size={size}>
    <ellipse cx="170" cy="205" rx="70" ry="10" fill="#000" opacity="0.25" />
    <rect x="110" y="180" width="120" height="24" rx="8" fill="#7A4E35" />
    <rect x="110" y="180" width="120" height="8" rx="4" fill="#fff" opacity="0.15" />
    <g transform={`rotate(${-35 + swing * 35} 60 150)`}>
      <rect x="40" y="140" width="150" height="16" rx="8" fill="#8E5D3E" />
      <rect x="150" y="100" width="50" height="96" rx="12" fill="#A86E48" />
      <rect x="150" y="100" width="50" height="16" rx="6" fill={C.gold} />
      <rect x="150" y="180" width="50" height="16" rx="6" fill={C.gold} />
    </g>
  </Svg>
);

/** Courthouse with columns. */
export const Courthouse: React.FC<{size?: number; color?: string}> = ({size = 420, color = '#E8ECF8'}) => (
  <Svg vb="0 0 420 320" size={size}>
    <ellipse cx="210" cy="312" rx="205" ry="8" fill="#000" opacity="0.25" />
    <path d="M10 100 L210 10 L410 100 Z" fill={color} />
    <path d="M210 10 L410 100 L210 100 Z" fill="#000" opacity="0.08" />
    <circle cx="210" cy="66" r="18" fill={C.purple} />
    <rect x="20" y="100" width="380" height="24" fill={color} />
    {new Array(6).fill(0).map((_, i) => (
      <g key={i}>
        <rect x={42 + i * 64} y="124" width="34" height="150" fill={color} />
        <rect x={62 + i * 64} y="124" width="14" height="150" fill="#000" opacity="0.08" />
      </g>
    ))}
    <rect x="10" y="274" width="400" height="20" fill={color} />
    <rect x="0" y="294" width="420" height="18" fill="#CBD2E6" />
  </Svg>
);

/** Balance scale; tilt in degrees (positive = right side down). */
export const Scales: React.FC<{size?: number; tilt?: number; color?: string}> = ({size = 300, tilt = 0, color = C.gold}) => {
  const rad = (tilt * Math.PI) / 180;
  const lx = 150 - Math.cos(rad) * 110;
  const ly = 70 - Math.sin(rad) * 110;
  const rx = 150 + Math.cos(rad) * 110;
  const ry = 70 + Math.sin(rad) * 110;
  return (
    <Svg vb="0 0 300 300" size={size}>
      <rect x="143" y="60" width="14" height="210" rx="7" fill={color} />
      <path d="M90 290 L210 290 L190 262 L110 262 Z" fill={color} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={color} strokeWidth="10" strokeLinecap="round" />
      <circle cx="150" cy="60" r="14" fill={color} />
      {[
        [lx, ly],
        [rx, ry],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x - 40} y2={y + 80} stroke={color} strokeWidth="3" />
          <line x1={x} y1={y} x2={x + 40} y2={y + 80} stroke={color} strokeWidth="3" />
          <path d={`M${x - 50} ${y + 80} L${x + 50} ${y + 80} Q${x} ${y + 120} ${x - 50} ${y + 80}`} fill={color} />
        </g>
      ))}
    </Svg>
  );
};

export const PriceTag: React.FC<{size?: number; text: string; color?: string}> = ({size = 300, text, color = C.gold}) => (
  <Svg vb="0 0 300 150" size={size}>
    <path d="M60 10 L280 10 Q290 10 290 20 L290 130 Q290 140 280 140 L60 140 L10 75 Z" fill={color} />
    <circle cx="50" cy="75" r="11" fill={C.bg1} />
    <text x="170" y="96" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="58" fill={C.bg0}>
      {text}
    </text>
  </Svg>
);

/** Newspaper with headline bars. */
export const Newspaper: React.FC<{size?: number; title?: string}> = ({size = 320, title = 'THE JOURNAL'}) => (
  <Svg vb="0 0 300 380" size={size}>
    <rect x="0" y="0" width="300" height="380" rx="6" fill="#F2EEE3" />
    <text x="150" y="44" textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize="30" fill="#222">
      {title}
    </text>
    <rect x="20" y="58" width="260" height="3" fill="#222" />
    <rect x="20" y="75" width="260" height="24" rx="2" fill="#333" />
    <rect x="20" y="108" width="125" height="110" fill="#C9C3B2" />
    {new Array(8).fill(0).map((_, i) => (
      <rect key={i} x="155" y={110 + i * 14} width={i % 3 === 2 ? 80 : 125} height="6" fill="#999" />
    ))}
    {new Array(9).fill(0).map((_, i) => (
      <rect key={i} x="20" y={232 + i * 15} width={i % 4 === 3 ? 160 : 260} height="6" fill="#999" />
    ))}
  </Svg>
);

/** Globe with network arcs (internet). */
export const Globe: React.FC<{size?: number; color?: string}> = ({size = 300, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const sh = (frame * 0.6) % 100;
  return (
    <Svg vb="0 0 300 300" size={size}>
      <circle cx="150" cy="150" r="130" fill={C.blueDeep} />
      <clipPath id="gclip">
        <circle cx="150" cy="150" r="130" />
      </clipPath>
      <g clipPath="url(#gclip)">
        {[-100, 0, 100].map((o) => (
          <g key={o} transform={`translate(${o + sh - 50} 0)`}>
            <path d="M60 90 Q90 60 130 80 Q150 120 110 140 Q80 150 70 120 Z" fill={C.mint} opacity="0.85" />
            <path d="M150 170 Q190 150 210 190 Q200 240 170 240 Q140 220 150 170 Z" fill={C.mint} opacity="0.85" />
          </g>
        ))}
        <circle cx="190" cy="110" r="130" fill="#000" opacity="0.12" />
      </g>
      <circle cx="150" cy="150" r="130" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
      <ellipse cx="150" cy="150" rx="150" ry="50" fill="none" stroke={color} strokeWidth="3" strokeDasharray="4 10" transform={`rotate(-20 150 150)`} />
    </Svg>
  );
};

/** Penguin (stands for Linux). */
export const Penguin: React.FC<{size?: number; small?: boolean}> = ({size = 240, small}) => {
  const frame = useCurrentFrame();
  const b = blink(frame, 3);
  const wing = Math.sin(frame / 10) * 6;
  return (
    <Svg vb="0 0 200 250" size={size}>
      <ellipse cx="100" cy="244" rx="70" ry="7" fill="#000" opacity="0.25" />
      <ellipse cx="100" cy="150" rx="72" ry="90" fill="#1E2233" />
      <ellipse cx="100" cy="165" rx="50" ry="70" fill="#F5F7FF" />
      <path d={`M30 130 Q${10 - wing} 180 40 200`} stroke="#1E2233" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d={`M170 130 Q${190 + wing} 180 160 200`} stroke="#1E2233" strokeWidth="18" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="95" rx="9" ry={11 * b} fill="#1E2233" />
      <ellipse cx="120" cy="95" rx="9" ry={11 * b} fill="#1E2233" />
      <circle cx="83" cy="92" r="3" fill="#fff" opacity={b} />
      <circle cx="123" cy="92" r="3" fill="#fff" opacity={b} />
      <path d="M85 112 Q100 104 115 112 Q100 128 85 112 Z" fill={C.gold} />
      <ellipse cx="70" cy="240" rx="24" ry="9" fill={C.gold} />
      <ellipse cx="130" cy="240" rx="24" ry="9" fill={C.gold} />
      {small && <circle cx="100" cy="40" r="0" />}
    </Svg>
  );
};

/** FreeBSD-style red daemon sphere with horns (inspired by the thumbnail). */
export const Daemon: React.FC<{size?: number; glow?: boolean}> = ({size = 260, glow = true}) => {
  const frame = useCurrentFrame();
  const b = blink(frame, 5);
  return (
    <Svg vb="0 0 240 240" size={size}>
      <defs>
        <radialGradient id="dmn" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#FF6A6F" />
          <stop offset="55%" stopColor={C.red} />
          <stop offset="100%" stopColor={C.redDeep} />
        </radialGradient>
      </defs>
      {glow && <circle cx="120" cy="135" r="115" fill={C.red} opacity="0.18" />}
      <path d="M62 82 Q40 40 60 6 Q66 50 92 70 Z" fill={C.red} />
      <path d="M178 82 Q200 40 180 6 Q174 50 148 70 Z" fill={C.redDeep} />
      <circle cx="120" cy="135" r="88" fill="url(#dmn)" />
      <ellipse cx="88" cy="96" rx="26" ry="14" fill="#fff" opacity="0.28" transform="rotate(-30 88 96)" />
      <ellipse cx="98" cy="140" rx="9" ry={13 * b} fill="#3A0A0E" />
      <ellipse cx="142" cy="140" rx="9" ry={13 * b} fill="#3A0A0E" />
      <path d="M100 172 Q120 186 140 172" stroke="#3A0A0E" strokeWidth="6" fill="none" strokeLinecap="round" />
    </Svg>
  );
};

/** Server rack with blinking lights. */
export const Server: React.FC<{size?: number; color?: string}> = ({size = 220, color = '#2A3360'}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 160 300" size={size}>
      <ellipse cx="80" cy="294" rx="76" ry="6" fill="#000" opacity="0.25" />
      <rect x="10" y="0" width="140" height="290" rx="10" fill={color} />
      {new Array(7).fill(0).map((_, i) => (
        <g key={i}>
          <rect x="20" y={12 + i * 39} width="120" height="30" rx="5" fill="#1A2147" />
          <circle cx="34" cy={27 + i * 39} r="5" fill={(frame + i * 7) % 20 < 10 ? C.mint : '#1E5C46'} />
          <circle cx="50" cy={27 + i * 39} r="5" fill={(frame + i * 13) % 14 < 6 ? C.cyan : '#1A4F66'} />
          <rect x="70" y={23 + i * 39} width="60" height="8" rx="4" fill="#38427A" />
        </g>
      ))}
    </Svg>
  );
};

/** TV / streaming screen with a play button. */
export const Screen: React.FC<{size?: number; color?: string; playing?: number}> = ({size = 360, color = C.red, playing = 0}) => (
  <Svg vb="0 0 360 250" size={size}>
    <rect x="0" y="0" width="360" height="210" rx="14" fill="#1A1E33" />
    <rect x="12" y="12" width="336" height="186" rx="8" fill={playing > 0 ? '#20305C' : '#0D1124'} />
    {playing > 0 && (
      <>
        <circle cx="90" cy="90" r="30" fill={C.gold} opacity="0.9" />
        <path d="M12 198 L120 110 L190 160 L260 100 L348 170 L348 198 Z" fill={C.mintDeep} />
      </>
    )}
    {playing < 1 && (
      <g opacity={1 - playing}>
        <circle cx="180" cy="105" r="44" fill={color} />
        <path d="M166 82 L204 105 L166 128 Z" fill="#fff" />
      </g>
    )}
    <rect x="12" y="186" width={336 * playing} height="8" fill={color} />
    <rect x="150" y="210" width="60" height="22" fill="#1A1E33" />
    <rect x="110" y="232" width="140" height="12" rx="6" fill="#1A1E33" />
  </Svg>
);

/** Generic smartphone. */
export const Smartphone: React.FC<{size?: number; screen?: string}> = ({size = 180, screen = C.cyan}) => (
  <Svg vb="0 0 120 230" size={size}>
    <rect x="0" y="0" width="120" height="230" rx="20" fill="#E6E9F2" />
    <rect x="7" y="7" width="106" height="216" rx="15" fill="#151B36" />
    <rect x="44" y="14" width="32" height="8" rx="4" fill="#000" />
    {new Array(4).fill(0).map((_, r) =>
      new Array(3).fill(0).map((__, c) => (
        <rect key={`${r}${c}`} x={18 + c * 32} y={40 + r * 36} width="22" height="22" rx="6" fill={[screen, C.mint, C.gold, C.purple, C.pink, C.blue][(r * 3 + c) % 6]} opacity="0.9" />
      )),
    )}
  </Svg>
);

/** Generic laptop. */
export const Laptop: React.FC<{size?: number; screen?: string}> = ({size = 340, screen = C.cyan}) => (
  <Svg vb="0 0 340 220" size={size}>
    <rect x="40" y="0" width="260" height="170" rx="12" fill="#D8DCE8" />
    <rect x="50" y="10" width="240" height="150" rx="6" fill="#151B36" />
    <rect x="50" y="10" width="240" height="18" fill="#232B52" />
    <rect x="70" y="44" width="90" height="70" rx="6" fill={screen} opacity="0.8" />
    <rect x="175" y="44" width="95" height="10" rx="5" fill="#fff" opacity="0.5" />
    <rect x="175" y="62" width="70" height="10" rx="5" fill="#fff" opacity="0.3" />
    <path d="M0 175 L340 175 L320 200 L20 200 Z" fill="#C3C8D6" />
    <rect x="140" y="175" width="60" height="7" rx="3" fill="#9BA1B4" />
  </Svg>
);

/** Generic game console + controller. */
export const Console: React.FC<{size?: number}> = ({size = 360}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 360 240" size={size}>
      <ellipse cx="180" cy="232" rx="170" ry="8" fill="#000" opacity="0.25" />
      <path d="M30 40 L310 40 L330 120 L50 120 Z" fill="#3A4366" />
      <path d="M30 40 L310 40 L314 56 L34 56 Z" fill="#fff" opacity="0.12" />
      <path d="M50 125 L330 125 L310 160 L30 160 Z" fill="#2C3352" />
      <rect x="60" y="120" width="260" height="4" fill={C.cyan} opacity={0.6 + 0.4 * Math.sin(frame / 10)} />
      <path d="M110 170 Q80 170 70 205 Q66 228 88 226 Q102 224 118 205 L242 205 Q258 224 272 226 Q294 228 290 205 Q280 170 250 170 Z" fill="#4A5478" />
      <circle cx="120" cy="190" r="10" fill="#1B1F2E" />
      <circle cx="240" cy="190" r="10" fill="#1B1F2E" />
      <circle cx="262" cy="184" r="4" fill={C.mint} />
      <circle cx="272" cy="194" r="4" fill={C.red} />
      <circle cx="252" cy="194" r="4" fill={C.pink} />
      <circle cx="262" cy="204" r="4" fill={C.cyan} />
    </Svg>
  );
};

export const Lock: React.FC<{size?: number; open?: number; color?: string}> = ({size = 180, open = 0, color = C.gold}) => (
  <Svg vb="0 0 160 200" size={size}>
    <path d={`M40 ${90 - open * 30} L40 ${60 - open * 30} Q40 ${20 - open * 30} 80 ${20 - open * 30} Q120 ${20 - open * 30} 120 ${60 - open * 30} L120 90`} stroke="#AEB6CF" strokeWidth="18" fill="none" />
    <rect x="16" y="86" width="128" height="104" rx="18" fill={color} />
    <rect x="16" y="86" width="128" height="26" rx="10" fill="#fff" opacity="0.15" />
    <circle cx="80" cy="130" r="13" fill={C.bg0} />
    <rect x="74" y="134" width="12" height="28" rx="6" fill={C.bg0} />
  </Svg>
);

export const Envelope: React.FC<{size?: number; color?: string}> = ({size = 220, color = '#F4F1E8'}) => (
  <Svg vb="0 0 220 150" size={size}>
    <rect x="0" y="0" width="220" height="150" rx="10" fill={color} />
    <path d="M0 10 L110 85 L220 10" stroke="#C9C2AE" strokeWidth="6" fill="none" />
    <circle cx="180" cy="115" r="18" fill={C.red} opacity="0.85" />
  </Svg>
);

/** Storm cloud (doubt). */
export const Cloud: React.FC<{size?: number; color?: string; rain?: boolean}> = ({size = 300, color = '#5B6787', rain = true}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 300 220" size={size}>
      <path d="M60 130 Q20 130 22 96 Q26 64 62 66 Q72 22 120 24 Q160 20 176 56 Q196 36 226 50 Q260 62 254 96 Q286 100 280 126 Q276 140 250 140 L70 140 Q60 140 60 130 Z" fill={color} />
      <path d="M60 130 L250 130 Q276 136 250 140 L70 140 Z" fill="#000" opacity="0.15" />
      {rain &&
        new Array(9).fill(0).map((_, i) => {
          const y = 150 + ((frame * 5 + i * 23) % 70);
          return <line key={i} x1={60 + i * 22} y1={y} x2={54 + i * 22} y2={y + 14} stroke={C.cyan} strokeWidth="4" strokeLinecap="round" opacity="0.6" />;
        })}
    </Svg>
  );
};

/** Flame torch. */
export const Torch: React.FC<{size?: number}> = ({size = 200}) => {
  const frame = useCurrentFrame();
  const fl = Math.sin(frame / 3) * 5;
  return (
    <Svg vb="0 0 120 260" size={size}>
      <path d={`M60 ${10 + fl} Q95 60 82 90 Q75 110 60 110 Q45 110 38 90 Q25 60 60 ${10 - fl}`} fill={C.gold} />
      <path d={`M60 ${45 - fl} Q78 75 70 95 Q60 105 50 95 Q42 75 60 ${45 + fl}`} fill="#FFF3C4" />
      <path d="M30 110 L90 110 L80 140 L40 140 Z" fill="#A6B0CC" />
      <rect x="50" y="140" width="20" height="115" rx="8" fill="#7A5A44" />
    </Svg>
  );
};

/** Calendar page. */
export const Calendar: React.FC<{size?: number; top?: string; big?: string; color?: string}> = ({size = 200, top = 'JAN', big = '1994', color = C.red}) => (
  <Svg vb="0 0 200 200" size={size}>
    <rect x="0" y="20" width="200" height="180" rx="18" fill="#F4F6FC" />
    <path d="M0 38 Q0 20 18 20 L182 20 Q200 20 200 38 L200 70 L0 70 Z" fill={color} />
    <rect x="40" y="6" width="14" height="34" rx="7" fill="#9BA6C2" />
    <rect x="146" y="6" width="14" height="34" rx="7" fill="#9BA6C2" />
    <text x="100" y="60" textAnchor="middle" fontFamily={body} fontWeight={900} fontSize="30" fill="#fff">
      {top}
    </text>
    <text x="100" y="152" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="68" fill="#1C2550">
      {big}
    </text>
  </Svg>
);

/** Map pin with label below. */
export const Pin: React.FC<{size?: number; color?: string}> = ({size = 90, color = C.red}) => (
  <Svg vb="0 0 60 80" size={size}>
    <path d="M30 78 Q4 46 4 28 Q4 4 30 4 Q56 4 56 28 Q56 46 30 78 Z" fill={color} />
    <circle cx="30" cy="28" r="10" fill="#fff" />
  </Svg>
);

/** Brick (code building block). */
export const Brick: React.FC<{w?: number; h?: number; color: string; label?: string}> = ({w = 220, h = 70, color, label}) => (
  <div
    style={{
      width: w,
      height: h,
      background: color,
      borderRadius: 12,
      boxShadow: `inset 0 -8px 0 rgba(0,0,0,0.18), 0 10px 24px rgba(0,0,0,0.3)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: body,
      fontWeight: 900,
      fontSize: h * 0.36,
      color: [C.gold, C.goldDeep, C.mint].includes(color) ? C.bg0 : '#fff',
      textShadow: [C.gold, C.goldDeep, C.mint].includes(color) ? 'none' : '0 2px 6px rgba(0,0,0,0.25)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

/** Coin. */
export const Coin: React.FC<{size?: number}> = ({size = 90}) => (
  <Svg vb="0 0 100 100" size={size}>
    <circle cx="50" cy="50" r="46" fill={C.goldDeep} />
    <circle cx="50" cy="46" r="42" fill={C.gold} />
    <text x="50" y="62" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="44" fill={C.goldDeep}>
      $
    </text>
  </Svg>
);

/** CD-ROM disc. */
export const Disc: React.FC<{size?: number; spin?: number}> = ({size = 220, spin = 0}) => (
  <Svg vb="0 0 200 200" size={size}>
    <defs>
      <linearGradient id="cdg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#C9F1FF" />
        <stop offset="0.35" stopColor="#E6D8FF" />
        <stop offset="0.65" stopColor="#D2FFE9" />
        <stop offset="1" stopColor="#FFF4C9" />
      </linearGradient>
    </defs>
    <g transform={`rotate(${spin} 100 100)`}>
      <circle cx="100" cy="100" r="96" fill="url(#cdg)" />
      <path d="M100 100 L196 100 A96 96 0 0 0 150 17 Z" fill="#fff" opacity="0.35" />
    </g>
    <circle cx="100" cy="100" r="30" fill="#BFC7DB" />
    <circle cx="100" cy="100" r="14" fill={C.bg1} />
  </Svg>
);

/** Book / manual. */
export const Book: React.FC<{size?: number; color?: string}> = ({size = 160, color = C.blue}) => (
  <Svg vb="0 0 120 160" size={size}>
    <rect x="10" y="4" width="100" height="150" rx="8" fill={color} />
    <rect x="10" y="4" width="16" height="150" rx="6" fill="#000" opacity="0.2" />
    <rect x="40" y="30" width="56" height="10" rx="5" fill="#fff" opacity="0.8" />
    <rect x="40" y="48" width="40" height="8" rx="4" fill="#fff" opacity="0.5" />
    <rect x="16" y="140" width="94" height="10" fill="#F4F1E8" />
  </Svg>
);
