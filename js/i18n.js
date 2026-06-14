/* i18n.js — localization via data-i18n attributes, EN/SR, localStorage */

export let currentTranslations = {};
const listeners = new Set();

/** Subscribe to language changes; callback receives the translations object. */
export function onLanguageChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function t(key, fallback = '') {
  return currentTranslations[key] ?? fallback;
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    const data = await res.json();
    currentTranslations = data;
    applyTranslations(data);
    document.documentElement.lang = lang;
    listeners.forEach((cb) => cb(data));
  } catch (err) {
    console.error(`Error loading language file: ${lang}.json`, err);
  }
}

function applyTranslations(data) {
  // textContent targets
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key in data) el.textContent = data[key];
  });
  // placeholder targets
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key in data) el.setAttribute('placeholder', data[key]);
  });
}

export function initI18n() {
  const toggle = document.getElementById('language-toggle');
  const saved = localStorage.getItem('language') || 'sr';

  if (toggle) {
    toggle.checked = saved === 'sr';
    toggle.addEventListener('change', () => {
      const lang = toggle.checked ? 'sr' : 'en';
      localStorage.setItem('language', lang);
      loadLanguage(lang);
    });
  }
  return loadLanguage(saved);
}
