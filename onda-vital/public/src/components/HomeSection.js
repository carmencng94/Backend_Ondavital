import { h } from '../utils.js';

export function HomeSection() {
  return h('section', { id: 'home', className: 'tab-section active' },
    // Hero con fondo de mar
    h('div', { className: 'hero-sea' },
      h('div', { className: 'hero-overlay' }),
      h('div', { className: 'hero-content container' },
        h('h1', { className: 'hero-main-title' }, 'Nuestro Enfoque Eres Tú'),
        h('p', { className: 'hero-subtitle' }, 'Vuelve a conectar con tu vitalidad natural'),
        h('div', { className: 'hero-glass-card' },
          h('p', {}, 'Tu cuerpo tiene una capacidad innata de mantenerse sano,'),
          h('p', { style: { marginTop: '10px' } }, 'Estamos aquí para ayudarte a recuperarla.')
        )
      )
    ),

    // Sección de Enfoque Detallado
    h('div', { className: 'container mission-focus' },
      h('div', { className: 'mission-grid' },
        h('div', { className: 'mission-text' },
          h('h2', {}, 'Entendiendo el Desequilibrio'),
          h('p', {}, 'La vida diaria está llena de fuentes de estrés que interfieren con tu bienestar:'),
          h('ul', { className: 'stress-list' },
            h('li', {}, h('span', { className: 'dot' }), 'Estrés Físico (posturas, lesiones)'),
            h('li', {}, h('span', { className: 'dot' }), 'Estrés Mental (bloqueos, preocupaciones)'),
            h('li', {}, h('span', { className: 'dot' }), 'Estrés Emocional (tensiones acumuladas)')
          ),
          h('p', { className: 'consequence' }, 'Estas interferencias resultan en dolor, disfunción y malestar.')
        ),
        h('div', { className: 'mission-visual' },
          h('div', { className: 'focus-circle' },
            h('img', { 
              src: 'assets/images/tree_life_home_v3.png', 
              alt: 'Árbol de la Vida Onda Vital',
              className: 'focus-img'
            })
          )
        )
      )
    ),

    // Sección Final CTA
    h('div', { className: 'full-cta-section' },
      h('div', { className: 'container' },
        h('div', { className: 'cta-inner' },
          h('h2', {}, 'Restaura tu habilidad de sanar'),
          h('p', {}, 'En Onda Vital trabajamos para que puedas disfrutar de una vida plena y libre de limitaciones.'),
          h('div', { className: 'line-divider' }),
          h('p', { className: 'final-tagline' }, 'Mereces disfrutar de tu vida')
        )
      )
    )
  );
}
