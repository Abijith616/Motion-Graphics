import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, interpolateColors, staticFile, useVideoConfig} from 'remotion';
import {useCurrentFrame} from './frame';
import {Stage} from './components/Base';
import {Horse, PartyHQ} from './components/Ferrari';
import {AUDIO_END, Q} from './cues';
import {f, pop, prog} from './lib';
import {SceneDef} from './scene';
import {C, body, head} from './theme';
import {CHAPTERS, SCENES} from './scenes';
import {COLD_END, ColdOpen} from './scenes/s0_coldopen';
import {COLD_SFX} from './scenes/sfx_cold';

const TAIL = 4.5; // seconds after the last word (outro + subscribe)
export const DURATION_SEC = AUDIO_END + TAIL;

const ChapterTag: React.FC<{at: number; num: string; title: string}> = ({at, num, title}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 0.6);
  const e = prog(frame, at + 3.6, 0.5);
  if (frame < f(at) || frame > f(at + 4.2)) return null;
  return (
    <div style={{position: 'absolute', left: 80, top: 70, display: 'flex', alignItems: 'center', gap: 22, opacity: p * (1 - e), transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{fontFamily: head, fontWeight: 700, fontSize: 64, color: C.red, lineHeight: 1}}>{num}</div>
      <div style={{width: 4, height: 60 * p, background: C.yellow, borderRadius: 2}} />
      <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.ink, textTransform: 'uppercase'}}>{title}</div>
    </div>
  );
};

/** Little pinned polaroids for the script's "remember this" callbacks. */
const MemoryNote: React.FC<{from: number; to: number; slot: number; label: string; children: React.ReactNode}> = ({from, to, slot, label, children}) => {
  const frame = useCurrentFrame();
  if (frame < f(from) || frame > f(to + 0.6)) return null;
  const p = pop(frame, from + 0.5, 12);
  const fly = prog(frame, from, 0.9); // fly from screen centre to the corner
  const e = prog(frame, to, 0.5);
  const x = interpolate(fly, [0, 1], [960, 1830 - slot * 115]);
  const y = interpolate(fly, [0, 1], [540, 105]);
  const s = interpolate(fly, [0, 1], [2.2, 0.66]) * p * (1 + e * 1.4);
  return (
    <div style={{position: 'absolute', left: x - 70, top: y - 85, width: 140, height: 170, transform: `scale(${s}) rotate(${slot ? 5 : -6}deg)`, opacity: Math.min(1, p * 1.4) * (1 - e)}}>
      <div style={{width: 140, height: 170, background: '#F6F1E4', borderRadius: 8, boxShadow: '0 12px 30px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12}}>
        <div style={{width: 116, height: 110, background: '#E3D9C1', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{children}</div>
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 15, color: '#3A2A1E', marginTop: 10, letterSpacing: 1}}>{label}</div>
      </div>
      <div style={{position: 'absolute', left: 58, top: -10, width: 24, height: 24, borderRadius: 12, background: C.red, boxShadow: '0 3px 6px rgba(0,0,0,0.4)'}} />
    </div>
  );
};

const SceneLayer: React.FC<{def: SceneDef; to: number}> = ({def, to}) => {
  const frame = useCurrentFrame();
  const inP = prog(frame, def.from, 0.5);
  const outP = prog(frame, to, 0.45);
  const drift = interpolate(frame, [f(def.from), f(to)], [1, 1.025], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = (0.965 + 0.035 * inP) * drift * (1 + outP * 0.05);
  return (
    <AbsoluteFill style={{opacity: Math.min(inP, 1 - outP), transform: `scale(${scale})`}}>
      <def.C />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (SCENES[i].from <= t) idx = i;
  const cur = SCENES[idx];
  const prev = SCENES[Math.max(0, idx - 1)];
  const k = prog(frame, cur.from, 0.8);
  const tint = interpolateColors(k, [0, 1], [prev.tint ?? C.bg2, cur.tint ?? C.bg2]);
  const glow = interpolateColors(k, [0, 1], [prev.glow ?? C.bg3, cur.glow ?? C.bg3]);
  const total = f(DURATION_SEC);
  const {fps} = useVideoConfig();
  const rf = (sec: number) => Math.round(sec * fps); // seconds → render frames
  const totalR = rf(DURATION_SEC);
  const main = f(COLD_END);

  return (
    <AbsoluteFill style={{background: C.bg0}}>
      {frame < main ? (
        <ColdOpen />
      ) : (
        <Stage tint={tint} glow={glow}>
          {SCENES.map((s, i) => {
            const to = i + 1 < SCENES.length ? SCENES[i + 1].from : DURATION_SEC + 1;
            const a = f(s.from) - 1;
            const b = f(to) + 16;
            return frame >= a && frame <= b ? <SceneLayer key={i} def={s} to={to} /> : null;
          })}
          {CHAPTERS.map((c) => (
            <ChapterTag key={c.num} {...c} />
          ))}
          <MemoryNote from={Q.hold} to={Q.getshorse} slot={0} label="THE HORSE">
            <Horse size={74} color="#111" />
          </MemoryNote>
          <MemoryNote from={Q.keep} to={Q.remember} slot={1} label="THE DINNER">
            <PartyHQ size={110} />
          </MemoryNote>
        </Stage>
      )}

      <Html5Audio src={staticFile('voiceover.mp3')} volume={1} />
      <Html5Audio src={staticFile('music.flac')} volume={(fr) => interpolate(fr, [0, rf(0.5), totalR - rf(3), totalR], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {[...COLD_SFX, ...SCENES.flatMap((s) => s.sfx ?? [])].map((x, i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, rf(x.t))} durationInFrames={rf(4)} layout="none">
          <Html5Audio src={staticFile(`sfx/${x.s}.wav`)} volume={x.v ?? 0.18} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
