import { h, injectStyles } from '../utils.js';

const homeStyles = `
/* Hero Sea Style */
.hero-sea {
  position: relative;
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/assets/images/sea_background.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding-top: 120px; /* Más espacio para el título */
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 2;
}

.hero-main-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 200;
  letter-spacing: -1px;
  margin-bottom: var(--space-xs);
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: var(--text-xl);
  opacity: 0.9;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: var(--space-xl);
}

.hero-glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: var(--space-xl) var(--space-2xl);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
  font-size: var(--text-lg);
  font-weight: 300;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: fadeInDownHero 1s ease-out;
}

/* Mission Focus Section */
.mission-focus {
  padding: var(--space-2xl) 0;
}

.mission-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-2xl);
  align-items: center;
}

@media (max-width: 900px) {
  .mission-grid { grid-template-columns: 1fr; text-align: center; }
  .mission-visual { display: none; }
}

.mission-text h2 {
  font-size: var(--text-3xl);
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-md);
}

.stress-list {
  list-style: none;
  margin: var(--space-lg) 0;
}

.stress-list li {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  font-size: var(--text-lg);
  color: hsl(var(--color-text-muted));
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
}

.consequence {
  font-style: italic;
  font-weight: 500;
  margin-top: var(--space-lg);
  color: hsl(var(--color-text));
}

.mission-visual {
  display: flex;
  justify-content: center;
}

.focus-circle {
  width: 320px;
  height: 320px;
  border: 1px solid hsl(var(--color-primary) / 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: white;
  box-shadow: var(--shadow-lg);
}

.focus-img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
}

/* Full CTA Section */
.full-cta-section {
  background: hsl(var(--color-primary-light) / 0.2);
  padding: var(--space-2xl) 0;
  text-align: center;
}

.cta-inner {
  max-width: 700px;
  margin: 0 auto;
}

.cta-inner h2 {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-md);
}

.line-divider {
  height: 1px;
  width: 80px;
  background: var(--color-accent);
  margin: var(--space-xl) auto;
}

.final-tagline {
  font-size: var(--text-2xl);
  font-style: italic;
  font-weight: 200;
  color: hsl(var(--color-primary));
}

@keyframes fadeInDownHero {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export function HomeSection() {
  injectStyles('home-styles', homeStyles);
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
