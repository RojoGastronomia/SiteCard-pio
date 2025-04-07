import { cartManager } from './cart';
import { eventsManager } from './events';
import { authManager } from './auth';

// Expõe as funções necessárias globalmente
window.removeFromCart = (itemId) => cartManager.removeItem(itemId);
window.updateCartItemQuantity = (itemId, quantity) => cartManager.updateItemQuantity(itemId, quantity);
window.openItemSelection = (eventType, optionId) => eventsManager.openItemSelection(eventType, optionId);

// Inicializa os gerenciadores quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o gerenciador de eventos
    eventsManager.init();

    // Inicializa o gerenciador do carrinho
    cartManager.init();

    // Inicializa o gerenciador de autenticação
    authManager.init();

    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        authManager.login(email, password);
    });

    // Register form
    document.getElementById('registroForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;
        
        if (password !== confirmPassword) {
            alert('As senhas não conferem!');
            return;
        }
        
        authManager.register(name, email, password);
    });

    // Contact form
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // TODO: Implementar envio do formulário de contato
        alert('Mensagem enviada com sucesso!');
        e.target.reset();
    });
});

// Função para abrir o modal de evento
window.openEventModal = function(eventType) {
    eventsManager.openEventModal(eventType);
};

// Função para adicionar item ao carrinho
window.addToCart = function(item) {
    cartManager.addItem(item);
};

// Função para finalizar o pedido
window.checkout = function() {
    cartManager.checkout();
}; 