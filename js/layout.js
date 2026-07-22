// Sidebar and Topbar HTML template
function renderSidebar() {
  const user = getUser() || {};
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <img src="img/logo_unopar.png" alt="LEAC" class="sidebar-logo-img"
        onerror="this.outerHTML='<span style=\'font-size:2rem;\'>🔬</span>'">
      <div class="sidebar-logo-text">
        <h2>LEAC · UNOPAR</h2>
        <span>Lab. Análises Clínicas</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <span class="nav-section-title">Principal</span>
      <div class="nav-item" data-page="dashboard" onclick="navTo('dashboard.html')">
        <span class="nav-item-icon">📊</span>
        <span>Dashboard</span>
      </div>

      <span class="nav-section-title">Atendimento</span>
      <div class="nav-item" data-page="requisicoes" onclick="navTo('requisicoes.html')">
        <span class="nav-item-icon">📋</span>
        <span>Requisições</span>
      </div>
      <div class="nav-item" data-page="pacientes" onclick="navTo('pacientes.html')">
        <span class="nav-item-icon">👥</span>
        <span>Pacientes</span>
      </div>
      <div class="nav-item" data-page="laudos" onclick="navTo('laudos.html')">
        <span class="nav-item-icon">📄</span>
        <span>Laudos</span>
      </div>

      <span class="nav-section-title">Configuração</span>
      <div class="nav-item" data-page="exames" onclick="navTo('exames.html')">
        <span class="nav-item-icon">🧪</span>
        <span>Catálogo de Exames</span>
      </div>
      <div class="nav-item" data-page="profissionais" onclick="navTo('profissionais.html')">
        <span class="nav-item-icon">👨‍⚕️</span>
        <span>Profissionais</span>
      </div>
      <div class="nav-item" data-page="convenios" onclick="navTo('convenios.html')">
        <span class="nav-item-icon">🏥</span>
        <span>Convênios</span>
      </div>

      <span class="nav-section-title">Gestão</span>
      <div class="nav-item" data-page="relatorios" onclick="navTo('relatorios.html')">
        <span class="nav-item-icon">📈</span>
        <span>Relatórios</span>
      </div>
      <div class="nav-item" data-page="usuarios" data-role="admin" onclick="navTo('usuarios.html')">
        <span class="nav-item-icon">🔑</span>
        <span>Usuários</span>
      </div>
      <div class="nav-item" data-page="lgpd" onclick="navTo('lgpd.html')">
        <span class="nav-item-icon">🛡️</span>
        <span>LGPD & Privacidade</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar" id="userAvatar">A</div>
        <div class="user-details">
          <div class="user-name" id="userName">Usuário</div>
          <div class="user-role" id="userRole">Papel</div>
        </div>
        <button class="btn-logout" onclick="logout()" title="Sair do sistema">🚪</button>
      </div>
    </div>
  </aside>`;
}

function renderTopbar(title, subtitle = '') {
  return `
  <header class="topbar">
    <div class="topbar-left">
      <div>
        <div class="topbar-title">${title}</div>
        ${subtitle ? `<div class="topbar-subtitle">${subtitle}</div>` : ''}
      </div>
    </div>
    <div class="topbar-right">
      <div class="topbar-time" id="topbarTime"></div>
      <span style="font-size:0.82rem; color:var(--text-secondary);">
        Olá, <strong id="topbarUser" style="color:var(--accent-light);"></strong>
      </span>
    </div>
  </header>`;
}

function navTo(page) {
  window.location.href = page;
}
