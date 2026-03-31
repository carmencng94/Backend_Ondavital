import { h, injectStyles } from '../../utils.js';
import { i18n } from '../../i18n.js';

const bookingStyles = `
/* Contenedor del Booking System */
.booking-engine {
  margin-top: var(--space-xl);
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid hsl(var(--color-border));
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 500px; /* Limitar ancho en PC */
  margin-left: auto;
  margin-right: auto;
  box-shadow: var(--shadow-sm);
}

.booking-engine h4 {
  font-size: 1rem;
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-num {
  width: 22px;
  height: 22px;
  background: hsl(var(--color-primary));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Selector de fecha */
.booking-date-picker {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  overflow-x: auto;
  padding-bottom: var(--space-xs);
}

.date-card {
  flex: 0 0 60px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: var(--radius-md);
  padding: 8px 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.date-card.active {
  background: hsl(var(--color-primary-light) / 0.15);
  border-color: hsl(var(--color-primary));
  color: hsl(var(--color-primary));
}

.date-day { font-size: 0.7rem; text-transform: uppercase; color: #666; }
.date-num { font-size: 1.2rem; font-weight: 600; }

/* Timeline Slots */
.slots-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.time-slot {
  padding: 8px 4px;
  text-align: center;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.slot-free { background: #e8f5e9; color: #2e7d32; border-color: #c8e6c9; }
.slot-busy { background: #f5f5f5; color: #999; border-color: #eee; cursor: not-allowed; }
.slot-selected { background: hsl(var(--color-primary)); color: white; transform: scale(1.05); }

/* Formulario */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: #fdfdfd;
  border-radius: var(--radius-lg);
  border: 1px dashed #ddd;
}

.booking-form input {
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1px solid #ddd;
  font-family: inherit;
}

/* Global Busy Info */
.global-mini-info {
  font-size: 0.8rem;
  color: #856404;
  background: #fff3cd;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #ffeeba;
}

.booking-summary {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-reserve {
  background: hsl(var(--color-primary));
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reserve:disabled { background: #ccc; cursor: not-allowed; }

/* Rates injection */
.rates-grid { display: flex; gap: var(--space-md); margin-bottom: var(--space-md); }
.rate-card { background: hsl(var(--color-primary-light) / 0.1); padding: var(--space-md); border-radius: var(--radius-lg); display: flex; flex-direction: column; cursor: pointer; border: 2px solid transparent; transition: all 0.3s ease; user-select: none; flex: 1; text-align: center; }
.rate-card:hover { background: hsl(var(--color-primary-light) / 0.2); transform: translateY(-2px); }
.rate-card.active { border-color: hsl(var(--color-primary)); background: hsl(var(--color-primary-light) / 0.3); box-shadow: var(--shadow-sm); }
.rate-card span { font-size: var(--text-xs); color: var(--color-text-muted); }
.rate-card strong { font-size: var(--text-lg); color: hsl(var(--color-primary)); }
`;

export function BookingGrid({ sala: initSala, onReserve }) {
  injectStyles('booking-engine-styles', bookingStyles);
  
  const state = {
    step: 1, // 1: slots selection, 2: contact form
    selectedDate: new Date(),
    selectedSlots: [],
    slotsData: [],
    globalData: [],
    salasTotales: [],
    selectedSalaId: initSala ? (initSala.id || initSala.nombre) : '',
    selectedSalaObj: initSala || null,
    loading: false,
    isDayRate: false,
    form: { nombre: '', contacto: '' }
  };

  const container = h('div', { className: 'booking-engine' });

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for(let i=0; i<7; i++) {
       const d = new Date(today);
       d.setDate(today.getDate() + i);
       dates.push(d);
    }
    return dates;
  };

  const formatearFecha = (d) => d.toISOString().split('T')[0];

  const loadInitialData = async () => {
    try {
        const res = await fetch('/api/salas');
        const data = await res.json();
        if(data && data.salas) {
            state.salasTotales = data.salas;
            if(!state.selectedSalaId && data.salas.length > 0) {
                state.selectedSalaId = data.salas[0].id;
                state.selectedSalaObj = data.salas[0];
            }
        }
    } catch(e) { console.error('Error fetching salas', e); }
    await refreshDate(state.selectedDate);
  };

  const refreshDate = async (date) => {
    state.loading = true;
    state.selectedDate = date;
    state.selectedSlots = [];
    render();

    const dateStr = formatearFecha(date);
    try {
        const resGlobal = await fetch(`/api/reservas/dia?fecha=${dateStr}`);
        const dataGlobal = await resGlobal.json();
        state.globalData = dataGlobal.ocupaciones || [];
    } catch(e) { console.error(e); }

    if(state.selectedSalaId) {
        try {
            const res = await fetch(`/api/reservas/disponibilidad?salaId=${state.selectedSalaId}&fecha=${dateStr}`);
            const data = await res.json();
            state.slotsData = data.slots || [];
        } catch(e) { console.error(e); }
    }
    
    state.loading = false;
    render();
  };

  const saveAttemptAndGo = async () => {
    if (!state.form.nombre || !state.form.contacto) {
        alert(i18n.t('booking_alert_missing'));
        return;
    }

    try {
        // Guardar físicamente en la DB
        const res = await fetch('/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: state.form.nombre,
                contacto: state.form.contacto,
                sala: state.selectedSalaObj?.nombre || state.selectedSalaId,
                fecha: formatearFecha(state.selectedDate),
                horario: state.selectedSlots.join(', '),
                estado: 'pendiente'
            })
        });
        
        const data = await res.json();
        
        if (onReserve) {
          onReserve({
            nombre: state.form.nombre,
            contacto: state.form.contacto,
            sala: state.selectedSalaObj?.nombre || state.selectedSalaId,
            fecha: formatearFecha(state.selectedDate),
            slots: state.selectedSlots,
            totalPrice: calculatePrice(),
            isDayRate: state.isDayRate
          });
        }
        
        // Reset steps
        state.step = 1;
        state.selectedSlots = [];
        state.form = { nombre: '', contacto: '' };
        render();

    } catch(e) {
        console.error('Error guardando intento:', e);
        // Aun si falla la DB, redirigimos a whatsapp para no perder la venta
        if (onReserve) onReserve({ 
          nombre: state.form.nombre,
          contacto: state.form.contacto,
          sala: state.selectedSalaId, 
          fecha: formatearFecha(state.selectedDate), 
          slots: state.selectedSlots,
          isDayRate: state.isDayRate
        });
    }
  };

  const calculatePrice = () => {
    if (state.isDayRate) {
        const dayPriceMatch = state.selectedSalaObj?.tarifas?.dia?.match(/(\d+)/);
        return dayPriceMatch ? parseInt(dayPriceMatch[1]) : 0;
    }
    
    let hourlyPrice = 0;
    if (state.selectedSalaObj && state.selectedSalaObj.tarifas?.hora) {
        const priceMatch = state.selectedSalaObj.tarifas.hora.match(/(\d+)/);
        if(priceMatch) hourlyPrice = parseInt(priceMatch[1]);
    }
    return hourlyPrice * state.selectedSlots.length;
  };

  const render = () => {
    const roomKey = state.selectedSalaObj?.dbKey || (state.selectedSalaObj?.id ? 'sala_' + state.selectedSalaObj.id.replace(/-/g, '_') : '');
    // Limpieza profunda y regeneración
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    if (state.step === 1) {
        // --- STEP 1: CALENDAR & SELECTION ---
        container.appendChild(h('h4', {}, h('span', {className:'step-num'}, '1'), i18n.t('booking_step1')));
        const dateCardsContainer = h('div', { className: 'booking-date-picker' });
        generateDates().forEach(d => {
            const isSelected = d.toDateString() === state.selectedDate.toDateString();
            dateCardsContainer.appendChild(h('div', { 
                className: `date-card ${isSelected ? 'active' : ''}`,
                onclick: () => refreshDate(d)
            },
                h('div', { className: 'date-day' }, d.toLocaleDateString(i18n.currentLanguage === 'ca' ? 'ca-ES' : i18n.currentLanguage === 'de' ? 'de-DE' : i18n.currentLanguage === 'en' ? 'en-GB' : 'es-ES', { weekday: 'short' })),
                h('div', { className: 'date-num' }, d.getDate())
            ));
        });
        container.appendChild(dateCardsContainer);

        // Global Busy summary con nombres de salas
        if(state.globalData.length > 0) {
            const busyItems = state.globalData.map(o => {
                const sName = state.salasTotales.find(s => s.id === o.sala || s.nombre === o.sala)?.nombre || o.sala;
                return `${sName} (${o.horario}h)`;
            });
            
            container.appendChild(h('div', { className: 'global-mini-info' }, 
                h('strong', {}, i18n.t('booking_busy_today') + ' '),
                busyItems.join(', ')
            ));
        }

        container.appendChild(h('h4', {}, h('span', {className:'step-num'}, '2'), i18n.t('booking_step2')));
        if (!initSala) {
          const selectBox = h('select', { 
              className: 'room-selector',
              onchange: (e) => {
                  state.selectedSalaId = e.target.value;
                  state.selectedSalaObj = state.salasTotales.find(s => s.id === state.selectedSalaId);
                  refreshDate(state.selectedDate);
              }
          });
          state.salasTotales.forEach(s => {
              const opt = document.createElement('option');
              opt.value = s.id;
              opt.textContent = `${s.nombre}`;
              if(s.id === state.selectedSalaId) opt.selected = true;
              selectBox.appendChild(opt);
          });
          container.appendChild(selectBox);
        } else {
          // Si ya hay sala fija, solo mostramos el nombre
          container.appendChild(h('div', { className: 'selected-room-banner', style: { marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', background: 'hsl(var(--color-primary-light) / 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' } }, 
            h('strong', {}, i18n.t(roomKey + '_nombre') || state.selectedSalaObj.nombre)
          ));
        }

        const rateSelectionDiv = h('div', { id: 'booking-rate-selection' });
        if (state.selectedSalaObj && state.selectedSalaObj.tarifas) {
          const ratesGrid = h('div', { className: 'rates-grid' },
            h('div', { 
              className: `rate-card ${!state.isDayRate ? 'active' : ''}`,
              onclick: () => { state.isDayRate = false; render(); }
            }, h('span', {}, i18n.t('salas_rate_hour')), h('strong', {}, 
              (state.selectedSalaObj.tarifas.hora || '')
                .replace(/hora/gi, i18n.t('salas_rate_hour'))
                .replace(/día/gi, i18n.t('salas_rate_day'))
                .replace(/Incluido/gi, i18n.t('salas_incluido'))
            )),
            h('div', { 
              className: `rate-card ${state.isDayRate ? 'active' : ''}`,
              onclick: () => { 
                state.isDayRate = true; 
                state.selectedSlots = state.slotsData.filter(s => s.status !== 'busy').map(s => s.time);
                render(); 
              }
            }, h('span', {}, i18n.t('salas_rate_day')), h('strong', {}, 
              (state.selectedSalaObj.tarifas.dia || '')
                .replace(/hora/gi, i18n.t('salas_rate_hour'))
                .replace(/día/gi, i18n.t('salas_rate_day'))
                .replace(/Incluido/gi, i18n.t('salas_incluido'))
            ))
          );
          rateSelectionDiv.appendChild(ratesGrid);
        }
        container.appendChild(rateSelectionDiv);

        const slotsContainer = h('div', { className: 'slots-container' });
        state.slotsData.forEach(slot => {
            const isSelected = state.selectedSlots.includes(slot.time);
            const slotEl = h('div', { 
                className: `time-slot slot-${slot.status} ${isSelected ? 'slot-selected' : ''}`,
                onclick: () => {
                    if (slot.status === 'busy') return;
                    const idx = state.selectedSlots.indexOf(slot.time);
                    if (idx > -1) state.selectedSlots.splice(idx, 1);
                    else state.selectedSlots.push(slot.time);
                    render();
                }
            }, slot.time);
            slotsContainer.appendChild(slotEl);
        });
        container.appendChild(slotsContainer);

        const totalPrice = calculatePrice();
        const nextBtn = h('button', { 
            className: 'btn-reserve',
            onclick: () => { 
                if (state.selectedSlots.length > 0) {
                    state.step = 2; 
                    render(); 
                }
            }
        }, i18n.t('booking_next'));
        
        if (state.selectedSlots.length === 0) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.5';
        }

        const summary = h('div', { className: 'booking-summary' },
            h('div', {}, 
                h('strong', {}, `${totalPrice}€`),
                state.isDayRate ? h('span', { style: {fontSize:'0.8rem', marginLeft:'8px'} }, `(${i18n.t('salas_rate_day')})`) : null
            ),
            nextBtn
        );
        container.appendChild(summary);

    } else {
        // --- STEP 2: CONTACT FORM ---
        container.appendChild(h('h4', {}, h('span', {className:'step-num'}, '3'), i18n.t('booking_step3')));
        
        const confirmBtn = h('button', { 
            className: 'btn-reserve',
            onclick: saveAttemptAndGo
        }, i18n.t('booking_confirm'));

        const updateBtnState = () => {
            if (state.form.nombre && state.form.contacto) {
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
            } else {
                confirmBtn.disabled = true;
                confirmBtn.style.opacity = '0.5';
            }
        };

        const inputNombre = h('input', { 
            type: 'text', placeholder: i18n.t('booking_name_ph'), 
            className: 'form-input',
            value: state.form.nombre,
            oninput: (e) => { 
                state.form.nombre = e.target.value; 
                updateBtnState();
            }
        });
        
        const inputContacto = h('input', { 
            type: 'text', placeholder: i18n.t('booking_contact_ph'), 
            className: 'form-input',
            value: state.form.contacto,
            oninput: (e) => { 
                state.form.contacto = e.target.value; 
                updateBtnState();
            }
        });

        const form = h('div', { className: 'booking-form' },
            inputNombre,
            inputContacto,
            h('p', {style:{fontSize:'0.8rem', color:'#666'}}, i18n.t('booking_form_note'))
        );
        container.appendChild(form);

        // Estado inicial del botón
        updateBtnState();

        const actions = h('div', { className: 'booking-summary' },
            h('button', { 
                className: 'btn-reserve', 
                style: {background: '#eee', color: '#333'},
                onclick: () => { state.step = 1; render(); }
            }, i18n.t('booking_back')),
            confirmBtn
        );
        container.appendChild(actions);

        // Autofocus al entrar al paso 2 si están vacíos
        setTimeout(() => { if(!state.form.nombre) inputNombre.focus(); }, 100);
    }
  };

  container.addEventListener('select-full-day', () => {
    state.isDayRate = true;
    state.selectedSlots = state.slotsData
      .filter(s => s.status !== 'busy')
      .map(s => s.time);
    render();
  });

  container.addEventListener('select-hour-rate', () => {
    state.isDayRate = false;
    render();
  });

  loadInitialData();
  return container;
}

