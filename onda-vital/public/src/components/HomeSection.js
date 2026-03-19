import { h } from '../utils.js';

export function HomeSection() {
  const c = window.siteContent || {};

  return h('section', { id: 'home', className: 'tab-section active' },
    // Hero con fondo de mar
    h('div', { className: 'hero-sea' },
      h('div', { className: 'hero-overlay' }),
      h('div', { className: 'hero-content container' },
        h('h1', { className: 'hero-main-title' }, c.home_hero_title || 'Nuestro Enfoque Eres Tú'),
        h('p', { className: 'hero-subtitle' }, c.home_hero_subtitle || 'Vuelve a conectar con tu vitalidad natural'),
        h('div', { className: 'hero-glass-card' },
          h('p', {}, c.home_glass_p1 || 'Tu cuerpo tiene una capacidad innata de mantenerse sano,'),
          h('p', { style: { marginTop: '10px' } }, c.home_glass_p2 || 'Estamos aquí para ayudarte a recuperarla.')
        )
      )
    ),

    // Sección de Enfoque Detallado
    h('div', { className: 'container mission-focus' },
      h('div', { className: 'mission-grid' },
        h('div', { className: 'mission-text' },
          h('h2', {}, c.home_intro_title || 'Entendiendo el Desequilibrio'),
          h('p', {}, c.home_intro_desc || 'La vida diaria está llena de fuentes de estrés que interfieren con tu bienestar:'),
          h('ul', { className: 'stress-list' },
            h('li', {}, h('span', { className: 'dot' }), c.home_stress_1 || 'Estrés Físico (posturas, lesiones)'),
            h('li', {}, h('span', { className: 'dot' }), c.home_stress_2 || 'Estrés Mental (bloqueos, preocupaciones)'),
            h('li', {}, h('span', { className: 'dot' }), c.home_stress_3 || 'Estrés Emocional (tensiones acumuladas)')
          ),
          h('p', { className: 'consequence' }, c.home_stress_conc || 'Estas interferencias resultan en dolor, disfunción y malestar.')
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
          h('h2', {}, c.home_cta_title || 'Restaura tu habilidad de sanar'),
          h('p', {}, c.home_cta_desc || 'En Onda Vital trabajamos para que puedas disfrutar de una vida plena y libre de limitaciones.'),
          h('div', { className: 'line-divider' }),
          h('p', { className: 'final-tagline' }, c.home_cta_tagline || 'Mereces disfrutar de tu vida')
        )
      )
    )
  );
}
