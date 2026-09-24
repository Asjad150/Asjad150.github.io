/* ==========================================================================
   3D SCENE — a single GPU particle system that morphs between 7 shapes as
   the visitor scrolls, plus a starfield, orbit rings and bloom.
   Each page section declares which shape it shows via data-shape="n".
   ========================================================================== */
import * as THREE from "../vendor/three.bundle.min.js";

const isMobile = matchMedia("(max-width: 820px)").matches || matchMedia("(pointer: coarse)").matches;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Per-shape look: where the object sits, how visible it is, its two colours.
   x is scaled with viewport aspect; mobile always centres the object.       */
const LOOKS = [
  { name: "core",    x:  2.5, y:  0.0, z:  0.0, s: 1.00, o: 1.00, a: "#3ee6ff", b: "#8b5cf6" }, // hero
  { name: "knot",    x: -3.1, y:  0.0, z: -0.5, s: 0.95, o: 0.90, a: "#8b5cf6", b: "#ff4fd8" }, // about
  { name: "servers", x:  0.0, y:  0.0, z: -3.5, s: 1.25, o: 0.60, a: "#3ee6ff", b: "#2cffb5" }, // services
  { name: "helix",   x:  3.4, y:  0.0, z: -0.5, s: 1.00, o: 0.85, a: "#ffb547", b: "#ff4fd8" }, // experience
  { name: "galaxy",  x:  0.0, y:  0.0, z: -3.0, s: 1.35, o: 0.60, a: "#8b5cf6", b: "#3ee6ff" }, // projects
  { name: "crystal", x:  3.2, y:  0.0, z: -0.6, s: 0.95, o: 0.85, a: "#ffd36e", b: "#3ee6ff" }, // certifications
  { name: "globe",   x:  0.0, y: -0.2, z: -1.5, s: 1.10, o: 0.70, a: "#3ee6ff", b: "#8b5cf6" }, // contact
];

/* ------------------------------------------------------------ shape makers */
const rand = Math.random;
const TAU = Math.PI * 2;

function gaussian() {
  // Box–Muller, clamped for tidy tubes
  const u = 1 - rand(), v = rand();
  return Math.max(-2.5, Math.min(2.5, Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)));
}

function shapeCore(N) {
  const out = new Float32Array(N * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    let x, y, z;
    if (i % 7 === 0) {
      // inner nebula
      const r = 1.9 * Math.cbrt(rand());
      const th = rand() * TAU, ph = Math.acos(2 * rand() - 1);
      x = r * Math.sin(ph) * Math.cos(th); y = r * Math.cos(ph); z = r * Math.sin(ph) * Math.sin(th);
    } else {
      const yy = 1 - (i / (N - 1)) * 2;
      const rr = Math.sqrt(1 - yy * yy);
      const th = golden * i;
      const R = 2.25 * (0.97 + rand() * 0.06);
      x = Math.cos(th) * rr * R; y = yy * R; z = Math.sin(th) * rr * R;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function shapeKnot(N) {
  const out = new Float32Array(N * 3);
  const p = 2, q = 3, S = 0.95;
  for (let i = 0; i < N; i++) {
    const t = rand() * TAU;
    const r = Math.cos(q * t) + 2;
    const cx = r * Math.cos(p * t), cy = r * Math.sin(p * t), cz = -Math.sin(q * t);
    const k = 0.22;
    out.set([(cx + gaussian() * k) * S, (cy + gaussian() * k) * S, (cz + gaussian() * k) * S * 1.3], i * 3);
  }
  return out;
}

function shapeServers(N) {
  // four stacked server blades with a status-LED strip on the front
  const out = new Float32Array(N * 3);
  const W = 3.8, H = 0.42, D = 2.4, levels = [-1.5, -0.5, 0.5, 1.5];
  for (let i = 0; i < N; i++) {
    const cy = levels[i % 4];
    let x, y, z;
    const f = rand();
    if (f < 0.12) {
      // LED strip
      x = -W / 2 + 0.25 + Math.floor(rand() * 12) * 0.12; y = cy; z = D / 2 + 0.02;
    } else {
      // surface of box, weighted by face area
      const face = rand();
      const u = rand() - 0.5, v = rand() - 0.5;
      if (face < 0.4) { x = u * W; z = v * D; y = cy + (rand() < 0.5 ? -H / 2 : H / 2); }
      else if (face < 0.8) { x = u * W; y = cy + v * H; z = rand() < 0.5 ? -D / 2 : D / 2; }
      else { z = u * D; y = cy + v * H; x = rand() < 0.5 ? -W / 2 : W / 2; }
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function shapeHelix(N) {
  const out = new Float32Array(N * 3);
  const Hh = 6.4, R = 1.35, turns = 2.4;
  for (let i = 0; i < N; i++) {
    let x, y, z;
    if (rand() < 0.22) {
      // rungs
      const step = Math.floor(rand() * 26) / 25;
      const a = step * TAU * turns, l = rand() * 2 - 1;
      x = Math.cos(a) * R * l; z = Math.sin(a) * R * l; y = (step - 0.5) * Hh;
    } else {
      const t = rand(), strand = i % 2;
      const a = t * TAU * turns + strand * Math.PI;
      x = Math.cos(a) * R + gaussian() * 0.06; z = Math.sin(a) * R + gaussian() * 0.06; y = (t - 0.5) * Hh;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function shapeGalaxy(N) {
  const out = new Float32Array(N * 3);
  const arms = 4, Rmax = 4.2, tilt = -1.05;
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  for (let i = 0; i < N; i++) {
    const r = Math.pow(rand(), 1.4) * Rmax;
    const branch = ((i % arms) / arms) * TAU;
    const spin = r * 1.15;
    const spread = 0.35 * (0.3 + r / Rmax);
    const x = Math.cos(branch + spin) * r + gaussian() * spread;
    const yy = gaussian() * 0.12 * (1.2 - r / Rmax);
    const zz = Math.sin(branch + spin) * r + gaussian() * spread;
    out.set([x, yy * ct - zz * st, yy * st + zz * ct], i * 3);
  }
  return out;
}

function shapeCrystal(N) {
  // icosahedron edges inside a medal ring
  const out = new Float32Array(N * 3);
  const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.1, 0)).attributes.position.array;
  const nEdges = edges.length / 6;
  for (let i = 0; i < N; i++) {
    let x, y, z;
    const f = rand();
    if (f < 0.62) {
      const e = Math.floor(rand() * nEdges) * 6, t = rand();
      x = edges[e] + (edges[e + 3] - edges[e]) * t + gaussian() * 0.025;
      y = edges[e + 1] + (edges[e + 4] - edges[e + 1]) * t + gaussian() * 0.025;
      z = edges[e + 2] + (edges[e + 5] - edges[e + 2]) * t + gaussian() * 0.025;
    } else if (f < 0.9) {
      const a = rand() * TAU, R = 2.85 + gaussian() * 0.04;
      x = Math.cos(a) * R; y = Math.sin(a) * R; z = gaussian() * 0.04;
    } else {
      const r = 0.7 * Math.cbrt(rand()), th = rand() * TAU, ph = Math.acos(2 * rand() - 1);
      x = r * Math.sin(ph) * Math.cos(th); y = r * Math.cos(ph); z = r * Math.sin(ph) * Math.sin(th);
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function shapeGlobe(N) {
  const out = new Float32Array(N * 3);
  const R = 2.3;
  for (let i = 0; i < N; i++) {
    let x, y, z;
    const f = rand();
    if (f < 0.34) {
      // latitude lines
      const lat = ((Math.floor(rand() * 11) + 1) / 12) * Math.PI, lon = rand() * TAU;
      x = R * Math.sin(lat) * Math.cos(lon); y = R * Math.cos(lat); z = R * Math.sin(lat) * Math.sin(lon);
    } else if (f < 0.66) {
      // longitude lines
      const lon = (Math.floor(rand() * 16) / 16) * TAU, lat = rand() * Math.PI;
      x = R * Math.sin(lat) * Math.cos(lon); y = R * Math.cos(lat); z = R * Math.sin(lat) * Math.sin(lon);
    } else if (f < 0.84) {
      const th = rand() * TAU, ph = Math.acos(2 * rand() - 1);
      x = R * Math.sin(ph) * Math.cos(th); y = R * Math.cos(ph); z = R * Math.sin(ph) * Math.sin(th);
    } else {
      // tilted orbit ring
      const a = rand() * TAU, r = 3.3 + gaussian() * 0.05;
      const ox = Math.cos(a) * r, oz = Math.sin(a) * r;
      x = ox; y = oz * 0.35; z = oz * 0.94;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

/* ------------------------------------------------------------------ shaders */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3  uMouse;
uniform float uMouseStrength;
uniform float uTurbulence;
uniform float uPulse;
attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3;
attribute vec3 aS4; attribute vec3 aS5; attribute vec3 aS6;
attribute vec4 aRand;
varying float vAlpha;
varying float vTone;
${NOISE}
float stepT(float k){
  return smoothstep(0.0, 1.0, clamp((uMorph - k) * 1.35 - aRand.x * 0.35, 0.0, 1.0));
}
void main(){
  vec3 p = position;
  p = mix(p, aS1, stepT(0.0));
  p = mix(p, aS2, stepT(1.0));
  p = mix(p, aS3, stepT(2.0));
  p = mix(p, aS4, stepT(3.0));
  p = mix(p, aS5, stepT(4.0));
  p = mix(p, aS6, stepT(5.0));

  // burst of turbulence mid-transition, gentle breathing otherwise
  float tr = sin(3.14159265 * clamp(fract(uMorph), 0.0, 1.0));
  float t = uTime * 0.18;
  vec3 n = vec3(
    snoise(p * 0.55 + vec3(t, 0.0, 0.0)),
    snoise(p * 0.55 + vec3(11.3, t, 4.1)),
    snoise(p * 0.55 + vec3(7.7, 2.9, t))
  );
  p += n * (0.06 + uTurbulence * tr * 0.9 + uPulse);

  // mouse repel
  vec3 d = p - uMouse;
  float dist = length(d);
  float f = smoothstep(1.6, 0.0, dist) * uMouseStrength;
  p += normalize(d + 0.0001) * f * 0.9;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float big = step(0.985, aRand.y) * 2.2;
  float size = uSize * (0.45 + aRand.y * 0.9 + big) * (1.0 + f * 1.5);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

  vAlpha = (0.35 + aRand.z * 0.65) * (0.75 + 0.25 * sin(uTime * (1.0 + aRand.w * 2.0) + aRand.x * 40.0));
  vTone = clamp(aRand.w * 0.7 + (p.y + 2.5) / 5.0 * 0.5 + f, 0.0, 1.0);
}`;

const particleFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vAlpha;
varying float vTone;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.2);
  vec3 col = mix(uColorA, uColorB, vTone);
  col = mix(col, vec3(1.0), glow * 0.35);
  gl_FragColor = vec4(col, glow * vAlpha * uOpacity);
}`;

const starVertex = /* glsl */ `
uniform float uTime; uniform float uPixelRatio;
attribute float aSize; attribute float aPhase;
varying float vA;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (40.0 / -mv.z);
  vA = 0.45 + 0.55 * sin(uTime * 0.8 + aPhase);
}`;
const starFragment = /* glsl */ `
varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vec3(0.75, 0.82, 1.0), pow(smoothstep(0.5, 0.0, d), 2.0) * vA * 0.8);
}`;

/* -------------------------------------------------------------------- scene */
export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1); // pure black: avoids the sRGB lift that greys out the background

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04050b, 0.035);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 9);

  /* ---- particle morph system ---- */
  const N = isMobile ? 7000 : 16000;
  const shapes = [shapeCore, shapeKnot, shapeServers, shapeHelix, shapeGalaxy, shapeCrystal, shapeGlobe].map((fn) => fn(N));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
  for (let s = 1; s < shapes.length; s++) geo.setAttribute("aS" + s, new THREE.BufferAttribute(shapes[s], 3));
  const rnd = new Float32Array(N * 4);
  for (let i = 0; i < rnd.length; i++) rnd[i] = rand();
  geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uSize: { value: isMobile ? 2.6 : 2.2 },
    uPixelRatio: { value: pixelRatio },
    uMouse: { value: new THREE.Vector3(99, 99, 99) },
    uMouseStrength: { value: 0 },
    uTurbulence: { value: reducedMotion ? 0.2 : 1.0 },
    uColorA: { value: new THREE.Color(LOOKS[0].a) },
    uColorB: { value: new THREE.Color(LOOKS[0].b) },
    uOpacity: { value: 1 },
    uPulse: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* ---- hero decorations: wire core + orbit rings with satellites ---- */
  const deco = new THREE.Group();
  group.add(deco);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)),
    new THREE.LineBasicMaterial({ color: 0x7fe9ff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  deco.add(wire);
  const rings = [];
  const ringDefs = [
    { r: 3.0, tilt: [1.2, 0.2, 0], color: 0x3ee6ff, speed: 0.35 },
    { r: 3.4, tilt: [0.4, -0.6, 0.3], color: 0x8b5cf6, speed: -0.25 },
    { r: 3.8, tilt: [1.7, 0.9, -0.2], color: 0xff4fd8, speed: 0.18 },
  ];
  for (const d of ringDefs) {
    const pts = [];
    for (let i = 0; i <= 160; i++) { const a = (i / 160) * TAU; pts.push(new THREE.Vector3(Math.cos(a) * d.r, Math.sin(a) * d.r, 0)); }
    const holder = new THREE.Group();
    holder.rotation.set(...d.tilt);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    holder.add(line);
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
    );
    holder.add(sat);
    deco.add(holder);
    rings.push({ holder, line, sat, ...d, phase: rand() * TAU });
  }

  /* ---- starfield ---- */
  const S = isMobile ? 1200 : 2600;
  const sPos = new Float32Array(S * 3), sSize = new Float32Array(S), sPhase = new Float32Array(S);
  for (let i = 0; i < S; i++) {
    const r = 25 + rand() * 60, th = rand() * TAU, ph = Math.acos(2 * rand() - 1);
    sPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th) - 20], i * 3);
    sSize[i] = 0.6 + rand() * 1.8; sPhase[i] = rand() * TAU;
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  sGeo.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));
  sGeo.setAttribute("aPhase", new THREE.BufferAttribute(sPhase, 1));
  const starUniforms = { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio };
  const stars = new THREE.Points(sGeo, new THREE.ShaderMaterial({
    uniforms: starUniforms, vertexShader: starVertex, fragmentShader: starFragment,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  }));
  scene.add(stars);

  /* ---- post-processing (desktop only) ---- */
  let composer = null, bloom = null;
  if (!isMobile) {
    composer = new THREE.EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.45, 0.08);
    composer.addPass(bloom);
    composer.addPass(new THREE.OutputPass());
  }

  /* ---- input ---- */
  const pointer = new THREE.Vector2(0, 0), pointerSmooth = new THREE.Vector2(0, 0);
  let pointerActive = false;
  window.addEventListener("pointermove", (e) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    pointerActive = e.pointerType === "mouse";
  }, { passive: true });
  document.addEventListener("pointerleave", () => (pointerActive = false));

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  /* ---- scroll → morph mapping ---- */
  let sections = [];
  function measure() {
    sections = [...document.querySelectorAll("[data-shape]")].map((el) => ({
      el, shape: Number(el.dataset.shape), top: el.offsetTop, h: el.offsetHeight,
    }));
  }
  function targetMorph() {
    if (!sections.length) return 0;
    const c = window.scrollY + window.innerHeight * 0.5;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i], next = sections[i + 1];
      if (!next || c < next.top) {
        if (!next) return s.shape;
        const t = (c - s.top) / Math.max(1, next.top - s.top);
        const k = THREE.MathUtils.smoothstep(t, 0.72, 1.0);
        return s.shape + (next.shape - s.shape) * k;
      }
    }
    return 0;
  }

  /* ---- resize ---- */
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (composer) { composer.setSize(w, h); bloom.setSize(w, h); }
    measure();
  }
  window.addEventListener("resize", resize);
  new ResizeObserver(() => measure()).observe(document.body);

  /* ---- loop ---- */
  const clock = new THREE.Timer();
  let morph = 0;
  const cA = new THREE.Color(), cB = new THREE.Color(), tmpA = new THREE.Color(), tmpB = new THREE.Color();
  const lerp = THREE.MathUtils.lerp;
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { clock.reset?.(); requestAnimationFrame(tick); }
  });

  function tick() {
    if (!running) return;
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = (uniforms.uTime.value += dt * (reducedMotion ? 0.35 : 1));

    // morph follows scroll with easing
    const target = targetMorph();
    morph = lerp(morph, target, 1 - Math.pow(0.001, dt));
    if (Math.abs(morph - target) < 0.0005) morph = target;
    uniforms.uMorph.value = morph;

    // blend per-shape look
    const i0 = Math.floor(morph), i1 = Math.min(i0 + 1, LOOKS.length - 1);
    const f = THREE.MathUtils.smoothstep(morph - i0, 0, 1);
    const L0 = LOOKS[i0], L1 = LOOKS[i1];
    const aspectK = Math.min(1, camera.aspect / 1.6);
    const mob = camera.aspect < 0.9;
    const gx = mob ? 0 : lerp(L0.x, L1.x, f) * aspectK;
    const gz = lerp(L0.z, L1.z, f) - (mob ? 2.2 : 0);
    group.position.x = lerp(group.position.x, gx, 0.08);
    group.position.y = lerp(group.position.y, lerp(L0.y, L1.y, f) + (mob ? 0.4 : 0), 0.08);
    group.position.z = lerp(group.position.z, gz, 0.08);
    const sc = lerp(L0.s, L1.s, f);
    group.scale.setScalar(sc);
    uniforms.uOpacity.value = lerp(L0.o, L1.o, f) * (mob ? 0.6 : 1);
    tmpA.set(L0.a); tmpB.set(L1.a); cA.copy(tmpA).lerp(tmpB, f);
    tmpA.set(L0.b); tmpB.set(L1.b); cB.copy(tmpA).lerp(tmpB, f);
    uniforms.uColorA.value.copy(cA); uniforms.uColorB.value.copy(cB);

    // rotation: idle spin + slight tilt toward pointer
    pointerSmooth.lerp(pointer, 0.05);
    group.rotation.y += dt * (reducedMotion ? 0.03 : 0.1);
    group.rotation.x = lerp(group.rotation.x, pointerSmooth.y * 0.25, 0.05);

    // hero decorations fade out after the hero
    const heroVis = THREE.MathUtils.clamp(1 - morph * 1.6, 0, 1);
    deco.visible = heroVis > 0.01;
    wire.material.opacity = 0.35 * heroVis;
    wire.rotation.x = time * 0.3; wire.rotation.z = time * 0.2;
    for (const r of rings) {
      r.line.material.opacity = 0.22 * heroVis;
      r.sat.material.opacity = heroVis;
      const a = r.phase + time * r.speed;
      r.sat.position.set(Math.cos(a) * r.r, Math.sin(a) * r.r, 0);
      r.holder.rotation.z += dt * r.speed * 0.2;
    }

    // mouse → local space for repel
    if (pointerActive) {
      raycaster.setFromCamera(pointerSmooth, camera);
      plane.constant = -group.position.z;
      if (raycaster.ray.intersectPlane(plane, hit)) {
        group.worldToLocal(uniforms.uMouse.value.copy(hit));
      }
      uniforms.uMouseStrength.value = lerp(uniforms.uMouseStrength.value, 1, 0.08);
    } else {
      uniforms.uMouseStrength.value = lerp(uniforms.uMouseStrength.value, 0, 0.05);
    }

    // camera parallax + scroll drift
    camera.position.x = lerp(camera.position.x, pointerSmooth.x * 0.45, 0.05);
    camera.position.y = lerp(camera.position.y, pointerSmooth.y * 0.3, 0.05);
    camera.lookAt(0, 0, 0);
    stars.rotation.y = time * 0.006 + window.scrollY * 0.00008;
    stars.rotation.x = window.scrollY * 0.00004;

    if (composer) composer.render(); else renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  measure();
  requestAnimationFrame(tick);

  return {
    remeasure: measure,
    // quick burst of energy, used when a terminal command runs, etc.
    pulse() {
      const u = uniforms.uPulse, start = performance.now();
      const fade = () => { const k = Math.min(1, (performance.now() - start) / 1100); u.value = 1.2 * Math.sin(Math.PI * k); if (k < 1) requestAnimationFrame(fade); };
      requestAnimationFrame(fade);
    },
  };
}
