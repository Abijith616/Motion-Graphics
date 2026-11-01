import React from 'react';
import {interpolate, random} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop} from '../components/Base';
import {Calendar} from '../components/Art';
import {Biplane, Bomb, Burst, Char, CITIES, Factory, ItalyMap, Plate, VintageCar} from '../components/Ferrari';
import {Caption, Cross, Ground, Road, SpeedLines, Stamp, Title} from '../components/Kit';
import {Q, QX} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';
import {ENZO} from './s2_horse';

const Gear: React.FC<{size?: number; spin?: number; color?: string}> = ({size = 120, spin = 0, color = '#8A90A2'}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${spin}deg)`}}>
    {new Array(10).fill(0).map((_, i) => (
      <rect key={i} x="-7" y="-48" width="14" height="18" rx="3" fill={color} transform={`rotate(${i * 36})`} />
    ))}
    <circle r="34" fill={color} />
    <circle r="12" fill={C.bg1} />
  </svg>
);

/** Back to Modena: a new company — Auto Avio Costruzioni. On paper: machine tools. */
const NewCo: React.FC = () => {
  const fr = useCurrentFrame();
  const scan = range(fr, Q.noferrari - 0.2, Q.noferrari + 1.0, 0, 1);
  const name = 'AUTO AVIO COSTRUZIONI';
  return (
    <>
      <Title at={Q.whatdo} out={Q.goesback} text="So what does he do?" y={540} size={90} />
      <Pop at={Q.goesback} x={960} y={560}>
        <div style={{position: 'relative'}}>
          <Factory size={640} color="#E2DCCB" roof="#5A6482" />
          <div style={{position: 'absolute', left: 120, top: 120, width: 400, height: 54, background: '#1C1C22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}} />
        </div>
      </Pop>
      <Pop at={Q.goesback + 0.3} x={960} y={880}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted, letterSpacing: 6}}>MODENA · A NEW COMPANY</div>
      </Pop>
      <Caption at={Q.andname} out={QX.autoavio - 0.2} text="And the name?" y={200} size={56} color={C.ink} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', opacity: prog(fr, QX.autoavio - 0.6, 0.4)}}>
        <span style={{fontFamily: head, fontWeight: 700, fontSize: 92, letterSpacing: 6, color: C.ink, position: 'relative'}}>
          {name}
          <div style={{position: 'absolute', top: -10, bottom: -10, left: `${scan * 100}%`, width: 8, background: C.yellow, opacity: scan > 0 && scan < 1 ? 1 : 0, boxShadow: '0 0 20px rgba(255,216,10,0.8)'}} />
        </span>
      </div>
      <Pop at={Q.noferrari + 1.0} x={960} y={330}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(232,32,42,0.2)', padding: '8px 24px', borderRadius: 30}}>
          <span style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.ink}}>
            “Ferrari” found: <span style={{color: C.red}}>0</span>
          </span>
        </div>
      </Pop>
      <Pop at={Q.onpaper} x={1580} y={560} rot={4}>
        <div style={{width: 300, height: 380, background: C.paper, borderRadius: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 26, color: '#3A2A1E'}}>Business</div>
          <div style={{display: 'flex', gap: 6, marginTop: 30}}>
            <Gear size={110} spin={fr * 2} color="#7A8094" />
            <div style={{marginTop: 50}}>
              <Gear size={80} spin={-fr * 2.7} color="#A0A6B8" />
            </div>
          </div>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 26, color: '#3A2A1E', marginTop: 24, opacity: prog(fr, Q.tools, 0.3)}}>MACHINE TOOLS</div>
        </div>
      </Pop>
    </>
  );
};

/** 1940: two cars for the Mille Miglia; one driven by young Ascari. Called the 815. */
const Car815: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const drive = interpolate(t, [Q.twocars, Q.twocars + 1.6], [-600, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (n) => 1 - Math.pow(1 - n, 3)});
  const ghost = prog(fr, Q.firstbuilt - 0.3, 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 100, fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow, opacity: prog(fr, Q.y1940, 0.4)}}>1940</div>
      <Pop at={Q.mille} x={1350} y={180}>
        <div style={{background: C.rosso, color: '#fff', fontFamily: serif, fontStyle: 'italic', fontWeight: 900, fontSize: 64, padding: '8px 40px', borderRadius: 10, boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>Mille Miglia</div>
      </Pop>
      <Pop at={Q.mille + 0.4} x={1350} y={270}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: C.muted, letterSpacing: 4}}>A 1,000-MILE ROAD RACE</div>
      </Pop>
      <Road y={790} speed={0} />
      {[0, 1].map((i) => (
        <Place key={i} x={560 + i * 760 + drive} y={760} w={720} h={300}>
          <div style={{position: 'relative'}}>
            <VintageCar size={660} color="#B8141E" num={String(i ? 66 : 65)} helmet={i ? '#5C4026' : '#7A4A2A'} spin={drive} blur={Math.min(1, -drive / 220)} />
            {t > Q.c815 - 0.2 && (
              <div style={{position: 'absolute', left: 330, top: 130, transform: `scale(${pop(fr, Q.c815 + i * 0.1, 10)})`, background: C.ink, color: C.bg0, fontFamily: head, fontWeight: 700, fontSize: 44, padding: '0 14px', borderRadius: 8}}>815</div>
            )}
          </div>
        </Place>
      ))}
      <Pop at={Q.ascari} x={1320} y={470} out={Q.firstbuilt - 0.3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Char size={150} outfit="racer" hat="helmet" hair="#2A1E18" mood="happy" seed={40} arms="wave" />
          <div>
            <div style={{fontFamily: serif, fontWeight: 900, fontSize: 46, color: C.ink}}>Alberto Ascari</div>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 26, color: C.muted, letterSpacing: 3}}>YOUNG DRIVER</div>
          </div>
        </div>
      </Pop>
      <Caption at={Q.nameoncar} out={Q.notferrari} text="And the name on the car?" y={1000} size={48} color={C.ink} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, textAlign: 'center', opacity: prog(fr, Q.notferrari, 0.3)}}>
        <span style={{position: 'relative', fontFamily: head, fontWeight: 700, fontSize: 90, color: C.dim, letterSpacing: 8}}>
          FERRARI
          <div style={{position: 'absolute', left: -10, right: -10, top: '50%', height: 10, background: C.red, transform: `scaleX(${prog(fr, Q.notferrari + 0.3, 0.3)})`, transformOrigin: '0 50%'}} />
        </span>
        <span style={{fontFamily: head, fontWeight: 700, fontSize: 90, color: C.yellow, letterSpacing: 8, marginLeft: 50, opacity: prog(fr, Q.c815, 0.3)}}>→ 815</span>
      </div>
      <div style={{position: 'absolute', inset: 0, background: `rgba(8,11,24,${0.75 * ghost})`}} />
      <Title at={Q.firstbuilt} out={Q.war} text={<>The first car <span style={{color: C.red}}>Enzo Ferrari</span> ever built.</>} y={430} size={76} />
      <Caption at={Q.firstbuilt + 1.6} out={Q.war} text={<>And his name <span style={{color: C.red}}>isn't on it.</span></>} y={600} size={58} color={C.ink} />
      <Caption at={Q.couldnt} out={Q.war} text="It couldn't be." y={720} size={44} />
    </>
  );
};

/** War: the factory moves to Maranello, works for the war effort, gets bombed. The ban expires. */
const War: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const boom = prog(fr, Q.bombed + 0.6, 1.2);
  const shake = t > Q.bombed + 0.6 && t < Q.bombed + 1.2 ? Math.sin(fr * 3) * 10 : 0;
  const s = 0.55;
  const [mx, my] = CITIES.Modena;
  const [rx, ry] = CITIES.Maranello;
  const end = prog(fr, Q.warends, 0.6);
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <Title at={Q.war} out={Q.maranello} text={<span style={{color: C.muted}}>Then the war comes.</span>} y={540} size={90} />
      {/* small map hop */}
      <Place x={330} y={420} w={420} h={420} s={pop(fr, Q.maranello, 12)} o={1 - end}>
        <div style={{position: 'relative', width: 400, height: 400, overflow: 'hidden', borderRadius: 30, background: 'rgba(255,255,255,0.04)'}}>
          <div style={{position: 'absolute', left: -mx * 2.2 + 200, top: -my * 2.2 + 200}}>
            <ItalyMap size={940 * 2.2} fill="#2E3150" stroke="#5C74B8" />
          </div>
          <svg width="400" height="400" style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={200} cy={200} r="10" fill={C.ink} />
            <circle cx={200 + (rx - mx) * 2.2} cy={200 + (ry - my) * 2.2} r={14 * pop(fr, Q.maranello + 0.5)} fill={C.red} />
            <text x={215} y={196} fontFamily={body} fontWeight={900} fontSize="26" fill={C.muted}>
              Modena
            </text>
            <text x={170 + (rx - mx) * 2.2} y={250 + (ry - my) * 2.2} fontFamily={body} fontWeight={900} fontSize="30" fill={C.ink}>
              Maranello
            </text>
          </svg>
        </div>
      </Place>
      <Pop at={Q.maranello + 0.3} x={1100} y={650}>
        <div style={{position: 'relative', filter: `grayscale(${boom * 0.8}) brightness(${1 - boom * 0.4})`}}>
          <Factory size={620} color="#D9D2C2" roof="#5A6482" lit={t > Q.effort ? 1 : 0.4} />
          {t > Q.effort && (
            <div style={{position: 'absolute', left: 120, top: 90, transform: `scale(${pop(fr, Q.effort)})`}}>
              <div style={{background: '#3D4F3A', color: '#E8E2D2', fontFamily: head, fontWeight: 700, fontSize: 30, padding: '4px 18px', borderRadius: 6, letterSpacing: 3}}>WAR EFFORT</div>
            </div>
          )}
        </div>
      </Pop>
      <Ground y={880} color="#1A1C26" />
      {/* bombers + bombs */}
      {t > Q.bombed - 1.2 &&
        [0, 1].map((i) => (
          <Place key={i} x={interpolate(t, [Q.bombed - 1.2, Q.bombed + 2.5], [-400, 2300]) - i * 300} y={140 + i * 70} w={400} h={200} s={0.45}>
            <div style={{filter: 'brightness(0.35)'}}>
              <Biplane size={600} horse={0} color="#5A5A60" prop={fr} />
            </div>
          </Place>
        ))}
      {[0, 1, 2].map((i) => {
        const p = prog(fr, Q.bombed - 0.2 + i * 0.15, 0.8, (n) => n * n);
        if (p <= 0 || p >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 980 + i * 110, top: 200 + p * 380, transform: 'rotate(180deg)'}}>
            <Bomb size={60} />
          </div>
        );
      })}
      {[0, 1, 2].map((i) => {
        const p = prog(fr, Q.bombed + 0.6 + i * 0.15, 0.9);
        if (p <= 0 || p >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 900 + i * 120, top: 470 - i * 20}}>
            <Burst size={300} p={p} />
          </div>
        );
      })}
      {new Array(10).fill(0).map((_, i) => {
        const p = prog(fr, Q.bombed + 0.8 + i * 0.05, 3);
        return <div key={i} style={{position: 'absolute', left: 950 + random(`sm${i}`) * 400, top: 500 - p * 300 - random(`smy${i}`) * 100, width: 80 + p * 160, height: 80 + p * 160, borderRadius: '50%', background: '#4A4A54', opacity: boom * (1 - p) * 0.7}} />;
      })}
      {/* ban expires */}
      <div style={{position: 'absolute', inset: 0, background: `rgba(8,11,24,${0.7 * end})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 24, opacity: end}}>
        {[1940, 1941, 1942, 1943].map((y, i) => (
          <div key={y} style={{opacity: 1 - prog(fr, Q.longgone - 0.5 + i * 0.15, 0.4) * 0.7, transform: `rotate(${prog(fr, Q.longgone - 0.5 + i * 0.15, 0.4) * (i % 2 ? 8 : -8)}deg)`}}>
            <Calendar size={180} top="BAN" big={String(y)} color={C.dim} />
          </div>
        ))}
      </div>
      <Stamp at={Q.longgone} text="EXPIRED" x={960} y={450} size={110} color={C.mint} />
      <Caption at={Q.warends} text={<>By the time the war ends, <span style={{color: C.mint}}>those four years are long gone.</span></>} y={760} size={46} color={C.ink} />
    </div>
  );
};

export const NONAME: SceneDef[] = [
  {from: Q.whatdo, C: NewCo, tint: '#1C2030', glow: '#2E3448', sfx: [sx(Q.goesback, 'pop', 0.1), sx(QX.autoavio - 0.6, 'typing', 0.14), sx(Q.noferrari - 0.2, 'scan', 0.12), sx(Q.noferrari + 1.0, 'negative', 0.1), sx(Q.onpaper, 'paper', 0.12), sx(Q.tools, 'machine', 0.12)]},
  {from: Q.y1940, C: Car815, tint: '#2A1A1C', glow: '#4A2A2C', sfx: [sx(Q.y1940, 'boom', 0.12), sx(Q.twocars, 'engine_rev', 0.22), sx(Q.mille, 'pop', 0.1), sx(Q.ascari, 'pop', 0.1), sx(Q.notferrari + 0.3, 'swish', 0.1), sx(Q.c815, 'stamp', 0.14), sx(Q.firstbuilt, 'thud', 0.1)]},
  {from: Q.war, C: War, tint: '#16181E', glow: '#26282E', sfx: [sx(Q.war, 'drone_dark', 0.16), sx(Q.maranello, 'pop', 0.1), sx(Q.effort, 'machine', 0.12), sx(Q.bombed - 1.2, 'plane', 0.16), sx(Q.bombed - 0.2, 'bomb', 0.16), sx(Q.bombed + 0.6, 'explosion', 0.3), sx(Q.longgone, 'stamp', 0.18)]},
];
