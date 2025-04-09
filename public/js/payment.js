const stripe = Stripe('your_publishable_key');

const paymentHandler = {
    init() {
        this.setupPaymentForm();
        this.setupEventListeners();
    },

    setupPaymentForm() {
        const elements = stripe.elements();
        
        // Create card elements
        this.card = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });

        // Mount card element
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
            this.card.mount('#card-element');
        }
    },

    setupEventListeners() {
        const form = document.getElementById('payment-form');
        if (form) {
            form.addEventListener('submit', this.handlePayment.bind(this));
        }
    },

    async handlePayment(e) {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button');
        button.disabled = true;
        button.innerHTML = '<div class="spinner"></div> Processando...';

        try {
            // Create payment method
            const {paymentMethod, error} = await stripe.createPaymentMethod({
                type: 'card',
                card: this.card,
                billing_details: {
                    name: document.getElementById('card-name').value,
                    email: document.getElementById('checkout-email').value
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Send payment info to your server
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    amount: window.orderDetails.totalPrice * 100, // convert to cents
                    currency: 'brl'
                })
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            // Show success message
            this.showSuccessMessage();
            
        } catch (err) {
            this.showError(err.message);
            button.disabled = false;
            button.textContent = 'Tentar novamente';
        }
    },

    showSuccessMessage() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.innerHTML = `
                <div class="bg-white rounded-lg w-full max-w-md p-8 text-center">
                    <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full">
                        <i class="ri-check-line ri-3x text-green-500"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Pagamento Confirmado!</h2>
                    <p class="text-gray-600 mb-6">Seu pedido foi processado com sucesso.</p>
                    <button onclick="window.location.reload()" class="w-full bg-primary text-white py-3 rounded-button font-medium">
                        Concluir
                    </button>
                </div>
            `;
        }
    },

    showError(message) {
        const errorElement = document.getElementById('payment-errors');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    paymentHandler.init();
});

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar os formulários de pagamento
    const creditForm = document.getElementById('credit-card-form');
    const pixForm = document.getElementById('pix-form');
    const bankForm = document.getElementById('bank-form');

    // Certifique-se de que todos os formulários estão ocultos inicialmente
    if (creditForm) creditForm.classList.add('hidden');
    if (pixForm) pixForm.classList.add('hidden');
    if (bankForm) bankForm.classList.add('hidden');

    // Exibir o formulário de cartão de crédito por padrão
    const defaultOption = document.querySelector('[data-payment="credit"]');
    if (defaultOption) {
        defaultOption.classList.add('active', 'border-primary');
        const radio = defaultOption.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        if (creditForm) creditForm.classList.remove('hidden');
    }

    // Manipulador de eventos para alternar entre os métodos de pagamento
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Atualizar o estado dos botões de rádio
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            // Atualizar os estados ativos
            paymentOptions.forEach(opt => opt.classList.remove('active', 'border-primary'));
            this.classList.add('active', 'border-primary');

            // Obter o tipo de pagamento selecionado
            const paymentType = this.getAttribute('data-payment');

            // Ocultar todos os formulários
            if (creditForm) creditForm.classList.add('hidden');
            if (pixForm) pixForm.classList.add('hidden');
            if (bankForm) bankForm.classList.add('hidden');

            // Exibir o formulário correspondente
            if (paymentType === 'credit' && creditForm) {
                creditForm.classList.remove('hidden');
            } else if (paymentType === 'pix' && pixForm) {
                pixForm.classList.remove('hidden');
            } else if (paymentType === 'bank' && bankForm) {
                bankForm.classList.remove('hidden');
            }
        });
    });
});

// Configurar o evento de clique no botão "Finalizar Pedido"
function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            // Fechar o modal do carrinho
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.add('hidden');
            }

            // Abrir o modal de checkout
            openCheckoutModal();
        });
    }
}

// Atualizar o modal do carrinho e reconfigurar eventos
function updateCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    let cartItemsHTML = '';
    let totalCartValue = 0;

    if (cartItems.length === 0) {
        cartItemsHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="w-20 h-20 flex items-center justify-center text-gray-300 mb-4">
                    <i class="ri-shopping-cart-line ri-4x"></i>
                </div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">Seu carrinho está vazio</h3>
                <p class="text-gray-500 text-center mb-6">Adicione itens ao seu carrinho para continuar</p>
                <a href="#" class="bg-primary text-white px-6 py-2 rounded !rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap">
                    Explorar Eventos
                </a>
            </div>
        `;
    } else {
        cartItems.forEach(item => {
            totalCartValue += item.totalPrice;
            cartItemsHTML += `
                <div class="border-b border-gray-200 py-4 flex flex-col md:flex-row" data-item-id="${item.id}">
                    <div class="md:w-1/4 mb-4 md:mb-0">
                        <img src="${item.image}" alt="${item.eventName}" class="w-full h-32 object-cover object-top rounded">
                    </div>
                    <div class="md:w-2/4 md:px-4 flex flex-col justify-between">
                        <div>
                            <h3 class="font-medium text-gray-800">${item.eventName}</h3>
                            <p class="text-sm text-gray-600 mb-1">Menu: ${item.menuName}</p>
                            <p class="text-sm text-gray-600 mb-1">Data: ${item.eventDate}</p>
                            <p class="text-sm text-gray-600">Convidados: ${item.guestCount}</p>
                        </div>
                        <div class="flex items-center mt-2">
                            <button class="text-gray-500 hover:text-red-500 text-sm flex items-center remove-cart-item" data-item-id="${item.id}">
                                <i class="ri-delete-bin-line mr-1"></i> Remover
                            </button>
                        </div>
                    </div>
                    <div class="md:w-1/4 flex flex-col items-end justify-between mt-4 md:mt-0">
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Preço por pessoa:</p>
                            <p class="font-medium">R$ ${item.basePrice.toFixed(2)}</p>
                        </div>
                        <div class="text-right mt-2">
                            <p class="text-sm text-gray-600">Total:</p>
                            <p class="font-bold text-primary">R$ ${item.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    cartModal.innerHTML = `
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 class="text-xl font-semibold text-gray-800">Carrinho de Compras</h2>
                <button id="closeCartModal" class="text-gray-500 hover:text-gray-700">
                    <i class="ri-close-line ri-lg"></i>
                </button>
            </div>
            <div class="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                ${cartItemsHTML}
            </div>
            ${cartItems.length > 0 ? `
            <div class="border-t border-gray-200 p-4 bg-gray-50">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-gray-700 font-medium">Total do Pedido:</span>
                    <span class="font-bold text-primary text-xl">R$ ${totalCartValue.toFixed(2)}</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="continueShoppingBtn" class="px-6 py-3 border border-gray-300 rounded !rounded-button text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap flex-1">
                        Continuar Comprando
                    </button>
                    <button id="checkoutBtn" class="px-6 py-3 bg-primary text-white rounded !rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap flex-1">
                        Finalizar Pedido
                    </button>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    // Adicionar eventos após atualizar o conteúdo
    const closeCartModalBtn = document.getElementById('closeCartModal');
    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', function () {
            cartModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function () {
            cartModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Reconfigurar o botão "Finalizar Pedido"
    setupCheckoutButton();
}

// Adicionar evento de clique ao botão do carrinho
document.getElementById('cartButton').addEventListener('click', function () {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        createCartModal();
    } else {
        updateCartModal();
    }
    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});