import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const quiroStyles = `
#quiropractica {
  background-color: hsl(var(--color-surface-elevated));
}

.quiro-hero {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.quiro-hero h2 {
  font-size: var(--text-4xl);
  color: hsl(var(--color-primary));
  margin-bottom: var(--space-xs);
}

.quiro-hero .subtitle {
  font-size: var(--text-xl);
  color: hsl(var(--color-accent));
  font-style: italic;
  font-weight: var(--font-medium);
}

.quiro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
}

@media (max-width: 900px) {
  .quiro-grid { grid-template-columns: 1fr; }
  .quiro-grid.reverse { display: flex; flex-direction: column-reverse; }
}

.quiro-text-block { line-height: 1.8; }
.quiro-text-block p { margin-bottom: var(--space-md); }

.quiro-benefits {
  list-style: none;
  margin: var(--space-lg) 0;
}

.quiro-benefits li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: white;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid hsl(var(--color-primary));
}

.quiro-benefits li::before {
  content: "✦";
  color: hsl(var(--color-accent));
  font-weight: bold;
}

.quiro-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.quiro-img-frame {
  aspect-ratio: 4/5;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 8px solid white;
  transition: transform var(--transition-base);
}

.quiro-img-frame[data-order="2"] {
  transform: translateY(20px);
}

.quiro-img-frame:hover {
  transform: scale(1.05) rotate(1deg);
  z-index: 2;
}

.quiro-technique {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  margin: var(--space-2xl) 0;
  box-shadow: var(--shadow-md);
  border-left: 6px solid hsl(var(--color-primary));
}

.quiro-technique h3 {
  color: hsl(var(--color-primary));
  font-size: var(--text-2xl);
  margin-bottom: var(--space-md);
}

.quiro-cta {
  text-align: center;
  padding: var(--space-2xl);
  background: hsl(var(--color-primary));
  color: white;
  border-radius: var(--radius-xl);
  margin-top: var(--space-2xl);
  box-shadow: var(--shadow-lg);
}

.quiro-cta h3 { font-size: var(--text-2xl); margin-bottom: var(--space-sm); }
.cta-phone {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  display: block;
  margin-top: var(--space-sm);
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.cta-phone:hover { text-decoration: underline; }
`;

export function QuiropracticaSection() {
  injectStyles('quiro-styles', quiroStyles);
  const c = window.siteContent || {};

  return h('section', { id: 'quiropractica', className: 'tab-section' },
    h('div', { className: 'container' },
      // Hero / Introducción
      h('div', { className: 'quiro-hero' },
        h('h2', {}, i18n.t('quiro_title')),
        h('p', { className: 'subtitle' }, i18n.t('quiro_subtitle'))
      ),

      // Grid Principal: Texto + Imágenes
      h('div', { className: 'quiro-grid' },
        h('div', { className: 'quiro-text-block' },
          h('p', {}, i18n.t('quiro_intro_1')),
          h('p', {}, i18n.t('quiro_intro_2')),
          h('ul', { className: 'quiro-benefits' },
            h('li', {}, i18n.t('quiro_benefits_li1')),
            h('li', {}, i18n.t('quiro_benefits_li2')),
            h('li', {}, i18n.t('quiro_benefits_li3'))
          ),
          h('p', {}, i18n.t('quiro_integral_desc'))
        ),
        h('div', { className: 'quiro-images' },
          h('div', { 
            className: 'quiro-img-frame', 
            'data-order': '1',
            style: { backgroundImage: "url('/assets/images/quiropractica-1.png')" }
          }),
          h('div', { 
            className: 'quiro-img-frame', 
            'data-order': '2',
            style: { backgroundImage: "url('/assets/images/quiropractica-2.png')" }
          })
        )
      ),

      // Técnicas Específicas
      h('div', { className: 'quiro-technique' },
        h('h3', {}, i18n.t('quiro_dea_title')),
        h('p', {}, i18n.t('quiro_dea_desc')),
        h('p', {}, i18n.t('quiro_dea_extra')),
        h('a', { 
          href: 'https://www.deawakening.com/', 
          target: '_blank', 
          rel: 'noopener noreferrer',
          className: 'btn-external-link' 
        }, i18n.t('quiro_visit_dea'))
      ),

      h('div', { className: 'quiro-grid reverse' },
        h('div', { className: 'quiro-text-block' },
          h('h3', { style: { color: 'hsl(var(--color-primary))', marginBottom: 'var(--space-md)' } }, 'Resosense'),
          h('p', {}, i18n.t('quiro_resosense_desc')),
          h('p', {}, i18n.t('quiro_resosense_extra'))
        ),
        h('div', { className: 'quiro-text-block' },
          h('p', { style: { fontWeight: 'var(--font-medium)', borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-md)' } }, 
            i18n.t('quiro_eval_desc')
          )
        )
      ),

      // Call to Action
      h('div', { className: 'quiro-cta' },
        h('h3', {}, i18n.t('quiro_cta_title')),
        h('p', {}, i18n.t('quiro_cta_subtitle')),
        h('div', { 
          className: 'cta-phone phone-cta-link', 
          onclick: () => window.location.href = `tel:+34${(c.contacto_telefono || "601392161").replace(/\\s/g,'')}` 
        }, 
          h('span', { className: 'tty', style: { '--n': `'${c.contacto_telefono || "601 39 21 61"}'` } })
        )
      )
    )
  );
}
