import { h } from '../utils.js';

export function SalasSection() {
  const container = h('section', { id: 'salas', className: 'tab-section' },
    h('div', { className: 'container' },
      h('h2', { style: { textAlign: 'center' } }, 'Salas Polivalentes'),
      h('p', { style: { textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' } },
        'Un oasis en plena ciudad para clases, talleres o terapias.'
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
