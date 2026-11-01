import React from 'react';
import {interpolate, random} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop, Words} from '../components/Base';
import {Calendar, Pin, Phone} from '../components/Art';
import {Char, Clipboard, Contract, Crate, DinnerTable, Horse, Label, Lira, MoneyBag, PartyHQ, Plate, Shield, Stable, Truck, VintageCar, Workshop, Trophy} from '../components/Ferrari';
import {Badge, Bubble, Caption, Cross, Ground, Polaroid, Road, Sparkles, Stamp, Title} from '../components/Kit';
import {Q} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';
import {ENZO} from './s2_horse';

const TADINI = {outfit: 'suit' as const, shirt: '#2C3E50', tie: '#C9A227', hair: '#4A3426', hairStyle: 'slick' as const, mustache: true};
const CANIATO = {outfit: 'suit' as const, shirt: '#4A3B5C', tie: '#2E86C1', hair: '#6B4A2E', hairStyle: 'short' as const, glasses: 'round' as const};

const Bulb: React.FC<{size?: number; on?: number}> = ({size = 160, on = 1}) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} style={{overflow: 'visible'}}>
    <circle cx="50" cy="50" r={60} fill={C.yellow} opacity={0.2 * on} />
    <path d="M50 6 Q90 6 90 48 Q90 70 70 86 L70 100 L30 100 L30 86 Q10 70 10 48 Q10 6 50 6 Z" fill={on > 0.5 ? C.yellow : '#C9CED8'} />
    <rect x="30" y="102" width="40" height="10" rx="3" fill="#8A90A2" />
    <rect x="33" y="114" width="34" height="10" rx="3" fill="#8A90A2" />
    <path d="M40 98 L40 70 L50 60 L60 70 L60 98" stroke="#A37A00" strokeWidth="4" fill="none" />
  </svg>
);

/** By 1929: racing Alfas and selling them. */
const Dealer: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.yellow, opacity: prog(fr, Q.by1929, 0.5)}}>1929</div>
      <div style={{position: 'absolute', left: 959, top: 300, width: 3, height: 620 * prog(fr, Q.by1929 + 0.3, 0.6), background: C.dim}} />
      <Pop at={Q.by1929 + 0.4} x={480} y={600}>
        <VintageCar size={620} color={C.rosso} num="10" />
      </Pop>
      <Pop at={Q.by1929 + 0.7} x={480} y={860}>
        <Label text="Racing" size={40} color={C.ink} />
      </Pop>
      <Pop at={Q.selling} x={1340} y={640}>
        <VintageCar size={460} color={C.rosso} driver={false} />
      </Pop>
      <Pop at={Q.selling + 0.2} x={1660} y={600}>
        <Char size={260} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="happy" seed={3} look={-0.8} />
      </Pop>
      <Pop at={Q.selling + 0.4} x={1340} y={430} float={6}>
        <div style={{display: 'flex', gap: 10}}>
          <Lira size={80} />
          <Lira size={80} />
        </div>
      </Pop>
      <Pop at={Q.selling + 0.2} x={1440} y={860}>
        <Label text="Selling" size={40} color={C.ink} />
      </Pop>
      <Pop at={Q.dealer} x={1440} y={940}>
        <div style={{background: '#9E1B22', color: '#fff', fontFamily: body, fontWeight: 900, fontSize: 28, padding: '8px 22px', borderRadius: 24, letterSpacing: 2}}>ALFA ROMEO DEALER · HIS REGION</div>
      </Pop>
    </>
  );
};

/** Autumn 1929, Bologna — a dinner for a new speed record. */
const Autumn: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const needle = range(fr, Q.record, Q.record + 1.2, -120, 100);
  return (
    <>
      {new Array(22).fill(0).map((_, i) => {
        const sp = 0.6 + random(`lf${i}`) * 0.8;
        const y = ((random(`ly${i}`) * 1300 + fr * 3 * sp) % 1300) - 150;
        const x = random(`lx${i}`) * 1920 + Math.sin(fr / 20 + i) * 40;
        return (
          <svg key={i} width="40" height="40" viewBox="0 0 40 40" style={{position: 'absolute', left: x, top: y, transform: `rotate(${fr * 3 * sp + i * 40}deg)`, opacity: 0.8}}>
            <path d="M20 2 Q36 14 20 38 Q4 14 20 2 Z" fill={['#D9772B', '#B8451F', '#E8A93A', '#8E3B1E'][i % 4]} />
          </svg>
        );
      })}
      <div style={{position: 'absolute', left: 140, top: 140, opacity: prog(fr, Q.autumn, 0.5)}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 70, color: '#E8A93A'}}>Autumn 1929</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 44, color: C.ink, letterSpacing: 10, marginTop: 6}}>BOLOGNA</div>
      </div>
      <Place x={960} y={790} w={1200} h={240} s={pop(fr, Q.dinner, 12)}>
        <DinnerTable size={1150} />
      </Place>
      <Pop at={Q.dinner + 0.3} x={960} y={600}>
        <div style={{background: '#F6F1E4', color: '#3A2A1E', fontFamily: serif, fontWeight: 900, fontSize: 36, padding: '12px 30px', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>Automobile Club · Gala Dinner</div>
      </Pop>
      <Pop at={Q.record} x={1450} y={300}>
        <svg width="300" height="200" viewBox="0 0 300 200" style={{overflow: 'visible'}}>
          <path d="M30 170 A120 120 0 0 1 270 170" stroke="#3A4466" strokeWidth="26" fill="none" strokeLinecap="round" />
          <path d="M30 170 A120 120 0 0 1 270 170" stroke={C.red} strokeWidth="26" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (needle + 120) / 220} />
          <g transform={`rotate(${needle} 150 170)`}>
            <line x1="150" y1="170" x2="150" y2="70" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
          </g>
          <circle cx="150" cy="170" r="14" fill={C.ink} />
        </svg>
      </Pop>
      <Pop at={Q.record + 0.5} x={1450} y={420}>
        <div style={{background: C.yellow, color: C.bg0, fontFamily: head, fontWeight: 700, fontSize: 40, padding: '6px 24px', borderRadius: 30, letterSpacing: 3}}>NEW SPEED RECORD</div>
      </Pop>
    </>
  );
};

/** And the place? The Casa del Fascio. */
const Casa: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <Caption at={Q.place} out={Q.casa} text="And the place?" y={540} size={70} color={C.ink} />
      <Pop at={Q.casa} x={760} y={560}>
        <PartyHQ size={620} />
      </Pop>
      <Ground y={790} color="#1C2038" />
      <div style={{position: 'absolute', left: 1180, top: 330, opacity: prog(fr, Q.casa + 0.2, 0.5)}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 900, fontSize: 84, color: C.ink, lineHeight: 1.05}}>Casa del<br />Fascio</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: C.muted, marginTop: 20, lineHeight: 1.35, opacity: prog(fr, Q.hq, 0.5), width: 600}}>
          Local headquarters of
          <br />
          <span style={{color: C.yellow}}>Italy's ruling party</span>
        </div>
      </div>
      <Caption at={Q.keep} text={<span style={{color: C.yellow}}>Keep that in mind.</span>} y={960} size={50} />
    </>
  );
};

/** Enzo between two rich men. */
const Table: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <Pop at={Q.caniato} x={480} y={560}>
        <Char size={300} {...CANIATO} mood="happy" seed={11} look={0.6} />
      </Pop>
      <Pop at={Q.sitting} x={960} y={540}>
        <Char size={300} outfit="suit" shirt="#2B2F45" hair={ENZO.hair} hairStyle="slick" mood="neutral" seed={3} look={fr % 120 < 60 ? -0.6 : 0.6} />
      </Pop>
      <Pop at={Q.tadini} x={1440} y={560}>
        <Char size={300} {...TADINI} mood="smirk" seed={12} look={-0.6} />
      </Pop>
      <Place x={960} y={800} w={1500} h={260}>
        <DinnerTable size={1450} />
      </Place>
      <Words text="Two rich men who love racing." at={Q.sitting + 0.6} y={180} size={60} />
      <Pop at={Q.caniato + 0.1} x={480} y={930}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 44, color: C.ink}}>Alfredo Caniato</div>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 26, color: C.muted, letterSpacing: 3, opacity: prog(fr, Q.textile, 0.4)}}>TEXTILE FAMILY</div>
        </div>
      </Pop>
      <Pop at={Q.sitting + 0.2} x={960} y={930}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 44, color: C.red}}>Enzo</div>
      </Pop>
      <Pop at={Q.tadini + 0.1} x={1440} y={930}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: serif, fontWeight: 900, fontSize: 44, color: C.ink}}>Mario Tadini</div>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 26, color: C.muted, letterSpacing: 3, opacity: prog(fr, Q.amateur, 0.4)}}>WEALTHY AMATEUR DRIVER</div>
        </div>
      </Pop>
      <Pop at={Q.textile} x={250} y={420} float={5}>
        <svg width="120" height="90" viewBox="0 0 120 90">
          <rect x="10" y="10" width="100" height="70" rx="35" fill="#2E86C1" />
          <ellipse cx="20" cy="45" rx="14" ry="35" fill="#5DADE2" />
          <path d="M40 20 L100 20 M40 45 L100 45 M40 70 L100 70" stroke="#fff" strokeWidth="3" opacity="0.4" />
        </svg>
      </Pop>
      <Pop at={Q.amateur} x={1680} y={410} float={5}>
        <Trophy size={100} />
      </Pop>
    </>
  );
};

/** The idea: one rich man vs. everything a race car needs. */
const Idea: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const crowd = prog(fr, Q.oneman, 0.6);
  const items: [number, React.ReactNode, string, number, number][] = [
    [Q.mechanics, <Char size={170} outfit="overalls" hair="#3A2A1E" hat="flatcap" mood="neutral" seed={14} />, 'Mechanics', 340, 300],
    [Q.workshop, <Workshop size={240} label="OFFICINA" />, 'A workshop', 760, 230],
    [Q.parts, <Crate size={150} label="RICAMBI" />, 'Spare parts', 1600, 330],
    [Q.truck, <Truck size={300} />, 'A truck', 1560, 760],
    [Q.entries, <Clipboard size={130} />, 'Race entries', 360, 760],
  ];
  return (
    <>
      <Pop at={Q.idea} x={960} y={190}>
        <Bulb size={110} on={prog(fr, Q.idea + 0.3, 0.2)} />
      </Pop>
      <Words text="Here's the idea." at={Q.idea + 0.2} y={350} size={56} out={Q.buy} />
      <Place x={960 + crowd * 0} y={600} w={400} h={500} s={pop(fr, Q.buy, 12)}>
        <Char size={260} {...TADINI} mood={t > Q.oneman ? 'shock' : t > Q.needs ? 'worried' : 'happy'} seed={12} />
      </Place>
      <Pop at={Q.buy + 0.4} x={1180} y={760}>
        <VintageCar size={300} color={C.rosso} driver={false} />
      </Pop>
      <Pop at={Q.easy} x={1180} y={620}>
        <Badge ok size={70} />
      </Pop>
      <Caption at={Q.easy} out={Q.needs} text="That's the easy part." y={960} color={C.ink} />
      {items.map(([at, node, label, x, y], i) => {
        const p = pop(fr, at, 12);
        const cx = interpolate(crowd, [0, 1], [x, 960 + (x - 960) * 0.55]);
        const cy = interpolate(crowd, [0, 1], [y, 600 + (y - 600) * 0.55]);
        if (fr < f(at)) return null;
        return (
          <div key={i} style={{position: 'absolute', left: cx, top: cy + bob(fr, 5, 0.9, i), transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            {node}
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: C.ink, whiteSpace: 'nowrap', background: 'rgba(8,11,24,0.6)', padding: '4px 14px', borderRadius: 16}}>{label}</div>
          </div>
        );
      })}
      <Caption at={Q.oneman} text={<>For one man, <span style={{color: C.yellow}}>that's a lot.</span></>} y={990} size={52} color={C.ink} />
    </>
  );
};

/** Why not share it: one team owns, prepares and races the cars; gentlemen just drive. */
const Share: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const go = range(fr, Q.takes, Q.takes + 1.2, 0, 1, (n) => n * n);
  return (
    <>
      <Words text="So why not share it?" at={Q.share} y={170} size={70} font="head" upper out={Q.owns + 1.5} />
      <Pop at={Q.owns - 0.3} x={960} y={410}>
        <Workshop size={520} label="THE TEAM" />
      </Pop>
      {[0, 1, 2].map((i) => (
        <Place key={i} x={520 + i * 440 + go * 1600} y={770} w={460} h={200} s={pop(fr, Q.owns + 0.3 + i * 0.2, 12)}>
          <div style={{filter: t > Q.ready ? `drop-shadow(0 0 ${12 + 8 * Math.sin(fr / 5 + i)}px rgba(255,216,10,0.5))` : undefined}}>
            <VintageCar size={420} color={C.rosso} num={String(i + 2)} driver={t > Q.gentlemen + 0.4 + i * 0.2} spin={go * 900} />
          </div>
        </Place>
      ))}
      <Road y={850} o={0.7} speed={go * 40} />
      <Pop at={Q.owns + 0.4} x={1500} y={330}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {[
            [Q.owns, 'owns the cars'],
            [Q.ready, 'keeps them ready'],
            [Q.takes, 'takes them racing'],
          ].map(([at, l], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: prog(fr, at as number, 0.3)}}>
              <Badge ok size={44} />
              <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.ink}}>{l}</div>
            </div>
          ))}
        </div>
      </Pop>
      {[0, 1, 2].map((i) => (
        <Place key={i} x={180 + i * 150} y={560} w={200} h={300} s={pop(fr, Q.gentlemen + i * 0.15, 12)} o={1 - prog(fr, Q.gentlemen + 0.4 + i * 0.2, 0.25)}>
          <Char size={180} outfit="suit" shirt={['#2C3E50', '#4A3B5C', '#3D4F3A'][i]} hat={i === 1 ? 'fedora' : 'none'} hair={['#4A3426', '#6B4A2E', '#2A1E18'][i]} hairStyle="slick" mustache={i !== 2} mood="happy" seed={20 + i} />
        </Place>
      ))}
      <Caption at={Q.gentlemen} text={<>The gentlemen just <span style={{color: C.yellow}}>turn up and drive.</span></>} y={1000} size={48} color={C.ink} />
    </>
  );
};

/** 16 November 1929, Modena: signed. Shares and chairman. */
const Signed: React.FC = () => {
  const fr = useCurrentFrame();
  const sign = prog(fr, Q.signed, 1.6);
  const pie = prog(fr, Q.money, 2.2);
  const slices = [
    {v: 0.6, c: C.gold, l: 'Tadini & the Caniatos', at: Q.money},
    {v: 0.25, c: '#9E1B22', l: 'Alfa Romeo', at: Q.shares},
    {v: 0.15, c: C.yellow, l: 'Pirelli', at: Q.shares + 0.6},
  ];
  let acc = 0;
  return (
    <>
      <Pop at={Q.nov16} x={330} y={330}>
        <Calendar size={230} top="NOV" big="16" color={C.red} />
      </Pop>
      <Pop at={Q.nov16 + 0.5} x={330} y={520}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 70, color: C.yellow}}>1929</div>
      </Pop>
      <Pop at={Q.signed} x={330} y={640}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Pin size={44} color={C.red} />
          <Label text="Modena" size={36} color={C.ink} />
        </div>
      </Pop>
      <Pop at={Q.nov16 + 0.3} x={840} y={560} rot={-3}>
        <Contract size={380} sign={sign} />
      </Pop>
      {/* pie of who brought what */}
      <Place x={1460} y={470} w={440} h={440} s={pop(fr, Q.money - 0.2, 12)}>
        <svg width="400" height="400" viewBox="-200 -200 400 400" style={{overflow: 'visible'}}>
          {slices.map((s, i) => {
            const p = prog(fr, s.at, 0.6);
            const a0 = acc * Math.PI * 2 - Math.PI / 2;
            acc += s.v;
            const a1 = a0 + s.v * p * Math.PI * 2;
            const large = s.v * p > 0.5 ? 1 : 0;
            if (p <= 0) return null;
            return <path key={i} d={`M0 0 L${Math.cos(a0) * 180} ${Math.sin(a0) * 180} A180 180 0 ${large} 1 ${Math.cos(a1) * 180} ${Math.sin(a1) * 180} Z`} fill={s.c} stroke={C.bg1} strokeWidth="6" />;
          })}
          <circle r="70" fill={C.bg1} />
          <text y="12" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="34" fill={C.ink}>
            SHARES
          </text>
        </svg>
      </Place>
      <div style={{position: 'absolute', left: 1260, top: 740, display: 'flex', flexDirection: 'column', gap: 10}}>
        {slices.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: prog(fr, s.at + 0.2, 0.4)}}>
            <div style={{width: 30, height: 30, borderRadius: 8, background: s.c}} />
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 32, color: C.ink}}>{s.l}</div>
          </div>
        ))}
      </div>
      <Pop at={Q.chairman} x={840} y={560}>
        <div style={{position: 'relative'}}>
          <Char size={300} {...TADINI} mood="smirk" seed={12} />
          <div style={{position: 'absolute', left: 30, top: 300, background: C.gold, color: C.bg0, fontFamily: head, fontWeight: 700, fontSize: 36, padding: '4px 20px', borderRadius: 24, letterSpacing: 3}}>CHAIRMAN</div>
        </div>
      </Pop>
    </>
  );
};

/** Why isn't it called Scuderia Tadini? Money was theirs; everything else was Enzo's. */
const WhyNotTadini: React.FC = () => {
  const fr = useCurrentFrame();
  const col = prog(fr, Q.because - 0.2, 0.6);
  const items: [number, React.ReactNode, string][] = [
    [Q.thecars, <VintageCar size={170} color={C.rosso} driver={false} />, 'the cars'],
    [Q.thecars + 0.5, <Char size={90} outfit="racer" hat="helmet" mood="happy" seed={30} />, 'the drivers'],
    [Q.contacts, <Phone size={110} color="#9E1B22" />, 'contacts at Alfa'],
    [Q.experience, <div style={{fontFamily: serif, fontWeight: 900, fontSize: 64, color: C.yellow}}>★ ★ ★</div>, 'the experience'],
  ];
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: interpolate(col, [0, 1], [440, 120]), textAlign: 'center', transform: `scale(${interpolate(col, [0, 1], [1, 0.6])})`, opacity: prog(fr, Q.whynot, 0.5)}}>
        <span style={{fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.ink, position: 'relative'}}>
          Scuderia <span style={{color: C.gold}}>Tadini</span>?
          <div style={{position: 'absolute', left: 0, top: '55%', height: 12, width: `${prog(fr, Q.because + 0.4, 0.4) * 100}%`, background: C.red, borderRadius: 6}} />
        </span>
      </div>
      <Caption at={Q.youask} out={Q.whynot} text="So you may ask…" y={540} size={56} color={C.muted} />
      {/* theirs */}
      <div style={{position: 'absolute', left: 140, top: 330, width: 560, opacity: col}}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted, letterSpacing: 6}}>THEIRS</div>
        <div style={{display: 'flex', gap: 20, marginTop: 40}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{transform: `scale(${pop(fr, Q.because + 0.2 + i * 0.15)})`}}>
              <MoneyBag size={150} />
            </div>
          ))}
        </div>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 56, color: C.gold, marginTop: 20}}>The money.</div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 330, width: 4, height: 600 * col, background: C.dim}} />
      {/* enzo's */}
      <div style={{position: 'absolute', left: 900, top: 330, width: 900, opacity: prog(fr, Q.else, 0.4)}}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.red, letterSpacing: 6}}>ENZO'S — EVERYTHING ELSE</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 30}}>
          {items.map(([at, node, label], i) => (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 190, background: 'rgba(255,255,255,0.05)', borderRadius: 20, transform: `scale(${pop(fr, at)})`, padding: 12}}>
              {node}
              <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: C.ink, marginTop: 8}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <Pop at={Q.hisname} x={1340} y={990} s={1}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 64, color: C.ink}}>
          And his <span style={{color: C.red}}>name.</span>
        </div>
      </Pop>
    </>
  );
};

/** For the first time, the name Ferrari is on something. */
const NameOn: React.FC = () => {
  const fr = useCurrentFrame();
  const typed = 'SCUDERIA FERRARI';
  const n = Math.round(interpolate(fr, [f(Q.firsttime + 0.4), f(Q.firsttime + 2.2)], [0, typed.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const glow = prog(fr, Q.firsttime + 2.1, 0.6);
  return (
    <>
      <Place x={960} y={600} w={1200} h={900} s={1}>
        <svg width="1100" height="760" viewBox="0 0 420 300" style={{overflow: 'visible'}}>
          <path d="M20 110 L210 30 L400 110 Z" fill="#7C3A2C" />
          <rect x="36" y="108" width="348" height="180" fill="#E6DCC6" />
          <rect x="80" y="170" width="260" height="118" fill="#2A2420" />
          <rect x="56" y="122" width="308" height="38" rx="4" fill={C.rosso} />
        </svg>
      </Place>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: head, fontWeight: 700, fontSize: 64, letterSpacing: 10, color: '#fff', textShadow: glow ? `0 0 ${30 * glow}px rgba(255,216,10,0.8)` : undefined}}>
        {typed.slice(0, n)}
        <span style={{opacity: fr % 20 < 10 && n < typed.length ? 1 : 0}}>|</span>
      </div>
      <Title at={Q.firsttime} text={<>For the first time,<br />the name <span style={{color: C.red}}>Ferrari</span> is on something.</>} y={170} size={64} />
      <Sparkles x={960} y={560} at={Q.firsttime + 2.1} r={420} />
    </>
  );
};

/** Scuderia = stable. But the horses were Alfa Romeos. */
const StableWord: React.FC = () => {
  const fr = useCurrentFrame();
  const open = prog(fr, Q.weren, 0.8);
  return (
    <>
      <div style={{position: 'absolute', left: 140, top: 160, opacity: prog(fr, Q.scuderia, 0.4)}}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.ink, lineHeight: 1}}>Scuderia</div>
        <div style={{fontFamily: body, fontWeight: 800, fontSize: 34, color: C.muted, marginTop: 10, fontStyle: 'italic'}}>/sku·de·ˈri·a/ · noun · Italian</div>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 62, color: C.yellow, marginTop: 24, opacity: prog(fr, Q.stable, 0.4)}}>“stable”</div>
      </div>
      <Pop at={Q.stable} x={1320} y={560}>
        <div style={{position: 'relative'}}>
          <Stable size={620} open={open} />
          {/* inside: not horses but Alfas */}
          <div style={{position: 'absolute', left: 215, top: 300, width: 190, height: 180, overflow: 'hidden', opacity: open}}>
            <div style={{position: 'absolute', left: -60, top: 80}}>
              <VintageCar size={300} color="#B8141E" driver={false} />
            </div>
          </div>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 140, top: 640, display: 'flex', gap: 22}}>
        {['kept', 'trained', 'raced'].map((w, i) => (
          <div key={w} style={{transform: `scale(${pop(fr, Q.kept + 0.6 + i * 0.55)})`, background: C.bg3, color: C.ink, fontFamily: body, fontWeight: 900, fontSize: 36, padding: '10px 26px', borderRadius: 30}}>
            {w}
          </div>
        ))}
      </div>
      <Caption at={Q.kept} out={Q.weren} text="A place where horses are…" x={560} y={620} size={36} />
      <Pop at={Q.alfas} x={1320} y={930}>
        <Plate text="ALFA ROMEO" size={44} color="#9E1B22" fg="#fff" />
      </Pop>
      <Caption at={Q.weren} text={<>But the horses <span style={{color: C.red}}>weren't Enzo's.</span></>} x={560} y={860} size={44} color={C.ink} />
    </>
  );
};

/** July 1932, 24 Hours of Spa: the stable gets its horse — and finishes 1-2. */
const Spa: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const land = range(fr, Q.goeson - 0.2, Q.goeson + 0.6, 0, 1);
  const shield = prog(fr, Q.yellow, 0.6);
  const podium = prog(fr, Q.first2, 0.5);
  const clock = ((t - Q.july) / 3) * 360;
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 110, opacity: prog(fr, Q.july, 0.4) * (1 - podium)}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 60, color: C.yellow}}>July 1932</div>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 64, color: C.ink, letterSpacing: 3, opacity: prog(fr, Q.spa, 0.4)}}>24 HOURS OF SPA</div>
      </div>
      <Place x={1000} y={170} w={240} h={240} s={0.75 * pop(fr, Q.spa, 12) * (1 - podium)}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="#F6F1E4" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={C.red} strokeWidth="10" />
          <text x="100" y="80" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="34" fill={C.red}>
            24h
          </text>
          <line x1="100" y1="100" x2={100 + Math.sin((clock * Math.PI) / 180) * 70} y2={100 - Math.cos((clock * Math.PI) / 180) * 70} stroke="#222" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill="#222" />
        </svg>
      </Place>
      {/* the car that receives the badge */}
      <Place x={interpolate(podium, [0, 1], [960, 700])} y={interpolate(podium, [0, 1], [700, 640])} w={900} h={360} s={interpolate(podium, [0, 1], [1, 0.55])}>
        <VintageCar size={860} color="#B8141E" num="9" />
      </Place>
      {/* the horse arrives (from the memory note), then the yellow shield forms behind it */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(land, [0, 1], [960, 1172]) - 100,
          top: interpolate(land, [0, 1], [300, 600]) - 140,
          transform: `scale(${pop(fr, Q.getshorse, 12) * interpolate(land, [0, 1], [1.6, 0.42])})`,
          opacity: 1 - podium,
        }}
      >
        <div style={{position: 'relative', width: 200, height: 280}}>
          <div style={{position: 'absolute', left: -38, top: -40, opacity: shield, transform: `scale(${0.6 + 0.4 * shield})`}}>
            <Shield size={276} plain />
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, opacity: 1 - shield}}>
            <Horse size={200} color="#111" stroke={C.yellow} sw={3} />
          </div>
        </div>
      </div>
      <Glow x={1172} y={600} r={200} color={C.yellow} o={0.5 * shield * (1 - podium)} />
      <Pop at={Q.modenac} x={1500} y={460}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: 1 - podium}}>
          <div style={{width: 80, height: 80, borderRadius: 16, background: C.yellow, boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}} />
          <div>
            <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 40, color: C.ink}}>Giallo Modena</div>
            <div style={{fontFamily: body, fontWeight: 800, fontSize: 24, color: C.muted}}>the colour of Modena</div>
          </div>
        </div>
      </Pop>
      {/* podium */}
      <div style={{position: 'absolute', left: 1050, top: 360, opacity: podium}}>
        <svg width="700" height="560" viewBox="0 0 700 560">
          <rect x="0" y="260" width="300" height="300" fill="#3A4670" />
          <rect x="300" y="160" width="300" height="400" fill="#4A5A90" />
          <text x="150" y="420" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="120" fill={C.ink}>
            2
          </text>
          <text x="450" y="370" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="140" fill={C.yellow}>
            1
          </text>
        </svg>
        <div style={{position: 'absolute', left: 10, top: 170}}>
          <VintageCar size={280} color="#B8141E" num="9" badge />
        </div>
        <div style={{position: 'absolute', left: 310, top: 70}}>
          <VintageCar size={280} color="#B8141E" num="8" badge />
        </div>
      </div>
      <Sparkles x={1400} y={420} at={Q.first2} r={300} />
      <Caption at={Q.first2} text={<>First <span style={{color: C.yellow}}>and</span> second.</>} y={1000} size={56} color={C.ink} />
    </>
  );
};

/** What exists in 1932: a team called Ferrari ✓, a horse badge ✓, a Ferrari car ✗. */
const Inventory: React.FC = () => {
  const fr = useCurrentFrame();
  const cards: [number, React.ReactNode, string, boolean][] = [
    [Q.team1, <Workshop size={280} label="SCUDERIA FERRARI" />, 'A team called Ferrari', true],
    [Q.badge, <Shield size={150} plain />, 'A horse badge', true],
    [
      Q.nocar,
      <svg width="300" height="130" viewBox="0 0 520 200">
        <path d="M28 126 Q30 100 110 94 L198 90 Q206 78 222 76 L262 76 Q270 76 274 88 L430 88 Q476 90 484 114 Q488 134 466 140 L64 142 Q28 142 28 126 Z" fill="none" stroke={C.muted} strokeWidth="6" strokeDasharray="14 12" />
        <circle cx="128" cy="146" r="40" fill="none" stroke={C.muted} strokeWidth="6" strokeDasharray="12 10" />
        <circle cx="418" cy="146" r="40" fill="none" stroke={C.muted} strokeWidth="6" strokeDasharray="12 10" />
        <text x="260" y="130" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="70" fill={C.muted}>
          ?
        </text>
      </svg>,
      'A Ferrari car',
      false,
    ],
  ];
  return (
    <>
      <Title at={Q.look} text={<>What exists in <span style={{color: C.yellow}}>1932</span>?</>} y={170} size={90} />
      {cards.map(([at, node, label, ok], i) => (
        <Pop key={i} at={at} x={420 + i * 540} y={600}>
          <div style={{width: 460, height: 460, borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: `3px solid ${ok ? 'rgba(62,219,155,0.5)' : 'rgba(232,32,42,0.6)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative'}}>
            <div style={{height: 260, display: 'flex', alignItems: 'center'}}>{node}</div>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 36, color: C.ink}}>{label}</div>
            <div style={{position: 'absolute', right: -24, top: -24, transform: `scale(${pop(fr, at + 0.5, 10)})`}}>
              <Badge ok={ok} size={86} />
            </div>
          </div>
        </Pop>
      ))}
      <Caption at={Q.nocar + 0.4} text={<>Not a <span style={{color: C.red}}>single</span> Ferrari car.</>} y={980} size={52} color={C.ink} />
    </>
  );
};

export const DINNER: SceneDef[] = [
  {from: Q.by1929, C: Dealer, tint: '#241A30', glow: '#45304A', sfx: [sx(Q.by1929, 'boom', 0.12), sx(Q.by1929 + 0.4, 'engine_rev', 0.16), sx(Q.selling, 'pop', 0.1), sx(Q.selling + 0.4, 'coin', 0.12), sx(Q.dealer, 'pop_high', 0.08)]},
  {from: Q.autumn, C: Autumn, tint: '#2E1C1E', glow: '#5A3424', sfx: [sx(Q.autumn, 'wind', 0.12), sx(Q.dinner, 'clink', 0.16), sx(Q.dinner + 0.3, 'pop', 0.08), sx(Q.record, 'riser_short', 0.1), sx(Q.record + 0.5, 'ding', 0.1)]},
  {from: Q.place, C: Casa, tint: '#1E1E2C', glow: '#3A3442', sfx: [sx(Q.casa, 'boom', 0.14), sx(Q.casa + 0.2, 'paper', 0.08), sx(Q.keep, 'shutter', 0.14)]},
  {from: Q.sitting, C: Table, tint: '#2E1C22', glow: '#55303A', sfx: [sx(Q.sitting, 'clink', 0.14), sx(Q.caniato, 'pop', 0.1), sx(Q.tadini, 'pop', 0.1), sx(Q.textile, 'pop_high', 0.07), sx(Q.amateur, 'pop_high', 0.07)]},
  {
    from: Q.idea,
    C: Idea,
    tint: '#1A2142',
    glow: '#2C3A6A',
    sfx: [sx(Q.idea + 0.3, 'ding', 0.12), sx(Q.buy, 'pop', 0.1), sx(Q.buy + 0.4, 'coin', 0.1), sx(Q.easy, 'success', 0.08), sx(Q.mechanics, 'pop', 0.1), sx(Q.workshop, 'pop', 0.1), sx(Q.parts, 'pop', 0.1), sx(Q.truck, 'pop', 0.1), sx(Q.entries, 'pop', 0.1), sx(Q.oneman, 'thud', 0.14)],
  },
  {from: Q.share, C: Share, tint: '#1A2142', glow: '#2C3A6A', sfx: [sx(Q.share, 'whoosh', 0.1), sx(Q.owns - 0.3, 'thud', 0.12), sx(Q.owns + 0.3, 'pop', 0.08), sx(Q.owns + 0.5, 'pop', 0.08), sx(Q.owns + 0.7, 'pop', 0.08), sx(Q.ready, 'shimmer', 0.08), sx(Q.takes, 'engine_rev', 0.14), sx(Q.gentlemen, 'pops_many', 0.08)]},
  {from: Q.nov16, C: Signed, tint: '#241E30', glow: '#463A50', sfx: [sx(Q.nov16, 'paper', 0.14), sx(Q.signed, 'scribble', 0.2), sx(Q.money, 'coin', 0.12), sx(Q.shares, 'pop', 0.1), sx(Q.shares + 0.6, 'pop', 0.1), sx(Q.chairman, 'stamp', 0.14)]},
  {from: Q.youask, C: WhyNotTadini, tint: '#241E30', glow: '#463A50', sfx: [sx(Q.whynot, 'pop', 0.1), sx(Q.because + 0.2, 'coin', 0.12), sx(Q.because + 0.4, 'swish', 0.1), sx(Q.thecars, 'pop', 0.1), sx(Q.thecars + 0.5, 'pop', 0.1), sx(Q.contacts, 'pop', 0.1), sx(Q.experience, 'pop', 0.1), sx(Q.hisname, 'boom', 0.12)]},
  {from: Q.firsttime, C: NameOn, tint: '#2E1A22', glow: '#5A2A3A', sfx: [sx(Q.firsttime + 0.4, 'typing', 0.16), sx(Q.firsttime + 2.1, 'shimmer', 0.14)]},
  {from: Q.word, C: StableWord, tint: '#2A1E1A', glow: '#4E3A2A', sfx: [sx(Q.scuderia, 'ding', 0.1), sx(Q.stable, 'pop', 0.1), sx(Q.kept + 0.6, 'pop_high', 0.07), sx(Q.kept + 1.15, 'pop_high', 0.07), sx(Q.kept + 1.7, 'pop_high', 0.07), sx(Q.weren, 'door', 0.16), sx(Q.alfas, 'stamp', 0.12)]},
  {from: Q.july, C: Spa, tint: '#222A1E', glow: '#3E4A2A', sfx: [sx(Q.july, 'boom', 0.1), sx(Q.spa, 'clock', 0.12), sx(Q.getshorse, 'shimmer', 0.16), sx(Q.goeson + 0.5, 'stamp', 0.14), sx(Q.yellow, 'shimmer', 0.1), sx(Q.first2, 'cheer', 0.16), sx(Q.first2, 'success', 0.12)]},
  {from: Q.look, C: Inventory, tint: '#1A2142', glow: '#2C3A6A', sfx: [sx(Q.look, 'whoosh', 0.1), sx(Q.team1, 'pop', 0.1), sx(Q.team1 + 0.5, 'ding', 0.08), sx(Q.badge, 'pop', 0.1), sx(Q.badge + 0.5, 'ding', 0.08), sx(Q.nocar, 'pop', 0.1), sx(Q.nocar + 0.5, 'negative', 0.12)]},
];
