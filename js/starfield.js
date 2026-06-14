/* starfield.js — lightweight animated starfield on a canvas.
   Respects prefers-reduced-motion (renders a static field). */

export function initStarfield(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let w = 0, h = 0, raf = 0;
  const COLORS = ['#ffffff', '#7af0ff', '#8a5bff', '#ff3cac'];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.round((w * h) / 9000); // density
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,         // depth -> size/speed
      tw: Math.random() * Math.PI * 2,       // twinkle phase
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }));
  }

  function frame(time) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const r = s.z * 1.6;
      const alpha = reduce ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(time / 900 + s.tw));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (!reduce) {
        s.y += s.z * 0.12;            // slow drift downward
        if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (reduce) {
    frame(0);
    cancelAnimationFrame(raf);   // single static paint
  } else {
    raf = requestAnimationFrame(frame);
  }
}
