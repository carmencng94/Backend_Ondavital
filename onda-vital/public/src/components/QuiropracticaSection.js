import { h } from '../utils.js';

export function QuiropracticaSection() {
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
