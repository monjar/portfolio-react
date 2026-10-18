/**
 * Face loader + vertex morphing: the renderer-agnostic core for the Skia
 * `FaceRenderer`. Parses the `data/faces/*.json` vector format (verbatim from
 * the Python app) and interpolates polygon vertices between keyframes using the
 * destination keyframe's easing (mirrors the C++ `interpolateVertices*`).
 *
 * The actual drawing (Skia `Path.MakeFromCmds`) lives in the RN component; this
 * module is the pure math, fully unit-tested.
 */

import { bezierEase01, easingFromName } from './easing';

export interface Vertex {
  x: number;
  y: number;
}

export interface FaceShape {
  id?: string;
  type?: string;
  vertices: Vertex[];
}

export interface FaceLayer {
  id?: string;
  name?: string;
  visible?: boolean;
  shapes: FaceShape[];
}

export interface FaceFrame {
  id?: string;
  time: number;
  easing?: string;
  layers: FaceLayer[];
}

export interface FaceDocument {
  version?: number;
  type?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  frames: FaceFrame[];
  /** Authoring frame rate (informational; playback is dt-driven). */
  fps?: number;
  /** Time scale applied to playback (frame times are in SECONDS). */
  playbackSpeed?: number;
  /** 'loop' replays forever; 'once' plays through then holds the last frame. */
  loopMode?: 'loop' | 'once' | string;
  timelineDuration?: number;
  /** Optional colours; design default is foreground aqua on a dark field. */
  foreground?: string;
  background?: string;
}

/** Parse a face JSON string into a typed document (throws on invalid JSON). */
export function loadFace(json: string): FaceDocument {
  const doc = JSON.parse(json) as FaceDocument;
  if (!Array.isArray(doc.frames)) {
    throw new Error('Face document has no frames array');
  }
  return doc;
}

/** All shapes of the first visible layer of a frame (the common case). */
export function frameShapes(frame: FaceFrame): FaceShape[] {
  const shapes: FaceShape[] = [];
  for (const layer of frame.layers ?? []) {
    if (layer.visible === false) continue;
    for (const shape of layer.shapes ?? []) shapes.push(shape);
  }
  return shapes;
}

/** Linear vertex interpolation (port of Position2D::Lerp). */
export function lerpVertex(a: Vertex, b: Vertex, t: number): Vertex {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * Morph one shape's vertices toward a target at progress `alpha`, easing by the
 * given easing name. Source/target must have matching vertex counts; extra
 * target vertices are ignored and missing ones held at source (defensive).
 */
export function morphVertices(
  source: Vertex[],
  target: Vertex[],
  alpha: number,
  easing = 'easeInOutCubic',
): Vertex[] {
  const eased = bezierEase01(alpha, easingFromName(easing));
  const n = Math.min(source.length, target.length);
  const out: Vertex[] = [];
  for (let i = 0; i < n; i++) {
    out.push(lerpVertex(source[i]!, target[i]!, eased));
  }
  // hold any trailing source vertices that have no target counterpart
  for (let i = n; i < source.length; i++) out.push({ ...source[i]! });
  return out;
}

/** Morph all shapes of a frame toward the matching shapes of another frame. */
export function morphFrames(
  from: FaceFrame,
  to: FaceFrame,
  alpha: number,
): FaceShape[] {
  const fromShapes = frameShapes(from);
  const toShapes = frameShapes(to);
  const easing = to.easing ?? 'easeInOutCubic';
  const n = Math.min(fromShapes.length, toShapes.length);
  const result: FaceShape[] = [];
  for (let i = 0; i < n; i++) {
    result.push({
      ...fromShapes[i]!,
      vertices: morphVertices(fromShapes[i]!.vertices, toShapes[i]!.vertices, alpha, easing),
    });
  }
  return result;
}

/**
 * Given an animation's frames (each with an absolute `time`) and an elapsed
 * time `tMs`, return the interpolated shapes for the current segment. Frames are
 * assumed sorted by time; the destination frame's easing drives the segment.
 */
export function sampleAnimation(frames: FaceFrame[], tMs: number): FaceShape[] {
  if (frames.length === 0) return [];
  if (frames.length === 1) return frameShapes(frames[0]!);

  const first = frames[0]!;
  const last = frames[frames.length - 1]!;
  if (tMs <= first.time) return frameShapes(first);
  if (tMs >= last.time) return frameShapes(last);

  // find the segment [i, i+1] containing tMs
  let i = 0;
  while (i < frames.length - 1 && frames[i + 1]!.time <= tMs) i++;
  const a = frames[i]!;
  const b = frames[i + 1]!;
  const span = b.time - a.time;
  const alpha = span <= 0 ? 1 : (tMs - a.time) / span;
  return morphFrames(a, b, alpha);
}

/** Total duration of an animation (in the frames' own unit, seconds) = last frame's time. */
export function animationDuration(frames: FaceFrame[]): number {
  return frames.length ? frames[frames.length - 1]!.time : 0;
}

/**
 * Map elapsed wall-clock seconds to a sample time within the animation, honouring
 * `playbackSpeed` and `loopMode` (port of RoboFaceAnimator.update's time logic):
 *   - loop → wraps modulo the total duration
 *   - once → clamps to the end (then holds the final frame)
 * Returns a time in the same (seconds) unit as the frames, for `sampleAnimation`.
 */
export function playbackTime(doc: FaceDocument, elapsedSeconds: number): number {
  const dur = animationDuration(doc.frames);
  if (dur <= 0) return 0;
  const t = elapsedSeconds * (doc.playbackSpeed ?? 1);
  if ((doc.loopMode ?? 'once') === 'loop') {
    const m = t % dur;
    return m < 0 ? m + dur : m;
  }
  return Math.min(t, dur);
}

/** Morph one set of shapes toward another at progress `alpha` (cross-expression transition). */
export function blendShapes(
  from: FaceShape[],
  to: FaceShape[],
  alpha: number,
  easing = 'easeOutCubic',
): FaceShape[] {
  const n = Math.min(from.length, to.length);
  const out: FaceShape[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ ...to[i]!, vertices: morphVertices(from[i]!.vertices, to[i]!.vertices, alpha, easing) });
  }
  // include any extra target shapes unchanged (defensive; faces share shape counts)
  for (let i = n; i < to.length; i++) out.push(to[i]!);
  return out;
}
