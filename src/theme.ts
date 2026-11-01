import {loadFont as loadNunito} from '@remotion/google-fonts/Nunito';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';

export const body = loadNunito('normal', {weights: ['600', '800', '900'], subsets: ['latin']}).fontFamily;
export const head = loadOswald('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
/** Elegant Italian serif for years, names and chapter titles. */
export const serif = loadPlayfair('normal', {weights: ['700', '900'], subsets: ['latin']}).fontFamily;
export const serifItalic = loadPlayfair('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;

// Deep night-navy base (channel look) with Ferrari's rosso corsa, Modena yellow and the Italian tricolore.
export const C = {
  bg0: '#080B18',
  bg1: '#10162D',
  bg2: '#1A2344',
  bg3: '#26325C',
  ink: '#F5F1E8',
  muted: '#A4AECB',
  dim: '#525D86',
  cyan: '#33CCFF',
  cyanDeep: '#1A8FC4',
  blue: '#3D6BF2',
  blueDeep: '#2443A8',
  red: '#E8202A',
  redDeep: '#9E0F17',
  rosso: '#D40000',
  yellow: '#FFD80A',
  yellowDeep: '#D9A400',
  gold: '#FFD45C',
  goldDeep: '#D9A92B',
  green: '#0E9A48',
  greenDeep: '#08672F',
  mint: '#3EDB9B',
  mintDeep: '#1F9E6D',
  purple: '#9A7BFF',
  purpleDeep: '#6447D1',
  pink: '#FF6B9E',
  silver: '#CDD5E0',
  silverDeep: '#8691A6',
  paper: '#F2EAD6',
  paperDeep: '#D8CCAE',
  wood: '#8A5A34',
  woodDeep: '#5E3B20',
  sepia: '#3A2A1E',
  white: '#FFFFFF',
  skin: '#F3CDB0',
  skin2: '#E3AE8A',
};

/** Render frame rate (what the composition outputs). */
export const FPS = 60;
/** Animation clock: all scene timing is written in 30-fps units; at 60 fps it advances in half-steps. */
export const ANIM_FPS = 30;
export const W = 1920;
export const H = 1080;
