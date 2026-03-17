/**
 * Crea un elemento DOM con atributos y contenido opcional.
 */
export function h(tag, props = {}, ...children) {
  const isSvg = ['svg', 'path', 'circle', 'line', 'polyline', 'polygon', 'rect', 'ellipse', 'g', 'defs', 'symbol', 'use'].includes(tag);
  const el = isSvg 
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);
  
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.toLowerCase().substring(2);
      el.addEventListener(eventName, value);
    } else if (key === 'className' || key === 'class') {
      if (isSvg) el.setAttribute('class', value);
      else el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      if (isSvg) {
        const styleStr = Object.entries(value).map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}:${v}`).join(';');
        el.setAttribute('style', styleStr);
      } else {
        for (const [sKey, sValue] of Object.entries(value)) {
          if (sKey.startsWith('--')) {
            el.style.setProperty(sKey, sValue);
          } else {
            el.style[sKey] = sValue;
          }
        }
      }
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else {
      // Atributos como stroke-width o viewbox
      const attrName = key.toLowerCase() === 'viewbox' ? 'viewBox' : key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      el.setAttribute(attrName, value);
    }
  }

  children.flat(2).forEach(child => {
    if (child === null || child === undefined || child === false) return;
    if (child instanceof Node) {
      el.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    }
  });

  return el;
}

/**
 * Renderiza un componente en un contenedor.
 */
export function render(component, container) {
  container.innerHTML = '';
  container.appendChild(component);
}
