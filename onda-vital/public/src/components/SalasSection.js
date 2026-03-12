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

  // Lógica de carga de salas
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

  setTimeout(cargarSalas, 0); // Cargar al montar

  return container;
}

function SalaCard(sala) {
  return h('div', { className: 'sala-card' },
    h('div', { className: 'sala-img', style: { backgroundImage: "url('https://images.unsplash.com/photo-1545208393-596371/photo?w=800')" } }),
    h('div', { className: 'sala-info' },
      h('h3', {}, sala.nombre),
      h('p', { className: 'sala-capacity' }, `${sala.capacidad} | ${sala.dimensiones}`),
      h('button', { 
        className: 'btn-check-availability',
        onclick: () => {
          document.dispatchEvent(new CustomEvent('consultar-sala', { detail: sala.nombre }));
        }
      }, 'Consultar Disponibilidad')
    )
  );
}
