/**
 * MochiroFace (web): the live, emotion-driven face, ported from the mobile
 * app's Skia renderer to a plain Canvas 2D element. Same playback model:
 *   - keyframe times are in SECONDS; playback advances by real elapsed time ×
 *     `playbackSpeed`, interpolating each segment with the destination
 *     keyframe's easing (`sampleAnimation`).
 *   - `loopMode: 'loop'` replays forever; `'once'` plays through then holds
 *     the final frame.
 *   - switching expression morphs from the current shapes to the new face over
 *     a short transition (cross-expression interpolation).
 *   - the eyes blink by morphing toward the closed-lid pose of the Blink
 *     animation, in place, so a blink never resets the expression. Blinks come
 *     at random intervals, or on cue via `blinkNonce` when a script wants one.
 *
 * Drawing happens imperatively inside requestAnimationFrame; React state is
 * not touched per frame.
 */
import { useEffect, useRef, type CSSProperties } from "react";
import {
  sampleAnimation,
  playbackTime,
  blendShapes,
  frameShapes,
  type FaceShape,
} from "./face";
import { faceForEmotion, FACE_BLINK } from "./faceAssets";

const TRANSITION_MS = 480; // cross-expression morph duration
const BLINK_MIN_MS = 2600;
const BLINK_VARY_MS = 3200;

// Blink as a close→reopen envelope (seconds), applied to whatever the eyes are
// currently doing.
const BLINK_CLOSE_S = 0.1;
const BLINK_HOLD_S = 0.03;
const BLINK_OPEN_S = 0.13;
const BLINK_DUR_MS = (BLINK_CLOSE_S + BLINK_HOLD_S + BLINK_OPEN_S) * 1000;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** 0 (open) → 1 (closed) → 0 (open) over a blink. */
function blinkEnvelope(bt: number): number {
  if (bt <= 0) return 0;
  if (bt < BLINK_CLOSE_S) return bt / BLINK_CLOSE_S;
  if (bt < BLINK_CLOSE_S + BLINK_HOLD_S) return 1;
  const o = bt - BLINK_CLOSE_S - BLINK_HOLD_S;
  return o < BLINK_OPEN_S ? 1 - o / BLINK_OPEN_S : 0;
}

/** The flattest blink frame = the closed-lid target we morph toward. */
const CLOSED_LIDS: FaceShape[] = (() => {
  let best = FACE_BLINK.frames[0]!;
  let bestH = Infinity;
  for (const f of FACE_BLINK.frames) {
    let h = 0;
    for (const s of frameShapes(f)) {
      const ys = s.vertices.map((v) => v.y);
      h = Math.max(h, Math.max(...ys) - Math.min(...ys));
    }
    if (h < bestH) {
      bestH = h;
      best = f;
    }
  }
  return frameShapes(best);
})();

/** Centre of one shape's vertices. */
function eyeCentroid(s: FaceShape): { x: number; y: number } {
  let x = 0,
    y = 0;
  for (const v of s.vertices) {
    x += v.x;
    y += v.y;
  }
  const n = s.vertices.length || 1;
  return { x: x / n, y: y / n };
}

/** Move the closed-lid eyes onto the current eyes so the blink closes in place. */
function alignClosed(base: FaceShape[], closed: FaceShape[]): FaceShape[] {
  const n = Math.min(base.length, closed.length);
  return closed.map((cs, i) => {
    if (i >= n) return cs;
    const b = eyeCentroid(base[i]!);
    const c = eyeCentroid(cs);
    const dx = b.x - c.x;
    const dy = b.y - c.y;
    return { ...cs, vertices: cs.vertices.map((v) => ({ x: v.x + dx, y: v.y + dy })) };
  });
}

/** Build a centred, scaled Path2D from a polygon's vertices (closed). */
function shapeToPath(shape: FaceShape, cx: number, cy: number, scale: number): Path2D {
  const p = new Path2D();
  const verts = shape.vertices;
  if (verts.length === 0) return p;
  p.moveTo(cx + verts[0]!.x * scale, cy + verts[0]!.y * scale);
  for (let i = 1; i < verts.length; i++) {
    p.lineTo(cx + verts[i]!.x * scale, cy + verts[i]!.y * scale);
  }
  p.closePath();
  return p;
}

/**
 * Draw one frame of face shapes. Mirrors the Skia FaceShapesCanvas: two soft
 * glow passes (canvas shadows standing in for Skia's BlurMask) under a solid
 * fill, all in the face's 800×600 authoring space scaled to fit.
 */
function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: FaceShape[],
  w: number,
  h: number,
  color: string,
  bloom: number,
  authorW: number,
  authorH: number,
) {
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / authorW, h / authorH);
  const cx = w / 2;
  const cy = h / 2;
  const paths = shapes.map((s) => shapeToPath(s, cx, cy, scale));

  if (bloom > 0.001) {
    // Wide soft halo, then a tighter brighter core. Canvas shadowBlur spreads
    // roughly half as far as Skia's BlurMask sigma at the same value, so the
    // radii are doubled to keep the glow as bright as the app's.
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.globalAlpha = clamp01(0.45 * bloom);
    ctx.shadowBlur = (40 + 30 * bloom) * 2 * scale;
    for (const p of paths) ctx.fill(p);
    ctx.globalAlpha = clamp01(0.8 * bloom);
    ctx.shadowBlur = (16 + 12 * bloom) * 2 * scale;
    for (const p of paths) ctx.fill(p);
    ctx.restore();
  }

  ctx.fillStyle = color;
  for (const p of paths) ctx.fill(p);
}

export interface MochiroFaceProps {
  /** Emotion name (see faceAssets); unknown values fall back to neutral eyes. */
  emotion?: string;
  /** Eye colour: any canvas-compatible CSS color string. */
  color: string;
  /** Glow around the eyes (0 = off … 1 = bright). */
  bloom?: number;
  /** Ambient blinking. Turn it off while the eyes are meant to stay shut. */
  autoBlink?: boolean;
  /** Change this value to make Mochiro blink right now (a scripted beat). */
  blinkNonce?: number;
  className?: string;
  style?: CSSProperties;
}

export function MochiroFace({
  emotion = "neutral",
  color,
  bloom = 0.6,
  autoBlink = true,
  blinkNonce = 0,
  className,
  style,
}: MochiroFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Latest props, readable from inside the persistent rAF loop.
  const emotionProp = useRef(emotion);
  emotionProp.current = emotion;
  const colorProp = useRef(color);
  colorProp.current = color;
  const bloomProp = useRef(bloom);
  bloomProp.current = bloom;
  const autoBlinkProp = useRef(autoBlink);
  autoBlinkProp.current = autoBlink;
  const blinkNonceProp = useRef(blinkNonce);
  blinkNonceProp.current = blinkNonce;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Animation clocks / transition state (mutated by the rAF loop).
    let currentEmotion: string | null = null;
    let docStart = performance.now();
    let lastShapes: FaceShape[] | null = null;
    let fromShapes: FaceShape[] | null = null;
    let transStart: number | null = null;

    // Blink state, driven off the render clock: `blinkStart` opens an envelope
    // that closes itself, so a blink needs no timer to end it.
    const blinkGap = () => BLINK_MIN_MS + Math.random() * BLINK_VARY_MS;
    let blinkStart = -Infinity;
    let nextBlinkAt = performance.now() + blinkGap();
    let lastNonce = blinkNonceProp.current;

    let cssW = 0;
    let cssH = 0;

    const renderNow = () => {
      const t = performance.now();
      const emotionNow = emotionProp.current;

      // Expression change: capture the previously-rendered shapes as the
      // transition source and restart the animation clock.
      if (currentEmotion !== emotionNow) {
        if (currentEmotion !== null && lastShapes) {
          fromShapes = lastShapes;
          transStart = t;
        }
        currentEmotion = emotionNow;
        docStart = t;
      }

      // 1) Base expression shapes at the current clock time, with the
      //    cross-expression transition morph layered on when switching.
      const doc = faceForEmotion(emotionNow);
      const sampleT = playbackTime(doc, (t - docStart) / 1000);
      let base = sampleAnimation(doc.frames, sampleT);
      if (transStart !== null && fromShapes) {
        const alpha = clamp01((t - transStart) / TRANSITION_MS);
        if (alpha >= 1) {
          transStart = null;
          fromShapes = null;
        } else {
          base = blendShapes(fromShapes, base, alpha, "easeInOutCubic");
        }
      }

      // 2) Blink overlay: close & reopen the CURRENT eyes in place. A scripted
      //    blink (nonce bump) fires immediately; otherwise they come at random
      //    intervals, held off entirely while `autoBlink` is false.
      const nonce = blinkNonceProp.current;
      if (nonce !== lastNonce) {
        lastNonce = nonce;
        blinkStart = t;
        nextBlinkAt = t + BLINK_DUR_MS + blinkGap();
      } else if (!autoBlinkProp.current) {
        if (nextBlinkAt < t + BLINK_MIN_MS) nextBlinkAt = t + blinkGap();
      } else if (t >= nextBlinkAt) {
        blinkStart = t;
        nextBlinkAt = t + BLINK_DUR_MS + blinkGap();
      }

      let shapes = base;
      const e = blinkEnvelope((t - blinkStart) / 1000);
      if (e > 0) shapes = blendShapes(base, alignClosed(base, CLOSED_LIDS), e, "easeInOutCubic");
      lastShapes = shapes;

      drawShapes(
        ctx,
        shapes,
        cssW,
        cssH,
        colorProp.current,
        bloomProp.current,
        doc.canvasWidth ?? 800,
        doc.canvasHeight ?? 600,
      );
    };

    // Keep the bitmap matched to the displayed size (and device pixel ratio).
    // Repaint synchronously after resizing: setting canvas.width blanks the
    // bitmap, and during a CSS size transition the ResizeObserver fires after
    // this frame's rAF draw, so waiting for the next tick would present a black
    // canvas for every frame of the transition.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderNow();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      renderNow();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
