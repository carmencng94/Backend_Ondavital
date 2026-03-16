import { h } from '../utils.js';

export function ContactoSection() {
  return h('section', { id: 'contacto', className: 'tab-section' },
    h('div', { className: 'container' },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, 'Contáctanos'),
      h('div', { className: 'contacto-grid' },
        h('div', { className: 'contacto-info' },
          h('div', { className: 'contact-method' },
            h('h3', {}, 'Quiropráctica'),
            h('p', { className: 'phone' }, h('strong', {}, '601 39 21 61')),
            h('div', { className: 'schedule' },
              h('p', {}, 'Lunes y Miércoles: 17:30 - 20h'),
              h('p', {}, 'Martes y Jueves: 10:30 - 13h')
            )
          ),
          h('div', { className: 'contact-method', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, 'Alquiler de Salas'),
            h('p', {}, h('strong', {}, 'WhatsApp: '), '601 39 21 61'),
            h('p', { className: 'contact-name' }, 'Atención: David')
          ),
          h('div', { className: 'contact-location', style: { marginTop: 'var(--space-lg)' } },
            h('h3', {}, 'Dirección'),
            h('p', {}, 'c/ Martí Boneo, 31 bajos'),
            h('p', {}, '07013 Palma de Mallorca (Son Dameto)')
          )
        ),
        h('div', { className: 'contacto-form-container' },
          h('form', { 
            className: 'contact-form',
            onsubmit: (e) => {
              e.preventDefault();
              alert('Mensaje enviado. ¡Gracias!');
              e.target.reset();
            }
          },
            h('div', { className: 'form-group' },
              h('label', {}, 'Nombre *'),
              h('input', { type: 'text', required: true, placeholder: 'Tu nombre' })
            ),
            h('div', { className: 'form-group' },
              h('label', {}, 'Email *'),
              h('input', { type: 'email', required: true, placeholder: 'tu@email.com' })
            ),
            h('div', { className: 'form-group' },
              h('label', {}, 'Mensaje'),
              h('textarea', { rows: 4, placeholder: '¿En qué podemos ayudarte?' })
            ),
            h('button', { type: 'submit', className: 'btn-submit' }, 'Enviar')
          )
        )
      ),
      h('div', { className: 'map-container', style: { marginTop: 'var(--space-2xl)' } })
    )
  );
}
