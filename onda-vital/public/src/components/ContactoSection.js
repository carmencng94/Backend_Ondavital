import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const contactStyles = `
.contacto-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-2xl);
  align-items: start;
}

@media (max-width: 900px) {
  .contacto-grid { grid-template-columns: 1fr; }
}

.contact-method h3, .contact-location h3 {
  color: hsl(var(--color-primary));
  font-size: var(--text-lg);
  margin-bottom: var(--space-sm);
}

.contact-wa-cta {
  margin-top: var(--space-md);
}

.wa-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  background: hsl(var(--color-primary));
  color: white;
  border-radius: var(--radius-full);
  padding: 10px 16px;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.wa-cta-link:hover {
  background: hsl(var(--color-primary-hover));
  transform: translateY(-1px);
}

.wa-cta-link svg {
  flex: 0 0 auto;
}

@media (max-width: 900px) {
  .contact-wa-cta {
    text-align: left;
  }
}

.contact-form {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid hsl(var(--color-border));
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: 4px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid hsl(var(--color-border));
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: var(--text-sm);
  transition: border-color var(--transition-fast);
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: hsl(var(--color-primary));
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: hsl(var(--color-primary));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: background var(--transition-fast);
  margin-top: var(--space-sm);
}

.btn-submit:hover {
  background: hsl(var(--color-primary-hover));
}

.tty {
  display: inline-block;
  font-style: normal;
}

.tty::after {
  content: var(--n);
  display: inline-block;
}

.map-container {
  height: 400px;
  background-image: url('../../map_placeholder_styled.png');
  background-size: cover;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid hsl(var(--color-border));
}
`;

export function ContactoSection() {
  injectStyles('contacto-styles', contactStyles);
  const c = window.siteContent || {};
  const rawPhone = String(c.contacto_telefono || '601 39 21 61');
  const waPhone = `34${rawPhone.replace(/\D/g, '')}`;
  const waLink = `https://wa.me/${waPhone}`;

  return h('section', { id: 'contacto', className: 'tab-section' },
    h('div', { className: 'container' },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, i18n.t('contacto_title')),
      h('div', { className: 'contacto-grid' },
        h('div', { className: 'contacto-info' },
          h('div', { className: 'contact-method' },
            h('h3', {}, i18n.t('contacto_quiro_label')),
            h('p', { className: 'phone' }, h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
            h('div', { className: 'schedule' },
              h('p', {}, i18n.t('contacto_horarios_q1')),
              h('p', {}, i18n.t('contacto_horarios_q2'))
            )
          ),
          h('div', { className: 'contact-method', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, i18n.t('contacto_salas_label')),
            h('p', {}, h('strong', {}, i18n.t('contacto_wa_label') + ' '), h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
            h('p', { className: 'contact-name' }, i18n.t('contacto_atencion')),
            h('div', { className: 'contact-wa-cta' },
              h('a', {
                href: waLink,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'wa-cta-link',
                'aria-label': 'Contactar por WhatsApp con David'
              },
                h('svg', { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'currentColor', 'aria-hidden': 'true' },
                  h('path', { d: 'M20.5 3.5A11.86 11.86 0 0 0 12.05 0C5.55 0 .25 5.3.25 11.8c0 2.08.54 4.12 1.57 5.93L0 24l6.45-1.68a11.8 11.8 0 0 0 5.6 1.42h.01c6.5 0 11.8-5.29 11.8-11.8 0-3.15-1.22-6.1-3.36-8.44zm-8.45 18.2h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-3.82 1 1.02-3.72-.23-.38a9.8 9.8 0 0 1-1.5-5.22C2.14 6.4 6.53 2 12.04 2c2.62 0 5.08 1.02 6.94 2.88a9.74 9.74 0 0 1 2.88 6.94c0 5.52-4.4 9.89-9.81 9.89zm5.43-7.4c-.3-.16-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.23-.65.08-.3-.16-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.53-.08-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.09 3.19 5.07 4.47.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35z' })
                ),
                h('span', {}, 'Escribir a David por WhatsApp')
              )
            )
          ),
          h('div', { className: 'contact-location', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, i18n.t('contacto_dir_label')),
            h('p', {}, i18n.t('contacto_direccion'))
          )
        ),
        h('div', { className: 'contacto-form-container' },
          h('form', { 
            className: 'contact-form',
            onsubmit: (e) => {
              e.preventDefault();
              alert(i18n.t('contacto_form_ok'));
              e.target.reset();
            }
          },
            h('div', { className: 'form-group' },
              h('label', {}, i18n.t('contacto_form_nombre')),
              h('input', { type: 'text', required: true, placeholder: i18n.t('contacto_form_nombre_ph') })
            ),
            h('div', { className: 'form-group' },
              h('label', {}, i18n.t('contacto_form_email')),
              h('input', { type: 'email', required: true, placeholder: i18n.t('contacto_form_email_ph') })
            ),
            h('div', { className: 'form-group' },
              h('label', {}, i18n.t('contacto_form_msg')),
              h('textarea', { rows: 4, placeholder: i18n.t('contacto_form_msg_ph') })
            ),
            h('button', { type: 'submit', className: 'btn-submit' }, i18n.t('contacto_form_submit'))
          )
        )
      ),
      h('div', { className: 'map-container', style: { marginTop: 'var(--space-2xl)' } })
    )
  );
}
