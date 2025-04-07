// modals.js - Gerenciamento de modais

export const modals = {
    // Configuração inicial dos modais
    init() {
        this.setupEventListeners();
    },

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para botões de abrir/fechar modais
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
        
        // Links para alternar entre modais
        document.querySelectorAll('[data-modal-toggle]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const targetModal = element.getAttribute('data-modal-toggle');
                this.toggleModal(targetModal);
            });
        });

        // Fechar modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    },

    // Mostrar modal de login
    showLoginModal() {
        this.closeSignupModal();
        document.getElementById('loginModal')?.classList.remove('hidden');
    },

    // Mostrar modal de cadastro
    showSignupModal() {
        this.closeLoginModal();
        document.getElementById('signupModal')?.classList.remove('hidden');
    },

    // Mostrar modal de casamento
    showWeddingModal() {
        document.getElementById('weddingModal')?.classList.remove('hidden');
    },

    // Mostrar modal corporativo
    showCorporateModal() {
        document.getElementById('corporateModal')?.classList.remove('hidden');
    },

    // Mostrar modal de aniversário
    showBirthdayModal() {
        document.getElementById('birthdayModal')?.classList.remove('hidden');
    },

    // Fechar modal específico
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    },

    // Fechar modal de login
    closeLoginModal() {
        this.closeModal('loginModal');
    },

    // Fechar modal de cadastro
    closeSignupModal() {
        this.closeModal('signupModal');
    },

    // Alternar entre modais
    toggleModal(targetModal) {
        const modals = ['loginModal', 'signupModal', 'weddingModal', 'corporateModal', 'birthdayModal'];
        
        modals.forEach(modalId => {
            if (modalId === targetModal) {
                document.getElementById(modalId)?.classList.remove('hidden');
            } else {
                document.getElementById(modalId)?.classList.add('hidden');
            }
        });
    },

    // Mostrar modal de erro
    showErrorModal(title, message) {
        const errorModal = document.getElementById('errorModal');
        const errorTitle = document.getElementById('errorTitle');
        const errorMessage = document.getElementById('errorMessage');

        if (errorModal && errorTitle && errorMessage) {
            errorTitle.textContent = title;
            errorMessage.textContent = message;
            errorModal.classList.remove('hidden');
            
            // Adicionar animação de shake
            const modalContent = errorModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.add('shake');
                setTimeout(() => modalContent.classList.remove('shake'), 500);
            }
        }
    },

    // Mostrar modal de sucesso
    showSuccessModal(title, message) {
        const successModal = document.getElementById('successModal');
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');

        if (successModal && successTitle && successMessage) {
            successTitle.textContent = title;
            successMessage.textContent = message;
            successModal.classList.remove('hidden');
        }
    }
};

// Inicializar o módulo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    modals.init();
});
