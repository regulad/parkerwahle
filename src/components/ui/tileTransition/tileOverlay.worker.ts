// Draws the tile transition on the OffscreenCanvas that tileOverlay.ts hands over: a capture of
// the old page, cut into tiles that each get an outline and then turn edge-on, revealing the new
// page beneath. The worker runs its own requestAnimationFrame loop, so the animation's frames
// don't wait on the page's main thread while the new route mounts.
//
// Each frame is one instanced draw call with no vertex buffers: a tile's corners come from
// gl_VertexID and the tile itself from gl_InstanceID, and the vertex shader works out its timing,
// easing, rotation and perspective. The worker's part of a frame stays a fraction of a millisecond
// from 300 tiles to 25,000 (a page zoomed out to 25%). This is raw WebGL2: one program, one
// texture and one draw call, which a wrapper such as twgl.js or OGL would add a dependency to
// without removing any of.
//
// The look is the one the DOM version had, where every tile was a <canvas> animated with the Web
// Animations API (src/components/ui/vtwrapper/vtwrapper.tsx as of fb2c345). Tiles are 48px. The tile at diagonal index k = column + row grows a 3px #6666 outline over 200ms from
// 5k ms, then turns 90° about the (-1, 1, 0) axis under perspective(1000px) over 400ms from
// 10k + 200 ms, since its second delay counted from the end of its first animation. Both
// animations ease out. Tiles are drawn in the DOM version's order, column by column, so a later
// tile covers an earlier tile's outline exactly as it did there.

import type { FromWorker, ToWorker, Viewport } from "./tileOverlay";

/** A tile's target size, in CSS pixels; the grid rounds up to cover the viewport. */
const TILE_SIZE = 48;
/** The delay between one diagonal of tiles and the next, in ms. */
const STAGGER_MS = 5;
const OUTLINE_MS = 200;
const FLIP_MS = 400;
/** The outline's width at its end, in CSS pixels. */
const OUTLINE_WIDTH = 3;
/** #6666, the outline's colour at its end: grey 0x66 at alpha 0x66. */
const OUTLINE_GREY = 0x66 / 0xff;
const OUTLINE_ALPHA = 0x66 / 0xff;
/** The distance of perspective(), in CSS pixels, from each tile's centre. */
const PERSPECTIVE = 1000;
/** CSS's `ease-out`, cubic-bezier(0, 0, 0.58, 1), as CSS Easing Functions Level 1 defines it. */
const EASE_OUT = [0, 0, 0.58, 1] as const;

/** How long a reveal lasts on a grid of this size. */
function duration(columns: number, rows: number): number {
  return 2 * STAGGER_MS * (columns + rows - 2) + OUTLINE_MS + FLIP_MS;
}

const glsl = (n: number) => n.toFixed(6);

const VERTEX_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_viewport; // CSS pixels
uniform ivec2 u_grid;    // columns, rows
uniform float u_time;    // ms since the reveal began; negative before it

out vec2 v_local;              // CSS pixels from the tile's centre, before rotation
out vec2 v_uv;
flat out vec2 v_halfTile;
flat out float v_outlineAlpha;

// Solves a CSS cubic-bezier() timing function by bisection on its x polynomial.
float ease(float x) {
  const vec4 p = vec4(${EASE_OUT.map(glsl).join(", ")});
  float lo = 0.0, hi = 1.0, t = x;
  for (int n = 0; n < 16; n++) {
    t = 0.5 * (lo + hi);
    float u = 1.0 - t;
    float bx = 3.0 * u * u * t * p.x + 3.0 * u * t * t * p.z + t * t * t;
    if (bx < x) lo = t; else hi = t;
  }
  float u = 1.0 - t;
  return 3.0 * u * u * t * p.y + 3.0 * u * t * t * p.w + t * t * t;
}

// rotate3d() as CSS Transforms 2 defines it, by Rodrigues' formula.
vec3 rotate(vec3 v, vec3 axis, float angle) {
  float c = cos(angle);
  return v * c + cross(axis, v) * sin(angle) + axis * dot(axis, v) * (1.0 - c);
}

void main() {
  // Integer division: a float quotient can land a hair under a whole number, dropping a column's
  // first tile below the viewport.
  int column = gl_InstanceID / u_grid.y;
  int row = gl_InstanceID - column * u_grid.y;
  float k = float(column + row);

  vec2 tile = u_viewport / vec2(u_grid);
  vec2 centre = (vec2(column, row) + 0.5) * tile;

  float outline = ease(clamp((u_time - ${glsl(STAGGER_MS)} * k) / ${glsl(OUTLINE_MS)}, 0.0, 1.0));
  float flip = ease(clamp((u_time - ${glsl(2 * STAGGER_MS)} * k - ${glsl(OUTLINE_MS)}) / ${glsl(FLIP_MS)}, 0.0, 1.0));
  float width = ${glsl(OUTLINE_WIDTH)} * outline;

  // The quad covers the tile and its outline, which lies outside the tile's box.
  vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1);
  vec2 local = (corner - 0.5) * (tile + 2.0 * width);

  vec3 turned = rotate(vec3(local, 0.0), normalize(vec3(-1.0, 1.0, 0.0)), radians(90.0) * flip);
  float w = 1.0 - turned.z / ${glsl(PERSPECTIVE)};
  vec2 screen = centre + turned.xy / w;
  vec2 ndc = vec2(screen.x / u_viewport.x * 2.0 - 1.0, 1.0 - screen.y / u_viewport.y * 2.0);
  // Multiplying through by w keeps the texture perspective-correct across the turned tile.
  gl_Position = vec4(ndc * w, 0.0, w);

  v_local = local;
  v_uv = (centre + local) / u_viewport;
  v_halfTile = tile * 0.5;
  v_outlineAlpha = ${glsl(OUTLINE_ALPHA)} * outline;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_page;

in vec2 v_local;
in vec2 v_uv;
flat in vec2 v_halfTile;
flat in float v_outlineAlpha;

out vec4 colour; // premultiplied

void main() {
  vec2 outside = abs(v_local) - v_halfTile;
  colour = max(outside.x, outside.y) > 0.0
    ? vec4(vec3(${glsl(OUTLINE_GREY)}), 1.0) * v_outlineAlpha
    : texture(u_page, v_uv);
}
`;

interface WorkerScope {
  onmessage: ((event: MessageEvent<ToWorker>) => void) | null;
  postMessage(message: FromWorker): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
}

const scope = self as unknown as WorkerScope;

interface Renderer {
  canvas: OffscreenCanvas;
  gl: WebGL2RenderingContext;
  uniforms: { viewport: WebGLUniformLocation; grid: WebGLUniformLocation; time: WebGLUniformLocation };
}

/** The capture on show, and the reveal once it plays. */
interface Showing {
  texture: WebGLTexture;
  columns: number;
  rows: number;
  /** The request a finished reveal answers, once it plays. */
  play: { id: number; start: number | null } | null;
}

let renderer: Renderer | null = null;
let viewport: Viewport = { width: 1, height: 1, dpr: 1 };
let showing: Showing | null = null;
let frameRequested = false;

function fail(message: string): void {
  scope.postMessage({ type: "failed", message });
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`shader: ${gl.getShaderInfoLog(shader)}`);
  return shader;
}

function init(canvas: OffscreenCanvas): Renderer {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, stencil: false });
  if (!gl) throw new Error("no WebGL2 context");
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    renderer = null;
    fail("WebGL context lost");
  });

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`program: ${gl.getProgramInfoLog(program)}`);
  gl.useProgram(program);
  // The tiles take no attributes, but a draw call needs a vertex array bound.
  gl.bindVertexArray(gl.createVertexArray());
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  // The capture is already in the page's colour space; converting it would only slow the upload.
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const uniform = (name: string) => gl.getUniformLocation(program, name)!;
  const uniforms = { viewport: uniform("u_viewport"), grid: uniform("u_grid"), time: uniform("u_time") };

  // Drivers can put off compiling a program until its first draw, which would otherwise be the
  // click's. The canvas is hidden until a capture is shown, so this draw is never seen.
  gl.uniform2f(uniforms.viewport, 1, 1);
  gl.uniform2i(uniforms.grid, 1, 1);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { canvas, gl, uniforms };
}

function resizeBuffer({ canvas, gl }: Renderer): void {
  const width = Math.max(1, Math.round(viewport.width * viewport.dpr));
  const height = Math.max(1, Math.round(viewport.height * viewport.dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
}

function draw(time: number): void {
  if (!renderer || !showing) return;
  const { gl, uniforms } = renderer;
  resizeBuffer(renderer);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(uniforms.viewport, viewport.width, viewport.height);
  gl.uniform2i(uniforms.grid, showing.columns, showing.rows);
  gl.uniform1f(uniforms.time, time);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, showing.columns * showing.rows);
}

/** Clears the canvas and forgets the capture. */
function clear(): void {
  if (renderer) {
    const { gl } = renderer;
    if (showing) gl.deleteTexture(showing.texture);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  showing = null;
}

function requestFrame(): void {
  if (frameRequested) return;
  frameRequested = true;
  scope.requestAnimationFrame(frame);
}

function frame(now: DOMHighResTimeStamp): void {
  frameRequested = false;
  if (!showing) return;
  const { play } = showing;
  if (!play) {
    draw(-1);
    return;
  }
  play.start ??= now;
  const time = now - play.start;
  draw(time);
  if (time >= duration(showing.columns, showing.rows)) {
    clear();
    scope.postMessage({ type: "done", id: play.id });
  } else {
    requestFrame();
  }
}

scope.onmessage = ({ data: message }) => {
  try {
    switch (message.type) {
      case "init": {
        renderer = init(message.canvas);
        scope.postMessage({ type: "ready", maxTextureSize: renderer.gl.getParameter(renderer.gl.MAX_TEXTURE_SIZE) });
        break;
      }
      case "show": {
        if (!renderer) throw new Error("no renderer");
        clear();
        const { gl } = renderer;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, message.page);
        message.page.close();
        viewport = message.viewport;
        showing = {
          texture,
          columns: Math.ceil(viewport.width / TILE_SIZE),
          rows: Math.ceil(viewport.height / TILE_SIZE),
          play: null,
        };
        // Answered from the frame that draws the capture, once it's on its way to the screen.
        scope.requestAnimationFrame((now) => {
          frame(now);
          scope.postMessage({ type: "done", id: message.id });
        });
        break;
      }
      case "play": {
        if (!showing) throw new Error("nothing to play");
        showing.play = { id: message.id, start: null };
        requestFrame();
        break;
      }
      case "resize": {
        // The grid keeps its tiles, which stretch with the viewport.
        viewport = message.viewport;
        requestFrame();
        break;
      }
      case "hide": {
        clear();
        break;
      }
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
};
