import { h } from '../utils.js';

export function ResosenseSection() {
  const c = window.siteContent || {};

  return h('section', { id: 'resosense', className: 'tab-section' },
    h('div', { className: 'container reso-container' },
      
      // Hero & Logo Section
      h('div', { className: 'reso-hero-section' },
        h('div', { className: 'reso-hero-content' },
          h('div', { className: 'reso-logo-wrapper shadow-premium' },
            h('img', { 
              src: 'assets/images/Logo Resosense definitivo.png', 
              alt: 'Resosense Logo',
              className: 'reso-main-logo'
            })
          ),
          h('h2', { className: 'reso-title' }, c.reso_title || 'Resosense'),
          h('p', { className: 'reso-tagline' }, c.reso_subtitle || 'Una suave práctica de movimiento personal para un cambio profundo.')
        )
      ),

      // Definición con Imagen (Card Style)
      h('div', { className: 'reso-row' },
        h('div', { className: 'reso-text-col' },
          h('div', { className: 'reso-info-card shadow-premium' },
            h('h3', {}, c.reso_question || '¿Qué es Resosense?'),
            h('p', {}, c.reso_answer_1 || 'Resosense es una práctica personal en la que utilizas tus propios músculos para generar ondas de resonancia en tu cuerpo.'),
            h('p', { className: 'highlight-text' }, 
              'El movimiento suave en frecuencias específicas es simple y sus efectos se pueden ver en todos los sistemas del cuerpo, tanto físicos como energéticos.'
            )
          )
        ),
        h('div', { className: 'reso-img-col shadow-premium' },
          h('img', { src: 'assets/images/resosense_practice.png', alt: 'Práctica de Resosense', className: 'reso-side-img' })
        )
      ),

      // Historia (Card Style)
      h('div', { className: 'reso-row reverse' },
        h('div', { className: 'reso-img-col shadow-premium' },
          h('img', { src: 'assets/images/resosense_waves.png', alt: 'Ondas de Frecuencia', className: 'reso-side-img' })
        ),
        h('div', { className: 'reso-text-col' },
          h('div', { className: 'reso-info-card shadow-premium' },
            h('h3', {}, c.reso_origen_title || 'Nuestros Orígenes'),
            h('p', {}, c.reso_origen_desc || 'A partir de 2006, David reconoció por primera vez la existencia de frecuencias específicas de movimiento ondulatorio u oscilación en el cuerpo.'),
            h('p', {}, 
              'Tras un momento de epifanía, se dio cuenta de que lo que había encontrado era en realidad la frecuencia fundamental del cuerpo humano. Utilizando ese conocimiento, desarrolló el sistema que hoy es Resosense.'
            )
          )
        )
      ),

      // Beneficios Grid
      h('div', { className: 'reso-benefits-section' },
        h('h3', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)', color: 'hsl(var(--color-primary))' } }, '¿Por qué practicar Resosense?'),
        h('div', { className: 'reso-feature-grid' },
          h('div', { className: 'reso-feature-card shadow-premium' },
            h('h4', {}, 'Estado Natural'),
            h('p', {}, 'La práctica regular de Resosense te restaura a ti y a tu cuerpo a un estado más cercano a su condición original pura.')
          ),
          h('div', { className: 'reso-feature-card shadow-premium' },
            h('h4', {}, 'Liberación de Impactos'),
            h('p', {}, 'Ayuda a liberar la huella de los eventos de la vida que han impactado tu ser antes de que tengan la oportunidad de dejar una marca permanente.')
          )
        )
      ),

      // Formación / Cursos
      h('div', { className: 'reso-training-section shadow-premium' },
        h('div', { className: 'training-header' },
          h('h3', {}, 'Formación y Talleres'),
          h('p', {}, 'La práctica de Resosense se enseña en un curso de dos módulos (Básico y Avanzado) utilizando diversas modalidades de aprendizaje.')
        ),
        
        h('div', { className: 'training-modules' },
          h('div', { className: 'module-card' }, 'Módulo Básico'),
          h('div', { className: 'module-card' }, 'Módulo Avanzado')
        ),

        h('div', { className: 'training-extra-card shadow-premium' },
          h('p', {}, 
            'El formato suele ser de dos días durante un fin de semana, pero puede adaptarse a diferentes programas y lugares.'
          ),
          h('p', { className: 'professional-note' }, 
            'También existen formaciones profesionales para terapeutas interesados en compartir Resosense con sus clientes.'
          )
        )
      ),

      // Footer Final
      h('div', { className: 'section-footer-banner shadow-premium' },
        h('p', {}, 'Descubre la frecuencia fundamental de tu bienestar.')
      )
    )
  );
}
