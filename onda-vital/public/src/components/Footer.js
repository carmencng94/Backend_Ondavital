import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const footerStyles = `
.site-footer {
  background: hsl(var(--color-primary));
  color: white;
  padding: 0;
  margin-top: var(--space-2xl);
  font-size: var(--text-sm);
}

.footer-top-bar {
  background: rgba(0,0,0,0.1);
  padding: var(--space-sm) var(--space-lg);
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.footer-top-bar a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: var(--text-xs);
  transition: color var(--transition-fast);
}

.footer-top-bar a:hover {
  color: white;
}

.footer-main-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-2xl);
  padding: var(--space-2xl) var(--space-lg);
}

.footer-title {
  font-size: var(--text-xl);
  margin-bottom: var(--space-md);
  color: white;
}

.footer-desc {
  opacity: 0.8;
  margin-bottom: var(--space-md);
  line-height: 1.6;
}

.footer-schedule h4, .mini-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: hsl(var(--color-accent));
  margin-bottom: var(--space-sm);
}

.footer-schedule p {
  font-size: var(--text-xs);
  opacity: 0.9;
  margin-bottom: 2px;
}

.footer-socials {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.social-icon {
  color: white;
  opacity: 0.6;
  transition: all var(--transition-fast);
}

.social-icon:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.footer-whatsapp-cta {
  margin-top: var(--space-sm);
}

.footer-whatsapp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  padding: 8px 12px;
  font-size: var(--text-xs);
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.footer-whatsapp-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.footer-map-wrapper {
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}

.footer-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-form-group label {
  display: block;
  font-size: var(--text-xs);
  margin-bottom: 4px;
  opacity: 0.7;
}

.footer-form-group input, .footer-form-group textarea {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: white;
  font-family: inherit;
  font-size: var(--text-xs);
}

.btn-footer-submit {
  background: white;
  color: hsl(var(--color-primary));
  border: none;
  padding: 10px;
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: 4px;
}

.btn-footer-submit:hover {
  background: hsl(var(--color-accent));
  color: white;
}

.footer-bottom-bar {
  text-align: center;
  padding: var(--space-md);
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: var(--text-xs);
  opacity: 0.5;
}

.site-footer.hidden {
  display: none;
}

@media (max-width: 600px) {
  .footer-main-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .footer-socials { justify-content: center; }
  .footer-form { text-align: left; }
}
`;

export function Footer() {
  injectStyles('footer-styles', footerStyles);
  const c = window.siteContent || {};
  const rawPhone = String(c.contacto_telefono || '601 39 21 61');
  const waPhone = `34${rawPhone.replace(/\D/g, '')}`;
  const waLink = `https://wa.me/${waPhone}`;

  const container = h('footer', { id: 'main-footer', className: 'site-footer' },
    h('div', { className: 'footer-top-bar' },
      h('a', { href: '#' }, i18n.t('footer_link_contrato')),
      h('span', {}, ' | '),
      h('a', { href: '#' }, i18n.t('footer_link_privacidad')),
      h('span', {}, ' | '),
      h('a', { href: 'https://www.deawakening.com/', target: '_blank', rel: 'noopener noreferrer' }, i18n.t('quiro_visit_dea'))
    ),
    h('div', { className: 'container footer-main-grid' },
      // Columna 1: Info General
      h('div', { className: 'footer-col' },
        h('h3', { className: 'footer-title' }, i18n.t('footer_quiro_title')),
        h('p', { className: 'footer-desc' }, i18n.t('footer_desc')),
        h('p', { className: 'footer-addr' }, i18n.t('contacto_direccion')),
        h('div', { className: 'footer-schedule' },
          h('h4', {}, i18n.t('footer_schedule_title')),
          h('p', {}, h('strong', {}, 'L1: '), i18n.t('contacto_horarios_q1')),
          h('p', {}, h('strong', {}, 'L2: '), i18n.t('contacto_horarios_q2'))
        ),
        h('div', { className: 'footer-socials' },
          h('a', { href: '#', className: 'social-icon' }, 
            h('svg', { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor" }, 
              h('path', { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" })
            )
          ),
          h('a', { href: '#', className: 'social-icon' }, 
            h('svg', { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor" }, 
              h('path', { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" })
            )
          )
        )
      ),
      // Columna 2: Mapa
      h('div', { className: 'footer-col footer-map-col' },
        h('h4', { className: 'mini-title' }, i18n.t('footer_location')),
        h('div', { className: 'footer-map-wrapper' },
          h('iframe', {
            src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.079158571901!2d2.629072076227549!3d39.58036630611775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129792626520677d%3A0x3a90b5467544c799!2sOnda%20Vital%20Holistic!5e0!3m2!1ses!2ses!4v1773658293705!5m2!1ses!2ses",
            width: "100%",
            height: "100%",
            style: "border:0;",
            allowfullscreen: "",
            loading: "lazy",
            referrerpolicy: "no-referrer-when-downgrade"
          })
        )
      ),
      // Columna 3: Contacto
      h('div', { className: 'footer-col' },
        h('h4', { className: 'mini-title' }, i18n.t('footer_contact')),
        h('p', { className: 'footer-email' }, i18n.t('contacto_email')),
        h('p', { className: 'footer-phone' }, i18n.t('footer_phone_label') + ' ', h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
        h('p', { className: 'footer-whatsapp' }, i18n.t('footer_wa_label') + ' ', h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } }), ' (David)'),
        h('div', { className: 'footer-whatsapp-cta' },
          h('a', {
            href: waLink,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'footer-whatsapp-link',
            'aria-label': 'Abrir WhatsApp para contactar con David'
          },
            h('svg', { viewBox: '0 0 24 24', width: '16', height: '16', fill: 'currentColor', 'aria-hidden': 'true' },
              h('path', { d: 'M20.5 3.5A11.86 11.86 0 0 0 12.05 0C5.55 0 .25 5.3.25 11.8c0 2.08.54 4.12 1.57 5.93L0 24l6.45-1.68a11.8 11.8 0 0 0 5.6 1.42h.01c6.5 0 11.8-5.29 11.8-11.8 0-3.15-1.22-6.1-3.36-8.44zm-8.45 18.2h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-3.82 1 1.02-3.72-.23-.38a9.8 9.8 0 0 1-1.5-5.22C2.14 6.4 6.53 2 12.04 2c2.62 0 5.08 1.02 6.94 2.88a9.74 9.74 0 0 1 2.88 6.94c0 5.52-4.4 9.89-9.81 9.89zm5.43-7.4c-.3-.16-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.23-.65.08-.3-.16-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.53-.08-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.09 3.19 5.07 4.47.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35z' })
            ),
            h('span', {}, 'WhatsApp David')
          )
        )
      ),
      // Columna 4: Formulario
      h('div', { className: 'footer-col' },
        h('h4', { className: 'mini-title' }, i18n.t('footer_form_title')),
        h('form', { className: 'footer-form' },
          h('div', { className: 'footer-form-group' },
            h('label', {}, i18n.t('footer_form_nombre')),
            h('input', { type: 'text', placeholder: i18n.t('footer_form_nombre_ph') })
          ),
          h('div', { className: 'footer-form-group' },
            h('label', {}, i18n.t('footer_form_email')),
            h('input', { type: 'email', placeholder: i18n.t('footer_form_email_ph') })
          ),
          h('div', { className: 'footer-form-group' },
            h('label', {}, i18n.t('footer_form_asunto')),
            h('textarea', { placeholder: i18n.t('footer_form_asunto_ph') })
          ),
          h('button', { type: 'button', className: 'btn-footer-submit' }, i18n.t('footer_form_submit'))
        )
      )
    ),
    h('div', { className: 'footer-bottom-bar' },
      h('p', {}, i18n.t('footer_copyright'))
    )
  );

  // Lógica para ocultar en contacto
  document.addEventListener('tab-change', (e) => {
    const tabId = e.detail;
    if (tabId === 'contacto') {
      container.classList.add('hidden');
    } else {
      container.classList.remove('hidden');
    }
  });

  return container;
}
