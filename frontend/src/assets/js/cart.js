class CartManager {
    constructor() {
        this.items = [];
        this.modal = null;
        this.serviceFeePercentage = 0.10; // 10% de taxa de serviço
    }

    init() {
        // Carrega os itens do localStorage
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }

        // Inicializa o modal do carrinho
        this.modal = new bootstrap.Modal(document.getElementById('cartModal'));

        // Adiciona event listener para remover o backdrop quando o modal for fechado
        document.getElementById('cartModal')?.addEventListener('hidden.bs.modal', () => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });

        // Configura os event listeners
        this.setupEventListeners();

        // Atualiza o contador do carrinho
        this.updateCartCounter();

        // Atualiza a exibição do carrinho
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Event listener para o botão do carrinho
        document.querySelectorAll('[data-bs-target="#cartModal"]').forEach(button => {
            button.addEventListener('click', () => this.openCart());
        });

        // Event listener para o botão de limpar carrinho
        document.getElementById('clearCart')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                this.clearCart();
            }
        });

        // Event listener para o botão de finalizar pedido
        document.getElementById('checkoutButton')?.addEventListener('click', () => this.checkout());
    }

    addItem(item) {
        // Gera um ID único para o item
        item.id = Date.now().toString();
        
        // Adiciona o novo item
        this.items.push(item);

        // Salva no localStorage
        this.saveCart();

        // Atualiza a exibição do carrinho
        this.updateCartDisplay();

        // Atualiza o contador
        this.updateCartCounter();

        // Mostra mensagem de sucesso
        this.showToast('Item adicionado ao carrinho!', 'success');

        // Abre o modal do carrinho
        this.openCart();
    }

    removeItem(itemId) {
        if (confirm('Tem certeza que deseja remover este item?')) {
            this.items = this.items.filter(item => item.id !== itemId);
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartCounter();
            this.showToast('Item removido do carrinho!', 'warning');
        }
    }

    updateItemQuantity(itemId, guests) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            const newGuests = parseInt(guests);
            if (newGuests < item.option.minGuests) {
                this.showToast(`O mínimo de convidados é ${item.option.minGuests}!`, 'warning');
                return;
            }
            item.guests = newGuests;
            this.saveCart();
            this.updateCartDisplay();
            this.showToast('Quantidade atualizada!', 'info');
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCounter();
        this.showToast('Carrinho limpo!', 'warning');
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.guests);
        }, 0);
    }

    calculateServiceFee(subtotal) {
        return subtotal * this.serviceFeePercentage;
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const serviceFee = this.calculateServiceFee(subtotal);
        return subtotal + serviceFee;
    }

    updateCartCounter() {
        const counter = document.getElementById('cartCounter');
        if (counter) {
            counter.textContent = this.items.length;
            counter.style.display = this.items.length > 0 ? 'block' : 'none';
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const checkoutButton = document.getElementById('checkoutButton');
        const clearCartButton = document.getElementById('clearCart');
        
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '';
            if (cartSummary) cartSummary.style.display = 'none';
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (checkoutButton) checkoutButton.disabled = true;
            if (clearCartButton) clearCartButton.disabled = true;
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        if (checkoutButton) checkoutButton.disabled = false;
        if (clearCartButton) clearCartButton.disabled = false;

        cartItems.innerHTML = this.items.map(item => `
            <div class="card mb-3 cart-item" data-item-id="${item.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="card-title mb-1">${item.name}</h5>
                            <p class="card-text text-muted mb-0">
                                R$ ${item.price.toFixed(2)} por pessoa
                            </p>
                        </div>
                        <button class="btn btn-outline-danger btn-sm" 
                                onclick="cartManager.removeItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                    <div class="mb-3">
                        <div class="input-group" style="width: 150px;">
                            <input type="number" class="form-control" 
                                   value="${item.guests}" 
                                   min="${item.option.minGuests}" 
                                   onchange="cartManager.updateItemQuantity('${item.id}', this.value)">
                            <span class="input-group-text">pessoas</span>
                        </div>
                    </div>

                    ${item.selectedItems ? `
                        <div class="selected-items">
                            ${Object.entries(item.selectedItems).map(([category, items]) => `
                                <div class="mb-2">
                                    <strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                                    <ul class="list-unstyled ms-3 mb-0">
                                        ${items.map(itemName => `
                                            <li>
                                                <i class="bi bi-check2 text-success me-2"></i>
                                                ${itemName}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="text-end mt-3">
                        <strong>Subtotal: R$ ${(item.price * item.guests).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `).join('');

        // Atualiza os valores do resumo
        const subtotal = this.calculateSubtotal();
        const serviceFee = this.calculateServiceFee(subtotal);
        const total = subtotal + serviceFee;

        document.getElementById('cartSubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('cartServiceFee').textContent = `R$ ${serviceFee.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${type === 'success' ? 'check-circle' : 
                                    type === 'warning' ? 'exclamation-triangle' : 
                                    type === 'danger' ? 'x-circle' : 
                                    'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        document.getElementById('toastContainer').appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        bsToast.show();

        // Remove o toast depois que ele for fechado
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    openCart() {
        this.modal.show();
    }

    closeCart() {
        this.modal.hide();
    }

    async checkout() {
        if (this.items.length === 0) {
            this.showToast('Seu carrinho está vazio!', 'warning');
            return;
        }

        try {
            // Desabilita o botão de checkout
            const checkoutButton = document.getElementById('checkoutButton');
            if (checkoutButton) {
                checkoutButton.disabled = true;
                checkoutButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processando...
                `;
            }

            // Simula uma requisição
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('Pedido realizado com sucesso!', 'success');
            this.clearCart();
            this.closeCart();
        } catch (error) {
            this.showToast('Erro ao processar o pedido. Tente novamente.', 'danger');
        } finally {
            // Reabilita o botão de checkout
            if (checkoutButton) {
                checkoutButton.disabled = false;
                checkoutButton.innerHTML = `
                    <i class="bi bi-check2-circle me-2"></i>
                    Finalizar Pedido
                `;
            }
        }
    }
}

export const cartManager = new CartManager(); 