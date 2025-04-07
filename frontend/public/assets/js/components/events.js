// events.js - Gerenciamento de eventos

export const events = {
    // Estado dos eventos
    state: {
        wedding: {
            guests: 0,
            total: 0
        },
        corporate: {
            guests: 0,
            total: 0
        },
        birthday: {
            guests: 0,
            total: 0
        }
    },

    // Inicialização do módulo
    init() {
        this.setupEventListeners();
        this.initializeDateInputs();
    },

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para ajuste de convidados
        document.querySelectorAll('[data-guest-adjust]').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventType = button.getAttribute('data-event-type');
                const change = parseInt(button.getAttribute('data-guest-adjust'));
                this.adjustGuests(eventType, change);
            });
        });

        // Event listeners para seleção de itens
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const eventType = this.getEventTypeFromClass(checkbox.className);
                if (eventType) {
                    this.validateSelections(eventType, checkbox.className);
                    this.updateTotal(eventType);
                }
            });
        });

        // Event listeners para botões de confirmar pedido
        document.querySelectorAll('[data-confirm-order]').forEach(button => {
            button.addEventListener('click', () => {
                const eventType = button.getAttribute('data-confirm-order');
                this.confirmOrder(eventType);
            });
        });
    },

    // Inicializar inputs de data
    initializeDateInputs() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => {
            input.min = today;
        });
    },

    // Ajustar número de convidados
    adjustGuests(eventType, change) {
        const currentGuests = this.state[eventType].guests;
        const minGuests = {
            wedding: 50,
            corporate: 30,
            birthday: 20
        };
        const maxGuests = {
            wedding: 500,
            corporate: 300,
            birthday: 150
        };

        let newValue = currentGuests + change;
        newValue = Math.max(minGuests[eventType], Math.min(maxGuests[eventType], newValue));

        this.state[eventType].guests = newValue;
        document.getElementById(`${eventType}Guests`).textContent = newValue;
        this.updateTotal(eventType);
    },

    // Validar seleções
    validateSelections(eventType, className, maxSelect) {
        const checkboxes = document.querySelectorAll(`input.${className}`);
        const checked = Array.from(checkboxes).filter(cb => cb.checked);

        if (checked.length > maxSelect) {
            const lastChecked = checked[checked.length - 1];
            lastChecked.checked = false;
            this.showError(
                'Limite de Seleção',
                `Você pode selecionar apenas ${maxSelect} ${className.includes('dessert') ? 'sobremesas' : 
                  className.includes('appetizer') ? 'entradas' : 
                  className.includes('main') ? 'pratos principais' : 'itens'}`
            );
        }
    },

    // Atualizar total
    updateTotal(eventType) {
        let total = 0;
        const basePrice = {
            wedding: 150,
            corporate: 100,
            birthday: 80
        };

        // Calcular preço base por convidado
        total += this.state[eventType].guests * basePrice[eventType];

        // Adicionar extras selecionados
        document.querySelectorAll(`input.${eventType}-extra:checked`).forEach(item => {
            total += parseFloat(item.value) * this.state[eventType].guests;
        });

        // Adicionar decoração se selecionada
        const decoration = document.querySelector(`input.${eventType}-decoration:checked`);
        if (decoration) {
            total += parseFloat(decoration.value);
        }

        this.state[eventType].total = total;
        document.getElementById(`${eventType}TotalPrice`).textContent = 
            `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    },

    // Confirmar pedido
    async confirmOrder(eventType) {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.showError('Erro', 'Você precisa estar logado para fazer um pedido.');
            return;
        }

        const eventDate = document.getElementById(`${eventType}Date`).value;
        if (!eventDate) {
            this.showError('Erro', 'Por favor, selecione uma data para o evento.');
            return;
        }

        const selectedItems = this.getSelectedItems(eventType);
        if (Object.values(selectedItems).some(items => items.length === 0)) {
            this.showError('Erro', 'Por favor, selecione todos os itens necessários.');
            return;
        }

        try {
            // Aqui você implementaria a lógica para salvar o pedido no backend
            const order = {
                userId: user.uid,
                eventType,
                date: eventDate,
                guests: this.state[eventType].guests,
                items: selectedItems,
                total: this.state[eventType].total,
                notes: document.getElementById(`${eventType}Notes`).value,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Simular envio para o backend
            console.log('Pedido enviado:', order);

            this.showSuccessModal(
                'Pedido Confirmado!',
                'Seu pedido foi recebido com sucesso. Em breve entraremos em contato!'
            );

            // Fechar o modal do evento
            document.getElementById(`${eventType}Modal`).classList.add('hidden');
        } catch (error) {
            this.showError('Erro', 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
        }
    },

    // Obter itens selecionados
    getSelectedItems(eventType) {
        const items = {
            appetizers: [],
            mainCourses: [],
            desserts: [],
            drinks: [],
            extras: []
        };

        document.querySelectorAll(`input.${eventType}-appetizer:checked`).forEach(item => {
            items.appetizers.push({
                name: item.nextElementSibling?.textContent.trim(),
                price: parseFloat(item.value)
            });
        });

        document.querySelectorAll(`input.${eventType}-main:checked`).forEach(item => {
            items.mainCourses.push({
                name: item.nextElementSibling?.textContent.trim(),
                price: parseFloat(item.value)
            });
        });

        document.querySelectorAll(`input.${eventType}-dessert:checked`).forEach(item => {
            items.desserts.push({
                name: item.nextElementSibling?.textContent.trim(),
                price: parseFloat(item.value)
            });
        });

        document.querySelectorAll(`input.${eventType}-drink:checked`).forEach(item => {
            items.drinks.push({
                name: item.nextElementSibling?.textContent.trim(),
                price: parseFloat(item.value)
            });
        });

        document.querySelectorAll(`input.${eventType}-extra:checked`).forEach(item => {
            items.extras.push({
                name: item.nextElementSibling?.textContent.trim(),
                price: parseFloat(item.value)
            });
        });

        return items;
    },

    // Utilitários
    getEventTypeFromClass(className) {
        const matches = className.match(/(wedding|corporate|birthday)/);
        return matches ? matches[1] : null;
    },

    showError(title, message) {
        // Implementado através do módulo de modais
        window.modals.showErrorModal(title, message);
    },

    showSuccessModal(title, message) {
        // Implementado através do módulo de modais
        window.modals.showSuccessModal(title, message);
    }
};

// Inicializar o módulo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    events.init();
});
