import { h, injectStyles } from '../../utils.js';
import { i18n } from '../../i18n.js';

const bookingStyles = `
/* Contenedor del Booking System */
.booking-engine {
  margin-top: var(--space-xl);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-2xl);
  border: 1px solid hsl(var(--color-primary-light) / 0.3);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 520px;
  width: 100%;
  min-width: 0;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 40px -10px rgba(26, 77, 59, 0.12);
  transition: all 0.3s ease;
}

.booking-engine h4 {
  font-size: 0.95rem;
  color: hsl(var(--color-primary-dark));
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

/* Barra de progreso */
.booking-progress-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding: 0 var(--space-sm);
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: var(--space-md);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.step-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f3f5;
  color: #868e96;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #e9ecef;
}

.progress-step.active .step-dot {
  background: hsl(var(--color-primary));
  color: white;
  border-color: hsl(var(--color-primary));
  box-shadow: 0 0 12px hsl(var(--color-primary) / 0.4);
}

.progress-step.completed .step-dot {
  background: hsl(var(--color-accent));
  color: white;
  border-color: hsl(var(--color-accent));
}

.step-label {
  font-size: 0.72rem;
  color: #868e96;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-step.active .step-label {
  color: hsl(var(--color-primary-dark));
}

.progress-step.completed .step-label {
  color: hsl(var(--color-accent));
}

.progress-line {
  height: 2px;
  background: #e9ecef;
  flex: 0.4;
  margin-top: -18px;
  transition: all 0.3s ease;
}

.progress-line.active {
  background: hsl(var(--color-accent));
}

/* Selector de fecha */
.booking-date-picker {
  display: flex;
  gap: 10px;
  margin-bottom: var(--space-sm);
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
}

.booking-date-picker::-webkit-scrollbar {
  height: 4px;
}
.booking-date-picker::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}

.date-card {
  flex: 0 0 62px;
  background: #fdfdfd;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg);
  padding: 10px 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.date-card:hover {
  border-color: hsl(var(--color-primary-light));
  background: hsl(var(--color-primary-light) / 0.05);
  transform: translateY(-1px);
}

.date-card.active {
  background: hsl(var(--color-primary-light) / 0.12);
  border-color: hsl(var(--color-primary));
  color: hsl(var(--color-primary));
  box-shadow: 0 4px 10px -2px rgba(26, 77, 59, 0.15);
  transform: translateY(-1px) scale(1.02);
}

.date-day { 
  font-size: 0.68rem; 
  text-transform: uppercase; 
  color: #718096; 
  font-weight: 700;
  letter-spacing: 0.5px;
}
.date-num { 
  font-size: 1.25rem; 
  font-weight: 700; 
  margin-top: 2px;
}

/* Timeline Slots */
.slots-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: var(--space-xs);
}

.time-slot {
  padding: 10px 4px;
  text-align: center;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  box-shadow: var(--shadow-xs);
}

.time-slot:hover:not(.slot-busy) {
  transform: scale(1.03);
}

.slot-free { 
  background: #eefdf4; 
  color: #1b5e20; 
  border-color: #c8e6c9; 
}
.slot-free:hover {
  background: #e1f7e7;
  border-color: #81c784;
}
.slot-busy { 
  background: #f8fafc; 
  color: #cbd5e1; 
  border-color: #f1f5f9; 
  cursor: not-allowed; 
  box-shadow: none;
}
.slot-selected { 
  background: hsl(var(--color-primary)); 
  color: white; 
  border-color: hsl(var(--color-primary-dark));
  box-shadow: 0 4px 12px rgba(26, 77, 59, 0.3);
  transform: scale(1.05); 
}

/* Formulario Premium */
.booking-form-premium {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: var(--space-md);
  background: rgba(253, 253, 253, 0.8);
  border-radius: var(--radius-xl);
  border: 1px solid #e2e8f0;
}

.form-input-premium {
  padding: 11px 14px;
  border-radius: var(--radius-lg);
  border: 1px solid #cbd5e1;
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  background: white;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input-premium:focus {
  border-color: hsl(var(--color-primary));
  box-shadow: 0 0 0 3px hsl(var(--color-primary-light) / 0.15);
}

.form-row-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-row-two-col {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.checkbox-container-premium {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
  padding: 2px;
}

.checkbox-container-premium input[type="checkbox"] {
  width: 17px;
  height: 17px;
  accent-color: hsl(var(--color-primary));
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.form-checkbox-label {
  font-size: 0.82rem;
  color: #4a5568;
  cursor: pointer;
  user-select: none;
  line-height: 1.3;
}

.booking-note-premium {
  font-size: 0.78rem;
  color: #718096;
  text-align: center;
  margin-top: 4px;
}

/* Recibo / Ticket Premium */
.booking-receipt-premium {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  margin-bottom: var(--space-xs);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.receipt-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: hsl(var(--color-primary-dark));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px dashed #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 2px;
}

.receipt-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.receipt-label {
  color: #64748b;
  font-weight: 500;
}

.receipt-val {
  color: #1e293b;
  font-weight: 600;
}

.receipt-row.highlight {
  border-top: 1px dashed #cbd5e1;
  padding-top: 8px;
  margin-top: 4px;
  font-weight: 700;
}

.receipt-row.highlight .receipt-label {
  color: hsl(var(--color-primary-dark));
  font-size: 0.9rem;
}

.receipt-row.highlight .price {
  font-size: 1.15rem;
  color: hsl(var(--color-primary));
}

.receipt-deposit-box {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: #b45309;
  line-height: 1.4;
  margin-top: 4px;
  animation: fadeIn 0.3s ease-out;
}

/* Room selector */
.room-selector {
  padding: 10px;
  border-radius: var(--radius-lg);
  border: 1px solid #cbd5e1;
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
  width: 100%;
  background-color: white;
  cursor: pointer;
  font-weight: 600;
  color: #334155;
  transition: all 0.2s;
}

.room-selector:focus {
  border-color: hsl(var(--color-primary));
}

/* Global Busy Info */
.global-mini-info {
  font-size: 0.8rem;
  color: #b45309;
  background: #fffbeb;
  padding: 10px 12px;
  border-radius: var(--radius-lg);
  border-left: 4px solid #f59e0b;
  box-shadow: var(--shadow-xs);
  line-height: 1.4;
}

.booking-summary {
  margin-top: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-reserve {
  background: hsl(var(--color-primary));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px hsl(var(--color-primary) / 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reserve:hover:not(:disabled) {
  background: hsl(var(--color-primary-hover), hsl(var(--color-primary)));
  filter: brightness(0.95);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px hsl(var(--color-primary) / 0.35);
}

.btn-reserve:active:not(:disabled) {
  transform: translateY(0);
}

.btn-reserve:disabled { 
  background: #cbd5e1; 
  color: #94a3b8;
  cursor: not-allowed; 
  box-shadow: none;
}

/* Rates injection */
.rates-grid { 
  display: flex; 
  gap: var(--space-md); 
  margin-bottom: var(--space-xs); 
}
.rate-card { 
  background: #f8fafc; 
  padding: var(--space-md); 
  border-radius: var(--radius-xl); 
  display: flex; 
  flex-direction: column; 
  cursor: pointer; 
  border: 2px solid #e2e8f0; 
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
  user-select: none; 
  flex: 1; 
  text-align: center; 
}
.rate-card:hover { 
  border-color: hsl(var(--color-primary-light));
  background: hsl(var(--color-primary-light) / 0.03); 
  transform: translateY(-1px); 
}
.rate-card.active { 
  border-color: hsl(var(--color-primary)); 
  background: hsl(var(--color-primary-light) / 0.08); 
  box-shadow: 0 4px 10px -2px rgba(26, 77, 59, 0.1); 
}
.rate-card span { 
  font-size: var(--text-xs); 
  color: #64748b; 
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.rate-card strong { 
  font-size: var(--text-lg); 
  color: hsl(var(--color-primary-dark)); 
  font-weight: 700;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .booking-engine {
    padding: var(--space-md);
  }
  .rates-grid {
    flex-direction: column;
    gap: var(--space-xs);
  }
  .slots-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
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
    form: { nombre: '', email: '', telefono: '', actividad: '', ruidosa: false }
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

  const isDateValidForRoom = (date, roomId) => {
    const day = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const id = (roomId || '').toLowerCase();
    if (id.includes('azul') || id.includes('g2')) {
      return day === 5 || day === 6 || day === 0; // Viernes, Sábado y Domingo
    }
    if (id.includes('terapia')) {
      return day >= 1 && day <= 5; // Lunes a Viernes
    }
    return true;
  };

  const checkAndFixSelectedDate = (roomId) => {
    if (!isDateValidForRoom(state.selectedDate, roomId)) {
      const dates = generateDates();
      const firstValid = dates.find(d => isDateValidForRoom(d, roomId));
      if (firstValid) {
        state.selectedDate = firstValid;
      }
    }
  };

  const loadInitialData = async () => {
    try {
        const res = await fetch(window.API_BASE_URL + '/api/salas');
        const data = await res.json();
        if(data && data.salas) {
            state.salasTotales = data.salas;
            if(!state.selectedSalaId && data.salas.length > 0) {
                state.selectedSalaId = data.salas[0].id;
                state.selectedSalaObj = data.salas[0];
            }
        }
    } catch(e) { console.error('Error fetching salas', e); }
    checkAndFixSelectedDate(state.selectedSalaId);
    await refreshDate(state.selectedDate);
  };

  const refreshDate = async (date) => {
    state.loading = true;
    state.selectedDate = date;
    state.selectedSlots = [];
    render();

    const dateStr = formatearFecha(date);
    try {
        const resGlobal = await fetch(window.API_BASE_URL + `/api/reservas/dia?fecha=${dateStr}`);
        const dataGlobal = await resGlobal.json();
        state.globalData = dataGlobal.ocupaciones || [];
    } catch(e) { console.error(e); }

    if(state.selectedSalaId) {
        try {
            const res = await fetch(window.API_BASE_URL + `/api/reservas/disponibilidad?salaId=${state.selectedSalaId}&fecha=${dateStr}`);
            const data = await res.json();
            state.slotsData = data.slots || [];
        } catch(e) { console.error(e); }
    }
    
    state.loading = false;
    render();
  };

  const saveAttemptAndGo = async () => {
    if (!state.form.nombre || !state.form.email || !state.form.telefono) {
        alert(i18n.t('booking_alert_missing'));
        return;
    }

    // Compilamos los campos detallados en el contacto
    const compiledContacto = `Tel: ${state.form.telefono} | Email: ${state.form.email} | Actividad: ${state.form.actividad || 'No especificada'}${state.form.ruidosa ? ' (Música/Ruido 🔊)' : ''}`;

    try {
        // Guardar físicamente en la DB
        const res = await fetch(window.API_BASE_URL + '/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: state.form.nombre,
                contacto: compiledContacto,
                sala: state.selectedSalaObj?.nombre || state.selectedSalaId,
                fecha: formatearFecha(state.selectedDate),
                horario: state.selectedSlots.join(', '),
                estado: 'pendiente'
            })
        });
        
        const data = await res.json();
        const reservaId = data?.reserva?.id || null;
        
        if (onReserve) {
          onReserve({
            id: reservaId,
            nombre: state.form.nombre,
            contacto: compiledContacto,
            sala: state.selectedSalaObj?.nombre || state.selectedSalaId,
            fecha: formatearFecha(state.selectedDate),
            slots: state.selectedSlots,
            totalPrice: calculatePrice(),
            isDayRate: state.isDayRate,
            actividad: state.form.actividad,
            es_ruidosa: state.form.ruidosa
          });
        }
        
        // Reset steps
        state.step = 1;
        state.selectedSlots = [];
        state.form = { nombre: '', email: '', telefono: '', actividad: '', ruidosa: false };
        render();

    } catch(e) {
        console.error('Error guardando intento:', e);
        // Aun si falla la DB, redirigimos a whatsapp para no perder la venta
        if (onReserve) onReserve({ 
          id: null,
          nombre: state.form.nombre,
          contacto: compiledContacto,
          sala: state.selectedSalaId, 
          fecha: formatearFecha(state.selectedDate), 
          slots: state.selectedSlots,
          isDayRate: state.isDayRate,
          actividad: state.form.actividad,
          es_ruidosa: state.form.ruidosa
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

    // --- STEP PROGRESS BAR (Aparece en ambos pasos) ---
    const progressBar = h('div', { className: 'booking-progress-bar' },
      h('div', { className: `progress-step ${state.step === 1 ? 'active' : 'completed'}` },
        h('span', { className: 'step-dot' }, state.step === 1 ? '1' : '✓'),
        h('span', { className: 'step-label' }, i18n.t('booking_step2') || 'Horas')
      ),
      h('div', { className: `progress-line ${state.step === 2 ? 'active' : ''}` }),
      h('div', { className: `progress-step ${state.step === 2 ? 'active' : ''}` },
        h('span', { className: 'step-dot' }, '2'),
        h('span', { className: 'step-label' }, i18n.t('booking_step3') || 'Datos')
      )
    );
    container.appendChild(progressBar);
    
    if (state.step === 1) {
        // --- STEP 1: CALENDAR & SELECTION ---
        container.appendChild(h('h4', {}, i18n.t('booking_step1')));
        const dateCardsContainer = h('div', { className: 'booking-date-picker' });
        generateDates().forEach(d => {
            const isSelected = d.toDateString() === state.selectedDate.toDateString();
            const isValid = isDateValidForRoom(d, state.selectedSalaId);
            
            dateCardsContainer.appendChild(h('div', { 
                className: `date-card ${isSelected ? 'active' : ''} ${!isValid ? 'disabled' : ''}`,
                style: !isValid ? { opacity: '0.4', cursor: 'not-allowed', pointerEvents: 'none' } : {},
                onclick: () => {
                    if (isValid) {
                        refreshDate(d);
                    }
                }
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

        container.appendChild(h('h4', {}, i18n.t('booking_step2')));
        if (!initSala) {
          const selectBox = h('select', { 
              className: 'room-selector',
              onchange: (e) => {
                  state.selectedSalaId = e.target.value;
                  state.selectedSalaObj = state.salasTotales.find(s => s.id === state.selectedSalaId);
                  checkAndFixSelectedDate(state.selectedSalaId);
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
              onclick: () => { 
                state.isDayRate = false; 
                state.selectedSlots = [];
                render(); 
              }
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

        // Mostrar restricciones de la sala seleccionada
        let restrictionText = '';
        const lowerId = (state.selectedSalaId || '').toLowerCase();
        if (lowerId.includes('jardin') || lowerId.includes('g1')) {
          restrictionText = i18n.t('salas_cond_g1_limit');
        } else if (lowerId.includes('azul') || lowerId.includes('g2')) {
          restrictionText = i18n.t('salas_cond_g2_limit');
        } else if (lowerId.includes('despacho')) {
          restrictionText = i18n.t('salas_cond_despacho_limit');
        } else if (lowerId.includes('terapia')) {
          restrictionText = i18n.t('salas_cond_terapia_limit');
        }

        if (restrictionText) {
          container.appendChild(h('div', { 
            className: 'room-restriction-note',
            style: { 
              fontSize: '0.82rem', 
              color: 'hsl(var(--color-primary-dark))', 
              background: 'hsl(var(--color-primary-light) / 0.08)',
              borderLeft: '3px solid hsl(var(--color-accent))',
              padding: '6px 10px', 
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-md)',
              textAlign: 'left'
            }
          }, restrictionText));
        }

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
        // --- STEP 2: DETAILS FORM ---
        container.appendChild(h('h4', {}, i18n.t('booking_step3')));

        // Visual Receipt Summary
        const totalPrice = calculatePrice();
        const depositPrice = Math.round(totalPrice * 0.5);
        const isDepositRequired = state.isDayRate || state.selectedSlots.length >= 3;

        const receiptContainer = h('div', { className: 'booking-receipt-premium' },
          h('div', { className: 'receipt-title' }, i18n.t('booking_receipt_title') || 'Resumen de tu Pre-Reserva'),
          h('div', { className: 'receipt-grid' },
            h('div', { className: 'receipt-row' }, 
              h('span', { className: 'receipt-label' }, i18n.t('booking_receipt_room') || 'Sala:'),
              h('span', { className: 'receipt-val' }, state.selectedSalaObj?.nombre || state.selectedSalaId)
            ),
            h('div', { className: 'receipt-row' }, 
              h('span', { className: 'receipt-label' }, i18n.t('booking_receipt_date') || 'Fecha:'),
              h('span', { className: 'receipt-val' }, state.selectedDate.toLocaleDateString(i18n.currentLanguage === 'ca' ? 'ca-ES' : i18n.currentLanguage === 'de' ? 'de-DE' : i18n.currentLanguage === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))
            ),
            h('div', { className: 'receipt-row' }, 
              h('span', { className: 'receipt-label' }, i18n.t('booking_receipt_time') || 'Horario:'),
              h('span', { className: 'receipt-val' }, state.selectedSlots.join(', ') + 'h' + ` (${state.selectedSlots.length} h)`)
            ),
            h('div', { className: 'receipt-row highlight' }, 
              h('span', { className: 'receipt-label' }, i18n.t('booking_receipt_price') || 'Precio Estimado:'),
              h('span', { className: 'receipt-val price' }, `${totalPrice}€`)
            )
          ),
          isDepositRequired ? h('div', { className: 'receipt-deposit-box' },
            h('strong', {}, (i18n.t('booking_receipt_deposit') || '⚠️ Depósito del 50% requerido') + ': '),
            h('span', {}, (i18n.t('booking_receipt_deposit_desc') || 'Se requiere un depósito de {deposit}€ para confirmar la reserva.').replace('{deposit}', depositPrice))
          ) : null
        );
        container.appendChild(receiptContainer);
        
        const confirmBtn = h('button', { 
            className: 'btn-reserve',
            onclick: saveAttemptAndGo
        }, i18n.t('booking_confirm'));

        const updateBtnState = () => {
            if (state.form.nombre && state.form.email && state.form.telefono) {
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
            } else {
                confirmBtn.disabled = true;
                confirmBtn.style.opacity = '0.5';
            }
        };

        const inputNombre = h('input', { 
            type: 'text', placeholder: i18n.t('booking_name_ph'), 
            className: 'form-input-premium',
            value: state.form.nombre,
            oninput: (e) => { 
                state.form.nombre = e.target.value; 
                updateBtnState();
            }
        });
        
        const inputEmail = h('input', { 
            type: 'email', placeholder: i18n.t('booking_email_ph') || 'Correo electrónico', 
            className: 'form-input-premium',
            value: state.form.email,
            oninput: (e) => { 
                state.form.email = e.target.value; 
                updateBtnState();
            }
        });

        const inputTelefono = h('input', { 
            type: 'tel', placeholder: i18n.t('booking_phone_ph') || 'Teléfono / WhatsApp', 
            className: 'form-input-premium',
            value: state.form.telefono,
            oninput: (e) => { 
                state.form.telefono = e.target.value; 
                updateBtnState();
            }
        });

        const inputActividad = h('input', { 
            type: 'text', placeholder: i18n.t('booking_activity_ph') || '¿Qué actividad realizarás?', 
            className: 'form-input-premium',
            value: state.form.actividad,
            oninput: (e) => { 
                state.form.actividad = e.target.value; 
            }
        });

        const checkboxRuidosa = h('input', {
            type: 'checkbox',
            id: 'ruidosa-chk',
            checked: state.form.ruidosa,
            onchange: (e) => {
                state.form.ruidosa = e.target.checked;
            }
        });

        const labelRuidosa = h('label', { 
            for: 'ruidosa-chk', 
            className: 'form-checkbox-label' 
        }, i18n.t('booking_ruidosa_label') || 'Implica música, sonido o ruido considerable');

        const checkboxContainer = h('div', { className: 'checkbox-container-premium' },
            checkboxRuidosa,
            labelRuidosa
        );

        const form = h('div', { className: 'booking-form-premium' },
            inputNombre,
            h('div', { className: 'form-row-two-col' }, inputEmail, inputTelefono),
            inputActividad,
            checkboxContainer,
            h('p', { className: 'booking-note-premium' }, i18n.t('booking_form_note'))
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
    state.selectedSlots = [];
    render();
  });

  loadInitialData();
  return container;
}

