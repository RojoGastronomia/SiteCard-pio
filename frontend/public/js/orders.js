// Função para carregar os pedidos do usuário
async function loadOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao carregar pedidos');
        }

        displayOrders(data.orders);
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar pedidos');
    }
}

// Função para exibir os pedidos na tabela
function displayOrders(orders) {
    const tbody = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '';
        noOrders.style.display = 'block';
        return;
    }

    noOrders.style.display = 'none';
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${order.event_type}</td>
            <td>R$ ${formatPrice(order.total)}</td>
            <td>
                <span class="badge bg-${getStatusColor(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showOrderDetails(${order.id})">
                    <i class="bi bi-eye"></i>
                </button>
                ${order.status === 'pendente' ? `
                    <button class="btn btn-sm btn-danger ms-1" onclick="cancelOrder(${order.id})">
                        <i class="bi bi-x-circle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Função para mostrar detalhes do pedido
async function showOrderDetails(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao carregar detalhes do pedido');
        }

        // Preencher informações no modal
        document.getElementById('orderNumber').textContent = data.id;
        document.getElementById('orderDate').textContent = formatDate(data.created_at);
        document.getElementById('orderType').textContent = data.event_type;
        document.getElementById('orderStatus').textContent = data.status;
        document.getElementById('clientName').textContent = data.client_name;
        document.getElementById('clientEmail').textContent = data.client_email;
        document.getElementById('clientPhone').textContent = data.client_phone;

        // Preencher itens do pedido
        const itemsTable = document.getElementById('orderItems');
        itemsTable.innerHTML = data.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${formatPrice(item.price)}</td>
                <td>R$ ${formatPrice(item.price * item.quantity)}</td>
            </tr>
        `).join('');

        // Preencher valores
        document.getElementById('orderSubtotal').textContent = `R$ ${formatPrice(data.subtotal)}`;
        document.getElementById('orderServiceFee').textContent = `R$ ${formatPrice(data.service_fee)}`;
        document.getElementById('orderTotal').textContent = `R$ ${formatPrice(data.total)}`;

        // Mostrar/esconder botão de cancelar
        const cancelBtn = document.getElementById('cancelOrderBtn');
        cancelBtn.style.display = data.status === 'pendente' ? 'block' : 'none';
        cancelBtn.onclick = () => cancelOrder(data.id);

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar detalhes do pedido');
    }
}

// Função para cancelar pedido
async function cancelOrder(orderId) {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao cancelar pedido');
        }

        showSuccess('Pedido cancelado com sucesso');
        loadOrders(); // Recarregar lista de pedidos

        // Fechar modal de detalhes se estiver aberto
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao cancelar pedido');
    }
}

// Funções auxiliares
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPrice(price) {
    return Number(price).toFixed(2);
}

function getStatusColor(status) {
    const colors = {
        'pendente': 'warning',
        'confirmado': 'info',
        'concluido': 'success',
        'cancelado': 'danger'
    };
    return colors[status] || 'secondary';
}

// Configurar filtros
document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('statusFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // Aplicar filtros quando alterados
    [statusFilter, startDate, endDate].forEach(element => {
        element.addEventListener('change', applyFilters);
    });
});

// Função para aplicar filtros
async function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();
        
        if (status) queryParams.append('status', status);
        if (start) queryParams.append('start_date', start);
        if (end) queryParams.append('end_date', end);

        const response = await fetch(`http://localhost:3000/api/orders?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao filtrar pedidos');
        }

        displayOrders(data.orders);
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao filtrar pedidos');
    }
}

// Funções para mostrar mensagens
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
} 