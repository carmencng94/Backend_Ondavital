// Lógica del Frontend (Vanilla JS)
// Ejecutado en el navegador

const CHAT_ENDPOINT = '/api/chat';
const SALAS_ENDPOINT = '/api/salas';

// --- ELEMENTOS DEL DOM ---
const salasGrid = document.getElementById('salas-grid');
const chatWidgetBtn = document.getElementById('chat-widget-btn');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

// Estado interno del historial del chat
let chatHistory = [];
// Estado de la reserva en curso
let pendingReserva = null;

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const btnConfirmReserva = document.getElementById('btn-confirm-reserva');
const btnEditReserva = document.getElementById('btn-edit-reserva');
const revNombre = document.getElementById('rev-nombre');
const revSala = document.getElementById('rev-sala');
const revFecha = document.getElementById('rev-fecha');
const revHorario = document.getElementById('rev-horario');

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  cargarSalas();
  initTabs();
  
  // Event Listeners Chat
  chatWidgetBtn.addEventListener('click', toggleChat);
  closeChatBtn.addEventListener('click', toggleChat);
  
  chatSendBtn.addEventListener('click', enviarMensaje);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensaje();
  });

  // Event Listeners Modal
  btnConfirmReserva.addEventListener('click', confirmarYContactar);
  btnEditReserva.addEventListener('click', cerrarModal);
});

// --- NAVEGACIÓN POR PESTAÑAS ---
function initTabs() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.tab-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');

      // Update active link
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show targeted section
      sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === tabId) sec.classList.add('active');
      });

      // Scroll to top if changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// --- RENDERIZADO DE SALAS (GRID) ---
async function cargarSalas() {
  try {
    const response = await fetch(SALAS_ENDPOINT);
    const data = await response.json();
    
    if (data.success && data.salas) {
      renderizarSalas(data.salas);
    } else {
      mostrarErrorSalas();
    }
  } catch (error) {
    console.error("Error al cargar salas:", error);
    mostrarErrorSalas();
  }
}

function renderizarSalas(salas) {
  salasGrid.innerHTML = '';
  salas.forEach(sala => {
    const card = document.createElement('div');
    card.className = 'sala-card';
    
    card.innerHTML = `
      <div class="sala-img" style="background-image: url('https://images.unsplash.com/photo-1545208393-596371/photo?w=800')"></div>
      <div class="sala-info">
        <h3>${sala.nombre}</h3>
        <p class="sala-capacity">${sala.capacidad} | ${sala.dimensiones}</p>
        <button class="btn-check-availability" onclick="consultarSala('${sala.nombre}')">
          Consultar Disponibilidad
        </button>
      </div>
    `;
    salasGrid.appendChild(card);
  });
}

function consultarSala(nombreSala) {
  if (chatWindow.classList.contains('hidden')) toggleChat();
  chatInput.value = `Quiero consultar la disponibilidad de la ${nombreSala}`;
  enviarMensaje();
}

function mostrarErrorSalas() {
  salasGrid.innerHTML = '<p class="salas-error">No se pudieron cargar las salas de momento. Por favor, intenta de nuevo más tarde o pregúntale al Asistente.</p>';
}

// --- LÓGICA DEL CHAT ---
function toggleChat() {
  const isHidden = chatWindow.classList.contains('hidden');
  if (isHidden) {
    chatWindow.classList.remove('hidden');
    // Si no hay mensajes, el bot saluda primero
    if (chatHistory.length === 0) {
      mostrarMensajeBot("¡Hola! Bienvenido a Onda Vital. Soy tu asistente virtual. Puedo ayudarte a conocer nuestras instalaciones, responder dudas o reservar una sala. ¿En qué te ayudo hoy?");
    }
    setTimeout(() => chatInput.focus(), 300); // Pequeño delay para la animación
  } else {
    chatWindow.classList.add('hidden');
  }
}

async function enviarMensaje() {
  const mensaje = chatInput.value.trim();
  if (!mensaje) return;

  // 1. Mostrar burbuja del usuario
  mostrarBurbuja('user', mensaje);
  chatInput.value = '';
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  // 2. Mostrar indicador "typing..."
  typingIndicator.classList.remove('hidden');
  scrollChatBottom();

  const payload = {
    mensaje,
    historial: chatHistory
  };

  try {
    // 3. Petición POST al backend
    const res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    // Ocultar typing siempre
    typingIndicator.classList.add('hidden');

    if (data.success) {
      // Registrar en el historial de la sesión el envío del usuario
      chatHistory.push({ role: 'user', content: mensaje });
      // Registrar la respuesta del asistente en memoria local
      chatHistory.push({ role: 'assistant', content: data.respuesta });

      // 4. Mostrar burbuja del bot
      mostrarBurbuja('bot', data.respuesta);

      // 5. ¿Detectó reserva el backend en la respuesta del bot?
      if (data.reservaDetectada) {
        mostrarModal(data.reservaDetectada);
      }
    } else {
      mostrarBurbuja('bot', 'Hubo un error al procesar tu mensaje. ¿Puedes intentarlo de nuevo?');
    }
  } catch (err) {
    console.error(err);
    typingIndicator.classList.add('hidden');
    mostrarBurbuja('bot', 'Error de conexión. Vuelve a intentarlo.');
  } finally {
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
    scrollChatBottom();
  }
}

function mostrarMensajeBot(texto) {
  chatHistory.push({ role: 'assistant', content: texto });
  mostrarBurbuja('bot', texto);
}

function mostrarBurbuja(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = sender === 'user' ? 'bubble-user' : 'bubble-bot';
  bubble.textContent = text;
  
  // Insertar la burbuja antes del typing indicator
  chatMessages.insertBefore(bubble, typingIndicator);
  scrollChatBottom();
}

function scrollChatBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- LÓGICA DEL MODAL DE CONFIRMACIÓN ---
function mostrarModal(reservaData) {
  pendingReserva = reservaData;
  revNombre.textContent = reservaData.nombre;
  revSala.textContent = reservaData.sala;
  revFecha.textContent = reservaData.fecha;
  revHorario.textContent = reservaData.horario;
  
  modalOverlay.classList.remove('hidden');
}

function cerrarModal() {
  modalOverlay.classList.add('hidden');
}

function confirmarYContactar() {
  if (!pendingReserva) return;

  // Opcional: El backend model ya guardó la reserva durante la llamada a Anthropic si se detectó. 
  // Podríamos hacer un POST /api/reservas explícito aquí si no se guardase auto en el server,
  // pero según la arquitectura solicitada en ChatController ya hace ReservaModel.guardar()
  
  // Crea el mensaje pre-rellenado para WhatsApp
  const { nombre, sala, fecha, horario } = pendingReserva;
  const tlfDavid = "34601392161";
  const texto = `¡Hola David! Soy ${nombre}. He hablado con tu asistente virtual y me gustaría confirmar mi pre-reserva de la *${sala}* para el día *${fecha}* en horario *${horario}*. ¡Gracias!`;
  
  const wpUrl = `https://wa.me/${tlfDavid}?text=${encodeURIComponent(texto)}`;
  window.open(wpUrl, '_blank');
  
  cerrarModal();
}
