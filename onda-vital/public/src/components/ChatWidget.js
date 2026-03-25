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
    autocomplete: 'off',
    onkeydown: (e) => {
      if (e.key === 'Enter') {
        enviarMensaje();
      }
    }
  });

  const modalOverlay = h('div', { className: 'modal-overlay hidden' });

  // --- Lógica ---
  const toggleChat = () => {
    const win = document.getElementById('chat-window');
    const helpBubble = document.getElementById('chat-help-bubble');
    win.classList.toggle('hidden');
    if (helpBubble) helpBubble.classList.add('hidden'); // Hide the help bubble when opened
    
    if (!win.classList.contains('hidden') && chatHistory.length === 0) {
      saludar();
    }
  };

  const saludar = () => {
    const msg = "¡Hola! Bienvenido a Onda Vital Holistic. Soy Asistente Vitalis. ¿En qué puedo ayudarte hoy?";
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
          h('div', {}, h('strong', {}, 'Nombre: '), res.nombre),
          h('div', {}, h('strong', {}, 'Contacto: '), res.contacto),
          h('div', {}, h('strong', {}, 'Sala/Servicio: '), res.sala),
          h('div', {}, h('strong', {}, 'Fecha: '), res.fecha),
          h('div', {}, h('strong', {}, 'Horario: '), res.horario)
        ),
        h('button', { 
          className: 'btn-primary', 
          onclick: () => {
            const texto = `Hola David, soy ${res.nombre}. Quiero confirmar mi reserva de ${res.sala} para el ${res.fecha} a las ${res.horario}. Mi contacto es ${res.contacto}.`;
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
    if (win && win.classList.contains('hidden')) toggleChat();
    enviarMensaje(`Quiero consultar disponibilidad para la ${e.detail}`);
  });

  document.addEventListener('abrir-chat-asistente', (e) => {
    const win = document.getElementById('chat-window');
    const bubble = document.getElementById('chat-help-bubble');
    if (win && win.classList.contains('hidden')) {
      toggleChat();
    }
    if (e.detail && typeof e.detail === 'string') {
      enviarMensaje(e.detail);
    }
  });

  return h('div', { id: 'chat-root' },
    h('div', { id: 'chat-help-bubble', className: 'chat-help-bubble', onclick: toggleChat },
      h('button', { 
        className: 'bubble-close-x', 
        onclick: (e) => {
          e.stopPropagation();
          document.getElementById('chat-help-bubble').style.display = 'none';
        }
      }, '✕'),
      '¿Necesitas ayuda?', h('br'), 'Estoy aquí para ti.'
    ),
    h('button', { className: 'chat-widget-btn', onclick: toggleChat },
      h('img', { 
        src: 'assets/images/ai_avatar.png', 
        alt: 'Asistente Vitalis',
        className: 'chat-avatar-btn'
      })
    ),
    h('div', { id: 'chat-window', className: 'chat-window hidden' },
      h('div', { className: 'chat-header' },
        h('div', { className: 'chat-header-user' },
          h('img', { src: 'assets/images/ai_avatar.png', className: 'chat-header-avatar' }),
          h('div', { className: 'chat-header-title' }, 'Asistente Vitalis')
        ),
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
