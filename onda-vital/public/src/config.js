/**
 * Configuración global del sitio Onda Vital
 * Permite activar/desactivar servicios y configurar enlaces externos
 */
export const siteConfig = {
  urls: {
    // Cambiar por la URL real cuando esté disponible
    deawakening: 'https://deawakening.site', 
  },
  features: {
    showHome: true,
    showSalas: true,
    showQuiropractica: true, // Cambiar a false cuando el cliente se jubile
    showResosenseRedirect: true, // Si es true, Resosense va a una URL externa
    showContacto: true
  },
  assistant: {
    name: 'Vitalis',
    bookingPrompt: '¿Buscas reservar una sala? Indica el nombre de la sala, fecha y horario y yo te ayudo.'
  }
};
