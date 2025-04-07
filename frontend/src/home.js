// Home page functionality
import api, { eventService } from './services/api.js';
import axios from 'axios';

class HomePage {
  constructor() {
    this.eventData = {
      'Casamento': {
        items: []
      },
      'Evento Corporativo': {
        items: []
      },
      'Festa de Aniversário': {
        items: []
      }
    };
    this.init();
  }

  async init() {
    try {
      // Inicializar funcionalidades da página
      this.setupEventListeners();
      await this.loadEvents();
      this.setupModals();
    } catch (error) {
      console.error('Erro ao inicializar a página:', error);
    }
  }

  setupEventListeners() {
    // Evento para botão de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', this.showLoginModal.bind(this));
    }

    // Adicionar eventos para os cards de eventos
    document.querySelectorAll('.event-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent;
      if (title === 'Casamento') {
        card.addEventListener('click', () => openWeddingModal());
      } else if (title === 'Evento Corporativo') {
        card.addEventListener('click', () => openCorporateModal());
      } else if (title === 'Festa de Aniversário') {
        card.addEventListener('click', () => openBirthdayModal());
      }
    });

    // Adicionar outros event listeners conforme necessário
    document.addEventListener('click', (e) => {
      if (e.target.closest('.close-modal')) {
        this.closeModals();
      }
    });
  }

  async loadEvents() {
    try {
      // Em um ambiente real, isso carregaria do backend
      // const events = await eventService.getAllEvents();
      
      // Para desenvolvimento, usamos dados simulados
      const events = this.getSimulatedEvents();
      
      // Renderizar eventos disponíveis
      // this.renderEvents(events);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  }

  setupModals() {
    // Garantir que os modais sejam inicializados corretamente
    this.setupWeddingModal();
    this.setupCorporateModal();
    this.setupBirthdayModal();
  }

  setupWeddingModal() {
    // Funcionalidades específicas para o modal de casamento já estão no HTML
    // Esta função pode adicionar qualquer lógica adicional se necessário
  }

  setupCorporateModal() {
    // Funcionalidades específicas para o modal corporativo já estão no HTML
    // Esta função pode adicionar qualquer lógica adicional se necessário
  }

  setupBirthdayModal() {
    // Funcionalidades específicas para o modal de aniversário já estão no HTML
    // Esta função pode adicionar qualquer lógica adicional se necessário
  }

  showLoginModal() {
    const loginModal = document.createElement('div');
    loginModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
    loginModal.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl w-[480px]">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Bem-vindo de volta!</h3>
            <p class="text-gray-500 mt-1">Faça login para continuar</p>
          </div>
          <button class="close-login w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <i class="ri-close-line text-xl text-gray-500"></i>
          </button>
        </div>
        <div class="flex gap-3 mb-6">
          <button class="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-button hover:bg-gray-50">
            <i class="ri-google-fill text-[20px]"></i>
            <span class="text-gray-700">Google</span>
          </button>
          <button class="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-button hover:bg-gray-50">
            <i class="ri-facebook-fill text-[20px] text-[#1877F2]"></i>
            <span class="text-gray-700">Facebook</span>
          </button>
        </div>
        <div class="relative text-center mb-6">
          <hr class="border-gray-200">
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">ou continue com</span>
        </div>
        <form class="space-y-4">
          <div>
            <label class="block text-gray-700 text-sm mb-1.5">Email</label>
            <div class="relative">
              <i class="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="email" class="w-full pl-10 pr-4 py-2.5 text-sm rounded-button border border-gray-200 focus:outline-none focus:border-primary" placeholder="Digite seu email">
            </div>
          </div>
          <div>
            <label class="block text-gray-700 text-sm mb-1.5">Senha</label>
            <div class="relative">
              <i class="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="password" class="w-full pl-10 pr-4 py-2.5 text-sm rounded-button border border-gray-200 focus:outline-none focus:border-primary" placeholder="Digite sua senha">
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="ri-eye-line"></i>
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <div class="relative w-4 h-4">
                <input type="checkbox" class="peer absolute opacity-0 w-full h-full cursor-pointer">
                <div class="absolute w-4 h-4 border border-gray-300 rounded peer-checked:border-primary peer-checked:bg-primary transition-colors"></div>
                <i class="ri-check-line absolute text-[10px] text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity"></i>
              </div>
              <span class="text-gray-600 group-hover:text-gray-900">Lembrar-me</span>
            </label>
            <a href="#" class="text-primary hover:text-primary/80">Esqueceu a senha?</a>
          </div>
          <button type="submit" class="w-full py-2.5 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors">
            Entrar
          </button>
          <div class="text-center text-sm text-gray-600">
            Não tem uma conta? <a href="#" class="text-primary hover:text-primary/80">Cadastre-se</a>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(loginModal);
    
    // Adicionar event listeners para o modal
    loginModal.querySelector('.close-login').addEventListener('click', () => {
      document.body.removeChild(loginModal);
    });
    
    const togglePasswordVisibility = (input, icon) => {
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('ri-eye-line', 'ri-eye-off-line');
      } else {
        input.type = 'password';
        icon.classList.replace('ri-eye-off-line', 'ri-eye-line');
      }
    };
    
    loginModal.querySelector('button[type="button"]').addEventListener('click', (e) => {
      const passwordInput = loginModal.querySelector('input[type="password"]');
      const icon = e.currentTarget.querySelector('i');
      togglePasswordVisibility(passwordInput, icon);
    });
    
    loginModal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      document.body.removeChild(loginModal);
      this.showLoginSuccessModal();
    });
  }

  showLoginSuccessModal() {
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
    successModal.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <i class="ri-checkbox-circle-line text-3xl text-green-500"></i>
          </div>
          <h3 class="text-xl font-bold mt-4 text-gray-800">Login realizado com sucesso!</h3>
          <p class="text-gray-500 mt-2">Bem-vindo de volta ao nosso sistema</p>
          <button class="mt-6 px-8 py-2.5 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors">OK</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('button').addEventListener('click', () => {
      document.body.removeChild(successModal);
      
      // Redirecionar para a área de administração após login
      window.location.href = 'dashboard.html';
    });
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  getSimulatedEvents() {
    return [
      {
        id: 1,
        title: 'Workshop de Gastronomia',
        description: 'Aprenda técnicas de culinária com chefs renomados',
        date: '2023-12-20T18:00:00',
        location: 'Av. Paulista, 1000 - São Paulo',
        price: 150.00,
        image: 'https://example.com/images/workshop.jpg'
      },
      {
        id: 2,
        title: 'Degustação de Vinhos',
        description: 'Conheça e deguste os melhores vinhos do mundo',
        date: '2023-12-25T19:30:00',
        location: 'Rua Oscar Freire, 500 - São Paulo',
        price: 200.00,
        image: 'https://example.com/images/wine.jpg'
      }
    ];
  }
}

// Inicializar a página quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});

export default HomePage; 