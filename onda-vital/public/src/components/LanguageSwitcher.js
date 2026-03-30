// LanguageSwitcher.js
import { h, injectStyles } from '../utils.js';
import { i18n, SUPPORTED_LANGUAGES } from '../i18n.js';

const languageSwitcherStyles = `
.lang-switcher {
  position: relative;
  display: inline-block;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid hsl(var(--color-border));
  color: hsl(var(--color-text));
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-btn:hover {
  background: hsl(var(--color-surface-hover));
  border-color: hsl(var(--color-primary));
}

.lang-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  transition: transform var(--transition-fast);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  right: 0;
  background: hsl(var(--color-surface));
  border: 1px solid hsl(var(--color-border));
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 120px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--transition-fast);
  z-index: 1100;
  overflow: hidden;
}

.lang-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.lang-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: hsl(var(--color-text-muted));
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.lang-option:hover {
  background: hsl(var(--color-surface-hover));
  color: hsl(var(--color-text));
}

.lang-option.selected {
  color: hsl(var(--color-primary));
  font-weight: var(--font-semibold);
  background: hsl(var(--color-surface-hover));
}

/* Modo Mobile: en el menú lateral */
@media (max-width: 900px) {
  .lang-switcher.mobile-view {
    width: 100%;
    margin-top: var(--space-lg);
    border-top: 1px solid hsl(var(--color-border));
    padding-top: var(--space-lg);
    text-align: center;
  }
  
  .lang-switcher.mobile-view .lang-btn {
    width: 100%;
    justify-content: center;
    border: none;
    font-size: var(--text-lg);
  }

  .lang-switcher.mobile-view .lang-dropdown {
    position: static;
    box-shadow: none;
    border: none;
    background: transparent;
    min-width: 100%;
    transform: none;
    opacity: 1;
    visibility: visible;
    display: flex;
    justify-content: center;
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .lang-switcher.mobile-view .lang-dropdown .lang-option {
    padding: 6px 12px;
    border: 1px solid hsl(var(--color-border));
    border-radius: var(--radius-md);
    width: auto;
  }

  .lang-switcher.desktop-view {
    display: none;
  }
}

@media (min-width: 901px) {
  .lang-switcher.mobile-view {
    display: none;
  }
}
`;

const languageNames = {
  es: 'ES',
  en: 'EN',
  de: 'DE',
  ca: 'CA'
};

export function LanguageSwitcher({ isMobile = false } = {}) {
  injectStyles('lang-switcher-styles', languageSwitcherStyles);

  const container = h('div', { className: `lang-switcher ${isMobile ? 'mobile-view' : 'desktop-view'}` });
  
  const toggleBtn = h('button', { 
    className: 'lang-btn',
    onclick: (e) => {
      e.stopPropagation();
      const dropdown = container.querySelector('.lang-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('active');
        const svg = toggleBtn.querySelector('svg');
        if(svg) {
          svg.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    }
  }, 
    languageNames[i18n.currentLanguage],
    !isMobile ? h('svg', { viewBox: '0 0 24 24', innerHTML: '<path d="M7 10l5 5 5-5z"/>' }) : null
  );

  const dropdown = h('div', { className: 'lang-dropdown' },
    ...SUPPORTED_LANGUAGES.map(lang => 
      h('button', {
        className: `lang-option ${lang === i18n.currentLanguage ? 'selected' : ''}`,
        onclick: () => {
          i18n.setLanguage(lang);
        }
      }, languageNames[lang])
    )
  );

  // Cerrar al hacer clic fuera (solo en desktop)
  if (!isMobile) {
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('active');
        const svg = toggleBtn.querySelector('svg');
        if(svg) svg.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Si es mobile, el dropdown siempre está visible como botones (ver CSS)
  if (isMobile) {
    container.appendChild(dropdown);
  } else {
    container.appendChild(toggleBtn);
    container.appendChild(dropdown);
  }

  return container;
}
