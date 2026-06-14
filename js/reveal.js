/* reveal.js — scroll reveals + active-nav syncing via IntersectionObserver */

export function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }
}

/** Highlight the nav item for the section currently in view. */
export function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = new Map();
  document.querySelectorAll('.nav-item .nav-link').forEach((a) => {
    links.set(a.getAttribute('href').slice(1), a.closest('.nav-item'));
  });
  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach((item) => item.classList.remove('active'));
          links.get(e.target.id)?.classList.add('active');
        }
      }
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => io.observe(s));
}
