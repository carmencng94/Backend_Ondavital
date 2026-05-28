import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const aboutStyles = `
@keyframes highlightPulse {
  0% { transform: scale(1); text-shadow: 0 0 0 rgba(26, 77, 59, 0); color: hsl(var(--color-text)); }
  50% { transform: scale(1.02); text-shadow: 0 0 10px rgba(26, 77, 59, 0.3); color: hsl(var(--color-primary)); }
  100% { transform: scale(1); text-shadow: 0 0 0 rgba(26, 77, 59, 0); color: hsl(var(--color-text)); }
}

.animated-about-text {
  animation: highlightPulse 3s infinite ease-in-out;
  padding: 10px;
  border-radius: 8px;
  background: rgba(26, 77, 59, 0.05);
}
`;

export function AboutSection() {
  injectStyles('about-styles', aboutStyles);
  const c = window.siteContent || {};

  return h('section', { id: 'about', className: 'section-content tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px', textAlign: 'center', marginTop: '100px' } },
      h('h2', { style: { fontWeight: '300' } }, i18n.t('about_title')),
      h('hr', { style: { width: '50px', margin: '2rem auto', border: 'none', borderTop: '2px solid hsl(var(--color-primary))' } }),
      h('div', { className: 'animated-about-text' },
        h('p', { style: { fontSize: '1.35rem', fontWeight: '400', lineHeight: '1.8' } },
          i18n.t('about_desc')
        )
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
