/* contact.js — Formspree submit via fetch with localized status messages */

import { t } from './i18n.js';

export function initContact() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      setStatus(t('form_validation_message', 'Please correct the highlighted fields.'), 'err');
      form.reportValidity?.();
      return;
    }

    setStatus(t('form_sending_message', 'Sending…'), '');

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus(t('form_success_message', 'Thank you! Your message has been sent.'), 'ok');
        form.reset();
      } else {
        setStatus(t('form_error_message', 'There was a problem submitting your form.'), 'err');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus(t('form_networkerror_message', 'There was a network error.'), 'err');
    }
  });
}
