<script src="/js/menu.js"></script>

function openMenuItemsSelectionModal(menuName) {
    // Criar o modal de seleção de itens do menu, se ainda não existir
    let menuItemsModal = document.getElementById('menuItemsSelectionModal');
    if (!menuItemsModal) {
        menuItemsModal = document.createElement('div');
        menuItemsModal.id = 'menuItemsSelectionModal';
        menuItemsModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[60] hidden flex items-center justify-center';
        document.body.appendChild(menuItemsModal);
    }

    // Gerar o conteúdo do modal com base no menu selecionado
    menuItemsModal.innerHTML = `
        <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden relative">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 class="text-xl font-semibold text-gray-800">${menuName}</h2>
                <button id="closeMenuItemsModal" class="text-gray-500 hover:text-gray-700">
                    <i class="ri-close-line ri-lg"></i>
                </button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div class="flex flex-col md:flex-row gap-6">
                    <img src="https://via.placeholder.com/300" alt="${menuName}" class="w-full md:w-1/3 rounded-lg object-cover">
                    <div class="flex-1">
                        <p class="text-gray-600 mb-4">Faça uma pausa e aproveite um momento de descontração com café fresquinho, petiscos deliciosos e boa companhia.</p>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700">2 opções de menu disponíveis</span>
                                <span class="text-gray-500 text-sm">Disponível para agendamento</span>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">Data do Evento</label>
                                <input type="date" class="w-full border border-gray-300 rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">Número de Convidados</label>
                                <input type="number" min="1" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Digite o número de convidados">
                            </div>
                        </div>
                        <button class="w-full bg-primary text-white px-4 py-2.5 rounded-button mt-4 hover:bg-primary/90 transition-colors">
                            Adicionar ao carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Mostrar o modal
    menuItemsModal.classList.remove('hidden');

    // Adicionar eventos para fechar o modal
    document.getElementById('closeMenuItemsModal').addEventListener('click', function () {
        menuItemsModal.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Botão "Novo Pedido"
    const newOrderButton = document.getElementById('newOrderButton');
    if (newOrderButton) {
        newOrderButton.addEventListener('click', function () {
            openMenuItemsSelectionModal('Coffee Breaks'); // Exemplo: abrir com o menu "Coffee Breaks"
        });
    }

    // Botão "Fazer Novo Pedido"
    const makeNewOrderButton = document.getElementById('makeNewOrderButton');
    if (makeNewOrderButton) {
        makeNewOrderButton.addEventListener('click', function () {
            openMenuItemsSelectionModal('Coffee Breaks'); // Exemplo: abrir com o menu "Coffee Breaks"
        });
    }
});