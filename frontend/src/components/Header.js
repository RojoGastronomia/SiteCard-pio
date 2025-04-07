class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="/">Rojo Gastronomia</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" aria-controls="navbarNav" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" href="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/cardapios.html">Cardápios</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/eventos.html">Eventos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/contact.html">Contato</a>
              </li>
              <li class="nav-item">
                <button id="cartBtn" class="nav-link position-relative">
                  <i class="ri-shopping-cart-line"></i>
                  <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger hidden">
                    0
                  </span>
                </button>
              </li>
              <li class="nav-item" id="login-btn">
                <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
              </li>
              <li class="nav-item d-none" id="dashboard-btn">
                <a class="nav-link" href="/dashboard.html">Dashboard</a>
              </li>
              <li class="nav-item d-none" id="logout-btn">
                <a class="nav-link" href="#">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    `;

    // Check authentication status
    this.updateAuthUI();
  }

  updateAuthUI() {
    const token = localStorage.getItem('auth_token');
    const loginBtn = document.getElementById('login-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
      loginBtn.classList.add('d-none');
      dashboardBtn.classList.remove('d-none');
      logoutBtn.classList.remove('d-none');
      
      // Add logout event listener
      document.querySelector('#logout-btn a').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      });
    } else {
      loginBtn.classList.remove('d-none');
      dashboardBtn.classList.add('d-none');
      logoutBtn.classList.add('d-none');
    }
  }
}

customElements.define('app-header', Header); 