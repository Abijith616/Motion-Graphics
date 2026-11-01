import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../frame';
import {Glow, Place, Pop} from '../components/Base';
import {Car125, Char, Crowd, DinnerTable, Engine, F1Car, Factory, FerrariWord, Lira, MoneyBag, RoadCar, Shield, Tyre, Truck, VintageCar} from '../components/Ferrari';
import {Arrow, Caption, Cross, Ground, Road, SpeedLines, Sparkles, Title} from '../components/Kit';
import {BRAND, wordFont} from '../brand/Noosphere';
import {Q, AUDIO_END} from '../cues';
import {bob, f, pop, prog, range} from '../lib';
import {SceneDef, sx} from '../scene';
import {C, body, head, serif} from '../theme';
import {KID} from './s1_boy';

/** Where do the road cars come in? Racing is expensive and Alfa isn't paying any more. */
const Problem: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const gone = prog(fr, Q.noalfa, 0.6);
  const cost = prog(fr, Q.engines, 3.4);
  const items: [number, React.ReactNode, string][] = [
    [Q.engines, <Engine size={150} />, 'Engines'],
    [Q.tires, <Tyre size={110} />, 'Tyres'],
    [Q.drivers2, <Char size={100} outfit="racer" hat="helmet" mood="happy" seed={50} />, 'Drivers'],
    [Q.travel, <Truck size={200} />, 'Travel'],
    [Q.season, <Car125 size={200} bodywork={1} />, 'A new car every season'],
  ];
  return (
    <>
      <Title at={Q.roadq} out={Q.beforewar} text={<>So where do the <span style={{color: C.yellow}}>road cars</span> come in?</>} y={540} size={80} />
      <div style={{position: 'absolute', left: 0, top: 0, opacity: prog(fr, Q.beforewar, 0.4) * (1 - prog(fr, Q.expensive, 0.4))}}>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 120, textAlign: 'center', fontFamily: body, fontWeight: 900, fontSize: 34, color: C.muted, letterSpacing: 6}}>BEFORE THE WAR</div>
        <div style={{position: 'absolute', left: 280, top: 300, filter: `grayscale(${gone})`, opacity: 1 - gone * 0.5}}>
          <Factory size={420} color="#E4DCCB" roof="#9E1B22" label="ALFA ROMEO" />
        </div>
        <div style={{position: 'absolute', left: 860, top: 420}}>
          <MoneyBag size={150} />
        </div>
        <div style={{position: 'absolute', left: 1220, top: 420}}>
          <VintageCar size={420} color="#B8141E" />
        </div>
      </div>
      <Arrow at={Q.beforewar + 0.3} d="M 720 500 L 840 500" color={C.ink} width={8} out={Q.expensive} />
      <Arrow at={Q.beforewar + 0.6} d="M 1030 500 L 1190 500" color={C.ink} width={8} out={Q.expensive} />
      <Cross at={Q.noalfa + 0.2} x={490} y={430} size={320} out={Q.expensive} />
      <Caption at={Q.noalfa} out={Q.expensive} text="Now there's no Alfa." y={880} size={50} color={C.ink} />
      {/* the bill */}
      <Title at={Q.expensive} text={<>Racing is <span style={{color: C.red}}>expensive.</span></>} y={150} size={80} />
      <div style={{position: 'absolute', left: 120, top: 330, display: 'flex', gap: 26, alignItems: 'flex-end'}}>
        {items.map(([at, node, label], i) => (
          <div key={i} style={{width: 310, height: 330, background: 'rgba(255,255,255,0.05)', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 16, transform: `scale(${pop(fr, at, 11)})`}}>
            <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>{node}</div>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: i === 4 ? 24 : 30, color: C.ink, textAlign: 'center'}}>{label}</div>
            <div style={{fontFamily: head, fontWeight: 700, fontSize: 30, color: C.red, marginTop: 4}}>₤₤₤</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 260, width: 1400, top: 760, opacity: prog(fr, Q.engines, 0.4)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>
          <span>COST PER SEASON</span>
          <span style={{color: C.red}}>₤₤₤₤₤</span>
        </div>
        <div style={{height: 34, borderRadius: 17, background: C.bg3, marginTop: 12, overflow: 'hidden'}}>
          <div style={{width: `${cost * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}, ${C.red})`}} />
        </div>
      </div>
    </>
  );
};

/** Sell cars to the public; the money goes straight back into racing. */
const Loop: React.FC = () => {
  const fr = useCurrentFrame();
  const coinA = ((fr / 30 - Q.backinto) * 0.5) % 1;
  const reason = prog(fr, Q.reason, 0.5);
  return (
    <>
      <Title at={Q.sells} text={<>So Enzo <span style={{color: C.yellow}}>sells cars</span> to the public.</>} y={120} size={70} />
      <Pop at={Q.sells + 0.3} x={460} y={600}>
        <RoadCar size={500} color={C.rosso} badge />
      </Pop>
      <Pop at={Q.customers} x={960} y={350}>
        <div style={{display: 'flex', gap: 10}}>
          {[0, 1, 2].map((i) => (
            <Char key={i} size={130} outfit="suit" shirt={['#2C3E50', '#4A3B5C', '#3D4F3A'][i]} hair={['#4A3426', '#C9A24D', '#2A1E18'][i]} hairStyle={i === 1 ? 'wavy' : 'slick'} hat={i === 0 ? 'fedora' : 'none'} mood="happy" seed={60 + i} arms={fr > f(Q.customers + 0.3 + i * 0.2) ? 'wave' : 'down'} />
          ))}
        </div>
      </Pop>
      <Pop at={Q.customers + 0.2} x={960} y={520}>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>RICH CUSTOMERS</div>
      </Pop>
      <Pop at={Q.backinto - 0.2} x={1460} y={600}>
        <Car125 size={480} bodywork={1} badge />
      </Pop>
      <Arrow at={Q.customers + 0.3} d="M 600 470 Q 700 330 820 340" color={C.gold} width={8} />
      <Arrow at={Q.backinto} d="M 1100 340 Q 1250 330 1360 470" color={C.gold} width={8} />
      <Arrow at={Q.backinto + 0.6} d="M 1300 780 Q 960 920 620 780" color={C.dim} width={8} dash />
      {fr > f(Q.backinto) && (
        <div style={{position: 'absolute', left: interpolate(coinA, [0, 0.5, 1], [620, 960, 1340]) - 30, top: interpolate(coinA, [0, 0.5, 1], [420, 300, 420]) - 30}}>
          <Lira size={60} />
        </div>
      )}
      <div style={{position: 'absolute', left: 260, top: 760, width: 400, textAlign: 'center', opacity: reason}}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 46, color: C.muted, letterSpacing: 4}}>THE MEANS</div>
      </div>
      <div style={{position: 'absolute', left: 1260, top: 760, width: 400, textAlign: 'center', opacity: prog(fr, Q.paid - 0.6, 0.4)}}>
        <div style={{fontFamily: head, fontWeight: 700, fontSize: 46, color: C.yellow, letterSpacing: 4}}>THE REASON</div>
      </div>
      <Caption at={Q.reason} text={<>The road cars were <span style={{color: C.yellow}}>how the racing got paid for.</span></>} y={1010} size={44} color={C.ink} />
    </>
  );
};

/** Today: company + racing division; every F1 championship since 1950. */
const Today: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const tl = prog(fr, Q.y1950, 2.2);
  const other = prog(fr, Q.noother, 0.4);
  const yearNow = 2026;
  const x0 = 260;
  const x1 = 1660;
  const yx = (y: number) => x0 + ((y - 1950) / (yearNow - 1950)) * (x1 - x0);
  const others = [
    {a: 1958, b: 1994, c: '#2E86C1'},
    {a: 1966, b: 2026, c: '#F28C28'},
    {a: 1970, b: 2003, c: '#1F7A3A'},
    {a: 1977, b: 2026, c: '#9BA6C2'},
  ];
  const top = 1 - prog(fr, Q.everyf1 - 0.2, 0.5);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: top}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: body, fontWeight: 900, fontSize: 36, color: C.muted, letterSpacing: 8, opacity: prog(fr, Q.today, 0.4)}}>TODAY</div>
        <Pop at={Q.today + 0.3} x={960} y={330}>
          <div style={{position: 'relative'}}>
            <Factory size={460} color="#F1E7D4" roof="#A3261E" />
            <div style={{position: 'absolute', left: 120, top: 92, width: 220, display: 'flex', justifyContent: 'center', background: '#F1E7D4', padding: '6px 0', borderRadius: 6}}>
              <FerrariWord width={180} />
            </div>
          </div>
        </Pop>
        <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}}>
          <line x1="960" y1="500" x2="960" y2={500 + 140 * prog(fr, Q.division2 - 0.4, 0.5)} stroke={C.red} strokeWidth="8" strokeDasharray="2 16" strokeLinecap="round" />
        </svg>
        <Pop at={Q.division2} x={960} y={770}>
          <F1Car size={560} color={C.rosso} />
        </Pop>
        <Pop at={Q.division2 + 0.3} x={960} y={900}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Shield size={60} />
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.ink, letterSpacing: 3}}>ITS RACING DIVISION</div>
          </div>
        </Pop>
      </div>
      {/* every championship since 1950 */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - top}}>
        <Title at={Q.everyf1} text={<>Every <span style={{color: C.red}}>F1 World Championship</span></>} y={180} size={72} />
        <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}}>
          {others.map((o, i) => {
            const shown = Math.min(1, Math.max(0, (tl * (yearNow - 1950) + 1950 - o.a) / (o.b - o.a)));
            return <line key={i} x1={yx(o.a)} y1={420 + i * 40} x2={yx(o.a) + (yx(o.b) - yx(o.a)) * shown} y2={420 + i * 40} stroke={o.c} strokeWidth="14" strokeLinecap="round" opacity={(shown > 0 ? 0.8 : 0) * (1 - other * 0.65)} />;
          })}
          <line x1={x0} y1="640" x2={x0 + (x1 - x0) * tl} y2="640" stroke={C.red} strokeWidth="24" strokeLinecap="round" />
          {new Array(16).fill(0).map((_, i) => {
            const y = 1950 + i * 5;
            if (y > yearNow) return null;
            return (
              <g key={y} opacity={tl * (yx(y) <= x0 + (x1 - x0) * tl ? 1 : 0)}>
                <line x1={yx(y)} y1="672" x2={yx(y)} y2="690" stroke={C.muted} strokeWidth="3" />
                {i % 2 === 0 && (
                  <text x={yx(y)} y="726" textAnchor="middle" fontFamily={head} fontWeight={500} fontSize="30" fill={C.muted}>
                    {y}
                  </text>
                )}
              </g>
            );
          })}
          {/* the current season, at the end of the line */}
          <g opacity={prog(fr, Q.y1950 + 2.1, 0.4)}>
            <line x1={yx(yearNow)} y1="666" x2={yx(yearNow)} y2="696" stroke={C.yellow} strokeWidth="5" />
            <text x={yx(yearNow)} y="730" textAnchor="middle" fontFamily={head} fontWeight={700} fontSize="34" fill={C.yellow}>
              {yearNow}
            </text>
          </g>
        </svg>
        <div style={{position: 'absolute', left: x0 + (x1 - x0) * tl - 70, top: 590}}>
          <F1Car size={150} color={C.rosso} />
        </div>
        <div style={{position: 'absolute', left: x0 - 40, top: 760, fontFamily: serif, fontWeight: 900, fontSize: 90, color: C.yellow, opacity: prog(fr, Q.y1950, 0.4)}}>1950</div>
        <div style={{position: 'absolute', left: x1 - 120, top: 770, fontFamily: serif, fontWeight: 900, fontSize: 90, color: C.ink, opacity: prog(fr, Q.y1950 + 2.0, 0.4)}}>today</div>
        <Caption at={Q.noother} text={<span style={{fontFamily: head, fontSize: 64, letterSpacing: 4}}>NO OTHER TEAM CAN SAY THAT.</span>} y={970} color={C.ink} />
      </div>
    </>
  );
};

/** McLaren: also a race team first. In F1, racing first is common. */
const McLaren: React.FC = () => {
  const fr = useCurrentFrame();
  const row = prog(fr, Q.common - 0.2, 0.6);
  return (
    <>
      <Title at={Q.notonly} out={Q.common - 0.2} text="Ferrari isn't the only one." y={150} size={76} />
      <div style={{opacity: 1 - row}}>
        <Pop at={Q.mclaren} x={540} y={540}>
          <F1Car size={560} color="#F28C28" accent="#1B1F2A" />
        </Pop>
        <Pop at={Q.mclaren + 0.3} x={540} y={720}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: serif, fontWeight: 900, fontSize: 60, color: '#F28C28'}}>McLaren</div>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>RACE TEAM FIRST</div>
          </div>
        </Pop>
        <Arrow at={Q.decades - 0.3} d="M 860 540 L 1060 540" color={C.dim} width={8} dash />
        <Pop at={Q.decades} x={1380} y={540}>
          <RoadCar size={500} color="#F28C28" />
        </Pop>
        <Pop at={Q.decades + 0.3} x={1380} y={720}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 4}}>ROAD CARS</div>
            <div style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 52, color: C.ink}}>decades later</div>
          </div>
        </Pop>
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: row}}>
        {[C.rosso, '#F28C28', C.silver, '#2E86C1', '#1F7A3A'].map((c, i) => (
          <Place key={i} x={260 + i * 350} y={520 + (i % 2) * 60} w={360} h={160} s={pop(fr, Q.common + i * 0.12, 12)}>
            <F1Car size={330} color={c} accent={c === C.silver ? '#1B1F2A' : '#111'} />
          </Place>
        ))}
        <Title at={Q.common} text={<>In F1, racing first is <span style={{color: C.yellow}}>actually common.</span></>} y={230} size={72} />
      </div>
    </>
  );
};

/** Closing: the boy in the crowd in 1908 — his team still racing today. */
const Closing: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const now = prog(fr, Q.todayteam, 1.0);
  const passA = interpolate(t, [Q.watched, Q.watched + 1.3], [-500, 2400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const passB = interpolate(t, [Q.todayteam + 0.4, Q.todayteam + 1.4], [-600, 2600], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fin = prog(fr, Q.undername, 0.6);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, filter: `sepia(${0.8 * (1 - now)}) saturate(${0.6 + 0.4 * now})`}}>
        <Ground y={880} color="#252536" />
        <Place x={960} y={700} w={2100} h={220} o={0.85}>
          <Crowd n={20} width={2100} color="#2A3158" seed={7} cheer={0.4} />
        </Place>
        <Pop at={Q.but1908} x={420} y={700}>
          <div style={{opacity: 1 - now}}>
            <Char size={200} kid outfit="shirt" shirt={KID.shirt} hair={KID.hair} hairStyle="kid" mood="shock" seed={2} look={1} />
          </div>
        </Pop>
        <Road y={800} />
        <SpeedLines o={t > Q.watched && t < Q.watched + 1.3 ? 1 : t > Q.todayteam + 0.4 && t < Q.todayteam + 1.4 ? 1 : 0} y0={760} y1={900} n={18} />
        {t < Q.watched + 1.4 && (
          <Place x={passA} y={820} w={600} h={260}>
            <VintageCar size={520} color={C.rosso} num="4" spin={passA * 1.6} blur={1} />
          </Place>
        )}
        {t > Q.todayteam + 0.3 && (
          <Place x={passB} y={830} w={700} h={240}>
            <F1Car size={640} color={C.rosso} spin={passB} blur={1} />
          </Place>
        )}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', opacity: prog(fr, Q.but1908, 0.5) * (1 - now)}}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.yellow}}>1908</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.ink, opacity: prog(fr, Q.watched, 0.4)}}>a ten-year-old watches his first race</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', opacity: now * (1 - fin)}}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.ink}}>Today</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 40, color: C.ink}}>his team is still racing</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: `rgba(8,11,24,${0.75 * fin})`}} />
      <Place x={960} y={430} w={500} h={600} s={pop(fr, Q.undername, 11)}>
        <Shield size={280} glow={30} />
      </Place>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', opacity: fin}}>
        <div style={{fontFamily: serif, fontWeight: 900, fontSize: 96, color: C.ink}}>
          Scuderia <span style={{color: C.red}}>Ferrari</span>
        </div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 38, color: C.muted, letterSpacing: 6, marginTop: 10, opacity: prog(fr, Q.dinner29, 0.4)}}>
          A NAME FROM A DINNER IN <span style={{color: C.yellow}}>1929</span>
        </div>
      </div>
      <Sparkles x={960} y={430} at={Q.undername} r={260} />
    </>
  );
};

/** Outro: wordmark + subscribe. */
const Outro: React.FC = () => {
  const fr = useCurrentFrame();
  const a = pop(fr, Q.thatsit, 13);
  const btn = pop(fr, Q.seeyou - 0.2, 12);
  const cur = range(fr, Q.seeyou + 0.2, Q.seeyou + 1.2, 0, 1);
  const click = fr > f(Q.seeyou + 1.3);
  const press = fr > f(Q.seeyou + 1.2) && fr < f(Q.seeyou + 1.45) ? 0.92 : 1;
  const bell = fr > f(Q.seeyou + 2.0) ? Math.sin((fr - f(Q.seeyou + 2.0)) / 2) * 18 * Math.max(0, 1 - (fr - f(Q.seeyou + 2.0)) / 40) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${BRAND.ink} 0%, #0C0C0C 55%, ${BRAND.black} 100%)`, opacity: prog(fr, Q.thatsit, 0.5)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', transform: `scale(${0.85 + 0.15 * a})`, opacity: Math.min(1, a)}}>
        <span style={{fontFamily: wordFont, fontSize: 230, color: BRAND.white, letterSpacing: 3}}>
          <span style={{color: BRAND.cyan}}>N</span>OOSPHERE
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', gap: 30, alignItems: 'center', transform: `scale(${btn})`}}>
        <div style={{background: click ? '#3A3A3A' : '#E62117', color: '#fff', fontFamily: body, fontWeight: 900, fontSize: 44, padding: '20px 56px', borderRadius: 50, letterSpacing: 2, transform: `scale(${press})`, boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>{click ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</div>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{transform: `rotate(${bell}deg)`, opacity: prog(fr, Q.seeyou + 1.8, 0.3)}}>
          <path d="M45 10 Q68 10 68 40 L68 58 L76 68 L14 68 L22 58 L22 40 Q22 10 45 10 Z" fill="#fff" />
          <circle cx="45" cy="76" r="8" fill="#fff" />
        </svg>
      </div>
      <svg width="70" height="90" viewBox="0 0 70 90" style={{position: 'absolute', left: interpolate(cur, [0, 1], [1500, 1000]), top: interpolate(cur, [0, 1], [1000, 690]), opacity: prog(fr, Q.seeyou + 0.2, 0.2) * (1 - prog(fr, AUDIO_END + 3, 0.5))}}>
        <path d="M6 4 L6 72 L24 56 L36 84 L48 78 L36 52 L60 52 Z" fill="#fff" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 40, color: '#BBB', letterSpacing: 3, opacity: prog(fr, Q.seeyou, 0.5)}}>
        See you in the next one.
      </div>
    </>
  );
};

export const NOW: SceneDef[] = [
  {from: Q.roadq, C: Problem, tint: '#1E1A2A', glow: '#363048', sfx: [sx(Q.roadq, 'whoosh', 0.1), sx(Q.beforewar, 'pop', 0.08), sx(Q.noalfa + 0.2, 'negative', 0.1), sx(Q.expensive, 'thud', 0.14), sx(Q.engines, 'pop', 0.1), sx(Q.tires, 'pop', 0.1), sx(Q.drivers2, 'pop', 0.1), sx(Q.travel, 'pop', 0.1), sx(Q.season, 'pop', 0.1), sx(Q.engines, 'register', 0.12)]},
  {from: Q.sells, C: Loop, tint: '#2A1E14', glow: '#4E3820', sfx: [sx(Q.sells, 'whoosh', 0.1), sx(Q.sells + 0.3, 'engine_idle', 0.14), sx(Q.customers, 'pops_many', 0.08), sx(Q.customers + 0.3, 'coin', 0.12), sx(Q.backinto, 'coin', 0.12), sx(Q.backinto - 0.2, 'engine_rev', 0.14), sx(Q.reason, 'ding', 0.1)]},
  {from: Q.wherenow, C: Today, tint: '#141A34', glow: '#2A1A2E', sfx: [sx(Q.wherenow, 'whoosh', 0.1), sx(Q.today + 0.3, 'pop', 0.1), sx(Q.division2, 'engine_by', 0.24), sx(Q.everyf1 - 0.2, 'whoosh', 0.1), sx(Q.y1950, 'riser', 0.12), sx(Q.noother, 'boom', 0.16)]},
  {from: Q.notonly, C: McLaren, tint: '#1E1A28', glow: '#40302A', sfx: [sx(Q.mclaren, 'engine_by', 0.2), sx(Q.decades, 'pop', 0.1), sx(Q.common, 'pops_many', 0.1)]},
  {from: Q.but1908, C: Closing, tint: '#2A2238', glow: '#4A3A4A', sfx: [sx(Q.but1908, 'crowd', 0.12), sx(Q.watched - 0.05, 'vintage_by', 0.26), sx(Q.todayteam + 0.35, 'engine_by', 0.32), sx(Q.undername, 'boom', 0.16), sx(Q.undername, 'shimmer', 0.14), sx(Q.dinner29, 'clink', 0.1)]},
  {from: Q.thatsit, C: Outro, tint: '#0B0B10', glow: '#16161E', sfx: [sx(Q.thatsit, 'sting', 0.14), sx(Q.seeyou - 0.2, 'pop', 0.12), sx(Q.seeyou + 1.25, 'click', 0.2), sx(Q.seeyou + 2.0, 'bell', 0.14)]},
];
