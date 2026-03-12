import { h } from '../utils.js';

export function QuiropracticaSection() {
  return h('section', { id: 'quiropractica', className: 'tab-section' },
    h('div', { className: 'container', style: { maxWidth: '800px' } },
      h('h2', { style: { textAlign: 'center', marginBottom: 'var(--space-xl)' } }, 'Quiropráctica Integral con N.S.A.'),
      h('div', { className: 'content-block' },
        h('p', {}, 'El Network Spinal Analysis (NSA) es una técnica de quiropráctica suave que ayuda a tu sistema nervioso a reorganizarse y liberar tensiones acumuladas.'),
        h('p', {}, 'En lugar de ajustes bruscos, utilizamos toques precisos en la columna para que tu cerebro aprenda a sanarse y adaptarse mejor al estrés.')
      )
    )
  );
}
