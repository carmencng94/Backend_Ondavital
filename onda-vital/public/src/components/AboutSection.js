import { h } from '../utils.js';

export function AboutSection() {
  const c = window.siteContent || {};

  return h('section', { id: 'about', className: 'section-content tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px', textAlign: 'center' } },
      h('h2', { style: { fontWeight: '300' } }, c.about_title || 'Mereces disfrutar de tu vida'),
      h('hr', { style: { width: '50px', margin: '2rem auto', border: 'none', borderTop: '2px solid hsl(var(--color-primary))' } }),
      h('p', { style: { fontSize: '1.25rem', fontWeight: '300', lineHeight: '1.8' } },
        c.about_desc || 'Venir a Onda Vital es regalarte un tiempo para ti. Un espacio para sentir y tomar la mejor decisión para tu salud y tu vida.'
      ),
      h('div', { className: 'info-grid', style: { marginTop: 'var(--space-xl)', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' } },
        h('div', {},
          h('h3', {}, c.about_quiro_title || 'Horario de Quiropráctica'),
          h('p', {}, c.contacto_horarios_q1 || 'Lunes y Miércoles: 17:30 - 20h'),
          h('p', {}, c.contacto_horarios_q2 || 'Martes y Jueves: 10:30 - 13h')
        ),
        h('div', {},
          h('h3', {}, c.about_salas_title || 'Contacto Salas'),
          h('p', {}, 'WhatsApp: ', h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
          h('p', {}, c.about_salas_coordinator || 'David - Coordinador de Espacios')
        )
      )
    )
  );
}
