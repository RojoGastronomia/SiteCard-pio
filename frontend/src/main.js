// Importa os módulos necessários
import cartManager from './cart.js';
import eventsManager from './events.js';

// Função para inicializar a aplicação
function initApp() {
  // Expõe o cartManager globalmente para uso nos botões
  window.cartManager = cartManager;
  window.eventsManager = eventsManager;

  // Configura o botão do carrinho
  const cartButton = document.querySelector('#cart-button');
  if (cartButton) {
    cartButton.addEventListener('click', () => cartManager.openCartModal());
  }

  // Configura os botões de adicionar ao carrinho
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', (e) => {
      const eventType = e.target.dataset.addToCart;
      eventsManager.addToCart(eventType);
    });
  });

  // Configura os botões de incremento/decremento de convidados
  document.querySelectorAll('[data-guest-adjust]').forEach(button => {
    button.addEventListener('click', (e) => {
      const { eventType, amount } = e.target.dataset;
      eventsManager.adjustGuestCount(eventType, parseInt(amount));
    });
  });

  // Configura os inputs de número de convidados
  document.querySelectorAll('.guest-count').forEach(input => {
    input.addEventListener('change', (e) => {
      eventsManager.validateGuestCount(e.target);
    });
  });

  // Configura os botões de fechar modal
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Fecha os modais quando clicar fora
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
}

// Inicializa a aplicação quando o DOM estiver carregado
 