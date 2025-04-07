// Verificar autenticação e permissões
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !['admin', 'gerente'].includes(user.role)) {
        window.location.href = 'index.html';
        return;
    }
    
    updateNavbar();
    initializeFilters();
    loadOrders();
});

// Inicializar filtros
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const customerFilter = document.getElementById('customerFilter');

    // Definir data inicial como início do mês atual
    const firstDay = new Date();
    firstDay.setDate(1);
    startDate.value = firstDay.toISOString().split('T')[0];

    // Definir data final como hoje
    const today = new Date();
    endDate.value = today.toISOString().split('T')[0];

    // Adicionar event listeners para filtros
    [statusFilter, startDate, endDate, customerFilter].forEach(filter => {
        filter.addEventListener('change', loadOrders);
    });

    // Adicionar debounce para o filtro de cliente
    let timeout = null;
    customerFilter.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(loadOrders, 500);
    });
}

// Carregar pedidos com filtros
async function loadOrders() {
    try {
        const token = localStorage.getItem('token');
        const filters = {
            status: document.getElementById('statusFilter').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            customer: document.getElementById('customerFilter').value
        };

        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:3000/api/orders?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar pedidos');
        
        const orders = await response.json();
        displayOrders(orders);
        updateStatistics(orders);
    } catch (error) {
        showError('Erro ao carregar pedidos: ' + error.message);
    }
}

// Exibir pedidos na tabela
function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>R$ ${formatPrice(order.total)}</td>
            <td>
                <span class="badge bg-${getStatusColor(order.status)}">
                    ${order.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showOrderDetails(${order.id})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Atualizar estatísticas
function updateStatistics(orders) {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        today: orders.filter(order => order.created_at.startsWith(today)).length,
        pending: orders.filter(order => order.status === 'pendente').length,
        completed: orders.filter(order => order.status === 'entregue').length,
        canceled: orders.filter(order => order.status === 'cancelado').length
    };

    document.getElementById('todayOrders').textContent = stats.today;
    document.getElementById('pendingOrders').textContent = stats.pending;
    document.getElementById('completedOrders').textContent = stats.completed;
    document.getElementById('canceledOrders').textContent = stats.canceled;
}

// Mostrar detalhes do pedido
async function showOrderDetails(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar detalhes do pedido');
        
        const order = await response.json();
        
        // Preencher informações do modal
        document.getElementById('orderIdDetail').textContent = order.id;
        document.getElementById('customerName').textContent = order.customer_name;
        document.getElementById('customerEmail').textContent = order.customer_email;
        document.getElementById('orderDate').textContent = formatDate(order.created_at);
        document.getElementById('orderStatus').textContent = order.status.toUpperCase();
        document.getElementById('updateStatus').value = order.status;
        document.getElementById('orderTotal').textContent = formatPrice(order.total);

        // Preencher itens do pedido
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = order.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${formatPrice(item.price)}</td>
                <td>R$ ${formatPrice(item.price * item.quantity)}</td>
            </tr>
        `).join('');

        // Configurar botão de atualização
        const updateStatusBtn = document.getElementById('updateStatusBtn');
        updateStatusBtn.onclick = () => updateOrderStatus(orderId);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
    } catch (error) {
        showError('Erro ao carregar detalhes do pedido: ' + error.message);
    }
}

// Atualizar status do pedido
async function updateOrderStatus(orderId) {
    try {
        const token = localStorage.getItem('token');
        const newStatus = document.getElementById('updateStatus').value;

        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Erro ao atualizar status do pedido');

        showSuccess('Status do pedido atualizado com sucesso!');
        loadOrders();

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
        modal.hide();
    } catch (error) {
        showError('Erro ao atualizar status: ' + error.message);
    }
}

// Funções auxiliares
function formatDate(dateString) {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('pt-BR', options);
}

function formatPrice(price) {
    return Number(price).toFixed(2).replace('.', ',');
}

function getStatusColor(status) {
    const colors = {
        'pendente': 'warning',
        'preparando': 'info',
        'pronto': 'primary',
        'entregue': 'success',
        'cancelado': 'danger'
    };
    return colors[status] || 'secondary';
}

// Funções para notificações
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');
    
    toast.classList.remove('bg-success', 'bg-danger');
    toast.classList.add(`bg-${type === 'error' ? 'danger' : 'success'}`);
    toastBody.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function showError(message) {
    showToast(message, 'error');
}

function showSuccess(message) {
    showToast(message, 'success');
} 