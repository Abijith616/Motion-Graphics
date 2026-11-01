// Bundle once, render many stills for review: node tools/stills.mjs <outDir> <stepSec> [startSec] [endSec]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, step = '4', start = '0', end = '1e9'] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id: 'ScuderiaFerrari', puppeteerInstance: browser});
const last = Math.min(composition.durationInFrames - 1, Math.round(Number(end) * composition.fps));
for (let fr = Math.round(Number(start) * composition.fps); fr <= last; fr += Math.round(Number(step) * composition.fps)) {
  await renderStill({serveUrl, composition, frame: fr, output: path.join(outDir, `f${String(fr).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', scale: 0.5, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log('done');
