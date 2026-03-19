import { h } from '../utils.js';

export function Header() {
  const navItems = [
    { id: 'home',          label: 'Home' },
    { id: 'quiropractica', label: 'Quiropráctica' },
    { id: 'resosense',     label: 'Resosense' },
    { id: 'salas',         label: 'Salas' },
    { id: 'contacto',      label: 'Contacto' },
    { id: 'admin',         label: 'Panel Admin', isLink: true, url: '/admin' }
  ];

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    if (id === 'asistente') {
      document.dispatchEvent(new CustomEvent('abrir-chat-asistente'));
      return;
    }
    document.dispatchEvent(new CustomEvent('tab-change', { detail: id }));
  };

  return h('header', { className: 'navbar' },
    // Lado izquierdo: Logo + botón Asistente Vitalis
    h('div', { className: 'brand' },
      h('img', {
        src: 'assets/images/logo_onda_vital.png',
        alt: 'Onda Vital Logo',
        className: 'nav-logo',
        onclick: (e) => handleLinkClick(e, 'home')
      }),
      h('button', {
        className: 'btn-vitalis-nav',
        onclick: (e) => { e.preventDefault(); handleLinkClick(e, 'asistente'); }
      }, '✦ Asistente Vitalis')
    ),
    // Lado derecho: Menú de navegación
    h('ul', { className: 'nav-links' },
      navItems.map(item =>
        h('li', {},
          item.isLink 
            ? h('a', { href: item.url, style: { color: 'hsl(var(--color-primary))', fontWeight: 'bold' } }, item.label)
            : h('a', {
                dataset: { tab: item.id },
                className: item.id === 'home' ? 'active' : '',
                href: '#',
                onclick: (e) => handleLinkClick(e, item.id)
              }, item.label)
        )
      )
    )
  );
}
