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

  return h('section', { id: 'contacto', className: 'tab-section' },
    h('div', { className: 'container' },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, i18n.t('contacto_title')),
      h('div', { className: 'contacto-grid' },
        h('div', { className: 'contacto-info' },
          h('div', { className: 'contact-method' },
            h('h3', {}, i18n.t('contacto_quiro_label')),
            h('p', { className: 'phone' }, h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
            h('div', { className: 'schedule' },
              h('p', {}, c.contacto_horarios_q1 || 'Lunes y Miércoles: 17:30 - 20h'),
              h('p', {}, c.contacto_horarios_q2 || 'Martes y Jueves: 10:30 - 13h')
            )
          ),
          h('div', { className: 'contact-method', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, i18n.t('contacto_salas_label')),
            h('p', {}, h('strong', {}, i18n.t('contacto_wa_label') + ' '), h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
            h('p', { className: 'contact-name' }, i18n.t('contacto_atencion'))
          ),
          h('div', { className: 'contact-location', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, i18n.t('contacto_dir_label')),
            h('p', {}, c.contacto_direccion || 'c/ Martí Boneo, 31 bajos, 07013 Palma de Mallorca (Son Dameto)')
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
