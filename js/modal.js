/* modal.js — code-sample viewer using native <dialog>.
   Loads projekti.json once and renders slides for a given project key. */

let projectData = null;

async function loadData() {
  if (projectData) return projectData;
  const res = await fetch('projekti.json');
  projectData = await res.json();
  return projectData;
}

export function initModal() {
  const dialog = document.getElementById('code-modal');
  const body = document.getElementById('modal-body');
  const title = document.getElementById('modal-title');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  if (!dialog || !body) return;

  let slides = [];
  let index = 0;

  const show = (i) => {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
  };

  const render = (key, data) => {
    const project = data[key] || [];
    body.innerHTML = project
      .map((entry) => {
        const code = (entry.ceo_kod || [])
          .map(
            (part) => `
            <div>
              <div class="slide-name">${part.ime || ''}</div>
              ${part.kod || ''}
            </div>`
          )
          .join('');
        return `
          <div class="slide">
            <div class="code-block">
              <h4>${entry.imeKoda || ''}</h4>
              ${code}
            </div>
            <div class="slide-img">
              ${entry.slika ? `<img src="${entry.slika}" alt="${entry.imeKoda || 'preview'}" loading="lazy" />` : ''}
            </div>
          </div>`;
      })
      .join('');
    slides = [...body.querySelectorAll('.slide')];
    title.textContent = key.toUpperCase();
    show(0);
  };

  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = btn.getAttribute('data-modal');
      try {
        const data = await loadData();
        render(key, data);
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      } catch (err) {
        console.error('Could not load project data:', err);
      }
    });
  });

  closeBtn?.addEventListener('click', () => dialog.close());
  prevBtn?.addEventListener('click', () => show(index - 1));
  nextBtn?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => {
    // click on backdrop closes
    if (e.target === dialog) dialog.close();
  });
}
