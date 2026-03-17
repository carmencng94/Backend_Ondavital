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
    h('div', { className: 'brand', onclick: (e) => handleLinkClick(e, 'home') },
      h('img', { 
        src: 'assets/images/logo_onda_vital.png', 
        alt: 'Onda Vital Logo',
        className: 'nav-logo'
      })
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
