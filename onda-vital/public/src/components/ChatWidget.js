import { h, injectStyles } from '../utils.js';
import { i18n } from '../i18n.js';

const chatStyles = `
/* Floating Botón */
.chat-widget-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 65px;
  height: 65px;
  border-radius: var(--radius-full);
  background: white;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  border: 1px solid hsl(var(--color-border));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  z-index: 10000;
  overflow: hidden;
  padding: 0;
}

.chat-avatar-btn {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.chat-widget-btn:hover {
  transform: scale(1.1) rotate(5deg);
}

.chat-widget-btn:hover .chat-avatar-btn {
  transform: scale(1.1);
}

.chat-help-bubble {
  position: fixed;
  bottom: 6.5rem;
  right: 2rem;
  background: white;
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  z-index: 9999;
  border: 1px solid hsl(var(--color-border));
  animation: slideUp 0.5s ease-out;
  cursor: pointer;
}

.chat-help-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 20px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.bubble-close-x {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: hsl(var(--color-text));
  color: white;
  border-radius: 50%;
  border: none;
  font-size: 10px;
  cursor: pointer;
}

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 5.5rem;
  right: 2rem;
  width: 380px;
  height: 580px;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-premium);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10001;
  transform-origin: bottom right;
  animation: chatOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-window.hidden { display: none; }

@keyframes chatOpen {
  from { transform: scale(0.85) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.chat-header {
  background: hsl(var(--color-primary));
  color: white;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-user {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.chat-header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
}

.chat-header-title {
  font-weight: 600;
  font-size: var(--text-md);
}

.chat-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
}

.chat-messages {
  flex: 1;
  padding: var(--space-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: #fdfdfd;
}

.bubble-bot {
  align-self: flex-start;
  background: #eee;
  color: #333;
  padding: 10px 16px;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
  font-size: var(--text-sm);
  line-height: 1.5;
  box-shadow: var(--shadow-sm);
}

.bubble-user {
  align-self: flex-end;
  background: hsl(var(--color-primary));
  color: white;
  padding: 10px 16px;
  border-radius: 18px 18px 4px 18px;
  max-width: 85%;
  font-size: var(--text-sm);
  line-height: 1.5;
  box-shadow: var(--shadow-sm);
}

.chat-input-area {
  padding: var(--space-md);
  display: flex;
  gap: var(--space-sm);
  background: white;
  border-top: 1px solid #eee;
}

.chat-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-family: inherit;
  outline: none;
}

.chat-send-btn {
  background: hsl(var(--color-primary));
  color: white;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal dentro del chat */
.reserva-details {
  background: #f8f9fa;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin: var(--space-md) 0;
  text-align: left;
}

.modal {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  max-width: 340px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

/* Responsividad Chat */
@media (max-width: 500px) {
  .chat-window {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
  .chat-widget-btn {
    bottom: 1rem;
    right: 1rem;
  }
  .chat-help-bubble {
    display: none;
  }
}
`;

export function ChatWidget() {
  injectStyles('chat-widget-styles', chatStyles);
  let chatHistory = [];
  let pendingReserva = null;

  // --- Elementos persistentes ---
  const chatMessages = h('div', { id: 'chat-messages', className: 'chat-messages' });
  const typingIndicator = h('div', { className: 'typing-indicator hidden' }, h('span'), h('span'), h('span'));
  chatMessages.appendChild(typingIndicator);

  const chatInput = h('input', { 
    type: 'text', 
    className: 'chat-input', 
    placeholder: i18n.t('chat_input_placeholder'),
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
    const greetings = {
      es: "¡Hola! Bienvenido a Onda Vital Holistic. Soy Asistente Vitalis. ¿En qué puedo ayudarte hoy?",
      en: "Hello! Welcome to Onda Vital Holistic. I am Vitalis Assistant. How can I help you today?",
      de: "Hallo! Willkommen bei Onda Vital Holistic. Ich bin Vitalis Assistent. Wie kann ich Ihnen heute helfen?",
      ca: "Hola! Benvingut a Onda Vital Holistic. Sóc l'Assistent Vitalis. En què et puc ajudar avui?"
    };
    const msg = greetings[i18n.currentLanguage] || greetings.es;
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
        body: JSON.stringify({ mensaje: text, historial: chatHistory, idioma: i18n.currentLanguage })
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
            let texto = i18n.t('wa_message')
              .replace('{nombre}', res.nombre)
              .replace('{sala}', res.sala)
              .replace('{fecha}', res.fecha)
              .replace('{horario}', res.horario)
              .replace('{contacto}', res.contacto);
            
            if (res.id) {
              texto += ` (Ref: ${res.id})`;
            }

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
          h('div', { className: 'chat-header-title' }, i18n.t('chat_header'))
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
