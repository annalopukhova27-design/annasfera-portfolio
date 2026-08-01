/**
 * Aurora — анимированный WebGL-фон для героя
 * Адаптация React/ogl-компонента под ванильный JS (без npm)
 *
 * Настройки: измените colorStops / amplitude / blend / speed в initAurora()
 */

const AURORA_VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const AURORA_FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 c0 = uColorStops[0];
  vec3 c1 = uColorStops[1];
  vec3 c2 = uColorStops[2];

  float factor = clamp(uv.x, 0.0, 1.0);
  vec3 rampColor = factor < 0.5
    ? mix(c0, c1, factor * 2.0)
    : mix(c1, c2, (factor - 0.5) * 2.0);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  // Усиление для заметности на светлом фоне сайта
  vec3 auroraColor = intensity * rampColor * 1.35;
  auroraAlpha = clamp(auroraAlpha * 1.15, 0.0, 1.0);

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h;
  const num = parseInt(full, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Aurora shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * @param {HTMLElement} container
 * @param {{
 *   colorStops?: string[],
 *   amplitude?: number,
 *   blend?: number,
 *   speed?: number
 * }} options
 */
function initAurora(container, options = {}) {
  if (!container) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    container.classList.add('aurora-container--fallback');
    return null;
  }

  const {
    colorStops = ['#EC4899', '#B497CF', '#7C3AED'],
    amplitude = 1.0,
    blend = 0.5,
    speed = 1
  } = options;

  const canvas = document.createElement('canvas');
  canvas.className = 'aurora-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    console.warn('Aurora: WebGL2 не поддерживается, включаю CSS-fallback');
    container.removeChild(canvas);
    container.classList.add('aurora-container--fallback');
    return null;
  }

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const vert = createShader(gl, gl.VERTEX_SHADER, AURORA_VERT);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, AURORA_FRAG);
  if (!vert || !frag) {
    container.classList.add('aurora-container--fallback');
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Aurora program:', gl.getProgramInfoLog(program));
    container.classList.add('aurora-container--fallback');
    return null;
  }

  // WebGL2 требует VAO — без него canvas остаётся пустым
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  const uTime = gl.getUniformLocation(program, 'uTime');
  const uAmplitude = gl.getUniformLocation(program, 'uAmplitude');
  const uBlend = gl.getUniformLocation(program, 'uBlend');
  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uColorStops = [
    gl.getUniformLocation(program, 'uColorStops[0]'),
    gl.getUniformLocation(program, 'uColorStops[1]'),
    gl.getUniformLocation(program, 'uColorStops[2]')
  ];

  function setColorStops(stops) {
    stops.forEach((hex, i) => {
      const [r, g, b] = hexToRgb(hex);
      gl.uniform3f(uColorStops[i], r, g, b);
    });
  }

  setColorStops(colorStops);
  gl.uniform1f(uAmplitude, amplitude);
  gl.uniform1f(uBlend, blend);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, container.clientWidth || container.offsetWidth);
    const height = Math.max(1, container.clientHeight || container.offsetHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
  }

  let animateId = 0;
  let running = true;

  function update(t) {
    if (!running) return;
    animateId = requestAnimationFrame(update);
    gl.bindVertexArray(vao);
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t * 0.001 * speed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  resize();
  window.addEventListener('resize', resize);

  // Повторный resize после layout (на случай нулевых размеров при старте)
  requestAnimationFrame(() => {
    resize();
    animateId = requestAnimationFrame(update);
  });

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!running) {
          running = true;
          animateId = requestAnimationFrame(update);
        }
      } else {
        running = false;
        cancelAnimationFrame(animateId);
      }
    },
    { threshold: 0.01 }
  );
  io.observe(container);

  return function destroy() {
    running = false;
    cancelAnimationFrame(animateId);
    window.removeEventListener('resize', resize);
    io.disconnect();
    if (canvas.parentNode === container) {
      container.removeChild(canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
