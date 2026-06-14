/* ships.js — occasional 3D spaceship flybys (WebGL via Three.js).
   Loads real CC0 spaceship models (glTF/GLB, from Quaternius via Poly Pizza,
   stored locally in assets/models/). Each ship travels through real x/y/z
   space — toward, away, and across the camera — oriented with lookAt so the
   nose leads. Three.js + GLTFLoader are imported dynamically from CDN; on any
   failure it falls back to procedural models, and if even that fails it exits
   quietly. Skips under prefers-reduced-motion; stops spawning while hidden. */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (min, max) => min + Math.random() * (max - min);
const MAX_SHIPS = 6;
const TARGET_SIZE = 1.9;   // world units for a model's largest dimension

/* Each model's nose faces a different way natively; `rot` (Euler radians)
   corrects it so the nose points to -Z (the lookAt forward axis). Tuned
   visually. */
/* All source models are CC0 by Quaternius (generically titled "Spaceship"),
   so each gets a distinct call-sign for the hover label. They all share the
   kit's orientation (nose toward -Z), so rot stays [0,0,0]. */
const MODELS = [
  { url: 'assets/models/ship-a.glb', rot: [0, 0, 0], name: 'Interceptor', maker: 'Quaternius' },
  { url: 'assets/models/ship-b.glb', rot: [0, 0, 0], name: 'Scout', maker: 'Quaternius' },
  { url: 'assets/models/ship-c.glb', rot: [0, 0, 0], name: 'Star Fighter', maker: 'Quaternius' },
  { url: 'assets/models/ship-d.glb', rot: [0, 0, 0], name: 'Freighter', maker: 'Quaternius' },
  { url: 'assets/models/ship-e.glb', rot: [0, 0, 0], name: 'Raider', maker: 'Quaternius' },
  { url: 'assets/models/ship-f.glb', rot: [0, 0, 0], name: 'Marauder', maker: 'Quaternius' },
  { url: 'assets/models/ship-g.glb', rot: [0, 0, 0], name: 'Vanguard', maker: 'Quaternius' },
  { url: 'assets/models/ship-h.glb', rot: [0, 0, 0], name: 'Stinger', maker: 'Quaternius' },
  { url: 'assets/models/ship-i.glb', rot: [0, 0, 0], name: 'Striker', maker: 'Quaternius' },
  { url: 'assets/models/ship-k.glb', rot: [0, 0, 0], name: 'Falcon', maker: 'Quaternius' },
];

export async function initShips() {
  if (reduce) return;

  let THREE;
  try {
    THREE = await import('three');
  } catch (err) {
    console.warn('3D ships unavailable (three.js failed to load):', err);
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'ship-canvas';
  document.body.appendChild(canvas);

  // SVG overlay holding the leader lines that connect each ship to its name box
  const linesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  linesSvg.setAttribute('class', 'ship-tags');
  document.body.appendChild(linesSvg);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 160);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0x6f8db3, 0.95));
  scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x101830, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff6fc4, 0.7); rim.position.set(-5, -2, -4); scene.add(rim);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Normalize a loaded scene: apply nose correction, center at origin, scale
     so its largest dimension == TARGET_SIZE. Returns a reusable template. */
  function normalize(obj3d, rot) {
    const inner = obj3d;
    inner.rotation.set(rot[0], rot[1], rot[2]);
    const outer = new THREE.Group();
    outer.add(inner);
    const box = new THREE.Box3().setFromObject(outer);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    inner.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    outer.scale.setScalar(TARGET_SIZE / maxDim);
    outer.traverse((o) => {
      if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; if (o.material) o.material.side = THREE.DoubleSide; }
    });
    return outer;
  }

  // --- procedural fallback models (used only if GLB loading fails) ---
  function fallbackTemplates() {
    const hull = new THREE.MeshStandardMaterial({ color: 0x0c2236, metalness: 0.6, roughness: 0.35, emissive: 0x05121d });
    const wing = new THREE.MeshStandardMaterial({ color: 0x14324a, metalness: 0.5, roughness: 0.45 });
    const acc = new THREE.MeshStandardMaterial({ color: 0x0a2030, emissive: 0x22e0ff, emissiveIntensity: 0.9, metalness: 0.4, roughness: 0.3 });
    const mag = new THREE.MeshBasicMaterial({ color: 0xff6fc4 });
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.5, 14), hull); b.rotation.x = -Math.PI / 2; g.add(b);
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), acc); c.position.set(0, 0.12, -0.12); g.add(c);
    const w = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.5), wing); w.position.set(0, 0, 0.28); g.add(w);
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), mag); e.position.set(0, 0, 0.74); g.add(e);
    return [{ obj: normalize(g, [0, 0, 0]), name: 'Interceptor', maker: null }];
  }

  // --- templates load in the background, in parallel; each becomes usable the
  // moment it resolves, so flybys start as soon as the FIRST model is ready
  // (spawn() no-ops until then) rather than waiting for all of them. ---
  const templates = [];
  const ships = [];

  (async () => {
    let GLTFLoader;
    try {
      ({ GLTFLoader } = await import('https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'));
    } catch (err) {
      console.warn('GLTFLoader unavailable, using procedural ships:', err);
      if (!templates.length) templates.push(...fallbackTemplates());
      return;
    }
    const loader = new GLTFLoader();
    const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));
    await Promise.allSettled(MODELS.map(async (m) => {
      try {
        const gltf = await load(m.url);
        templates.push({ obj: normalize(gltf.scene, m.rot), name: m.name, maker: m.maker });
      } catch (e) {
        console.warn('Failed to load model', m.url, e);
      }
    }));
    if (!templates.length) templates.push(...fallbackTemplates());
  })();

  function spawn() {
    if (ships.length >= MAX_SHIPS || !templates.length) return;
    const template = templates[(Math.random() * templates.length) | 0];
    const ship = template.obj.clone(true);
    const mult = rand(0.7, 1.35);
    ship.scale.multiplyScalar(mult);

    const dir = new THREE.Vector3(rand(-1, 1), rand(-0.55, 0.55), rand(-1, 1));
    if (dir.lengthSq() < 0.05) dir.set(0, 0, -1);
    dir.normalize();

    const R = 32;
    const mid = new THREE.Vector3(rand(-4, 4), rand(-3, 3), rand(-7, 3));
    const start = mid.clone().addScaledVector(dir, -R);
    const end = mid.clone().addScaledVector(dir, R);

    ship.position.copy(start);
    ship.lookAt(end);
    // gentle roll for character
    ship.rotateZ(rand(-0.4, 0.4));
    scene.add(ship);

    // always-visible name box + elbow leader line, offset to a random side
    const tag = document.createElement('div');
    tag.className = 'ship-tag';
    tag.textContent = template.name;
    document.body.appendChild(tag);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('class', 'ship-line');
    linesSvg.appendChild(line);
    // label sits diagonally off a random side; padding is added on top of the
    // ship's apparent size each frame so it stays close but never overlaps.
    const hx = Math.random() < 0.5 ? -1 : 1;
    const vy = Math.random() < 0.5 ? -1 : 1;
    const padX = rand(46, 96);
    const padY = rand(40, 82);
    const radius = TARGET_SIZE * 0.6 * mult;   // approx world radius of the model

    ships.push({ obj: ship, start, end, t0: performance.now(), dur: rand(7000, 15000), tag, line, hx, vy, padX, padY, radius });
  }

  function disposeShip(s) {
    // clones share geometry/material with the template — just detach, don't dispose
    scene.remove(s.obj);
    s.tag?.remove();
    s.line?.remove();
  }

  // Position a ship's name box (offset to its random side, clamped on-screen)
  // and draw an elbow leader line back to the ship.
  const proj = new THREE.Vector3();
  function updateTag(s) {
    const W = window.innerWidth, H = window.innerHeight;
    proj.copy(s.obj.position).project(camera);
    const sx = (proj.x * 0.5 + 0.5) * W;
    const sy = (-proj.y * 0.5 + 0.5) * H;
    const offscreen = proj.z > 1 || sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60;
    if (offscreen) { s.tag.style.display = 'none'; s.line.style.display = 'none'; return; }
    s.tag.style.display = ''; s.line.style.display = '';

    // ship's apparent on-screen radius (pixels) from its depth
    const f = (H / 2) / Math.tan((camera.fov * Math.PI / 180) / 2);
    const dist = Math.max(0.6, Math.abs(camera.position.z - s.obj.position.z));
    const appR = s.radius * f / dist;

    const tw = s.tag.offsetWidth, th = s.tag.offsetHeight, m = 8;
    let cx = sx + s.hx * (appR + s.padX);
    let cy = sy + s.vy * (appR + s.padY);
    cx = Math.max(tw / 2 + m, Math.min(cx, W - tw / 2 - m));
    cy = Math.max(th / 2 + m, Math.min(cy, H - th / 2 - m));
    s.tag.style.left = (cx - tw / 2) + 'px';
    s.tag.style.top = (cy - th / 2) + 'px';

    // elbow: leave the ship vertically (with a gap so the line never touches
    // it), then run horizontally into the nearest box edge.
    const gap = appR + 8;
    const dirY = cy >= sy ? 1 : -1;
    let startY = sy + dirY * gap;
    startY = dirY > 0 ? Math.min(startY, cy) : Math.max(startY, cy);
    const bx = (cx > sx) ? cx - tw / 2 : cx + tw / 2;
    s.line.setAttribute('points', `${sx.toFixed(1)},${startY.toFixed(1)} ${sx.toFixed(1)},${cy.toFixed(1)} ${bx.toFixed(1)},${cy.toFixed(1)}`);
  }

  const tmp = new THREE.Vector3();
  function tick(now) {
    for (let i = ships.length - 1; i >= 0; i--) {
      const s = ships[i];
      const p = (now - s.t0) / s.dur;
      if (p >= 1) { disposeShip(s); ships.splice(i, 1); continue; }
      tmp.copy(s.start).lerp(s.end, p);
      s.obj.position.copy(tmp);
      s.obj.updateMatrixWorld();
      updateTag(s);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function schedule(delay) {
    setTimeout(() => {
      if (!document.hidden) {
        spawn();
        if (Math.random() < 0.25) setTimeout(spawn, rand(800, 2200));
      }
      schedule(rand(9000, 19000));
    }, delay);
  }
  schedule(rand(3000, 6000));
}
