import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {Glow, Place, Pop} from '../components/Base';
import {Calendar, Pin} from '../components/Art';
import {Char, CITIES, Contract, Factory, ItalyMap, Label, MoneyBag, Plate, Shield, Stable, Trophy, VintageCar} from '../components/Ferrari';
import {Arrow, Badge, Bubble, Caption, Ground, Road, SpeedLines, Stamp, Title} from '../components/Kit';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';
import {ENZO} from './s2_horse';
import {KID} from './s1_boy';

/** German teams, backed by government money, are winning. */
const Germans: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const race = (t - Q.german) * 900;
  return (
    <>
      <Caption at={Q.last} out={Q.german} text="It doesn't last." y={540} size={80} color={C.ink} />
      <div style={{opacity: prog(fr, Q.german, 0.4)}}>
        <Road y={760} speed={36} />
        <SpeedLines y0={700} y1={880} n={18} />
        {[0, 1].map((i) => (
          <Place key={i} x={interpolate(t, [Q.german, Q.german + 2.5], [-300, 1300 + i * 260], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) - i * 380} y={760 - i * 16} w={560} h={240}>
            <VintageCar size={500} color={C.silver} num={i ? '4' : '2'} helmet="#EEE" spin={race * 1.5} />
          </Place>
        ))}
        <Place x={interpolate(t, [Q.german, Q.german + 2.5], [-300, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} y={780} w={560} h={240}>
          <VintageCar size={460} color="#B8141E" num="6" spin={race} />
        </Place>
      </div>
      <Pop at={Q.german + 0.4} x={1300} y={190}>
        <div style={{display: 'flex', gap: 20}}>
          <Plate text="MERCEDES-BENZ" size={40} color={C.silver} fg="#1B1F2A" />
          <Plate text="AUTO UNION" size={40} color={C.silver} fg="#1B1F2A" />
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 1150, top: 300, display: 'flex', gap: 14, alignItems: 'flex-end'}}>
        {new Array(4).fill(0).map((_, i) => (
          <div key={i} style={{transform: `scale(${pop(fr, Q.govmoney + i * 0.15)})`}}>
            <MoneyBag size={110} sign="ℳ" />
          </div>
        ))}
      </div>
      <Pop at={Q.govmoney + 0.3} x={1380} y={480}>
        <Label text="Government money" size={30} color={C.ink} />
      </Pop>
      <div style={{position: 'absolute', left: 240, top: 240, display: 'flex', gap: 10}}>
        {new Array(5).fill(0).map((_, i) => (
          <div key={i} style={{transform: `scale(${pop(fr, Q.winning + i * 0.12)})`}}>
            <Trophy size={90} color={C.silver} />
          </div>
        ))}
      </div>
    </>
  );
};

/** 1937: Alfa takes racing back; Scuderia Ferrari is shut down. Eight years — gone. */
const Shutdown: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const close = prog(fr, Q.shut, 0.6);
  const gone = prog(fr, Q.gone, 0.8);
  const eightP = prog(fr, Q.eight, 1.0);
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 100, fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow, opacity: prog(fr, Q.y1937, 0.4) * (1 - prog(fr, Q.eight, 0.4))}}>1937</div>
      <Pop at={Q.y1937 + 0.3} x={460} y={600}>
        <div style={{opacity: 1 - prog(fr, Q.eight, 0.4)}}>
          <Factory size={460} color="#E4DCCB" roof="#9E1B22" label="ALFA ROMEO" />
        </div>
      </Pop>
      <Bubble at={Q.ourselves - 0.3} out={Q.eight} x={560} y={380} width={620} size={40} italic text="“We'll do racing ourselves again.”" />
      <Pop at={Q.buys} x={960} y={420}>
        <div style={{opacity: 1 - prog(fr, Q.eight, 0.4), display: 'flex', alignItems: 'center', gap: 12}}>
          <Contract size={120} title="SHARES" sign={1} />
        </div>
      </Pop>
      <Arrow at={Q.buys + 0.2} d="M 1260 420 Q 1000 300 700 420" color={C.red} width={8} out={Q.eight} />
      <Place x={1460} y={620} w={520} h={420} s={pop(fr, Q.y1937 + 0.2, 12)}>
        <div style={{position: 'relative', filter: `grayscale(${gone})`, opacity: 1 - gone * 0.6}}>
          <Stable size={460} open={1 - close} />
          <div style={{position: 'absolute', left: 200, top: 68}}>
            <Shield size={60} plain />
          </div>
        </div>
      </Place>
      <Stamp at={Q.shut + 0.4} text="CLOSED" x={1460} y={660} size={100} />
      {/* eight years / his team / his name / gone */}
      <div style={{position: 'absolute', left: 160, top: 230, width: 1000, opacity: prog(fr, Q.eight, 0.4)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: serif, fontWeight: 900, fontSize: 60, color: C.ink}}>
          <span>1929</span>
          <span>1937</span>
        </div>
        <div style={{height: 26, borderRadius: 13, background: C.bg3, marginTop: 10, overflow: 'hidden'}}>
          <div style={{width: `${eightP * 100}%`, height: '100%', background: C.red, opacity: 1 - gone * 0.7}} />
        </div>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 64, color: C.yellow, marginTop: 14, letterSpacing: 3}}>8 YEARS OF WORK</div>
      </div>
      <div style={{position: 'absolute', left: 160, top: 560, display: 'flex', gap: 60, alignItems: 'center'}}>
        <div style={{opacity: prog(fr, Q.histeam, 0.3) * (1 - gone), transform: `translateY(${gone * 200}px) rotate(${gone * 20}deg)`, textAlign: 'center'}}>
          <Shield size={150} plain />
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: C.ink, marginTop: 10}}>His team.</div>
        </div>
        <div style={{opacity: prog(fr, Q.hisname2, 0.3), textAlign: 'center'}}>
          <div style={{display: 'flex'}}>
            {'FERRARI'.split('').map((l, i) => (
              <span key={i} style={{display: 'inline-block', fontFamily: head, fontWeight: 700, fontSize: 110, color: C.red, transform: `translateY(${gone * (200 + random(`g${i}`) * 300)}px) rotate(${gone * (random(`r${i}`) - 0.5) * 120}deg)`, opacity: 1 - gone}}>
                {l}
              </span>
            ))}
          </div>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: C.ink, opacity: 1 - gone}}>His name.</div>
        </div>
      </div>
      <Caption at={Q.gone} text={<span style={{fontFamily: head, fontSize: 110, letterSpacing: 14, color: C.muted}}>GONE.</span>} y={980} />
    </>
  );
};

/** To Milan: an employee again. */
const Milan: React.FC = () => {
  const fr = useCurrentFrame();
  const s = 0.75;
  const [mx, my] = CITIES.Modena;
  const [lx, ly] = CITIES.Milan;
  const crack = prog(fr, Q.either, 0.4);
  return (
    <>
      <Place x={520} y={560} w={720} h={820}>
        <div style={{position: 'relative', width: 940 * s, height: 1080 * s, transform: 'translateY(120px)'}}>
          <ItalyMap size={940 * s} fill="#2E3150" stroke="#5C74B8" />
          <svg width={940 * s} height={1080 * s} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <path d={`M ${mx * s} ${my * s} Q ${((mx + lx) / 2) * s} ${((my + ly) / 2) * s - 120} ${lx * s} ${ly * s}`} stroke={C.yellow} strokeWidth="8" fill="none" strokeDasharray="2 14" strokeLinecap="round" pathLength={1} />
            <circle cx={mx * s} cy={my * s} r="12" fill={C.ink} />
            <circle cx={lx * s} cy={ly * s} r={14 * pop(fr, Q.milan + 0.6)} fill={C.red} />
            <text x={mx * s + 18} y={my * s + 30} fontFamily={body} fontWeight={900} fontSize="30" fill={C.muted}>
              Modena
            </text>
            <text x={lx * s - 30} y={ly * s - 26} fontFamily={body} fontWeight={900} fontSize="36" fill={C.ink} opacity={prog(fr, Q.milan + 0.6, 0.3)}>
              Milan
            </text>
          </svg>
        </div>
      </Place>
      <Pop at={Q.milan + 0.8} x={1350} y={480}>
        <Factory size={520} color="#E4DCCB" roof="#9E1B22" label="ALFA CORSE" />
      </Pop>
      <Pop at={Q.employee - 0.6} x={1350} y={780}>
        <Char size={240} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood={crack > 0 ? 'worried' : 'neutral'} seed={3} />
      </Pop>
      <Pop at={Q.employee} x={1560} y={760} rot={8}>
        <div style={{position: 'relative', background: '#F6F1E4', padding: '10px 20px', borderRadius: 10, fontFamily: head, fontWeight: 700, fontSize: 36, color: '#3A2A1E', letterSpacing: 3, boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>
          EMPLOYEE
          <svg width="200" height="60" viewBox="0 0 200 60" style={{position: 'absolute', left: 0, top: 0, opacity: crack}}>
            <path d="M100 0 L90 20 L108 30 L94 60" stroke="#3A2A1E" strokeWidth="4" fill="none" />
          </svg>
        </div>
      </Pop>
      <Caption at={Q.either} text="That doesn't last either." y={1000} size={46} color={C.ink} />
    </>
  );
};

/** 1939: fired, with a four-year clause. */
const Fired: React.FC = () => {
  const fr = useCurrentFrame();
  const cal = prog(fr, Q.fouryears, 1.4);
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 100, fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow, opacity: prog(fr, Q.y1939, 0.4)}}>1939</div>
      <Pop at={Q.y1939 + 0.3} x={460} y={600}>
        <Char size={300} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="angry" seed={3} />
      </Pop>
      <Stamp at={Q.fires} text="FIRED" x={460} y={800} size={110} />
      <Pop at={Q.clause} x={1300} y={340} rot={-2}>
        <div style={{width: 760, background: C.paper, borderRadius: 14, padding: '26px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 36, color: '#3A2A1E'}}>Exit agreement — clause</div>
          <div style={{height: 3, background: '#3A2A1E', margin: '12px 0 18px', opacity: 0.4}} />
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: '#3A2A1E', background: `rgba(255,216,10,${0.6 * prog(fr, Q.fouryears, 0.5)})`, padding: '4px 10px', borderRadius: 6, display: 'inline-block'}}>For four years, Enzo may not:</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, opacity: prog(fr, Q.rebuild, 0.3)}}>
            <Badge ok={false} size={50} />
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: '#3A2A1E'}}>rebuild his Scuderia</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, opacity: prog(fr, Q.cantput, 0.3)}}>
            <Badge ok={false} size={50} />
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: '#3A2A1E'}}>
              put the name <span style={{color: C.rosso}}>Ferrari</span> on a racing car
            </div>
          </div>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 940, top: 700, display: 'flex', gap: 24}}>
        {[1940, 1941, 1942, 1943].map((y, i) => (
          <div key={y} style={{transform: `scale(${pop(fr, Q.fouryears + i * 0.2)})`, opacity: interpolate(cal, [i / 4, i / 4 + 0.2], [0.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <Calendar size={150} top="BAN" big={String(y)} color={C.red} />
          </div>
        ))}
      </div>
    </>
  );
};

/** The boy who said "I'll be a racer" is 41 — and can't use his own name. */
const FortyOne: React.FC = () => {
  const fr = useCurrentFrame();
  const age = Math.round(interpolate(fr, [f(Q.boysaid + 0.8), f(Q.fortyone + 0.6)], [10, 41], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const lock = prog(fr, Q.notallowed, 0.4);
  return (
    <>
      <Title at={Q.thinkabout} out={Q.boysaid} text="Now think about that." y={540} size={90} />
      <Pop at={Q.boysaid} x={430} y={640}>
        <div style={{filter: 'sepia(0.6)'}}>
          <Char size={230} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood="happy" seed={2} />
        </div>
      </Pop>
      <Bubble at={Q.boysaid + 0.3} x={520} y={420} width={420} size={38} italic text="“I'll be a racer.”" />
      <Arrow at={Q.boysaid + 0.9} d="M 640 660 L 1180 660" color={C.dim} width={8} dash dur={1} />
      <Pop at={Q.fortyone - 0.4} x={1430} y={620}>
        <Char size={300} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="sad" seed={3} />
      </Pop>
      <div style={{position: 'absolute', left: 760, top: 520, width: 300, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 110, color: C.yellow, opacity: prog(fr, Q.boysaid + 0.8, 0.3)}}>{age}</div>
      <div style={{position: 'absolute', left: 760, top: 650, width: 300, textAlign: 'center', fontFamily: body, fontWeight: 900, fontSize: 28, color: C.muted, letterSpacing: 4, opacity: prog(fr, Q.boysaid + 0.8, 0.3)}}>YEARS OLD</div>
      <Pop at={Q.notallowed} x={1430} y={940}>
        <div style={{position: 'relative'}}>
          <Plate text="FERRARI" size={60} color={C.rosso} fg="#fff" />
          <div style={{position: 'absolute', left: -20, right: -20, top: '45%', height: 16, background: '#1A1A22', transform: `rotate(-8deg) scaleX(${lock})`, borderRadius: 8}} />
          <div style={{position: 'absolute', left: -20, right: -20, top: '45%', height: 16, background: '#1A1A22', transform: `rotate(8deg) scaleX(${lock})`, borderRadius: 8}} />
        </div>
      </Pop>
    </>
  );
};

export const LOSING: SceneDef[] = [
  {from: Q.last, C: Germans, tint: '#1C202A', glow: '#2E3442', sfx: [sx(Q.last, 'negative', 0.1), sx(Q.german, 'engine_by', 0.3), sx(Q.german + 0.6, 'engine_by', 0.22), sx(Q.govmoney, 'coin', 0.12), sx(Q.winning, 'pops_many', 0.08)]},
  {from: Q.y1937, C: Shutdown, tint: '#24161A', glow: '#40242A', sfx: [sx(Q.y1937, 'boom', 0.12), sx(Q.ourselves - 0.3, 'pop', 0.1), sx(Q.buys, 'paper', 0.12), sx(Q.shut, 'door', 0.2), sx(Q.shut + 0.4, 'stamp', 0.2), sx(Q.eight, 'whoosh', 0.08), sx(Q.gone, 'crumble', 0.2)]},
  {from: Q.milan, C: Milan, tint: '#1E1E2C', glow: '#30304A', sfx: [sx(Q.milan, 'whoosh', 0.1), sx(Q.milan + 0.6, 'pop', 0.1), sx(Q.employee, 'stamp', 0.12), sx(Q.either, 'crack', 0.14)]},
  {from: Q.y1939, C: Fired, tint: '#2A1416', glow: '#4A1E22', sfx: [sx(Q.y1939, 'boom', 0.12), sx(Q.fires, 'stamp', 0.22), sx(Q.clause, 'paper', 0.14), sx(Q.fouryears, 'tick', 0.1), sx(Q.fouryears + 0.2, 'tick', 0.1), sx(Q.fouryears + 0.4, 'tick', 0.1), sx(Q.fouryears + 0.6, 'tick', 0.1), sx(Q.rebuild, 'negative', 0.08), sx(Q.cantput, 'negative', 0.08)]},
  {from: Q.thinkabout, C: FortyOne, tint: '#1C1A2A', glow: '#302A44', sfx: [sx(Q.boysaid, 'pop', 0.1), sx(Q.boysaid + 0.9, 'tape', 0.12), sx(Q.fortyone - 0.4, 'pop', 0.1), sx(Q.notallowed, 'chain', 0.18)]},
];
