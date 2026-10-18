// Copy a few Mochiro face animations into the portfolio, trimmed for the web:
// floats rounded to 1 decimal (sub-pixel at any size we draw) and editor-only
// fields dropped. Usage: node scripts/minify-faces.mjs [path/to/faces]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SRC = process.argv[2] ?? join(homedir(), "Developer/Mochiro/mochiro-web/src/face/faces");
const OUT = new URL("../src/vendor/mochiro-face/faces/", import.meta.url).pathname;
const FACES = ["Default_eyes", "Idle_loop", "Blink", "Happy", "Curios_loop", "Love"];

const r = (n) => Math.round(n * 10) / 10;
mkdirSync(OUT, { recursive: true });
for (const name of FACES) {
  const d = JSON.parse(readFileSync(join(SRC, `${name}.json`), "utf8"));
  const out = {
    canvasWidth: d.canvasWidth,
    canvasHeight: d.canvasHeight,
    playbackSpeed: d.playbackSpeed,
    loopMode: d.loopMode,
    frames: d.frames.map((f) => ({
      time: f.time,
      easing: f.easing,
      layers: f.layers
        .filter((l) => l.visible !== false)
        .map((l) => ({ shapes: l.shapes.map((s) => ({ vertices: s.vertices.map((v) => ({ x: r(v.x), y: r(v.y) })) })) })),
    })),
  };
  const json = JSON.stringify(out);
  writeFileSync(join(OUT, `${name}.json`), json);
  console.log(name.padEnd(14), `${(json.length / 1024).toFixed(1)} KB`);
}
