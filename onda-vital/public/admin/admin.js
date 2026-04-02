let adminToken = '';

function buildAuthHeaders(headers = {}) {
  if (!adminToken) {
    return { ...headers };
  }

  return {
    ...headers,
    Authorization: 'Bearer ' + adminToken
  };
}

async function authFetch(url, options = {}) {
  const requestOptions = {
    credentials: 'include',
    ...options,
    headers: buildAuthHeaders(options.headers || {})
  };

  return fetch(url, requestOptions);
}

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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        adminToken = data.token;
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
  wrapper.className = 'admin-layout';
  
  wrapper.innerHTML = /* html */ `
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div style="background:var(--accent); width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">OV</div>
        <span>AdminPanel</span>
      </div>
      <div class="sidebar-menu">
        <div class="sidebar-category">PRINCIPAL</div>
        <a class="sidebar-link active" id="nav-dashboard">
          <span>📊 Dashboard</span>
        </a>
        <a class="sidebar-link" id="nav-usuarios">
          <span>👥 Usuarios</span>
          <span class="sidebar-badge">3</span>
        </a>
        <a class="sidebar-link" id="nav-reservas">
          <span>📅 Reservas</span>
        </a>
        <a class="sidebar-link" id="nav-contenido">
          <span>📝 Contenido</span>
        </a>
        <div class="sidebar-category">SISTEMA</div>
        <a class="sidebar-link" id="nav-config">
          <span>⚙️ Configuración</span>
        </a>
        <a class="sidebar-link" id="nav-seguridad">
          <span>🛡️ Seguridad</span>
        </a>
        <a class="sidebar-link" id="nav-historial">
          <span>📜 Historial Logs</span>
        </a>
        <a class="sidebar-link" id="nav-preview">
          <span>👁️ Vista Previa</span>
        </a>
      </div>
      <div class="sidebar-footer">
        <div class="avatar">DA</div>
        <div class="user-info">
          <span class="name">David A.</span>
          <span class="role">Administrador</span>
        </div>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-topbar">
        <h2 class="topbar-title" id="topbar-title">Dashboard</h2>
        <div class="topbar-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Buscar..." id="global-search">
          </div>
          <button id="btn-toggle-chat" class="btn-toggle-chat">💬 Vitalis</button>
          <button class="btn-new-reserva">+ Nueva reserva</button>
          <button id="btn-logout" class="btn-logout" style="background:var(--danger-bg); border:1px solid var(--danger); color:var(--danger);">Salir</button>
        </div>
      </header>
      <div class="admin-content-area" id="admin-main-content"></div>
    </main>
  `;

  const links = wrapper.querySelectorAll('.sidebar-link');
  const mainContent = document.getElementById('admin-main-content');
  const title = document.getElementById('topbar-title');

  function setActive(id, titleText) {
    links.forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    title.textContent = titleText;
  }

  document.getElementById('nav-dashboard').onclick = () => { setActive('nav-dashboard', 'Dashboard'); renderDashboardHome(mainContent); };
  document.getElementById('nav-reservas').onclick = () => { setActive('nav-reservas', 'Reservas'); renderReservations(mainContent); };
  document.getElementById('nav-contenido').onclick = () => { setActive('nav-contenido', 'Contenido'); renderContentManager(mainContent); };
  document.getElementById('nav-historial').onclick = () => { setActive('nav-historial', 'Historial de Sistema'); renderAuditLog(mainContent); };
  document.getElementById('nav-preview').onclick = () => { setActive('nav-preview', 'Vista Previa Pública'); renderPreview(mainContent); };
  
  // Mocks
  document.getElementById('nav-usuarios').onclick = () => { setActive('nav-usuarios', 'Usuarios'); mainContent.innerHTML = '<div style="color:var(--text-muted);">Módulo de usuarios (Próximamente)</div>'; };
  document.getElementById('nav-config').onclick = () => { setActive('nav-config', 'Configuración'); mainContent.innerHTML = '<div style="color:var(--text-muted);">Módulo de configuración (Próximamente)</div>'; };
  document.getElementById('nav-seguridad').onclick = () => { setActive('nav-seguridad', 'Seguridad'); mainContent.innerHTML = '<div style="color:var(--text-muted);">Módulo de seguridad (Próximamente)</div>'; };

  document.getElementById('btn-logout').addEventListener('click', () => {
    (async () => {
      try {
        await authFetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error(error);
      }

      adminToken = '';
      window.location.href = '/';
    })();
  });

  initAdminChat();
  renderDashboardHome(mainContent);
}

function renderContentManager(container) {
  container.innerHTML = `
      <div id="tabs-container" style="display:flex; overflow-x:auto; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:10px;"></div>
      <div id="content-tools" style="display:flex; gap:10px; margin-bottom:16px;">
        <input id="content-search" type="search" placeholder="Buscar clave..." class="search-box" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-card); color:var(--text-main);">
        <button id="btn-refresh-content" class="btn-primary-admin" style="width:auto; margin:0;">Recargar</button>
      </div>
      <div id="editor-container" class="editor-grid">Cargando...</div>
      
      <div style="margin: 40px 0; border-top: 1px solid var(--border-color); padding-top: 30px;">
        <h3 style="color:var(--text-main); margin-bottom:20px;">🖼️ Reemplazar Imagen</h3>
        <form id="upload-form" style="background:var(--bg-card); padding:24px; border-radius:8px; max-width:500px; border:1px solid var(--border-color);">
           <div class="input-group" style="margin-bottom:16px;"><label>Clave (Ej: home_hero_bg)</label><input type="text" id="image-key" required></div>
           <div class="input-group" style="margin-bottom:20px;"><label>Archivo</label><input type="file" id="image-file" required></div>
           <button type="submit" class="btn-primary-admin" style="margin:0;">Subir Imagen</button>
           <div id="upload-status" style="margin-top:10px; font-weight:bold; font-size:13px;"></div>
        </form>
      </div>`;

  const searchInput = document.getElementById('content-search');
  if (searchInput) searchInput.addEventListener('input', () => loadContentEditor(searchInput.value.trim()));

  const refreshBtn = document.getElementById('btn-refresh-content');
  if (refreshBtn) refreshBtn.addEventListener('click', () => loadContentEditor(searchInput?.value.trim() || ''));

  document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = document.getElementById('image-key').value;
    const fileInput = document.getElementById('image-file');
    const statusDiv = document.getElementById('upload-status');

    if (!fileInput.files[0]) return;
    const formData = new FormData();
    formData.append('key', key);
    formData.append('image', fileInput.files[0]);

    statusDiv.style.color = 'var(--text-muted)';
    statusDiv.textContent = 'Procesando...';

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      });
      const data = await resp.json();
      
      if (data.success) {
        statusDiv.style.color = 'var(--success)';
        statusDiv.textContent = '✅ Subida con éxito: ' + data.url;
        fileInput.value = ''; 
        setTimeout(() => loadContentEditor(document.getElementById('content-search')?.value || ''), 2500);
      } else {
        statusDiv.style.color = 'var(--danger)';
        statusDiv.textContent = data.message || 'Error al subir';
      }
    } catch (err) {
      statusDiv.style.color = 'var(--danger)';
      statusDiv.textContent = 'Error de validación del servidor';
    }
  });

  loadContentEditor('');
}

async function renderDashboardHome(container) {
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Reservas hoy</div>
        <div class="stat-value">24</div>
        <div class="stat-trend positive">↑ 12% vs ayer</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Ingresos (mes)</div>
        <div class="stat-value">4.820€</div>
        <div class="stat-trend positive">↑ 8% vs anterior</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Usuarios activos</div>
        <div class="stat-value">138</div>
        <div class="stat-trend positive">↑ 3 nuevos</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Tasa de cancelación</div>
        <div class="stat-value">4,2%</div>
        <div class="stat-trend negative">↑ 1,1%</div>
      </div>
    </div>

    <div class="middle-grid">
      <div class="chart-card">
        <div class="card-header">
          <h3 class="card-title">Reservas esta semana</h3>
          <div class="chart-tabs">
            <div class="chart-tab active">7d</div>
            <div class="chart-tab">30d</div>
            <div class="chart-tab">90d</div>
          </div>
        </div>
        <div style="height:150px; display:flex; align-items:flex-end; border-bottom:1px solid var(--border-color); gap:10px;">
           <div style="flex:1; background:var(--accent); height:30%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:50%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:40%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:70%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:60%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:90%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
           <div style="flex:1; background:var(--accent); height:80%; opacity:0.8; border-radius:4px 4px 0 0;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:8px; color:var(--text-muted); font-size:0.7rem;">
           <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </div>

      <div class="activity-card">
        <div class="card-header">
          <h3 class="card-title">Actividad reciente</h3>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="icon-box success">✓</div>
            <div class="activity-info">
              <div class="activity-title">Reserva confirmada</div>
              <div class="activity-desc">Ana G. — Sala Zen</div>
            </div>
            <div class="activity-time">hace 1h</div>
          </div>
          <div class="activity-item">
            <div class="icon-box info">👥</div>
            <div class="activity-info">
              <div class="activity-title">Nuevo usuario</div>
              <div class="activity-desc">marcos@mail.com</div>
            </div>
            <div class="activity-time">hace 2h</div>
          </div>
          <div class="activity-item">
            <div class="icon-box warning">!</div>
            <div class="activity-info">
              <div class="activity-title">Pago pendiente</div>
              <div class="activity-desc">Reserva #R-0482</div>
            </div>
            <div class="activity-time">hace 4h</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-card">
      <div class="card-header" style="margin-bottom: 0;">
        <h3 class="card-title">Últimas reservas</h3>
        <button class="btn-new-reserva" style="background:transparent; border:1px solid var(--border-color); font-size:0.8rem; padding:6px 12px; color:var(--text-main);" onclick="document.getElementById('nav-reservas').click()">Ver todas →</button>
      </div>
      <div id="home-reservas-wrapper" style="margin-top:20px; overflow-x:auto;">
         <div style="padding:20px; color:var(--text-muted);">Cargando reservas...</div>
      </div>
    </div>
  `;

  try {
    const res = await authFetch('/api/admin/reservas');
    const data = await res.json();
    if(data.success && data.reservas) {
      const recents = data.reservas.slice(0, 5);
      if(recents.length === 0) {
        document.getElementById('home-reservas-wrapper').innerHTML = '<div style="color:var(--text-muted);">No hay reservas en el sistema.</div>';
      } else {
        let t = '<table class="table-dark"><thead><tr><th>ID</th><th>Cliente</th><th>Sala</th><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead><tbody>';
        recents.forEach(r => {
           let badgeCls = 'info';
           if(r.estado === 'confirmada') badgeCls = 'success';
           if(r.estado === 'rechazada')  badgeCls = 'danger';
           if(r.estado === 'pendiente')  badgeCls = 'warning';
           
           const num = parseInt(Math.random() * 100) + 50; 
           
           t += `<tr>
              <td style="color:var(--text-muted)">#${(r.id || '').split('-')[2] || (r.id || 'N/A').substring(0,6)}</td>
              <td style="font-weight:600;">${r.nombre}</td>
              <td style="color:var(--text-muted)">${r.sala}</td>
              <td>${r.fecha} <br><span style="font-size:0.8rem; color:var(--text-muted)">${r.horario}h</span></td>
              <td style="font-weight:600;">${num}€</td>
              <td><span class="badge ${badgeCls}">${r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}</span></td>
           </tr>`;
        });
        t += '</tbody></table>';
        document.getElementById('home-reservas-wrapper').innerHTML = t;
      }
    }
  } catch(e) {
    document.getElementById('home-reservas-wrapper').innerHTML = '<div style="color:var(--danger)">Error cargando reservas.</div>';
  }
}

async function renderReservations(container) {
  // Esta vista consume SOLO rutas admin protegidas por JWT.
  // Asi evitamos usar endpoints publicos para acciones sensibles.
  container.innerHTML = '<div style="padding: 20px;">Cargando reservas...</div>';
  try {
    const res = await authFetch('/api/admin/reservas');
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
      card.className = 'item-editor-card';
      card.style.display = 'grid';
      card.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
      card.style.gap = '20px';
      card.style.alignItems = 'center';

      let bgStatus = 'var(--warning-bg)', textStatus = 'var(--warning)';
      if(r.estado === 'confirmada') { bgStatus = 'var(--success-bg)'; textStatus = 'var(--success)'; }
      if(r.estado === 'rechazada') { bgStatus = 'var(--danger-bg)'; textStatus = 'var(--danger)'; }

      card.innerHTML = `
        <div class="res-info">
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main); margin-bottom: 4px;">${r.nombre}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${r.contacto || 'Sin contacto'}</div>
          <div style="margin-top: 8px; display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; background: ${bgStatus}; color: ${textStatus};">
            ${r.estado.toUpperCase()}
          </div>
        </div>
        <div class="res-details">
          <div style="font-weight: 600; color: var(--text-main);">${r.sala}</div>
          <div style="font-size: 0.9rem; color: var(--text-muted);">${r.fecha} | <span style="font-family: monospace;">${r.horario}h</span></div>
        </div>
        <div class="res-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
          ${r.estado === 'pendiente' ? `
            <button class="btn-approve" data-id="${r.id}" style="background: var(--success); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Confirmar</button>
            <button class="btn-reject" data-id="${r.id}" style="background: transparent; color: var(--danger); border: 1px solid var(--danger); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Rechazar</button>
          ` : `
            <span style="color: var(--text-muted); font-size: 0.85rem;">Procesada el ${new Date(r.createdAt).toLocaleDateString()}</span>
          `}
        </div>
      `;

      // Botones de accion por reserva.
      // Confirmar/Rechazar llama a backend y luego recarga la lista.
      const approveBtn = card.querySelector('.btn-approve');
      const rejectBtn = card.querySelector('.btn-reject');

      if (approveBtn) {
        approveBtn.onclick = async () => {
          if (!confirm('¿Confirmar esta reserva? Se guardará en el Google Calendar oficial.')) return;
          try {
            const res = await authFetch(`/api/admin/reservas/${r.id}/confirmar`, {
              method: 'PATCH'
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
            const res = await authFetch(`/api/admin/reservas/${r.id}/rechazar`, {
              method: 'PATCH'
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

async function renderAuditLog(container) {
  container.className = '';
  container.innerHTML = '<div style="padding: 20px;">Cargando historial...</div>';
  try {
    const res = await authFetch('/api/admin/logs?limit=100');
    const data = await res.json();

    if (!data.success) {
      container.innerHTML = '<div style="color:red; padding:20px;">No se pudo cargar el historial.</div>';
      return;
    }

    const logs = data.logs || [];
    if (logs.length === 0) {
      container.innerHTML = '<div style="padding:20px; color:#64748b;">Todavia no hay cambios registrados.</div>';
      return;
    }

    const list = document.createElement('div');
    list.style.display = 'grid';
    list.style.gap = '12px';

    logs.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'item-editor-card';
      row.style.marginBottom = '0';
      row.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <strong style="color:var(--text-main);">${item.action || 'accion'}</strong>
          <span style="color:var(--text-muted); font-size:12px;">${new Date(item.timestamp).toLocaleString('es-ES')}</span>
        </div>
        <div style="margin-top:8px; color:var(--text-muted); font-size:13px;">
          <div><strong style="color:var(--text-main);">Admin:</strong> ${item.admin_name || 'admin'}</div>
          <div><strong style="color:var(--text-main);">Clave:</strong> ${item.target_key || '-'}</div>
          <div><strong style="color:var(--text-main);">IP:</strong> ${item.ip_address || '-'}</div>
        </div>
      `;
      list.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(list);
  } catch (error) {
    container.innerHTML = '<div style="color:red; padding:20px;">Error al cargar historial.</div>';
  }
}

function renderPreview(container) {
  // Vista previa embebida:
  // sirve para revisar cambios visuales rapidamente sin salir del panel.
  container.className = '';
  container.innerHTML = `
    <div class="item-editor-card" style="padding:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px;">
        <strong style="color:var(--text-main);">Vista previa publica</strong>
        <button id="btn-refresh-preview" class="btn-primary-admin" style="width:auto; padding:8px 14px; margin:0;">Recargar vista</button>
      </div>
      <iframe id="admin-preview-frame" src="/" style="width:100%; min-height:70vh; border:1px solid var(--border-color); border-radius:10px; background:#fff;"></iframe>
    </div>
  `;

  const refreshPreview = document.getElementById('btn-refresh-preview');
  refreshPreview?.addEventListener('click', () => {
    const frame = document.getElementById('admin-preview-frame');
    if (frame) {
      frame.src = '/?preview=' + Date.now();
    }
  });
}

async function loadContentEditor(searchTerm = '') {
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

    // Helper para que visualmente solo una pestana quede activa.
    const setActiveTab = (btn) => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.style.borderBottom = '3px solid transparent';
        b.style.fontWeight = 'normal';
        b.style.color = 'var(--text-muted)';
      });
      btn.style.borderBottom = '3px solid var(--accent)';
      btn.style.fontWeight = 'bold';
      btn.style.color = 'var(--accent)';
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
      tabBtn.style.color = 'var(--text-muted)';
      tabBtn.style.fontSize = '14px';
      tabBtn.style.whiteSpace = 'nowrap';
      tabBtn.style.borderRadius = '4px 4px 0 0';
      
      // Configurar clic de pestaña
      tabBtn.onclick = () => {
        setActiveTab(tabBtn);
        
        // Rellenar Editor
        container.innerHTML = '';
        container.className = 'editor-grid';
        const filteredKeys = groups[prefix].filter((key) => {
          if (!searchTerm) return true;
          const v = String(content[key] || '').toLowerCase();
          const k = key.toLowerCase();
          const q = searchTerm.toLowerCase();
          return k.includes(q) || v.includes(q);
        });

        if (filteredKeys.length === 0) {
          container.innerHTML = '<div style="padding:24px; color:var(--text-muted);">Sin resultados en esta seccion.</div>';
          return;
        }

        for (const key of filteredKeys) {
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
  label.style.color = 'var(--text-main)';
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
    field.style.border = '1px solid var(--border-color)';
    field.style.borderRadius = '8px';
    field.style.fontFamily = 'inherit';
    field.style.fontSize = '14px';
    field.style.boxSizing = 'border-box';
    field.style.background = 'var(--bg-surface)';
    field.style.color = 'var(--text-main)';
    field.style.transition = 'all 0.2s ease';

    field.onfocus = () => {
      field.style.borderColor = 'var(--accent-light)';
      field.style.background = 'var(--bg-surface)';
      field.style.boxShadow = '0 0 0 3px var(--accent-blue-bg)';
    };
    field.onblur = () => {
      field.style.borderColor = 'var(--border-color)';
      field.style.background = 'var(--bg-surface)';
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
      try {
        const resp = await authFetch('/api/content/' + key, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
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

async function init() {
  // Añadimos una keyframe rápida para animar pestañas si no existe
  if(!document.getElementById('admin-styles-addons')){
     const st = document.createElement('style');
     st.id = 'admin-styles-addons';
     st.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`;
     document.head.appendChild(st);
  }

  const wrapper = document.getElementById('admin-app');
  try {
    const response = await authFetch('/api/auth/session');
    const session = await response.json();

    if (session.success) {
      renderDashboard(wrapper);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  renderLogin(wrapper);
}

let adminChatHistorial = [];
function initAdminChat() {
  if (document.getElementById('admin-chat-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'admin-chat-sidebar';
  sidebar.className = 'admin-chat-sidebar';
  sidebar.innerHTML = `
    <div class="admin-chat-header">
      <h3><span>💬</span> Asistente Vitalis</h3>
      <button class="admin-chat-close" id="btn-close-chat">&times;</button>
    </div>
    <div class="admin-chat-messages" id="admin-chat-messages">
      <div class="admin-msg vitalis">¡Hola! Soy Vitalis. ¿En qué puedo ayudarte a gestionar el panel hoy?</div>
    </div>
    <form class="admin-chat-input-area" id="admin-chat-form">
      <input type="text" id="admin-chat-input" placeholder="Pregunta a Vitalis..." required autocomplete="off">
      <button type="submit" style="font-size: 1.2rem;">➤</button>
    </form>
  `;
  document.body.appendChild(sidebar);

  document.getElementById('btn-close-chat').addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  document.getElementById('admin-chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('admin-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    const messagesDiv = document.getElementById('admin-chat-messages');
    
    const userMsg = document.createElement('div');
    userMsg.className = 'admin-msg user';
    userMsg.textContent = msg;
    messagesDiv.appendChild(userMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    const typ = document.createElement('div');
    typ.className = 'admin-msg vitalis';
    typ.textContent = '... Escribiendo ...';
    messagesDiv.appendChild(typ);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: msg,
          historial: adminChatHistorial,
          context: 'admin'
        })
      });
      const data = await resp.json();
      
      messagesDiv.removeChild(typ);

      const vMsg = document.createElement('div');
      vMsg.className = 'admin-msg vitalis';
      if (data.success) {
        vMsg.textContent = data.respuesta;
        adminChatHistorial.push({ role: 'user', content: msg });
        adminChatHistorial.push({ role: 'assistant', content: data.respuesta });
      } else {
        vMsg.textContent = 'Error de conexión con Vitalis.';
      }
      messagesDiv.appendChild(vMsg);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (err) {
      console.error(err);
      messagesDiv.removeChild(typ);
      const vMsg = document.createElement('div');
      vMsg.className = 'admin-msg vitalis';
      vMsg.textContent = 'Hubo un error de red.';
      messagesDiv.appendChild(vMsg);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'btn-toggle-chat' || e.target.closest('#btn-toggle-chat'))) {
      sidebar.classList.add('active');
    }
  });
}

init();
