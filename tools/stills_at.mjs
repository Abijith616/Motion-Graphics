// Render stills at specific times: node tools/stills_at.mjs <outDir> t1 t2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id: 'ScuderiaFerrari', puppeteerInstance: browser});
for (const t of times) {
  const fr = Math.round(Number(t) * 30);
  await renderStill({serveUrl, composition, frame: fr, output: path.join(outDir, `t${Number(t).toFixed(2).padStart(7, '0')}.jpg`), imageFormat: 'jpeg', scale: 0.4, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log('done');
