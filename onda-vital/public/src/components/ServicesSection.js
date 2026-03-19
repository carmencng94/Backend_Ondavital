import { h } from '../utils.js';

export function Accordion(title, content) {
  let isOpen = false;
  const contentEl = h('div', { className: 'accordion-content', style: { display: 'none', padding: 'var(--space-md) 0' } }, content);
  
  const toggle = () => {
    isOpen = !isOpen;
    contentEl.style.display = isOpen ? 'block' : 'none';
  };

  return h('div', { className: 'accordion-item', style: { borderBottom: '1px solid hsl(var(--color-border))', marginBottom: 'var(--space-md)' } },
    h('div', { 
      className: 'accordion-header', 
      onclick: toggle, 
      style: { cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', fontWeight: 'var(--font-semibold)' } 
    }, 
      title,
      h('span', {}, '+')
    ),
    contentEl
  );
}

export function ServicesSection() {
  const c = window.siteContent || {};

  return h('section', { id: 'services', className: 'tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px' } },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, c.services_title || 'Nuestros Servicios Holísticos'),
      Accordion(c.services_nsa_title || 'Quiropráctica Integral (NSA)', 
        c.services_nsa_desc || 'El Network Spinal Analysis es una técnica suave que ayuda al sistema nervioso a liberar tensiones y reorganizarse.'),
      Accordion(c.services_reso_title || 'Resosense Formación', 
        c.services_reso_desc || 'Método único que combina respiración, sonido y conciencia corporal para elevar tu vitalidad.'),
      Accordion(c.services_talleres_title || 'Talleres y Clases Grupales', 
        c.services_talleres_desc || 'Disponemos de clases de Yoga, Meditación y diversos talleres de crecimiento personal.')
    )
  );
}
