import { h, injectStyles } from '../utils.js';

const resoStyles = `
.reso-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  padding: var(--space-2xl) var(--space-md);
}

.reso-hero-section {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.reso-logo-wrapper {
  width: 180px;
  height: 180px;
  margin: 0 auto var(--space-xl);
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}

.reso-main-logo {
  width: 100%;
  height: auto;
}

.reso-title {
  font-size: var(--text-4xl);
  color: hsl(var(--color-primary));
  font-weight: 200;
  margin-bottom: var(--space-xs);
}

.reso-tagline {
  font-size: var(--text-xl);
  font-style: italic;
  font-weight: 300;
  opacity: 0.8;
}

.reso-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
}

.reso-row.reverse .reso-text-col { order: 2; }
.reso-text-col { text-align: left; }

.reso-text-col h3 {
  font-size: var(--text-2xl);
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-md);
}

.reso-text-col p {
  font-size: var(--text-lg);
  color: hsl(var(--color-text-muted));
  margin-bottom: var(--space-md);
}

.highlight-text {
  border-left: 4px solid var(--color-accent);
  padding-left: var(--space-md);
  color: hsl(var(--color-text)) !important;
}

.reso-img-col {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.reso-side-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.reso-img-col:hover .reso-side-img { transform: scale(1.05); }

.reso-feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.reso-feature-card {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  text-align: left;
}

.reso-feature-card h4 {
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-sm);
  font-size: var(--text-xl);
}

.reso-info-card {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid hsl(var(--color-primary) / 0.05);
  height: 100%;
}

.reso-training-section {
  background: white;
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  text-align: left;
}

.training-header { margin-bottom: var(--space-xl); }
.training-header h3 {
  font-size: var(--text-2xl);
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-sm);
}

.training-modules {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.module-card {
  flex: 1;
  background: hsl(var(--color-primary-light));
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: var(--font-bold);
  color: hsl(var(--color-primary));
  border: 1px solid hsl(var(--color-primary) / 0.1);
}

.training-extra-card {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border-top: 4px solid var(--color-accent);
}

.section-footer-banner {
  background: hsl(var(--color-primary));
  color: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  text-align: center;
  font-style: italic;
  font-size: var(--text-xl);
  font-weight: 200;
  margin-top: var(--space-2xl);
}

@media (max-width: 768px) {
  .reso-row { grid-template-columns: 1fr; }
  .reso-row.reverse .reso-text-col { order: 0; }
  .reso-feature-grid { grid-template-columns: 1fr; }
}
`;

export function ResosenseSection() {
  injectStyles('reso-styles', resoStyles);
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
              c.reso_highlight || 'El movimiento suave en frecuencias específicas es simple y sus efectos se pueden ver en todos los sistemas del cuerpo, tanto físicos como energéticos.'
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
              c.reso_origen_extra || 'Tras un momento de epifanía, se dio cuenta de que lo que había encontrado era en realidad la frecuencia fundamental del cuerpo humano. Utilizando ese conocimiento, desarrolló el sistema que hoy es Resosense.'
            )
          )
        )
      ),

      // Beneficios Grid
      h('div', { className: 'reso-benefits-section' },
        h('h3', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)', color: 'hsl(var(--color-primary))' } }, c.reso_benefits_title || '¿Por qué practicar Resosense?'),
        h('div', { className: 'reso-feature-grid' },
          h('div', { className: 'reso-feature-card shadow-premium' },
            h('h4', {}, c.reso_feature1_title || 'Estado Natural'),
            h('p', {}, c.reso_feature1_desc || 'La práctica regular de Resosense te restaura a ti y a tu cuerpo a un estado más cercano a su condición original pura.')
          ),
          h('div', { className: 'reso-feature-card shadow-premium' },
            h('h4', {}, c.reso_feature2_title || 'Liberación de Impactos'),
            h('p', {}, c.reso_feature2_desc || 'Ayuda a liberar la huella de los eventos de la vida que han impactado tu ser antes de que tengan la oportunidad de dejar una marca permanente.')
          )
        )
      ),

      // Formación / Cursos
      h('div', { className: 'reso-training-section shadow-premium' },
        h('div', { className: 'training-header' },
          h('h3', {}, c.reso_training_title || 'Formación y Talleres'),
          h('p', {}, c.reso_training_desc || 'La práctica de Resosense se enseña en un curso de dos módulos (Básico y Avanzado) utilizando diversas modalidades de aprendizaje.')
        ),
        
        h('div', { className: 'training-modules' },
          h('div', { className: 'module-card' }, c.reso_training_mod1 || 'Módulo Básico'),
          h('div', { className: 'module-card' }, c.reso_training_mod2 || 'Módulo Avanzado')
        ),

        h('div', { className: 'training-extra-card shadow-premium' },
          h('p', {}, 
            c.reso_training_format || 'El formato suele ser de dos días durante un fin de semana, pero puede adaptarse a diferentes programas y lugares.'
          ),
          h('p', { className: 'professional-note' }, 
            c.reso_training_prof || 'También existen formaciones profesionales para terapeutas interesados en compartir Resosense con sus clientes.'
          )
        )
      ),

      // Footer Final
      h('div', { className: 'section-footer-banner shadow-premium' },
        h('p', {}, c.reso_banner_text || 'Descubre la frecuencia fundamental de tu bienestar.')
      )
    )
  );
}
