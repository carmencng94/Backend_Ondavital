import { h, injectStyles } from '../utils.js';

const salasStyles = `
/* Grid de Salas */
.salas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
  padding: var(--space-md);
}

@media (min-width: 768px) {
  .salas-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--space-xl);
    padding: var(--space-xl) var(--space-2xl);
  }
}

.sala-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  border: 1px solid hsl(var(--color-border));
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.sala-card:hover { 
  transform: translateY(-8px); 
  box-shadow: var(--shadow-lg);
}

.sala-img {
  width: 100%;
  height: 260px;
  background-color: hsl(var(--color-primary-light));
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.sala-card:hover .sala-img {
  transform: scale(1.05);
}

.sala-badge {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: white;
  color: hsl(var(--color-primary));
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-sm);
  z-index: 2;
}

.sala-info {
  padding: var(--space-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sala-info h3 { color: hsl(var(--color-primary)); margin-bottom: var(--space-xs); }
.sala-capacity { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); }

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.learn-more {
  font-size: var(--text-sm);
  color: hsl(var(--color-primary));
  font-weight: var(--font-medium);
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.btn-check-availability {
  background: transparent;
  border: 1.5px solid hsl(var(--color-primary));
  color: hsl(var(--color-primary));
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-check-availability:hover {
  background: hsl(var(--color-primary));
  color: white;
}

/* Modal de Salas */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  z-index: 10005;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  padding: var(--space-md);
}

.modal-overlay.active { opacity: 1; }

.sala-modal {
  width: min(900px, 100%);
  max-height: 90vh;
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-premium);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 40px; height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(4px);
  cursor: pointer;
  z-index: 10;
  font-size: 1.2rem;
  box-shadow: var(--shadow-sm);
}

.carousel-container {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.carousel-nav {
  position: absolute;
  top: 50%; width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--space-lg);
  transform: translateY(-50%);
}

.nav-prev, .nav-next {
  width: 45px; height: 45px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  font-size: 1.2rem;
}

.carousel-dots {
  position: absolute;
  bottom: var(--space-md);
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.carousel-dots .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-dots .dot.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

.sala-modal-content {
  padding: var(--space-2xl);
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-2xl);
}

@media (max-width: 768px) {
  .sala-modal-content { grid-template-columns: 1fr; }
  .carousel-container { height: 260px; }
}

.modal-header-text h2 {
  font-size: var(--text-3xl);
  color: hsl(var(--color-primary));
}

.modal-dims {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.modal-desc {
  font-size: 1.1rem;
  line-height: 1.7;
  color: hsl(var(--color-text));
  margin-bottom: var(--space-xl);
}

.features-list {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.features-list li::before {
  content: '✓';
  color: hsl(var(--color-primary));
  margin-right: 8px;
  font-weight: bold;
}

.rates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.rate-card {
  background: hsl(var(--color-primary-light) / 0.1);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
}

.rate-card span { font-size: var(--text-xs); color: var(--color-text-muted); }
.rate-card strong { font-size: var(--text-lg); color: hsl(var(--color-primary)); }

.modal-cta { margin-top: var(--space-2xl); }
.btn-check-availability.primary {
  width: 100%;
  padding: 16px;
  background: hsl(var(--color-primary));
  color: white;
  font-size: 1.1rem;
}
`;

export function SalasSection() {
  injectStyles('salas-styles', salasStyles);
  const c = window.siteContent || {};

  const container = h('section', { id: 'salas', className: 'tab-section' },
    h('div', { className: 'container' },
      h('h2', { style: { textAlign: 'center' } }, c.salas_header_title || 'Salas Polivalentes'),
      h('p', { style: { textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' } },
        c.salas_header_subtitle || 'Un oasis en plena ciudad para clases, talleres o terapias.'
      ),
      h('div', { id: 'salas-grid', className: 'salas-grid' },
        h('p', { className: 'salas-loading' }, 'Cargando salas...')
      )
    )
  );

  const cargarSalas = async () => {
    const grid = container.querySelector('#salas-grid');
    try {
      const response = await fetch('/api/salas');
      const data = await response.json();
      if (data.success && data.salas) {
        grid.innerHTML = '';
        data.salas.forEach(sala => {
          grid.appendChild(SalaCard(sala));
        });
      }
    } catch (error) {
      grid.innerHTML = '<p class="salas-error">Error al cargar el catálogo.</p>';
    }
  };

  setTimeout(cargarSalas, 0);

  return container;
}

function SalaCard(sala) {
  const mainImage = sala.imagenes && sala.imagenes[0] ? sala.imagenes[0] : '/assets/images/placeholder.png';

  return h('div', { 
    className: 'sala-card',
    onclick: (e) => {
      if (e.target.closest('.btn-check-availability')) return;
      document.body.appendChild(SalaModal(sala));
    }
  },
    h('div', { 
      className: 'sala-img', 
      style: { backgroundImage: `url('${mainImage}')` } 
    },
      h('div', { className: 'sala-badge' }, sala.tarifas.hora)
    ),
    h('div', { className: 'sala-info' },
      h('h3', {}, sala.nombre),
      h('p', { className: 'sala-capacity' }, `${sala.capacidad} | ${sala.dimensiones}`),
      h('div', { className: 'card-footer' },
        h('span', { className: 'learn-more' }, 'Más detalles +'),
        h('button', {
          className: 'btn-check-availability',
          onclick: (e) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent('consultar-sala', { detail: sala.nombre }));
          }
        }, 'Ver Disponibilidad')
      )
    )
  );
}

function SalaModal(sala) {
  let currentIndex = 0;
  const images = sala.imagenes || ['/assets/images/placeholder.png'];

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => modalOverlay.remove(), 400);
  };

  const updateCarousel = (index) => {
    currentIndex = (index + images.length) % images.length;
    const slidesContainer = modalOverlay.querySelector('.carousel-slides');
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    const dots = modalOverlay.querySelectorAll('.dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx === currentIndex));
  };

  const modalOverlay = h('div', { 
    className: 'modal-overlay',
    onclick: (e) => { if (e.target === modalOverlay) closeModal(); }
  },
    h('div', { className: 'sala-modal' },
      h('button', { className: 'modal-close', onclick: closeModal }, '✕'),
      
      h('div', { className: 'carousel-container' },
        h('div', { className: 'carousel-slides' },
          ...images.map(img => 
            h('div', { 
              className: 'carousel-slide', 
              style: { backgroundImage: `url('${img}')` } 
            })
          )
        ),
        images.length > 1 ? h('div', { className: 'carousel-nav' },
          h('button', { className: 'nav-prev', onclick: () => updateCarousel(currentIndex - 1) }, '←'),
          h('button', { className: 'nav-next', onclick: () => updateCarousel(currentIndex + 1) }, '→')
        ) : null,
        h('div', { className: 'carousel-dots' },
          ...images.map((_, idx) => 
            h('span', { 
              className: `dot ${idx === 0 ? 'active' : ''}`,
              onclick: () => updateCarousel(idx)
            })
          )
        )
      ),

      h('div', { className: 'sala-modal-content' },
        h('div', { className: 'sala-modal-info' },
          h('div', { className: 'modal-header-text' },
            h('h2', {}, sala.nombre),
            h('p', { className: 'modal-dims' }, sala.dimensiones)
          ),
          h('p', { className: 'modal-desc' }, sala.descripcionLarga || 'Sin descripción disponible.'),
          
          h('div', { className: 'sala-features' },
            h('h4', {}, 'Equipamiento y Servicios'),
            h('ul', { className: 'features-list' },
              ...(sala.equipamiento || []).map(f => h('li', {}, f))
            )
          )
        ),

        h('div', { className: 'sala-modal-side' },
          h('div', { className: 'sala-rates' },
            h('h4', {}, 'Estructura de Tarifas'),
            h('div', { className: 'rates-grid' },
              h('div', { className: 'rate-card' }, h('span', {}, 'Hora'), h('strong', {}, sala.tarifas.hora)),
              h('div', { className: 'rate-card' }, h('span', {}, 'Día'), h('strong', {}, sala.tarifas.dia)),
              h('div', { className: 'rate-card' }, h('span', {}, 'Bono (10h)'), h('strong', {}, sala.tarifas.bono)),
              h('div', { className: 'rate-card' }, h('span', {}, 'Mensual'), h('strong', {}, sala.tarifas.mensual))
            )
          ),

          h('div', { className: 'modal-cta' },
            h('button', {
              className: 'btn-check-availability primary',
              onclick: () => {
                closeModal();
                document.dispatchEvent(new CustomEvent('consultar-sala', { detail: sala.nombre }));
              }
            }, 'Ver Disponibilidad Real')
          )
        )
      )
    )
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalOverlay.classList.add('active');
    });
  });

  return modalOverlay;
}
