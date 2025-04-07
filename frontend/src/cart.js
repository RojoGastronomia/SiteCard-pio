// Classe para gerenciar o carrinho de compras
class CartManager {
  constructor() {
    this.cart = [];
    this.loadCart();
    this.setupCartButton();
  }

  // Inicializa o carrinho
  init() {
    this.loadCart();
    this.setupCartButton();
    this.setupEventListeners();
  }

  // Carrega o carrinho do localStorage
  loadCart() {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.updateCartCount();
  }

  // Salva o carrinho no localStorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
  }

  // Configura o botão do carrinho
  setupCartButton() {
    const cartButton = document.querySelector('#cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', () => this.openCartModal());
    }
  }

  // Configura os event listeners
  setupEventListeners() {
    // Fecha o modal quando clica no botão fechar
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Fecha o modal quando clica fora dele
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Adiciona um item ao carrinho
  addToCart(item) {
    this.cart.push({
      ...item,
      id: Date.now(), // Identificador único para o item
      timestamp: new Date().toISOString()
    });
    this.saveCart();
    this.showSuccessMessage('Item adicionado ao carrinho!');
  }

  // Remove um item do carrinho
  removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
    this.renderCart();
  }

  // Limpa o carrinho
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.renderCart();
  }

  // Atualiza o contador de itens no carrinho
  updateCartCount() {
    const cartCount = document.querySelector('#cart-count');
    if (cartCount) {
      cartCount.textContent = this.cart.length;
      cartCount.style.display = this.cart.length > 0 ? 'flex' : 'none';
    }
  }

  // Abre o modal do carrinho
  openCartModal() {
    const cartModal = document.querySelector('#cart-modal');
    if (cartModal) {
      this.renderCart();
      const modal = new bootstrap.Modal(cartModal);
      modal.show();
    }
  }

  // Renderiza o conteúdo do carrinho
  renderCart() {
    const cartContent = document.querySelector('#cart-content');
    if (!cartContent) return;

    if (this.cart.length === 0) {
      cartContent.innerHTML = '<p class="text-center text-gray-500 py-4">Seu carrinho está vazio</p>';
      return;
    }

    let html = '';
    let total = 0;

    this.cart.forEach(item => {
      const itemTotal = item.price * (item.quantity || 1);
      total += itemTotal;

      html += `
        <div class="cart-item p-4 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">${item.name}</h4>
              <p class="text-sm text-gray-600">${item.description || ''}</p>
              <p class="text-primary font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button 
              class="text-red-500 hover:text-red-700" 
              onclick="cartManager.removeFromCart(${item.id})"
            >
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="p-4 bg-gray-50">
        <div class="flex justify-between items-center">
          <span class="font-medium">Total:</span>
          <span class="text-primary font-bold">R$ ${total.toFixed(2)}</span>
        </div>
      </div>
    `;

    cartContent.innerHTML = html;
  }

  // Mostra mensagem de sucesso
  showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Cria e exporta uma instância do CartManager
const cartManager = new CartManager();
export default cartManager; 