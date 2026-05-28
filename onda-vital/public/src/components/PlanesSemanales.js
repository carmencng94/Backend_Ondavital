import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const planesStyles = `
/* Contenedor Principal */
.planes-semanales-section {
  padding: var(--space-3xl) var(--space-xl);
  background: linear-gradient(135deg, hsl(var(--color-primary-light) / 0.1) 0%, rgba(255,255,255,0.8) 100%);
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  margin: var(--space-2xl) auto;
  max-width: 1200px;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255,255,255,0.5);
}

.planes-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.planes-title {
  font-size: 2.5rem;
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-md);
  font-weight: var(--font-bold);
}

.planes-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Tarjetas de Precios */
.planes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  position: relative;
  z-index: 2;
}

.plan-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255,255,255,0.6);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
  border-color: hsl(var(--color-primary-light));
}

.plan-card-header {
  text-align: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 2px dashed hsl(var(--color-primary-light) / 0.3);
}

.plan-card-title {
  font-size: 1.4rem;
  color: hsl(var(--color-primary-dark));
  font-weight: var(--font-bold);
  margin-bottom: var(--space-sm);
}

/* Lista de Precios */
.plan-prices-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.plan-price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid hsl(var(--color-border) / 0.5);
  font-size: 1rem;
}

.plan-price-item:last-child {
  border-bottom: none;
}

.plan-hours {
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.plan-amount {
  font-weight: var(--font-bold);
  color: hsl(var(--color-primary));
  font-size: 1.1rem;
}

.plan-plus {
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: hsl(var(--color-primary-light) / 0.1);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.9rem;
  color: hsl(var(--color-primary-dark));
}

/* Condiciones Importantes */
.planes-conditions {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid hsl(var(--color-accent));
  margin-bottom: var(--space-2xl);
}

.planes-conditions h4 {
  color: hsl(var(--color-primary));
  font-size: 1.2rem;
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: 8px;
}

.planes-conditions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.planes-conditions li {
  position: relative;
  padding-left: 24px;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.planes-conditions li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: hsl(var(--color-accent));
}

/* CTA Botón WhatsApp */
.planes-cta-container {
  text-align: center;
}

.btn-planes-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-primary-hover)) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 1.2rem;
  font-weight: var(--font-bold);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all var(--transition-base);
  text-decoration: none;
}

.btn-planes-cta:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  background: linear-gradient(135deg, hsl(var(--color-primary-hover)) 0%, hsl(var(--color-primary)) 100%);
}

.btn-planes-cta svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
`;

export function PlanesSemanales() {
  injectStyles('planes-semanales-styles', planesStyles);

  const container = h('section', { className: 'planes-semanales-section', id: 'planes-semanales' },
    
    // Cabecera
    h('div', { className: 'planes-header' },
      h('h2', { className: 'planes-title' }, i18n.t('planes_title')),
      h('p', { className: 'planes-subtitle' }, i18n.t('planes_subtitle'))
    ),

    // Grid de Tarjetas
    h('div', { className: 'planes-grid' },
      
      // Tarjeta G1/G2
      PlanCard({
        titleKey: 'planes_grupales',
        prices: [
          { hours: 1, price: 60 },
          { hours: 2, price: 110 },
          { hours: 3, price: 150 },
          { hours: 4, price: 180 },
          { hours: 5, price: 210 },
        ],
        plusMultiplier: 40
      }),

      // Tarjeta Despacho +
      PlanCard({
        titleKey: 'planes_despacho',
        prices: [
          { hours: 1, price: 55 },
          { hours: 2, price: 100 },
          { hours: 3, price: 135 },
          { hours: 4, price: 160 },
          { hours: 5, price: 190 },
        ],
        plusMultiplier: 35
      }),

      // Tarjeta Salas de Terapia
      PlanCard({
        titleKey: 'planes_terapia',
        prices: [
          { hours: 1, price: 50 },
          { hours: 2, price: 90 },
          { hours: 3, price: 120 },
          { hours: 4, price: 145 },
          { hours: 5, price: 165 },
        ],
        plusMultiplier: 30
      })
    ),

    // Condiciones Importantes
    h('div', { className: 'planes-conditions' },
      h('h4', {}, '⚠️ ', i18n.t('planes_conditions_title')),
      h('ul', {},
        h('li', {}, i18n.t('planes_cond_1')),
        h('li', {}, i18n.t('planes_cond_2')),
        h('li', {}, i18n.t('planes_cond_3'))
      )
    ),

    // CTA WhatsApp
    h('div', { className: 'planes-cta-container' },
      h('button', { 
        className: 'btn-planes-cta',
        onclick: () => {
          const mensaje = "Hola David, me gustaría consultar disponibilidad e información para contratar un Plan de Horario Fijo Semanal.";
          window.location.href = `https://wa.me/34601392161?text=${encodeURIComponent(mensaje)}`;
        }
      }, 
        i18n.t('planes_cta'),
        h('svg', { viewBox: "0 0 24 24" }, 
          h('path', { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
        )
      )
    )
  );

  return container;
}

function PlanCard({ titleKey, prices, plusMultiplier }) {
  return h('div', { className: 'plan-card' },
    h('div', { className: 'plan-card-header' },
      h('h3', { className: 'plan-card-title' }, i18n.t(titleKey))
    ),
    h('ul', { className: 'plan-prices-list' },
      ...prices.map(p => 
        h('li', { className: 'plan-price-item' },
          h('span', { className: 'plan-hours' }, `${p.hours} ${i18n.t('planes_hour_week')}`),
          h('span', { className: 'plan-amount' }, `${p.price} ${i18n.t('planes_monthly')}`)
        )
      )
    ),
    h('div', { className: 'plan-plus' }, 
      `${i18n.t('planes_plus_6')} `,
      h('strong', {}, `${plusMultiplier}€`)
    )
  );
}
