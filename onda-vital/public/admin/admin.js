function renderLogin(wrapper, errorMsg = '') {
  wrapper.className = 'admin-wrapper';
  
  wrapper.innerHTML = `
    <div class="login-card">
      <h1>Panel Admin</h1>
      ${errorMsg ? `<div class="error-message">${errorMsg}</div>` : ''}
      <form id="login-form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input type="text" id="username" required autocomplete="username">
        </div>
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn-primary-admin">Entrar</button>
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
  wrapper.className = '';
  
  wrapper.innerHTML = `
    <div class="dashboard-card" style="max-width: 1000px; padding: 30px;">
      <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: hsl(158 25% 30%);">Panel de Control - Onda Vital</h2>
        <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>
      </div>
      
      <p style="color: #666; margin-bottom: 20px;">Navega por las pestañas para editar los textos de tu web al instante.</p>

      <!-- BARRA DE PESTAÑAS -->
      <div id="tabs-container" style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #ddd; overflow-x: auto; padding-bottom: 5px;">
        <!-- Se rellenará con JS -->
      </div>

      <!-- CONTENEDOR DEL EDITOR SEGÚN PESTAÑA -->
      <div id="editor-container" style="min-height: 300px;">
        <div style="text-align: center; padding: 40px; color: #888;">Cargando contenidos...</div>
      </div>

      <hr style="margin: 50px 0 30px 0; border: none; border-top: 1px dashed #ccc;">
      
      <h3 style="color: hsl(158 25% 30%); margin-bottom: 20px;">🖼️ Galería y Multimedia</h3>
      <div style="background: #f4f6f8; padding: 25px; border-radius: 8px; border: 1px solid #dcdcdc;">
        <form id="upload-form">
          <p style="font-size: 14px; margin-bottom: 15px; color: #555;">Si un campo es de tipo imagen, ingresa aquí su clave y sube tu archivo.</p>
          <div class="input-group">
            <label for="image-key">Clave asociada a la imagen</label>
            <input type="text" id="image-key" required placeholder="Ej: home_hero_bg">
          </div>
          <div class="input-group">
            <label for="image-file">Seleccionar archivo</label>
            <input type="file" id="image-file" accept="image/*" required>
          </div>
          <button type="submit" class="btn-primary-admin" style="width: auto; padding: 10px 20px;">1. Optimizar  2. Guardar</button>
          <div id="upload-status" style="margin-top: 15px; font-weight: bold; font-size: 14px;"></div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    renderLogin(wrapper);
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
      'home': '🌎 Inicio',
      'contacto': '📞 Contacto',
      'quiro': '💆 Quiropráctica',
      'reso': '🌊 Resosense',
      'footer': '🦶 Footer',
      'sala': '🛋️ Salas Base',
      'despacho': '🛋️ Despachos Privados'
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
      tabBtn.style.padding = '10px 20px';
      tabBtn.style.border = 'none';
      tabBtn.style.borderBottom = isFirst ? '3px solid hsl(158 25% 30%)' : '3px solid transparent';
      tabBtn.style.background = 'transparent';
      tabBtn.style.cursor = 'pointer';
      tabBtn.style.fontWeight = isFirst ? 'bold' : 'normal';
      tabBtn.style.color = isFirst ? 'hsl(158 25% 30%)' : '#666';
      tabBtn.style.fontSize = '15px';
      tabBtn.style.whiteSpace = 'nowrap';
      
      // 2. Crear Grupo Contenedor
      const groupDiv = document.createElement('div');
      groupDiv.id = 'group-' + prefix;
      groupDiv.className = 'group-content';
      groupDiv.style.display = isFirst ? 'block' : 'none';
      groupDiv.style.animation = 'fadeIn 0.3s ease';

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
  itemDiv.style.marginBottom = '20px';
  itemDiv.style.padding = '15px 20px';
  itemDiv.style.background = '#fff';
  itemDiv.style.border = '1px solid #eaeaea';
  itemDiv.style.borderRadius = '8px';
  itemDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
  
  const label = document.createElement('label');
  label.textContent = key;
  label.style.display = 'block';
  label.style.fontWeight = 'bold';
  label.style.color = '#334155';
  label.style.marginBottom = '8px';
  label.style.fontSize = '12px';
  label.style.textTransform = 'uppercase';
  label.style.letterSpacing = '0.5px';
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
    field.style.padding = '12px';
    field.style.border = '1px solid #ccc';
    field.style.borderRadius = '6px';
    field.style.fontFamily = 'inherit';
    field.style.fontSize = '15px';
    field.style.boxSizing = 'border-box';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar';
    saveBtn.className = 'btn-primary-admin';
    saveBtn.style.width = 'auto';
    saveBtn.style.padding = '6px 16px';
    saveBtn.style.marginTop = '10px';
    saveBtn.style.fontSize = '13px';
    
    const statusSpan = document.createElement('span');
    statusSpan.style.marginLeft = '10px';
    statusSpan.style.fontSize = '13px';
    statusSpan.style.fontWeight = 'bold';

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
