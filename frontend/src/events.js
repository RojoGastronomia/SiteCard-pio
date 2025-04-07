import cartManager from './cart.js';

// Classe para gerenciar eventos
class EventsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupGuestCountInputs();
  }

  setupEventListeners() {
    // Configura os botões de adicionar ao carrinho
    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
      button.addEventListener('click', (e) => {
        const eventType = e.target.dataset.addToCart;
        this.addToCart(eventType);
      });
    });

    // Configura os botões de incremento/decremento de convidados
    document.querySelectorAll('[data-guest-adjust]').forEach(button => {
      button.addEventListener('click', (e) => {
        const { eventType, amount } = e.target.dataset;
        this.adjustGuestCount(eventType, parseInt(amount));
      });
    });
  }

  setupGuestCountInputs() {
    // Configura os inputs de número de convidados
    document.querySelectorAll('.guest-count').forEach(input => {
      input.addEventListener('change', (e) => {
        this.validateGuestCount(e.target);
      });
    });
  }

  validateGuestCount(input) {
    let value = parseInt(input.value);
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 1000;

    if (isNaN(value)) value = min;
    if (value < min) value = min;
    if (value > max) value = max;

    input.value = value;
    this.updatePrice(input.dataset.eventType);
  }

  adjustGuestCount(eventType, amount) {
    const input = document.querySelector(`#${eventType}GuestCount`);
    if (!input) return;

    let value = parseInt(input.value) + amount;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 1000;

    if (value < min) value = min;
    if (value > max) value = max;

    input.value = value;
    this.updatePrice(eventType);
  }

  updatePrice(eventType) {
    const priceElement = document.querySelector(`#${eventType}Price`);
    if (!priceElement) return;

    const guestCount = parseInt(document.querySelector(`#${eventType}GuestCount`).value);
    let basePrice = 0;

    switch (eventType) {
      case 'wedding':
        basePrice = 150;
        break;
      case 'corporate':
        basePrice = 80;
        break;
      case 'birthday':
        basePrice = 60;
        break;
      case 'graduation':
        basePrice = 100;
        break;
      default:
        basePrice = 50;
    }

    const total = guestCount * basePrice;
    priceElement.textContent = `R$ ${total.toFixed(2)}`;
  }

  addToCart(eventType) {
    const guestCount = parseInt(document.querySelector(`#${eventType}GuestCount`).value);
    const price = parseFloat(document.querySelector(`#${eventType}Price`).textContent.replace('R$ ', ''));

    const item = {
      type: eventType,
      name: this.getEventName(eventType),
      guestCount,
      price,
      date: document.querySelector(`#${eventType}Date`).value
    };

    cartManager.addToCart(item);
  }

  getEventName(eventType) {
    const names = {
      wedding: 'Casamento',
      corporate: 'Evento Corporativo',
      birthday: 'Festa de Aniversário',
      graduation: 'Festa de Formatura'
    };
    return names[eventType] || 'Evento';
  }
}

// Inicializa o gerenciador de eventos
const eventsManager = new EventsManager();
export default eventsManager; 