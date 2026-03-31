// LanguageSwitcher.js
import { h, injectStyles } from '../utils.js';
import { i18n, SUPPORTED_LANGUAGES } from '../i18n.js';

const languageSwitcherStyles = `
.lang-switcher {
  position: relative;
  display: inline-block;
  user-select: none;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1.5px solid hsl(var(--color-border));
  color: hsl(var(--color-text));
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.lang-btn:hover {
  background: hsl(var(--color-primary-light) / 0.1);
  border-color: hsl(var(--color-primary));
  transform: translateY(-1px);
}

.lang-btn .flag { font-size: 1.2rem; }

.lang-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  transition: transform 0.3s;
  opacity: 0.6;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid hsl(var(--color-border));
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100000;
  padding: 8px;
}

.lang-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: #444;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
}

.lang-option:hover {
  background: hsl(var(--color-primary-light) / 0.1);
  color: hsl(var(--color-primary));
}

.lang-option.selected {
  color: hsl(var(--color-primary));
  font-weight: 700;
  background: hsl(var(--color-primary-light) / 0.15);
}

.lang-option .flag { font-size: 1.1rem; }

/* Mobile View Improvements */
@media (max-width: 900px) {
  .lang-switcher.mobile-view {
    width: 100%;
    margin-top: var(--space-xl);
    padding-top: var(--space-lg);
    border-top: 1px solid #eee;
    text-align: center;
  }
  
  .lang-label {
    display: block;
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .lang-switcher.mobile-view .lang-dropdown {
    position: static;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    background: transparent;
    padding: 0;
    min-width: 0;
  }

  .lang-switcher.mobile-view .lang-option {
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 0;
    border: 1px solid #eee;
    background: white;
  }
  
  .lang-switcher.mobile-view .lang-option.selected {
    border-color: hsl(var(--color-primary));
    background: hsl(var(--color-primary-light) / 0.1);
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

const languageMap = {
  es: { name: 'Castellano', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ca: { name: 'Català', flag: '🏳️' }
};

export function LanguageSwitcher({ isMobile = false } = {}) {
  injectStyles('lang-switcher-styles', languageSwitcherStyles);

  const container = h('div', { className: `lang-switcher ${isMobile ? 'mobile-view' : 'desktop-view'}` });
  
  if (isMobile) {
    container.appendChild(h('span', { className: 'lang-label' }, i18n.currentLanguage === 'es' ? 'Cambiar idioma' : 'Change language'));
  }

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
    h('span', { className: 'flag' }, languageMap[i18n.currentLanguage].flag),
    h('span', {}, i18n.currentLanguage.toUpperCase()),
    h('svg', { viewBox: '0 0 24 24', innerHTML: '<path d="M7 10l5 5 5-5z"/>' })
  );

  const dropdown = h('div', { className: 'lang-dropdown' },
    ...SUPPORTED_LANGUAGES.map(lang => 
      h('button', {
        className: `lang-option ${lang === i18n.currentLanguage ? 'selected' : ''}`,
        onclick: () => {
          i18n.setLanguage(lang);
        }
      }, 
        h('span', { className: 'flag' }, languageMap[lang].flag),
        h('span', {}, languageMap[lang].name)
      )
    )
  );

  // Click outside listener (Desktop)
  if (!isMobile) {
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('active');
        const svg = toggleBtn.querySelector('svg');
        if(svg) svg.style.transform = 'rotate(0deg)';
      }
    });
  }

  if (isMobile) {
    container.appendChild(dropdown);
  } else {
    container.appendChild(toggleBtn);
    container.appendChild(dropdown);
  }

  return container;
}
