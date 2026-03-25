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

/* AI Booking Home Section */
.ai-booking-home {
  margin-top: -60px;
  position: relative;
  z-index: 10;
  padding: 0 var(--space-md);
}

.ai-card {
  background: white;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  border: 1px solid hsl(var(--color-primary-light) / 0.3);
}

.ai-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.ai-icon-pulse {
  width: 40px;
  height: 40px;
  background: hsl(var(--color-primary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 0 0 0 rgba(26, 77, 59, 0.4);
  animation: pulse-ai 2s infinite;
}

.ai-input-group {
  display: flex;
  gap: var(--space-sm);
  background: #f8f9fa;
  padding: 6px;
  border-radius: var(--radius-lg);
  border: 1px solid #eee;
}

.ai-input-group input {
  flex: 1;
  border: none;
  background: transparent;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-main);
  font-size: var(--text-md);
  outline: none;
}

.ai-search-btn {
  background: hsl(var(--color-primary));
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-xl);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-search-btn:hover {
  background: hsl(var(--color-primary-hover));
  transform: translateY(-1px);
}

@keyframes pulse-ai {
  0% { box-shadow: 0 0 0 0 rgba(26, 77, 59, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(26, 77, 59, 0); }
  100% { box-shadow: 0 0 0 0 rgba(26, 77, 59, 0); }
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

/* Quick Availability Home */
.quick-avail-home {
  margin-top: var(--space-xl);
}

.avail-tabs-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: white;
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  border: 1px solid #eee;
}

.room-tabs {
  display: flex;
  gap: var(--space-sm);
  border-bottom: 1px solid #eee;
  padding-bottom: var(--space-sm);
}

.room-tab-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: var(--radius-md);
  color: #666;
  font-weight: 500;
  transition: all 0.2s;
}

.room-tab-btn.active {
  background: hsl(var(--color-primary-light) / 0.1);
  color: hsl(var(--color-primary));
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
        h('h1', { className: 'hero-main-title' }, 'Espacios para Crecer'),
        h('p', { className: 'hero-subtitle' }, 'Tu evento o terapia en el mejor entorno de Onda Vital'),
        h('div', { className: 'hero-glass-card' },
          h('p', {}, 'Alquiler de salas equipadas y gestionadas para tu éxito.'),
          h('p', { style: { marginTop: '10px' } }, 'Encuentra el lugar perfecto para tu propósito.')
        )
      )
    ),

    // Sección: Booking IA + Vista Rápida de Disponibilidad
    h('div', { className: 'ai-booking-home container' },
      h('div', { className: 'ai-card' },
        h('div', { className: 'ai-card-header' },
          h('div', { className: 'ai-icon-pulse' }, '✦'),
          h('div', {},
            h('h3', { style: { margin: 0, fontSize: '1.2rem' } }, 'Reserva Directa con IA'),
            h('p', { style: { margin: 0, fontSize: '0.9rem', color: '#666' } }, 'Indica qué sala necesitas y cuándo, yo me encargo del resto.')
          )
        ),
        h('div', { className: 'ai-input-group' },
          h('input', { 
            id: 'home-ai-input',
            type: 'text', 
            placeholder: 'Ej: Quiero reservar la Sala Jardín para el lunes...',
            onkeydown: (e) => {
              if (e.key === 'Enter') {
                const val = e.target.value;
                if (val) {
                  document.dispatchEvent(new CustomEvent('abrir-chat-asistente', { detail: val }));
                  e.target.value = '';
                }
              }
            }
          }),
          h('button', { 
            className: 'ai-search-btn',
            onclick: () => {
              const input = document.getElementById('home-ai-input');
              if (input && input.value) {
                document.dispatchEvent(new CustomEvent('abrir-chat-asistente', { detail: input.value }));
                input.value = '';
              }
            }
          }, 'Consultar')
        ),

        // Vista Rápida de Disponibilidad (Unified Booking Grid)
        h('div', { className: 'quick-avail-home' },
          h('div', { id: 'home-booking-grid-container' })
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
          h('h2', {}, 'Un Espacio para Cada Necesidad'),
          h('p', {}, 'Además de nuestras salas, colaboramos con profesionales externos para ofrecerte un bienestar integral.'),
          h('div', { className: 'line-divider' }),
          h('a', { 
            href: 'https://deawakening.site', 
            target: '_blank',
            className: 'final-tagline',
            style: { textDecoration: 'none', display: 'block', cursor: 'pointer' }
          }, '✦ Visita Deawakening - Nuestra plataforma aliada')
        )
      )
    )
  );
}

// Inyección inicial diferida para cargar el Global Grid
setTimeout(async () => {
    const container = document.getElementById('home-booking-grid-container');
    if (container) {
      const { BookingGrid } = await import('./booking/BookingGrid.js');
      container.appendChild(BookingGrid({
        onReserve: (reservaDetails) => {
           const texto = `Hola, quiero pre-reservar la sala *${reservaDetails.sala}*.\n\n- Fecha: ${reservaDetails.fecha}\n- Horario: ${reservaDetails.slots.join(', ')}h\n\n¿Me confirmas disponibilidad?`;
           window.open(`https://wa.me/34601392161?text=${encodeURIComponent(texto)}`, '_blank');
        }
      }));
    }
}, 200);
