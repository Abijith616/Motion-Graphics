import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {HORSE, HORSE_T, HORSE_VB, SHIELD, SHIELD_T, SHIELD_VB} from '../brand/ferrariPaths';
import {C, body, head, serif} from '../theme';
import {Svg} from './Art';

/* ------------------------------------------------------------------ brand */

/** The prancing horse (from the supplied SVG), any colour. `reveal` wipes it in bottom→top. */
export const Horse: React.FC<{size?: number; color?: string; reveal?: number; stroke?: string; sw?: number}> = ({size = 220, color = '#0A0A0A', reveal = 1, stroke, sw = 0}) => {
  const id = `hz${Math.round(size)}${color.replace('#', '')}`;
  return (
    <svg viewBox={HORSE_VB} width={size} height={(size * 309.4) / 222.56} style={{overflow: 'visible'}}>
      <defs>
        <clipPath id={id}>
          <rect x="-20" y={-20 + 350 * (1 - reveal)} width="270" height="360" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {HORSE.map((d, i) => (
          <path key={i} d={d} transform={HORSE_T} fill={color} stroke={stroke} strokeWidth={sw} />
        ))}
      </g>
    </svg>
  );
};

/** Scuderia Ferrari shield. `plain` uses the supplied transparent PNG (complete logo, tricolore band intact). */
export const Shield: React.FC<{size?: number; plain?: boolean; glow?: number}> = ({size = 260, plain, glow = 0}) =>
  plain ? (
    <Img
      src={staticFile('brand/sf_shield.png')}
      style={{width: size, height: (size * 368.08) / 271.28, objectFit: 'contain', display: 'block', filter: glow ? `drop-shadow(0 0 ${glow}px rgba(255,216,10,0.65))` : 'drop-shadow(0 14px 30px rgba(0,0,0,0.45))'}}
    />
  ) : (
  <svg
    viewBox={SHIELD_VB}
    width={size}
    height={(size * 368.08) / 271.28}
    style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${glow}px rgba(255,216,10,0.65))` : 'drop-shadow(0 14px 30px rgba(0,0,0,0.45))'}}
  >
    {SHIELD.map(([d, fill], i) => (
      <path key={i} d={d} transform={SHIELD_T} fill={fill} />
    ))}
  </svg>
  );

/** "Ferrari" wordmark (supplied SVG). */
export const FerrariWord: React.FC<{width?: number; white?: boolean; o?: number}> = ({width = 600, white, o = 1}) => (
  <Img src={staticFile('brand/ferrari_word.svg')} style={{width, opacity: o, filter: white ? 'invert(1)' : undefined}} />
);

/* ------------------------------------------------------------------ cars */

const Wheel: React.FC<{x: number; y: number; r: number; spin?: number; spokes?: boolean; hub?: string}> = ({x, y, r, spin = 0, spokes = true, hub = '#C9CED8'}) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <circle r={r} fill="#16161C" />
    <circle r={r * 0.72} fill="#2C2D36" />
    {spokes ? (
      new Array(12).fill(0).map((_, i) => <line key={i} x1="0" y1="0" x2={Math.cos((i * Math.PI) / 6) * r * 0.7} y2={Math.sin((i * Math.PI) / 6) * r * 0.7} stroke={hub} strokeWidth={1.6} />)
    ) : (
      <>
        <circle r={r * 0.55} fill="#3A3C48" />
        <rect x={-r * 0.06} y={-r * 0.55} width={r * 0.12} height={r * 1.1} fill="#55586A" />
      </>
    )}
    <circle r={r * 0.16} fill={hub} />
  </g>
);

/** 1930s Grand Prix car, side view, facing right. Optional horse badge and racing number. */
export const VintageCar: React.FC<{size?: number; color?: string; spin?: number; badge?: boolean; num?: string; driver?: boolean; helmet?: string; flag?: string}> = ({
  size = 420,
  color = C.rosso,
  spin = 0,
  badge,
  num,
  driver = true,
  helmet = '#7A4A2A',
}) => (
  <Svg vb="0 0 520 200" size={size}>
    <ellipse cx="265" cy="192" rx="230" ry="7" fill="#000" opacity="0.28" />
    {driver && (
      <g>
        <path d="M210 92 Q212 62 232 58 Q252 56 256 80 L256 92 Z" fill="#2B2B33" />
        <circle cx="236" cy="56" r="20" fill={C.skin} />
        <path d="M216 56 Q216 34 236 34 Q256 34 257 54 Z" fill={helmet} />
        <rect x="236" y="48" width="22" height="9" rx="4" fill="#1D1D24" />
        <circle cx="250" cy="52" r="3.5" fill="#9FD3FF" />
        <path d="M218 62 Q206 70 198 62" stroke="#EFEFEF" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    )}
    <path d="M28 126 Q30 100 110 94 L198 90 Q206 78 222 76 L262 76 Q270 76 274 88 L430 88 Q476 90 484 114 Q488 134 466 140 L64 142 Q28 142 28 126 Z" fill={color} />
    <path d="M60 132 L470 132 Q476 140 466 140 L64 142 Q40 142 34 134 Z" fill="#000" opacity="0.2" />
    <path d="M120 98 L420 96" stroke="#fff" strokeWidth="2" opacity="0.25" />
    <ellipse cx="480" cy="114" rx="8" ry="20" fill="#2A2A30" />
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1="474" y1={100 + i * 8} x2="486" y2={100 + i * 8} stroke="#8A8F9E" strokeWidth="1.5" />
    ))}
    <path d="M290 122 L180 128 Q150 130 140 124" stroke="#C9CED8" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M222 78 L232 70 L262 70 L262 78" fill="#BFE4FF" opacity="0.7" />
    {num && (
      <g>
        <circle cx="96" cy="116" r="17" fill="#fff" />
        <text x="96" y="124" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="22" fill="#111">
          {num}
        </text>
      </g>
    )}
    {badge && (
      <g transform="translate(330 96) scale(0.11)">
        <path d="M0 0 L271 0 L271 230 Q271 340 135 368 Q0 340 0 230 Z" fill={C.yellow} stroke="#111" strokeWidth="14" />
        <g transform="translate(50 30) scale(0.78)">
          {HORSE.map((d, i) => (
            <path key={i} d={d} transform={HORSE_T} fill="#0A0A0A" />
          ))}
        </g>
      </g>
    )}
    <Wheel x={128} y={146} r={44} spin={spin} />
    <Wheel x={418} y={146} r={44} spin={spin} />
  </Svg>
);

/** Modern Formula One car, side view, facing right. */
export const F1Car: React.FC<{size?: number; color?: string; accent?: string; spin?: number; num?: string}> = ({size = 520, color = C.rosso, accent = '#111', spin = 0, num}) => (
  <Svg vb="0 0 640 180" size={size}>
    <ellipse cx="320" cy="172" rx="300" ry="7" fill="#000" opacity="0.3" />
    <rect x="22" y="38" width="16" height="74" rx="3" fill={accent} />
    <path d="M8 34 L86 34 L86 56 L8 50 Z" fill={color} />
    <path d="M8 34 L86 34 L86 40 L8 40 Z" fill="#fff" opacity="0.3" />
    <path d="M40 118 Q60 92 120 86 L200 78 Q230 44 270 40 L300 42 Q310 60 312 74 L440 84 Q520 92 588 116 L612 124 L612 134 L60 136 Q40 134 40 118 Z" fill={color} />
    <path d="M200 78 Q230 44 270 40 L300 42 L292 78 Z" fill={accent} opacity="0.85" />
    <path d="M330 72 Q352 50 386 52 L398 74" stroke={accent} strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="372" cy="70" r="13" fill="#FFD80A" />
    <rect x="364" y="66" width="22" height="6" rx="3" fill="#111" />
    <path d="M60 128 L600 128 L612 134 L60 136 Z" fill="#000" opacity="0.35" />
    <path d="M560 128 L636 128 L636 140 L548 140 Z" fill={accent} />
    <path d="M130 108 L460 104" stroke="#fff" strokeWidth="3" opacity="0.35" />
    {num && (
      <text x="470" y="116" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="26" fill="#fff">
        {num}
      </text>
    )}
    <Wheel x={120} y={128} r={40} spin={spin} spokes={false} />
    <Wheel x={500} y={130} r={36} spin={spin} spokes={false} />
  </Svg>
);

/** The 1947 125 S: bare frame + V12 engine. `bodywork` 0→1 fades in a red cycle-wing body. */
export const Car125: React.FC<{size?: number; spin?: number; bodywork?: number; driver?: boolean; badge?: boolean}> = ({size = 460, spin = 0, bodywork = 0, driver = true, badge}) => (
  <Svg vb="0 0 520 200" size={size}>
    <ellipse cx="265" cy="192" rx="230" ry="7" fill="#000" opacity="0.28" />
    {/* ladder frame */}
    <path d="M60 128 L470 128" stroke="#9AA1B2" strokeWidth="8" strokeLinecap="round" />
    <path d="M80 128 L120 96 L420 96 L460 128" stroke="#B8BECC" strokeWidth="5" fill="none" strokeLinejoin="round" />
    {[150, 210, 300, 380].map((x) => (
      <line key={x} x1={x} y1="96" x2={x - 12} y2="128" stroke="#B8BECC" strokeWidth="4" />
    ))}
    {/* radiator */}
    <rect x="444" y="78" width="26" height="52" rx="5" fill="#5B6072" />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1="448" y1={84 + i * 9} x2="466" y2={84 + i * 9} stroke="#8D93A6" strokeWidth="2" />
    ))}
    {/* V12 engine */}
    <rect x="300" y="72" width="130" height="50" rx="8" fill="#7C8294" />
    <rect x="306" y="62" width="118" height="16" rx="6" fill={C.rosso} />
    {new Array(6).fill(0).map((_, i) => (
      <circle key={i} cx={318 + i * 19} cy="70" r="3" fill="#F2D9A0" />
    ))}
    {new Array(6).fill(0).map((_, i) => (
      <path key={i} d={`M${314 + i * 19} 112 Q${300 + i * 12} 140 ${180 + i * 6} 136`} stroke="#C9CED8" strokeWidth="3" fill="none" opacity="0.8" />
    ))}
    {/* seat + steering */}
    <path d="M190 120 L196 80 Q200 70 212 72 L218 120 Z" fill="#6B3A1F" />
    <line x1="262" y1="104" x2="290" y2="74" stroke="#2A2A30" strokeWidth="5" />
    <ellipse cx="262" cy="74" rx="6" ry="20" fill="none" stroke="#2A2A30" strokeWidth="5" transform="rotate(-30 262 74)" />
    {driver && (
      <g>
        <path d="M206 96 Q208 66 226 62 Q246 60 248 84 L248 98 Z" fill="#E9E4D8" />
        <circle cx="226" cy="54" r="19" fill={C.skin} />
        <path d="M207 54 Q207 33 227 33 Q246 33 246 52 Q234 44 214 50 Z" fill="#2A1E18" />
        <rect x="226" y="46" width="22" height="9" rx="4" fill="#1D1D24" />
        <path d="M232 98 L258 80" stroke={C.skin} strokeWidth="9" strokeLinecap="round" />
      </g>
    )}
    {/* bodywork */}
    <g opacity={bodywork}>
      <path d="M40 124 Q44 96 120 92 L196 90 Q206 76 222 76 L262 76 L276 88 L440 88 Q480 90 486 114 Q488 134 466 140 L64 142 Q40 140 40 124 Z" fill={C.rosso} />
      <path d="M64 92 Q128 70 190 92 Z" fill={C.rosso} />
      <path d="M360 92 Q420 70 480 92 Z" fill={C.rosso} />
      <ellipse cx="482" cy="114" rx="8" ry="18" fill="#2A2A30" />
      {badge && (
        <g transform="translate(330 98) scale(0.1)">
          <path d="M0 0 L271 0 L271 230 Q271 340 135 368 Q0 340 0 230 Z" fill={C.yellow} stroke="#111" strokeWidth="14" />
          <g transform="translate(50 30) scale(0.78)">
            {HORSE.map((d, i) => (
              <path key={i} d={d} transform={HORSE_T} fill="#0A0A0A" />
            ))}
          </g>
        </g>
      )}
    </g>
    <Wheel x={128} y={146} r={42} spin={spin} />
    <Wheel x={418} y={146} r={42} spin={spin} />
  </Svg>
);

/** Late-1940s/50s grand-touring road car, side view facing right. */
export const RoadCar: React.FC<{size?: number; color?: string; spin?: number; badge?: boolean}> = ({size = 440, color = C.rosso, spin = 0, badge}) => (
  <Svg vb="0 0 520 200" size={size}>
    <ellipse cx="260" cy="190" rx="232" ry="7" fill="#000" opacity="0.28" />
    <path d="M30 140 Q26 112 70 104 L150 96 Q190 58 250 54 L320 56 Q356 60 390 94 L460 102 Q498 108 496 136 L492 150 L36 152 Z" fill={color} />
    <path d="M170 96 Q200 66 250 64 L300 65 L302 96 Z" fill="#BFE4FF" opacity="0.85" />
    <path d="M314 66 Q348 70 372 96 L314 96 Z" fill="#BFE4FF" opacity="0.85" />
    <path d="M36 140 L494 140 L492 150 L36 152 Z" fill="#000" opacity="0.2" />
    <path d="M480 118 L496 120" stroke="#F4F1E8" strokeWidth="6" strokeLinecap="round" />
    <rect x="290" y="108" width="20" height="4" rx="2" fill="#E6E6E6" />
    {badge && (
      <g transform="translate(440 104) scale(0.06)">
        <path d="M0 0 L271 0 L271 230 Q271 340 135 368 Q0 340 0 230 Z" fill={C.yellow} stroke="#111" strokeWidth="18" />
      </g>
    )}
    <Wheel x={118} y={150} r={36} spin={spin} spokes={false} hub="#DADDE6" />
    <Wheel x={410} y={150} r={36} spin={spin} spokes={false} hub="#DADDE6" />
  </Svg>
);

/** Plain family car (for "it isn't a family car"). */
export const FamilyCar: React.FC<{size?: number; color?: string}> = ({size = 360, color = '#7A8BA8'}) => (
  <Svg vb="0 0 420 200" size={size}>
    <ellipse cx="210" cy="188" rx="190" ry="7" fill="#000" opacity="0.25" />
    <path d="M24 150 L24 116 Q26 96 60 92 L110 88 Q140 44 200 42 L270 44 Q320 48 344 90 L384 96 Q400 100 400 120 L400 150 Z" fill={color} />
    <path d="M124 88 Q150 54 200 52 L232 52 L232 88 Z M244 52 L270 53 Q310 56 328 88 L244 88 Z" fill="#BFE4FF" opacity="0.8" />
    <Wheel x={100} y={152} r={30} spokes={false} />
    <Wheel x={320} y={152} r={30} spokes={false} />
  </Svg>
);

/* --------------------------------------------------------------- aircraft */

/** WWI fighter biplane, side view facing right; optional horse on the fuselage. */
export const Biplane: React.FC<{size?: number; color?: string; horse?: number; prop?: number}> = ({size = 520, color = '#B9A77E', horse = 1, prop = 0}) => (
  <Svg vb="0 0 520 260" size={size}>
    <rect x="150" y="52" width="250" height="16" rx="8" fill={color} />
    <rect x="150" y="52" width="250" height="6" rx="3" fill="#fff" opacity="0.2" />
    {[190, 350].map((x) => (
      <g key={x}>
        <line x1={x} y1="66" x2={x + 8} y2="150" stroke="#5A4A33" strokeWidth="5" />
        <line x1={x + 30} y1="66" x2={x + 38} y2="150" stroke="#5A4A33" strokeWidth="5" />
      </g>
    ))}
    <path d="M30 120 L40 92 Q60 88 74 112 Z" fill={color} />
    <path d="M30 120 L40 92 L48 93 L38 120 Z" fill={C.green} />
    <path d="M38 120 L48 93 L56 95 L46 120 Z" fill="#fff" />
    <path d="M46 120 L56 95 L64 100 L56 120 Z" fill={C.red} />
    <path d="M40 124 Q120 104 300 102 L430 104 Q466 108 470 128 Q466 150 430 152 L300 154 Q120 150 40 130 Z" fill={color} />
    <path d="M40 130 Q120 150 300 154 L430 152 Q456 150 466 140 L60 134 Z" fill="#000" opacity="0.15" />
    <path d="M40 126 L110 130 L110 138 L40 132 Z" fill="#8F7F5A" />
    <rect x="232" y="94" width="40" height="12" rx="6" fill="#3A3026" />
    <circle cx="250" cy="90" r="12" fill="#6B4A2E" />
    <rect x="240" y="85" width="20" height="7" rx="3" fill="#2A2A30" />
    <g opacity={horse} transform="translate(318 106) scale(0.15)">
      {HORSE.map((d, i) => (
        <path key={i} d={d} transform={HORSE_T} fill="#0A0A0A" />
      ))}
    </g>
    <rect x="140" y="148" width="270" height="16" rx="8" fill={color} />
    <rect x="140" y="156" width="270" height="8" rx="4" fill="#000" opacity="0.15" />
    <line x1="400" y1="154" x2="380" y2="210" stroke="#3A3026" strokeWidth="5" />
    <line x1="420" y1="154" x2="390" y2="210" stroke="#3A3026" strokeWidth="5" />
    <circle cx="388" cy="214" r="18" fill="#22222A" />
    <circle cx="388" cy="214" r="6" fill="#9097A8" />
    <circle cx="474" cy="128" r="8" fill="#55565E" />
    <ellipse cx="480" cy="128" rx="5" ry={46 * Math.abs(Math.cos(prop))} fill="#6B4A2E" opacity="0.85" />
    <ellipse cx="480" cy="128" rx="3" ry="50" fill="#fff" opacity="0.12" />
  </Svg>
);

/* --------------------------------------------------------------- people */

export type CharProps = {
  size?: number;
  outfit?: 'suit' | 'shirt' | 'overalls' | 'dress' | 'uniform' | 'racer';
  shirt?: string;
  tie?: string;
  skin?: string;
  hair?: string;
  hairStyle?: 'slick' | 'short' | 'bald' | 'bun' | 'kid' | 'wavy';
  hat?: 'none' | 'fedora' | 'flatcap' | 'helmet' | 'pilot' | 'tophat';
  mustache?: boolean;
  glasses?: 'none' | 'round' | 'dark';
  mood?: 'neutral' | 'happy' | 'worried' | 'shock' | 'sad' | 'smirk' | 'angry';
  seed?: number;
  look?: number;
  kid?: boolean;
  talk?: boolean;
};

/** Round-headed flat character, front view. viewBox 200×300, head centre (100,110). */
export const Char: React.FC<CharProps> = ({
  size = 220,
  outfit = 'suit',
  shirt = '#2D3557',
  tie = C.red,
  skin = C.skin,
  hair = '#2A1E18',
  hairStyle = 'short',
  hat = 'none',
  mustache,
  glasses = 'none',
  mood = 'neutral',
  seed = 0,
  look = 0,
  kid,
  talk,
}) => {
  const frame = useCurrentFrame();
  const b = (frame + seed * 37) % 110 < 4 ? 0.12 : 1;
  const br = Math.sin(frame / 18 + seed) * 2;
  const hy = 110 + br * 0.6;
  const mouthOpen = talk ? 3 + Math.abs(Math.sin(frame / 2.6 + seed)) * 7 : 0;
  const ink = '#1A1A2E';
  const bodyTop = kid ? 190 : 168;
  return (
    <Svg vb="0 0 200 300" size={size}>
      <ellipse cx="100" cy="292" rx="70" ry="8" fill="#000" opacity="0.25" />
      {/* body */}
      {outfit === 'dress' ? (
        <path d={`M40 292 Q50 ${bodyTop + br} 100 ${bodyTop - 4 + br} Q150 ${bodyTop + br} 160 292 Z`} fill={shirt} />
      ) : (
        <path d={`M${kid ? 46 : 30} 292 Q${kid ? 46 : 30} ${bodyTop + 4 + br} 100 ${bodyTop + br} Q${kid ? 154 : 170} ${bodyTop + 4 + br} ${kid ? 154 : 170} 292 Z`} fill={outfit === 'overalls' ? '#3D5A8A' : outfit === 'racer' ? '#E9E4D8' : shirt} />
      )}
      {outfit === 'suit' && (
        <>
          <path d={`M78 ${bodyTop + 2 + br} L100 232 L122 ${bodyTop + 2 + br} Z`} fill="#F4F4F4" />
          <path d="M100 186 L93 200 L100 248 L107 200 Z" fill={tie} />
          <path d={`M78 ${bodyTop + 2 + br} L100 232 L88 292 L70 292 Z`} fill="#000" opacity="0.12" />
        </>
      )}
      {outfit === 'shirt' && <path d={`M84 ${bodyTop + 1 + br} L100 ${bodyTop + 22} L116 ${bodyTop + 1 + br}`} stroke="#fff" strokeWidth="5" fill="none" opacity="0.7" />}
      {outfit === 'overalls' && (
        <>
          <rect x="70" y="200" width="60" height="92" rx="8" fill="#2E4A78" />
          <line x1="78" y1={bodyTop + 4} x2="78" y2="206" stroke="#2E4A78" strokeWidth="8" />
          <line x1="122" y1={bodyTop + 4} x2="122" y2="206" stroke="#2E4A78" strokeWidth="8" />
          <rect x="90" y="222" width="20" height="14" rx="3" fill="#24406A" />
        </>
      )}
      {outfit === 'uniform' && (
        <>
          <path d={`M86 ${bodyTop + 2} L100 210 L114 ${bodyTop + 2}`} fill="#C9B27A" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="100" cy={222 + i * 20} r="4" fill={C.gold} />
          ))}
        </>
      )}
      {outfit === 'racer' && <path d={`M70 ${bodyTop + 6} Q100 ${bodyTop + 22} 130 ${bodyTop + 6}`} stroke={C.red} strokeWidth="8" fill="none" />}
      {outfit === 'dress' && <path d={`M76 ${bodyTop + 2 + br} Q100 ${bodyTop + 24} 124 ${bodyTop + 2 + br}`} stroke="#F4E6C8" strokeWidth="6" fill="none" />}
      {/* hair back (bun/wavy) */}
      {hairStyle === 'bun' && <circle cx="100" cy={hy - 66} r="22" fill={hair} />}
      {hairStyle === 'wavy' && <path d={`M34 ${hy + 30} Q30 ${hy - 70} 100 ${hy - 70} Q170 ${hy - 70} 166 ${hy + 30} Z`} fill={hair} />}
      {/* head */}
      <circle cx="100" cy={hy} r={kid ? 58 : 62} fill={skin} />
      <circle cx="40" cy={hy + 6} r="10" fill={skin} />
      <circle cx="160" cy={hy + 6} r="10" fill={skin} />
      {/* hair */}
      {hairStyle === 'slick' && <path d={`M38 ${hy - 4} Q38 ${hy - 66} 104 ${hy - 66} Q164 ${hy - 64} 162 ${hy - 4} Q156 ${hy - 40} 120 ${hy - 46} Q84 ${hy - 40} 62 ${hy - 28} Q46 ${hy - 20} 38 ${hy - 4}`} fill={hair} />}
      {hairStyle === 'short' && <path d={`M40 ${hy - 10} Q42 ${hy - 64} 100 ${hy - 64} Q158 ${hy - 64} 160 ${hy - 10} Q140 ${hy - 38} 100 ${hy - 38} Q60 ${hy - 38} 40 ${hy - 10}`} fill={hair} />}
      {hairStyle === 'kid' && <path d={`M44 ${hy - 6} Q40 ${hy - 62} 100 ${hy - 62} Q160 ${hy - 62} 156 ${hy - 6} L144 ${hy - 26} L132 ${hy - 14} L120 ${hy - 32} L104 ${hy - 18} L88 ${hy - 34} L74 ${hy - 16} L60 ${hy - 30} Z`} fill={hair} />}
      {(hairStyle === 'bun' || hairStyle === 'wavy') && <path d={`M40 ${hy - 4} Q40 ${hy - 64} 100 ${hy - 64} Q160 ${hy - 64} 160 ${hy - 4} Q150 ${hy - 44} 100 ${hy - 46} Q50 ${hy - 44} 40 ${hy - 4}`} fill={hair} />}
      {hairStyle === 'bald' && <path d={`M38 ${hy + 4} Q38 ${hy - 26} 50 ${hy - 30} L54 ${hy - 4} Z M162 ${hy + 4} Q162 ${hy - 26} 150 ${hy - 30} L146 ${hy - 4} Z`} fill={hair} />}
      {/* face */}
      <g transform={`translate(${look * 8} 0)`}>
        <ellipse cx="78" cy={hy + 2} rx="7.5" ry={9.5 * b * (mood === 'shock' ? 1.3 : 1)} fill={ink} />
        <ellipse cx="122" cy={hy + 2} rx="7.5" ry={9.5 * b * (mood === 'shock' ? 1.3 : 1)} fill={ink} />
        {mood === 'angry' && <path d={`M64 ${hy - 18} L90 ${hy - 10} M136 ${hy - 18} L110 ${hy - 10}`} stroke={ink} strokeWidth="5" strokeLinecap="round" />}
        {(mood === 'worried' || mood === 'sad') && <path d={`M66 ${hy - 12} L88 ${hy - 18} M134 ${hy - 12} L112 ${hy - 18}`} stroke={ink} strokeWidth="4" strokeLinecap="round" />}
        {glasses === 'round' && (
          <g stroke={ink} strokeWidth="3.5" fill="none">
            <circle cx="78" cy={hy + 2} r="15" />
            <circle cx="122" cy={hy + 2} r="15" />
            <line x1="93" y1={hy + 2} x2="107" y2={hy + 2} />
          </g>
        )}
        {glasses === 'dark' && (
          <g>
            <rect x="58" y={hy - 10} width="38" height="24" rx="10" fill="#111" />
            <rect x="104" y={hy - 10} width="38" height="24" rx="10" fill="#111" />
            <line x1="94" y1={hy} x2="106" y2={hy} stroke="#111" strokeWidth="4" />
          </g>
        )}
        {mustache && <path d={`M76 ${hy + 26} Q90 ${hy + 18} 100 ${hy + 24} Q110 ${hy + 18} 124 ${hy + 26} Q112 ${hy + 32} 100 ${hy + 28} Q88 ${hy + 32} 76 ${hy + 26}`} fill={hair === '#2A1E18' ? '#2A1E18' : hair} />}
        {talk ? (
          <ellipse cx="100" cy={hy + 38} rx="11" ry={mouthOpen} fill={ink} />
        ) : (
          <>
            {mood === 'happy' && <path d={`M82 ${hy + 30} Q100 ${hy + 48} 118 ${hy + 30}`} stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />}
            {mood === 'smirk' && <path d={`M86 ${hy + 36} Q104 ${hy + 42} 118 ${hy + 30}`} stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />}
            {(mood === 'neutral' || mood === 'angry') && <path d={`M88 ${hy + 34} L112 ${hy + 34}`} stroke={ink} strokeWidth="5" strokeLinecap="round" />}
            {(mood === 'worried' || mood === 'sad') && <path d={`M86 ${hy + 40} Q100 ${hy + 28} 114 ${hy + 40}`} stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />}
            {mood === 'shock' && <ellipse cx="100" cy={hy + 38} rx="9" ry="12" fill={ink} />}
          </>
        )}
        {(mood === 'happy' || kid) && (
          <>
            <circle cx="64" cy={hy + 22} r="8" fill="#FF8A8A" opacity="0.35" />
            <circle cx="136" cy={hy + 22} r="8" fill="#FF8A8A" opacity="0.35" />
          </>
        )}
      </g>
      {/* hats */}
      {hat === 'fedora' && (
        <g>
          <ellipse cx="100" cy={hy - 44} rx="82" ry="14" fill="#3B3226" />
          <path d={`M54 ${hy - 46} Q56 ${hy - 104} 100 ${hy - 100} Q144 ${hy - 104} 146 ${hy - 46} Z`} fill="#4A3F31" />
          <rect x="55" y={hy - 60} width="90" height="12" fill="#2A221A" />
        </g>
      )}
      {hat === 'flatcap' && <path d={`M40 ${hy - 30} Q40 ${hy - 82} 100 ${hy - 80} Q160 ${hy - 80} 164 ${hy - 36} L182 ${hy - 26} Q160 ${hy - 20} 140 ${hy - 30} Z`} fill="#6A5A48" />}
      {hat === 'tophat' && (
        <g>
          <ellipse cx="100" cy={hy - 46} rx="70" ry="10" fill="#151518" />
          <rect x="62" y={hy - 120} width="76" height="76" rx="6" fill="#1D1D22" />
          <rect x="62" y={hy - 62} width="76" height="10" fill="#7A1B22" />
        </g>
      )}
      {(hat === 'helmet' || hat === 'pilot') && (
        <g>
          <path d={`M36 ${hy + 6} Q36 ${hy - 68} 100 ${hy - 68} Q164 ${hy - 68} 164 ${hy + 6} L150 ${hy + 6} Q148 ${hy - 30} 100 ${hy - 32} Q52 ${hy - 30} 50 ${hy + 6} Z`} fill={hat === 'pilot' ? '#5C4026' : '#7A4A2A'} />
          <rect x="54" y={hy - 34} width="92" height="22" rx="11" fill="#2A2A30" />
          <circle cx="78" cy={hy - 23} r="9" fill="#9FD3FF" />
          <circle cx="122" cy={hy - 23} r="9" fill="#9FD3FF" />
        </g>
      )}
    </Svg>
  );
};

/** Row of crowd silhouettes (spectators). */
export const Crowd: React.FC<{n?: number; width?: number; color?: string; seed?: number; cheer?: number}> = ({n = 14, width = 1200, color = '#2C3560', seed = 1, cheer = 0}) => {
  const frame = useCurrentFrame();
  const step = width / n;
  return (
    <svg width={width} height={200} viewBox={`0 0 ${width} 200`} style={{overflow: 'visible'}}>
      {new Array(n).fill(0).map((_, i) => {
        const hgt = 20 + ((i * 37 + seed * 11) % 23);
        const jump = cheer * Math.max(0, Math.sin(frame / 4 + i * 1.7)) * 14;
        const x = i * step + step / 2;
        return (
          <g key={i} transform={`translate(${x} ${-jump})`}>
            <path d={`M${-step * 0.42} 200 Q${-step * 0.42} ${120 - hgt} 0 ${118 - hgt} Q${step * 0.42} ${120 - hgt} ${step * 0.42} 200 Z`} fill={color} />
            <circle cx="0" cy={88 - hgt} r={step * 0.24} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};

/* --------------------------------------------------------------- places */

/** Generic factory with sawtooth roof and chimney; label on the facade. */
export const Factory: React.FC<{size?: number; color?: string; roof?: string; label?: string; smoke?: boolean; lit?: number}> = ({size = 460, color = '#D9D2C2', roof = '#8C3B2E', label, smoke = true, lit = 1}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 460 300" size={size}>
      {smoke &&
        [0, 1, 2].map((i) => {
          const t = ((frame / 40 + i / 3) % 1);
          return <circle key={i} cx={392 + t * 30} cy={40 - t * 60} r={10 + t * 18} fill="#C7CCD8" opacity={0.5 * (1 - t)} />;
        })}
      <rect x="378" y="40" width="28" height="140" fill="#7A6A5A" />
      <rect x="374" y="36" width="36" height="10" fill="#5F5244" />
      <path d="M20 120 L80 70 L80 120 L140 70 L140 120 L200 70 L200 120 L260 70 L260 120 L320 70 L320 120 Z" fill={roof} />
      <rect x="20" y="118" width="420" height="170" fill={color} />
      <rect x="20" y="276" width="420" height="12" fill="#000" opacity="0.15" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={40 + i * 66} y="140" width="44" height="50" rx="4" fill="#FFD98A" opacity={0.35 + 0.65 * lit} />
      ))}
      <rect x="190" y="210" width="80" height="78" fill="#4A4038" />
      {label && (
        <g>
          <rect x="120" y="96" width="220" height="40" rx="6" fill="#1C1C22" />
          <text x="230" y="125" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="26" fill="#F5F1E8" letterSpacing="2">
            {label}
          </text>
        </g>
      )}
    </Svg>
  );
};

/** Small workshop/garage with open roller door and a car-shaped interior glow. */
export const Workshop: React.FC<{size?: number; color?: string; label?: string; sign?: string}> = ({size = 420, color = '#E6DCC6', label, sign = C.rosso}) => (
  <Svg vb="0 0 420 300" size={size}>
    <path d="M20 110 L210 30 L400 110 Z" fill="#7C3A2C" />
    <rect x="36" y="108" width="348" height="180" fill={color} />
    <rect x="80" y="150" width="260" height="138" fill="#2A2420" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x="80" y={150 + i * 12} width="260" height="6" fill="#5C5048" />
    ))}
    <rect x="36" y="280" width="348" height="8" fill="#000" opacity="0.15" />
    {label && (
      <g>
        <rect x="100" y="114" width="220" height="30" rx="4" fill={sign} />
        <text x="210" y="136" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="20" fill="#fff" letterSpacing="3">
          {label}
        </text>
      </g>
    )}
  </Svg>
);

/** Horse stable / barn (the literal "scuderia"). */
export const Stable: React.FC<{size?: number; open?: number}> = ({size = 420, open = 0}) => (
  <Svg vb="0 0 420 320" size={size}>
    <path d="M10 130 L210 30 L410 130 Z" fill="#7E2F22" />
    <path d="M10 130 L210 30 L210 46 L28 136 Z" fill="#000" opacity="0.15" />
    <rect x="34" y="128" width="352" height="180" fill="#B5462F" />
    {new Array(11).fill(0).map((_, i) => (
      <line key={i} x1={34 + i * 32} y1="128" x2={34 + i * 32} y2="308" stroke="#8E3424" strokeWidth="3" />
    ))}
    <rect x="140" y="170" width="140" height="138" fill="#2A1B14" />
    <g transform={`translate(140 170) scale(${1 - open * 0.85} 1)`}>
      <rect width="70" height="138" fill="#F2E6CF" />
      <path d="M0 0 L70 138 M70 0 L0 138" stroke="#C9B48E" strokeWidth="6" />
      <rect width="70" height="138" fill="none" stroke="#C9B48E" strokeWidth="6" />
    </g>
    <g transform={`translate(280 170) scale(${-(1 - open * 0.85)} 1)`}>
      <rect width="70" height="138" fill="#F2E6CF" />
      <path d="M0 0 L70 138 M70 0 L0 138" stroke="#C9B48E" strokeWidth="6" />
      <rect width="70" height="138" fill="none" stroke="#C9B48E" strokeWidth="6" />
    </g>
    <circle cx="210" cy="96" r="20" fill="#F2E6CF" />
    <circle cx="210" cy="96" r="12" fill="#2A1B14" />
  </Svg>
);

/** Monumental party HQ building (Casa del Fascio, kept generic). */
export const PartyHQ: React.FC<{size?: number; lit?: number}> = ({size = 460, lit = 1}) => (
  <Svg vb="0 0 460 340" size={size}>
    <rect x="300" y="20" width="70" height="300" fill="#CFC7B6" />
    <rect x="300" y="20" width="70" height="300" fill="#000" opacity="0.08" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <rect key={i} x="322" y={40 + i * 36} width="26" height="20" fill="#3A3A44" />
    ))}
    <rect x="20" y="110" width="300" height="210" fill="#E2DACA" />
    <rect x="20" y="100" width="300" height="16" fill="#BDB4A1" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={40 + i * 46} y="130" width="30" height="120" fill={i % 2 ? '#FFD98A' : '#3A3A44'} opacity={i % 2 ? 0.4 + 0.6 * lit : 1} />
    ))}
    <rect x="120" y="262" width="100" height="58" fill="#3A3A44" />
    <rect x="10" y="316" width="440" height="10" fill="#9E9686" />
    <line x1="335" y1="20" x2="335" y2="-30" stroke="#55565E" strokeWidth="4" />
    <path d="M337 -30 L385 -22 L337 -10 Z" fill="#2C2C34" />
  </Svg>
);

/** Factory gate with an arched sign. */
export const Gate: React.FC<{size?: number; label?: string; open?: number}> = ({size = 520, label = 'FERRARI', open = 1}) => (
  <Svg vb="0 0 520 320" size={size}>
    <rect x="40" y="80" width="40" height="230" fill="#E8E2D2" />
    <rect x="440" y="80" width="40" height="230" fill="#E8E2D2" />
    <path d="M60 90 Q260 10 460 90" stroke="#E8E2D2" strokeWidth="14" fill="none" />
    <text x="260" y="78" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="40" fill={C.rosso} letterSpacing="6">
      {label}
    </text>
    {[0, 1].map((side) => (
      <g key={side} transform={`translate(${side ? 440 : 80} 120) scale(${(side ? -1 : 1) * (1 - open * 0.92)} 1)`}>
        {new Array(9).fill(0).map((_, i) => (
          <line key={i} x1={i * 20 + 6} y1="0" x2={i * 20 + 6} y2="190" stroke="#3A3A44" strokeWidth="5" />
        ))}
        <line x1="0" y1="20" x2="180" y2="20" stroke="#3A3A44" strokeWidth="6" />
        <line x1="0" y1="170" x2="180" y2="170" stroke="#3A3A44" strokeWidth="6" />
      </g>
    ))}
  </Svg>
);

/* --------------------------------------------------------------- map */

const P = (lon: number, lat: number): [number, number] => [(lon - 6.2) * 0.743 * 100, (47.2 - lat) * 100];
const ITALY = [
  [7.5, 43.8], [8.2, 43.9], [8.8, 44.4], [9.8, 44.1], [10.3, 43.6], [10.5, 42.95], [11.1, 42.4], [11.8, 42.05], [12.4, 41.7], [13.0, 41.25], [13.8, 41.2], [14.2, 40.82],
  [14.45, 40.6], [15.0, 40.25], [15.6, 40.05], [15.8, 39.5], [16.15, 38.9], [15.65, 38.25], [15.95, 37.92], [16.6, 38.4], [17.15, 38.95], [16.55, 39.65], [17.2, 40.45],
  [18.0, 40.1], [18.5, 39.8], [18.5, 40.15], [17.95, 40.65], [16.9, 41.12], [16.0, 41.45], [16.15, 41.9], [15.65, 41.95], [15.1, 41.95], [14.4, 42.42], [13.85, 42.9],
  [13.6, 43.6], [12.6, 44.05], [12.3, 44.55], [12.45, 45.0], [12.3, 45.42], [13.1, 45.7], [13.75, 45.62], [13.7, 46.5], [12.4, 46.7], [11.0, 46.85], [10.4, 46.6],
  [9.3, 46.5], [8.4, 46.4], [7.0, 45.9], [6.7, 45.1], [7.0, 44.2],
];
const SICILY = [[12.4, 37.8], [13.3, 38.2], [14.5, 38.05], [15.6, 38.28], [15.1, 37.5], [15.3, 37.0], [15.1, 36.65], [14.3, 36.8], [13.0, 37.5]];
const SARDINIA = [[8.3, 41.0], [9.5, 41.2], [9.8, 40.5], [9.6, 39.2], [9.0, 39.05], [8.4, 38.95], [8.45, 39.8], [8.15, 40.6]];
const poly = (pts: number[][]) => {
  const p = pts.map(([a, b]) => P(a, b));
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    d += ` Q${a[0]} ${a[1]} ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2}`;
  }
  return d + ' Z';
};
export const ITALY_PATHS = [poly(ITALY), poly(SICILY), poly(SARDINIA)];
export const CITIES: Record<string, [number, number]> = {
  Modena: P(10.93, 44.65),
  Bologna: P(11.34, 44.49),
  Ravenna: P(12.2, 44.42),
  Milan: P(9.19, 45.46),
  Maranello: P(10.86, 44.53),
  Rome: P(12.5, 41.9),
  Brescia: P(10.2, 45.54),
  Lugo: P(11.9, 44.42),
};
/** Map viewBox is 0 0 940 1080 (roughly). Use CITIES for city positions in the same space. */
export const ItalyMap: React.FC<{size?: number; fill?: string; stroke?: string; children?: React.ReactNode; draw?: number}> = ({size = 600, fill = '#2B3A68', stroke = '#5C74B8', children, draw = 1}) => (
  <svg viewBox="0 0 940 1080" width={size} height={(size * 1080) / 940} style={{overflow: 'visible'}}>
    {ITALY_PATHS.map((d, i) => (
      <path key={i} d={d} fill={fill} fillOpacity={draw} stroke={stroke} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 1.4)} />
    ))}
    {children}
  </svg>
);

/* --------------------------------------------------------------- props */

export const Trophy: React.FC<{size?: number; color?: string; label?: string}> = ({size = 180, color = C.gold, label}) => (
  <Svg vb="0 0 160 200" size={size}>
    <path d="M40 20 L120 20 L116 80 Q110 116 80 118 Q50 116 44 80 Z" fill={color} />
    <path d="M40 34 Q8 34 14 62 Q20 86 46 88" stroke={color} strokeWidth="9" fill="none" />
    <path d="M120 34 Q152 34 146 62 Q140 86 114 88" stroke={color} strokeWidth="9" fill="none" />
    <rect x="72" y="116" width="16" height="30" fill={C.goldDeep} />
    <rect x="44" y="146" width="72" height="18" rx="4" fill={C.goldDeep} />
    <rect x="34" y="162" width="92" height="28" rx="5" fill="#5C3B20" />
    <path d="M60 30 L66 80" stroke="#fff" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
    {label && (
      <text x="80" y="76" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="34" fill={C.goldDeep}>
        {label}
      </text>
    )}
  </Svg>
);

export const MoneyBag: React.FC<{size?: number; sign?: string}> = ({size = 160, sign = '₤'}) => (
  <Svg vb="0 0 160 180" size={size}>
    <path d="M56 40 Q40 20 56 12 L104 12 Q120 20 104 40 Z" fill="#B88A4A" />
    <path d="M56 40 Q10 80 18 130 Q26 172 80 172 Q134 172 142 130 Q150 80 104 40 Z" fill="#D4A55A" />
    <rect x="52" y="34" width="56" height="12" rx="6" fill="#8A6430" />
    <text x="80" y="134" textAnchor="middle" fontFamily={serif} fontWeight={900} fontSize="64" fill="#8A6430">
      {sign}
    </text>
  </Svg>
);

export const Lira: React.FC<{size?: number}> = ({size = 90}) => (
  <Svg vb="0 0 100 100" size={size}>
    <circle cx="50" cy="52" r="44" fill={C.goldDeep} />
    <circle cx="50" cy="48" r="42" fill={C.gold} />
    <text x="50" y="66" textAnchor="middle" fontFamily={serif} fontWeight={900} fontSize="48" fill={C.goldDeep}>
      ₤
    </text>
  </Svg>
);

export const Wrench: React.FC<{size?: number; color?: string}> = ({size = 140, color = '#B8C0D0'}) => (
  <Svg vb="0 0 140 140" size={size}>
    <path d="M30 110 L84 56 A28 28 0 1 1 100 76 Z" fill="none" />
    <path d="M22 106 L80 48 Q72 22 94 12 Q108 6 120 12 L102 30 L110 38 L128 20 Q134 32 128 46 Q118 68 92 60 L34 118 Q24 126 18 118 Q12 112 22 106 Z" fill={color} />
  </Svg>
);

export const Tyre: React.FC<{size?: number}> = ({size = 140}) => (
  <Svg vb="0 0 140 140" size={size}>
    <circle cx="70" cy="70" r="64" fill="#1E1E24" />
    <circle cx="70" cy="70" r="64" fill="none" stroke="#33333C" strokeWidth="10" strokeDasharray="8 10" />
    <circle cx="70" cy="70" r="36" fill="#6C7080" />
    <circle cx="70" cy="70" r="12" fill="#B8C0D0" />
  </Svg>
);

export const Engine: React.FC<{size?: number; color?: string}> = ({size = 200, color = '#8A90A2'}) => (
  <Svg vb="0 0 200 140" size={size}>
    <rect x="20" y="40" width="160" height="80" rx="10" fill={color} />
    <rect x="30" y="20" width="140" height="26" rx="8" fill={C.rosso} />
    {new Array(6).fill(0).map((_, i) => (
      <circle key={i} cx={46 + i * 22} cy="33" r="5" fill="#F2D9A0" />
    ))}
    {new Array(4).fill(0).map((_, i) => (
      <rect key={i} x="34" y={58 + i * 14} width="132" height="6" rx="3" fill="#6B7184" />
    ))}
    <circle cx="20" cy="80" r="16" fill="#6B7184" />
  </Svg>
);

export const Crate: React.FC<{size?: number; label?: string}> = ({size = 150, label = 'PARTS'}) => (
  <Svg vb="0 0 150 130" size={size}>
    <rect x="5" y="10" width="140" height="115" rx="6" fill="#B07A45" />
    <path d="M5 10 L145 125 M145 10 L5 125" stroke="#8A5A30" strokeWidth="8" />
    <rect x="5" y="10" width="140" height="115" rx="6" fill="none" stroke="#8A5A30" strokeWidth="8" />
    <rect x="30" y="52" width="90" height="28" rx="4" fill="#F2EAD6" />
    <text x="75" y="73" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="20" fill="#5E3B20">
      {label}
    </text>
  </Svg>
);

/** 1930s race-car transporter truck, facing right. */
export const Truck: React.FC<{size?: number; color?: string; spin?: number; load?: boolean}> = ({size = 460, color = '#3F5B8C', spin = 0, load = true}) => (
  <Svg vb="0 0 560 220" size={size}>
    <ellipse cx="280" cy="210" rx="260" ry="7" fill="#000" opacity="0.25" />
    <rect x="30" y="140" width="380" height="24" rx="4" fill="#4A4038" />
    <path d="M410 164 L410 92 Q412 76 430 74 L480 74 Q500 76 508 100 L530 120 Q540 126 540 140 L540 164 Z" fill={color} />
    <path d="M432 84 L478 84 Q490 86 496 104 L432 104 Z" fill="#BFE4FF" opacity="0.8" />
    {load && (
      <g transform="translate(40 50) scale(0.68)">
        <path d="M28 126 Q30 100 110 94 L198 90 Q206 78 222 76 L262 76 Q270 76 274 88 L430 88 Q476 90 484 114 Q488 134 466 140 L64 142 Q28 142 28 126 Z" fill={C.rosso} />
        <circle cx="128" cy="146" r="40" fill="#16161C" />
        <circle cx="418" cy="146" r="40" fill="#16161C" />
      </g>
    )}
    <Wheel x={100} y={176} r={30} spin={spin} spokes={false} />
    <Wheel x={340} y={176} r={30} spin={spin} spokes={false} />
    <Wheel x={480} y={176} r={30} spin={spin} spokes={false} />
  </Svg>
);

/** Clipboard with entry forms. */
export const Clipboard: React.FC<{size?: number; title?: string}> = ({size = 150, title = 'ENTRIES'}) => (
  <Svg vb="0 0 140 180" size={size}>
    <rect x="8" y="14" width="124" height="160" rx="10" fill="#8A5A34" />
    <rect x="18" y="26" width="104" height="140" rx="4" fill="#F7F3E8" />
    <rect x="46" y="6" width="48" height="20" rx="6" fill="#B8C0D0" />
    <text x="70" y="52" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="16" fill="#333">
      {title}
    </text>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="28" y={66 + i * 18} width="10" height="10" rx="2" fill="none" stroke="#333" strokeWidth="2" />
        <path d={`M30 ${71 + i * 18} L33 ${74 + i * 18} L38 ${67 + i * 18}`} stroke={C.green} strokeWidth="3" fill="none" />
        <rect x="46" y={68 + i * 18} width={60 - (i % 2) * 18} height="6" rx="3" fill="#999" />
      </g>
    ))}
  </Svg>
);

/** Contract sheet. `sign` 0→1 draws signatures. */
export const Contract: React.FC<{size?: number; sign?: number; title?: string}> = ({size = 300, sign = 0, title = 'SOCIETÀ ANONIMA'}) => (
  <Svg vb="0 0 300 400" size={size}>
    <rect x="0" y="0" width="300" height="400" rx="8" fill={C.paper} />
    <rect x="0" y="0" width="300" height="400" rx="8" fill="none" stroke={C.paperDeep} strokeWidth="6" />
    <text x="150" y="54" textAnchor="middle" fontFamily={serif} fontWeight={900} fontSize="22" fill="#3A2A1E">
      {title}
    </text>
    <text x="150" y="82" textAnchor="middle" fontFamily={serif} fontWeight={700} fontSize="26" fill={C.rosso}>
      Scuderia Ferrari
    </text>
    {new Array(9).fill(0).map((_, i) => (
      <rect key={i} x="30" y={110 + i * 18} width={i % 4 === 3 ? 150 : 240} height="6" rx="3" fill="#BDB3A0" />
    ))}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <line x1={24 + i * 90} y1="350" x2={96 + i * 90} y2="350" stroke="#3A2A1E" strokeWidth="2" />
        <path
          d={`M${28 + i * 90} 342 q8 -22 14 -2 q6 18 12 -6 q6 -20 12 4 q6 12 14 -10`}
          stroke="#1C2A6B"
          strokeWidth="3"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.min(1, Math.max(0, sign * 3 - i))}
          strokeLinecap="round"
        />
      </g>
    ))}
  </Svg>
);

/** Small flying mosquito. */
export const Mosquito: React.FC<{size?: number; seed?: number}> = ({size = 60, seed = 0}) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame * 2.2 + seed) * 0.5 + 0.5;
  return (
    <Svg vb="0 0 60 50" size={size}>
      <ellipse cx="24" cy="18" rx="12" ry={4 + flap * 8} fill="#CFE6FF" opacity="0.6" transform="rotate(-25 24 18)" />
      <ellipse cx="36" cy="18" rx="12" ry={4 + flap * 8} fill="#CFE6FF" opacity="0.6" transform="rotate(25 36 18)" />
      <ellipse cx="30" cy="28" rx="12" ry="5" fill="#2E2A26" />
      <circle cx="44" cy="26" r="5" fill="#2E2A26" />
      <line x1="48" y1="27" x2="58" y2="32" stroke="#2E2A26" strokeWidth="1.5" />
      {[16, 26, 36].map((x) => (
        <path key={x} d={`M${x} 31 L${x - 4} 44`} stroke="#2E2A26" strokeWidth="1.2" />
      ))}
    </Svg>
  );
};

/** Moon with soft glow. */
export const Moon: React.FC<{size?: number}> = ({size = 160}) => (
  <Svg vb="0 0 160 160" size={size}>
    <circle cx="80" cy="80" r="76" fill="#FFF3C4" opacity="0.12" />
    <circle cx="80" cy="80" r="52" fill="#FFF0BA" />
    <circle cx="100" cy="66" r="44" fill="#000" opacity="0" />
    <circle cx="64" cy="70" r="8" fill="#E8D9A0" />
    <circle cx="92" cy="98" r="11" fill="#E8D9A0" />
  </Svg>
);

/** Newspaper with a car photo on the front page. */
export const MotorPaper: React.FC<{size?: number; title?: string; highlight?: number}> = ({size = 340, title = 'LA STAMPA SPORTIVA', highlight = 0}) => (
  <Svg vb="0 0 300 380" size={size}>
    <rect x="0" y="0" width="300" height="380" rx="6" fill="#EFE7D2" />
    <text x="150" y="40" textAnchor="middle" fontFamily={serif} fontWeight={900} fontSize="22" fill="#222">
      {title}
    </text>
    <rect x="16" y="52" width="268" height="3" fill="#222" />
    <rect x="16" y="64" width="268" height="20" rx="2" fill="#333" />
    <rect x="16" y="96" width="268" height="150" fill="#CFC5AE" stroke={C.red} strokeWidth={highlight * 8} />
    <g transform="translate(40 130) scale(0.42)">
      <path d="M28 126 Q30 100 110 94 L198 90 Q206 78 222 76 L262 76 Q270 76 274 88 L430 88 Q476 90 484 114 Q488 134 466 140 L64 142 Q28 142 28 126 Z" fill="#4A4036" />
      <circle cx="236" cy="56" r="20" fill="#4A4036" />
      <circle cx="128" cy="146" r="42" fill="#2A241E" />
      <circle cx="418" cy="146" r="42" fill="#2A241E" />
    </g>
    <path d="M16 200 Q100 190 284 210 L284 246 L16 246 Z" fill="#B9AE95" opacity="0.6" />
    {new Array(7).fill(0).map((_, i) => (
      <rect key={i} x="16" y={262 + i * 15} width={i % 3 === 2 ? 170 : 268} height="6" fill="#9A927F" />
    ))}
  </Svg>
);

/** Long dinner table with candles, plates, wine glasses. */
export const DinnerTable: React.FC<{size?: number}> = ({size = 1100}) => {
  const frame = useCurrentFrame();
  return (
    <Svg vb="0 0 1100 200" size={size}>
      <rect x="20" y="70" width="1060" height="40" rx="8" fill="#F4ECDC" />
      <path d="M20 106 L1080 106 L1060 180 L40 180 Z" fill="#E9DDC6" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <path key={i} d={`M${70 + i * 105} 106 Q${100 + i * 105} 150 ${130 + i * 105} 106`} fill="#DDD0B5" />
      ))}
      {[200, 550, 900].map((x, i) => (
        <g key={x}>
          <rect x={x - 6} y="20" width="12" height="52" fill="#F7F2E4" />
          <ellipse cx={x} cy={12 + Math.sin(frame / 3 + i) * 1.5} rx={6 + Math.sin(frame / 2 + i) * 1} ry="12" fill="#FFC94D" />
          <ellipse cx={x} cy="14" rx="2.5" ry="6" fill="#FFF3C4" />
          <circle cx={x} cy="16" r="40" fill="#FFC94D" opacity="0.08" />
        </g>
      ))}
      {[110, 340, 760, 990].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="82" rx="40" ry="10" fill="#fff" />
          <ellipse cx={x} cy="82" rx="26" ry="6" fill="#E9E2D2" />
          <path d={`M${x + 50} 46 L${x + 64} 46 L${x + 60} 66 L${x + 54} 66 Z`} fill="#8E1B2A" opacity="0.85" />
          <line x1={x + 57} y1="66" x2={x + 57} y2="80" stroke="#DDD" strokeWidth="2" />
        </g>
      ))}
    </Svg>
  );
};

/** Bomb (for the war). */
export const Bomb: React.FC<{size?: number}> = ({size = 60}) => (
  <Svg vb="0 0 40 80" size={size}>
    <path d="M20 4 Q34 16 34 40 Q34 64 20 76 Q6 64 6 40 Q6 16 20 4 Z" fill="#3A3C46" />
    <path d="M10 2 L30 2 L24 14 L16 14 Z" fill="#55586A" />
  </Svg>
);

/** Explosion burst. */
export const Burst: React.FC<{size?: number; p?: number}> = ({size = 300, p = 1}) => {
  const pts = new Array(16).fill(0).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = i % 2 ? 60 : 100;
    return `${100 + Math.cos(a) * r * p} ${100 + Math.sin(a) * r * p}`;
  });
  return (
    <Svg vb="0 0 200 200" size={size}>
      <path d={`M${pts.join(' L')} Z`} fill="#FF8A2A" opacity={1 - p * 0.6} />
      <circle cx="100" cy="100" r={46 * p} fill="#FFD45C" opacity={1 - p * 0.7} />
    </Svg>
  );
};

/** Checkered flag. */
export const CheckFlag: React.FC<{size?: number; wave?: number}> = ({size = 200, wave = 0}) => {
  const cells = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 7; c++) {
      const dy = Math.sin(c * 0.9 + wave) * 6;
      cells.push(<rect key={`${r}${c}`} x={30 + c * 22} y={10 + r * 22 + dy} width="22" height="22" fill={(r + c) % 2 ? '#111' : '#F4F4F4'} />);
    }
  return (
    <Svg vb="0 0 200 200" size={size}>
      <rect x="20" y="4" width="8" height="190" rx="3" fill="#9097A8" />
      {cells}
    </Svg>
  );
};

/** Lock/ban sign: circle with a slash. */
export const NoSign: React.FC<{size?: number; color?: string; p?: number}> = ({size = 300, color = C.red, p = 1}) => (
  <Svg vb="0 0 200 200" size={size}>
    <circle cx="100" cy="100" r="86" fill="none" stroke={color} strokeWidth="18" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    <line x1="40" y1="40" x2={40 + 120 * p} y2={40 + 120 * p} stroke={color} strokeWidth="18" strokeLinecap="round" />
  </Svg>
);

/** Name plate. */
export const Plate: React.FC<{text: string; size?: number; color?: string; fg?: string; font?: 'head' | 'serif'}> = ({text, size = 60, color = C.paper, fg = '#2A1E18', font = 'head'}) => (
  <div
    style={{
      padding: `${size * 0.25}px ${size * 0.6}px`,
      background: color,
      color: fg,
      fontFamily: font === 'serif' ? serif : head,
      fontWeight: font === 'serif' ? 900 : 700,
      fontSize: size,
      letterSpacing: size * 0.08,
      borderRadius: size * 0.18,
      boxShadow: `inset 0 -${size * 0.1}px 0 rgba(0,0,0,0.15), 0 14px 40px rgba(0,0,0,0.4)`,
      whiteSpace: 'nowrap',
      lineHeight: 1.1,
    }}
  >
    {text}
  </div>
);

export const Label: React.FC<{text: string; size?: number; color?: string; o?: number}> = ({text, size = 30, color = C.muted, o = 1}) => (
  <div style={{fontFamily: body, fontWeight: 900, fontSize: size, color, letterSpacing: size * 0.12, textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: o, textShadow: '0 3px 14px rgba(0,0,0,0.5)'}}>{text}</div>
);
