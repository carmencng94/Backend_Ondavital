import { h } from '../utils.js';

export function HomeSection() {
  return h('section', { id: 'home', className: 'tab-section active' },
    h('div', { className: 'parallax-wrapper' },
      h('div', { className: 'parallax-header' },
        h('div', { className: 'parallax-bg' }),
        h('div', { className: 'parallax-title' },
          h('h2', { style: { fontWeight: '300', letterSpacing: '2px' } }, 'Onda Vital Holistic'),
          h('h1', {}, 'Nuestro Enfoque Eres Tú'),
          h('p', {}, 'Vuelve a empezar cada día con ilusión')
        )
      ),
      h('div', { className: 'section-content' },
        h('div', { className: 'container', style: { textAlign: 'center', maxWidth: '900px' } },
          h('h2', { style: { fontWeight: '300' } }, 'Encuentra tu centro'),
          h('p', { style: { whiteSpace: 'pre-line', fontSize: '1.25rem', fontWeight: '300', lineHeight: '1.8' } }, `Tu cuerpo tiene una capacidad innata de mantenerse sano,

pero la vida diaria está llena de fuentes de estrés (físico, mental, emocional)

que interfieren con esta capacidad, resultando en dolor, disfunción y malestar.

* * *

En Onda Vital trabajamos para restaurar la habilidad de mantenerse sano a tu cuerpo

para que puedas disfrutar de una vida plena y libre de limitaciones. `)
        )
      )
    )
  );
}
