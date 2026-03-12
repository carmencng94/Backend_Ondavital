import { h } from '../utils.js';

export function ContactoSection() {
  return h('section', { id: 'contacto', className: 'tab-section' },
    h('div', { className: 'contacto-grid' },
      h('div', { className: 'map-container' }),
      h('div', { className: 'contacto-info' },
        h('h2', {}, 'Contáctanos'),
        h('div', { style: { marginBottom: 'var(--space-lg)' } },
          h('p', {}, h('strong', {}, 'Quiropráctica: '), '601 39 21 61'),
          h('p', {}, 'Lunes y Miércoles: 17:30 - 20h'),
          h('p', {}, 'Martes y Jueves: 10:30 - 13h')
        ),
        h('div', { style: { marginBottom: 'var(--space-lg)' } },
          h('p', {}, h('strong', {}, 'Alquiler de Salas: ')),
          h('p', {}, 'WhatsApp - 601 39 21 61 (David)')
        ),
        h('p', {}, 'c/ Martí Boneo, 31 bajos', h('br'), '07013 Palma de Mallorca (Son Dameto)'),
        h('button', { 
          className: 'btn-primary btn-contact-bot', 
          style: { marginTop: 'var(--space-md)' },
          onclick: () => {
             const win = document.getElementById('chat-window');
             if (win && win.classList.contains('hidden')) {
               const chatBtn = document.querySelector('.chat-widget-btn');
               if(chatBtn) chatBtn.click();
             }
          }
        }, 'Chat con Asistente Virtual')
      )
    )
  );
}
