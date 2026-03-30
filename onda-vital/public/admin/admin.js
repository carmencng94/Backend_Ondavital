function renderLogin(wrapper, errorMsg = '') {
  document.body.classList.add('admin-body');
  wrapper.className = 'admin-app-container';
  
  wrapper.innerHTML = `
    <div class="login-card">
      <img src="../assets/images/logo_onda_vital.png" alt="Onda Vital" style="width: 140px; margin-bottom: 20px;">
      <h1>Panel Administrador</h1>
      ${errorMsg ? `<div class="error-message">${errorMsg}</div>` : ''}
      <form id="login-form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input type="text" id="username" required autocomplete="username" placeholder="Tu usuario">
        </div>
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" required autocomplete="current-password" placeholder="••••••••">
        </div>
        <button type="submit" class="btn-primary-admin">Aceder al Sistema</button>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        renderDashboard(wrapper);
      } else {
        renderLogin(wrapper, data.message || 'Error de autenticación');
      }
    } catch (err) {
      console.error(err);
      renderLogin(wrapper, 'Error de conexión con el servidor');
    }
  });
}

function renderDashboard(wrapper) {
  document.body.classList.remove('admin-body');
  wrapper.className = '';
  
  wrapper.innerHTML = `
    <div class="dashboard-card">
      <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0;">Gestión de Contenidos</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 0.9rem;">Actualiza los textos e imágenes de tu web en tiempo real.</p>
        </div>
        <button id="btn-logout" class="btn-logout">Cerrar Sesión Segura</button>
      </div>
      
      <!-- NAVEGACIÓN POR SECCIONES -->
      <div id="tabs-container" style="display: flex; gap: 8px; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; overflow-x: auto; padding-bottom: 10px;">
        <!-- Inyectado por JS -->
      </div>

      <!-- EDITOR PRINCIPAL -->
      <div id="editor-container" class="editor-grid">
        <div style="text-align: center; padding: 60px; color: #94a3b8; grid-column: 1/-1;">
          Preparando el editor...
        </div>
      </div>

      <div style="margin: 60px 0 40px 0; padding-top: 40px; border-top: 1px dashed #e2e8f0;">
        <h3 style="color: hsl(158 25% 30%); margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
          <span style="background: hsl(158 25% 95%); padding: 8px; border-radius: 8px;">🖼️</span> 
          Multimedia y Galería
        </h3>
        <div style="background: #f8fafc; padding: 35px; border-radius: var(--radius-lg); border: 1px solid #e2e8f0;">
          <form id="upload-form" style="max-width: 500px;">
            <p style="font-size: 14px; margin-bottom: 25px; color: #64748b; line-height: 1.5;">
              Para cambiar una imagen, escribe su <strong>clave</strong> (ej: <code>home_hero_bg</code>) y selecciona el nuevo archivo. Se optimizará automáticamente.
            </p>
            <div class="input-group">
              <label for="image-key" style="color: #475569;">Clave de la imagen</label>
              <input type="text" id="image-key" required placeholder="Ej: home_hero_bg" style="background: white; border: 1px solid #cbd5e1; color: #333;">
            </div>
            <div class="input-group">
              <label for="image-file" style="color: #475569;">Nuevo archivo</label>
              <input type="file" id="image-file" accept="image/*" required style="background: white; border: 1px solid #cbd5e1; color: #333; padding: 10px;">
            </div>
            <button type="submit" class="btn-primary-admin" style="width: auto; padding: 12px 30px;">Optimizar y Guardar Imagen</button>
            <div id="upload-status" style="margin-top: 15px; font-weight: bold; font-size: 14px;"></div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/'; 
  });

  // Manejador de imágenes
  document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = document.getElementById('image-key').value;
    const fileInput = document.getElementById('image-file');
    const statusDiv = document.getElementById('upload-status');
    const token = localStorage.getItem('adminToken');

    if (!fileInput.files[0]) return;

    const formData = new FormData();
    formData.append('key', key);
    formData.append('image', fileInput.files[0]);

    statusDiv.style.color = '#333';
    statusDiv.textContent = 'Procesando...';

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      });
      const data = await resp.json();
      
      if (data.success) {
        statusDiv.style.color = 'green';
        statusDiv.textContent = '✅ Subida con éxito: ' + data.url;
        fileInput.value = ''; 
        setTimeout(loadContentEditor, 2500); 
      } else {
        statusDiv.style.color = 'red';
        statusDiv.textContent = data.message || 'Error al subir';
      }
    } catch (err) {
      statusDiv.style.color = 'red';
      statusDiv.textContent = 'Error de validación del servidor';
    }
  });

  loadContentEditor();
  // Listener para el cierre de sesión ya está arriba.
}

async function renderReservations(container) {
  container.innerHTML = '<div style="padding: 20px;">Cargando reservas...</div>';
  const token = localStorage.getItem('adminToken');
  
  try {
    const res = await fetch('/api/reservas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    
    if (!data.success) {
      container.innerHTML = `<div style="color:red; padding:20px;">Error: ${data.error}</div>`;
      return;
    }

    const { reservas } = data;
    
    if (reservas.length === 0) {
      container.innerHTML = '<div style="padding: 40px; text-align: center; color: #64748b;">No hay reservas registradas todavía.</div>';
      return;
    }

    const table = document.createElement('div');
    table.className = 'reservations-list';
    table.style.display = 'flex';
    table.style.flexDirection = 'column';
    table.style.gap = '15px';

    reservas.forEach(r => {
      const card = document.createElement('div');
      card.className = 'reserva-card-admin';
      card.style.background = 'white';
      card.style.border = '1px solid #e2e8f0';
      card.style.borderRadius = '12px';
      card.style.padding = '20px';
      card.style.display = 'grid';
      card.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
      card.style.gap = '20px';
      card.style.alignItems = 'center';

      const statusColors = {
        'pendiente': '#f59e0b',
        'confirmada': '#10b981',
        'rechazada': '#ef4444'
      };

      card.innerHTML = `
        <div class="res-info">
          <div style="font-weight: 700; font-size: 1.1rem; color: #1e293b; margin-bottom: 4px;">${r.nombre}</div>
          <div style="font-size: 0.85rem; color: #64748b;">${r.contacto || 'Sin contacto'}</div>
          <div style="margin-top: 8px; display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; background: ${statusColors[r.estado] || '#ccc'}1a; color: ${statusColors[r.estado] || '#666'};">
            ${r.estado.toUpperCase()}
          </div>
        </div>
        <div class="res-details">
          <div style="font-weight: 600; color: #334155;">${r.sala}</div>
          <div style="font-size: 0.9rem; color: #475569;">${r.fecha} | <span style="font-family: monospace;">${r.horario}h</span></div>
        </div>
        <div class="res-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
          ${r.estado === 'pendiente' ? `
            <button class="btn-approve" data-id="${r.id}" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Confirmar</button>
            <button class="btn-reject" data-id="${r.id}" style="background: white; color: #ef4444; border: 1px solid #ef4444; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Rechazar</button>
          ` : `
            <span style="color: #94a3b8; font-size: 0.85rem;">Procesada el ${new Date(r.createdAt).toLocaleDateString()}</span>
          `}
        </div>
      `;

      // Eventos para botones
      const approveBtn = card.querySelector('.btn-approve');
      const rejectBtn = card.querySelector('.btn-reject');

      if (approveBtn) {
        approveBtn.onclick = async () => {
          if (!confirm('¿Confirmar esta reserva? Se guardará en el Google Calendar oficial.')) return;
          try {
            const res = await fetch(`/api/reservas/${r.id}/confirmar`, {
              method: 'PATCH',
              headers: { 'Authorization': 'Bearer ' + token }
            });
            const d = await res.json();
            if (d.success) renderReservations(container);
            else alert('Error: ' + (d.error || 'No se pudo confirmar'));
          } catch(e) { console.error(e); }
        };
      }

      if (rejectBtn) {
        rejectBtn.onclick = async () => {
          if (!confirm('¿Rechazar esta reserva? No se mostrará en el calendario público.')) return;
          try {
            const res = await fetch(`/api/reservas/${r.id}/rechazar`, {
              method: 'PATCH',
              headers: { 'Authorization': 'Bearer ' + token }
            });
            const d = await res.json();
            if (d.success) renderReservations(container);
            else alert('Error');
          } catch(e) { console.error(e); }
        };
      }

      table.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(table);

  } catch(e) {
    container.innerHTML = `<div style="color:red; padding:20px;">Error al conectar: ${e.message}</div>`;
  }
}

async function loadContentEditor() {
  const container = document.getElementById('editor-container');
  const tabsContainer = document.getElementById('tabs-container');
  try {
    const res = await fetch('/api/content');
    const content = await res.json();
    
    // Agrupar campos
    const keys = Object.keys(content).sort();
    const groups = {};
    for (const key of keys) {
      const prefix = key.split('_')[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(key);
    }
    
    const categoryNames = {
      'home':     'Inicio',
      'contacto': 'Contacto',
      'quiro':    'Quiropractica',
      'reso':     'Resosense',
      'about':    'Sobre Nosotros',
      'services': 'Servicios',
      'salas':    'Salas (Config)',
      'sala':     'Salas (Contenido)',
      'footer':   'Footer'
    };

    tabsContainer.innerHTML = '';
    
    // --- Pestaña Principal de Reservas (HARDCODED) ---
    const resTab = document.createElement('button');
    resTab.textContent = '📅 Reservas y Calendario';
    resTab.className = 'tab-btn fixed-active';
    resTab.style.padding = '12px 24px';
    resTab.style.border = 'none';
    resTab.style.borderBottom = '3px solid hsl(158 25% 30%)';
    resTab.style.background = 'transparent';
    resTab.style.cursor = 'pointer';
    resTab.style.fontWeight = '700';
    resTab.style.color = 'hsl(158 25% 30%)';
    resTab.style.fontSize = '14px';
    resTab.style.borderRadius = '4px 4px 0 0';

    tabsContainer.appendChild(resTab);
    
    // Cargar Reservas inicialmente
    renderReservations(container);

    resTab.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.style.borderBottom = '3px solid transparent';
        b.style.fontWeight = 'normal';
        b.style.color = '#64748b';
      });
      resTab.style.borderBottom = '3px solid hsl(158 25% 30%)';
      resTab.style.fontWeight = 'bold';
      resTab.style.color = 'hsl(158 25% 30%)';
      renderReservations(container);
    };

    // --- Pestañas de Contenido (Dinámicas) ---
    const sortedPrefixes = Object.keys(groups).sort();
    
    sortedPrefixes.forEach((prefix) => {
      // 1. Crear Tab
      const tabBtn = document.createElement('button');
      tabBtn.textContent = categoryNames[prefix] || prefix.toUpperCase();
      tabBtn.className = 'tab-btn';
      tabBtn.style.padding = '12px 24px';
      tabBtn.style.border = 'none';
      tabBtn.style.borderBottom = '3px solid transparent';
      tabBtn.style.background = 'transparent';
      tabBtn.style.cursor = 'pointer';
      tabBtn.style.fontWeight = '500';
      tabBtn.style.color = '#94a3b8';
      tabBtn.style.fontSize = '14px';
      tabBtn.style.whiteSpace = 'nowrap';
      tabBtn.style.borderRadius = '4px 4px 0 0';
      
      // Configurar clic de pestaña
      tabBtn.onclick = () => {
        // Quitar activos
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.style.borderBottom = '3px solid transparent';
          b.style.fontWeight = 'normal';
          b.style.color = '#64748b';
        });
        
        // Poner activo
        tabBtn.style.borderBottom = '3px solid hsl(158 25% 30%)';
        tabBtn.style.fontWeight = 'bold';
        tabBtn.style.color = 'hsl(158 25% 30%)';
        
        // Rellenar Editor
        container.innerHTML = '';
        container.className = 'editor-grid';
        for (const key of groups[prefix]) {
          const isUrl = content[key] && (content[key].startsWith('/uploads/') || content[key].startsWith('http'));
          const itemDiv = doItemDiv(key, content[key], isUrl);
          container.appendChild(itemDiv);
        }
      };

      tabsContainer.appendChild(tabBtn);
    });

  } catch (error) {
    container.innerHTML = '<p style="color:red">Error al cargar los contenidos desde el API.</p>';
  }
}

// Función auxiliar para pintar un campo individual
function doItemDiv(key, val, isUrl) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item-editor-card';
  
  const label = document.createElement('label');
  label.textContent = key.replace(/_/g, ' ');
  label.style.display = 'block';
  label.style.fontWeight = '700';
  label.style.color = '#1e293b';
  label.style.marginBottom = '12px';
  label.style.fontSize = '11px';
  label.style.textTransform = 'uppercase';
  label.style.letterSpacing = '1px';
  itemDiv.appendChild(label);

  if (isUrl) {
    const imgPreview = document.createElement('img');
    imgPreview.src = val;
    imgPreview.style.maxWidth = '300px';
    imgPreview.style.maxHeight = '150px';
    imgPreview.style.objectFit = 'contain';
    imgPreview.style.display = 'block';
    imgPreview.style.marginBottom = '10px';
    imgPreview.style.borderRadius = '6px';
    imgPreview.style.border = '1px solid #eee';
    itemDiv.appendChild(imgPreview);
    
    const info = document.createElement('p');
    info.innerHTML = `Usa el formulario de abajo para reemplazar <strong>${key}</strong>`;
    info.style.fontSize = '12px';
    info.style.color = '#888';
    info.style.margin = '0';
    itemDiv.appendChild(info);
    
  } else {
    // Si el texto es cortito usar input, si es largo textarea
    const inputType = val.length > 60 || val.includes('\\n') ? 'textarea' : 'input';
    const field = document.createElement(inputType);
    if(inputType === 'textarea') {
       field.value = val;
       field.style.minHeight = '70px';
       field.style.resize = 'vertical';
    } else {
       field.type = 'text';
       field.value = val;
    }
    
    field.style.width = '100%';
    field.style.padding = '12px 14px';
    field.style.border = '1px solid #e2e8f0';
    field.style.borderRadius = '8px';
    field.style.fontFamily = 'inherit';
    field.style.fontSize = '14px';
    field.style.boxSizing = 'border-box';
    field.style.background = '#fcfdfe';
    field.style.color = '#334155';
    field.style.transition = 'all 0.2s ease';

    field.onfocus = () => {
      field.style.borderColor = 'hsl(158 25% 50%)';
      field.style.background = '#fff';
      field.style.boxShadow = '0 0 0 3px rgba(67, 160, 129, 0.1)';
    };
    field.onblur = () => {
      field.style.borderColor = '#e2e8f0';
      field.style.background = '#fcfdfe';
      field.style.boxShadow = 'none';
    };
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar Cambio';
    saveBtn.className = 'btn-primary-admin';
    saveBtn.style.width = 'auto';
    saveBtn.style.padding = '8px 20px';
    saveBtn.style.marginTop = '15px';
    saveBtn.style.fontSize = '12px';
    saveBtn.style.letterSpacing = '0.5px';
    
    const statusSpan = document.createElement('span');
    statusSpan.style.marginLeft = '12px';
    statusSpan.style.fontSize = '12px';
    statusSpan.style.fontWeight = '600';

    saveBtn.addEventListener('click', async () => {
      statusSpan.textContent = '...';
      statusSpan.style.color = '#666';
      const token = localStorage.getItem('adminToken');
      
      try {
        const resp = await fetch('/api/content/' + key, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ value: field.value })
        });
        const data = await resp.json();
        if (data.success) {
          statusSpan.textContent = '¡Guardado!';
          statusSpan.style.color = 'green';
          setTimeout(() => statusSpan.textContent = '', 2000);
        } else {
          statusSpan.textContent = data.message || 'Error';
          statusSpan.style.color = 'red';
        }
      } catch(err) {
        statusSpan.textContent = 'Error de red';
        statusSpan.style.color = 'red';
      }
    });

    itemDiv.appendChild(field);
    itemDiv.appendChild(saveBtn);
    itemDiv.appendChild(statusSpan);
  }
  return itemDiv;
}

function init() {
  // Añadimos una keyframe rápida para animar pestañas si no existe
  if(!document.getElementById('admin-styles-addons')){
     const st = document.createElement('style');
     st.id = 'admin-styles-addons';
     st.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`;
     document.head.appendChild(st);
  }

  const wrapper = document.getElementById('admin-app');
  const token = localStorage.getItem('adminToken');

  if (token) {
    renderDashboard(wrapper);
  } else {
    renderLogin(wrapper);
  }
}

init();
