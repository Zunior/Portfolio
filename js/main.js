/* main.js — entry point: wires all modules on DOM ready */

import { initI18n, onLanguageChange, t } from './i18n.js';
import { initStarfield } from './starfield.js';
import { initShips } from './ships.js';
import { initReveal, initScrollSpy } from './reveal.js';
import { initStatPanel } from './statPanel.js';
import { initCirclingMenu } from './circlingMenu.js';
import { initContact } from './contact.js';
import { initModal } from './modal.js';

/* --- Mobile nav toggle --- */
function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('.nav-link').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* --- Hero typewriter (re-runs on language change) --- */
function initTyped() {
  const el = document.getElementById('hero-typed');
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = 0;

  const run = () => {
    const text = t('intro-message', '');
    clearTimeout(timer);
    if (reduce) {
      el.innerHTML = `${text}<span class="caret">▌</span>`;
      return;
    }
    let i = 0;
    const tick = () => {
      el.innerHTML = text.slice(0, i) + '<span class="caret">▌</span>';
      if (i < text.length) {
        i++;
        timer = setTimeout(tick, 28);
      }
    };
    tick();
  };

  onLanguageChange(run);
}

/* Toggle `past-hero` on <body> when the hero section scrolls out of view, so
   the nav brand + corner avatar appear only on the non-hero sections. */
function initHeaderState() {
  const hero = document.getElementById('pocetna');
  if (!hero || !('IntersectionObserver' in window)) {
    document.body.classList.add('past-hero');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        document.body.classList.toggle('past-hero', e.intersectionRatio < 0.5);
      }
    },
    { threshold: [0, 0.5, 1] }
  );
  io.observe(hero);
}

async function boot() {
  initStarfield(document.getElementById('starfield'));
  initShips();
  initHeaderState();
  initNavToggle();
  initCirclingMenu();
  initStatPanel();
  initContact();
  initModal();
  initReveal();
  initScrollSpy();
  initTyped();
  await initI18n(); // loads translations, fires onLanguageChange listeners
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
