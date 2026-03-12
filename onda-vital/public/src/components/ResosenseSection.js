import { h } from '../utils.js';

export function ResosenseSection() {
  return h('section', { id: 'resosense', className: 'tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px' } },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, 'Resosense Formación y Clases'),
      h('div', { className: 'content-block' },
        h('p', {}, 'Resosense es un método único que combina respiración, sonido y conciencia corporal para elevar tu nivel de vitalidad y bienestar.'),
        h('p', {}, 'Ofrecemos tanto talleres de formación para profesionales como clases abiertas para cualquier persona que desee profundizar en su salud holística.')
      )
    )
  );
}
