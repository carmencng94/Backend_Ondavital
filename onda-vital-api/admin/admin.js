let adminToken = '';
const pendingChanges = {};
let currentActivePrefix = '';
let activeEditLanguage = 'es';

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
          <span>Dashboard</span>
        </a>
        <a class="sidebar-link" id="nav-reservas">
          <span>Reservas</span>
        </a>
        <a class="sidebar-link" id="nav-contenido">
          <span>Contenido</span>
        </a>
        <div class="sidebar-category">SISTEMA</div>
        <a class="sidebar-link" id="nav-historial">
          <span>Historial Logs</span>
        </a>
        <a class="sidebar-link" id="nav-preview">
          <span>Vista Previa</span>
        </a>
        <a class="sidebar-link" id="nav-auditoria">
          <span>Auditoría de IA</span>
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
  document.getElementById('nav-auditoria').onclick = () => { setActive('nav-auditoria', 'Auditoría de IA'); renderAIAudit(mainContent); };

  document.getElementById('btn-logout').addEventListener('click', () => {
    (async () => {
      try {
        await authFetch(window.API_BASE_URL + '/api/auth/logout', { method: 'POST' });
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
    <div class="customizer-layout">
       <!-- Panel de Control Izquierdo -->
      <div class="customizer-panel">
        <div id="tabs-container"></div>
        <div class="language-selector-bar" style="display:flex; gap:8px; margin-bottom:16px; align-items:center; background:#f3f4f6; padding:8px 12px; border-radius:8px; border:1px solid rgba(0,0,0,0.1);">
          <span style="font-size:12px; font-weight:700; color:#4b5563; margin-right:8px; text-transform:uppercase; letter-spacing:0.5px;">Idioma de edición:</span>
          <button class="btn-lang-selector" data-lang="es" style="background:var(--accent); color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;">Español 🇪🇸</button>
          <button class="btn-lang-selector" data-lang="en" style="background:transparent; color:#374151; border:1px solid rgba(0,0,0,0.1); padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;">Inglés 🇬🇧</button>
          <button class="btn-lang-selector" data-lang="de" style="background:transparent; color:#374151; border:1px solid rgba(0,0,0,0.1); padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;">Alemán 🇩🇪</button>
          <button class="btn-lang-selector" data-lang="ca" style="background:transparent; color:#374151; border:1px solid rgba(0,0,0,0.1); padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;">Catalán 🇦🇩</button>
        </div>
        <div id="content-tools" style="display:flex; gap:12px; margin-bottom:24px; align-items:center;">
          <div class="search-box" style="flex:1; display:flex;">
            <span class="search-icon">🔍</span>
            <input id="content-search" type="text" placeholder="Buscar textos o claves en esta sección..." style="width:100%; padding-left:38px;">
          </div>
          <button id="btn-refresh-content" class="btn-new-reserva" style="margin:0; display:flex; align-items:center; gap:8px;">
            Recargar
          </button>
        </div>
        <div id="editor-container" class="editor-grid">Cargando contenidos...</div>
        <div id="floating-save-container"></div>
      </div>
      
      <!-- Vista Previa Derecha (WordPress Customizer Style) -->
      <div class="customizer-preview-container">
        <div class="preview-header-bar" style="justify-content: center;">
          <div class="preview-actions">
            <button class="btn-preview-device active" id="btn-device-desktop" title="Vista de Escritorio">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </button>
            <button class="btn-preview-device" id="btn-device-tablet" title="Vista de Tableta">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </button>
            <button class="btn-preview-device" id="btn-device-mobile" title="Vista Móvil">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="2" width="12" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="preview-iframe-wrapper" id="preview-frame-wrapper">
          <div id="iframe-scaler" style="position: relative; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
            <iframe id="customizer-preview-iframe" src="/"></iframe>
          </div>
        </div>
      </div>
    </div>
  `;

  // Sincronizar selectores de dispositivo de la vista previa con escalado inteligente
  const wrapper = document.getElementById('preview-frame-wrapper');
  const btnDesktop = document.getElementById('btn-device-desktop');
  const btnTablet = document.getElementById('btn-device-tablet');
  const btnMobile = document.getElementById('btn-device-mobile');

  const resizePreviewIframe = () => {
    const scaler = document.getElementById('iframe-scaler');
    const iframe = document.getElementById('customizer-preview-iframe');
    if (!wrapper || !scaler || !iframe) return;

    const wrapperWidth = wrapper.clientWidth - 40; // padding 20px de margen
    const wrapperHeight = wrapper.clientHeight - 40;

    let virtualWidth = 1200;
    let virtualHeight = 780;
    let isDesktop = true;
    let hasDeviceFrame = false;

    if (wrapper.classList.contains('mobile')) {
      virtualWidth = 375;
      virtualHeight = 667;
      isDesktop = false;
      hasDeviceFrame = true;
    } else if (wrapper.classList.contains('tablet')) {
      virtualWidth = 768;
      virtualHeight = 1024;
      isDesktop = false;
      hasDeviceFrame = true;
    }

    let scale = 1;
    let scaledWidth = 0;
    let scaledHeight = 0;

    if (isDesktop) {
      // Escritorio simulado (pantalla completa sin marcos artificiales)
      scale = wrapperWidth / virtualWidth;
      virtualHeight = Math.max(780, wrapperHeight / scale);

      scaledWidth = wrapperWidth;
      scaledHeight = wrapperHeight;
    } else {
      // Dispositivos móviles (mantener relación de aspecto física)
      const scaleX = wrapperWidth / virtualWidth;
      const scaleY = wrapperHeight / virtualHeight;
      scale = Math.min(scaleX, scaleY, 1);

      scaledWidth = virtualWidth * scale;
      scaledHeight = virtualHeight * scale;
    }

    // Configurar el contenedor escalador (layout físico exacto en el DOM)
    scaler.style.width = `${scaledWidth}px`;
    scaler.style.height = `${scaledHeight}px`;
    scaler.style.display = 'block';

    // Configurar el iframe real (tamaño virtual + transformación)
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = `${virtualWidth}px`;
    iframe.style.height = `${virtualHeight}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = 'top left';

    if (hasDeviceFrame) {
      scaler.style.borderRadius = wrapper.classList.contains('mobile') ? '28px' : '20px';
      scaler.style.border = wrapper.classList.contains('mobile') ? '10px solid #222' : '8px solid #222';
      scaler.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.7)';
      scaler.style.background = '#222';
    } else {
      scaler.style.borderRadius = '8px';
      scaler.style.border = '1px solid var(--border-color)';
      scaler.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      scaler.style.background = 'white';
    }
  };

  if (btnDesktop && btnTablet && btnMobile && wrapper) {
    btnDesktop.onclick = () => {
      btnDesktop.classList.add('active');
      btnTablet.classList.remove('active');
      btnMobile.classList.remove('active');
      wrapper.className = 'preview-iframe-wrapper';
      resizePreviewIframe();
    };
    btnTablet.onclick = () => {
      btnDesktop.classList.remove('active');
      btnTablet.classList.add('active');
      btnMobile.classList.remove('active');
      wrapper.className = 'preview-iframe-wrapper tablet';
      resizePreviewIframe();
    };
    btnMobile.onclick = () => {
      btnDesktop.classList.remove('active');
      btnTablet.classList.remove('active');
      btnMobile.classList.add('active');
      wrapper.className = 'preview-iframe-wrapper mobile';
      resizePreviewIframe();
    };
  }

  // Evitar duplicación de listeners globales en resize
  if (window.customizerResizeHandler) {
    window.removeEventListener('resize', window.customizerResizeHandler);
  }
  window.customizerResizeHandler = resizePreviewIframe;
  window.addEventListener('resize', window.customizerResizeHandler);

  // Forzar escalado al cargarse el iframe o inmediatamente
  const previewIframe = document.getElementById('customizer-preview-iframe');
  if (previewIframe) {
    previewIframe.onload = resizePreviewIframe;
  }
  setTimeout(resizePreviewIframe, 100);

  const searchInput = document.getElementById('content-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadContentEditor(searchInput.value.trim());
    });
  }

  const refreshBtn = document.getElementById('btn-refresh-content');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadContentEditor(searchInput?.value.trim() || '');
      setTimeout(resizePreviewIframe, 100);
    });
  }

  // Configurar gestor de cambio de idioma de edición
  const langButtons = container.querySelectorAll('.btn-lang-selector');
  
  // Sincronizar UI de botones de idioma activos
  const syncLangButtons = () => {
    langButtons.forEach(b => {
      if (b.dataset.lang === activeEditLanguage) {
        b.style.background = 'var(--accent)';
        b.style.color = 'white';
        b.style.border = 'none';
      } else {
        b.style.background = 'transparent';
        b.style.color = '#374151';
        b.style.border = '1px solid rgba(0,0,0,0.1)';
      }
    });
  };
  syncLangButtons();

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      if (selectedLang === activeEditLanguage) return;

      if (Object.keys(pendingChanges).length > 0) {
        if (!confirm('Tienes cambios pendientes de guardar en este idioma. Si cambias de idioma los perderás. ¿Deseas descartarlos para cambiar de idioma?')) {
          return;
        }
        for (const k in pendingChanges) {
          delete pendingChanges[k];
        }
        updateFloatingSaveBar();
      }

      activeEditLanguage = selectedLang;
      syncLangButtons();

      // Cambiar idioma de la vista previa iframe
      const iframe = document.getElementById('customizer-preview-iframe');
      if (iframe) {
        iframe.src = `/?lang=${activeEditLanguage}`;
      }

      loadContentEditor(searchInput?.value.trim() || '');
      setTimeout(resizePreviewIframe, 100);
    });
  });

  loadContentEditor('');
}

let currentWeekOffset = 0;
let selectedDayStr = '';

async function renderDashboardHome(container) {
  // Reset selectedDayStr to today's date if empty
  const todayObj = new Date();
  const todayY = todayObj.getFullYear();
  const todayM = String(todayObj.getMonth() + 1).padStart(2, '0');
  const todayD = String(todayObj.getDate()).padStart(2, '0');
  const todayStr = `${todayY}-${todayM}-${todayD}`;

  if (!selectedDayStr) {
    selectedDayStr = todayStr;
  }

  container.innerHTML = `
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Reservas de Hoy</div>
        <div class="stat-value" id="stat-hoy">0</div>
        <div class="stat-trend" style="color:var(--text-muted)">Hoy</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Solicitudes Pendientes</div>
        <div class="stat-value" id="stat-pendientes">0</div>
        <div class="stat-trend" style="color:var(--warning)">Requieren atención</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Ingresos Mensuales</div>
        <div class="stat-value" id="stat-ingresos">0.00€</div>
        <div class="stat-trend positive" style="color:var(--success)">Mes actual (Confirmadas)</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Reservas esta Semana</div>
        <div class="stat-value" id="stat-semana">0</div>
        <div class="stat-trend" style="color:var(--text-muted)">Activas esta semana</div>
      </div>
    </div>

    <!-- Main Layout Grid: spacious 60/40 layout -->
    <div class="dashboard-grid-layout">
      <!-- Left Column: Interactive Weekly Calendar Widget -->
      <div class="chart-card" style="display:flex; flex-direction:column; gap:20px;">
        <div class="card-header" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:center;">
          <h3 class="card-title">📅 Agenda Semanal</h3>
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="btn-prev-week" class="btn-new-reserva" style="padding:6px 12px; margin:0; font-size:0.8rem; height:32px; display:flex; align-items:center;">◀ Ant.</button>
            <span id="agenda-date-range" style="font-size:0.85rem; font-weight:600; color:var(--text-main); white-space:nowrap;"></span>
            <button id="btn-next-week" class="btn-new-reserva" style="padding:6px 12px; margin:0; font-size:0.8rem; height:32px; display:flex; align-items:center;">Sig. ▶</button>
          </div>
        </div>
        
        <!-- Horizontal week selector -->
        <div class="calendar-days-row" id="calendar-days-row">
          <!-- 7 day cards will be drawn here -->
        </div>

        <!-- Spacious Selected Day detailed view -->
        <div class="agenda-detail-container">
          <div class="agenda-header" id="agenda-selected-day-header">Reservas del día</div>
          <div id="agenda-selected-day-list" style="display:flex; flex-direction:column; gap:12px;">
            <!-- Detailed bookings for the selected day will go here -->
          </div>
        </div>
      </div>

      <!-- Right Column: Pending Approvals list -->
      <div class="activity-card" style="display:flex; flex-direction:column; gap:16px;">
        <div class="card-header" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:center;">
          <h3 class="card-title">⏳ Solicitudes por Confirmar</h3>
          <span class="sidebar-badge" id="pending-badge" style="display:none; background:var(--warning); color:black; font-weight:700; border-radius:10px; padding:2px 8px;">0</span>
        </div>
        <div id="pending-requests-container" style="display:flex; flex-direction:column; gap:12px; overflow-y:auto; max-height:520px; padding-right:4px;">
          <div style="padding:20px; color:var(--text-muted);">Cargando solicitudes...</div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: History log table -->
    <div class="data-card">
      <div class="card-header" style="margin-bottom: 0;">
        <h3 class="card-title">Historial de Últimas Reservas</h3>
        <button class="btn-new-reserva" style="background:transparent; border:1px solid var(--border-color); font-size:0.8rem; padding:6px 12px; color:var(--text-main);" onclick="document.getElementById('nav-reservas').click()">Ver todas →</button>
      </div>
      <div id="home-reservas-wrapper" style="margin-top:20px; overflow-x:auto;">
         <div style="padding:20px; color:var(--text-muted);">Cargando historial...</div>
      </div>
    </div>
  `;

  try {
    const res = await authFetch(window.API_BASE_URL + '/api/admin/reservas');
    const data = await res.json();
    if (!data.success || !data.reservas) {
      throw new Error(data.error || 'No se pudieron obtener las reservas');
    }

    const reservas = data.reservas;
    const now = new Date();

    // --- 1. Calcular Métricas Reales ---
    const reservasHoy = reservas.filter(r => r.fecha === todayStr && r.estado !== 'rechazada');
    document.getElementById('stat-hoy').textContent = reservasHoy.length;

    const solicitudesPendientes = reservas.filter(r => r.estado === 'pendiente');
    const countPendientes = solicitudesPendientes.length;
    const pendingVal = document.getElementById('stat-pendientes');
    pendingVal.textContent = countPendientes;
    if (countPendientes > 0) {
      pendingVal.style.color = 'var(--warning)';
    } else {
      pendingVal.style.color = 'var(--text-main)';
    }

    // Ingresos del mes actual
    const currentMonthNum = now.getMonth();
    const currentYearNum = now.getFullYear();
    const ingresosMes = reservas.reduce((sum, r) => {
      if (!r.fecha || r.estado !== 'confirmada') return sum;
      const [y, m] = r.fecha.split('-').map(Number);
      if (y === currentYearNum && (m - 1) === currentMonthNum) {
        return sum + (parseFloat(r.precio) || 0);
      }
      return sum;
    }, 0);
    document.getElementById('stat-ingresos').textContent = `${ingresosMes.toFixed(2)}€`;

    // Reservas de esta semana
    const currentDayOfWeek = now.getDay(); // 0 es Domingo
    const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayThisWeek = new Date(now);
    mondayThisWeek.setDate(now.getDate() + distToMon);
    mondayThisWeek.setHours(0,0,0,0);

    const sundayThisWeek = new Date(mondayThisWeek);
    sundayThisWeek.setDate(mondayThisWeek.getDate() + 6);
    sundayThisWeek.setHours(23,59,59,999);

    const reservasSemana = reservas.filter(r => {
      if (!r.fecha || r.estado === 'rechazada') return false;
      const d = new Date(r.fecha);
      return d >= mondayThisWeek && d <= sundayThisWeek;
    });
    document.getElementById('stat-semana').textContent = reservasSemana.length;


    // --- 2. Renderizar Historial de Últimas Reservas (Tabla inferior) ---
    const recents = reservas.slice(0, 5);
    if (recents.length === 0) {
      document.getElementById('home-reservas-wrapper').innerHTML = '<div style="padding:20px; color:var(--text-muted);">No hay reservas en el sistema.</div>';
    } else {
      let t = '<table class="table-dark"><thead><tr><th>ID</th><th>Cliente</th><th>Sala</th><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead><tbody>';
      recents.forEach(r => {
        let badgeCls = 'info';
        if (r.estado === 'confirmada') badgeCls = 'success';
        if (r.estado === 'rechazada') badgeCls = 'danger';
        if (r.estado === 'pendiente') badgeCls = 'warning';

        const num = r.precio !== undefined && r.precio !== null ? r.precio : 0;

        t += `<tr>
            <td style="color:var(--text-muted)">#${(r.id || '').split('-')[2] || (r.id || 'N/A').substring(0, 6)}</td>
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


    // --- 3. Renderizar Panel de Solicitudes Pendientes (Derecha) ---
    const pendingContainer = document.getElementById('pending-requests-container');
    const pendingBadge = document.getElementById('pending-badge');
    
    if (solicitudesPendientes.length === 0) {
      pendingBadge.style.display = 'none';
      pendingContainer.innerHTML = `
        <div style="padding:40px 20px; text-align:center; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; gap:8px; background:rgba(255,255,255,0.01); border-radius:12px; border:1px dashed var(--border-color);">
          <span style="font-size:1.5rem;">🎉</span>
          <span>¡Al día! No hay solicitudes pendientes de confirmar.</span>
        </div>
      `;
    } else {
      pendingBadge.textContent = countPendientes;
      pendingBadge.style.display = 'inline-block';
      pendingContainer.innerHTML = '';

      solicitudesPendientes.forEach(r => {
        const item = document.createElement('div');
        item.style = 'background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:12px; transition:all 0.2s;';
        
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-weight:600; font-size:0.95rem; color:var(--text-main);">${r.nombre}</div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${r.contacto || 'Sin datos de contacto'}</div>
            </div>
            <span style="font-weight:700; font-size:0.95rem; color:var(--success);">${r.precio}€</span>
          </div>

          <div style="display:flex; gap:16px; font-size:0.8rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.03); padding-top:8px;">
            <div style="display:flex; align-items:center; gap:4px;">
              <span>📍</span> <strong>${r.sala}</strong>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span>📅</span> <span>${r.fecha}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span>⏰</span> <span>${r.horario}h</span>
            </div>
          </div>

          ${r.actividad ? `
            <div style="font-size:0.8rem; background:rgba(0,0,0,0.15); padding:6px 10px; border-radius:6px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
              <span>📋</span> <span>${r.actividad} ${r.es_ruidosa ? '<b style="color:var(--warning)">🔊 Ruidosa</b>' : ''}</span>
            </div>
          ` : ''}

          <div style="display:flex; gap:8px; margin-top:4px;">
            <button class="res-btn-confirm btn-approve" data-id="${r.id}" style="flex:1; background:var(--success-bg); color:var(--success); border:1px solid rgba(16, 185, 129, 0.3); padding:8px 12px; border-radius:8px; font-weight:600; font-size:0.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s;">
              <span>✓</span> Confirmar
            </button>
            <button class="res-btn-reject btn-reject" data-id="${r.id}" style="flex:1; background:var(--danger-bg); color:var(--danger); border:1px solid rgba(239, 68, 68, 0.3); padding:8px 12px; border-radius:8px; font-weight:600; font-size:0.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s;">
              <span>✕</span> Rechazar
            </button>
          </div>
        `;

        item.querySelector('.btn-approve').onclick = async () => {
          if (!confirm(`¿Confirmar la reserva de ${r.nombre} en ${r.sala}? Se sincronizará con Google Calendar.`)) return;
          try {
            const res = await authFetch(`/api/admin/reservas/${r.id}/confirmar`, { method: 'PATCH' });
            const d = await res.json();
            if (d.success) {
              renderDashboardHome(container);
            } else {
              alert('Error: ' + (d.error || 'No se pudo confirmar'));
            }
          } catch (e) {
            console.error(e);
          }
        };

        item.querySelector('.btn-reject').onclick = async () => {
          if (!confirm(`¿Rechazar la reserva de ${r.nombre}? Se enviará notificación.`)) return;
          try {
            const res = await authFetch(`/api/admin/reservas/${r.id}/rechazar`, { method: 'PATCH' });
            const d = await res.json();
            if (d.success) {
              renderDashboardHome(container);
            } else {
              alert('Error: ' + (d.error || 'No se pudo rechazar'));
            }
          } catch (e) {
            console.error(e);
          }
        };

        pendingContainer.appendChild(item);
      });
    }


    // --- 4. Renderizar Agenda Semanal Interactiva (Izquierda) ---
    const daysRow = document.getElementById('calendar-days-row');
    const rangeSpan = document.getElementById('agenda-date-range');
    const detailList = document.getElementById('agenda-selected-day-list');
    const detailHeader = document.getElementById('agenda-selected-day-header');

    const updateCalendarWidget = () => {
      const mondayTarget = new Date(mondayThisWeek);
      mondayTarget.setDate(mondayThisWeek.getDate() + (currentWeekOffset * 7));
      
      const sundayTarget = new Date(mondayTarget);
      sundayTarget.setDate(mondayTarget.getDate() + 6);

      const formatMinDate = (date) => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
      };
      rangeSpan.textContent = `${formatMinDate(mondayTarget)} - ${formatMinDate(sundayTarget)}`;

      daysRow.innerHTML = '';
      const dayNamesMin = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

      for (let i = 0; i < 7; i++) {
        const loopDay = new Date(mondayTarget);
        loopDay.setDate(mondayTarget.getDate() + i);

        const ly = loopDay.getFullYear();
        const lm = String(loopDay.getMonth() + 1).padStart(2, '0');
        const ld = String(loopDay.getDate()).padStart(2, '0');
        const loopDayStr = `${ly}-${lm}-${ld}`;

        const dayReservations = reservas.filter(r => r.fecha === loopDayStr && r.estado !== 'rechazada');
        const hasPending = dayReservations.some(r => r.estado === 'pendiente');
        const hasConfirmed = dayReservations.some(r => r.estado === 'confirmada');

        const card = document.createElement('div');
        let cardCls = 'calendar-day-card';
        if (loopDayStr === todayStr) cardCls += ' today';
        if (loopDayStr === selectedDayStr) cardCls += ' active';
        card.className = cardCls;
        card.dataset.date = loopDayStr;

        let dotsHTML = '<div class="day-dots-container">';
        if (hasPending) dotsHTML += '<span class="day-dot pending"></span>';
        if (hasConfirmed) dotsHTML += '<span class="day-dot confirmed"></span>';
        if (!hasPending && !hasConfirmed) dotsHTML += '<span class="day-dot" style="background:transparent;"></span>';
        dotsHTML += '</div>';

        card.innerHTML = `
          <span class="day-name">${dayNamesMin[i]}</span>
          <span class="day-num">${loopDay.getDate()}</span>
          ${dotsHTML}
        `;

        card.onclick = () => {
          selectedDayStr = loopDayStr;
          document.querySelectorAll('.calendar-day-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          renderSelectedDayAgenda();
        };

        daysRow.appendChild(card);
      }

      renderSelectedDayAgenda();
    };

    const renderSelectedDayAgenda = () => {
      const dayReservations = reservas.filter(r => r.fecha === selectedDayStr && r.estado !== 'rechazada');
      
      const getStartHour = (horario) => {
        if (!horario) return '24:00';
        const match = horario.match(/(\d{2}):(\d{2})/);
        return match ? match[0] : '24:00';
      };
      dayReservations.sort((a, b) => getStartHour(a.horario).localeCompare(getStartHour(b.horario)));

      const [y, m, d] = selectedDayStr.split('-').map(Number);
      const selDateObj = new Date(y, m - 1, d);
      const formatLongDate = (date) => {
        const daysLong = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthsLong = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${daysLong[date.getDay()]}, ${date.getDate()} de ${monthsLong[date.getMonth()]} ${date.getFullYear()}`;
      };
      
      detailHeader.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span>📅 Reservas para: <strong style="color:var(--text-main); font-size:0.95rem;">${formatLongDate(selDateObj)}</strong></span>
          <span style="font-size:0.8rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:12px;">${dayReservations.length} ${dayReservations.length === 1 ? 'reserva' : 'reservas'}</span>
        </div>
      `;

      detailList.innerHTML = '';

      if (dayReservations.length === 0) {
        detailList.innerHTML = `
          <div style="padding:60px 20px; text-align:center; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; gap:8px; border:1px dashed var(--border-color); border-radius:12px; background:rgba(255,255,255,0.005);">
            <span style="font-size:1.5rem;">☕</span>
            <span>No hay reservas programadas para este día. ¡Todo despejado!</span>
          </div>
        `;
      } else {
        dayReservations.forEach(r => {
          const card = document.createElement('div');
          card.className = 'agenda-item-card';

          let statusBadgeHTML = '';
          if (r.estado === 'pendiente') {
            statusBadgeHTML = `<span class="badge warning" style="font-size:0.7rem; border-radius:4px; padding:3px 8px;">Pendiente</span>`;
          } else {
            statusBadgeHTML = `<span class="badge success" style="font-size:0.7rem; border-radius:4px; padding:3px 8px;">Confirmada</span>`;
          }

          card.innerHTML = `
            <div class="agenda-item-left">
              <div class="agenda-time-badge">${getStartHour(r.horario)}h</div>
              <div class="agenda-item-details">
                <div class="agenda-client-name">${r.nombre}</div>
                <div class="agenda-meta-info">
                  <span>📍 <strong>${r.sala}</strong></span>
                  <span>⏰ Horario: ${r.horario}</span>
                  ${r.actividad ? `<span>📋 Actividad: ${r.actividad}</span>` : ''}
                </div>
              </div>
            </div>
            
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0;">
              <span style="font-weight:700; font-size:1rem; color:var(--text-main);">${r.precio}€</span>
              <div style="display:flex; align-items:center; gap:6px;">
                ${r.es_ruidosa ? '<span title="Evento ruidoso (música)" style="font-size:0.85rem; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:4px; padding:2px 4px; display:inline-flex; align-items:center; gap:3px; color:var(--warning); font-size:0.68rem; font-weight:700;">🔊 RUIDOSA</span>' : ''}
                ${statusBadgeHTML}
              </div>
            </div>
          `;

          detailList.appendChild(card);
        });
      }
    };

    updateCalendarWidget();

    document.getElementById('btn-prev-week').onclick = (e) => {
      e.preventDefault();
      currentWeekOffset--;
      const mondayTarget = new Date(mondayThisWeek);
      mondayTarget.setDate(mondayThisWeek.getDate() + (currentWeekOffset * 7));
      const ly = mondayTarget.getFullYear();
      const lm = String(mondayTarget.getMonth() + 1).padStart(2, '0');
      const ld = String(mondayTarget.getDate()).padStart(2, '0');
      selectedDayStr = `${ly}-${lm}-${ld}`;

      updateCalendarWidget();
    };

    document.getElementById('btn-next-week').onclick = (e) => {
      e.preventDefault();
      currentWeekOffset++;
      const mondayTarget = new Date(mondayThisWeek);
      mondayTarget.setDate(mondayThisWeek.getDate() + (currentWeekOffset * 7));
      const ly = mondayTarget.getFullYear();
      const lm = String(mondayTarget.getMonth() + 1).padStart(2, '0');
      const ld = String(mondayTarget.getDate()).padStart(2, '0');
      selectedDayStr = `${ly}-${lm}-${ld}`;

      updateCalendarWidget();
    };

  } catch (err) {
    console.error(err);
    document.getElementById('home-reservas-wrapper').innerHTML = `<div style="color:var(--danger); padding:20px;">Error al conectar: ${err.message}</div>`;
  }
}

async function renderAIAudit(container) {
  container.innerHTML = `
    <div class="data-card" style="display:flex; flex-direction:column; gap:16px;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Feedbacks Pendientes de Vitalis</h3>
        <button id="btn-meta-summary" class="btn-new-reserva" style="background:var(--accent); color:white;">✨ Generar Meta-Resumen y Limpiar</button>
      </div>
      <div id="ai-audit-content" style="padding: 20px;">Cargando feedbacks...</div>
    </div>
  `;

  document.getElementById('btn-meta-summary').onclick = async () => {
    if (!confirm('¿Seguro que quieres enviar todas las quejas a la IA para resumirlas y luego BORRARLAS permanentemente?')) return;
    document.getElementById('ai-audit-content').innerHTML = 'Generando resumen... (esto puede tardar unos segundos)';
    try {
      const res = await authFetch(window.API_BASE_URL + '/api/admin/feedbacks/meta-summary', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Meta-Resumen Generado:\\n\\n' + data.summary);
        renderAIAudit(container);
      } else {
        alert('Error: ' + data.message);
        renderAIAudit(container);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  try {
    const res = await authFetch(window.API_BASE_URL + '/api/admin/feedbacks');
    const data = await res.json();
    
    if (!data.success) {
      document.getElementById('ai-audit-content').innerHTML = `<div style="color:red;">Error: ${data.message}</div>`;
      return;
    }

    const feedbacks = data.feedbacks;
    if (feedbacks.length === 0) {
      document.getElementById('ai-audit-content').innerHTML = '<div style="color:var(--text-muted);">No hay feedbacks pendientes de revisar.</div>';
      return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:12px;">';
    feedbacks.forEach(f => {
      html += `
        <div style="background:var(--bg-surface); padding:16px; border:1px solid var(--border-color); border-radius:8px;">
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">Fecha: ${new Date(f.created_at).toLocaleString()} | IP: ${f.ip_address || 'N/A'}</div>
          <div style="margin-bottom:8px;"><strong>👤 Usuario:</strong> <span style="color:var(--text-main);">${f.user_message}</span></div>
          <div style="margin-bottom:8px;"><strong>🤖 Vitalis:</strong> <span style="color:var(--text-muted);">${f.ai_response}</span></div>
          <div style="margin-bottom:12px; background:rgba(239, 68, 68, 0.1); padding:8px; border-left:3px solid var(--danger); border-radius:4px;">
            <strong>👎 Queja:</strong> ${f.feedback_text}
          </div>
          <button class="btn-resolve-feedback" data-id="${f.id}" style="background:var(--success-bg); color:var(--success); border:1px solid var(--success); padding:6px 12px; border-radius:4px; cursor:pointer;">✓ Marcar como Resuelto</button>
        </div>
      `;
    });
    html += '</div>';
    document.getElementById('ai-audit-content').innerHTML = html;

    document.querySelectorAll('.btn-resolve-feedback').forEach(btn => {
      btn.onclick = async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('¿Seguro que ya has corregido este problema y quieres archivar (borrar) este feedback?')) return;
        try {
          const r = await authFetch(window.API_BASE_URL + '/api/admin/feedbacks/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const d = await r.json();
          if (d.success) renderAIAudit(container);
          else alert('Error: ' + d.message);
        } catch(err) {
          console.error(err);
        }
      }
    });

  } catch (error) {
    console.error(error);
    document.getElementById('ai-audit-content').innerHTML = '<div style="color:red;">Error de conexión</div>';
  }
}

async function renderReservations(container) {
  // Esta vista consume SOLO rutas admin protegidas por JWT.
  // Asi evitamos usar endpoints publicos para acciones sensibles.
  container.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Cargando reservas...</div>';
  try {
    const res = await authFetch(window.API_BASE_URL + '/api/admin/reservas');
    const data = await res.json();

    if (!data.success) {
      container.innerHTML = `<div style="color:var(--danger); padding:20px;">Error: ${data.error}</div>`;
      return;
    }

    const { reservas } = data;

    if (reservas.length === 0) {
      container.innerHTML = '<div style="padding: 60px; text-align: center; color: var(--text-muted);">No hay reservas registradas todavía.</div>';
      return;
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'reservations-container';

    reservas.forEach(r => {
      const card = document.createElement('div');
      card.className = `reservation-card ${r.estado}`;

      // Procesar iniciales para el avatar
      const initials = r.nombre
        ? r.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

      // Procesar contacto (separar email y telefono si vienen juntos)
      let email = '';
      let phone = '';
      if (r.contacto) {
        const parts = r.contacto.split(',');
        if (parts.length >= 2) {
          email = parts[0].trim();
          phone = parts[1].trim();
        } else {
          const val = r.contacto.trim();
          if (val.includes('@')) {
            email = val;
          } else {
            phone = val;
          }
        }
      }

      card.innerHTML = `
        <div class="res-avatar-wrapper">
          <div class="res-avatar">${initials}</div>
        </div>
        
        <div class="res-client-info">
          <div class="res-client-name">${r.nombre}</div>
          ${email ? `
            <a href="mailto:${email}" class="res-contact-item" title="Enviar correo">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>${email}</span>
            </a>
          ` : ''}
          ${phone ? `
            <a href="tel:${phone}" class="res-contact-item" title="Llamar por teléfono">
              <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${phone}</span>
            </a>
          ` : ''}
          ${!email && !phone ? `<div class="res-contact-item" style="opacity: 0.5;">Sin datos de contacto</div>` : ''}
        </div>
        
        <div class="res-booking-details">
          <div class="res-sala-badge">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${r.sala}</span>
          </div>
          <div class="res-time-info">
            <div class="res-time-item">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${r.fecha}</span>
            </div>
            <div class="res-time-item">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${r.horario}h</span>
            </div>
          </div>
        </div>
        
        <div class="res-actions-wrapper">
          <div class="res-status-wrapper">
            <span class="res-status-badge ${r.estado}">
              <span class="status-dot"></span>
              ${r.estado}
            </span>
          </div>
          <div style="margin-top: 4px;">
            ${r.estado === 'pendiente' ? `
              <div style="display: flex; gap: 8px;">
                <button class="res-btn-confirm btn-approve" data-id="${r.id}" title="Confirmar reserva">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Confirmar</span>
                </button>
                <button class="res-btn-reject btn-reject" data-id="${r.id}" title="Rechazar reserva">
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Rechazar</span>
                </button>
              </div>
            ` : `
              <span class="res-processed-text">
                <svg viewBox="0 0 24 24"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .2 4m-.5 5v-5h5"/></svg>
                <span>Procesada el ${new Date(r.createdAt).toLocaleDateString()}</span>
              </span>
            `}
          </div>
        </div>
      `;

      // Botones de accion por reserva.
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
          } catch (e) { console.error(e); }
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
            else alert('Error: ' + (d.error || 'No se pudo rechazar'));
          } catch (e) { console.error(e); }
        };
      }

      listContainer.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(listContainer);

  } catch (e) {
    container.innerHTML = `<div style="color:var(--danger); padding:20px;">Error al conectar: ${e.message}</div>`;
  }
}

async function renderAuditLog(container) {
  container.className = '';
  container.innerHTML = '<div style="padding: 20px;">Cargando historial...</div>';
  try {
    const res = await authFetch(window.API_BASE_URL + '/api/admin/logs?limit=100');
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

const PAGE_GROUPS = [
  { id: 'inicio', title: '🏠 Página de Inicio', prefixes: ['home', 'services'] },
  { id: 'salas', title: '🏢 Salas y Espacios', prefixes: ['salas', 'sala'] },
  { id: 'quiropráctica', title: '💆 Quiropráctica', prefixes: ['quiro'] },
  { id: 'deawakening', title: '✨ DEAwakening', prefixes: ['reso'] },
  { id: 'sobre-nosotros', title: '👥 Sobre Nosotros', prefixes: ['about'] },
  { id: 'contacto', title: '📞 Contacto', prefixes: ['contacto'] },
  { id: 'footer', title: 'Pie de Página', prefixes: ['footer'] }
];

function getPublicTabForKey(tabId) {
  const map = {
    'inicio': 'home',
    'salas': 'salas',
    'quiropráctica': 'quiropractica',
    'deawakening': 'home',
    'sobre-nosotros': 'about',
    'contacto': 'contacto',
    'footer': ''
  };
  return map[tabId] || '';
}

function getSubsection(key) {
  if (key.startsWith('home_hero_')) return 'Sección Hero (Bienvenida)';
  if (key.startsWith('home_glass_')) return 'Caja de Cristal (Filosofía)';
  if (key.startsWith('home_intro_') || key.startsWith('home_stress_')) return 'Introducción al Desequilibrio y Estrés';
  if (key.startsWith('home_cta_')) return 'Sección Final / Llamada a la Acción';
  if (key.startsWith('services_')) return 'Nuestros Servicios Holísticos';
  
  if (key.startsWith('salas_header_')) return 'Configuración General';
  if (key.startsWith('sala_jardin_')) return 'Sala Jardín (Detalles & Tarifas)';
  if (key.startsWith('sala_azul_')) return 'Sala Azul (Detalles & Tarifas)';
  if (key.startsWith('sala_despacho_plus_')) return 'Despacho+ (Detalles & Tarifas)';
  if (key.startsWith('sala_terapia_a_')) return 'Sala Terapia A (Detalles & Tarifas)';
  if (key.startsWith('sala_terapia_b_')) return 'Sala Terapia B (Detalles & Tarifas)';
  if (key.startsWith('sala_comunitaria_')) return 'Sala Comunitaria (Área de Descanso)';
  
  if (key.startsWith('quiro_title') || key.startsWith('quiro_subtitle') || key.startsWith('quiro_intro_') || key.startsWith('quiro_benefits_')) return 'Introducción y Beneficios';
  if (key.startsWith('quiro_integral_') || key.startsWith('quiro_eval_') || key.startsWith('quiro_cta_')) return 'Método y Evaluación';
  if (key.startsWith('quiro_dea_') || key.startsWith('quiro_resosense_')) return 'Técnicas Especiales (DEA & Resosense)';
  
  if (key.startsWith('reso_title') || key.startsWith('reso_subtitle') || key.startsWith('reso_question') || key.startsWith('reso_answer_') || key.startsWith('reso_highlight') || key.startsWith('reso_origen_')) return 'Presentación e Historia';
  if (key.startsWith('reso_benefits_') || key.startsWith('reso_feature') || key.startsWith('reso_training_') || key.startsWith('reso_banner_')) return 'Beneficios y Cursos';
  
  if (key.startsWith('about_')) return 'Sobre Nosotros';
  if (key.startsWith('contacto_')) return 'Información de Contacto y Horarios';
  if (key.startsWith('footer_')) return 'Información del Pie de Página';
  
  return 'Otros Contenidos';
}


function getFriendlyLabel(key) {
  const customLabels = {
    // --- HOME ---
    'home_hero_main': 'Título de Bienvenida (Inicio)',
    'home_hero_sub': 'Subtítulo Principal (Inicio)',
    'home_glass_1': 'Caja Glass - Frase Principal',
    'home_glass_2': 'Caja Glass - Frase Secundaria',
    'home_intro_title': 'Título de Introducción',
    'home_intro_desc': 'Descripción de Introducción',
    'home_stress_1': 'Estrés Físico (Punto de lista)',
    'home_stress_2': 'Estrés Mental (Punto de lista)',
    'home_stress_3': 'Estrés Emocional (Punto de lista)',
    'home_stress_conc': 'Conclusión sobre el Estrés',
    'home_cta_title_alt': 'Título Sección Final (CTA)',
    'home_cta_desc_alt': 'Descripción Sección Final (CTA)',
    'home_cta_deawakening': 'Enlace Deawakening',

    // --- CONTACTO ---
    'contacto_telefono': 'Teléfono de Contacto',
    'contacto_email': 'Correo de Soporte / Dudas',
    'contacto_direccion': 'Dirección del Centro',
    'contacto_horarios_q1': 'Horarios Quiropráctica Grupo 1',
    'contacto_horarios_q2': 'Horarios Quiropráctica Grupo 2',

    // --- QUIROPRÁCTICA ---
    'quiro_title': 'Título de Quiropráctica',
    'quiro_subtitle': 'Lema / Subtítulo Quiropráctica',
    'quiro_intro_1': 'Introducción Quiropráctica (Párrafo 1)',
    'quiro_intro_2': 'Introducción Quiropráctica (Párrafo 2)',
    'quiro_benefits_li1': 'Beneficio Quiropráctica 1',
    'quiro_benefits_li2': 'Beneficio Quiropráctica 2',
    'quiro_benefits_li3': 'Beneficio Quiropráctica 3',
    'quiro_integral_desc': 'Descripción Quiropráctica Integral',
    'quiro_dea_title': 'Título DEA (Deep Energetic Awakening)',
    'quiro_dea_desc': 'Descripción de la Técnica DEA',
    'quiro_dea_extra': 'Invitación / Salud Integral DEA',
    'quiro_resosense_desc': 'Descripción de Resosense',
    'quiro_resosense_extra': 'Complemento Resosense',
    'quiro_eval_desc': 'Descripción Visita de Evaluación',
    'quiro_cta_title': 'Título Llamada a la Acción (Quiro)',
    'quiro_cta_subtitle': 'Subtítulo Llamada a la Acción (Quiro)',

    // --- DEAwakening / RESOSENSE ---
    'reso_title': 'Título Principal Resosense',
    'reso_subtitle': 'Subtítulo Resosense',
    'reso_question': 'Pregunta Inicial',
    'reso_answer_1': 'Respuesta Inicial',
    'reso_highlight': 'Texto Destacado',
    'reso_origen_title': 'Título de Origen / Historia',
    'reso_origen_desc': 'Historia - Parte 1',
    'reso_origen_extra': 'Historia - Parte 2 (Epifanía)',
    'reso_benefits_title': 'Título de Beneficios',
    'reso_feature1_title': 'Beneficio 1 - Título',
    'reso_feature1_desc': 'Beneficio 1 - Descripción',
    'reso_feature2_title': 'Beneficio 2 - Título',
    'reso_feature2_desc': 'Beneficio 2 - Descripción',
    'reso_training_title': 'Título Sección Formación',
    'reso_training_desc': 'Descripción de Formación',
    'reso_training_mod1': 'Módulo Básico (Nombre)',
    'reso_training_mod2': 'Módulo Avanzado (Nombre)',
    'reso_training_format': 'Formato del Curso',
    'reso_training_prof': 'Para Profesionales / Terapeutas',
    'reso_banner_text': 'Texto Banner de Resosense',

    // --- SOBRE NOSOTROS ---
    'about_title': 'Título de la Sección Sobre Nosotros',
    'about_desc': 'Descripción General Sobre Nosotros',
    'about_quiro_title': 'Título Horarios de Quiropráctica',
    'about_salas_title': 'Título de Contacto de Salas',
    'about_salas_coordinator': 'Nombre / Rol del Coordinador',

    // --- SERVICIOS ---
    'services_title': 'Título de la Sección Servicios',
    'services_nsa_title': 'Servicio 1: Título',
    'services_nsa_desc': 'Servicio 1: Descripción',
    'services_reso_title': 'Servicio 2: Título',
    'services_reso_desc': 'Servicio 2: Descripción',
    'services_talleres_title': 'Servicio 3: Título',
    'services_talleres_desc': 'Servicio 3: Descripción',

    // --- SALAS ---
    'salas_header_title': 'Cabecera de Salas: Título',
    'salas_header_subtitle': 'Cabecera de Salas: Subtítulo',

    'sala_jardin_nombre': 'Sala Jardín: Nombre',
    'sala_jardin_dimensiones': 'Sala Jardín: Dimensiones',
    'sala_jardin_capacidad': 'Sala Jardín: Capacidad',
    'sala_jardin_desc': 'Sala Jardín: Descripción de Actividades',
    'sala_jardin_tarifa_hora': 'Sala Jardín: Tarifa por hora',
    'sala_jardin_tarifa_dia': 'Sala Jardín: Tarifa completa por día',
    'sala_jardin_tarifa_bono': 'Sala Jardín: Bono 10 Horas',
    'sala_jardin_tarifa_mensual': 'Sala Jardín: Cuota Mensual',
    'sala_jardin_equipo': 'Sala Jardín: Equipos y Materiales',

    'sala_azul_nombre': 'Sala Azul: Nombre',
    'sala_azul_dimensiones': 'Sala Azul: Dimensiones',
    'sala_azul_capacidad': 'Sala Azul: Capacidad',
    'sala_azul_desc': 'Sala Azul: Descripción de Actividades',
    'sala_azul_tarifa_hora': 'Sala Azul: Tarifa por hora',
    'sala_azul_tarifa_dia': 'Sala Azul: Tarifa completa por día',
    'sala_azul_tarifa_bono': 'Sala Azul: Bono 10 Horas',
    'sala_azul_tarifa_mensual': 'Sala Azul: Cuota Mensual',
    'sala_azul_equipo': 'Sala Azul: Equipos y Materiales',

    'sala_despacho_plus_nombre': 'Despacho+: Nombre',
    'sala_despacho_plus_dimensiones': 'Despacho+: Dimensiones',
    'sala_despacho_plus_capacidad': 'Despacho+: Capacidad',
    'sala_despacho_plus_desc': 'Despacho+: Descripción de Actividades',
    'sala_despacho_plus_tarifa_hora': 'Despacho+: Tarifa por hora',
    'sala_despacho_plus_tarifa_dia': 'Despacho+: Tarifa completa por día',
    'sala_despacho_plus_tarifa_bono': 'Despacho+: Bono 10 Horas',
    'sala_despacho_plus_tarifa_mensual': 'Despacho+: Cuota Mensual',
    'sala_despacho_plus_equipo': 'Despacho+: Equipos y Materiales',

    // --- FOOTER ---
    'footer_link_contrato': 'Footer: Enlace Contrato',
    'footer_link_privacidad': 'Footer: Enlace Privacidad',
    'footer_link_dea': 'Footer: Enlace DEAwakening',
    'footer_desc': 'Footer: Descripción Corta',
    'footer_copyright': 'Footer: Línea de Copyright'
  };

  if (customLabels[key]) return customLabels[key];
  const parts = key.split('_');
  const rawWord = parts.slice(1).join(' ');
  if (!rawWord) return key.toUpperCase();
  return rawWord.charAt(0).toUpperCase() + rawWord.slice(1);
}

function updateFloatingSaveBar() {
  const container = document.getElementById('floating-save-container');
  if (!container) return;

  const pendingKeys = Object.keys(pendingChanges);
  const count = pendingKeys.length;

  if (count === 0) {
    container.innerHTML = '';
    return;
  }

  let bar = document.getElementById('floating-save-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'floating-save-bar';
    bar.className = 'floating-save-bar';
    container.appendChild(bar);
  }

  bar.innerHTML = `
    <div class="save-info">
      <div class="indicator"></div>
      <div>Tienes <strong>${count}</strong> ${count === 1 ? 'cambio pendiente' : 'cambios pendientes'} sin guardar en esta sección.</div>
    </div>
    <button class="btn-floating-save" id="btn-save-all-pending">
      <span>💾</span> Guardar todos los cambios
    </button>
  `;

  document.getElementById('btn-save-all-pending').onclick = async () => {
    const saveBtn = document.getElementById('btn-save-all-pending');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span> Guardando cambios...';

    const promises = pendingKeys.map(async (k) => {
      const item = pendingChanges[k];
      try {
        const resp = await authFetch(window.API_BASE_URL + '/api/content/' + k, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: item.newValue, lang: activeEditLanguage })
        });
        const data = await resp.json();
        if (data.success) {
          item.cardElement.classList.remove('dirty');
          const badge = item.cardElement.querySelector('.dirty-badge');
          if (badge) badge.remove();

          const saveSpan = item.cardElement.querySelector('.status-span-inline');
          if (saveSpan) {
            saveSpan.textContent = '¡Guardado!';
            saveSpan.style.color = 'var(--success)';
            setTimeout(() => { saveSpan.textContent = ''; }, 2500);
          }

          delete pendingChanges[k];
        }
      } catch (err) {
        console.error(`Error guardando ${k}:`, err);
      }
    });

    await Promise.all(promises);

    saveBtn.innerHTML = '<span>✅</span> ¡Todo guardado con éxito!';
    saveBtn.style.background = 'var(--success)';
    saveBtn.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';

    setTimeout(() => {
      updateFloatingSaveBar();
      const searchInput = document.getElementById('content-search');
      loadContentEditor(searchInput?.value || '');
    }, 1500);
  };
}

async function loadContentEditor(searchTerm = '') {
  const container = document.getElementById('editor-container');
  const tabsContainer = document.getElementById('tabs-container');
  try {
    const res = await fetch(window.API_BASE_URL + '/api/content?format=all');
    const content = await res.json();

    // Agrupar campos por categorías de página lógicas
    const keys = Object.keys(content.es || {}).sort();
    const groups = {};
    PAGE_GROUPS.forEach(g => {
      groups[g.id] = [];
    });

    for (const key of keys) {
      const prefix = key.split('_')[0];
      const matchedGroup = PAGE_GROUPS.find(g => g.prefixes.includes(prefix));
      if (matchedGroup) {
        groups[matchedGroup.id].push(key);
      } else {
        // Fallback a inicio si no coincide
        if (!groups['inicio']) groups['inicio'] = [];
        groups['inicio'].push(key);
      }
    }

    tabsContainer.innerHTML = '';

    const setActiveTab = (btn) => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    };

    // --- Pestañas de Contenido Organizadas por Páginas ---
    PAGE_GROUPS.forEach((group) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab-btn';
      tabBtn.innerHTML = `<span>${group.title}</span>`;

      tabBtn.onclick = () => {
        setActiveTab(tabBtn);
        currentActivePrefix = group.id;

        // Sincronizar pestaña en la vista previa lateral en tiempo real
        const targetTab = getPublicTabForKey(group.id);
        if (targetTab) {
          const previewIframe = document.getElementById('customizer-preview-iframe');
          if (previewIframe && previewIframe.contentWindow) {
            previewIframe.contentWindow.postMessage({
              type: 'tab-change',
              tabId: targetTab
            }, '*');
          }
        }

        container.innerHTML = '';
        container.className = 'editor-grid';

        const filteredKeys = groups[group.id].filter((key) => {
          if (!searchTerm) return true;
          const val = content[activeEditLanguage][key] || content.es[key] || '';
          const v = String(val).toLowerCase();
          const k = key.toLowerCase();
          const q = searchTerm.toLowerCase();
          return k.includes(q) || v.includes(q);
        });

        if (filteredKeys.length === 0) {
          container.innerHTML = '<div style="padding:24px; color:var(--text-muted); grid-column: 1 / -1; text-align: center;">Sin resultados en esta sección.</div>';
          return;
        }

        // Agrupar las llaves por sub-secciones para pintarlas ordenadamente con encabezados
        const subsectionMap = {};
        filteredKeys.forEach(key => {
          const sub = getSubsection(key);
          if (!subsectionMap[sub]) subsectionMap[sub] = [];
          subsectionMap[sub].push(key);
        });

        // Pintar secciones ordenadas
        for (const [subName, subKeys] of Object.entries(subsectionMap)) {
          // Encabezado visual de la subsección (spans the entire grid)
          const header = document.createElement('div');
          header.className = 'subsection-header';
          header.innerHTML = `<span>${subName}</span>`;
          container.appendChild(header);

          // Campos correspondientes
          for (const key of subKeys) {
            const val = content[activeEditLanguage][key] || '';
            const spanishVal = content.es[key] || '';
            const isUrl = (val && (val.startsWith('/uploads/') || val.startsWith('http'))) || 
                          (spanishVal && (spanishVal.startsWith('/uploads/') || spanishVal.startsWith('http')));
            const itemDiv = doItemDiv(key, val, isUrl, spanishVal);
            container.appendChild(itemDiv);
          }
        }
      };

      tabsContainer.appendChild(tabBtn);
    });

    // Auto-seleccionar pestaña activa
    if (PAGE_GROUPS.length > 0) {
      let tabToClick = tabsContainer.firstChild;
      if (currentActivePrefix) {
        const index = PAGE_GROUPS.findIndex(g => g.id === currentActivePrefix);
        if (index !== -1) tabToClick = tabsContainer.childNodes[index];
      }
      if (tabToClick) tabToClick.click();
    }

    // Refresh floating bar if there are any lingering edits in memory
    updateFloatingSaveBar();

  } catch (error) {
    container.innerHTML = '<p style="color:var(--danger); padding:24px; text-align:center;">Error al cargar los contenidos desde el API.</p>';
  }
}

// Función auxiliar para pintar un campo individual
function doItemDiv(key, val, isUrl, spanishVal) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item-editor-card';

  const hasPending = pendingChanges[key] !== undefined;
  const currentVal = hasPending ? pendingChanges[key].newValue : val;

  if (hasPending) {
    itemDiv.classList.add('dirty');
  }

  // Header/Title with human-friendly label
  const labelWrapper = document.createElement('div');
  labelWrapper.style.display = 'flex';
  labelWrapper.style.justifyContent = 'space-between';
  labelWrapper.style.alignItems = 'center';
  labelWrapper.style.marginBottom = '12px';
  labelWrapper.style.gap = '8px';

  const label = document.createElement('label');
  label.textContent = getFriendlyLabel(key);
  label.style.fontWeight = '700';
  label.style.color = 'var(--text-main)';
  label.style.fontSize = '14px';
  label.style.letterSpacing = '0.5px';
  labelWrapper.appendChild(label);

  // Technical key display (small, muted)
  const keyDisplay = document.createElement('span');
  keyDisplay.textContent = key;
  keyDisplay.style.fontSize = '10px';
  keyDisplay.style.color = 'var(--text-muted)';
  keyDisplay.style.fontFamily = 'monospace';
  labelWrapper.appendChild(keyDisplay);

  itemDiv.appendChild(labelWrapper);

  if (hasPending) {
    const dirtyBadge = document.createElement('div');
    dirtyBadge.className = 'dirty-badge';
    dirtyBadge.innerHTML = '⚠️ Cambios sin guardar';
    itemDiv.appendChild(dirtyBadge);
  }

  if (isUrl) {
    const previewWrapper = document.createElement('div');
    previewWrapper.className = 'inline-image-uploader';

    previewWrapper.innerHTML = `
      <div class="inline-image-preview-wrapper">
        <img class="inline-image-preview" src="${currentVal || spanishVal}" id="img-preview-${key}">
        <div class="inline-image-upload-controls">
          <label class="btn-upload-trigger">
            <span>📁</span> Seleccionar Imagen
            <input type="file" accept="image/*" id="file-input-${key}">
          </label>
          <span style="font-size:11px; color:var(--text-muted); text-align:center;" id="file-name-${key}">Ningún archivo seleccionado</span>
          <button class="btn-primary-admin btn-inline-upload" id="btn-upload-${key}" style="display:none; padding:8px 12px; font-size:12px; margin-top:4px; align-items:center; justify-content:center; gap:6px;">
            🚀 Subir Imagen
          </button>
        </div>
      </div>
      <div id="upload-status-${key}" style="font-size:12px; font-weight:600; margin-top:8px;"></div>
    `;

    previewWrapper.onmouseenter = () => {
      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'highlight-element',
          key: key
        }, '*');
      }
    };

    previewWrapper.onmouseleave = () => {
      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'clear-highlight'
        }, '*');
      }
    };

    previewWrapper.onclick = () => {
      const targetTab = getPublicTabForKey(key);
      if (targetTab) {
        const previewIframe = document.getElementById('customizer-preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'tab-change',
            tabId: targetTab
          }, '*');
        }
      }
    };

    itemDiv.appendChild(previewWrapper);

    // Set up listeners for the file selection and upload
    setTimeout(() => {
      const fileInput = document.getElementById(`file-input-${key}`);
      const fileNameSpan = document.getElementById(`file-name-${key}`);
      const uploadBtn = document.getElementById(`btn-upload-${key}`);
      const statusDiv = document.getElementById(`upload-status-${key}`);
      const imgPreview = document.getElementById(`img-preview-${key}`);

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            fileNameSpan.textContent = file.name;
            uploadBtn.style.display = 'inline-flex';

            // Show local preview before upload
            const reader = new FileReader();
            reader.onload = (event) => {
              imgPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
          } else {
            fileNameSpan.textContent = 'Ningún archivo seleccionado';
            uploadBtn.style.display = 'none';
          }
        });
      }

      if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
          const file = fileInput.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append('key', key);
          formData.append('image', file);

          statusDiv.style.color = 'var(--text-muted)';
          statusDiv.textContent = 'Subiendo...';
          uploadBtn.disabled = true;

          try {
            const resp = await fetch(window.API_BASE_URL + '/api/upload', {
              method: 'POST',
              headers: buildAuthHeaders(),
              body: formData
            });
            const data = await resp.json();

            if (data.success) {
              statusDiv.style.color = 'var(--success)';
              statusDiv.textContent = '✅ ¡Imagen subida y guardada!';
              uploadBtn.style.display = 'none';
              imgPreview.src = data.url;

              // Actualizar vista previa en tiempo real
              const previewIframe = document.getElementById('customizer-preview-iframe');
              if (previewIframe && previewIframe.contentWindow) {
                previewIframe.contentWindow.postMessage({
                  type: 'content-update',
                  key: key,
                  value: data.url,
                  lang: activeEditLanguage
                }, '*');
              }

              setTimeout(() => {
                statusDiv.textContent = '';
                loadContentEditor(document.getElementById('content-search')?.value || '');
              }, 2000);
            } else {
              statusDiv.style.color = 'var(--danger)';
              statusDiv.textContent = data.message || 'Error al subir';
              uploadBtn.disabled = false;
            }
          } catch (err) {
            statusDiv.style.color = 'var(--danger)';
            statusDiv.textContent = 'Error de red al subir la imagen';
            uploadBtn.disabled = false;
          }
        });
      }
    }, 0);

  } else {
    // Determinar si usar input o textarea basado en el largo del texto español (como referencia) o el actual
    const refText = spanishVal || '';
    const inputType = (refText.length > 60 || refText.includes('\n') || refText.includes('\\n') || val.length > 60 || val.includes('\n') || val.includes('\\n')) ? 'textarea' : 'input';
    const field = document.createElement(inputType);
    field.placeholder = activeEditLanguage !== 'es' ? `Traducción al ${activeEditLanguage.toUpperCase()}...` : 'Escribe el texto en español...';
    
    // Si estamos editando un idioma diferente al español, mostramos una pequeña referencia del texto original en español
    if (activeEditLanguage !== 'es' && refText) {
      const refDiv = document.createElement('div');
      refDiv.style.fontSize = '12px';
      refDiv.style.color = 'var(--text-muted)';
      refDiv.style.marginBottom = '8px';
      refDiv.style.padding = '8px 12px';
      refDiv.style.background = 'rgba(255, 255, 255, 0.03)';
      refDiv.style.borderRadius = '6px';
      refDiv.style.borderLeft = '3px solid var(--accent-light)';
      refDiv.style.whiteSpace = 'pre-wrap';
      refDiv.innerHTML = `<span style="font-weight: 700; color: var(--accent-light); font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 2px;">Texto Original (Español)</span>${refText}`;
      
      itemDiv.appendChild(refDiv);
    }
    if (inputType === 'textarea') {
      field.value = currentVal;
      field.style.minHeight = '90px';
      field.style.resize = 'vertical';
    } else {
      field.type = 'text';
      field.value = currentVal;
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

      // Auto-navegación a la pestaña pública de la vista previa
      const targetTab = getPublicTabForKey(key);
      if (targetTab) {
        const previewIframe = document.getElementById('customizer-preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'tab-change',
            tabId: targetTab
          }, '*');
        }
      }

      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'highlight-element',
          key: key
        }, '*');
      }
    };

    field.onblur = () => {
      if (!itemDiv.classList.contains('dirty')) {
        field.style.borderColor = 'var(--border-color)';
      }
      field.style.background = 'var(--bg-surface)';
      field.style.boxShadow = 'none';

      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'clear-highlight'
        }, '*');
      }
    };

    field.onmouseenter = () => {
      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'highlight-element',
          key: key
        }, '*');
      }
    };

    field.onmouseleave = () => {
      // Evitar limpiar si el elemento está enfocado actualmente
      if (document.activeElement === field) return;
      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'clear-highlight'
        }, '*');
      }
    };

    // Live change tracking ("dirty" state)
    const handleInput = () => {
      const inputVal = field.value;
      if (inputVal !== val) {
        if (!itemDiv.classList.contains('dirty')) {
          itemDiv.classList.add('dirty');
          if (!itemDiv.querySelector('.dirty-badge')) {
            const badge = document.createElement('div');
            badge.className = 'dirty-badge';
            badge.innerHTML = '⚠️ Cambios sin guardar';
            itemDiv.insertBefore(badge, itemDiv.childNodes[1]);
          }
        }
        pendingChanges[key] = {
          newValue: inputVal,
          originalValue: val,
          fieldElement: field,
          cardElement: itemDiv
        };
      } else {
        itemDiv.classList.remove('dirty');
        const badge = itemDiv.querySelector('.dirty-badge');
        if (badge) badge.remove();
        delete pendingChanges[key];
      }

      updateFloatingSaveBar();

      // Actualizar vista previa en tiempo real
      const previewIframe = document.getElementById('customizer-preview-iframe');
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.postMessage({
          type: 'content-update',
          key: key,
          value: inputVal,
          lang: activeEditLanguage
        }, '*');
      }
    };

    field.addEventListener('input', handleInput);

    // Individual save button (as fallback or quick action)
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.alignItems = 'center';
    btnRow.style.gap = '12px';
    btnRow.style.marginTop = '16px';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar';
    saveBtn.className = 'btn-primary-admin';
    saveBtn.style.width = 'auto';
    saveBtn.style.padding = '8px 18px';
    saveBtn.style.fontSize = '12px';
    saveBtn.style.letterSpacing = '0.5px';
    saveBtn.style.margin = '0';

    const statusSpan = document.createElement('span');
    statusSpan.className = 'status-span-inline';
    statusSpan.style.fontSize = '12px';
    statusSpan.style.fontWeight = '600';

    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      statusSpan.textContent = 'Guardando...';
      statusSpan.style.color = 'var(--text-muted)';

      try {
        const resp = await authFetch(window.API_BASE_URL + '/api/content/' + key, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value: field.value, lang: activeEditLanguage })
        });
        const data = await resp.json();

        if (data.success) {
          statusSpan.textContent = '¡Guardado!';
          statusSpan.style.color = 'var(--success)';

          itemDiv.classList.remove('dirty');
          const badge = itemDiv.querySelector('.dirty-badge');
          if (badge) badge.remove();
          delete pendingChanges[key];

          val = field.value;

          updateFloatingSaveBar();
          setTimeout(() => {
            statusSpan.textContent = '';
            saveBtn.disabled = false;
          }, 2000);
        } else {
          statusSpan.textContent = data.message || 'Error';
          statusSpan.style.color = 'var(--danger)';
          saveBtn.disabled = false;
        }
      } catch (err) {
        statusSpan.textContent = 'Error de red';
        statusSpan.style.color = 'var(--danger)';
        saveBtn.disabled = false;
      }
    });

    btnRow.appendChild(saveBtn);
    btnRow.appendChild(statusSpan);
    itemDiv.appendChild(field);
    itemDiv.appendChild(btnRow);
  }
  return itemDiv;
}

async function init() {
  // Añadimos una keyframe rápida para animar pestañas si no existe
  if (!document.getElementById('admin-styles-addons')) {
    const st = document.createElement('style');
    st.id = 'admin-styles-addons';
    st.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(st);
  }

  const wrapper = document.getElementById('admin-app');
  try {
    const response = await authFetch(window.API_BASE_URL + '/api/auth/session');
    const session = await response.json();

    if (session.success) {
      renderDashboard(wrapper);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  window.location.href = '/';
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
      const resp = await fetch(window.API_BASE_URL + '/api/chat', {
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

  const btnreservas = document.querySelector(".btn-new-reserva");
  btnreservas.addEventListener("click", function () {
    const nuevaReserva = document.createElement("div");
    nuevaReserva.className = "booking-form-wrapper";
    nuevaReserva.innerHTML = `
      <div class="booking-form-card">
        <div class="booking-header">
          <h2>Nueva Reserva</h2>
          <button class="btn-close-booking">×</button>
        </div>

        <form id="new-booking-form" class="booking-form">
          <div class="form-row-2">
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" id="b-date" value="2026-06-01" required>
            </div>
            <div class="form-group">
              <label>Tipo de Sala</label>
              <select id="b-room-type" required>
                <option value="Sala Jardín (G1)" selected>Sala Jardín (G1)</option>
                <option value="Sala Azul (G2)">Sala Azul (G2)</option>
                <option value="Despacho+">Despacho+</option>
                <option value="Sala Terapia A">Sala Terapia A</option>
                <option value="Sala Terapia B">Sala Terapia B</option>
                <option value="Sala Comunitaria">Sala Comunitaria</option>
              </select>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Tipo de Alquiler / Plan</label>
              <select id="b-rent-type" required>
                <option value="hourly" selected>Por Horas</option>
                <option value="daily">Por Días Completos</option>
                <option value="prepago">Bono Prepago (Horas sueltas)</option>
                <option value="fijo">Plan Fijo Semanal (Cuota Mensual)</option>
              </select>
            </div>
            <div class="form-group">
              <label id="b-qty-label">Cantidad (Horas)</label>
              <div id="b-qty-container">
                <input type="number" id="b-rent-qty" value="1" min="1" step="1" required style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
              </div>
            </div>
          </div>

          <div id="b-schedule-section" class="form-group">
            <!-- Renders dynamically: live slots grid OR custom schedule text input -->
          </div>

          <div class="form-group" style="background: rgba(99, 102, 241, 0.08); padding: 14px; border-radius: 8px; border: 1px solid rgba(99, 102, 241, 0.2); margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">Total Calculado:</span>
              <span id="b-price-display" style="font-weight: 700; font-size: 1.25rem; color: var(--accent);">0.00€</span>
            </div>
            <div id="b-price-details" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Tarifa base: 0€</div>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; user-select: none; color: var(--text-main);">
              <input type="checkbox" id="b-price-override-toggle" style="width:auto;">
              <span>Establecer Precio Personalizado</span>
            </label>
            <div id="b-price-override-container" style="display: none; margin-top: 8px;">
              <input type="number" id="b-price-override-val" placeholder="0.00" min="0" step="0.01" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Cliente</label>
              <input type="text" id="b-guest-name" placeholder="Nombre del Cliente" value="sergi vanrell" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="b-guest-email" placeholder="ejemplo@correo.com" value="ergivanrellquevedo14@gmail.com">
            </div>
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" id="b-guest-phone" placeholder="600000000" value="640340072">
          </div>

          <div id="booking-error-msg" style="color: var(--danger); font-size: 14px; margin-top: 8px; display: none;"></div>
          <button type="submit" class="btn-primary-admin" style="width:100%; margin-top:16px;">Reservar</button>
        </form>
      </div>
    `;
    document.body.appendChild(nuevaReserva);

    let selectedSlots = [];

    const getSalaId = (roomName) => {
      if (roomName.includes('G1') || roomName.includes('Jardín')) return 'jardin';
      if (roomName.includes('G2') || roomName.includes('Azul')) return 'azul';
      if (roomName.includes('Despacho+')) return 'despacho-plus';
      if (roomName.includes('Terapia A')) return 'terapia-a';
      if (roomName.includes('Terapia B')) return 'terapia-b';
      if (roomName.includes('Comunitaria')) return 'comunitaria';
      return roomName;
    };

    const recalculatePrice = () => {
      const room = document.querySelector("#b-room-type").value;
      const rentType = document.querySelector("#b-rent-type").value;
      const qtyEl = document.querySelector("#b-rent-qty");
      if (!qtyEl) return;
      const qty = parseInt(qtyEl.value) || 0;

      let category = '';
      if (room.includes('G1') || room.includes('G2') || room.includes('Jardín') || room.includes('Azul')) {
        category = 'g1_g2';
      } else if (room.includes('Despacho+')) {
        category = 'despacho';
      } else if (room.includes('Terapia')) {
        category = 'terapia';
      }

      if (!category) {
        document.querySelector("#b-price-display").textContent = "0.00€";
        document.querySelector("#b-price-details").textContent = "Sin tarifa aplicable para esta sala.";
        return;
      }

      const rates = {
        g1_g2: {
          hourly: 20,
          daily: { 1: 120, 2: 220, 3: 300 },
          prepago: { 10: 150, 20: 260, 30: 330 },
          fijo: { 1: 60, 2: 110, 3: 150, 4: 180, 5: 210, extra: 40 }
        },
        despacho: {
          hourly: 16,
          daily: { 1: 90, 2: 160 },
          prepago: { 10: 140, 20: 240, 30: 300 },
          fijo: { 1: 55, 2: 100, 3: 135, 4: 160, 5: 190, extra: 35 }
        },
        terapia: {
          hourly: 12,
          daily: { 1: 70, 2: 120 },
          prepago: { 10: 110, 20: 200, 30: 270 },
          fijo: { 1: 50, 2: 90, 3: 120, 4: 145, 5: 165, extra: 30 }
        }
      };

      const c = rates[category];
      let price = 0;
      let details = '';

      if (rentType === 'hourly') {
        price = qty * c.hourly;
        details = `${c.hourly}€ / hora × ${qty} horas`;
      } else if (rentType === 'daily') {
        if (c.daily[qty]) {
          price = c.daily[qty];
          details = `Paquete de ${qty} día(s) completo(s)`;
        } else {
          const maxDays = Object.keys(c.daily).length;
          const basePrice = c.daily[maxDays];
          const extraRate = category === 'g1_g2' ? 100 : (category === 'despacho' ? 80 : 60);
          const extraDays = qty - maxDays;
          price = basePrice + (extraDays * extraRate);
          details = `Paquete ${maxDays}d (${basePrice}€) + ${extraDays}d extra a ${extraRate}€/d`;
        }
      } else if (rentType === 'prepago') {
        price = c.prepago[qty] || 0;
        details = `Bono prepago de ${qty} horas (no regulares)`;
      } else if (rentType === 'fijo') {
        if (qty < 6) {
          price = c.fijo[qty] || 0;
          details = `Plan regular de ${qty}h / semana (Cuota Mensual)`;
        } else {
          price = qty * c.fijo.extra;
          details = `${qty}h/semana × ${c.fijo.extra}€ (Cuota Mensual reducida para ≥ 6h/sem)`;
        }
      }

      document.querySelector("#b-price-display").textContent = `${price.toFixed(2)}€`;
      document.querySelector("#b-price-details").textContent = details;
    };

    const fetchAvailabilitySlots = async () => {
      const room = document.querySelector("#b-room-type").value;
      const fecha = document.querySelector("#b-date").value;
      const loader = document.querySelector("#b-slots-loader");
      const container = document.querySelector("#b-slots-container");
      
      if (!room || !fecha || !loader || !container) return;

      loader.style.display = "block";
      container.innerHTML = "";
      selectedSlots = [];

      const salaId = getSalaId(room);

      try {
        const res = await fetch(`/api/reservas/disponibilidad?salaId=${salaId}&fecha=${fecha}`);
        const data = await res.json();
        
        loader.style.display = "none";
        container.innerHTML = "";

        if (data.success && data.slots) {
          data.slots.forEach(slot => {
            const isSelected = selectedSlots.includes(slot.time);
            const slotEl = document.createElement("div");
            slotEl.className = `admin-time-slot admin-slot-${slot.status} ${isSelected ? 'selected' : slot.status === 'free' ? 'free' : 'busy'}`;
            slotEl.textContent = slot.time;
            
            if (slot.status === 'free') {
              slotEl.onclick = () => {
                const idx = selectedSlots.indexOf(slot.time);
                if (idx > -1) {
                  selectedSlots.splice(idx, 1);
                  slotEl.classList.remove("selected");
                  slotEl.classList.add("free");
                } else {
                  selectedSlots.push(slot.time);
                  slotEl.classList.remove("free");
                  slotEl.classList.add("selected");
                }
                
                // Si el alquiler es por horas, ajustar cantidad automáticamente
                const rentType = document.querySelector("#b-rent-type").value;
                if (rentType === 'hourly') {
                  const qtyEl = document.querySelector("#b-rent-qty");
                  if (qtyEl) {
                    qtyEl.value = selectedSlots.length;
                  }
                }

                recalculatePrice();
              };
            }

            container.appendChild(slotEl);
          });
        } else {
          container.innerHTML = `<div style="grid-column: span 4; color: var(--danger); font-size: 0.85rem;">Error al cargar disponibilidad de la sala.</div>`;
        }
      } catch (err) {
        console.error(err);
        loader.style.display = "none";
        container.innerHTML = `<div style="grid-column: span 4; color: var(--danger); font-size: 0.85rem;">Error de red al cargar disponibilidad.</div>`;
      }
      recalculatePrice();
    };

    const updateQtyControl = () => {
      const rentType = document.querySelector("#b-rent-type").value;
      const qtyContainer = document.querySelector("#b-qty-container");
      const qtyLabel = document.querySelector("#b-qty-label");
      const scheduleSection = document.querySelector("#b-schedule-section");

      if (!qtyContainer || !qtyLabel || !scheduleSection) return;

      // 1. Configurar sección de horario / grid según plan
      if (rentType === 'hourly') {
        scheduleSection.innerHTML = `
          <label>Horario (Selección interactiva en el grid)</label>
          <div id="b-slots-loader" style="font-size: 0.85rem; color: var(--text-muted); display: none; margin-bottom: 8px;">Cargando horarios disponibles...</div>
          <div id="b-slots-container" class="admin-slots-grid"></div>
        `;
        
        qtyLabel.textContent = "Cantidad (Horas)";
        qtyContainer.innerHTML = `<input type="number" id="b-rent-qty" value="${selectedSlots.length}" min="1" step="1" required readonly style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.03); color: var(--text-muted); cursor: not-allowed;">`;
        
        fetchAvailabilitySlots();
      } else {
        selectedSlots = [];
        
        if (rentType === 'daily') {
          qtyLabel.textContent = "Cantidad (Días)";
          qtyContainer.innerHTML = `<input type="number" id="b-rent-qty" value="1" min="1" step="1" required style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">`;
          
          scheduleSection.innerHTML = `
            <label>Detalles del Alquiler</label>
            <select id="b-time-custom" style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
              <option value="Todo el día (9:00 a 21:00)" selected>Todo el día (9:00 a 21:00)</option>
              <option value="Media Jornada - Mañana (9:00 a 15:00)">Media Jornada - Mañana (9:00 a 15:00)</option>
              <option value="Media Jornada - Tarde (15:00 a 21:00)">Media Jornada - Tarde (15:00 a 21:00)</option>
            </select>
          `;
        } else if (rentType === 'prepago') {
          qtyLabel.textContent = "Tipo de Bono";
          qtyContainer.innerHTML = `
            <select id="b-rent-qty" style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
              <option value="10" selected>Bono 10 Horas</option>
              <option value="20">Bono 20 Horas</option>
              <option value="30">Bono 30 Horas</option>
            </select>
          `;
          
          scheduleSection.innerHTML = `
            <label>Detalles del Bono</label>
            <select id="b-time-custom" style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.03); color: var(--text-muted); pointer-events: none;" readonly>
              <option value="Bono Prepago - 10 Horas" selected>Bono Prepago - 10 Horas</option>
              <option value="Bono Prepago - 20 Horas">Bono Prepago - 20 Horas</option>
              <option value="Bono Prepago - 30 Horas">Bono Prepago - 30 Horas</option>
            </select>
          `;
          
          const syncPrepago = () => {
            const qtyVal = document.querySelector("#b-rent-qty").value;
            const customEl = document.querySelector("#b-time-custom");
            if (customEl) {
              customEl.value = `Bono Prepago - ${qtyVal} Horas`;
            }
          };
          
          qtyContainer.querySelector("#b-rent-qty").addEventListener("change", syncPrepago);
          syncPrepago();
        } else if (rentType === 'fijo') {
          qtyLabel.textContent = "Horas por Semana";
          qtyContainer.innerHTML = `
            <select id="b-rent-qty" style="width:100%; box-sizing:border-box; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
              <option value="1" selected>1 hora / semana</option>
              <option value="2">2 horas / semana</option>
              <option value="3">3 horas / semana</option>
              <option value="4">4 horas / semana</option>
              <option value="5">5 horas / semana</option>
              <option value="6">6 horas / semana</option>
              <option value="7">7 horas / semana</option>
              <option value="8">8 horas / semana</option>
            </select>
          `;
          
          scheduleSection.innerHTML = `
            <label>Horario Fijo Semanal</label>
            <div style="display: flex; gap: 8px; margin-top: 4px; align-items: center;">
              <select id="b-fijo-day" style="flex: 1.2; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
                <option value="Lunes" selected>Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
              <select id="b-fijo-start" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);">
                <option value="9:00" selected>09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
              </select>
              <span style="color: var(--text-muted); font-size: 0.85rem;">a</span>
              <select id="b-fijo-end" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.03); color: var(--text-muted); pointer-events: none;" readonly>
                <option value="10:00" selected>10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
                <option value="21:00">21:00</option>
              </select>
            </div>
          `;
          
          const syncFijoEnd = () => {
            const qtyVal = parseInt(document.querySelector("#b-rent-qty").value) || 1;
            const startVal = document.querySelector("#b-fijo-start").value;
            const [startH] = startVal.split(':').map(Number);
            let endH = startH + qtyVal;
            if (endH > 21) endH = 21; // límite del centro
            const endEl = document.querySelector("#b-fijo-end");
            if (endEl) {
              endEl.value = `${endH}:00`;
            }
          };
          
          qtyContainer.querySelector("#b-rent-qty").addEventListener("change", syncFijoEnd);
          scheduleSection.querySelector("#b-fijo-start").addEventListener("change", syncFijoEnd);
          syncFijoEnd();
        }

        const newQtyEl = document.querySelector("#b-rent-qty");
        newQtyEl.addEventListener("change", recalculatePrice);
        newQtyEl.addEventListener("input", recalculatePrice);
        
        recalculatePrice();
      }
    };

    document.querySelector("#b-rent-type").addEventListener("change", updateQtyControl);
    
    // Escuchar cambios de fecha o sala para recargar el grid interactivo
    document.querySelector("#b-date").addEventListener("change", () => {
      const rentType = document.querySelector("#b-rent-type").value;
      if (rentType === 'hourly') {
        fetchAvailabilitySlots();
      }
    });

    document.querySelector("#b-room-type").addEventListener("change", () => {
      const rentType = document.querySelector("#b-rent-type").value;
      if (rentType === 'hourly') {
        fetchAvailabilitySlots();
      } else {
        recalculatePrice();
      }
    });

    // Initial setup
    updateQtyControl();

    // Toggle override
    const overrideToggle = document.querySelector("#b-price-override-toggle");
    const overrideContainer = document.querySelector("#b-price-override-container");
    overrideToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        overrideContainer.style.display = "block";
      } else {
        overrideContainer.style.display = "none";
      }
    });

    const btn_close_looking = nuevaReserva.querySelector(".btn-close-booking");
    btn_close_looking.addEventListener("click", (e) => {
      e.preventDefault();
      nuevaReserva.remove();
    });

    const bookingForm = nuevaReserva.querySelector("#new-booking-form");
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fecha = document.querySelector("#b-date").value;
      const sala = document.querySelector("#b-room-type").value;
      const nombre = document.querySelector("#b-guest-name").value;
      const email = document.querySelector("#b-guest-email").value.trim();
      const telefono = document.querySelector("#b-guest-phone").value.trim();
      const rentType = document.querySelector("#b-rent-type").value;

      const errorMsgDiv = document.querySelector("#booking-error-msg");
      errorMsgDiv.style.display = "none";

      let horarioFinal = '';
      if (rentType === 'hourly') {
        if (selectedSlots.length === 0) {
          errorMsgDiv.textContent = 'Por favor, selecciona al menos un horario en el grid.';
          errorMsgDiv.style.display = "block";
          return;
        }
        // Formatear array a string separado por comas
        horarioFinal = selectedSlots.join(', ');
      } else if (rentType === 'fijo') {
        const dayEl = document.querySelector("#b-fijo-day");
        const startEl = document.querySelector("#b-fijo-start");
        const endEl = document.querySelector("#b-fijo-end");
        if (dayEl && startEl && endEl) {
          horarioFinal = `${dayEl.value} de ${startEl.value} a ${endEl.value}`;
        } else {
          horarioFinal = 'Plan Fijo Semanal';
        }
      } else {
        const customTimeEl = document.querySelector("#b-time-custom");
        horarioFinal = customTimeEl ? customTimeEl.value.trim() : '';
        if (!horarioFinal) {
          errorMsgDiv.textContent = 'Por favor, selecciona los detalles del horario o plan.';
          errorMsgDiv.style.display = "block";
          return;
        }
      }

      // Determinar precio final
      let precioFinal = 0;
      if (overrideToggle.checked) {
        precioFinal = parseFloat(document.querySelector("#b-price-override-val").value) || 0;
      } else {
        const priceStr = document.querySelector("#b-price-display").textContent;
        precioFinal = parseFloat(priceStr.replace("€", "")) || 0;
      }

      // Combinar email y telefono para guardarlos en "contacto"
      let contacto = '';
      if (email && telefono) {
        contacto = `${email}, ${telefono}`;
      } else if (email) {
        contacto = email;
      } else if (telefono) {
        contacto = telefono;
      }

      const submitBtn = bookingForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Procesando...";

      try {
        const response = await fetch(window.API_BASE_URL + '/api/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre,
            sala,
            fecha,
            horario: horarioFinal,
            contacto,
            estado: 'pendiente',
            precio: precioFinal
          })
        });

        const data = await response.json();

        if (data.success) {
          // Cerrar modal/popup
          nuevaReserva.remove();
          // Recargar la lista de reservas si el contenedor está activo en pantalla
          const mainContent = document.getElementById('admin-main-content');
          const topbarTitle = document.getElementById('topbar-title');
          if (topbarTitle && topbarTitle.textContent === 'Reservas') {
            renderReservations(mainContent);
          }
        } else {
          errorMsgDiv.textContent = data.error || 'Error al guardar la reserva';
          errorMsgDiv.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.textContent = "Reservar";
        }
      } catch (err) {
        console.error(err);
        errorMsgDiv.textContent = 'Error de conexión con el servidor';
        errorMsgDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Reservar";
      }
    });
  });
}

init();
