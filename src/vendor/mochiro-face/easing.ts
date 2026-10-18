/**
 * Easing: a TypeScript port of the cubic-bezier easing from the C++ face
 * renderer (`Utils.hpp` BezierEase01 + `RoboFaceAnimator::easingFromName`).
 *
 * Each named easing maps to cubic-bezier control points (P0=(0,0), P3=(1,1));
 * `bezierEase01` solves x(u)=t (Newton-Raphson + bisection) then returns y(u).
 * This matches the Shopify Skia plan's "easing-name → easing-function map".
 */

export interface ArcBezier {
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
}

export const EASE_OUT: ArcBezier = { cx1: 0, cy1: 0, cx2: 0.2, cy2: 1 };

/** Map an easing name to its cubic-bezier control points (port of easingFromName). */
export function easingFromName(name: string): ArcBezier {
  switch (name) {
    case 'easeInCubic':
      return { cx1: 0.32, cy1: 0.0, cx2: 0.67, cy2: 0.0 };
    case 'easeOutCubic':
      return { cx1: 0.33, cy1: 1.0, cx2: 0.68, cy2: 1.0 };
    case 'easeInOutCubic':
      return { cx1: 0.65, cy1: 0.0, cx2: 0.35, cy2: 1.0 };
    case 'easeOutQuart':
      return { cx1: 0.25, cy1: 1.0, cx2: 0.5, cy2: 1.0 };
    case 'easeInQuart':
      return { cx1: 0.5, cy1: 0.0, cx2: 0.75, cy2: 0.0 };
    case 'easeOutQuad':
      return { cx1: 0.25, cy1: 0.46, cx2: 0.45, cy2: 0.94 };
    case 'easeInQuad':
      return { cx1: 0.55, cy1: 0.085, cx2: 0.68, cy2: 0.53 };
    case 'easeInOut':
      return { cx1: 0.42, cy1: 0.0, cx2: 0.58, cy2: 1.0 };
    case 'easeOut':
      return EASE_OUT;
    case 'easeIn':
      return { cx1: 0.42, cy1: 0.0, cx2: 1.0, cy2: 1.0 };
    default:
      // Unknown names (e.g. easeOutElastic) fall back to the default arc,
      // matching the C++ ArcBezier default ctor {0.25, 0.1, 0.25, 1.0}.
      return { cx1: 0.25, cy1: 0.1, cx2: 0.25, cy2: 1.0 };
  }
}

function bezierEval(u: number, p0: number, p1: number, p2: number, p3: number): number {
  const inv = 1 - u;
  return (
    inv * inv * inv * p0 +
    3 * inv * inv * u * p1 +
    3 * inv * u * u * p2 +
    u * u * u * p3
  );
}

function bezierEvalDerivative(u: number, p0: number, p1: number, p2: number, p3: number): number {
  const inv = 1 - u;
  return 3 * inv * inv * (p1 - p0) + 6 * inv * u * (p2 - p1) + 3 * u * u * (p3 - p2);
}

function clamp01(t: number): number {
  return Math.min(Math.max(t, 0), 1);
}

/** Map time t∈[0,1] → eased progress via the given cubic-bezier arc. */
export function bezierEase01(t: number, arc: ArcBezier): number {
  t = clamp01(t);
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const x0 = 0,
    x3 = 1;
  const { cx1: x1, cx2: x2 } = arc;

  let u = t;
  // Newton-Raphson
  for (let i = 0; i < 6; i++) {
    const x = bezierEval(u, x0, x1, x2, x3);
    const dx = bezierEvalDerivative(u, x0, x1, x2, x3);
    const err = x - t;
    if (Math.abs(err) < 1e-6) break;
    if (Math.abs(dx) < 1e-6) break;
    u -= err / dx;
    if (u < 0 || u > 1) {
      u = clamp01(u);
      break;
    }
  }
  // Bisection refinement
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 12; i++) {
    const x = bezierEval(u, x0, x1, x2, x3);
    if (Math.abs(x - t) < 1e-6) break;
    if (x < t) lo = u;
    else hi = u;
    u = 0.5 * (lo + hi);
  }

  const { cy1: y1, cy2: y2 } = arc;
  return clamp01(bezierEval(u, 0, y1, y2, 1));
}

/** Convenience: ease time `t` by easing name. */
export function easeByName(t: number, name: string): number {
  return bezierEase01(t, easingFromName(name));
}
