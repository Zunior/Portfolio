/* circlingMenu.js — Feature 2: nav-item text that circles around a HUD
   ring on hover/focus. Re-skinned to the site's cyan HUD accent.
   Modern reimplementation: SVG <textPath> with startOffset advanced via
   requestAnimationFrame (no SMIL). The glowing arc spins via CSS. */

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK = 'http://www.w3.org/1999/xlink';
// circle path, radius 30, centred at 46,46 inside a 92x92 ring
const RING_PATH = 'M 16,46 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0';

let uid = 0;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildRing(label) {
  const id = `ringpath-${uid++}`;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'nav-ring');
  svg.setAttribute('viewBox', '0 0 92 92');
  svg.setAttribute('aria-hidden', 'true');

  const defs = document.createElementNS(SVG_NS, 'defs');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('id', id);
  path.setAttribute('d', RING_PATH);
  defs.appendChild(path);

  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('class', 'ring-circle');
  circle.setAttribute('cx', '46'); circle.setAttribute('cy', '46'); circle.setAttribute('r', '30');

  const arc = document.createElementNS(SVG_NS, 'circle');
  arc.setAttribute('class', 'ring-arc');
  arc.setAttribute('cx', '46'); arc.setAttribute('cy', '46'); arc.setAttribute('r', '30');

  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('class', 'ring-text');
  const tp = document.createElementNS(SVG_NS, 'textPath');
  tp.setAttributeNS(XLINK, 'xlink:href', `#${id}`);
  tp.setAttribute('href', `#${id}`);
  tp.setAttribute('startOffset', '25%');
  // repeat label around the ring so it reads continuously while spinning
  tp.textContent = `${label}   ·   ${label}   ·   `;
  text.appendChild(tp);

  svg.append(defs, circle, arc, text);
  return { svg, tp };
}

export function initCirclingMenu() {
  const items = document.querySelectorAll('.nav-item');

  items.forEach((item) => {
    const link = item.querySelector('.nav-link');
    if (!link) return;

    const { svg, tp } = buildRing(link.textContent.trim());
    item.appendChild(svg);

    // keep ring label in sync when language changes
    const sync = () => { tp.textContent = `${link.textContent.trim()}   ·   ${link.textContent.trim()}   ·   `; };
    new MutationObserver(sync).observe(link, { childList: true, characterData: true, subtree: true });

    let raf = 0;
    let offset = 25;

    const spin = () => {
      offset = (offset + 0.45) % 100;
      tp.setAttribute('startOffset', offset + '%');
      raf = requestAnimationFrame(spin);
    };
    const start = () => {
      if (reduce || raf) return;
      raf = requestAnimationFrame(spin);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      tp.setAttribute('startOffset', '25%');
    };

    item.addEventListener('pointerenter', start);
    item.addEventListener('pointerleave', stop);
    link.addEventListener('focus', start);
    link.addEventListener('blur', stop);
  });
}
