import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop, Words} from '../components/Base';
import {Pin} from '../components/Art';
import {Biplane, Char, CheckFlag, CITIES, Horse, ItalyMap, Label, Plate, Trophy, VintageCar} from '../components/Ferrari';
import {Bubble, Caption, Ground, Road, SpeedLines, Sparkles, Title} from '../components/Kit';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';

export const ENZO = {hair: '#1E1612', skin: C.skin};

/** 1920: he joins Alfa Romeo as a driver. */
const Driver: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <Pop at={Q.becomes} x={600} y={600}>
        <Char size={330} outfit="racer" hat="helmet" hair={ENZO.hair} mood="happy" seed={3} look={0.6} />
      </Pop>
      <Pop at={Q.becomes + 0.4} x={1250} y={680}>
        <VintageCar size={700} color={C.rosso} num="1" driver={false} />
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 150, color: C.yellow, opacity: prog(fr, Q.y1920, 0.5), textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>1920</div>
      <Pop at={Q.alfa} x={1250} y={430}>
        <Plate text="ALFA ROMEO" size={58} color="#9E1B22" fg="#fff" />
      </Pop>
      <Pop at={Q.alfa + 0.5} x={600} y={900}>
        <div style={{background: C.bg3, color: C.ink, fontFamily: body, fontWeight: 900, fontSize: 34, padding: '10px 26px', borderRadius: 30, letterSpacing: 4}}>DRIVER</div>
      </Pop>
      <Ground y={880} color="#1E2440" />
    </>
  );
};

/** 1923: wins near Ravenna. */
const Ravenna: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const x = interpolate(t, [Q.y1923, Q.wins + 0.6], [-300, 1150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (n) => 1 - Math.pow(1 - n, 2.4)});
  const [rx, ry] = CITIES.Ravenna;
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 120, fontFamily: serif, fontWeight: 900, fontSize: 140, color: C.yellow, opacity: prog(fr, Q.y1923, 0.4)}}>1923</div>
      <Road y={760} speed={t < Q.wins + 0.6 ? 30 : 0} />
      <SpeedLines o={1 - prog(fr, Q.wins + 0.4, 0.4)} y0={680} y1={860} n={16} />
      <Place x={1460} y={640} w={240} h={260}>
        <CheckFlag size={220} wave={fr / 4} />
      </Place>
      <Place x={x} y={760} w={600} h={260}>
        <VintageCar size={520} color={C.rosso} num="1" spin={x * 1.4} />
      </Place>
      <Pop at={Q.wins + 0.5} x={1460} y={360} float={6}>
        <Trophy size={200} label="1st" />
      </Pop>
      <Sparkles x={1460} y={360} at={Q.wins + 0.5} r={160} />
      <Pop at={Q.ravenna} x={560} y={430}>
        <div style={{position: 'relative', width: 340, height: 300, overflow: 'hidden', borderRadius: 30, background: 'rgba(255,255,255,0.05)'}}>
          <div style={{position: 'absolute', left: -rx * 0.55 + 170, top: -ry * 0.55 + 150}}>
            <ItalyMap size={940 * 0.55} fill="#2E3150" stroke="#5C74B8" />
          </div>
          <div style={{position: 'absolute', left: 150, top: 92}}>
            <Pin size={44} color={C.red} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 160}}>
            <Label text="Ravenna" size={30} color={C.ink} />
          </div>
        </div>
      </Pop>
    </>
  );
};

/** He meets Count Enrico and Countess Paolina Baracca. */
const Couple: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <Ground y={860} color="#202848" />
      <Pop at={Q.after} x={420} y={640}>
        <Char size={320} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="happy" seed={3} look={1} />
      </Pop>
      <Pop at={Q.after + 0.2} x={420} y={900}>
        <Label text="Enzo" size={32} color={C.ink} />
      </Pop>
      <Pop at={Q.count} x={1180} y={630}>
        <Char size={330} outfit="suit" shirt="#1F2233" tie="#B8960C" hair="#BDBDBD" hairStyle="bald" mustache hat="tophat" mood="neutral" seed={5} look={-0.8} />
      </Pop>
      <Pop at={Q.countess} x={1520} y={655}>
        <Char size={310} outfit="dress" shirt="#5B2240" hair="#8C8C8C" hairStyle="bun" mood="happy" seed={8} look={-1} />
      </Pop>
      <Pop at={Q.count + 0.2} x={1180} y={905}>
        <Label text="Count Enrico" size={30} color={C.ink} />
      </Pop>
      <Pop at={Q.countess + 0.2} x={1520} y={905}>
        <Label text="Countess Paolina" size={30} color={C.ink} />
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: prog(fr, Q.couple + 0.4, 0.6)}}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: C.muted}}>THE</div>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.ink, lineHeight: 1}}>Baraccas</div>
      </div>
    </>
  );
};

/** Laurel wreath (memorial). `p` 0→1 draws the leaves in. */
const Laurel: React.FC<{size?: number; p?: number; color?: string}> = ({size = 260, p = 1, color = '#C9A24D'}) => {
  const leaves = 9;
  return (
    <svg viewBox="0 0 260 160" width={size} height={(size * 160) / 260} style={{overflow: 'visible'}}>
      {[-1, 1].map((side) => (
        <g key={side} transform={side < 0 ? 'translate(260 0) scale(-1 1)' : undefined}>
          <path d="M130 150 Q40 140 30 40" stroke={color} strokeWidth="4" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          {new Array(leaves).fill(0).map((_, i) => {
            const k = (i + 0.5) / leaves;
            const x = 130 - 100 * k + 10 * Math.sin(k * 3);
            const y = 150 - 110 * k * k - 6;
            const o = Math.max(0, Math.min(1, p * leaves - i));
            return <ellipse key={i} cx={x} cy={y} rx="13" ry="6" fill={color} opacity={o} transform={`rotate(${-30 - k * 70} ${x} ${y})`} />;
          })}
        </g>
      ))}
    </svg>
  );
};

/** Their son Francesco, Italy's top fighter pilot; killed in 1918; the horse on his plane. Kept quiet and respectful. */
const Pilot: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const enter = prog(fr, Q.son, 1.2);
  const mourn = prog(fr, Q.killed, 2.2); // slow, gentle fade to sepia
  const zoom = range(fr, Q.side - 0.2, Q.side + 1.6, 0, 1);
  const fly = interpolate(t, [Q.son, Q.side], [-260, 0], {extrapolateRight: 'clamp'});
  const hReveal = prog(fr, Q.painted + 0.3, 1.4);
  const big = prog(fr, Q.backlegs, 1.0);
  return (
    <>
      {/* soft dim while we remember him */}
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 22% 45%, rgba(255,226,170,${0.08 * mourn}) 0%, rgba(4,6,14,${0.45 * mourn}) 70%)`, opacity: 1 - zoom}} />
      {/* portrait */}
      <div style={{position: 'absolute', left: 140, top: 140, opacity: enter * (1 - zoom), transform: `translateY(${(1 - enter) * 24}px)`}}>
        <div style={{width: 360, height: 440, background: '#E9DFC6', borderRadius: 10, padding: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', filter: `grayscale(${mourn * 0.85}) sepia(${mourn * 0.45}) brightness(${1 - mourn * 0.08})`}}>
          <div style={{width: 320, height: 340, background: '#C9B48E', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
            <Char size={280} outfit="uniform" shirt="#5C5A3A" hat="pilot" hair="#2A1E18" mustache mood="neutral" seed={9} />
          </div>
          <div style={{textAlign: 'center', fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 34, color: '#3A2A1E', marginTop: 16}}>Francesco Baracca</div>
        </div>
        {/* mourning ribbon across the corner */}
        <div style={{position: 'absolute', right: -6, top: -6, width: 130, height: 130, overflow: 'hidden', opacity: mourn}}>
          <div style={{position: 'absolute', right: -42, top: 30, width: 200, height: 26, background: '#141418', transform: 'rotate(45deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 625, width: 400, textAlign: 'center', opacity: prog(fr, Q.pilot, 0.8) * (1 - zoom) * (1 - mourn * 0.35)}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 38, color: C.ink}}>Italy's top fighter pilot</div>
        <div style={{fontFamily: body, fontWeight: 800, fontSize: 24, color: C.muted, letterSpacing: 5, marginTop: 6}}>FIRST WORLD WAR</div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 720, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: prog(fr, Q.killed, 1.2) * (1 - zoom)}}>
        <div style={{fontFamily: serif, fontWeight: 700, fontSize: 46, color: '#E8DCC0', letterSpacing: 2}}>1888 – 1918</div>
        <div style={{marginTop: 4}}>
          <Laurel size={170} p={prog(fr, Q.killed + 0.2, 1.6)} />
        </div>
      </div>
      {/* his plane glides across, then the camera moves in close to the horse on its side */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `translate(${interpolate(zoom, [0, 1], [0, -1000])}px, ${interpolate(zoom, [0, 1], [0, -40])}px) scale(${interpolate(zoom, [0, 1], [1, 2.4])})`,
          transformOrigin: '1230px 520px',
          opacity: (1 - big) * Math.min(1, enter * 1.5),
        }}
      >
        <Place x={1230 + fly} y={480 + bob(fr, 6, 0.4)} w={900} h={460} r={bob(fr, 0.8, 0.35)}>
          <div style={{filter: `grayscale(${mourn * 0.7}) sepia(${mourn * 0.3})`}}>
            <Biplane size={860} horse={hReveal} prop={fr * 1.3} />
          </div>
        </Place>
      </div>
      {/* the horse, on its own */}
      <Place x={960} y={500} w={600} h={700} s={0.8 + big * 0.2} o={big}>
        <Horse size={360} color="#111" />
      </Place>
      <Glow x={960} y={520} r={400} color={C.yellow} o={0.22 * big} />
      <Caption at={Q.painted + 0.2} out={Q.backlegs} text="A black horse, painted on the side of his plane." y={960} color={C.ink} />
      <Caption at={Q.backlegs + 0.1} text="Standing on its back legs." y={960} color={C.ink} />
    </>
  );
};

/** His mother's gift: put the horse on your cars. Enzo says yes — but not yet. */
const Gift: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const fly = range(fr, Q.prancing + 0.3, Q.luck + 0.2, 0, 1);
  const stash = prog(fr, Q.doesnt + 0.2, 0.8);
  const hx = interpolate(fly, [0, 1], [1360, 620]) + interpolate(stash, [0, 1], [0, 340]);
  const hy = interpolate(fly, [0, 0.5, 1], [430, 300, 430]) + interpolate(stash, [0, 1], [0, 320]);
  const lid = prog(fr, Q.notyet - 0.1, 0.4);
  const glow = prog(fr, Q.hold, 0.5);
  return (
    <>
      <Ground y={860} color="#202848" />
      <Pop at={Q.mother} x={1480} y={640}>
        <Char size={310} outfit="dress" shirt="#5B2240" hair="#8C8C8C" hairStyle="bun" mood="neutral" seed={8} look={-1} talk={t > Q.mother && t < Q.luck + 1} />
      </Pop>
      <Pop at={Q.mother} x={480} y={640}>
        <Char size={320} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood={t > Q.yes ? 'happy' : 'neutral'} seed={3} look={1} />
      </Pop>
      <Bubble at={Q.mother + 0.3} out={Q.yes - 0.2} x={1220} y={300} width={720} size={40} flip italic text={<>“Put my son's prancing horse on your cars.{t > Q.luck - 0.1 ? <><br />It will bring you luck.”</> : ''}</>} />
      <Bubble at={Q.yes} out={Q.notyet + 0.5} x={640} y={360} width={240} size={50} text="Sì!" />
      {/* the box */}
      <Place x={960} y={790} w={360} h={220} o={prog(fr, Q.doesnt, 0.3)} s={pop(fr, Q.doesnt, 12)}>
        <svg width="320" height="200" viewBox="0 0 320 200" style={{overflow: 'visible'}}>
          <rect x="20" y="60" width="280" height="130" rx="10" fill="#8A5A34" />
          <rect x="20" y="60" width="280" height="20" fill="#000" opacity="0.15" />
          <g transform={`rotate(${-70 * (1 - lid)} 20 60)`}>
            <rect x="10" y="40" width="300" height="28" rx="8" fill="#A06A3C" />
          </g>
          <rect x="145" y="96" width="30" height="26" rx="4" fill={C.gold} opacity={lid} />
        </svg>
      </Place>
      {fr > f(Q.prancing) && (
        <div style={{position: 'absolute', left: hx - 90, top: hy - 125, transform: `scale(${pop(fr, Q.prancing, 12) * interpolate(stash, [0, 1], [1, 0.45])})`, opacity: 1 - prog(fr, Q.notyet, 0.2)}}>
          <Horse size={180} color="#111" stroke={C.yellow} sw={2} />
        </div>
      )}
      <Caption at={Q.notyet} out={Q.hold - 0.2} text={<span style={{fontFamily: head, letterSpacing: 6, fontSize: 64, color: C.yellow}}>NOT YET.</span>} y={300} />
      <Title at={Q.hold} text={<>Hold on to <span style={{color: C.yellow}}>that horse.</span></>} y={330} size={100} />
      <Glow x={960} y={790} r={260} color={C.yellow} o={0.4 * glow} />
    </>
  );
};

export const HORSE: SceneDef[] = [
  {from: Q.becomes, C: Driver, tint: '#2A1A2E', glow: '#4E2A3A', sfx: [sx(Q.becomes, 'pop', 0.1), sx(Q.becomes + 0.4, 'engine_rev', 0.2), sx(Q.y1920, 'boom', 0.12), sx(Q.alfa, 'stamp', 0.12)]},
  {from: Q.y1923, C: Ravenna, tint: '#2A1A2E', glow: '#4E2A3A', sfx: [sx(Q.y1923, 'vintage_by', 0.26), sx(Q.wins + 0.5, 'cheer', 0.14), sx(Q.wins + 0.5, 'success', 0.1), sx(Q.ravenna, 'pop', 0.1)]},
  {from: Q.after, C: Couple, tint: '#231C34', glow: '#3E3050', sfx: [sx(Q.after, 'pop', 0.1), sx(Q.count, 'pop', 0.1), sx(Q.countess, 'pop', 0.1), sx(Q.couple + 0.4, 'shimmer', 0.08)]},
  {from: Q.son, C: Pilot, tint: '#22262E', glow: '#3A4250', sfx: [sx(Q.son + 0.2, 'plane', 0.12), sx(Q.killed + 0.1, 'toll', 0.16), sx(Q.side - 0.2, 'swish', 0.06), sx(Q.painted + 0.3, 'brush', 0.1), sx(Q.backlegs, 'shimmer', 0.08)]},
  {from: Q.mother, C: Gift, tint: '#2A2238', glow: '#4A3A4A', sfx: [sx(Q.mother + 0.3, 'pop', 0.1), sx(Q.prancing, 'shimmer', 0.12), sx(Q.prancing + 0.3, 'swish', 0.1), sx(Q.yes, 'pop_high', 0.1), sx(Q.doesnt, 'pop', 0.08), sx(Q.doesnt + 0.3, 'swish', 0.08), sx(Q.notyet - 0.05, 'thud', 0.16), sx(Q.hold, 'ding', 0.1)]},
];
