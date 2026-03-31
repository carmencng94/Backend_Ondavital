import { h } from '../utils.js';
import { i18n } from '../i18n.js';

export function AboutSection() {
  const c = window.siteContent || {};

  return h('section', { id: 'about', className: 'section-content tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px', textAlign: 'center' } },
      h('h2', { style: { fontWeight: '300' } }, i18n.t('about_title')),
      h('hr', { style: { width: '50px', margin: '2rem auto', border: 'none', borderTop: '2px solid hsl(var(--color-primary))' } }),
      h('p', { style: { fontSize: '1.25rem', fontWeight: '300', lineHeight: '1.8' } },
        i18n.t('about_desc')
      ),
      h('div', { className: 'info-grid', style: { marginTop: 'var(--space-xl)', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' } },
        h('div', {},
          h('h3', {}, i18n.t('about_quiro_title')),
          h('p', {}, i18n.t('contacto_horarios_q1')),
          h('p', {}, i18n.t('contacto_horarios_q2'))
        ),
        h('div', {},
          h('h3', {}, i18n.t('about_salas_title')),
          h('p', {}, 'WhatsApp: ', h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
          h('p', {}, i18n.t('about_salas_coordinator'))
        )
      )
    )
  );
}
