import {Q} from '../cues';
import {SceneDef} from '../scene';
import {BOY} from './s1_boy';
import {HORSE} from './s2_horse';
import {DINNER} from './s3_dinner';
import {Y1933} from './s4_1933';
import {LOSING} from './s5_losing';
import {NONAME} from './s6_noname';
import {Y1947} from './s7_1947';
import {NOW} from './s8_now';

export const SCENES: SceneDef[] = [...BOY, ...HORSE, ...DINNER, ...Y1933, ...LOSING, ...NONAME, ...Y1947, ...NOW];

export const CHAPTERS: {at: number; num: string; title: string}[] = [
  {at: Q.y1908 + 0.2, num: '01', title: 'The boy'},
  {at: Q.becomes + 0.1, num: '02', title: 'The horse'},
  {at: Q.by1929 + 0.1, num: '03', title: 'The dinner'},
  {at: Q.runsout + 0.1, num: '04', title: '1933'},
  {at: Q.last + 0.1, num: '05', title: 'Losing it'},
  {at: Q.whatdo + 0.1, num: '06', title: 'The car without a name'},
  {at: Q.mar12 + 0.1, num: '07', title: '1947'},
  {at: Q.roadq + 0.1, num: '08', title: 'The road cars'},
  {at: Q.wherenow + 0.1, num: '09', title: 'Where is it now'},
];
