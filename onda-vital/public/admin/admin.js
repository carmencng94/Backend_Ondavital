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
    container.innerHTML = '';

    // Construir pestañas y contenedores ocultos
    const sortedPrefixes = Object.keys(groups).sort();
    
    sortedPrefixes.forEach((prefix, index) => {
      const isFirst = index === 0;
      
      // 1. Crear Tab
      const tabBtn = document.createElement('button');
      tabBtn.textContent = categoryNames[prefix] || prefix.toUpperCase();
      tabBtn.className = 'tab-btn';
      tabBtn.style.padding = '12px 24px';
      tabBtn.style.border = 'none';
      tabBtn.style.borderBottom = isFirst ? '3px solid hsl(158 25% 30%)' : '3px solid transparent';
      tabBtn.style.background = 'transparent';
      tabBtn.style.cursor = 'pointer';
      tabBtn.style.fontWeight = isFirst ? '700' : '500';
      tabBtn.style.color = isFirst ? 'hsl(158 25% 30%)' : '#94a3b8';
      tabBtn.style.fontSize = '14px';
      tabBtn.style.whiteSpace = 'nowrap';
      tabBtn.style.borderRadius = '4px 4px 0 0';
      
      // 2. Crear Grupo Contenedor
      const groupDiv = document.createElement('div');
      groupDiv.id = 'group-' + prefix;
      groupDiv.className = 'group-content editor-grid';
      groupDiv.style.display = isFirst ? 'grid' : 'none';
      groupDiv.style.animation = 'fadeIn 0.5s ease';
      groupDiv.style.gridColumn = '1 / -1';

      // 3. Rellenar Grupo
      for (const key of groups[prefix]) {
        const isUrl = content[key] && (content[key].startsWith('/uploads/') || content[key].startsWith('http'));
        const itemDiv = doItemDiv(key, content[key], isUrl);
        groupDiv.appendChild(itemDiv);
      }
      
      // Configurar clic de pestaña
      tabBtn.onclick = () => {
        // Quitar activos
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.style.borderBottom = '3px solid transparent';
          b.style.fontWeight = 'normal';
          b.style.color = '#666';
        });
        document.querySelectorAll('.group-content').forEach(g => g.style.display = 'none');
        
        // Poner activo
        tabBtn.style.borderBottom = '3px solid hsl(158 25% 30%)';
        tabBtn.style.fontWeight = 'bold';
        tabBtn.style.color = 'hsl(158 25% 30%)';
        groupDiv.style.display = 'block';
      };

      tabsContainer.appendChild(tabBtn);
      container.appendChild(groupDiv);
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
