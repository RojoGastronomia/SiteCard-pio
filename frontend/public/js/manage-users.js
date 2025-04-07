// Verificar autenticação e permissões
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    updateNavbar();
    initializeFilters();
    loadUsers();
    setupEventListeners();
});

// Inicializar filtros
function initializeFilters() {
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchFilter = document.getElementById('searchFilter');

    // Adicionar event listeners para filtros
    [roleFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', loadUsers);
    });

    // Adicionar debounce para o filtro de busca
    let timeout = null;
    searchFilter.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(loadUsers, 500);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botão de adicionar usuário
    document.querySelector('[data-bs-target="#addUserModal"]').addEventListener('click', () => {
        resetUserForm();
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    });

    // Botão de salvar usuário
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);

    // Formulário de usuário
    document.getElementById('userForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveUser();
    });
}

// Carregar usuários com filtros
async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        const filters = {
            role: document.getElementById('roleFilter').value,
            active: document.getElementById('statusFilter').value,
            search: document.getElementById('searchFilter').value
        };

        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:3000/api/users?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar usuários');
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError('Erro ao carregar usuários: ' + error.message);
    }
}

// Exibir usuários na tabela
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.map(user => `
        <tr>
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge bg-${getRoleBadgeColor(user.role)}">
                    ${getRoleDisplay(user.role)}
                </span>
            </td>
            <td>
                <span class="badge bg-${user.active ? 'success' : 'danger'}">
                    ${user.active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="editUser(${user.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-${user.active ? 'danger' : 'success'}" 
                        onclick="toggleUserStatus(${user.id}, ${!user.active})">
                    <i class="bi bi-${user.active ? 'person-x' : 'person-check'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Editar usuário
async function editUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados do usuário');
        
        const user = await response.json();
        
        // Preencher formulário
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userActive').checked = user.active;
        document.getElementById('userPassword').value = '';
        
        // Atualizar título do modal
        document.getElementById('modalTitle').textContent = 'Editar Usuário';
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    } catch (error) {
        showError('Erro ao carregar dados do usuário: ' + error.message);
    }
}

// Salvar usuário (criar/atualizar)
async function saveUser() {
    try {
        const token = localStorage.getItem('token');
        const userId = document.getElementById('userId').value;
        const isNewUser = !userId;

        const userData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            role: document.getElementById('userRole').value,
            active: document.getElementById('userActive').checked
        };

        // Adicionar senha apenas se fornecida
        const password = document.getElementById('userPassword').value;
        if (password) {
            userData.password = password;
        }

        const response = await fetch(`http://localhost:3000/api/users${isNewUser ? '' : '/' + userId}`, {
            method: isNewUser ? 'POST' : 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Erro ao salvar usuário');

        showSuccess(`Usuário ${isNewUser ? 'criado' : 'atualizado'} com sucesso!`);
        loadUsers();

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        modal.hide();
    } catch (error) {
        showError('Erro ao salvar usuário: ' + error.message);
    }
}

// Alternar status do usuário
async function toggleUserStatus(userId, newStatus) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: newStatus })
        });

        if (!response.ok) throw new Error('Erro ao atualizar status do usuário');

        showSuccess('Status do usuário atualizado com sucesso!');
        loadUsers();
    } catch (error) {
        showError('Erro ao atualizar status: ' + error.message);
    }
}

// Resetar formulário
function resetUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('modalTitle').textContent = 'Novo Usuário';
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

function getRoleDisplay(role) {
    const roles = {
        'admin': 'Administrador',
        'gerente': 'Gerente',
        'colaborador': 'Colaborador',
        'cliente': 'Cliente'
    };
    return roles[role] || role;
}

function getRoleBadgeColor(role) {
    const colors = {
        'admin': 'danger',
        'gerente': 'warning',
        'colaborador': 'info',
        'cliente': 'secondary'
    };
    return colors[role] || 'secondary';
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