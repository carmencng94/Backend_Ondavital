/**
 * Crea un elemento DOM con atributos y contenido opcional.
 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.toLowerCase().substring(2);
      el.addEventListener(eventName, value);
    } else if (key === 'className' || key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else {
      el.setAttribute(key, value);
    }
  }

  children.forEach(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => el.appendChild(c instanceof HTMLElement ? c : document.createTextNode(c)));
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
