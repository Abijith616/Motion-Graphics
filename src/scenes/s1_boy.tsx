import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Pop, Place, Words, Glow} from '../components/Base';
import {Book} from '../components/Art';
import {Char, Crowd, CITIES, Factory, ItalyMap, Label, Mosquito, Moon, MotorPaper, VintageCar, Wrench} from '../components/Ferrari';
import {Bubble, Caption, Cross, Ground, Hand, Polaroid, Road, SpeedLines, Title} from '../components/Kit';
import {Pin} from '../components/Art';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';

export const KID = {hair: '#2A1E18', shirt: '#4F6FA8', skin: C.skin};

/** "To answer it, we need to go back." — a clock spins the years backwards. */
const GoBack: React.FC = () => {
  const fr = useCurrentFrame();
  const p = range(fr, Q.goback + 0.2, Q.y1908 - 0.1, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const year = Math.round(interpolate(p, [0, 1], [2026, 1908]));
  const spin = -p * 2160;
  return (
    <>
      <Place x={960} y={440} w={760} h={760} s={0.78}>
        <svg width="720" height="720" viewBox="0 0 720 720">
          <circle cx="360" cy="360" r="330" fill="none" stroke={C.dim} strokeWidth="6" />
          {new Array(60).fill(0).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r0 = i % 5 === 0 ? 290 : 308;
            return <line key={i} x1={360 + Math.cos(a) * r0} y1={360 + Math.sin(a) * r0} x2={360 + Math.cos(a) * 322} y2={360 + Math.sin(a) * 322} stroke={i % 5 === 0 ? C.ink : C.dim} strokeWidth={i % 5 === 0 ? 6 : 3} />;
          })}
          <g transform={`rotate(${spin} 360 360)`}>
            <line x1="360" y1="360" x2="360" y2="110" stroke={C.yellow} strokeWidth="10" strokeLinecap="round" />
          </g>
          <g transform={`rotate(${spin / 12} 360 360)`}>
            <line x1="360" y1="360" x2="360" y2="190" stroke={C.ink} strokeWidth="14" strokeLinecap="round" />
          </g>
          <circle cx="360" cy="360" r="18" fill={C.red} />
          <path d="M150 170 A300 300 0 0 0 110 300" stroke={C.yellow} strokeWidth="10" fill="none" strokeLinecap="round" opacity={0.8} />
          <path d="M98 270 L110 304 L140 284" stroke={C.yellow} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
        </svg>
      </Place>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 150, color: C.ink, textShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>{year}</div>
      <Caption at={Q.goback + 0.3} text="Let's go back." y={1020} size={44} />
    </>
  );
};

/** 1908, near Bologna. */
const Bologna: React.FC = () => {
  const fr = useCurrentFrame();
  const draw = prog(fr, Q.y1908 + 0.1, 1.4);
  const [bx, by] = CITIES.Bologna;
  const s = 0.82;
  return (
    <>
      <Place x={1250} y={560} w={800} h={920} s={1}>
        <div style={{position: 'relative', width: 940 * s, height: 1080 * s}}>
          <ItalyMap size={940 * s} draw={draw} fill="#2E3150" stroke="#8C7A5A" />
          <div style={{position: 'absolute', left: bx * s - 40, top: by * s - 92, transform: `scale(${pop(fr, Q.bologna, 10)})`, transformOrigin: '50% 100%'}}>
            <Pin size={80} color={C.red} />
          </div>
          <div style={{position: 'absolute', left: bx * s + 50, top: by * s - 60, opacity: prog(fr, Q.bologna + 0.2, 0.4)}}>
            <Label text="Bologna" size={34} color={C.ink} />
          </div>
        </div>
      </Place>
      <div style={{position: 'absolute', left: 150, top: 330, fontFamily: serif, fontWeight: 900, fontSize: 230, color: C.yellow, opacity: prog(fr, Q.y1908, 0.5), transform: `translateY(${(1 - prog(fr, Q.y1908, 0.6)) * 30}px)`, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>1908</div>
      <Words text="Near Bologna, Italy." at={Q.bologna} x={160} y={730} align="left" size={60} width={800} color={C.ink} />
    </>
  );
};

/** A ten-year-old in the crowd, with his father and brother. */
const CrowdScene: React.FC = () => {
  const fr = useCurrentFrame();
  const nm = prog(fr, Q.name, 0.6);
  return (
    <>
      <Ground y={760} color="#2A2A3A" />
      <Place x={960} y={600} w={2100} h={220} o={0.9}>
        <Crowd n={22} width={2100} color="#2A3158" seed={2} />
      </Place>
      <Place x={960} y={660} w={2100} h={220}>
        <Crowd n={18} width={2100} color="#38427A" seed={5} />
      </Place>
      {/* father & brother */}
      <Pop at={Q.father} x={640} y={700}>
        <Char size={330} outfit="suit" shirt="#4A3B32" tie="#8E1B2A" hat="fedora" mustache hair="#3A2A1E" mood="happy" seed={1} look={0.6} />
      </Pop>
      <Pop at={Q.brother} x={1290} y={735}>
        <Char size={265} outfit="shirt" shirt="#6B7F5A" hair="#3A2A1E" hairStyle="short" hat="flatcap" mood="happy" seed={3} look={-0.5} />
      </Pop>
      <Pop at={Q.boy} x={960} y={770}>
        <Char size={220} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood="happy" seed={2} />
      </Pop>
      <Pop at={Q.boy + 0.6} x={960} y={540}>
        <div style={{background: C.yellow, color: C.bg0, fontFamily: head, fontWeight: 700, fontSize: 40, padding: '6px 22px', borderRadius: 30}}>AGE 10</div>
      </Pop>
      <Pop at={Q.father + 0.2} x={640} y={420}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>FATHER</div>
      </Pop>
      <Pop at={Q.brother + 0.2} x={1290} y={490}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>BROTHER</div>
      </Pop>
      <Glow x={960} y={720} r={360} color={C.yellow} o={0.25 * nm} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.ink, opacity: nm, transform: `translateY(${(1 - nm) * 30}px)`, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
        Enzo <span style={{color: C.red}}>Ferrari</span>
      </div>
    </>
  );
};

/** His first race: cars roaring past. */
const FirstRace: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const cars = [Q.roaring - 0.2, Q.roaring + 1.0, Q.roaring + 1.9, Q.faster + 0.4];
  const awe = fr > f(Q.roaring) ? 'shock' : 'happy';
  return (
    <>
      <Words text="His first race." at={Q.firstrace} y={190} size={80} font="head" upper />
      <Ground y={880} color="#252536" />
      <Place x={960} y={700} w={2100} h={220} o={0.85}>
        <Crowd n={20} width={2100} color="#2A3158" seed={7} cheer={prog(fr, Q.roaring, 0.5)} />
      </Place>
      <Pop at={Q.firstrace + 0.1} x={360} y={640}>
        <Char size={240} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood={awe} seed={2} look={1} />
      </Pop>
      <Road y={800} speed={0} />
      <SpeedLines o={prog(fr, Q.roaring - 0.2, 0.3)} y0={760} y1={900} n={20} />
      {cars.map((c, i) => {
        const x = interpolate(t, [c, c + 1.25], [-500, 2500]);
        if (t < c || t > c + 1.3) return null;
        return (
          <Place key={i} x={x} y={820 - (i % 2) * 14} w={600} h={260}>
            <VintageCar size={520} color={[C.rosso, '#2A5BB8', '#E8E2D2', '#1F7A3A'][i]} num={String([4, 12, 7, 21][i])} spin={x * 1.6} />
          </Place>
        );
      })}
      <Caption at={Q.faster} text="Faster than anything he's known." y={300} size={50} color={C.ink} />
    </>
  );
};

/** "And it gets into his head." — inside a thought bubble, a car laps forever. */
const InHead: React.FC = () => {
  const fr = useCurrentFrame();
  const z = prog(fr, Q.head - 0.1, 0.9);
  const a = (fr / 30) * 3.2;
  return (
    <>
      <Place x={760} y={780 + (1 - z) * 100} w={900} h={900} s={0.8 + z * 0.4}>
        <Char size={560} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood="happy" seed={2} look={0.8} />
      </Place>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 1020 + i * 60, top: 470 - i * 70, width: 30 + i * 16, height: 30 + i * 16, borderRadius: 50, background: '#F6F1E4', transform: `scale(${pop(fr, Q.head + 0.2 + i * 0.12)})`}} />
      ))}
      <Place x={1400} y={300} w={640} h={420} s={pop(fr, Q.head + 0.55, 12)}>
        <div style={{width: 620, height: 400, borderRadius: 200, background: '#F6F1E4', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}>
          <svg width="620" height="400" style={{position: 'absolute'}}>
            <ellipse cx="310" cy="200" rx="220" ry="120" fill="none" stroke="#CFC5AE" strokeWidth="40" />
            <ellipse cx="310" cy="200" rx="220" ry="120" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="14 14" />
          </svg>
          <div style={{position: 'absolute', left: 310 + Math.cos(a) * 220 - 70, top: 200 + Math.sin(a) * 120 - 30, transform: `scaleX(${Math.sin(a) > 0 ? -1 : 1})`}}>
            <VintageCar size={140} color={C.rosso} driver />
          </div>
        </div>
      </Place>
    </>
  );
};

/** Reading motoring newspapers: photos, drivers, cars. */
const Papers: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={Q.papers + i * 0.2} x={470 + i * 30} y={560 - i * 20} rot={-8 + i * 7}>
          <MotorPaper size={380} title={['LA STAMPA SPORTIVA', 'MOTORI', 'CORRIERE AUTO'][i]} />
        </Pop>
      ))}
      <Pop at={Q.later + 0.2} x={470} y={880}>
        <Label text="Motoring newspapers" size={34} color={C.ink} />
      </Pop>
      <Pop at={Q.photos} x={1060} y={430} rot={-5} float={5}>
        <Polaroid caption="the photos" w={240} h={170}>
          <VintageCar size={220} color="#5A4E40" />
        </Polaroid>
      </Pop>
      <Pop at={Q.drivers} x={1420} y={560} rot={4} float={5}>
        <Polaroid caption="the drivers" w={220} h={200}>
          <div style={{marginTop: 40}}>
            <Char size={150} outfit="racer" hat="helmet" mustache mood="smirk" skin="#D8C3A6" hair="#4A4036" />
          </div>
        </Polaroid>
      </Pop>
      <Pop at={Q.cars} x={1210} y={820} rot={-3} float={5}>
        <Polaroid caption="the cars" w={280} h={150}>
          <VintageCar size={260} color="#6B5C4A" driver={false} />
        </Polaroid>
      </Pop>
    </>
  );
};

/** A summer night in Modena: mosquitoes, a swatting newspaper, a question. */
const Night: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const book = 1 - prog(fr, Q.summer - 0.2, 0.5);
  const night = prog(fr, Q.summer - 0.2, 0.8);
  const swing = t > Q.swat ? Math.sin((t - Q.swat) * 9) * 40 * Math.max(0, 1 - (t - Q.swat) / 3) : 0;
  return (
    <>
      {/* memoir */}
      <Place x={960} y={520} w={600} h={600} s={pop(fr, Q.memoir, 12) * (0.8 + 0.2 * book)} o={book}>
        <div style={{position: 'relative'}}>
          <Book size={300} color="#7A1E22" />
          <div style={{position: 'absolute', left: 100, top: 110, fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 30, color: '#F4E3B5', transform: 'rotate(-0deg)'}}>memoir</div>
        </div>
      </Place>
      <Caption at={Q.memoir + 0.1} out={Q.summer - 0.3} text="In his memoir…" y={880} size={46} color={C.ink} />
      {/* night */}
      <div style={{position: 'absolute', inset: 0, opacity: night}}>
        <Place x={1620} y={200} w={300} h={300} s={1}>
          <Moon size={240} />
        </Place>
        <Ground y={820} color="#1E2440" />
        <svg width="1920" height="300" style={{position: 'absolute', left: 0, top: 560}}>
          <path d="M0 260 L0 160 L120 160 L120 110 L170 60 L220 110 L220 160 L340 160 L340 90 L420 90 L420 160 L560 160 L560 30 L600 0 L640 30 L640 160 L800 160 L800 120 L960 120 L960 160 L1100 160 L1100 70 L1240 70 L1240 160 L1400 160 L1400 100 L1500 100 L1500 160 L1920 160 L1920 260 Z" fill="#141A33" />
          {[[150, 130], [380, 120], [1150, 100], [1190, 130], [1440, 130]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="16" height="20" fill="#FFD98A" opacity="0.5" />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 150, top: 120, opacity: prog(fr, Q.modena, 0.5)}}>
          <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 70, color: C.ink}}>Summer night</div>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.yellow, letterSpacing: 8, marginTop: 6}}>MODENA</div>
        </div>
      </div>
      {/* mosquitoes */}
      {new Array(9).fill(0).map((_, i) => {
        const a = t * (1.6 + (i % 3) * 0.5) + i * 2.1;
        const x = 900 + Math.cos(a) * (180 + i * 22) + Math.sin(a * 1.7) * 40;
        const y = 520 + Math.sin(a * 1.3) * (90 + i * 10);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: prog(fr, Q.mosq + i * 0.08, 0.3), transform: `scale(${0.8 + (i % 3) * 0.25})`}}>
            <Mosquito size={46} seed={i} />
          </div>
        );
      })}
      <Pop at={Q.summer + 0.2} x={760} y={720}>
        <Char size={240} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood={t > Q.swat ? 'angry' : 'neutral'} seed={2} look={0.6} />
      </Pop>
      {t > Q.swat - 0.2 && (
        <div style={{position: 'absolute', left: 840, top: 520, transformOrigin: '0% 100%', transform: `rotate(${-30 + swing}deg)`, opacity: prog(fr, Q.swat - 0.2, 0.2)}}>
          <div style={{width: 60, height: 200, background: '#EFE7D2', borderRadius: 14, boxShadow: '0 6px 18px rgba(0,0,0,0.35)', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 16px, #BDB3A0 16px 20px)'}} />
        </div>
      )}
      <Pop at={Q.friend} x={1260} y={720}>
        <Char size={240} kid outfit="shirt" shirt="#8A5A34" hair="#7A4B2E" hairStyle="short" mood="happy" seed={6} look={-0.8} talk={t > Q.grow && t < Q.think} />
      </Pop>
      <Pop at={Q.friend + 0.3} x={1260} y={900}>
        <Label text="best friend" size={28} />
      </Pop>
      <Bubble at={Q.grow} x={1360} y={520} width={620} size={42} flip text="What will you be when you grow up?" />
    </>
  );
};

/** He points at a photo on the front page. */
const Points: React.FC = () => {
  const fr = useCurrentFrame();
  const hl = prog(fr, Q.points + 0.5, 0.4);
  const hp = prog(fr, Q.points, 0.6);
  return (
    <>
      <Pop at={Q.think} x={480} y={640}>
        <Char size={330} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood="smirk" seed={2} look={1} />
      </Pop>
      <Caption at={Q.think} text="No hesitation." x={480} y={330} size={46} color={C.ink} />
      <Pop at={Q.points - 0.4} x={1250} y={540} rot={3}>
        <MotorPaper size={470} highlight={hl} />
      </Pop>
      <div style={{position: 'absolute', left: interpolate(hp, [0, 1], [500, 830]), top: 440, opacity: hp}}>
        <Hand size={220} />
      </div>
    </>
  );
};

/** "I'll be a racer." Not a builder. Not a businessman. */
const Racer: React.FC = () => {
  const fr = useCurrentFrame();
  const q = prog(fr, Q.racer, 0.5);
  const up = range(fr, Q.notbuild - 0.3, Q.notbuild + 0.3, 0, 1);
  const end = prog(fr, Q.aracer - 0.1, 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: interpolate(up, [0, 1], [380, 120]), textAlign: 'center', fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: interpolate(up, [0, 1], [150, 90]), color: C.ink, opacity: q, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
        “I'll be a <span style={{color: C.red}}>racer</span>.”
      </div>
      <Pop at={Q.notbuild} x={560} y={560} s={1.35}>
        <div style={{opacity: 1 - end * 0.75}}>
          <Polaroid caption="build cars" w={300} h={200}>
            <div style={{position: 'relative'}}>
              <VintageCar size={250} color="#7A6A58" driver={false} />
              <div style={{position: 'absolute', left: 150, top: -60}}>
                <Wrench size={110} color="#4A4036" />
              </div>
            </div>
          </Polaroid>
        </div>
      </Pop>
      <Cross at={Q.notbuild + 0.5} x={560} y={560} size={380} />
      <Pop at={Q.notstart} x={1360} y={560} s={1.35}>
        <div style={{opacity: 1 - end * 0.6}}>
          <Polaroid caption="start a company" w={300} h={200}>
            <Factory size={260} color="#E8E0CC" roof="#7A6A58" smoke={false} />
          </Polaroid>
        </div>
      </Pop>
      <Cross at={Q.notstart + 0.5} x={1360} y={560} size={380} />
      <Pop at={Q.aracer} x={960} y={600} s={1.1}>
        <Char size={300} outfit="racer" hat="helmet" hair={KID.hair} mood="happy" seed={4} />
      </Pop>
      <Glow x={960} y={600} r={330} color={C.red} o={0.4 * end} />
      <Caption at={Q.aracer + 0.1} text={<span style={{fontFamily: head, fontSize: 70, letterSpacing: 8, color: C.yellow}}>A RACER.</span>} y={960} />
    </>
  );
};

export const BOY: SceneDef[] = [
  {from: Q.goback, C: GoBack, tint: '#1B1F3A', glow: '#2D3460', sfx: [sx(Q.goback, 'tape', 0.24), sx(Q.goback + 0.9, 'tape', 0.16), sx(Q.goback + 1.6, 'clock', 0.12)]},
  {from: Q.y1908, C: Bologna, tint: '#2A2238', glow: '#4A3A4A', sfx: [sx(Q.y1908, 'boom', 0.14), sx(Q.y1908 + 0.1, 'paper', 0.1), sx(Q.bologna, 'pop', 0.12)]},
  {from: Q.boy, C: CrowdScene, tint: '#2A2238', glow: '#4A3A4A', sfx: [sx(Q.boy, 'crowd', 0.12), sx(Q.boy, 'pop', 0.1), sx(Q.boy + 0.6, 'pop_high', 0.08), sx(Q.father, 'pop', 0.1), sx(Q.brother, 'pop', 0.1), sx(Q.name, 'shimmer', 0.12)]},
  {from: Q.firstrace, C: FirstRace, tint: '#2E2436', glow: '#54404A', sfx: [sx(Q.firstrace, 'crowd', 0.1), sx(Q.roaring - 0.25, 'vintage_by', 0.3), sx(Q.roaring + 0.95, 'vintage_by', 0.26), sx(Q.roaring + 1.85, 'vintage_by', 0.24), sx(Q.faster + 0.35, 'vintage_by', 0.28), sx(Q.roaring, 'cheer', 0.12)]},
  {from: Q.head, C: InHead, tint: '#2A2238', glow: '#4A3A4A', sfx: [sx(Q.head, 'whoosh', 0.1), sx(Q.head + 0.2, 'pop_high', 0.07), sx(Q.head + 0.55, 'pop', 0.1)]},
  {from: Q.later, C: Papers, tint: '#2E2632', glow: '#4E4040', sfx: [sx(Q.papers, 'paper', 0.16), sx(Q.papers + 0.4, 'paper', 0.12), sx(Q.photos, 'shutter', 0.14), sx(Q.drivers, 'shutter', 0.14), sx(Q.cars, 'shutter', 0.14)]},
  {from: Q.memoir, C: Night, tint: '#121733', glow: '#1F2A55', sfx: [sx(Q.memoir, 'paper', 0.14), sx(Q.summer, 'crickets', 0.14), sx(Q.mosq, 'buzz', 0.1), sx(Q.swat + 0.1, 'slap', 0.18), sx(Q.swat + 0.45, 'slap', 0.14), sx(Q.swat + 0.8, 'slap', 0.12), sx(Q.friend, 'pop', 0.1), sx(Q.grow, 'pop_high', 0.1)]},
  {from: Q.think, C: Points, tint: '#1D1E3A', glow: '#33335E', sfx: [sx(Q.points - 0.4, 'paper', 0.14), sx(Q.points + 0.4, 'swish', 0.1), sx(Q.points + 0.5, 'ding', 0.1)]},
  {from: Q.racer, C: Racer, tint: '#2A1426', glow: '#55203A', sfx: [sx(Q.racer, 'boom', 0.16), sx(Q.notbuild, 'pop', 0.1), sx(Q.notbuild + 0.5, 'negative', 0.1), sx(Q.notstart, 'pop', 0.1), sx(Q.notstart + 0.5, 'negative', 0.1), sx(Q.aracer, 'engine_rev', 0.18), sx(Q.aracer, 'success', 0.1)]},
];
