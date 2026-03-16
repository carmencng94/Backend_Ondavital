import { h } from '../utils.js';

export function Footer() {
  const container = h('footer', { id: 'main-footer', className: 'site-footer' },
    h('div', { className: 'footer-top-bar' },
      h('a', { href: '#' }, 'Contrato de Formación'),
      h('span', {}, ' | '),
      h('a', { href: '#' }, 'Política de Privacidad')
    ),
    h('div', { className: 'container footer-main-grid' },
      // Columna 1: Info General
      h('div', { className: 'footer-col' },
        h('h3', { className: 'footer-title' }, 'Quiropráctica'),
        h('p', { className: 'footer-desc' }, 'Centro de bienestar y técnicas manuales para tu salud integral.'),
        h('p', { className: 'footer-addr' }, 'c/ Martí Boneo, 31 bajos, 07013 Palma'),
        h('div', { className: 'footer-schedule' },
          h('h4', {}, 'Horario de información:'),
          h('p', {}, h('strong', {}, 'Lunes y Miércoles: '), '17:30 a 20:00 h'),
          h('p', {}, h('strong', {}, 'Martes y Jueves: '), '10:30 a 13:00 h')
        ),
        h('div', { className: 'footer-socials' },
          h('a', { href: '#', className: 'social-icon' }, 
            h('svg', { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor" }, 
              h('path', { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" })
            )
          ),
          h('a', { href: '#', className: 'social-icon' }, 
            h('svg', { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor" }, 
              h('path', { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" })
            )
          )
        )
      ),
      // Columna 2: Mapa
      h('div', { className: 'footer-col footer-map-col' },
        h('h4', { className: 'mini-title' }, 'Nuestra Ubicación'),
        h('div', { className: 'footer-map-wrapper' },
          h('iframe', {
            src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.079158571901!2d2.629072076227549!3d39.58036630611775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129792626520677d%3A0x3a90b5467544c799!2sOnda%20Vital%20Holistic!5e0!3m2!1ses!2ses!4v1773658293705!5m2!1ses!2ses",
            width: "100%",
            height: "100%",
            style: "border:0;",
            allowfullscreen: "",
            loading: "lazy",
            referrerpolicy: "no-referrer-when-downgrade"
          })
        )
      ),
      // Columna 3: Contacto
      h('div', { className: 'footer-col' },
        h('h4', { className: 'mini-title' }, 'Contacto'),
        h('p', { className: 'footer-email' }, 'info@ondavitalholistic.com'),
        h('p', { className: 'footer-phone' }, 'Teléfono: 601 39 21 61'),
        h('p', { className: 'footer-whatsapp' }, 'WhatsApp: 601 39 21 61 (David)')
      ),
      // Columna 4: Formulario
      h('div', { className: 'footer-col' },
        h('h4', { className: 'mini-title' }, 'Solicite información'),
        h('form', { className: 'footer-form' },
          h('div', { className: 'footer-form-group' },
            h('label', {}, 'Nombre'),
            h('input', { type: 'text', placeholder: 'Escriba su nombre' })
          ),
          h('div', { className: 'footer-form-group' },
            h('label', {}, 'Email*'),
            h('input', { type: 'email', placeholder: 'Escriba su email' })
          ),
          h('div', { className: 'footer-form-group' },
            h('label', {}, 'Asunto*'),
            h('textarea', { placeholder: 'Ingresa tu mensaje' })
          ),
          h('button', { type: 'button', className: 'btn-footer-submit' }, 'Enviar')
        )
      )
    ),
    h('div', { className: 'footer-bottom-bar' },
      h('p', {}, '© 1996- 2025 Onda Vital Holistic. All Rights Reserved.')
    )
  );

  // Lógica para ocultar en contacto
  document.addEventListener('tab-change', (e) => {
    const tabId = e.detail;
    if (tabId === 'contacto') {
      container.classList.add('hidden');
    } else {
      container.classList.remove('hidden');
    }
  });

  return container;
}
