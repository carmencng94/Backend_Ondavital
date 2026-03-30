import { h, injectStyles } from '../utils.js';
import { siteConfig } from '../config.js';
import { i18n } from '../i18n.js';
import { LanguageSwitcher } from './LanguageSwitcher.js';

// Estilos del Header
const headerStyles = `
/* Nav Pestañas */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: hsl(var(--color-surface) / 0.85);
  backdrop-filter: blur(12px);
  position: fixed;
  top: 0; width: 100%;
  z-index: 1000;
  border-bottom: 1px solid hsl(var(--color-border));
}

@media (min-width: 1024px) {
  .navbar { padding: var(--space-md) var(--space-2xl); }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: hsl(var(--color-text));
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
  cursor: pointer;
}

.nav-links a:hover, .nav-links a.active {
  color: hsl(var(--color-primary));
}

/* Mobile Toggle */
.nav-toggle {
  display: none;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.nav-toggle .bar {
  height: 2px;
  width: 100%;
  background-color: hsl(var(--color-primary));
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-toggle.active .bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.nav-toggle.active .bar:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active .bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 900px) {
  .navbar {
    padding: var(--space-sm) var(--space-md);
  }

  .nav-toggle {
    display: flex;
    margin-left: var(--space-md);
  }

  .nav-logo {
    height: 38px;
  }

  .btn-vitalis-nav {
    padding: 6px 12px;
    font-size: 0.75rem;
    gap: 4px;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xl);
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
    padding: var(--space-2xl);
    margin: 0;
  }

  .nav-links.active {
    right: 0;
  }

  .nav-links li {
    width: 100%;
    text-align: center;
  }

  .nav-links li a {
    font-size: var(--text-lg);
    display: block;
  }
}

.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.nav-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* Botón Asistente Vitalis en el nav (junto al logo) */
.btn-vitalis-nav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: hsl(var(--color-primary));
  color: white;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: 8px 20px;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: 0 4px 14px hsl(var(--color-primary) / 0.35);
  transition: all var(--transition-fast);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.btn-vitalis-nav:hover {
  background: hsl(var(--color-primary-hover));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px hsl(var(--color-primary) / 0.45);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: default;
}

.nav-logo {
  height: 50px; /* Ajuste profesional */
  width: auto;
  transition: transform var(--transition-fast);
}

.nav-logo:hover {
  transform: scale(1.05);
}
`;

export function Header() {
  injectStyles('header-styles', headerStyles);
  const navItems = [
    { id: 'home',          label: i18n.t('nav_home') },
    siteConfig.features.showSalas ? { id: 'salas', label: i18n.t('nav_salas') } : null,
    siteConfig.features.showQuiropractica ? { id: 'quiropractica', label: i18n.t('nav_quiro') } : null,
    siteConfig.features.showResosenseRedirect ? { id: 'resosense', label: i18n.t('nav_reso'), isExternal: true, url: siteConfig.urls.deawakening } : null,
    { id: 'contacto',      label: i18n.t('nav_contacto') },
    { id: 'admin',         label: i18n.t('nav_admin'), isLink: true, url: '/admin' }
  ].filter(item => item !== null);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    if (id === 'asistente') {
      document.dispatchEvent(new CustomEvent('abrir-chat-asistente'));
      return;
    }
    document.dispatchEvent(new CustomEvent('tab-change', { detail: id }));
  };

  const overlay = h('div', { 
    className: 'nav-overlay', 
    onclick: () => {
      document.querySelector('.nav-links').classList.remove('active');
      document.querySelector('.nav-toggle').classList.remove('active');
      overlay.classList.remove('active');
    } 
  });

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
      }, i18n.t('chat_button'))
    ),
    // Lado derecho: Menú de navegación y Switcher
    h('div', { className: 'nav-menu', style: { display: 'flex', alignItems: 'center', gap: 'var(--space-md)' } },
      LanguageSwitcher(),
      overlay,
      h('button', {
        className: 'nav-toggle',
        onclick: (e) => {
          const isActive = e.currentTarget.classList.toggle('active');
          document.querySelector('.nav-links').classList.toggle('active');
          overlay.classList.toggle('active', isActive);
        }
      },
        h('span', { className: 'bar' }),
        h('span', { className: 'bar' }),
        h('span', { className: 'bar' })
      ),
      h('ul', { className: 'nav-links' },
        navItems.map(item =>
          h('li', {},
            item.isLink 
              ? h('a', { href: item.url, style: { color: 'hsl(var(--color-primary))', fontWeight: 'bold' } }, item.label)
              : h('a', {
                  dataset: { tab: item.id },
                  className: item.id === 'home' ? 'active' : '',
                  href: item.isExternal ? item.url : '#',
                  target: item.isExternal ? '_blank' : '_self',
                  onclick: (e) => {
                    if (!item.isExternal) {
                      handleLinkClick(e, item.id);
                      document.querySelector('.nav-links').classList.remove('active');
                      document.querySelector('.nav-toggle').classList.remove('active');
                      overlay.classList.remove('active');
                    }
                  }
                }, item.label)
          )
        ),
        LanguageSwitcher({ isMobile: true })
      )
    )
  );
}
