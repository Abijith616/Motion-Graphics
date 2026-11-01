import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop} from '../components/Base';
import {Pin} from '../components/Art';
import {Car125, Char, CheckFlag, FamilyCar, FerrariWord, Gate, Horse, Plate, RoadCar, Shield, Stable, Trophy, VintageCar, Workshop} from '../components/Ferrari';
import {Badge, Caption, Cross, Ground, Road, Sparkles, Stamp, Title} from '../components/Kit';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';

/** 12 March 1947, Maranello: a bare car rolls out of the gate. */
const GateScene: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const open = prog(fr, Q.drives - 0.6, 0.8);
  const roll = interpolate(t, [Q.drives, Q.drives + 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (n) => 1 - Math.pow(1 - n, 2.2)});
  const cx = interpolate(roll, [0, 1], [700, 960]);
  const cs = interpolate(roll, [0, 1], [0.45, 1]);
  const call = prog(fr, Q.nobody, 0.4);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: prog(fr, Q.mar12, 0.5)}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 56, color: C.ink}}>12 March</div>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.yellow, lineHeight: 1}}>1947</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted, letterSpacing: 10, opacity: prog(fr, Q.maranello47, 0.4)}}>MARANELLO</div>
      </div>
      <Place x={700} y={620} w={560} h={360} s={0.9} o={1 - roll * 0.7}>
        <Gate size={520} label="MARANELLO" open={open} />
      </Place>
      <Ground y={790} color="#262A3A" />
      <Place x={cx} y={760} w={760} h={320} s={cs} o={prog(fr, Q.drives, 0.3)}>
        <Car125 size={720} spin={roll * 600} blur={0.35 * (1 - roll)} dust={0.5 * (1 - roll)} />
      </Place>
      {/* callouts */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, opacity: call}}>
        <line x1="1180" y1="660" x2="1340" y2="500" stroke={C.yellow} strokeWidth="4" />
        <circle cx="1180" cy="660" r="10" fill={C.yellow} />
        <line x1="900" y1="780" x2="700" y2="940" stroke={C.yellow} strokeWidth="4" opacity={prog(fr, Q.engine + 0.6, 0.3)} />
        <circle cx="900" cy="780" r="10" fill={C.yellow} opacity={prog(fr, Q.engine + 0.6, 0.3)} />
      </svg>
      <div style={{position: 'absolute', left: 1350, top: 450, opacity: prog(fr, Q.engine, 0.3)}}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 52, color: C.yellow, letterSpacing: 3}}>ENGINE</div>
      </div>
      <div style={{position: 'absolute', left: 520, top: 940, opacity: prog(fr, Q.engine + 0.6, 0.3)}}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 52, color: C.yellow, letterSpacing: 3}}>FRAME</div>
      </div>
      <div style={{position: 'absolute', left: 1350, top: 370, opacity: call * (1 - prog(fr, Q.engine, 0.3))}}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.ink}}>No bodywork yet.</div>
      </div>
    </>
  );
};

/** The 125 S — and for the first time, a car carries the name Ferrari, with the horse on yellow. */
const Name125: React.FC = () => {
  const fr = useCurrentFrame();
  const body_ = prog(fr, Q.carries, 1.0);
  const badge = prog(fr, Q.withhorse, 0.6);
  const word = prog(fr, Q.carries + 0.4, 0.6);
  return (
    <>
      <Pop at={Q.c125} x={960} y={190}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 120, color: C.ink, letterSpacing: 6}}>
          125 <span style={{color: C.red}}>S</span>
        </div>
      </Pop>
      <Glow x={960} y={620} r={520} color={C.red} o={0.3 * body_} />
      <Place x={960} y={640} w={1200} h={480}>
        <Car125 size={1100} bodywork={body_} badge={badge > 0.5} driver />
      </Place>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: word, transform: `scale(${0.9 + 0.1 * word})`}}>
        <FerrariWord width={460} white />
      </div>
      <Place x={1320} y={380} w={300} h={360} s={pop(fr, Q.withhorse, 10)}>
        <Shield size={190} glow={20} />
      </Place>
      <Sparkles x={960} y={600} at={Q.carries + 0.6} r={480} />
    </>
  );
};

/** 18 years after the dinner. Team. Horse. Car. All three, together. */
const Together: React.FC = () => {
  const fr = useCurrentFrame();
  const merge = prog(fr, Q.allthree, 1.0);
  const bar = prog(fr, Q.after18, 1.4);
  const items: [number, React.ReactNode, string][] = [
    [Q.team, <Workshop size={240} label="SCUDERIA" />, 'Team'],
    [Q.horse, <Horse size={130} color="#111" stroke={C.yellow} sw={3} />, 'Horse'],
    [Q.car, <Car125 size={280} bodywork={1} badge />, 'Car'],
  ];
  return (
    <>
      <div style={{position: 'absolute', left: 260, top: 130, width: 1400, opacity: prog(fr, Q.after18, 0.4) * (1 - merge)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: serif, fontWeight: 900, fontSize: 64}}>
          <span style={{color: C.yellow}}>1929</span>
          <span style={{color: C.ink}}>1947</span>
        </div>
        <div style={{height: 20, background: C.bg3, borderRadius: 10, marginTop: 10, overflow: 'hidden'}}>
          <div style={{width: `${bar * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.yellow}, ${C.red})`}} />
        </div>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 48, color: C.ink, marginTop: 12, letterSpacing: 3, textAlign: 'center'}}>18 YEARS AFTER THAT DINNER</div>
      </div>
      {items.map(([at, node, label], i) => {
        const x = interpolate(merge, [0, 1], [460 + i * 500, 960]);
        const y = interpolate(merge, [0, 1], [620, 600]);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${pop(fr, at, 10) * (1 - merge * 0.6)})`, opacity: 1 - merge, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <div style={{height: 260, display: 'flex', alignItems: 'center'}}>{node}</div>
            <div style={{fontFamily: head, fontWeight: 700, fontSize: 64, color: C.ink, letterSpacing: 4}}>{label.toUpperCase()}.</div>
          </div>
        );
      })}
      <Place x={960} y={560} w={900} h={700} s={0.6 + merge * 0.4} o={merge}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <Shield size={260} glow={30} />
          <Car125 size={520} bodywork={1} badge />
        </div>
      </Place>
      <Sparkles x={960} y={560} at={Q.allthree + 0.4} r={500} />
      <Caption at={Q.allthree + 0.2} text={<span style={{fontFamily: serif, fontSize: 64}}>All three, <span style={{color: C.yellow}}>finally together.</span></span>} y={960} />
    </>
  );
};

/** Same Scuderia? Not exactly — but the idea never changed: race first. */
const SameScuderia: React.FC = () => {
  const fr = useCurrentFrame();
  const idea = prog(fr, Q.idea2, 0.5);
  return (
    <>
      <Title at={Q.mayask} out={Q.idea2} text={<>Is it the <span style={{color: C.yellow}}>same</span> Scuderia?</>} y={160} size={84} />
      <Pop at={Q.same} x={520} y={560}>
        <div style={{textAlign: 'center', opacity: 1 - idea * 0.7}}>
          <Stable size={380} />
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 60, color: C.yellow}}>1929</div>
        </div>
      </Pop>
      <Stamp at={Q.shut37 + 0.3} text="CLOSED 1937" x={520} y={540} size={64} />
      <Pop at={Q.newcompany} x={1400} y={560}>
        <div style={{textAlign: 'center', opacity: 1 - idea * 0.7}}>
          <Workshop size={420} label="FERRARI" />
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 60, color: C.ink}}>1947</div>
        </div>
      </Pop>
      <Pop at={Q.newcompany + 0.5} x={960} y={500}>
        <div style={{opacity: 1 - idea, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: C.muted, letterSpacing: 3}}>THE OLD NAME</div>
          <svg width="260" height="40">
            <path d="M10 20 L240 20 M220 6 L244 20 L220 34" stroke={C.yellow} strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </Pop>
      <Caption at={Q.notexactly} out={Q.newcompany} text="Not exactly." y={980} size={56} color={C.ink} />
      <Caption at={Q.newcompany} out={Q.idea2} text={<>A <span style={{color: C.yellow}}>new company</span>, carrying the old name.</>} y={980} size={48} color={C.ink} />
      <div style={{position: 'absolute', inset: 0, background: `rgba(8,11,24,${0.6 * idea})`}} />
      <Caption at={Q.idea2} text="But the idea never changed:" y={380} size={50} color={C.muted} />
      <Pop at={Q.racefirst} x={960} y={560}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <CheckFlag size={180} wave={fr / 4} />
          <div style={{fontFamily: head, fontWeight: 700, fontSize: 170, color: C.ink, letterSpacing: 10, textShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>
            RACE <span style={{color: C.red}}>FIRST</span>
          </div>
        </div>
      </Pop>
    </>
  );
};

/** Not a family car, not a road car — a race car. Wins the Rome Grand Prix two months later. */
const RaceCarScene: React.FC = () => {
  const fr = useCurrentFrame();
  const win = prog(fr, Q.twomonths, 0.5);
  return (
    <>
      <Title at={Q.kind} out={Q.twomonths} text="What kind of car is the 125 S?" y={160} size={70} />
      <div style={{opacity: 1 - win}}>
        <Pop at={Q.family} x={420} y={560}>
          <FamilyCar size={360} />
        </Pop>
        <Cross at={Q.family + 0.4} x={420} y={560} size={260} />
        <Pop at={Q.family + 0.2} x={420} y={760}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted}}>family car</div>
        </Pop>
        <Pop at={Q.roadcar} x={960} y={560}>
          <RoadCar size={380} color="#5A6482" />
        </Pop>
        <Cross at={Q.roadcar + 0.4} x={960} y={560} size={260} />
        <Pop at={Q.roadcar + 0.2} x={960} y={760}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted}}>road car</div>
        </Pop>
        <Pop at={Q.racecar} x={1500} y={560} s={1.1}>
          <Car125 size={420} bodywork={1} badge />
        </Pop>
        <Pop at={Q.racecar + 0.3} x={1640} y={420}>
          <Badge ok size={80} />
        </Pop>
        <Pop at={Q.racecar + 0.2} x={1500} y={760}>
          <div style={{fontFamily: head, fontWeight: 700, fontSize: 54, color: C.yellow, letterSpacing: 4}}>RACE CAR</div>
        </Pop>
      </div>
      {/* Rome */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: win}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted, letterSpacing: 8}}>TWO MONTHS LATER</div>
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 100, color: C.ink, opacity: prog(fr, Q.rome, 0.4)}}>Rome Grand Prix</div>
        </div>
        <svg width="900" height="260" viewBox="0 0 900 260" style={{position: 'absolute', left: 510, top: 560, opacity: 0.35}}>
          <path d="M0 260 L0 60 Q450 -20 900 60 L900 260 Z" fill="#8C7A5A" />
          {new Array(8).fill(0).map((_, i) => (
            <path key={i} d={`M${40 + i * 110} 260 L${40 + i * 110} 150 Q${85 + i * 110} 100 ${130 + i * 110} 150 L${130 + i * 110} 260 Z`} fill={C.bg1} />
          ))}
        </svg>
        <Place x={820} y={760} w={800} h={340} s={pop(fr, Q.twomonths + 0.2, 12)}>
          <Car125 size={680} bodywork={1} badge />
        </Place>
        <Place x={1450} y={560} w={300} h={360} s={pop(fr, Q.rome + 0.4, 10)}>
          <Trophy size={240} label="1st" />
        </Place>
        <Sparkles x={1450} y={560} at={Q.rome + 0.4} r={200} />
      </div>
    </>
  );
};

export const Y1947: SceneDef[] = [
  {from: Q.mar12, C: GateScene, tint: '#2A2018', glow: '#5A4426', sfx: [sx(Q.mar12, 'boom', 0.14), sx(Q.mar12 + 0.1, 'shimmer', 0.08), sx(Q.drives - 0.6, 'gate', 0.16), sx(Q.drives, 'engine_rev', 0.3), sx(Q.drives + 1.2, 'engine_idle', 0.18), sx(Q.nobody, 'pop', 0.08), sx(Q.engine, 'pop', 0.08), sx(Q.engine + 0.6, 'pop', 0.08)]},
  {from: Q.c125, C: Name125, tint: '#2E1416', glow: '#6A2026', sfx: [sx(Q.c125, 'stamp', 0.14), sx(Q.carries, 'riser_short', 0.12), sx(Q.carries + 0.6, 'boom', 0.18), sx(Q.carries + 0.6, 'shimmer', 0.16), sx(Q.withhorse, 'ding', 0.12)]},
  {from: Q.after18, C: Together, tint: '#2E1A14', glow: '#6A3A20', sfx: [sx(Q.after18, 'whoosh', 0.1), sx(Q.team, 'thud', 0.16), sx(Q.horse, 'thud', 0.16), sx(Q.car, 'thud', 0.16), sx(Q.allthree, 'riser_short', 0.1), sx(Q.allthree + 0.4, 'sting', 0.2)]},
  {from: Q.mayask, C: SameScuderia, tint: '#1E1E30', glow: '#34344E', sfx: [sx(Q.same, 'pop', 0.1), sx(Q.shut37 + 0.3, 'stamp', 0.16), sx(Q.newcompany, 'pop', 0.1), sx(Q.newcompany + 0.5, 'swish', 0.08), sx(Q.racefirst, 'boom', 0.18), sx(Q.racefirst, 'engine_rev', 0.2)]},
  {from: Q.kind, C: RaceCarScene, tint: '#2A1A1C', glow: '#4A2A2C', sfx: [sx(Q.family, 'pop', 0.1), sx(Q.family + 0.4, 'negative', 0.08), sx(Q.roadcar, 'pop', 0.1), sx(Q.roadcar + 0.4, 'negative', 0.08), sx(Q.racecar, 'engine_rev', 0.2), sx(Q.racecar + 0.3, 'success', 0.1), sx(Q.twomonths, 'whoosh', 0.1), sx(Q.rome + 0.4, 'cheer', 0.18), sx(Q.rome + 0.4, 'success', 0.12)]},
];
