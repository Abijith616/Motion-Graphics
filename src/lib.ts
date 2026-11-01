import {Easing, interpolate, spring} from 'remotion';
import {ANIM_FPS} from './theme';

/** Seconds → animation frames (30-fps units, see src/frame.ts). */
export const f = (sec: number) => Math.round(sec * ANIM_FPS);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 eased progress between two times (seconds), given the current frame. */
export const prog = (frame: number, startSec: number, durSec = 0.6, ease = Easing.bezier(0.33, 0, 0.2, 1)) =>
  interpolate(frame, [f(startSec), f(startSec) + Math.max(1, f(durSec))], [0, 1], {...clamp, easing: ease});

/** Springy 0→1 (overshoots slightly) starting at a time in seconds. */
export const pop = (frame: number, startSec: number, damping = 12, mass = 0.6) =>
  spring({frame: frame - f(startSec), fps: ANIM_FPS, config: {damping, mass, stiffness: 120}});

/** Fade in at `a`, fade out at `b` (seconds). */
export const life = (frame: number, a: number, b = 1e6, fin = 0.4, fout = 0.4) =>
  Math.min(prog(frame, a, fin), 1 - prog(frame, b - fout, fout));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const range = (frame: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [f(a), f(b)], [from, to], {...clamp, easing: ease});

/** Gentle idle float for living illustrations. */
export const bob = (frame: number, amp = 6, speed = 1, phase = 0) => Math.sin((frame / ANIM_FPS) * speed * 2 + phase) * amp;
