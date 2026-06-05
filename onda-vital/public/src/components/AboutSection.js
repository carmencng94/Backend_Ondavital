import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const aboutStyles = `
/* Premium Top Room Slider */
.about-carousel-container {
  position: relative;
  height: 400px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #fcfcfc;
}

.about-carousel-slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.about-carousel-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: var(--space-xl);
  text-align: left;
}

.about-carousel-slide.active {
  opacity: 1;
  z-index: 2;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%);
  z-index: 3;
}

.slide-info-card {
  position: relative;
  z-index: 4;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-xl);
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.5s ease 0.2s;
}

.about-carousel-slide.active .slide-info-card {
  transform: translateY(0);
  opacity: 1;
}

.slide-info-card h3 {
  color: hsl(var(--color-primary));
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 4px 0;
}

.slide-info-card p {
  color: hsl(var(--color-text-muted));
  font-size: var(--text-sm);
  line-height: 1.5;
  margin: 0;
}

.slide-badge {
  display: inline-block;
  background: hsl(var(--color-primary-light) / 0.1);
  color: hsl(var(--color-primary));
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
  letter-spacing: 0.5px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  z-index: 10;
  font-size: 1.2rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--color-primary));
}

.carousel-arrow:hover {
  background: white;
  transform: translateY(-50%) scale(1.05);
}

.carousel-arrow.prev { left: 16px; }
.carousel-arrow.next { right: 16px; }

.carousel-indicators {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator-dot.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

/* Alternating Grid Layout */
.about-alternating-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  margin: var(--space-2xl) 0;
}

.about-row {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: var(--space-xl);
  align-items: center;
  text-align: left;
}

.about-row.reverse {
  grid-template-columns: 0.88fr 1.12fr;
}

@media (max-width: 768px) {
  .about-row, .about-row.reverse {
    grid-template-columns: 1fr !important;
    gap: var(--space-md);
  }
}

.about-text-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm) 0;
}

.about-text-block h3 {
  font-size: var(--text-2xl);
  margin-top: 4px;
  margin-bottom: 8px;
}

.about-text-block p {
  font-size: 1.15rem;
  line-height: 1.75;
  color: hsl(var(--color-text-muted));
  margin: 0;
}

.block-tag {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-accent);
  letter-spacing: 1px;
}

.about-image-block {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  height: 320px;
  border: 1px solid rgba(0,0,0,0.05);
}

.about-image-block img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.about-row:hover .about-image-block img {
  transform: scale(1.03);
}

.about-info-grid {
  margin-top: var(--space-2xl);
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .about-carousel-container {
    height: 300px;
  }
  .slide-info-card {
    padding: var(--space-sm) var(--space-md);
    max-width: 90%;
  }
  .about-info-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}
`;

export function AboutSection() {
  injectStyles('about-styles', aboutStyles);
  const c = window.siteContent || {};

  const slides = [
    { name: i18n.t('sala_jardin_nombre'), desc: i18n.t('sala_jardin_desc'), img: '/assets/images/sala-jardin-enhanced.jpg' },
    { name: i18n.t('sala_azul_nombre'), desc: i18n.t('sala_azul_desc'), img: '/assets/images/sala-azul-enhanced.jpg' },
    { name: i18n.t('sala_despacho_plus_nombre'), desc: i18n.t('sala_despacho_plus_desc'), img: '/assets/images/despacho-plus-enhanced.jpg' },
    { name: i18n.t('sala_terapia_a_nombre'), desc: i18n.t('sala_terapia_a_desc'), img: '/assets/images/sala-terapia-a-enhanced.jpg' },
    { name: i18n.t('sala_terapia_b_nombre'), desc: i18n.t('sala_terapia_b_desc'), img: '/assets/images/sala-terapia-b-enhanced.jpg' }
  ];

  let currentIndex = 0;

  // Nodo contenedor de la sección
  const container = h('section', { id: 'about', className: 'section-content tab-section' },
    h('div', { className: 'container', style: { maxWidth: '1000px', textAlign: 'center', marginTop: '100px' } },
      h('h2', { style: { fontWeight: '300' }, 'data-i18n-key': 'about_title' }, i18n.t('about_title')),
      h('hr', { style: { width: '50px', margin: '2rem auto', border: 'none', borderTop: '2px solid hsl(var(--color-primary))' } }),

      // 1. Carrusel de Salas en la Cabecera
      h('div', { className: 'about-carousel-container' },
        h('div', { className: 'about-carousel-slides' },
          ...slides.map((slide, idx) => 
            h('div', { 
              className: `about-carousel-slide ${idx === 0 ? 'active' : ''}`,
              style: { backgroundImage: `url('${slide.img}')` }
            },
              h('div', { className: 'slide-overlay' }),
              h('div', { className: 'slide-info-card' },
                h('span', { className: 'slide-badge' }, i18n.t('nav_salas')),
                h('h3', {}, slide.name),
                h('p', {}, slide.desc)
              )
            )
          )
        ),
        h('button', { 
          className: 'carousel-arrow prev', 
          onclick: (e) => {
            e.stopPropagation();
            resetAutoSlide();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlides();
          } 
        }, '←'),
        h('button', { 
          className: 'carousel-arrow next', 
          onclick: (e) => {
            e.stopPropagation();
            resetAutoSlide();
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
          } 
        }, '→'),
        h('div', { className: 'carousel-indicators' },
          ...slides.map((_, idx) => 
            h('span', { 
              className: `indicator-dot ${idx === 0 ? 'active' : ''}`,
              onclick: (e) => {
                e.stopPropagation();
                resetAutoSlide();
                currentIndex = idx;
                updateSlides();
              }
            })
          )
        )
      ),

      // 2. Secciones de Historia / Pilares Alternados
      h('div', { className: 'about-alternating-grid' },
        // Fila 1: Quiropráctica (Texto izquierda, Imagen derecha)
        h('div', { className: 'about-row' },
          h('div', { className: 'about-text-block' },
            h('span', { className: 'block-tag' }, i18n.t('quiro_title')),
            h('h3', { style: { fontWeight: '400', color: 'hsl(var(--color-primary))' } }, i18n.t('services_nsa_title')),
            h('p', { 'data-i18n-key': 'about_desc_1' }, i18n.t('about_desc_1'))
          ),
          h('div', { className: 'about-image-block' },
            h('img', { src: '/assets/images/massage_bed.png', alt: 'Camilla de Masaje de Onda Vital' })
          )
        ),

        // Fila 2: Alquiler de Salas (Imagen izquierda, Texto derecha)
        h('div', { className: 'about-row reverse' },
          h('div', { className: 'about-image-block' },
            h('img', { src: '/assets/images/yoga_group.png', alt: 'Grupo haciendo Yoga en la Sala Jardín' })
          ),
          h('div', { className: 'about-text-block' },
            h('span', { className: 'block-tag' }, i18n.t('nav_salas')),
            h('h3', { style: { fontWeight: '400', color: 'hsl(var(--color-primary))' } }, i18n.t('salas_title')),
            h('p', { 'data-i18n-key': 'about_desc_2' }, i18n.t('about_desc_2'))
          )
        )
      ),

      // 3. Bloque de Horarios y Contacto
      h('div', { className: 'about-info-grid' },
        h('div', {},
          h('h3', { 'data-i18n-key': 'about_quiro_title' }, i18n.t('about_quiro_title')),
          h('p', { 'data-i18n-key': 'contacto_horarios_q1' }, i18n.t('contacto_horarios_q1')),
          h('p', { 'data-i18n-key': 'contacto_horarios_q2' }, i18n.t('contacto_horarios_q2'))
        ),
        h('div', {},
          h('h3', { 'data-i18n-key': 'about_salas_title' }, i18n.t('about_salas_title')),
          h('p', {}, 'WhatsApp: ', h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })),
          h('p', { 'data-i18n-key': 'about_salas_coordinator' }, i18n.t('about_salas_coordinator'))
        )
      )
    )
  );

  const updateSlides = () => {
    const slideEls = container.querySelectorAll('.about-carousel-slide');
    const dotEls = container.querySelectorAll('.indicator-dot');
    
    slideEls.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });
    
    dotEls.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  // Lógica de Autocarrusel automático cada 5 segundos
  const startAutoSlide = () => {
    if (window.aboutCarouselInterval) {
      clearInterval(window.aboutCarouselInterval);
    }
    window.aboutCarouselInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    }, 5000);
  };

  const resetAutoSlide = () => {
    startAutoSlide();
  };

  // Escuchar cambio de pestañas para pausar el carrusel cuando no sea visible y ahorrar recursos
  if (!window.tabChangeCarouselListenerRegistered) {
    document.addEventListener('tab-change', (e) => {
      if (e.detail !== 'about') {
        if (window.aboutCarouselInterval) {
          clearInterval(window.aboutCarouselInterval);
          window.aboutCarouselInterval = null;
        }
      } else {
        startAutoSlide();
      }
    });
    window.tabChangeCarouselListenerRegistered = true;
  }

  // Inicio de autodesplazamiento al crearse
  startAutoSlide();

  return container;
}
