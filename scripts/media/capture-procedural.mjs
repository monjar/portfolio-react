#!/usr/bin/env node
// Capture screenshots + short recordings of the live Procedural Animation Studies
// gallery (https://monjar.dev/Advanced-Procedural-Animations-Study/).
//
// Usage:
//   PLAYWRIGHT_DIR=/path/with/node_modules/playwright \
//   node scripts/media/capture-procedural.mjs --raw <scratch dir> --media <public/media/procedural-animations>
//     [--skip-shots] [--skip-videos] [--force]
//
// Writes:
//   <raw>/study-NN.png            1600x900 screenshots (write-up panel hidden)
//   <raw>/videos/<name>.webm      ~10 s 1280x720 recordings (all UI hidden)
//   <raw>/videos/manifest.json    { name: { file, start } } start = seconds of load to skip
//   <media>/studies.json          [{ n, title, url }]
//
// WebGL: headless Chromium on macOS renders through ANGLE/Metal on the real GPU
// with --use-angle=metal (SwiftShader only manages ~8 fps).

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const flag = (k) => argv.includes(k);

const HOME = os.homedir();
const RAW = arg('--raw', path.join(process.env.SCRATCH || os.tmpdir(), 'procedural'));
const MEDIA = arg('--media', path.join(HOME, 'Developer/portfolio-react/public/media/procedural-animations'));
const FORCE = flag('--force');
const INDEX = 'https://monjar.dev/Advanced-Procedural-Animations-Study/';

// Studies to record: output name -> study number
const VIDEOS = { hexapod: 5, quadruped: 6, boids: 11, creatures: 12 };

async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  const dir = process.env.PLAYWRIGHT_DIR;
  if (!dir) throw new Error('playwright not resolvable; set PLAYWRIGHT_DIR to a dir containing node_modules/playwright');
  return createRequire(path.join(dir, 'package.json'))('playwright');
}

const HIDE_WRITEUP = '.writeup{display:none!important}';
const HIDE_ALL_UI = '.writeup,.demo-header,.controls,.hint{display:none!important}';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { chromium } = await loadPlaywright();
fs.mkdirSync(path.join(RAW, 'videos'), { recursive: true });
fs.mkdirSync(MEDIA, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'],
});

// 1. Discover studies from the index cards.
const idx = await browser.newPage();
await idx.goto(INDEX, { waitUntil: 'networkidle' });
const studies = await idx.$$eval('a.card', (cards) =>
  cards.map((a) => ({
    n: parseInt(a.querySelector('.num')?.textContent ?? '0', 10),
    title: a.querySelector('h3')?.textContent.trim() ?? '',
    url: a.href,
  })).filter((s) => s.n > 0),
);
await idx.close();
studies.sort((a, b) => a.n - b.n);
fs.writeFileSync(path.join(MEDIA, 'studies.json'), JSON.stringify(studies, null, 2) + '\n');
console.log(`found ${studies.length} studies`);

const nn = (n) => String(n).padStart(2, '0');

// Study 12 bug workaround: its creature InstancedMesh keeps the bounding sphere
// computed at the origin, so three.js frustum-culls the creature as soon as the
// follow-camera moves away (only its shadow remains). For capture only, patch
// the bundle on the fly to set frustumCulled=false on that mesh.
async function patchCreatures(ctx) {
  await ctx.route(/\/assets\/12-evolved-creatures-[^/]+\.js$/, async (route) => {
    const res = await route.fetch();
    let body = await res.text();
    const patched = body.replace(
      /(\b[\w$]+)\.castShadow=!0,\1\.receiveShadow=!0,\1\.count=0/,
      '$1.frustumCulled=!1,$&',
    );
    if (patched === body) console.warn('creatures patch did not apply');
    await route.fulfill({ response: res, body: patched });
  });
}

// 2. Screenshots at 1600x900.
if (!flag('--skip-shots')) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await patchCreatures(ctx);
  for (const s of studies) {
    const out = path.join(RAW, `study-${nn(s.n)}.png`);
    if (!FORCE && fs.existsSync(out)) { console.log(`skip ${out}`); continue; }
    const page = await ctx.newPage();
    await page.goto(s.url, { waitUntil: 'load' });
    await page.addStyleTag({ content: HIDE_WRITEUP });
    await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(5000); // let the simulation settle
    await page.screenshot({ path: out });
    console.log(`shot ${s.n} ${s.title}`);
    await page.close();
  }
  await ctx.close();
}

// 3. Recordings at 1280x720 (UI hidden). Playwright records from context
// creation, so we note when the scene was ready and skip that much later.
if (!flag('--skip-videos')) {
  const manifestPath = path.join(RAW, 'videos', 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  for (const [name, n] of Object.entries(VIDEOS)) {
    const s = studies.find((x) => x.n === n);
    if (!s) { console.warn(`no study ${n} for ${name}`); continue; }
    if (!FORCE && manifest[name] && fs.existsSync(manifest[name].file)) { console.log(`skip video ${name}`); continue; }
    const dir = path.join(RAW, 'videos', name);
    fs.rmSync(dir, { recursive: true, force: true });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir, size: { width: 1280, height: 720 } },
    });
    await patchCreatures(ctx);
    const t0 = Date.now();
    const page = await ctx.newPage();
    await page.goto(s.url, { waitUntil: 'load' });
    await page.addStyleTag({ content: HIDE_ALL_UI });
    await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(2000); // skip the first ~2 s after load
    const start = (Date.now() - t0) / 1000;
    await sleep(10000);
    const video = page.video();
    await ctx.close();
    const src = await video.path();
    const file = path.join(RAW, 'videos', `${name}.webm`);
    fs.renameSync(src, file);
    fs.rmSync(dir, { recursive: true, force: true });
    manifest[name] = { file, start: Math.round(start * 10) / 10, study: n, title: s.title };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`video ${name} start=${start.toFixed(1)}s`);
  }
}

await browser.close();
