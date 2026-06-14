/* statPanel.js — Feature 1: RPG character-stat HUD on profile hover.
   Re-skinned to match the site's HUD panels. Pointer-following on
   desktop, pinned on touch/small screens, keyboard accessible. */

import { t, onLanguageChange } from './i18n.js';

const BASIC = [
  ['stat-strength', 'Strength', 60],
  ['stat-perception', 'Perception', 85],
  ['stat-agility', 'Agility', 90],
  ['stat-intelligence', 'Intelligence', 90],
  ['stat-charisma', 'Charisma', 70],
  ['stat-endurance', 'Endurance', 95],
  ['stat-creativity', 'Creativity', 55],
];
const PRO = [
  ['stat-motivation', 'Motivation', 100],
  ['stat-communication', 'Communication', 75],
  ['stat-collaboration', 'Collaboration', 80],
  ['stat-experience-gen', 'General exp', 75],
  ['stat-problem', 'Problem solving', 80],
  ['stat-studying', 'Studying speed', 70],
  ['stat-stress', 'Stress handling', 85],
];

function rows(list) {
  return list
    .map(
      ([key, fallback, val]) => `
      <div class="stat-row">
        <span class="name" data-stat="${key}">${t(key, fallback)}</span>
        <span class="val">${val}</span>
        <span class="stat-bar${val >= 90 ? ' is-high' : ''}"><span data-fill="${val}"></span></span>
      </div>`
    )
    .join('');
}

export function initStatPanel() {
  const trigger = document.getElementById('trigger');
  const panel = document.getElementById('stat-panel');
  if (!trigger || !panel) return;

  panel.innerHTML = `
    <div class="stat-head">
      <span class="who">SAŠA POPOVIĆ</span>
      <span class="lvl">LVL 99</span>
    </div>
    <h3 data-stat="stat-basic">${t('stat-basic', 'Basic stats')}</h3>
    ${rows(BASIC)}
    <h3 data-stat="stat-pro">${t('stat-pro', 'Pro stats')}</h3>
    ${rows(PRO)}
  `;

  // re-localize labels when language changes
  onLanguageChange(() => {
    panel.querySelectorAll('[data-stat]').forEach((el) => {
      const key = el.getAttribute('data-stat');
      const txt = t(key, el.textContent);
      if (txt) el.textContent = txt;
    });
  });

  const fillBars = () => {
    panel.querySelectorAll('[data-fill]').forEach((el) => {
      el.style.width = el.getAttribute('data-fill') + '%';
    });
  };
  const resetBars = () => {
    panel.querySelectorAll('[data-fill]').forEach((el) => (el.style.width = '0'));
  };

  const isTouch = window.matchMedia('(hover: none), (max-width: 720px)');

  function place(x, y) {
    if (isTouch.matches) return; // pinned position handled by CSS-ish inline below
    const pad = 16;
    const rect = panel.getBoundingClientRect();
    let left = x + 20;
    let top = y + 12;
    if (left + rect.width + pad > window.innerWidth) left = x - rect.width - 20;
    if (top + rect.height + pad > window.innerHeight) top = window.innerHeight - rect.height - pad;
    if (top < pad) top = pad;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  function pinUnderTrigger() {
    const r = trigger.getBoundingClientRect();
    const rect = panel.getBoundingClientRect();
    let left = r.left + r.width / 2 - rect.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - rect.width - 12));
    panel.style.left = left + 'px';
    panel.style.top = Math.min(r.bottom + 12, window.innerHeight - rect.height - 12) + 'px';
  }

  function open(x, y) {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (isTouch.matches) pinUnderTrigger();
    else place(x ?? window.innerWidth / 2, y ?? window.innerHeight / 2);
    requestAnimationFrame(fillBars);
  }
  function close() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    resetBars();
  }

  trigger.addEventListener('pointerenter', (e) => open(e.clientX, e.clientY));
  trigger.addEventListener('pointermove', (e) => {
    if (panel.classList.contains('is-open')) place(e.clientX, e.clientY);
  });
  trigger.addEventListener('pointerleave', close);

  // keyboard / touch: toggle on focus/click
  trigger.addEventListener('focus', () => open());
  trigger.addEventListener('blur', close);
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (panel.classList.contains('is-open')) close();
    else open(e.clientX || undefined, e.clientY || undefined);
  });
}
