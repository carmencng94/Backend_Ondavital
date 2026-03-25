import { h, render } from './utils.js';
import { Header } from './components/Header.js';
import { HomeSection } from './components/HomeSection.js';
import { QuiropracticaSection } from './components/QuiropracticaSection.js';
import { ResosenseSection } from './components/ResosenseSection.js';
import { SalasSection } from './components/SalasSection.js';
import { ContactoSection } from './components/ContactoSection.js';
import { ChatWidget } from './components/ChatWidget.js';
import { Footer } from './components/Footer.js';
import { siteConfig } from './config.js';

function App() {
  // Manejador de navegación global para toda la app
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

  const sections = [
    Header(),
    siteConfig.features.showHome ? HomeSection() : null,
    siteConfig.features.showSalas ? SalasSection() : null,
    siteConfig.features.showQuiropractica ? QuiropracticaSection() : null,
    // Resosense ya no se renderiza como sección interna, será un link externo en el Header
    siteConfig.features.showContacto ? ContactoSection() : null,
    Footer(),
    ChatWidget()
  ].filter(section => section !== null);

  return h('div', { id: 'wrapper' }, ...sections);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/content');
    if (response.ok) {
      window.siteContent = await response.json();
    } else {
      window.siteContent = {};
    }
  } catch (err) {
    console.error('Error al obtener el contenido de la web:', err);
    window.siteContent = {};
  }
  
  render(App(), document.getElementById('app'));
});

