class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <h5>Rojo Gastronomia</h5>
              <p>Cardápio micro - Sistema de gestão de menus para restaurantes.</p>
            </div>
            <div class="col-md-4">
              <h5>Links</h5>
              <ul class="list-unstyled">
                <li><a href="/" class="text-white">Home</a></li>
                <li><a href="/cardapios.html" class="text-white">Cardápios</a></li>
                <li><a href="/eventos.html" class="text-white">Eventos</a></li>
                <li><a href="/contact.html" class="text-white">Contato</a></li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5>Contato</h5>
              <address>
                <p>Rua Exemplo, 123<br>
                São Paulo - SP<br>
                CEP: 01234-567</p>
                <p>Email: contato@rojogastronomia.com<br>
                Telefone: (11) 98765-4321</p>
              </address>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 text-center">
              <p class="mb-0">&copy; ${new Date().getFullYear()} Rojo Gastronomia. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', Footer); 