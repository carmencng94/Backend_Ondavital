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

.lang-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.lang-switcher.inline-view .lang-btn {
  padding: 7px 12px;
  min-height: 38px;
}

.lang-switcher.inline-view.compact .lang-btn {
  padding: 7px 10px;
}

.lang-switcher.inline-view.compact .lang-btn-code {
  font-size: var(--text-xs);
}

.lang-flag-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.lang-flag-img {
  width: 20px;
  height: 14px;
  border-radius: 3px;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.lang-flag-fallback {
  font-size: 10px;
  font-weight: 700;
  color: hsl(var(--color-primary));
}

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
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #eee;
    text-align: left;
  }

  .lang-switcher.mobile-view .lang-btn {
    width: 100%;
    justify-content: space-between;
    border-radius: 12px;
    padding: 8px 10px;
    min-height: 36px;
  }

  .lang-label {
    display: block;
    font-size: 0.68rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .lang-switcher.mobile-view .lang-dropdown {
    position: static;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    opacity: 0;
    visibility: hidden;
    max-height: 0;
    overflow: hidden;
    transform: none;
    box-shadow: none;
    background: transparent;
    padding: 0;
    min-width: 0;
    border: 0;
    margin-top: 0;
    transition: max-height 0.25s ease, opacity 0.2s ease, margin-top 0.2s ease;
  }

  .lang-switcher.mobile-view .lang-dropdown.active {
    opacity: 1;
    visibility: visible;
    max-height: 220px;
    margin-top: 6px;
  }

  .lang-switcher.mobile-view .lang-option {
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 0;
    border: 1px solid #eee;
    background: white;
    min-height: 50px;
  }
  
  .lang-switcher.mobile-view .lang-option.selected {
    border-color: hsl(var(--color-primary));
    background: hsl(var(--color-primary-light) / 0.1);
  }

  .lang-switcher.desktop-view {
    display: none;
  }

  .lang-switcher.inline-view .lang-btn {
    padding: 6px 10px;
    min-height: 34px;
  }

  .lang-switcher.inline-view .lang-btn-code {
    font-size: 11px;
  }

  .lang-switcher.inline-view .lang-btn svg {
    width: 12px;
    height: 12px;
  }

  .lang-switcher.inline-view .lang-dropdown {
    right: auto;
    left: 0;
  }
}

@media (min-width: 901px) {
  .lang-switcher.mobile-view {
    display: none;
  }
}
`;

const languageMap = {
  es: { name: 'Castellano', flag: '🇪🇸', code: 'ES', img: '/assets/images/flags/es.svg' },
  en: { name: 'English', flag: '🇬🇧', code: 'EN', img: '/assets/images/flags/gb.svg' },
  de: { name: 'Deutsch', flag: '🇩🇪', code: 'DE', img: '/assets/images/flags/de.svg' },
  ca: { name: 'Català', flag: '🏴', code: 'CA', img: '/assets/images/flags/ca.svg' }
};

function renderFlag(lang) {
  const meta = languageMap[lang] || {};
  return h('span', { className: 'lang-flag-wrap' },
    h('img', {
      className: 'lang-flag-img',
      src: meta.img,
      alt: `Bandera ${meta.name || lang}`,
      loading: 'lazy'
    }),
    h('span', { className: 'lang-flag-fallback', style: { display: 'none' } }, meta.code || String(lang).toUpperCase())
  );
}

export function LanguageSwitcher({ isMobile = false, variant = null, compact = false } = {}) {
  injectStyles('lang-switcher-styles', languageSwitcherStyles);

  const resolvedVariant = variant || (isMobile ? 'mobile' : 'desktop');
  const classes = ['lang-switcher'];

  if (resolvedVariant === 'mobile') classes.push('mobile-view');
  if (resolvedVariant === 'desktop') classes.push('desktop-view');
  if (resolvedVariant === 'inline') classes.push('inline-view');
  if (compact) classes.push('compact');

  const container = h('div', { className: classes.join(' ') });
  
  if (resolvedVariant === 'mobile') {
    container.appendChild(h('span', { className: 'lang-label' }, i18n.currentLanguage === 'es' ? 'Cambiar idioma' : 'Change language'));
  }

  const toggleBtn = h('button', { 
    className: 'lang-btn',
    type: 'button',
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
    h('span', { className: 'lang-btn-main' },
      renderFlag(i18n.currentLanguage),
      h('span', { className: 'lang-btn-code' }, i18n.currentLanguage.toUpperCase())
    ),
    h('svg', { viewBox: '0 0 24 24', innerHTML: '<path d="M7 10l5 5 5-5z"/>' })
  );

  const dropdown = h('div', { className: 'lang-dropdown' },
    ...SUPPORTED_LANGUAGES.map(lang => 
      h('button', {
        className: `lang-option ${lang === i18n.currentLanguage ? 'selected' : ''}`,
        onclick: () => {
          i18n.setLanguage(lang);
          dropdown.classList.remove('active');
          const svg = toggleBtn.querySelector('svg');
          if (svg) svg.style.transform = 'rotate(0deg)';
        }
      }, 
        renderFlag(lang),
        h('span', {}, languageMap[lang].name)
      )
    )
  );

  // Click outside listener
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.classList.remove('active');
      const svg = toggleBtn.querySelector('svg');
      if (svg) svg.style.transform = 'rotate(0deg)';
    }
  });

  container.appendChild(toggleBtn);
  container.appendChild(dropdown);

  return container;
}
