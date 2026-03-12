import { h } from '../utils.js';

export function Header() {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'quiropractica', label: 'Quiropráctica' },
    { id: 'resosense', label: 'Resosense' },
    { id: 'salas', label: 'Salas' },
    { id: 'contacto', label: 'Contacto' }
  ];

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('tab-change', { detail: id }));
  };

  return h('header', { className: 'navbar' },
    h('div', { className: 'brand' },
      h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none' },
        h('path', { d: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.95 7.06 4.57 11 4.07V19.93ZM13 4.07C16.94 4.57 20 7.95 20 12C20 16.05 16.94 19.43 13 19.93V4.07Z', fill: 'var(--color-primary)' })
      ),
      ' Onda Vital Holistic'
    ),
    h('ul', { className: 'nav-links' },
      navItems.map(item => 
        h('li', {}, 
          h('a', { 
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
