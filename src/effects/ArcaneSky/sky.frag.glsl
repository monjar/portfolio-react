#version 300 es
// ArcaneSky: the hero's living sky.
//   1. a domain-warped fbm nebula in the active palette
//   2. layers of rising, flickering embers that flare and part around the pointer
//   3. a slow-turning ring of hashed runes, rising away as you scroll
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;   // pixels, origin bottom-left; eased on the CPU
uniform float uPointerOn; // 0..1, fades the pointer's influence in/out
uniform float uScroll;    // 0 at the top of the hero → 1 once scrolled past
uniform vec3  uDeep;      // --sky-0
uniform vec3  uMid;       // --sky-mid
uniform vec3  uHi;        // --sky-hi
uniform vec3  uEmberHot;
uniform vec3  uEmberMid;
uniform vec3  uGold;
uniform vec3  uArcane;
uniform float uDark;      // 0 parchment · 1 emerald wood
uniform int   uOctaves;
uniform int   uEmberLayers;

out vec4 outColor;

const float TAU = 6.28318530718;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= uOctaves) break;
    v += a * noise(p);
    p = rot * p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// One futhark-ish glyph: a stem plus up to four hashed branches.
float rune(vec2 q, float h) {
  float d = sdSeg(q, vec2(0.0, -0.8), vec2(0.0, 0.8));
  if (fract(h * 3.1) > 0.45) d = min(d, sdSeg(q, vec2(0.0, 0.8), vec2(0.55, 0.35)));
  if (fract(h * 7.3) > 0.50) d = min(d, sdSeg(q, vec2(0.0, 0.25), vec2(0.55, -0.2)));
  if (fract(h * 13.7) > 0.55) d = min(d, sdSeg(q, vec2(0.0, 0.8), vec2(-0.55, 0.35)));
  if (fract(h * 19.9) > 0.60) d = min(d, sdSeg(q, vec2(0.0, -0.15), vec2(-0.55, -0.6)));
  if (fract(h * 29.3) > 0.80) d = min(d, sdSeg(q, vec2(-0.45, 0.0), vec2(0.45, 0.0)));
  return d;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * uRes) / uRes.y;
  vec2 ptr = (uPointer - 0.5 * uRes) / uRes.y;
  float t = uTime;

  // ── 1. nebula ──────────────────────────────────────────────────────────
  vec2 np = p * 1.35 + vec2(0.0, uScroll * 0.6);
  // the pointer gently drags the gas toward it
  vec2 toPtr = ptr - p;
  np += toPtr * 0.08 * exp(-dot(toPtr, toPtr) * 3.0) * uPointerOn;
  vec2 q = vec2(fbm(np + vec2(0.0, t * 0.035)), fbm(np + vec2(5.2, 1.3) - t * 0.025));
  vec2 r = vec2(fbm(np + 3.6 * q + vec2(1.7, 9.2) + t * 0.04),
                fbm(np + 3.6 * q + vec2(8.3, 2.8) - t * 0.03));
  float n = fbm(np + 3.0 * r);

  vec3 lightSky = mix(uHi, uMid, smoothstep(0.35, 0.95, n));
  lightSky = mix(lightSky, uDeep, smoothstep(0.6, 1.0, n * r.x) * 0.55);
  vec3 darkSky = mix(uDeep, uMid, smoothstep(0.25, 0.9, n));
  darkSky += uHi * pow(clamp(n * r.y * 1.6, 0.0, 1.0), 3.0) * 0.6;
  vec3 col = mix(lightSky, darkSky, uDark);

  // arcane wisps (crimson by day, teal by night) riding the warp
  float wisp = smoothstep(0.55, 0.95, q.y * r.x * 1.8);
  col = mix(col, uArcane, wisp * mix(0.16, 0.35, uDark));

  // ── 3. rune circle (drawn before embers so sparks pass over it) ────────
  vec2 cp = p - vec2(0.0, 0.04 + uScroll * 0.35);
  float rad = length(cp);
  float ang = atan(cp.y, cp.x);
  float R = 0.43;
  float ringW = 1.5 / uRes.y;
  float rings = smoothstep(ringW * 2.0, 0.0, abs(rad - R))
              + smoothstep(ringW * 2.0, 0.0, abs(rad - (R - 0.07)))
              + 0.6 * smoothstep(ringW * 1.5, 0.0, abs(rad - (R + 0.035)));
  float segs = 28.0;
  float a = ang / TAU + 0.5 + t * 0.006;
  float sid = floor(a * segs);
  float su = fract(a * segs) - 0.5;
  float bandMid = R - 0.035;
  vec2 gq = vec2(su * (TAU * bandMid / segs) / 0.026, (rad - bandMid) / 0.026);
  float glyph = 0.0;
  if (abs(rad - bandMid) < 0.03) {
    float rd = rune(gq * vec2(1.25, 1.0), hash12(vec2(sid, 7.0)));
    glyph = smoothstep(0.16, 0.06, rd);
  }
  // tick marks on the outer ring
  float ticks = smoothstep(0.08, 0.0, abs(fract(a * 112.0) - 0.5) - 0.42)
              * smoothstep(0.012, 0.0, abs(rad - (R + 0.012)));
  // a slow shimmer runs around the circle
  float shimmer = 0.55 + 0.45 * sin(ang * 3.0 - t * 0.6);
  float circle = (rings * 0.8 + glyph + ticks * 0.6) * shimmer;
  float circleA = mix(0.3, 0.32, uDark) * (1.0 - uScroll * 0.8);
  col = mix(col, uGold, clamp(circle, 0.0, 1.0) * circleA);

  // ── 2. embers ──────────────────────────────────────────────────────────
  vec3 sparks = vec3(0.0);
  vec3 sparkCol = uEmberMid;
  float sparkA = 0.0;
  for (int L = 0; L < 4; L++) {
    if (L >= uEmberLayers) break;
    float fl = float(L);
    float scale = 5.0 + fl * 3.5;
    float speed = 0.07 + fl * 0.035;
    vec2 ep = p;
    // embers part around the pointer
    vec2 away = p - ptr;
    float near = exp(-dot(away, away) * 14.0) * uPointerOn;
    ep += normalize(away + 1e-4) * near * 0.05;
    vec2 g = ep * scale + vec2(fl * 13.7, 0.0);
    g.y -= t * speed * scale;
    g.x += sin(g.y * 0.35 + fl * 2.1 + t * 0.4) * 0.35;
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash12(cell + fl * 31.0);
    if (h > 0.72) {
      vec2 off = (hash22(cell + fl * 7.0) - 0.5) * 0.7;
      float d = length(f - off) * (1.0 + fl * 0.15);
      float flick = 0.55 + 0.45 * sin(t * (2.5 + h * 6.0) + h * 40.0);
      float size = 0.035 + 0.04 * fract(h * 17.0);
      float core = smoothstep(size, 0.0, d);
      float halo = 0.012 / (d * d + 0.012) * 0.18;
      float e = (core + halo) * flick * (1.0 + near * 2.5) * (1.0 - fl * 0.18);
      vec3 ec = mix(uEmberMid, uEmberHot, flick);
      sparks += ec * e;
      float ea = clamp(e, 0.0, 1.0);
      if (ea > sparkA) { sparkA = ea; sparkCol = ec; }
    }
  }
  // embers fade out toward the top so they "burn out" as they rise
  float rise = smoothstep(0.7, -0.2, p.y);
  sparkA *= rise;
  col = mix(col, sparkCol, sparkA * mix(0.8, 0.95, uDark));
  // a little bloom by night
  col += sparks * rise * 0.12 * uDark;

  // pointer glow: a soft lantern under the cursor
  float lantern = exp(-dot(toPtr, toPtr) * 9.0) * uPointerOn;
  col = mix(col, uEmberHot, lantern * mix(0.10, 0.08, uDark));

  // vignette
  float v = smoothstep(1.35, 0.35, length(p * vec2(0.85, 1.0)));
  col *= mix(0.86, 1.0, v);

  outColor = vec4(col, 1.0);
}
