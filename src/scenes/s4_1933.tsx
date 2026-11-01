import React from 'react';
import {interpolate, random} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop, Words} from '../components/Base';
import {Cloud, Doc} from '../components/Art';
import {Char, Factory, Lira, MoneyBag, PartyHQ, Plate, Shield, Stable, VintageCar, Workshop} from '../components/Ferrari';
import {Arrow, Badge, Bubble, Caption, Cross, Ground, Stamp, Title} from '../components/Kit';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';
import {ENZO} from './s2_horse';

const AlfaFactory: React.FC<{size?: number; lit?: number}> = ({size = 520, lit = 1}) => <Factory size={size} color="#E4DCCB" roof="#9E1B22" label="ALFA ROMEO" lit={lit} />;

export const Flame: React.FC<{size?: number; seed?: number}> = ({size = 80, seed = 0}) => {
  const fr = useCurrentFrame();
  const w = Math.sin(fr / 3 + seed) * 4;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 80" style={{overflow: 'visible'}}>
      <path d={`M30 ${4 + w} Q52 30 50 52 Q48 76 30 78 Q12 76 10 52 Q10 34 24 22 Q24 40 32 44 Q30 24 30 ${4 + w} Z`} fill="#FF7A1A" />
      <path d={`M30 ${34 - w} Q42 48 40 60 Q38 74 30 74 Q22 74 20 62 Q20 50 30 ${34 - w} Z`} fill={C.yellow} />
    </svg>
  );
};

/** Money runs out: the Depression hits Italy; Alfa Romeo in trouble. */
const Depression: React.FC = () => {
  const fr = useCurrentFrame();
  const draw = prog(fr, Q.depression, 1.6);
  const deflate = prog(fr, Q.runsout + 0.3, 1.2);
  const pts = [[0, 60], [90, 40], [160, 70], [240, 50], [300, 180], [380, 260], [460, 330], [560, 370]];
  const d = 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L');
  return (
    <>
      <Pop at={Q.runsout} x={420} y={520}>
        <div style={{transform: `scale(${1 - deflate * 0.35}, ${1 - deflate * 0.5})`, transformOrigin: '50% 100%'}}>
          <MoneyBag size={260} />
        </div>
      </Pop>
      {new Array(6).fill(0).map((_, i) => {
        const p = prog(fr, Q.runsout + 0.2 + i * 0.15, 0.9);
        return (
          <div key={i} style={{position: 'absolute', left: 420 + (i - 2.5) * 50, top: 560 + p * 400, opacity: (1 - p) * (fr > f(Q.runsout + 0.2) ? 1 : 0)}}>
            <Lira size={50} />
          </div>
        );
      })}
      <Caption at={Q.runsout} text="Money runs out." x={420} y={830} size={50} color={C.ink} />
      {/* crashing chart */}
      <div style={{position: 'absolute', left: 860, top: 190, opacity: prog(fr, Q.depression, 0.4)}}>
        <svg width="620" height="420" viewBox="-20 -20 620 440" style={{overflow: 'visible'}}>
          <line x1="0" y1="400" x2="580" y2="400" stroke={C.dim} strokeWidth="4" />
          <line x1="0" y1="0" x2="0" y2="400" stroke={C.dim} strokeWidth="4" />
          <path d={d} stroke={C.red} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 52, color: C.ink, letterSpacing: 3, marginTop: 10}}>THE DEPRESSION</div>
      </div>
      <Pop at={Q.trouble} x={1600} y={720}>
        <div style={{position: 'relative'}}>
          <AlfaFactory size={420} lit={0.3} />
          <div style={{position: 'absolute', left: 60, top: -150}}>
            <Cloud size={300} rain />
          </div>
        </div>
      </Pop>
    </>
  );
};

/** 1933: on Mussolini's orders the state takes Alfa over. Remember the dinner? */
const Takeover: React.FC = () => {
  const fr = useCurrentFrame();
  const link = prog(fr, Q.samegov, 0.8);
  const lens = range(fr, Q.lira, Q.lira + 2.5, 0, 1);
  const hl = prog(fr, Q.remember, 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow, opacity: prog(fr, Q.y1933, 0.4) * (1 - prog(fr, Q.remember, 0.4))}}>1933</div>
      <Pop at={Q.orders} x={460} y={560}>
        <div style={{filter: hl ? `drop-shadow(0 0 ${30 * hl}px rgba(255,216,10,0.7))` : undefined}}>
          <PartyHQ size={480} />
        </div>
      </Pop>
      <Pop at={Q.orders + 0.3} x={460} y={870}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: C.ink, letterSpacing: 4}}>THE STATE</div>
          <div style={{fontFamily: body, fontWeight: 800, fontSize: 24, color: C.muted, marginTop: 4}}>on Mussolini's orders</div>
        </div>
      </Pop>
      <Pop at={Q.y1933 + 0.2} x={1440} y={560}>
        <AlfaFactory size={480} />
      </Pop>
      <Stamp at={Q.takeover + 0.3} text="STATE-OWNED" x={1440} y={560} size={70} />
      <Arrow at={Q.takeover} d="M 720 520 Q 960 400 1180 520" color={C.yellow} width={10} dur={0.6} />
      {/* callback to the dinner */}
      <Pop at={Q.remember} x={460} y={250} rot={-5}>
        <div style={{background: '#F6F1E4', padding: '10px 10px 34px', borderRadius: 6, boxShadow: '0 12px 30px rgba(0,0,0,0.45)', position: 'relative'}}>
          <div style={{width: 200, height: 120, background: '#E3D9C1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 30, color: '#3A2A1E'}}>the dinner, 1929</div>
          </div>
          <div style={{position: 'absolute', left: 98, top: -10, width: 22, height: 22, borderRadius: 11, background: C.red}} />
        </div>
      </Pop>
      <Caption at={Q.remember} out={Q.samegov} text="Remember where that dinner was held?" y={1000} size={46} color={C.ink} />
      <Caption at={Q.samegov} out={Q.lira} text={<>That same government <span style={{color: C.yellow}}>now owns Alfa Romeo.</span></>} y={1000} size={46} color={C.ink} />
      <div style={{position: 'absolute', left: 0, top: 0, opacity: link * (1 - prog(fr, Q.lira, 0.4))}} />
      {/* watching every lira */}
      <div style={{position: 'absolute', left: 820, top: 740, display: 'flex', gap: 14, opacity: prog(fr, Q.lira, 0.3)}}>
        {new Array(6).fill(0).map((_, i) => (
          <div key={i} style={{transform: `scale(${pop(fr, Q.lira + i * 0.1)})`}}>
            <Lira size={70} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: interpolate(lens, [0, 1], [800, 1220]), top: 690 + Math.sin(lens * 12) * 10, opacity: prog(fr, Q.lira + 0.2, 0.3)}}>
        <svg width="170" height="170" viewBox="0 0 170 170">
          <circle cx="70" cy="70" r="54" fill="rgba(191,228,255,0.25)" stroke="#C9CED8" strokeWidth="12" />
          <line x1="110" y1="110" x2="160" y2="160" stroke="#8A6430" strokeWidth="18" strokeLinecap="round" />
        </svg>
      </div>
      <Caption at={Q.lira + 0.2} text={<>Every Italian <span style={{color: C.gold}}>lira</span> counts.</>} y={1000} size={46} color={C.ink} />
    </>
  );
};

/** Racing burns money. Alfa pulls its own team out. */
const Burns: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const exit = range(fr, Q.pulls + 0.4, Q.pulls + 1.6, 0, 1, (n) => n * n);
  return (
    <>
      <Title at={Q.burns} text={<>Racing <span style={{color: '#FF7A1A'}}>burns</span> money.</>} y={180} size={96} />
      <Place x={520} y={600} w={400} h={400} s={pop(fr, Q.burns, 12)}>
        <div style={{position: 'relative'}}>
          <div style={{display: 'flex', gap: 10}}>
            {[0, 1, 2].map((i) => (
              <Lira key={i} size={90} />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: 10 + i * 100, top: -90}}>
              <Flame size={80} seed={i} />
            </div>
          ))}
        </div>
      </Place>
      <Place x={1300 + exit * 1000} y={640} w={700} h={300} s={pop(fr, Q.pulls - 0.2, 12)}>
        <VintageCar size={620} color="#B8141E" num="1" spin={exit * 900} />
      </Place>
      <Pop at={Q.pulls} x={1300} y={420}>
        <div style={{opacity: 1 - exit}}>
          <Plate text="ALFA ROMEO WORKS TEAM" size={40} color="#9E1B22" fg="#fff" />
        </div>
      </Pop>
      <Stamp at={Q.pulls + 0.5} text="WITHDRAWN" x={1300} y={640} size={86} />
      <Ground y={790} color="#1C2038" />
    </>
  );
};

/** But someone still has to race the Alfas. Who? — The stable in Modena. */
const Who: React.FC = () => {
  const fr = useCurrentFrame();
  const spot = prog(fr, Q.stablem, 0.5);
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={Q.someone + i * 0.15} x={420 + i * 540} y={360}>
          <div style={{opacity: 1 - spot * 0.5}}>
            <VintageCar size={420} color="#B8141E" driver={false} />
          </div>
        </Pop>
      ))}
      <Pop at={Q.who} x={960} y={600}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 180, color: C.yellow, opacity: 1 - spot}}>WHO?</div>
      </Pop>
      <div style={{position: 'absolute', left: 960 - 500, top: 300, width: 1000, height: 800, background: `radial-gradient(ellipse at 50% 70%, rgba(255,232,160,${0.3 * spot}) 0%, transparent 60%)`}} />
      <Place x={960} y={760} w={500} h={420} s={pop(fr, Q.stablem, 12)}>
        <div style={{position: 'relative'}}>
          <Stable size={440} />
          <div style={{position: 'absolute', left: 190, top: 64}}>
            <Shield size={60} plain />
          </div>
        </div>
      </Place>
      <Caption at={Q.stablem + 0.2} text={<>The stable in <span style={{color: C.yellow}}>Modena.</span></>} y={1020} size={50} color={C.ink} />
    </>
  );
};

/** From 1933 the Scuderia is basically Alfa's racing team. */
const AlfaTeam: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const carX = interpolate(t, [Q.races, Q.races + 1.4], [780, 1180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const banner = prog(fr, Q.nameon, 0.6);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: prog(fr, Q.from33, 0.4)}}>
        <span style={{fontFamily: serif, fontWeight: 900, fontSize: 80, color: C.yellow}}>From 1933</span>
      </div>
      <Pop at={Q.alfateam - 0.4} x={420} y={560}>
        <AlfaFactory size={460} />
      </Pop>
      <Pop at={Q.alfateam} x={1500} y={560}>
        <div style={{position: 'relative'}}>
          <Workshop size={460} label="SCUDERIA FERRARI" />
          <div style={{position: 'absolute', left: 205, top: -70}}>
            <Shield size={50} plain />
          </div>
        </div>
      </Pop>
      <Arrow at={Q.builds} d="M 680 560 L 860 560" color={C.ink} width={10} />
      <Pop at={Q.builds + 0.2} x={960} y={560}>
        <VintageCar size={200} color="#B8141E" driver={false} />
      </Pop>
      <Arrow at={Q.races} d="M 1080 560 L 1250 560" color={C.ink} width={10} />
      <Pop at={Q.builds} x={420} y={850}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.ink}}>
          Alfa <span style={{color: C.red}}>builds</span> the cars.
        </div>
      </Pop>
      <Pop at={Q.races} x={1500} y={850}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.ink}}>
          Ferrari <span style={{color: C.yellow}}>races</span> them.
        </div>
      </Pop>
      <Pop at={Q.nofactory} x={960} y={300}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20}}>
          <Char size={170} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="neutral" seed={3} />
          <div style={{position: 'relative'}}>
            <Factory size={160} smoke={false} />
          </div>
        </div>
      </Pop>
      <Cross at={Q.nofactory + 0.5} x={1050} y={300} size={140} out={Q.nameon} />
      <Caption at={Q.nofactory} out={Q.nameon} text="Enzo doesn't own a factory." y={1000} size={44} color={C.ink} />
      <Caption at={Q.biggest} text={<>…on the racing team of <span style={{color: C.yellow}}>one of Italy's biggest car brands.</span></>} y={1000} size={44} color={C.ink} />
      <div style={{position: 'absolute', left: 960 - 760 * banner, top: 210, width: 1520 * banner, height: 0}} />
    </>
  );
};

export const Y1933: SceneDef[] = [
  {from: Q.runsout, C: Depression, tint: '#1C1E2A', glow: '#2C303E', sfx: [sx(Q.runsout, 'negative', 0.12), sx(Q.runsout + 0.2, 'coin', 0.08), sx(Q.depression, 'descend', 0.14), sx(Q.trouble, 'thunder', 0.14)]},
  {from: Q.y1933, C: Takeover, tint: '#1C1E2A', glow: '#2C303E', sfx: [sx(Q.y1933, 'boom', 0.14), sx(Q.orders, 'pop', 0.1), sx(Q.y1933 + 0.2, 'pop', 0.1), sx(Q.takeover, 'swish', 0.1), sx(Q.takeover + 0.3, 'stamp', 0.2), sx(Q.remember, 'shutter', 0.12), sx(Q.samegov, 'ding', 0.08), sx(Q.lira, 'coin', 0.12)]},
  {from: Q.burns, C: Burns, tint: '#2A1A16', glow: '#4A2A1E', sfx: [sx(Q.burns, 'fire', 0.18), sx(Q.pulls + 0.4, 'engine_by', 0.2), sx(Q.pulls + 0.5, 'stamp', 0.18)]},
  {from: Q.someone, C: Who, tint: '#1C1E2A', glow: '#2C303E', sfx: [sx(Q.someone, 'pop', 0.08), sx(Q.someone + 0.15, 'pop', 0.08), sx(Q.someone + 0.3, 'pop', 0.08), sx(Q.who, 'boom', 0.12), sx(Q.stablem, 'shimmer', 0.14)]},
  {from: Q.from33, C: AlfaTeam, tint: '#2A1A22', glow: '#4A2A3A', sfx: [sx(Q.from33, 'whoosh', 0.1), sx(Q.alfateam - 0.4, 'pop', 0.1), sx(Q.alfateam, 'pop', 0.1), sx(Q.builds, 'swish', 0.1), sx(Q.races, 'engine_rev', 0.14), sx(Q.nofactory + 0.5, 'negative', 0.08), sx(Q.biggest, 'success', 0.08)]},
];
