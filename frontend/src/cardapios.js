// Cardapios page functionality
import api, { menuService } from './services/api.js';
import axios from 'axios';

class MenusPage {
  constructor() {
    this.menus = [];
    this.currentlyEditingMenu = null;
    this.currentlyDeletingMenu = null;
    this.filters = {
      eventType: null,
      status: null,
      searchTerm: ''
    };
    this.init();
  }

  async init() {
    try {
      await this.loadMenus();
      this.setupEventListeners();
    } catch (error) {
      console.error('Erro ao inicializar a página de cardápios:', error);
      alert('Ocorreu um erro ao carregar os cardápios. Por favor, tente novamente mais tarde.');
    }
  }

  async loadMenus() {
    try {
      // Em um ambiente real, substituir pela chamada à API
      // const response = await axios.get('/api/menus');
      // this.menus = response.data;
      
      // Dados simulados para desenvolvimento
      this.menus = this.getSimulatedMenus();
      this.renderMenus();
    } catch (error) {
      console.error('Erro ao carregar cardápios:', error);
      // Em caso de erro, exibir mensagem na interface
      const menuContainer = document.getElementById('menuContainer');
      menuContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
          <div class="text-red-500 mb-2">
            <i class="ri-error-warning-line text-3xl"></i>
          </div>
          <p class="text-gray-700">Não foi possível carregar os cardápios. Por favor, tente novamente mais tarde.</p>
          <button onclick="location.reload()" class="mt-4 !rounded-button bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">
            Tentar Novamente
          </button>
        </div>
      `;
    }
  }

  getSimulatedMenus() {
    return [
      {
        id: 1,
        name: 'Menu Executivo',
        eventType: 'Corporativos',
        status: 'Ativo',
        categories: [
          {
            name: 'Entradas',
            items: [
              { name: 'Bruschetta de Tomate', description: 'Tomate, manjericão, azeite extra virgem', price: 12.00 },
              { name: 'Carpaccio de Salmão', description: 'Salmão, alcaparras, rúcula', price: 28.00 },
              { name: 'Salada Caprese', description: 'Tomate, mussarela de búfala, manjericão', price: 22.00 },
              { name: 'Bolinho de Bacalhau', description: 'Bacalhau, batata, salsa, cebola', price: 25.00 },
              { name: 'Camarão Empanado', description: 'Camarão, farinha panko, molho tártaro', price: 32.00 },
              { name: 'Antepasto de Berinjela', description: 'Berinjela, tomate seco, parmesão', price: 18.00 },
              { name: 'Ceviche', description: 'Peixe branco, cebola roxa, coentro, pimenta', price: 30.00 },
              { name: 'Escondidinho de Camarão', description: 'Camarão, mandioca, queijo', price: 35.00 }
            ]
          },
          {
            name: 'Pratos Principais',
            items: [
              { name: 'Filé à Parmegiana', description: 'Filé mignon, molho de tomate, queijo', price: 45.00 },
              { name: 'Risoto de Camarão', description: 'Arroz arbóreo, camarão, açafrão', price: 52.00 },
              { name: 'Salmão Grelhado', description: 'Salmão, aspargos, molho de limão', price: 58.00 },
              { name: 'Fettuccine ao Molho Alfredo', description: 'Fettuccine, creme de leite, queijo parmesão', price: 38.00 },
              { name: 'Picanha ao Molho Madeira', description: 'Picanha, molho madeira, batata rústica', price: 62.00 },
              { name: 'Frango ao Curry', description: 'Peito de frango, curry, leite de coco, arroz', price: 42.00 },
              { name: 'Paella Valenciana', description: 'Arroz, frutos do mar, açafrão, ervilhas', price: 68.00 },
              { name: 'Gnocchi ao Pesto', description: 'Gnocchi de batata, molho pesto, parmesão', price: 45.00 },
              { name: 'Bacalhau à Portuguesa', description: 'Bacalhau, batata, cebola, ovo, azeitonas', price: 75.00 },
              { name: 'Moqueca de Peixe', description: 'Peixe, pimentão, tomate, leite de coco, dendê', price: 65.00 },
              { name: 'Costela ao Molho Barbecue', description: 'Costela suína, molho barbecue, purê de batata', price: 55.00 },
              { name: 'Risoto de Funghi', description: 'Arroz arbóreo, funghi, parmesão, manteiga', price: 48.00 }
            ]
          },
          {
            name: 'Sobremesas',
            items: [
              { name: 'Tiramisù', description: 'Café, queijo mascarpone, cacau', price: 22.00 },
              { name: 'Cheesecake', description: 'Cream cheese, frutas vermelhas', price: 24.00 },
              { name: 'Pudim de Leite', description: 'Leite condensado, leite, caramelo', price: 18.00 },
              { name: 'Mousse de Chocolate', description: 'Chocolate meio amargo, creme de leite', price: 20.00 },
              { name: 'Crème Brûlée', description: 'Creme, baunilha, açúcar caramelizado', price: 26.00 },
              { name: 'Pavlova', description: 'Merengue, frutas frescas, chantilly', price: 28.00 }
            ]
          },
          {
            name: 'Bebidas',
            items: [
              { name: 'Água Mineral', description: 'Com ou sem gás', price: 5.00 },
              { name: 'Refrigerante', description: 'Diversos sabores', price: 6.00 },
              { name: 'Suco Natural', description: 'Diversos sabores', price: 10.00 },
              { name: 'Café Espresso', description: 'Café 100% arábica', price: 7.00 },
              { name: 'Chá', description: 'Diversos sabores', price: 6.00 },
              { name: 'Vinho Tinto/Branco', description: 'Taça', price: 18.00 }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Menu Casamento Premium',
        eventType: 'Casamentos',
        status: 'Ativo',
        categories: [
          {
            name: 'Entradas',
            items: [
              { name: 'Canapés de Salmão Defumado', description: 'Salmão defumado, cream cheese, alcaparras', price: 35.00 },
              { name: 'Mini Quiches', description: 'Diversos sabores', price: 30.00 },
              { name: 'Folheado de Queijo Brie com Damasco', description: 'Queijo brie, damasco, massa folhada', price: 32.00 },
              { name: 'Tartar de Atum', description: 'Atum fresco, abacate, mostarda dijon', price: 40.00 },
              { name: 'Ostras Frescas', description: 'Ostras com molho mignonette', price: 45.00 },
              { name: 'Espuma de Foie Gras', description: 'Foie gras, brioche tostado', price: 50.00 },
              { name: 'Blinis com Caviar', description: 'Blinis, creme azedo, caviar', price: 60.00 },
              { name: 'Ceviche de Vieiras', description: 'Vieiras, limão, coentro, pimenta', price: 42.00 },
              { name: 'Camarões com Molho Cocktail', description: 'Camarões grandes, molho cocktail', price: 38.00 },
              { name: 'Bruschetta de Cogumelos Trufados', description: 'Cogumelos, óleo de trufa, parmesão', price: 36.00 },
              { name: 'Rollinho Primavera', description: 'Vegetais, molho agridoce', price: 28.00 },
              { name: 'Gazpacho Andaluz em Shot', description: 'Sopa fria de tomate, pepino, pimentão', price: 25.00 }
            ]
          },
          {
            name: 'Pratos Principais',
            items: [
              { name: 'Filé Mignon ao Molho de Vinho do Porto', description: 'Filé mignon, vinho do porto, cogumelos', price: 85.00 },
              { name: 'Robalo em Crosta de Ervas', description: 'Robalo, mix de ervas, legumes', price: 78.00 },
              { name: 'Risoto de Lagosta', description: 'Arroz arbóreo, lagosta, açafrão', price: 95.00 },
              { name: 'Medalhão de Cordeiro com Redução de Balsâmico', description: 'Cordeiro, redução de balsâmico, purê de batata', price: 88.00 },
              { name: 'Peito de Pato com Molho de Laranja', description: 'Peito de pato, molho de laranja, legumes glaceados', price: 82.00 },
              { name: 'Wellington de Salmão', description: 'Salmão em massa folhada, espinafre', price: 75.00 },
              { name: 'Arroz de Pato', description: 'Arroz, pato confitado, linguiça', price: 72.00 },
              { name: 'Carré de Cordeiro com Crosta de Ervas', description: 'Carré de cordeiro, ervas, batata dauphinoise', price: 90.00 },
              { name: 'Ravioli de Lagosta com Molho de Champagne', description: 'Ravioli recheado com lagosta, molho de champagne', price: 92.00 },
              { name: 'Tournedo Rossini', description: 'Filé mignon, foie gras, trufas, molho Madeira', price: 98.00 },
              { name: 'Risoto de Açafrão com Aspargos', description: 'Arroz arbóreo, açafrão, aspargos', price: 68.00 },
              { name: 'Bacalhau Confitado com Purê de Grão-de-Bico', description: 'Lombo de bacalhau confitado, purê de grão-de-bico', price: 85.00 },
              { name: 'Camarão na Moranga', description: 'Camarões, creme, abóbora', price: 76.00 },
              { name: 'Nhoque de Batata Doce ao Molho de Sálvia', description: 'Nhoque, manteiga de sálvia, amêndoas', price: 70.00 },
              { name: 'Paella Valenciana para Compartilhar', description: 'Arroz, frutos do mar, chorizo, açafrão', price: 180.00 }
            ]
          },
          {
            name: 'Sobremesas',
            items: [
              { name: 'Torre de Macarons', description: 'Macarons sortidos', price: 40.00 },
              { name: 'Petit Gâteau', description: 'Bolo de chocolate com interior derretido, sorvete de baunilha', price: 28.00 },
              { name: 'Crème Brûlée de Baunilha Bourbon', description: 'Creme, baunilha bourbon, açúcar caramelizado', price: 30.00 },
              { name: 'Cheesecake de Frutas Vermelhas', description: 'Cream cheese, frutas vermelhas frescas', price: 32.00 },
              { name: 'Profiteroles com Calda de Chocolate', description: 'Massa choux, sorvete, calda de chocolate', price: 35.00 },
              { name: 'Pavlova com Frutas da Estação', description: 'Merengue, chantilly, frutas frescas', price: 38.00 },
              { name: 'Tiramisù', description: 'Café, mascarpone, cacau', price: 34.00 },
              { name: 'Mousse de Chocolate Belga', description: 'Chocolate belga, chantilly', price: 32.00 },
              { name: 'Trufas Sortidas', description: 'Seleção de trufas artesanais', price: 25.00 },
              { name: 'Sorvetes e Sorbets Artesanais', description: 'Diversos sabores', price: 22.00 }
            ]
          },
          {
            name: 'Bebidas',
            items: [
              { name: 'Champagne', description: 'Garrafa', price: 180.00 },
              { name: 'Vinho Tinto Premium', description: 'Garrafa', price: 120.00 },
              { name: 'Vinho Branco Premium', description: 'Garrafa', price: 110.00 },
              { name: 'Whisky 12 anos', description: 'Dose', price: 25.00 },
              { name: 'Coquetel de Assinatura', description: 'Drink exclusivo do evento', price: 28.00 },
              { name: 'Água Mineral', description: 'Com ou sem gás', price: 5.00 },
              { name: 'Refrigerante Premium', description: 'Diversos sabores', price: 8.00 },
              { name: 'Suco Natural', description: 'Diversos sabores', price: 12.00 }
            ]
          }
        ]
      }
    ];
  }

  renderMenus() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    // Aplicar filtros
    const filteredMenus = this.getFilteredMenus();

    if (filteredMenus.length === 0) {
      menuContainer.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          Nenhum cardápio encontrado com os filtros atuais.
        </div>
      `;
      return;
    }

    // Renderizar cada cardápio
    filteredMenus.forEach(menu => {
      const menuCard = this.createMenuCard(menu);
      menuContainer.appendChild(menuCard);
    });
  }

  getFilteredMenus() {
    return this.menus.filter(menu => {
      // Filtrar por tipo de evento
      if (this.filters.eventType && menu.eventType !== this.filters.eventType) {
        return false;
      }

      // Filtrar por status
      if (this.filters.status && menu.status !== this.filters.status) {
        return false;
      }

      // Filtrar por termo de busca
      if (this.filters.searchTerm) {
        const searchTerm = this.filters.searchTerm.toLowerCase();
        const menuNameMatch = menu.name.toLowerCase().includes(searchTerm);
        const eventTypeMatch = menu.eventType.toLowerCase().includes(searchTerm);
        const categoryMatch = menu.categories.some(cat => cat.name.toLowerCase().includes(searchTerm));
        const itemMatch = menu.categories.some(cat => 
          cat.items.some(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
          )
        );

        return menuNameMatch || eventTypeMatch || categoryMatch || itemMatch;
      }

      return true;
    });
  }

  createMenuCard(menu) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden';
    div.setAttribute('data-menu-id', menu.id);

    // Obter contagem de itens por categoria
    const categoryItemCounts = menu.categories.reduce((acc, category) => {
      acc[category.name] = category.items.length;
      return acc;
    }, {});

    // Calcular total de itens
    const totalItems = menu.categories.reduce((total, category) => total + category.items.length, 0);

    // Definir classe de status
    let statusClass = '';
    switch (menu.status) {
      case 'Ativo':
        statusClass = 'bg-green-100 text-green-800';
        break;
      case 'Inativo':
        statusClass = 'bg-red-100 text-red-800';
        break;
      case 'Rascunho':
        statusClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
    }

    div.innerHTML = `
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">${menu.name}</h3>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${menu.status}</span>
        </div>
        <div class="space-y-3">
          <div class="flex items-center text-sm text-gray-500">
            <i class="ri-calendar-line mr-2"></i>
            ${menu.eventType}
          </div>
          <div class="flex items-center text-sm text-gray-500">
            <i class="ri-list-check-2 mr-2"></i>
            ${totalItems} itens
          </div>
        </div>
        <div class="mt-4 space-y-2">
          ${menu.categories.map(category => `
            <div class="flex items-center text-sm text-gray-700">
              <i class="ri-checkbox-circle-line mr-2 text-primary"></i>
              ${category.name} (${categoryItemCounts[category.name]})
            </div>
          `).join('')}
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button class="edit-menu-btn !rounded-button bg-white border border-gray-300 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50">
            <i class="ri-edit-line"></i>
          </button>
          <button class="delete-menu-btn !rounded-button bg-white border border-gray-300 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50">
            <i class="ri-delete-bin-line"></i>
          </button>
          <button class="view-menu-btn !rounded-button bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90">Ver Detalhes</button>
        </div>
      </div>
    `;

    // Adicionar eventos aos botões
    div.querySelector('.edit-menu-btn').addEventListener('click', () => this.showEditMenuModal(menu));
    div.querySelector('.delete-menu-btn').addEventListener('click', () => this.showDeleteConfirmation(menu));
    div.querySelector('.view-menu-btn').addEventListener('click', () => this.showMenuDetails(menu));

    return div;
  }

  async showMenuDetails(menu) {
    // Preencher o modal com os detalhes do cardápio
    const modalTitle = document.getElementById('menuDetailsTitle');
    const modalContent = document.getElementById('menuDetailsContent');
    
    modalTitle.textContent = menu.name;
    modalContent.innerHTML = '';
    
    // Adicionar cada categoria do menu
    menu.categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      
      categoryDiv.innerHTML = `
        <h3 class="text-lg font-medium text-gray-900 mb-4">${category.name}</h3>
        <div class="space-y-4">
          ${category.items.map(item => `
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">${item.name}</h4>
                <p class="text-sm text-gray-500">${item.description}</p>
              </div>
              <span class="text-sm font-medium text-gray-900">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            </div>
          `).join('')}
        </div>
      `;
      
      modalContent.appendChild(categoryDiv);
    });
    
    // Exibir o modal
    document.getElementById('menuDetailsModal').classList.remove('hidden');
  }

  showEditMenuModal(menu) {
    this.currentlyEditingMenu = menu;
    const modal = document.getElementById('newMenuModal');
    
    // Atualizar título do modal
    modal.querySelector('h2').textContent = 'Editar Cardápio';
    
    // Preencher o formulário com os dados do menu
    const form = modal.querySelector('form');
    form.querySelector('input[type="text"]').value = menu.name;
    
    // Selecionar o tipo de evento
    const selectEventType = form.querySelector('select');
    for (let i = 0; i < selectEventType.options.length; i++) {
      if (selectEventType.options[i].text === menu.eventType) {
        selectEventType.selectedIndex = i;
        break;
      }
    }
    
    // Selecionar o status
    const statusRadios = form.querySelectorAll('input[name="status"]');
    statusRadios.forEach(radio => {
      if (radio.nextElementSibling.textContent.trim() === menu.status) {
        radio.checked = true;
      }
    });
    
    // Marcar as categorias e preencher os itens
    menu.categories.forEach(category => {
      let categoryName = category.name.toLowerCase();
      if (categoryName === 'pratos principais') categoryName = 'pratos';
      
      const checkbox = form.querySelector(`input[type="checkbox"][onchange*="${categoryName}"]`);
      if (checkbox) {
        checkbox.checked = true;
        
        // Exibir a seção de itens
        const itemsContainer = document.getElementById(`${categoryName}-items`);
        itemsContainer.classList.remove('hidden');
        
        // Limpar itens existentes
        const itemsList = document.getElementById(`${categoryName}-list`);
        itemsList.innerHTML = '';
        
        // Adicionar os itens
        category.items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'flex items-center gap-2 bg-gray-50 p-2 rounded-lg';
          itemDiv.innerHTML = `
            <div class="flex-1">
              <div class="text-sm font-medium">${item.name}</div>
              <div class="text-sm text-gray-500">${item.description}</div>
            </div>
            <div class="text-sm font-medium">R$ ${item.price.toFixed(2)}</div>
            <button onclick="removeItem(this)" class="!rounded-button p-1.5 text-red-500 hover:bg-red-50 transition-colors duration-200">
              <i class="ri-delete-bin-line"></i>
            </button>
          `;
          itemsList.appendChild(itemDiv);
        });
      }
    });
    
    // Alterar o texto e a função do botão de submit
    const submitButton = form.querySelector('button[type="button"]:last-child');
    submitButton.textContent = 'Salvar Alterações';
    submitButton.onclick = (e) => this.handleEditMenu(e);
    
    // Mostrar o modal
    modal.classList.remove('hidden');
  }

  handleEditMenu(event) {
    event.preventDefault();
    
    if (!this.currentlyEditingMenu) {
      console.error('Nenhum cardápio selecionado para edição');
      return;
    }
    
    const form = document.querySelector('#newMenuModal form');
    const menuName = form.querySelector('input[type="text"]').value;
    const eventType = form.querySelector('select').value;
    const statusRadio = form.querySelector('input[name="status"]:checked');
    const status = statusRadio ? statusRadio.nextElementSibling.textContent.trim() : null;
    
    // Verificar campos obrigatórios
    if (!menuName || eventType === 'Selecione o tipo de evento' || !status) {
      const errorFields = [];
      if (!menuName) errorFields.push('Nome do Cardápio');
      if (eventType === 'Selecione o tipo de evento') errorFields.push('Tipo de Evento');
      if (!status) errorFields.push('Status');
      
      this.showFormError(form, `Por favor, preencha os campos obrigatórios: ${errorFields.join(', ')}`);
      return;
    }
    
    // Obter categorias selecionadas e seus itens
    const categories = [];
    
    const categoryCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const categoryName = checkbox.nextElementSibling.textContent.trim();
        let categoryId = '';
        
        // Determinar o ID da categoria a partir do nome
        if (categoryName === 'Entradas') categoryId = 'entradas';
        else if (categoryName === 'Pratos Principais') categoryId = 'pratos';
        else if (categoryName === 'Sobremesas') categoryId = 'sobremesas';
        else if (categoryName === 'Bebidas') categoryId = 'bebidas';
        
        const itemsList = document.getElementById(`${categoryId}-list`);
        const items = [];
        
        // Obter itens da categoria
        if (itemsList) {
          const itemElements = itemsList.querySelectorAll('.flex-1');
          itemElements.forEach(itemEl => {
            const nameEl = itemEl.querySelector('.font-medium');
            const descriptionEl = itemEl.querySelector('.text-gray-500');
            const priceEl = itemEl.parentElement.querySelector('.text-sm.font-medium:last-of-type');
            
            if (nameEl && descriptionEl && priceEl) {
              const price = parseFloat(priceEl.textContent.replace('R$ ', '').replace(',', '.'));
              
              items.push({
                name: nameEl.textContent,
                description: descriptionEl.textContent,
                price: price
              });
            }
          });
        }
        
        if (items.length > 0) {
          categories.push({
            name: categoryName,
            items: items
          });
        }
      }
    });
    
    // Verificar se pelo menos uma categoria foi selecionada
    if (categories.length === 0) {
      this.showFormError(form, 'Por favor, selecione pelo menos uma categoria e adicione itens');
      return;
    }
    
    // Atualizar o cardápio
    const updatedMenu = {
      ...this.currentlyEditingMenu,
      name: menuName,
      eventType: eventType,
      status: status,
      categories: categories
    };
    
    // Em um ambiente real, enviar para a API
    // Simular atualização no array local
    const index = this.menus.findIndex(m => m.id === updatedMenu.id);
    if (index !== -1) {
      this.menus[index] = updatedMenu;
      this.renderMenus();
      
      // Fechar modal e mostrar mensagem de sucesso
      this.closeNewMenuModal();
      this.showSuccessMessage('Cardápio atualizado com sucesso!');
    }
  }

  showDeleteConfirmation(menu) {
    this.currentlyDeletingMenu = menu;
    document.getElementById('deleteConfirmationModal').classList.remove('hidden');
  }

  deleteMenu() {
    if (!this.currentlyDeletingMenu) {
      console.error('Nenhum cardápio selecionado para exclusão');
      return;
    }
    
    // Em um ambiente real, enviar para a API
    // Simular exclusão no array local
    this.menus = this.menus.filter(m => m.id !== this.currentlyDeletingMenu.id);
    this.renderMenus();
    
    // Fechar modal e mostrar mensagem de sucesso
    this.closeDeleteConfirmation();
    this.showSuccessMessage('Cardápio excluído com sucesso!');
  }

  handleCreateMenu(event) {
    event.preventDefault();
    
    const form = document.querySelector('#newMenuModal form');
    const menuName = form.querySelector('input[type="text"]').value;
    const eventType = form.querySelector('select').value;
    const statusRadio = form.querySelector('input[name="status"]:checked');
    const status = statusRadio ? statusRadio.nextElementSibling.textContent.trim() : null;
    
    // Verificar campos obrigatórios
    if (!menuName || eventType === 'Selecione o tipo de evento' || !status) {
      const errorFields = [];
      if (!menuName) errorFields.push('Nome do Cardápio');
      if (eventType === 'Selecione o tipo de evento') errorFields.push('Tipo de Evento');
      if (!status) errorFields.push('Status');
      
      this.showFormError(form, `Por favor, preencha os campos obrigatórios: ${errorFields.join(', ')}`);
      return;
    }
    
    // Obter categorias selecionadas e seus itens
    const categories = [];
    
    const categoryCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const categoryName = checkbox.nextElementSibling.textContent.trim();
        let categoryId = '';
        
        // Determinar o ID da categoria a partir do nome
        if (categoryName === 'Entradas') categoryId = 'entradas';
        else if (categoryName === 'Pratos Principais') categoryId = 'pratos';
        else if (categoryName === 'Sobremesas') categoryId = 'sobremesas';
        else if (categoryName === 'Bebidas') categoryId = 'bebidas';
        
        const itemsList = document.getElementById(`${categoryId}-list`);
        const items = [];
        
        // Obter itens da categoria
        if (itemsList) {
          const itemElements = itemsList.querySelectorAll('.flex-1');
          itemElements.forEach(itemEl => {
            const nameEl = itemEl.querySelector('.font-medium');
            const descriptionEl = itemEl.querySelector('.text-gray-500');
            const priceEl = itemEl.parentElement.querySelector('.text-sm.font-medium:last-of-type');
            
            if (nameEl && descriptionEl && priceEl) {
              const price = parseFloat(priceEl.textContent.replace('R$ ', '').replace(',', '.'));
              
              items.push({
                name: nameEl.textContent,
                description: descriptionEl.textContent,
                price: price
              });
            }
          });
        }
        
        if (items.length > 0) {
          categories.push({
            name: categoryName,
            items: items
          });
        }
      }
    });
    
    // Verificar se pelo menos uma categoria foi selecionada
    if (categories.length === 0) {
      this.showFormError(form, 'Por favor, selecione pelo menos uma categoria e adicione itens');
      return;
    }
    
    // Criar novo cardápio
    const newMenu = {
      id: this.menus.length > 0 ? Math.max(...this.menus.map(m => m.id)) + 1 : 1,
      name: menuName,
      eventType: eventType,
      status: status,
      categories: categories
    };
    
    // Em um ambiente real, enviar para a API
    // Simular adição no array local
    this.menus.unshift(newMenu);
    this.renderMenus();
    
    // Resetar formulário e fechar modal
    form.reset();
    this.resetCategoryItems();
    this.closeNewMenuModal();
    
    // Mostrar mensagem de sucesso
    this.showSuccessMessage('Cardápio criado com sucesso!');
  }

  resetCategoryItems() {
    ['entradas', 'pratos', 'sobremesas', 'bebidas'].forEach(category => {
      document.getElementById(`${category}-list`).innerHTML = '';
      document.getElementById(`${category}-items`).classList.add('hidden');
    });
  }

  showFormError(form, message) {
    // Remover mensagem de erro existente
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Criar e adicionar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-600 text-sm mt-4';
    errorDiv.textContent = message;
    
    const submitButton = form.querySelector('button[type="button"]:last-child');
    form.insertBefore(errorDiv, submitButton.parentElement);
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.querySelector('span').textContent = message;
    successMessage.classList.remove('hidden');
    
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 3000);
  }

  setupEventListeners() {
    // Evento de busca
    const searchInput = document.querySelector('input[placeholder="Buscar cardápios..."]');
    searchInput.addEventListener('input', (e) => {
      this.filters.searchTerm = e.target.value;
      this.renderMenus();
    });
    
    // Eventos para filtros de tipo de evento
    const eventTypeLinks = document.querySelectorAll('#eventFilterDropdown a');
    eventTypeLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filters.eventType = e.target.textContent;
        this.renderMenus();
        document.getElementById('eventFilterDropdown').classList.add('hidden');
      });
    });
    
    // Eventos para filtros de status
    const statusLinks = document.querySelectorAll('#statusFilterDropdown a');
    statusLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filters.status = e.target.textContent;
        this.renderMenus();
        document.getElementById('statusFilterDropdown').classList.add('hidden');
      });
    });
    
    // Funções globais para os modais
    window.toggleEventFilter = () => {
      document.getElementById('eventFilterDropdown').classList.toggle('hidden');
    };
    
    window.toggleStatusFilter = () => {
      document.getElementById('statusFilterDropdown').classList.toggle('hidden');
    };
    
    window.showNewMenuModal = () => {
      const modal = document.getElementById('newMenuModal');
      modal.querySelector('h2').textContent = 'Novo Cardápio';
      modal.querySelector('form').reset();
      this.resetCategoryItems();
      
      const submitButton = modal.querySelector('button[type="button"]:last-child');
      submitButton.textContent = 'Criar Cardápio';
      submitButton.onclick = (e) => this.handleCreateMenu(e);
      
      modal.classList.remove('hidden');
    };
    
    window.closeNewMenuModal = () => {
      this.closeNewMenuModal();
    };
    
    window.closeMenuDetails = () => {
      this.closeMenuDetails();
    };
    
    window.closeDeleteConfirmation = () => {
      this.closeDeleteConfirmation();
    };
    
    window.deleteMenu = () => {
      this.deleteMenu();
    };
    
    window.toggleCategoryItems = (checkbox, category) => {
      const itemsContainer = document.getElementById(`${category}-items`);
      if (checkbox.checked) {
        itemsContainer.classList.remove('hidden');
      } else {
        itemsContainer.classList.add('hidden');
        // Limpar itens quando a categoria for desmarcada
        document.getElementById(`${category}-list`).innerHTML = '';
      }
    };
    
    window.addItemToCategory = (category) => {
      const container = document.getElementById(`${category}-items`);
      const nameInput = container.querySelector('input[placeholder="Nome do item"]');
      const descInput = container.querySelector('input[placeholder="Descrição"]');
      const priceInput = container.querySelector('input[placeholder="Preço"]');
      
      // Remover mensagem de erro existente
      const existingError = container.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Validar inputs
      const errors = [];
      if (!nameInput.value.trim()) errors.push('Nome do item');
      if (!descInput.value.trim()) errors.push('Descrição');
      if (!priceInput.value || isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) errors.push('Preço válido');
      
      if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-600 text-sm mt-2';
        errorDiv.textContent = `Por favor, preencha os campos obrigatórios: ${errors.join(', ')}`;
        container.querySelector('.flex').insertAdjacentElement('afterend', errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
        return;
      }
      
      const itemsList = document.getElementById(`${category}-list`);
      const itemDiv = document.createElement('div');
      itemDiv.className = 'flex items-center gap-2 bg-gray-50 p-2 rounded-lg animate-fade-in';
      itemDiv.innerHTML = `
        <div class="flex-1">
          <div class="text-sm font-medium">${nameInput.value.trim()}</div>
          <div class="text-sm text-gray-500">${descInput.value.trim()}</div>
        </div>
        <div class="text-sm font-medium">R$ ${parseFloat(priceInput.value).toFixed(2)}</div>
        <button onclick="removeItem(this)" class="!rounded-button p-1.5 text-red-500 hover:bg-red-50 transition-colors duration-200">
          <i class="ri-delete-bin-line"></i>
        </button>
      `;
      
      // Adicionar com animação
      itemDiv.style.opacity = '0';
      itemDiv.style.transform = 'translateY(10px)';
      itemsList.appendChild(itemDiv);
      
      // Trigger reflow
      itemDiv.offsetHeight;
      
      // Aplicar animação
      itemDiv.style.transition = 'all 0.3s ease-out';
      itemDiv.style.opacity = '1';
      itemDiv.style.transform = 'translateY(0)';
      
      // Mostrar mensagem de sucesso
      const successDiv = document.createElement('div');
      successDiv.className = 'text-green-600 text-sm mt-2';
      successDiv.textContent = 'Item adicionado com sucesso!';
      container.querySelector('.flex').insertAdjacentElement('afterend', successDiv);
      setTimeout(() => successDiv.remove(), 2000);
      
      // Limpar inputs com animação
      nameInput.style.transition = 'background-color 0.3s';
      descInput.style.transition = 'background-color 0.3s';
      priceInput.style.transition = 'background-color 0.3s';
      
      nameInput.style.backgroundColor = '#f0fdf4';
      descInput.style.backgroundColor = '#f0fdf4';
      priceInput.style.backgroundColor = '#f0fdf4';
      
      setTimeout(() => {
        nameInput.value = '';
        descInput.value = '';
        priceInput.value = '';
        nameInput.style.backgroundColor = '';
        descInput.style.backgroundColor = '';
        priceInput.style.backgroundColor = '';
      }, 200);
    };
    
    window.removeItem = (button) => {
      const item = button.parentElement;
      item.style.transition = 'all 0.3s ease-out';
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      setTimeout(() => item.remove(), 300);
    };
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[onclick="toggleEventFilter()"]') && !event.target.closest('#eventFilterDropdown')) {
        document.getElementById('eventFilterDropdown').classList.add('hidden');
      }
      
      if (!event.target.closest('[onclick="toggleStatusFilter()"]') && !event.target.closest('#statusFilterDropdown')) {
        document.getElementById('statusFilterDropdown').classList.add('hidden');
      }
    });
  }

  closeNewMenuModal() {
    document.getElementById('newMenuModal').classList.add('hidden');
  }

  closeMenuDetails() {
    document.getElementById('menuDetailsModal').classList.add('hidden');
  }

  closeDeleteConfirmation() {
    document.getElementById('deleteConfirmationModal').classList.add('hidden');
  }
}

// Inicializar a página quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new MenusPage();
});

export default MenusPage; 