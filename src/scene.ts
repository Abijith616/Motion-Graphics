import React from 'react';

/** A sound effect: time (seconds), file name in public/sfx, volume. */
export type Sfx = {t: number; s: string; v?: number};

export type SceneDef = {
  from: number;
  C: React.FC;
  sfx?: Sfx[];
  tint?: string;
  glow?: string;
};

export const sx = (t: number, s: string, v = 0.18): Sfx => ({t, s, v});
