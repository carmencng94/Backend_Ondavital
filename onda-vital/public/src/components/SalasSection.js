import { h, injectStyles } from '../utils.js';
import { BookingGrid } from './booking/BookingGrid.js';
import { i18n } from '../i18n.js';

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

.rate-card {
  background: hsl(var(--color-primary-light) / 0.1);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  user-select: none;
}

.rate-card:hover {
  background: hsl(var(--color-primary-light) / 0.2);
  transform: translateY(-2px);
}

.rate-card.active {
  border-color: hsl(var(--color-primary));
  background: hsl(var(--color-primary-light) / 0.3);
  box-shadow: var(--shadow-sm);
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

  const container = h('section', { id: 'salas', className: 'tab-section' },
    h('div', { className: 'container' },
      h('div', { className: 'salas-header-wrapper', style: { textAlign: 'center', marginBottom: 'var(--space-2xl)' } },
        h('h2', { className: 'section-title' }, i18n.t('salas_title')),
        h('p', { className: 'section-subtitle', style: { maxWidth: '800px', margin: '0 auto var(--space-xl)' } },
          i18n.t('salas_subtitle')
        )
      ),
      h('div', { id: 'salas-grid', className: 'salas-grid' },
        h('p', { className: 'salas-loading' }, i18n.t('salas_loading'))
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
      grid.innerHTML = `<p class="salas-error">${i18n.t('salas_error')}</p>`;
    }
  };

  setTimeout(cargarSalas, 0);

  return container;
}

function SalaCard(sala) {
  const mainImage = sala.imagenes && sala.imagenes[0] ? sala.imagenes[0] : '/assets/images/placeholder.png';
  const roomKey = sala.dbKey || ('sala_' + sala.id.replace(/-/g, '_'));

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
      h('h3', {}, i18n.t(roomKey + '_nombre') || sala.nombre),
      h('p', { className: 'sala-capacity' }, 
        (i18n.t(roomKey + '_capacidad') || sala.capacidad) + ' | ' + (i18n.t(roomKey + '_dimensiones') || sala.dimensiones)
      ),
      h('div', { className: 'card-footer' },
        h('span', { className: 'learn-more' }, i18n.t('salas_more')),
        h('button', {
          className: 'btn-check-availability',
          onclick: (e) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent('consultar-sala', { detail: sala.nombre }));
          }
        }, i18n.t('salas_availability'))
      )
    )
  );
}

function SalaModal(sala) {
  let currentIndex = 0;
  const images = sala.imagenes || ['/assets/images/placeholder.png'];
  const roomKey = sala.dbKey || ('sala_' + sala.id.replace(/-/g, '_'));

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
            h('h2', {}, i18n.t(roomKey + '_nombre') || sala.nombre),
            h('p', { className: 'modal-dims' }, i18n.t(roomKey + '_dimensiones') || sala.dimensiones)
          ),
          h('p', { className: 'modal-desc' }, i18n.t(roomKey + '_desc') || sala.descripcionLarga || i18n.t('salas_no_desc')),
          
          h('div', { className: 'sala-features' },
            h('h4', { style: { marginBottom: '1rem', color: 'hsl(var(--color-primary))'} }, i18n.t('salas_equip_title')),
            h('ul', { className: 'features-list' },
              (i18n.t(roomKey + '_equipo') || (sala.equipamiento && sala.equipamiento.join(', ')) || '').split(',').map(f => f.trim()).filter(Boolean).map(f => h('li', {}, f))
            )
          )
        ),

        h('div', { className: 'sala-modal-side' },
          BookingGrid({
            sala,
            onReserve: (reservaDetails) => {
              const rateType = reservaDetails.isDayRate ? i18n.t('salas_rate_day') : i18n.t('salas_rate_hour');
              const translatedSalaName = i18n.t(roomKey + '_nombre') || sala.nombre;

              const texto = i18n.t('wa_message')
                .replace('{nombre}', reservaDetails.nombre || '')
                .replace('{sala}', `${translatedSalaName} (${rateType})`)
                .replace('{fecha}', reservaDetails.fecha)
                .replace('{horario}', reservaDetails.slots.join(', ') + 'h')
                .replace('{contacto}', reservaDetails.contacto || '');
                
              window.location.href = `https://wa.me/34601392161?text=${encodeURIComponent(texto)}`;
            }
          })
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
