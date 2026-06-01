import { h, render } from './utils.js';
import { Header } from './components/Header.js';
import { HomeSection } from './components/HomeSection.js';
import { QuiropracticaSection } from './components/QuiropracticaSection.js';
import { AboutSection } from './components/AboutSection.js';
import { ResosenseSection } from './components/ResosenseSection.js';
import { SalasSection } from './components/SalasSection.js';
import { ContactoSection } from './components/ContactoSection.js';
import { ChatWidget } from './components/ChatWidget.js';
import { Footer } from './components/Footer.js';
import { siteConfig } from './config.js';
import { i18n } from './i18n.js';

function App() {
  // Manejador de navegación global para toda la app, registrado solo una vez para evitar duplicación
  if (!window.tabChangeListenerRegistered) {
    document.addEventListener('tab-change', (e) => {
      const tabId = e.detail;
      
      // Cambiar visibilidad de secciones
      document.querySelectorAll('.tab-section').forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === tabId) sec.classList.add('active');
      });

      // Cambiar estado activo en nav
      document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.dataset.tab === tabId) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.tabChangeListenerRegistered = true;
  }

  const sections = [
    Header(),
    siteConfig.features.showHome ? HomeSection() : null,
    siteConfig.features.showSalas ? SalasSection() : null,
    siteConfig.features.showQuiropractica ? QuiropracticaSection() : null,
    // Resosense ya no se renderiza como sección interna, será un link externo en el Header
    AboutSection(),
    siteConfig.features.showContacto ? ContactoSection() : null,
    Footer(),
    ChatWidget()
  ].filter(section => section !== null);

  return h('div', { id: 'wrapper' }, ...sections);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/content?format=all');
    if (response.ok) {
      const content = await response.json();
      i18n.setSiteContent(content);
    } else {
      i18n.setSiteContent({});
    }
  } catch (err) {
    console.error('Error al obtener el contenido de la web:', err);
    i18n.setSiteContent({});
  }
  
  const pageTitles = {
    es: 'Onda Vital Holistic | Bienestar y Terapias',
    en: 'Onda Vital Holistic | Wellness & Therapies',
    de: 'Onda Vital Holistic | Wohlbefinden & Therapien',
    ca: 'Onda Vital Holistic | Benestar i Teràpies'
  };
  document.title = pageTitles[i18n.currentLanguage] || pageTitles.es;
  
  render(App(), document.getElementById('app'));
  initInlineEditor();
});

// Estilo CSS para el resaltado animado del elemento editado (Forest Green & Gold premium cycle)
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
  @keyframes customizerHighlightPulse {
    0% { outline: 3px solid hsl(158, 25%, 30%); box-shadow: 0 0 12px rgba(26, 77, 59, 0.6); }
    50% { outline: 3px solid #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.8); }
    100% { outline: 3px solid hsl(158, 25%, 30%); box-shadow: 0 0 12px rgba(26, 77, 59, 0.6); }
  }
  .customizer-highlighted {
    animation: customizerHighlightPulse 1.5s infinite ease-in-out !important;
    outline-offset: 4px !important;
    position: relative !important;
    z-index: 99999 !important;
    border-radius: 4px !important;
    transition: outline-color 0.2s, box-shadow 0.2s !important;
  }
`;
document.head.appendChild(highlightStyle);

window.activeHighlightKey = null;

// Algoritmo inteligente de búsqueda de elementos por clave de traducción e imagen
function findElementByKey(key) {
  const value = i18n.t(key);
  if (!value) return null;
  
  const valStr = String(value).trim();
  if (!valStr) return null;

  // 1. Si es una imagen (logo, hero img, etc)
  if (key.includes('img') || key.includes('logo') || key.includes('avatar') || valStr.startsWith('assets/') || valStr.includes('.png') || valStr.includes('.jpg') || valStr.includes('.jpeg')) {
    const imgs = document.querySelectorAll('img');
    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (src && (src === valStr || valStr.endsWith(src) || src.endsWith(valStr))) {
        return img;
      }
    }
  }

  // 2. Si es un texto, buscar el nodo hoja más específico que lo contenga
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button', 'div', 'label'];
  let candidates = [];
  for (const tag of tags) {
    const els = document.querySelectorAll(tag);
    for (const el of els) {
      if (el.children.length > 0 && tag === 'div') continue; // Evitar div contenedores grandes
      const text = el.textContent ? el.textContent.trim() : '';
      if (text === valStr || (valStr.length > 8 && text.includes(valStr))) {
        candidates.push(el);
      }
    }
  }

  if (candidates.length > 0) {
    // Escoger el que tenga la menor longitud total de texto (el más específico)
    candidates.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length);
    return candidates[0];
  }
  return null;
}

// Re-aplica el resaltado tras una actualización del DOM reactivo
function reapplyHighlight() {
  if (!window.activeHighlightKey) return;
  document.querySelectorAll('.customizer-highlighted').forEach(el => el.classList.remove('customizer-highlighted'));
  const el = findElementByKey(window.activeHighlightKey);
  if (el) {
    el.classList.add('customizer-highlighted');
  }
}

// Oyente de mensajes para el WordPress-Style Live Visual Customizer
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'content-update') {
    const { key, value, lang } = event.data;
    const targetLang = lang || 'es';
    
    if (!i18n.siteContent[targetLang]) {
      i18n.siteContent[targetLang] = {};
    }
    
    // Actualizar el valor localmente
    i18n.siteContent[targetLang][key] = value;
    
    // Actualizar el objeto global por retrocompatibilidad
    if (targetLang === i18n.currentLanguage) {
      window.siteContent = i18n.siteContent[targetLang];
    }
    
    // Re-render reactivo e instantáneo
    const appContainer = document.getElementById('app');
    if (appContainer) {
      render(App(), appContainer);
      reapplyHighlight();
    }
  } else if (event.data && event.data.type === 'tab-change') {
    const { tabId } = event.data;
    document.dispatchEvent(new CustomEvent('tab-change', { detail: tabId }));
  } else if (event.data && event.data.type === 'highlight-element') {
    const { key } = event.data;
    window.activeHighlightKey = key;
    
    // Limpiar cualquier resaltado previo
    document.querySelectorAll('.customizer-highlighted').forEach(el => el.classList.remove('customizer-highlighted'));
    
    const el = findElementByKey(key);
    if (el) {
      el.classList.add('customizer-highlighted');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else if (event.data && event.data.type === 'clear-highlight') {
    window.activeHighlightKey = null;
    document.querySelectorAll('.customizer-highlighted').forEach(el => el.classList.remove('customizer-highlighted'));
  }
});

function initInlineEditor() {
  const hasAdminToken = document.cookie.split(';').some(item => item.trim().startsWith('adminToken='));
  if (!hasAdminToken) return;

  document.body.classList.add('editor-mode-active');

  // Inyectar estilos para el Modo Editor Inline
  const editorModeStyle = document.createElement('style');
  editorModeStyle.textContent = `
    body.editor-mode-active [data-i18n-key] {
      position: relative !important;
      cursor: text !important;
    }
    body.editor-mode-active [data-i18n-key]:hover {
      outline: 2px dashed #f59e0b !important;
      outline-offset: 2px !important;
      background-color: rgba(245, 158, 11, 0.08) !important;
    }
  `;
  document.head.appendChild(editorModeStyle);

  document.addEventListener('click', (e) => {
    // Si ya estamos editando o si el click fue dentro de un input/textarea activo de edición, ignorar
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.classList.contains('inline-editor-active')) {
      return;
    }

    const editableEl = e.target.closest('[data-i18n-key]');
    if (!editableEl) return;

    // Evitar que el clic active enlaces u otros comportamientos
    e.preventDefault();
    e.stopPropagation();

    const key = editableEl.getAttribute('data-i18n-key');
    const originalText = editableEl.textContent || '';

    // Decidir si usamos input o textarea basado en el tamaño del texto o si tiene saltos de línea
    const isLongText = originalText.length > 60 || originalText.includes('\n');
    const editor = document.createElement(isLongText ? 'textarea' : 'input');

    editor.value = originalText.trim();
    editor.classList.add('inline-editor-active');

    // Copiar estilos tipográficos del elemento original
    const computed = window.getComputedStyle(editableEl);
    editor.style.font = computed.font;
    editor.style.fontSize = computed.fontSize;
    editor.style.fontWeight = computed.fontWeight;
    editor.style.lineHeight = computed.lineHeight;
    editor.style.color = computed.color || '#333';
    editor.style.textAlign = computed.textAlign;
    editor.style.width = '100%';
    editor.style.border = '2px solid #f59e0b';
    editor.style.borderRadius = '4px';
    editor.style.padding = '4px 8px';
    editor.style.background = 'white';
    editor.style.boxSizing = 'border-box';

    if (isLongText) {
      editor.style.minHeight = '100px';
      editor.style.resize = 'vertical';
    }

    const parent = editableEl.parentNode;
    parent.replaceChild(editor, editableEl);
    editor.focus();

    let saved = false;

    const saveChanges = async () => {
      if (saved) return;
      saved = true;

      const newValue = editor.value.trim();

      // Si el valor no cambió, re-renderizar para restaurar el estado original
      if (newValue === originalText.trim()) {
        render(App(), document.getElementById('app'));
        return;
      }

      try {
        const response = await fetch('/api/content/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            key,
            value: newValue,
            lang: i18n.currentLanguage
          })
        });

        if (response.ok) {
          const lang = i18n.currentLanguage;
          if (!i18n.siteContent[lang]) i18n.siteContent[lang] = {};
          i18n.siteContent[lang][key] = newValue;
          if (lang === i18n.currentLanguage) {
            window.siteContent = i18n.siteContent[lang];
          }

          // Re-render reactivo instantáneo
          render(App(), document.getElementById('app'));

          // Notificar al iframe padre (Customizer) si existe
          window.parent.postMessage({
            type: 'content-update',
            key,
            value: newValue,
            lang
          }, '*');
        } else {
          alert('Error al guardar el texto. Asegúrate de tener una sesión activa.');
          render(App(), document.getElementById('app'));
        }
      } catch (err) {
        console.error('Error al guardar cambios inline:', err);
        alert('Error de conexión al guardar los cambios.');
        render(App(), document.getElementById('app'));
      }
    };

    editor.addEventListener('blur', saveChanges);

    editor.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' && (!isLongText || !evt.shiftKey)) {
        evt.preventDefault();
        editor.blur();
      }
      if (evt.key === 'Escape') {
        saved = true;
        render(App(), document.getElementById('app'));
      }
    });
  });
}

