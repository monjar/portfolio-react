/* ArcaneSky: the hero's WebGL2 sky (nebula, embers, rune circle).
   The CSS gradient underneath is the real background; the canvas fades in on
   top once the shader is ready, so no WebGL2, a lost context or reduced motion
   all degrade to a still, perfectly good parchment sky. */
import { useEffect, useRef } from "react";
import { useCapabilities } from "../../lib/capabilities";
import { createFullscreenProgram, cssColor } from "./gl";
import FRAG from "./sky.frag.glsl?raw";
import "./ArcaneSky.css";

type Vec3 = [number, number, number];
const PALETTE_VARS = {
  uDeep: "--sky-0",
  uMid: "--sky-mid",
  uHi: "--sky-hi",
  uEmberHot: "--ember-hot",
  uEmberMid: "--ember-mid",
  uGold: "--gold-2",
  uArcane: "--arcane",
} as const;
type PaletteKey = keyof typeof PALETTE_VARS;

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const out = {} as Record<PaletteKey, Vec3>;
  for (const [u, v] of Object.entries(PALETTE_VARS)) out[u as PaletteKey] = cssColor(cs.getPropertyValue(v));
  return { colors: out, dark: document.documentElement.dataset.palette === "forest" ? 1 : 0 };
}

interface Props {
  /** Render one frame and stop (e.g. the 404 page). */
  still?: boolean;
  className?: string;
}

export default function ArcaneSky({ still = false, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const caps = useCapabilities();
  const frozen = still || caps.reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !caps.webgl2) return;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const start = () => {
      if (disposed) return;
      const prog = createFullscreenProgram(canvas, FRAG);
      if (!prog) return;
      const { gl, uniform, draw } = prog;

      // quality: mobile / low-power devices draw fewer octaves at lower res
      const cheap = caps.narrow || caps.lowPower;
      let renderScale = cheap ? 0.5 : 0.75;
      const dprCap = cheap ? 1 : 1.5;
      gl.uniform1i(uniform("uOctaves"), cheap ? 4 : 5);
      gl.uniform1i(uniform("uEmberLayers"), cheap ? 2 : 4);

      // palette, eased toward its target so theme switches cross-fade
      let pal = readPalette();
      let target = pal;
      let palT = 1;
      const setPalette = (mix: number) => {
        for (const key of Object.keys(PALETTE_VARS) as PaletteKey[]) {
          const a = pal.colors[key];
          const b = target.colors[key];
          gl.uniform3f(
            uniform(key),
            a[0] + (b[0] - a[0]) * mix,
            a[1] + (b[1] - a[1]) * mix,
            a[2] + (b[2] - a[2]) * mix
          );
        }
        gl.uniform1f(uniform("uDark"), pal.dark + (target.dark - pal.dark) * mix);
      };
      setPalette(1);
      const onPalette = () => {
        // freeze the current blend as the new origin, then ease to the target
        pal = target;
        target = readPalette();
        palT = 0;
        if (frozen) {
          palT = 1;
          pal = target;
          setPalette(1);
          frame(performance.now());
        }
      };
      const mo = new MutationObserver(onPalette);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

      // size
      let w = 0;
      let h = 0;
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * renderScale;
        w = Math.max(1, Math.round(rect.width * dpr));
        h = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
          gl.uniform2f(uniform("uRes"), w, h);
        }
      };
      resize();
      const ro = new ResizeObserver(() => {
        resize();
        if (frozen) frame(performance.now());
      });
      ro.observe(canvas);

      // pointer, eased
      const ptr = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6, on: 0, ton: 0 };
      const onMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        ptr.tx = (e.clientX - rect.left) / rect.width;
        ptr.ty = 1 - (e.clientY - rect.top) / rect.height;
        ptr.ton = e.pointerType === "mouse" ? 1 : 0.6;
      };
      const onLeave = () => (ptr.ton = 0);
      if (!frozen) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }

      // visibility: stop drawing offscreen or in a background tab
      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !frozen) loop();
      });
      io.observe(canvas);
      const onVis = () => !document.hidden && visible && !frozen && loop();
      document.addEventListener("visibilitychange", onVis);

      // adaptive quality: if frames run long, drop resolution once or twice
      let slow = 0;
      let last = performance.now();
      const t0 = last - 18_000 * Math.random();
      const frameCap = caps.narrow ? 1000 / 30 : 0;

      function frame(now: number) {
        const dt = now - last;
        last = now;
        ptr.x += (ptr.tx - ptr.x) * 0.06;
        ptr.y += (ptr.ty - ptr.y) * 0.06;
        ptr.on += (ptr.ton - ptr.on) * 0.04;
        if (palT < 1) {
          palT = Math.min(1, palT + dt / 700);
          setPalette(palT);
          if (palT === 1) pal = target;
        }
        const heroH = canvas!.parentElement?.offsetHeight || window.innerHeight;
        gl.uniform1f(uniform("uTime"), frozen ? 42 : (now - t0) / 1000);
        gl.uniform2f(uniform("uPointer"), ptr.x * w, ptr.y * h);
        gl.uniform1f(uniform("uPointerOn"), frozen ? 0 : ptr.on);
        gl.uniform1f(uniform("uScroll"), Math.min(1, Math.max(0, window.scrollY / heroH)));
        draw();
        if (!canvas!.classList.contains("on")) canvas!.classList.add("on");

        if (!frozen && dt > 26 && dt < 200 && ++slow > 45 && renderScale > 0.4) {
          renderScale *= 0.75;
          slow = 0;
          resize();
        } else if (dt <= 20) {
          slow = Math.max(0, slow - 1);
        }
      }

      let running = false;
      let lastDraw = 0;
      function loop() {
        if (running) return;
        running = true;
        const tick = (now: number) => {
          if (disposed || !visible || document.hidden) {
            running = false;
            return;
          }
          raf = requestAnimationFrame(tick);
          if (frameCap && now - lastDraw < frameCap) return;
          lastDraw = now;
          frame(now);
        };
        raf = requestAnimationFrame(tick);
      }

      const onLost = (e: Event) => {
        e.preventDefault();
        canvas.classList.remove("on");
        cancelAnimationFrame(raf);
        running = false;
      };
      canvas.addEventListener("webglcontextlost", onLost);

      if (frozen) frame(performance.now());
      else loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        mo.disconnect();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVis);
        canvas.removeEventListener("webglcontextlost", onLost);
        prog.dispose();
      };
    };

    // let the page paint (and the LCP text land) before compiling shaders
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const idle = ric(start, { timeout: 600 });

    return () => {
      disposed = true;
      cic(idle);
      cleanup();
    };
  }, [caps.webgl2, caps.narrow, caps.lowPower, frozen]);

  return (
    <div className={`arcane-sky ${className}`} aria-hidden="true">
      <div className="arcane-sky__fallback" />
      <canvas ref={canvasRef} className="arcane-sky__canvas" />
    </div>
  );
}
