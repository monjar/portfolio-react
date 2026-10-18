/* SpellTrail: the pointer leaves a fading ribbon of gilded light, throws
   embers when flicked, and casts a small rune ring on click. Fine pointers
   only; the native cursor is never hidden. The loop sleeps when idle. */
import { useEffect, useRef } from "react";
import { useCapabilities } from "../../lib/capabilities";
import { cssColor } from "../ArcaneSky/gl";
import "./SpellTrail.css";

const TRAIL = 26;
const MAX_SPARKS = 48;

interface Pt { x: number; y: number; t: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }
interface Ring { x: number; y: number; t: number }

export default function SpellTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { finePointer, reduced } = useCapabilities();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    let hot = "#ffcf6b";
    let gold = "#c6a14a";
    let dark = false;
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      hot = cs.getPropertyValue("--ember-hot").trim() || hot;
      gold = cs.getPropertyValue("--gold-2").trim() || gold;
      dark = document.documentElement.dataset.palette === "forest";
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

    // pre-rendered glow sprite (cheaper than shadowBlur per stroke)
    const sprite = document.createElement("canvas");
    const paintSprite = () => {
      const [r, g, b] = cssColor(hot).map((c) => Math.round(c * 255));
      sprite.width = sprite.height = 64;
      const s = sprite.getContext("2d")!;
      const grd = s.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, `rgba(255,255,240,1)`);
      grd.addColorStop(0.25, `rgba(${r},${g},${b},.9)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      s.fillStyle = grd;
      s.fillRect(0, 0, 64, 64);
    };
    paintSprite();
    const mo2 = new MutationObserver(paintSprite);
    mo2.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

    const pts: Pt[] = [];
    const sparks: Spark[] = [];
    const rings: Ring[] = [];
    let raf = 0;
    let running = false;
    let lastMove = { x: 0, y: 0, t: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      pts.push({ x: e.clientX, y: e.clientY, t: now });
      if (pts.length > TRAIL) pts.shift();
      const dx = e.clientX - lastMove.x;
      const dy = e.clientY - lastMove.y;
      const speed = Math.hypot(dx, dy) / Math.max(1, now - lastMove.t);
      if (speed > 1.2 && sparks.length < MAX_SPARKS) {
        const n = Math.min(3, Math.floor(speed));
        for (let i = 0; i < n; i++) {
          const life = 500 + Math.random() * 500;
          sparks.push({
            x: e.clientX,
            y: e.clientY,
            vx: -dx * 0.02 + (Math.random() - 0.5) * 1.2,
            vy: -dy * 0.02 - Math.random() * 1.2,
            life,
            max: life,
            r: 3 + Math.random() * 5,
          });
        }
      }
      lastMove = { x: e.clientX, y: e.clientY, t: now };
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rings.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      wake();
    };

    function wake() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(48, now - last);
      last = now;
      ctx!.clearRect(0, 0, innerWidth, innerHeight);
      ctx!.globalCompositeOperation = dark ? "lighter" : "source-over";

      // ribbon: tapered quadratic strokes through recent points
      while (pts.length && now - pts[0].t > 420) pts.shift();
      if (pts.length > 2) {
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        for (let i = 1; i < pts.length - 1; i++) {
          const a = pts[i - 1], b = pts[i], c = pts[i + 1];
          const age = 1 - (now - b.t) / 420;
          const k = i / pts.length;
          ctx!.strokeStyle = gold;
          ctx!.globalAlpha = Math.max(0, age * k * (dark ? 0.9 : 0.75));
          ctx!.lineWidth = 0.5 + k * 3.2;
          ctx!.beginPath();
          ctx!.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
          ctx!.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
          ctx!.stroke();
        }
        const head = pts[pts.length - 1];
        const ha = Math.max(0, 1 - (now - head.t) / 420);
        ctx!.globalAlpha = ha * 0.8;
        ctx!.drawImage(sprite, head.x - 14, head.y - 14, 28, 28);
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy -= 0.004 * dt; // embers float up
        s.vx *= 0.985;
        s.x += s.vx * dt * 0.06;
        s.y += s.vy * dt * 0.06;
        const k = s.life / s.max;
        ctx!.globalAlpha = k;
        const r = s.r * (0.4 + k * 0.6);
        ctx!.drawImage(sprite, s.x - r, s.y - r, r * 2, r * 2);
      }

      // rune rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        const p = (now - g.t) / 650;
        if (p >= 1) {
          rings.splice(i, 1);
          continue;
        }
        const e = 1 - Math.pow(1 - p, 3);
        const R = 8 + e * 34;
        ctx!.globalAlpha = (1 - p) * 0.9;
        ctx!.strokeStyle = gold;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, R, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, R * 0.72, p * 2, p * 2 + Math.PI * 1.6);
        ctx!.stroke();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + p * 1.5;
          ctx!.beginPath();
          ctx!.moveTo(g.x + Math.cos(a) * R * 0.78, g.y + Math.sin(a) * R * 0.78);
          ctx!.lineTo(g.x + Math.cos(a) * R * 0.94, g.y + Math.sin(a) * R * 0.94);
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;

      if (pts.length > 1 || sparks.length || rings.length) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx!.clearRect(0, 0, innerWidth, innerHeight);
        running = false;
      }
    }

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      mo.disconnect();
      mo2.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={ref} className="spell-trail" aria-hidden="true" />;
}
