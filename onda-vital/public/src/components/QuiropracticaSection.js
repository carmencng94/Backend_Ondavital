import { h, injectStyles } from '../utils.js';

const quiroStyles = `
#quiropractica {
  background-color: hsl(var(--color-surface-elevated));
}

.quiro-hero {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.quiro-hero h2 {
  font-size: var(--text-4xl);
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-xs);
}

.quiro-hero .subtitle {
  font-size: var(--text-xl);
  color: hsl(var(--color-accent));
  font-style: italic;
  font-weight: var(--font-medium);
}

.quiro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
}

@media (max-width: 900px) {
  .quiro-grid { grid-template-columns: 1fr; }
  .quiro-grid.reverse { display: flex; flex-direction: column-reverse; }
}

.quiro-text-block { line-height: 1.8; }
.quiro-text-block p { margin-bottom: var(--space-md); }

.quiro-benefits {
  list-style: none;
  margin: var(--space-lg) 0;
}

.quiro-benefits li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: white;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid hsl(var(--color-primary));
}

.quiro-benefits li::before {
  content: "✦";
  color: hsl(var(--color-accent));
  font-weight: bold;
}

.quiro-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.quiro-img-frame {
  aspect-ratio: 4/5;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 8px solid white;
  transition: transform var(--transition-base);
}

.quiro-img-frame[data-order="2"] {
  transform: translateY(20px);
}

.quiro-img-frame:hover {
  transform: scale(1.05) rotate(1deg);
  z-index: 2;
}

.quiro-technique {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  margin: var(--space-2xl) 0;
  box-shadow: var(--shadow-md);
  border-left: 6px solid hsl(var(--color-primary));
}

.quiro-technique h3 {
  color: hsl(var(--color-primary));
  font-size: var(--text-2xl);
  margin-bottom: var(--space-md);
}

.quiro-cta {
  text-align: center;
  padding: var(--space-2xl);
  background: hsl(var(--color-primary));
  color: white;
  border-radius: var(--radius-xl);
  margin-top: var(--space-2xl);
  box-shadow: var(--shadow-lg);
}

.quiro-cta h3 { font-size: var(--text-2xl); margin-bottom: var(--space-sm); }
.cta-phone {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  display: block;
  margin-top: var(--space-sm);
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.cta-phone:hover { text-decoration: underline; }
`;

export function QuiropracticaSection() {
  injectStyles('quiro-styles', quiroStyles);
  const c = window.siteContent || {};

  return h('section', { id: 'quiropractica', className: 'tab-section' },
    h('div', { className: 'container' },
      // Hero / Introducción
      h('div', { className: 'quiro-hero' },
        h('h2', {}, c.quiro_title || 'Quiropráctica'),
        h('p', { className: 'subtitle' }, c.quiro_subtitle || '¡No hay que estar mal para estar mejor!')
      ),

      // Grid Principal: Texto + Imágenes
      h('div', { className: 'quiro-grid' },
        h('div', { className: 'quiro-text-block' },
          h('p', {}, c.quiro_intro_1 || 'La Quiropráctica es una profesión sanitaria reconocida en la mayoría de países desarrollados del mundo. Se trata de mejorar la capacidad del cuerpo de curarse y mantenerse sano.'),
          h('p', {}, c.quiro_intro_2 || 'La gente acude al quiropráctico por muchas razones, entre ellas, para:'),
          h('ul', { className: 'quiro-benefits' },
            h('li', {}, c.quiro_benefits_li1 || 'Aliviar el dolor, nerviosismo y síntomas de estrés'),
            h('li', {}, c.quiro_benefits_li2 || 'Mejorar el sueño, digestión o movilidad'),
            h('li', {}, c.quiro_benefits_li3 || 'Sentirse bien y disfrutar más de la vida')
          ),
          h('p', {}, c.quiro_integral_desc || 'La Quiropráctica Integral que utilizamos en Onda Vital se basa en un conjunto de métodos. Combina técnicas físicas/energéticas con la enseñanza de prácticas personales que empoderan al cliente a tomar un papel más activo en su propia mejora.')
        ),
        h('div', { className: 'quiro-images' },
          h('div', { 
            className: 'quiro-img-frame', 
            'data-order': '1',
            style: { backgroundImage: "url('/assets/images/quiropractica-1.png')" }
          }),
          h('div', { 
            className: 'quiro-img-frame', 
            'data-order': '2',
            style: { backgroundImage: "url('/assets/images/quiropractica-2.png')" }
          })
        )
      ),

      // Técnicas Específicas
      h('div', { className: 'quiro-technique' },
        h('h3', {}, c.quiro_dea_title || 'DEA - Deep Energetic Awakening'),
        h('p', {}, c.quiro_dea_desc || 'Basada en Network Spinal Analysis, es una técnica avanzada y a la vez muy suave. Ayuda a que el cuerpo aprenda a reconocer y corregir patrones de tensión y distorsión que impiden su buen funcionamiento.'),
        h('p', {}, c.quiro_dea_extra || '¡Asiste a tu cuerpo a recuperar su estado natural de salud para disfrutar de la vida con menos dolor, menos estrés y más flexibilidad y energía!'),
        h('a', { 
          href: 'https://www.deawakening.com/', 
          target: '_blank', 
          rel: 'noopener noreferrer',
          className: 'btn-external-link' 
        }, 'Visitar la web oficial de DEAwakening ↗')
      ),

      h('div', { className: 'quiro-grid reverse' },
        h('div', { className: 'quiro-text-block' },
          h('h3', { style: { color: 'hsl(var(--color-primary))', marginBottom: 'var(--space-md)' } }, 'Resosense'),
          h('p', {}, c.quiro_resosense_desc || 'Práctica personal desarrollada por David Biddle aquí en Mallorca. Utiliza la resonancia estructural del cuerpo para equilibrar y mejorar tu ser.'),
          h('p', {}, c.quiro_resosense_extra || 'Con solo unos minutos al día, tumbado, usando los suaves movimientos, se generan cambios sorprendentes. Es el complemento perfecto al DEA.')
        ),
        h('div', { className: 'quiro-text-block' },
          h('p', { style: { fontWeight: 'var(--font-medium)', borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-md)' } }, 
            c.quiro_eval_desc || 'Para empezar con nosotros, hacemos una evaluación inicial en dos visitas. Así podemos entender bien tanto los problemas como las metas de cada cliente para maximizar el éxito de su tratamiento.'
          )
        )
      ),

      // Call to Action
      h('div', { className: 'quiro-cta' },
        h('h3', {}, c.quiro_cta_title || '¿Listo para empezar tu camino al bienestar?'),
        h('p', {}, c.quiro_cta_subtitle || 'Llámanos para concertar una cita de evaluación'),
        h('div', { 
          className: 'cta-phone phone-cta-link', 
          onclick: () => window.location.href = `tel:+34${(c.contacto_telefono || "601392161").replace(/\\s/g,'')}` 
        }, 
          h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })
        )
      )
    )
  );
}
