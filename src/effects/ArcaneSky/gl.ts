/* Minimal WebGL2 plumbing for a single fullscreen-triangle fragment shader. */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`shader compile failed: ${log}`);
  }
  return s;
}

export interface FullscreenProgram {
  gl: WebGL2RenderingContext;
  uniform: (name: string) => WebGLUniformLocation | null;
  draw: () => void;
  dispose: () => void;
}

export function createFullscreenProgram(canvas: HTMLCanvasElement, frag: string): FullscreenProgram | null {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`link failed: ${gl.getProgramInfoLog(program)}`);
    }
  } catch (err) {
    console.warn("[ArcaneSky]", err);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.useProgram(program);
  const cache = new Map<string, WebGLUniformLocation | null>();

  return {
    gl,
    uniform: (name) => {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
      return cache.get(name)!;
    },
    draw: () => gl.drawArrays(gl.TRIANGLES, 0, 3),
    dispose: () => {
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}

/* "#c6a14a" / "rgb(…)" → linear-ish [0..1] triple for a vec3 uniform. */
export function cssColor(value: string): [number, number, number] {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.length === 4 ? v.slice(1).replace(/./g, (c) => c + c) : v.slice(1, 7);
    const n = parseInt(hex, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = v.match(/[\d.]+/g);
  if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  return [0, 0, 0];
}
