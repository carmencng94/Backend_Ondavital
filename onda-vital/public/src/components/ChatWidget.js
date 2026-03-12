import { h } from '../utils.js';

export function ChatWidget() {
  let chatHistory = [];
  let pendingReserva = null;

  // --- Elementos persistentes ---
  const chatMessages = h('div', { id: 'chat-messages', className: 'chat-messages' });
  const typingIndicator = h('div', { className: 'typing-indicator hidden' }, h('span'), h('span'), h('span'));
  chatMessages.appendChild(typingIndicator);

  const chatInput = h('input', { 
    type: 'text', 
    className: 'chat-input', 
    placeholder: 'Pregunta disponibilidad...',
    autocomplete: 'off'
  });

  const modalOverlay = h('div', { className: 'modal-overlay hidden' });

  // --- Lógica ---
  const toggleChat = () => {
    const win = document.getElementById('chat-window');
    win.classList.toggle('hidden');
    if (!win.classList.contains('hidden') && chatHistory.length === 0) {
      saludar();
    }
  };

  const saludar = () => {
    const msg = "¡Hola! Bienvenido a Onda Vital Holistic. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?";
    chatHistory.push({ role: 'assistant', content: msg });
    appendBubble('bot', msg);
  };

  const appendBubble = (role, text) => {
    const bubble = h('div', { className: role === 'user' ? 'bubble-user' : 'bubble-bot' }, text);
    chatMessages.insertBefore(bubble, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const enviarMensaje = async (textoManual) => {
    const text = textoManual || chatInput.value.trim();
    if (!text) return;

    appendBubble('user', text);
    if (!textoManual) chatInput.value = '';
    
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: text, historial: chatHistory })
      });
      const data = await res.json();
      typingIndicator.classList.add('hidden');

      if (data.success) {
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'assistant', content: data.respuesta });
        appendBubble('bot', data.respuesta);
        if (data.reservaDetectada) mostrarModal(data.reservaDetectada);
      }
    } catch (e) {
      typingIndicator.classList.add('hidden');
      appendBubble('bot', 'Lo siento, hubo un error de conexión.');
    }
  };

  const mostrarModal = (reserva) => {
    pendingReserva = reserva;
    renderModalContent(reserva);
    modalOverlay.classList.remove('hidden');
  };

  const renderModalContent = (res) => {
    modalOverlay.innerHTML = '';
    modalOverlay.appendChild(
      h('div', { className: 'modal' },
        h('h2', {}, '¡Tu sala está lista para confirmar!'),
        h('p', {}, 'David cerrará tu reserva por WhatsApp.'),
        h('div', { className: 'reserva-details' },
          h('div', {}, h('strong', {}, 'Sala: '), res.sala),
          h('div', {}, h('strong', {}, 'Fecha: '), res.fecha),
          h('div', {}, h('strong', {}, 'Horario: '), res.horario)
        ),
        h('button', { 
          className: 'btn-primary', 
          onclick: () => {
            const texto = `Hola David, quiero confirmar mi reserva de la ${res.sala} para el ${res.fecha} a las ${res.horario}.`;
            window.open(`https://wa.me/34601392161?text=${encodeURIComponent(texto)}`, '_blank');
            modalOverlay.classList.add('hidden');
          }
        }, 'Confirmar en WhatsApp'),
        h('button', { className: 'btn-secondary', onclick: () => modalOverlay.classList.add('hidden') }, 'Editar')
      )
    );
  };

  // Event Listeners Globales
  document.addEventListener('consultar-sala', (e) => {
    const win = document.getElementById('chat-window');
    if (win.classList.contains('hidden')) toggleChat();
    enviarMensaje(`Quiero consultar disponibilidad para la ${e.detail}`);
  });

  return h('div', { id: 'chat-root' },
    h('button', { className: 'chat-widget-btn', onclick: toggleChat },
      h('svg', { width: '28', height: '28', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
        h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
      )
    ),
    h('div', { id: 'chat-window', className: 'chat-window hidden' },
      h('div', { className: 'chat-header' },
        h('div', { className: 'chat-header-title' }, 'Asistente de Reservas'),
        h('button', { className: 'chat-close-btn', onclick: toggleChat }, '✕')
      ),
      chatMessages,
      h('div', { className: 'chat-input-area' },
        chatInput,
        h('button', { className: 'chat-send-btn', onclick: () => enviarMensaje() }, '➤')
      )
    ),
    modalOverlay
  );
}
