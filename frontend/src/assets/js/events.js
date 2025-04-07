// Importa o serviço de eventos
import { eventService } from '../../services/api.js';
import { cartManager } from './cart.js';

// Classe para gerenciar eventos
class EventsManager {
  constructor() {
    this.events = {
      casamento: {
        title: 'Casamento',
        description: 'Cardápios especialmente elaborados para tornar seu dia ainda mais especial.',
        options: [
          {
            id: 'casamento-1',
            name: 'Pacote Clássico',
            description: 'Menu tradicional com entrada, prato principal e sobremesa',
            price: 150.00,
            minGuests: 50,
            items: {
              entradas: [
                { id: 'c1-e1', name: 'Salada Caesar', selected: false },
                { id: 'c1-e2', name: 'Bruschetta de Tomate', selected: false },
                { id: 'c1-e3', name: 'Carpaccio de Carne', selected: false },
                { id: 'c1-e4', name: 'Sopa de Abóbora', selected: false }
              ],
              principais: [
                { id: 'c1-p1', name: 'Filé Mignon ao Molho Madeira', selected: false },
                { id: 'c1-p2', name: 'Salmão Grelhado', selected: false },
                { id: 'c1-p3', name: 'Frango Supreme', selected: false }
              ],
              sobremesas: [
                { id: 'c1-s1', name: 'Pudim de Leite', selected: false },
                { id: 'c1-s2', name: 'Mousse de Chocolate', selected: false },
                { id: 'c1-s3', name: 'Cheesecake', selected: false }
              ],
              bebidas: [
                { id: 'c1-b1', name: 'Água Mineral', selected: true },
                { id: 'c1-b2', name: 'Refrigerante', selected: true },
                { id: 'c1-b3', name: 'Suco Natural', selected: true }
              ]
            },
            selectionRules: {
              entradas: { min: 2, max: 3 },
              principais: { min: 2, max: 2 },
              sobremesas: { min: 2, max: 2 },
              bebidas: { min: 3, max: 3 }
            }
          },
          {
            id: 'casamento-2',
            name: 'Pacote Premium',
            description: 'Menu sofisticado com 4 tempos e bebidas inclusas',
            price: 250.00,
            minGuests: 80,
            items: {
              entradas: [
                { id: 'c2-e1', name: 'Tartare de Atum', selected: false },
                { id: 'c2-e2', name: 'Camarão Empanado', selected: false },
                { id: 'c2-e3', name: 'Salada Caprese', selected: false },
                { id: 'c2-e4', name: 'Ceviche', selected: false },
                { id: 'c2-e5', name: 'Carpaccio de Salmão', selected: false }
              ],
              principais: [
                { id: 'c2-p1', name: 'Filé Mignon ao Molho de Vinho', selected: false },
                { id: 'c2-p2', name: 'Bacalhau Confitado', selected: false },
                { id: 'c2-p3', name: 'Cordeiro Assado', selected: false },
                { id: 'c2-p4', name: 'Risoto de Camarão', selected: false }
              ],
              sobremesas: [
                { id: 'c2-s1', name: 'Petit Gateau', selected: false },
                { id: 'c2-s2', name: 'Tiramisù', selected: false },
                { id: 'c2-s3', name: 'Crème Brûlée', selected: false },
                { id: 'c2-s4', name: 'Pavlova', selected: false }
              ],
              bebidas: [
                { id: 'c2-b1', name: 'Água Mineral', selected: true },
                { id: 'c2-b2', name: 'Refrigerante', selected: true },
                { id: 'c2-b3', name: 'Suco Natural', selected: true },
                { id: 'c2-b4', name: 'Vinho Tinto', selected: true },
                { id: 'c2-b5', name: 'Vinho Branco', selected: true },
                { id: 'c2-b6', name: 'Espumante', selected: true }
              ]
            },
            selectionRules: {
              entradas: { min: 3, max: 4 },
              principais: { min: 3, max: 3 },
              sobremesas: { min: 3, max: 3 },
              bebidas: { min: 6, max: 6 }
            }
          },
          {
            id: 'casamento-3',
            name: 'Pacote Luxo',
            description: 'Menu exclusivo com 6 tempos, bebidas premium e decoração',
            price: 350.00,
            minGuests: 100
          }
        ]
      },
      aniversario: {
        title: 'Aniversário',
        description: 'Comemore seu dia especial com um cardápio personalizado e inesquecível.',
        options: [
          {
            id: 'aniversario-1',
            name: 'Pacote Festa',
            description: 'Salgados variados, mini pizzas, refrigerantes e bolo',
            price: 45.00,
            minGuests: 30,
            items: {
              salgados: [
                { id: 'a1-s1', name: 'Coxinha', selected: false },
                { id: 'a1-s2', name: 'Bolinha de Queijo', selected: false },
                { id: 'a1-s3', name: 'Kibe', selected: false },
                { id: 'a1-s4', name: 'Esfiha', selected: false },
                { id: 'a1-s5', name: 'Mini Pizza', selected: false }
              ],
              doces: [
                { id: 'a1-d1', name: 'Brigadeiro', selected: false },
                { id: 'a1-d2', name: 'Beijinho', selected: false },
                { id: 'a1-d3', name: 'Trufa', selected: false }
              ],
              bebidas: [
                { id: 'a1-b1', name: 'Água Mineral', selected: true },
                { id: 'a1-b2', name: 'Refrigerante', selected: true },
                { id: 'a1-b3', name: 'Suco Natural', selected: true }
              ]
            },
            selectionRules: {
              salgados: { min: 3, max: 4 },
              doces: { min: 2, max: 3 },
              bebidas: { min: 3, max: 3 }
            }
          },
          {
            id: 'aniversario-2',
            name: 'Pacote Especial',
            description: 'Buffet completo com churrasco, saladas, sobremesas e bebidas',
            price: 85.00,
            minGuests: 50,
            items: {
              carnes: [
                { id: 'a2-c1', name: 'Picanha', selected: false },
                { id: 'a2-c2', name: 'Fraldinha', selected: false },
                { id: 'a2-c3', name: 'Costela', selected: false },
                { id: 'a2-c4', name: 'Linguiça', selected: false }
              ],
              saladas: [
                { id: 'a2-s1', name: 'Salada Caesar', selected: false },
                { id: 'a2-s2', name: 'Salada Tropical', selected: false },
                { id: 'a2-s3', name: 'Salada Caprese', selected: false }
              ],
              sobremesas: [
                { id: 'a2-d1', name: 'Pudim', selected: false },
                { id: 'a2-d2', name: 'Mousse', selected: false },
                { id: 'a2-d3', name: 'Sorvete', selected: false }
              ],
              bebidas: [
                { id: 'a2-b1', name: 'Água Mineral', selected: true },
                { id: 'a2-b2', name: 'Refrigerante', selected: true },
                { id: 'a2-b3', name: 'Suco Natural', selected: true },
                { id: 'a2-b4', name: 'Cerveja', selected: false }
              ]
            },
            selectionRules: {
              carnes: { min: 3, max: 4 },
              saladas: { min: 2, max: 3 },
              sobremesas: { min: 2, max: 3 },
              bebidas: { min: 3, max: 4 }
            }
          },
          {
            id: 'aniversario-3',
            name: 'Pacote Premium',
            description: 'Menu personalizado, finger foods, estações gourmet e open bar',
            price: 120.00,
            minGuests: 80,
            items: {
              entradas: [
                { id: 'a3-e1', name: 'Camarão Empanado', selected: false },
                { id: 'a3-e2', name: 'Bruschetta', selected: false },
                { id: 'a3-e3', name: 'Carpaccio', selected: false },
                { id: 'a3-e4', name: 'Mini Quiche', selected: false }
              ],
              principais: [
                { id: 'a3-p1', name: 'Filé Mignon', selected: false },
                { id: 'a3-p2', name: 'Salmão', selected: false },
                { id: 'a3-p3', name: 'Risoto', selected: false }
              ],
              sobremesas: [
                { id: 'a3-d1', name: 'Petit Gateau', selected: false },
                { id: 'a3-d2', name: 'Cheesecake', selected: false },
                { id: 'a3-d3', name: 'Tiramisù', selected: false }
              ],
              bebidas: [
                { id: 'a3-b1', name: 'Água Mineral', selected: true },
                { id: 'a3-b2', name: 'Refrigerante', selected: true },
                { id: 'a3-b3', name: 'Suco Natural', selected: true },
                { id: 'a3-b4', name: 'Cerveja', selected: true },
                { id: 'a3-b5', name: 'Vinho', selected: true },
                { id: 'a3-b6', name: 'Espumante', selected: true }
              ]
            },
            selectionRules: {
              entradas: { min: 3, max: 4 },
              principais: { min: 2, max: 3 },
              sobremesas: { min: 2, max: 3 },
              bebidas: { min: 6, max: 6 }
            }
          }
        ]
      },
      formatura: {
        title: 'Formatura',
        description: 'Celebre sua conquista com um cardápio à altura da sua realização.',
        options: [
          {
            id: 'formatura-1',
            name: 'Pacote Básico',
            description: 'Coquetel de salgados, refrigerantes e espumante',
            price: 60.00,
            minGuests: 50
          },
          {
            id: 'formatura-2',
            name: 'Pacote Executivo',
            description: 'Jantar servido, sobremesa e bebidas não alcoólicas',
            price: 95.00,
            minGuests: 80
          },
          {
            id: 'formatura-3',
            name: 'Pacote Master',
            description: 'Buffet completo, sobremesas variadas e open bar',
            price: 150.00,
            minGuests: 100
          }
        ]
      },
      confraternizacao: {
        title: 'Confraternização',
        description: 'Reúna amigos e familiares com um cardápio perfeito para celebrar.',
        options: [
          {
            id: 'confraternizacao-1',
            name: 'Pacote Churrasco',
            description: 'Churrasco completo com acompanhamentos e bebidas',
            price: 65.00,
            minGuests: 30
          },
          {
            id: 'confraternizacao-2',
            name: 'Pacote Feijoada',
            description: 'Feijoada completa com acompanhamentos e sobremesa',
            price: 55.00,
            minGuests: 40
          },
          {
            id: 'confraternizacao-3',
            name: 'Pacote Gourmet',
            description: 'Menu internacional, finger foods e bebidas premium',
            price: 95.00,
            minGuests: 50
          }
        ]
      },
      bodas: {
        title: 'Bodas',
        description: 'Celebre seu amor com um cardápio especial para renovar os votos.',
        options: [
          {
            id: 'bodas-1',
            name: 'Pacote Prata',
            description: 'Jantar servido com entrada e sobremesa',
            price: 120.00,
            minGuests: 40
          },
          {
            id: 'bodas-2',
            name: 'Pacote Ouro',
            description: 'Menu degustação com harmonização de vinhos',
            price: 180.00,
            minGuests: 60
          },
          {
            id: 'bodas-3',
            name: 'Pacote Diamante',
            description: 'Menu premium com 5 tempos e bebidas importadas',
            price: 250.00,
            minGuests: 80
          }
        ]
      },
      religioso: {
        title: 'Eventos Religiosos',
        description: 'Cardápios especiais para batizados, primeira comunhão e outros eventos.',
        options: [
          {
            id: 'religioso-1',
            name: 'Pacote Celebração',
            description: 'Brunch completo com bebidas não alcoólicas',
            price: 45.00,
            minGuests: 30
          },
          {
            id: 'religioso-2',
            name: 'Pacote Especial',
            description: 'Almoço servido com sobremesas e bebidas',
            price: 75.00,
            minGuests: 50
          },
          {
            id: 'religioso-3',
            name: 'Pacote Premium',
            description: 'Buffet completo com estações e bebidas premium',
            price: 95.00,
            minGuests: 70
          }
        ]
      },
      'coffee-break': {
        title: 'Coffee Break',
        description: 'Opções práticas e saborosas para suas reuniões e eventos empresariais.',
        options: [
          {
            id: 'coffee-1',
            name: 'Coffee Break Básico',
            description: 'Café, chá, água, sucos e 3 tipos de salgados',
            price: 25.00,
            minGuests: 20
          },
          {
            id: 'coffee-2',
            name: 'Coffee Break Executivo',
            description: 'Café, chá, água, sucos, 5 tipos de salgados e 2 tipos de doces',
            price: 35.00,
            minGuests: 30
          },
          {
            id: 'coffee-3',
            name: 'Coffee Break Premium',
            description: 'Café, chá, água, sucos, refrigerantes, 8 tipos de salgados, 4 tipos de doces e frutas',
            price: 45.00,
            minGuests: 40
          }
        ]
      }
    };

    this.eventModal = null;
    this.itemSelectionModal = null;
    this.selectedPackage = null;
    this.selectedGuests = 0;
  }

  // Inicializa os eventos
  init() {
    this.eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
    this.itemSelectionModal = new bootstrap.Modal(document.getElementById('itemSelectionModal'));
    this.setupEventListeners();

    // Expõe as funções necessárias globalmente
    window.openItemSelection = (eventType, optionId) => this.openItemSelection(eventType, optionId);
    window.validateSelection = (category) => this.validateSelection(category);
    window.addSelectedItemsToCart = () => this.addSelectedItemsToCart();
  }

  // Configura os event listeners
  setupEventListeners() {
    // Event listeners para os botões "Ver Opções"
    document.querySelectorAll('[data-event-type]').forEach(button => {
      button.addEventListener('click', (e) => {
        const eventType = e.target.getAttribute('data-event-type');
        if (eventType) {
          this.openEventModal(eventType);
        }
      });
    });

    // Event listener para o botão de coffee break
    const coffeeBreakButton = document.querySelector('button[onclick="openEventModal(\'coffee-break\')"]');
    if (coffeeBreakButton) {
      coffeeBreakButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openEventModal('coffee-break');
      });
      // Remove o onclick para evitar duplicação
      coffeeBreakButton.removeAttribute('onclick');
    }
  }

  openEventModal(eventType) {
    const event = this.events[eventType];
    if (!event) return;

    const modalTitle = document.getElementById('eventModalTitle');
    const modalBody = document.getElementById('eventModalBody');

    modalTitle.textContent = event.title;

    modalBody.innerHTML = `
      <div class="row">
        ${event.options.map(option => `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${option.name}</h5>
                <p class="card-text">${option.description}</p>
                <p class="card-text">
                  <small class="text-muted">
                    Mínimo de ${option.minGuests} convidados
                  </small>
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">R$ ${option.price.toFixed(2)}/pessoa</h6>
                </div>
                <div class="mt-3">
                  <button class="btn btn-primary w-100" 
                          onclick="openItemSelection('${eventType}', '${option.id}')">
                    Selecionar Itens
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.eventModal.show();
  }

  openItemSelection(eventType, optionId) {
    const event = this.events[eventType];
    if (!event) return;

    const option = event.options.find(opt => opt.id === optionId);
    if (!option) return;

    this.selectedPackage = {
      eventType,
      option
    };

    const modalBody = document.getElementById('itemSelectionModalBody');
    if (!modalBody) return;

    // Limpa o conteúdo anterior
    modalBody.innerHTML = '';

    // Adiciona o título e descrição do pacote
    modalBody.innerHTML = `
      <div class="mb-4">
        <h4>${option.name}</h4>
        <p class="text-muted">${option.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>R$ ${option.price.toFixed(2)}</strong> por pessoa
          </div>
          <div class="input-group" style="width: 150px;">
            <input type="number" class="form-control" id="guestCount" 
                   value="${option.minGuests}" min="${option.minGuests}">
            <span class="input-group-text">pessoas</span>
          </div>
        </div>
      </div>
    `;

    // Adiciona as categorias e itens
    Object.entries(option.items).forEach(([category, items]) => {
      const rules = option.selectionRules[category];
      modalBody.innerHTML += `
        <div class="mb-4">
          <h5 class="mb-3">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
          <p class="text-muted small mb-3">
            Selecione entre ${rules.min} e ${rules.max} itens
          </p>
          <div class="row g-3">
            ${items.map(item => `
              <div class="col-md-6">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" 
                             name="${category}" value="${item.name}"
                             data-category="${category}">
                      <label class="form-check-label">
                        ${item.name}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    // Abre o modal
    this.itemSelectionModal.show();

    // Adiciona event listener para remover o backdrop quando o modal for fechado
    this.itemSelectionModal._element.addEventListener('hidden.bs.modal', () => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    });
  }

  validateSelection(category) {
    if (!this.selectedPackage) return;

    const option = this.selectedPackage.option;
    const rules = option.selectionRules[category];
    const checkboxes = document.querySelectorAll(`input[data-category="${category}"]`);
    const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    if (selectedCount > rules.max) {
      alert(`Você pode selecionar no máximo ${rules.max} itens desta categoria.`);
      event.target.checked = false;
      return false;
    }

    return true;
  }

  addSelectedItemsToCart() {
    const selectedItems = {};
    let isValid = true;

    // Coleta os itens selecionados por categoria
    Object.entries(this.selectedPackage.option.selectionRules).forEach(([category, rules]) => {
      const selectedCheckboxes = document.querySelectorAll(`input[data-category="${category}"]:checked`);
      selectedItems[category] = Array.from(selectedCheckboxes).map(cb => cb.value);

      // Valida a quantidade de itens selecionados
      if (selectedItems[category].length < rules.min || selectedItems[category].length > rules.max) {
        isValid = false;
        this.showToast(`Selecione entre ${rules.min} e ${rules.max} itens em ${category}`, 'warning');
      }
    });

    if (!isValid) return;

    // Cria o objeto do item para o carrinho
    const cartItem = {
      name: `${this.events[this.selectedPackage.eventType].title} - ${this.selectedPackage.option.name}`,
      price: this.selectedPackage.option.price,
      guests: parseInt(document.getElementById('guestCount').value),
      option: this.selectedPackage.option,
      selectedItems: selectedItems
    };

    // Adiciona ao carrinho
    cartManager.addItem(cartItem);

    // Fecha o modal de seleção
    this.itemSelectionModal.hide();
    this.selectedPackage = null;
  }

  getEventByType(type) {
    return this.events[type];
  }
}

// Cria e exporta uma instância do EventsManager
export const eventsManager = new EventsManager();

// Inicializa o gerenciador de eventos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  eventsManager.init();
}); 