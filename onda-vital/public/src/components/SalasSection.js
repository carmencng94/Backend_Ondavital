import { h, injectStyles } from '../utils.js';
import { BookingGrid } from './booking/BookingGrid.js';
import { i18n } from '../i18n.js';
import { PlanesSemanales } from './PlanesSemanales.js';

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
  gap: var(--space-xs);
  margin-top: auto;
}

.btn-check-availability {
  background: hsl(var(--color-primary));
  border: 1.5px solid hsl(var(--color-primary));
  color: white;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex: 1;
  white-space: normal;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
}

.btn-check-availability:hover {
  background: hsl(var(--color-primary-dark), hsl(var(--color-primary)));
  filter: brightness(0.9);
}

.secondary-btn {
  background: transparent;
  border: 1.5px solid hsl(var(--color-primary));
  color: hsl(var(--color-primary));
  padding: 8px 12px;
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex: 1;
  white-space: normal;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
}

.secondary-btn:hover {
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
  max-width: 100vw;
  max-height: 90vh;
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-premium);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sala-modal-info, .sala-modal-side {
  min-width: 0;
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

/* Sala Comunitaria Hero Card */
.sala-comunitaria-hero-card {
  grid-column: 1 / -1;
  margin: var(--space-xl) auto;
  max-width: 80%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background: hsl(var(--color-primary-light) / 0.08);
  border: 2px dashed hsl(var(--color-primary) / 0.3);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  cursor: pointer;
}

.sala-comunitaria-hero-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.comunitaria-hero-img {
  width: 45%;
  min-height: 280px;
  background-size: cover;
  background-position: center;
  background-color: hsl(var(--color-primary-light));
}

.comunitaria-hero-info {
  padding: var(--space-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.comunitaria-hero-info h3 {
  color: hsl(var(--color-primary));
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: var(--space-xs);
}

.comunitaria-hero-subtitle {
  font-size: var(--text-md);
  color: var(--color-text-main);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}

.comunitaria-hero-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: var(--space-md);
}

.comunitaria-hero-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

@media (max-width: 768px) {
  .sala-comunitaria-hero-card {
    flex-direction: column;
    max-width: 100%;
    margin: var(--space-lg) var(--space-md);
  }
  .comunitaria-hero-img {
    width: 100%;
    height: 220px;
  }
}

/* Collapsible Conditions */
.salas-conditions-collapsible {
  max-width: 1200px;
  margin: 0 auto var(--space-xl) auto;
  border: 1px solid hsl(var(--color-border));
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-sm);
}
.collapsible-trigger {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  background: hsl(var(--color-primary-light) / 0.15);
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  color: hsl(var(--color-primary-dark));
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  gap: var(--space-md);
}
.collapsible-trigger:hover {
  background: hsl(var(--color-primary-light) / 0.25);
}
.collapsible-trigger .arrow {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}
.collapsible-trigger .arrow.rotated {
  transform: rotate(180deg);
}
.conditions-cajitas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}
.condition-cajita {
  background: white;
  border: 1px solid hsl(var(--color-border) / 0.6);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-xs);
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
  text-align: left;
}
.condition-cajita .bullet {
  color: hsl(var(--color-accent));
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2;
}
.condition-cajita .text {
  color: var(--color-text-muted);
  font-size: 0.86rem;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .carousel-container {
    height: 220px;
  }
  .sala-modal-content {
    padding: var(--space-md);
    gap: var(--space-md);
  }
  .features-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .comunitaria-hero-info {
    padding: var(--space-md);
  }
  .sala-comunitaria-hero-card {
    margin: var(--space-md) 0;
  }
}

@media (max-width: 480px) {
  .conditions-cajitas-grid {
    grid-template-columns: 1fr;
  }
  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
`;

export function SalasSection() {
  injectStyles('salas-styles', salasStyles);

  const container = h('section', { id: 'salas', className: 'tab-section' },
    h('div', { className: 'container' },
      h('div', { className: 'salas-header-wrapper', style: { textAlign: 'center', marginBottom: 'var(--space-2xl)' } },
        h('h2', { className: 'section-title', 'data-i18n-key': 'salas_title' }, i18n.t('salas_title')),
        h('p', { className: 'section-subtitle', style: { maxWidth: '800px', margin: '0 auto var(--space-xl)' }, 'data-i18n-key': 'salas_subtitle' },
          i18n.t('salas_subtitle')
        )
      ),

      // Condiciones Generales de Alquiler de Salas
      CondicionesCollapsibleWidget(),

      h('div', { id: 'salas-grid', className: 'salas-grid' },
        h('p', { className: 'salas-loading' }, i18n.t('salas_loading'))
      ),
      
      // Añadimos el componente de Planes Semanales destacado debajo de las salas
      PlanesSemanales()
    )
  );

  const cargarSalas = async () => {
    const grid = container.querySelector('#salas-grid');
    try {
      const response = await fetch('/api/salas');
      const data = await response.json();
      if (data.success && data.salas) {
        grid.innerHTML = '';
        
        // Buscar la sala comunitaria
        const comunitaria = data.salas.find(s => s.id === 'comunitaria');
        
        // Renderizar las otras salas en el grid
        data.salas.forEach(sala => {
          if (sala.id !== 'comunitaria') {
            grid.appendChild(SalaCard(sala));
          }
        });
        
        // Renderizar la sala comunitaria debajo, centrada al 80%
        if (comunitaria) {
          const existingHero = container.querySelector('.sala-comunitaria-hero-card');
          if (existingHero) existingHero.remove();
          
          const heroCard = SalaComunitariaCard(comunitaria);
          grid.parentNode.insertBefore(heroCard, grid.nextSibling);
        }
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
      h('div', { className: 'sala-badge' }, 
        (sala.tarifas.hora || '')
          .replace(/hora/gi, i18n.t('salas_rate_hour'))
          .replace(/día/gi, i18n.t('salas_rate_day'))
          .replace(/Incluido/gi, i18n.t('salas_incluido'))
      )
    ),
    h('div', { className: 'sala-info' },
      h('h3', {}, (i18n.currentLanguage === 'es' ? sala.nombre : null) || i18n.t(roomKey + '_nombre') || sala.nombre),
      h('p', { className: 'sala-capacity' }, 
        ((i18n.currentLanguage === 'es' ? sala.capacidad : null) || i18n.t(roomKey + '_capacidad') || sala.capacidad) + ' | ' + 
        ((i18n.currentLanguage === 'es' ? sala.dimensiones : null) || i18n.t(roomKey + '_dimensiones') || sala.dimensiones)
      ),
      h('div', { className: 'card-footer' },
        h('button', {
          className: 'secondary-btn',
          onclick: (e) => {
            e.stopPropagation();
            document.body.appendChild(SalaModal(sala));
          }
        }, i18n.t('salas_more_info_reserve')),
        h('button', {
          className: 'btn-check-availability',
          onclick: (e) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent('consultar-sala', { detail: sala.nombre }));
          }
        }, i18n.t('salas_ask_vitalis'))
      )
    )
  );
}

function SalaComunitariaCard(sala) {
  const mainImage = sala.imagenes && sala.imagenes[0] ? sala.imagenes[0] : '/assets/images/placeholder.png';
  const roomKey = sala.dbKey || ('sala_' + sala.id.replace(/-/g, '_'));

  return h('div', {
    className: 'sala-comunitaria-hero-card',
    onclick: () => {
      document.body.appendChild(SalaModal(sala));
    }
  },
    h('div', {
      className: 'comunitaria-hero-img',
      style: { backgroundImage: `url('${mainImage}')` }
    }),
    h('div', { className: 'comunitaria-hero-info' },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' } },
        h('h3', {}, (i18n.currentLanguage === 'es' ? sala.nombre : null) || i18n.t(roomKey + '_nombre') || sala.nombre),
        h('span', {
          style: {
            background: 'hsl(var(--color-primary))',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: '700',
            boxShadow: 'var(--shadow-sm)'
          }
        }, 
          i18n.currentLanguage === 'es' ? 'Uso Común' :
          i18n.currentLanguage === 'ca' ? 'Ús Comú' :
          i18n.currentLanguage === 'de' ? 'Gemeinsame Nutzung' :
          'Common Use'
        )
      ),
      h('p', { className: 'comunitaria-hero-subtitle' },
        i18n.currentLanguage === 'es' ? 'Espacio libre con terraza exterior para todos los usuarios' :
        i18n.currentLanguage === 'ca' ? 'Espai lliure amb terrassa exterior per a tots els usuaris' :
        i18n.currentLanguage === 'de' ? 'Freiraum mit Außenterrasse für alle Nutzer' :
        'Free space with outdoor terrace for all users'
      ),
      h('p', { className: 'comunitaria-hero-text' },
        i18n.currentLanguage === 'es' ? 'Nuestra sala comunitaria es el corazón social de Onda Vital. Cuenta con cocina equipada, nevera, microondas, tetera y vajilla. Está incluida en el alquiler de cualquier otra sala, ofreciendo un área idónea de descanso y networking para tus alumnos o clientes.' :
        i18n.currentLanguage === 'ca' ? 'La nostra sala comunitària és el cor social de Onda Vital. Disposa de cuina equipada, nevera, microones, tetera i vaixella. Està inclosa en el lloguer de qualsevol altra sala, oferint una àrea idònia de descans i networking per als teus alumnes o clients.' :
        i18n.currentLanguage === 'de' ? 'Unser Gemeinschaftsraum ist das soziale Herzstück von Onda Vital. Er verfügt über eine ausgestattete Küche, einen Kühlschrank, eine Mikrowelle, einen Wasserkocher und Geschirr. Er ist im Mietpreis jedes anderen Raums inbegriffen und bietet einen idealen Bereich für Entspannung und Networking für Ihre Schüler oder Kunden.' :
        'Our community room is the social heart of Onda Vital. It features an equipped kitchen, fridge, microwave, kettle, and tableware. It is included in the rental of any other room, offering an ideal area for relaxation and networking for your students or clients.'
      ),
      h('div', { className: 'comunitaria-hero-footer' },
        h('span', { className: 'learn-more' }, i18n.t('salas_more')),
        h('button', {
          className: 'secondary-btn',
          style: { borderStyle: 'dashed' },
          onclick: (e) => {
            e.stopPropagation();
            document.body.appendChild(SalaModal(sala));
          }
        }, 
          i18n.currentLanguage === 'es' ? 'Ver condiciones de uso' :
          i18n.currentLanguage === 'ca' ? 'Veure condicions d\'ús' :
          i18n.currentLanguage === 'de' ? 'Nutzungsbedingungen anzeigen' :
          'View terms of use'
        )
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
            h('h2', {}, (i18n.currentLanguage === 'es' ? sala.nombre : null) || i18n.t(roomKey + '_nombre') || sala.nombre),
            h('p', { className: 'modal-dims' }, (i18n.currentLanguage === 'es' ? sala.dimensiones : null) || i18n.t(roomKey + '_dimensiones') || sala.dimensiones)
          ),
          h('p', { className: 'modal-desc' }, 
            (i18n.currentLanguage === 'es' ? sala.descripcionLarga : null) || 
            i18n.t(roomKey + '_desc') || 
            sala.descripcionLarga || 
            i18n.t('salas_no_desc')
          ),
          
          h('div', { className: 'sala-features' },
            h('h4', { style: { marginBottom: '1rem', color: 'hsl(var(--color-primary))'} }, i18n.t('salas_equip_title')),
            h('ul', { className: 'features-list' },
              ((i18n.currentLanguage === 'es' ? (sala.equipamiento && sala.equipamiento.join(', ')) : null) || i18n.t(roomKey + '_equipo') || (sala.equipamiento && sala.equipamiento.join(', ')) || '')
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)
                .map(f => h('li', {}, f))
            )
          ),

          h('div', { className: 'sala-conditions', style: { marginTop: 'var(--space-xl)' } },
            CondicionesCollapsibleWidget(roomKey)
          )
        ),

        h('div', { className: 'sala-modal-side' },
          sala.id === 'comunitaria'
            ? h('div', {
                className: 'sala-comunitaria-info-card',
                style: {
                  background: 'hsl(var(--color-primary-light) / 0.1)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1.5px solid hsl(var(--color-primary) / 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  textAlign: 'left'
                }
              },
                h('h4', { style: { color: 'hsl(var(--color-primary))', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' } }, 
                  i18n.currentLanguage === 'es' ? 'Condiciones de la Sala Comunitaria' :
                  i18n.currentLanguage === 'ca' ? 'Condicions de la Sala Comunitària' :
                  i18n.currentLanguage === 'de' ? 'Bedingungen für den Gemeinschaftsraum' :
                  'Community Room Conditions'
                ),
                h('p', { style: { fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: '1.5', margin: 0 } },
                  i18n.currentLanguage === 'es' ? 'Este espacio común y la terraza están disponibles libremente para el relax y descanso de los usuarios de todas las salas.' :
                  i18n.currentLanguage === 'ca' ? 'Aquest espai comú i la terrassa estan disponibles lliurement per al relax i descans dels usuaris de totes les sales.' :
                  i18n.currentLanguage === 'de' ? 'Dieser Gemeinschaftsbereich und die Terrasse stehen allen Nutzern aller Räume zur Entspannung und Erholung frei zur Verfügung.' :
                  'This common area and terrace are freely available for relaxation and rest for users of all rooms.'
                ),
                h('div', {
                  style: {
                    background: 'hsl(35deg 100% 96%)',
                    borderLeft: '4px solid hsl(35deg 90% 50%)',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'hsl(35deg 70% 25%)',
                    lineHeight: '1.4'
                  }
                },
                  h('strong', {}, 
                    i18n.currentLanguage === 'es' ? 'Exclusividad con Sala G1/Jardín:' :
                    i18n.currentLanguage === 'ca' ? 'Exclusivitat amb Sala G1/Jardí:' :
                    i18n.currentLanguage === 'de' ? 'Exklusivität mit Raum G1/Garten:' :
                    'Exclusivity with Room G1/Garden:'
                  ),
                  h('p', { style: { margin: '4px 0 0 0' } },
                    i18n.currentLanguage === 'es' ? 'Cuando la Sala Jardín (G1) está reservada, la sala comunitaria y la terraza quedan bloqueadas para su uso exclusivo, por lo que no estarán disponibles para usuarios de otras salas durante ese horario.' :
                    i18n.currentLanguage === 'ca' ? 'Quan la Sala Jardí (G1) està reservada, la sala comunitària i la terrassa queden bloquejades per al seu ús exclusiu, per la qual cosa no estaran disponibles per a usuaris d\'altres sales durant aquest horari.' :
                    i18n.currentLanguage === 'de' ? 'Wenn der Gartenraum (G1) reserviert ist, sind der Gemeinschaftsraum und die Terrasse für dessen exklusive Nutzung gesperrt und stehen den Nutzern anderer Räume während dieser Zeiten nicht zur Verfügung.' :
                    'When the Garden Room (G1) is reserved, the community room and terrace are blocked for its exclusive use, so they will not be available to users of other rooms during those hours.'
                  )
                ),
                h('button', {
                  className: 'btn-check-availability primary',
                  style: { marginTop: 'var(--space-md)' },
                  onclick: () => {
                    closeModal();
                    // Buscar la Sala Jardín y abrir su modal para que el usuario consulte disponibilidad
                    fetch('/api/salas').then(r => r.json()).then(data => {
                      if (data.success && data.salas) {
                        const jardin = data.salas.find(s => s.id === 'jardin');
                        if (jardin) {
                          document.body.appendChild(SalaModal(jardin));
                        }
                      }
                    });
                  }
                },
                  i18n.currentLanguage === 'es' ? 'Consultar disponibilidad de Sala G1' :
                  i18n.currentLanguage === 'ca' ? 'Consultar disponibilitat de Sala G1' :
                  i18n.currentLanguage === 'de' ? 'Verfügbarkeit von Raum G1 prüfen' :
                  'Check Room G1 Availability'
                )
              )
            : BookingGrid({
                sala,
                onReserve: (reservaDetails) => {
                  const rateType = reservaDetails.isDayRate ? i18n.t('salas_rate_day') : i18n.t('salas_rate_hour');
                  const translatedSalaName = i18n.t(roomKey + '_nombre') || sala.nombre;

                  let textActividad = reservaDetails.actividad ? `\nActividad: ${reservaDetails.actividad}` : '';
                  if (reservaDetails.es_ruidosa) {
                    textActividad += ' (Implica música/ruido) 🔊';
                  }

                  const texto = (i18n.t('wa_message')
                    .replace('{nombre}', reservaDetails.nombre || '')
                    .replace('{sala}', `${translatedSalaName} (${rateType})`)
                    .replace('{fecha}', reservaDetails.fecha)
                    .replace('{horario}', reservaDetails.slots.join(', ') + 'h')
                    .replace('{contacto}', reservaDetails.contacto || '')) + textActividad;

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

function CondicionesCollapsibleWidget(roomKey = null) {
  const conds = [
    i18n.t('salas_cond_prep'),
    i18n.t('salas_cond_bonos'),
    i18n.t('salas_cond_deposit'),
    i18n.t('salas_cond_cancel'),
    i18n.t('salas_cond_mensual'),
    i18n.t('salas_cond_promo'),
    i18n.t('salas_cond_iva')
  ];

  if (roomKey === 'sala_jardin') {
    conds.push(i18n.t('salas_cond_g1_limit'));
  } else if (roomKey === 'sala_azul') {
    conds.push(i18n.t('salas_cond_g2_limit'));
  } else if (roomKey === 'sala_despacho_plus') {
    conds.push(i18n.t('salas_cond_despacho_limit'));
  } else if (roomKey === 'sala_terapia_a' || roomKey === 'sala_terapia_b') {
    conds.push(i18n.t('salas_cond_terapia_limit'));
  }

  const triggerText = i18n.currentLanguage === 'es' ? '⚠️ Ver Condiciones y Políticas de Reserva (Click para desplegar)' :
                      i18n.currentLanguage === 'ca' ? '⚠️ Veure Condicions i Polítiques de Reserva (Clic per desplegar)' :
                      i18n.currentLanguage === 'de' ? '⚠️ Buchungsbedingungen und Richtlinien anzeigen (Klicken zum Ausklappen)' :
                      '⚠️ View Booking Conditions & Policies (Click to expand)';

  return h('div', { className: 'salas-conditions-collapsible' },
    h('button', {
      className: 'collapsible-trigger',
      onclick: (e) => {
        const btn = e.currentTarget;
        const content = btn.nextElementSibling;
        const arrow = btn.querySelector('.arrow');
        const isActive = content.classList.toggle('active');
        arrow.classList.toggle('rotated', isActive);
        if (isActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0px';
        }
      }
    },
      h('span', {}, triggerText),
      h('span', { className: 'arrow' }, '▼')
    ),
    h('div', { className: 'collapsible-content', style: { maxHeight: '0px', overflow: 'hidden', transition: 'max-height 0.3s ease-out' } },
      h('div', { className: 'conditions-cajitas-grid', style: { padding: 'var(--space-md) 0' } },
        ...conds.map((cond, idx) => {
          const isHighlight = idx >= 7; // Las restricciones específicas de sala
          return h('div', { 
            className: 'condition-cajita',
            style: isHighlight ? { borderLeft: '3px solid hsl(var(--color-accent))', background: 'hsl(var(--color-accent) / 0.04)' } : {}
          },
            h('span', { className: 'bullet' }, '✦'),
            h('span', { className: 'text' }, cond)
          );
        })
      )
    )
  );
}
