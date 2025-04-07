const API_URL = 'http://localhost:3000/api';

// Credenciais de teste (em produção, isso deve vir de um backend seguro)
const ADMIN_CREDENTIALS = {
    email: 'admin@rojo.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
};

// Função para fazer requisições à API
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Algo deu errado');
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Função para mostrar mensagens de erro
function showError(message) {
    const errorModal = new bootstrap.Modal(document.createElement('div'));
    errorModal.element.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-danger">Erro</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    <p class="mt-3">${message}</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(errorModal.element);
    errorModal.show();
    
    setTimeout(() => {
        errorModal.hide();
        setTimeout(() => errorModal.element.remove(), 150);
    }, 3000);
}

// Função para mostrar mensagens de sucesso
function showSuccess(message) {
    const successModal = new bootstrap.Modal(document.createElement('div'));
    successModal.element.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-success">Sucesso</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                    <p class="mt-3">${message}</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(successModal.element);
    successModal.show();
    
    setTimeout(() => {
        successModal.hide();
        setTimeout(() => successModal.element.remove(), 150);
    }, 3000);
}

// Função para verificar credenciais
function checkCredentials(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        return {
            success: true,
            user: {
                id: 1,
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                role: ADMIN_CREDENTIALS.role
            },
            token: 'admin-token-' + Date.now() // Em produção, isso deve ser um JWT válido
        };
    }
    return {
        success: false,
        message: 'Credenciais inválidas'
    };
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return token && user;
}

// Função para verificar se o usuário é admin
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
}

// Função para redirecionar para o sistema interno se for admin
function redirectIfAdmin() {
    if (isAdmin()) {
        window.location.href = 'admin/dashboard.html';
    }
}

// Função para atualizar a interface baseada no tipo de usuário
function updateInterface() {
    const userArea = document.getElementById('userArea');
    if (!userArea) return;

    if (isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem('user'));
        const isAdminUser = user.role === 'admin';

        userArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-success dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i>
                    ${user.name}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${isAdminUser ? `
                        <li><a class="dropdown-item" href="admin/dashboard.html">
                            <i class="bi bi-speedometer2 me-2"></i>Sistema Interno
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                    ` : ''}
                    <li><a class="dropdown-item" href="meus-pedidos.html">
                        <i class="bi bi-bag me-2"></i>Meus Pedidos
                    </a></li>
                    <li><a class="dropdown-item" href="perfil.html">
                        <i class="bi bi-person me-2"></i>Meu Perfil
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="handleLogout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Sair
                    </a></li>
                </ul>
            </div>
        `;
    } else {
        userArea.innerHTML = `
            <button class="btn btn-outline-success" onclick="openLoginModal()">Login</button>
        `;
    }
}

// Função para fazer logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

// Função para mostrar mensagens de feedback
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
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

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Função para criar o container de toasts
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    updateInterface();
    redirectIfAdmin();
});

// Gerenciamento de autenticação e controle de acesso
const auth = {
    token: null,
    user: null,

    // Inicializa o estado de autenticação
    init() {
        this.token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
            this.updateUI();
        }
    },

    // Atualiza a UI baseado no estado de autenticação e papel do usuário
    updateUI() {
        const guestActions = document.getElementById('guest-actions');
        const userActions = document.getElementById('user-actions');
        const userName = document.getElementById('userName');
        
        // Elementos baseados em papel
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const managerOnlyElements = document.querySelectorAll('.manager-only');
        const userOnlyElements = document.querySelectorAll('.user-only');

        if (this.token && this.user) {
            // Usuário está logado
            guestActions.style.display = 'none';
            userActions.style.display = 'block';
            userName.textContent = this.user.name;

            // Controle de acesso baseado em papel
            if (this.user.role === 'admin') {
                adminOnlyElements.forEach(el => el.style.display = 'block');
                managerOnlyElements.forEach(el => el.style.display = 'block');
                userOnlyElements.forEach(el => el.style.display = 'block');
            } else if (this.user.role === 'gerente') {
                adminOnlyElements.forEach(el => el.style.display = 'none');
                managerOnlyElements.forEach(el => el.style.display = 'block');
                userOnlyElements.forEach(el => el.style.display = 'block');
            } else if (this.user.role === 'colaborador') {
                adminOnlyElements.forEach(el => el.style.display = 'none');
                managerOnlyElements.forEach(el => el.style.display = 'none');
                userOnlyElements.forEach(el => el.style.display = 'block');
            } else {
                // Cliente regular
                adminOnlyElements.forEach(el => el.style.display = 'none');
                managerOnlyElements.forEach(el => el.style.display = 'none');
                userOnlyElements.forEach(el => el.style.display = 'block');
            }
        } else {
            // Usuário não está logado
            guestActions.style.display = 'block';
            userActions.style.display = 'none';
            adminOnlyElements.forEach(el => el.style.display = 'none');
            managerOnlyElements.forEach(el => el.style.display = 'none');
            userOnlyElements.forEach(el => el.style.display = 'none');
        }
    },

    // Login
    async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    // Registro
    async register(name, email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    },

    // Logout
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateUI();
        window.location.href = '/';
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa autenticação
    auth.init();

    // Form de Login
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (await auth.login(email, password)) {
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            showToast('Login successful', 'success');
        } else {
            showToast('Login failed', 'error');
        }
    });

    // Form de Registro
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (await auth.register(name, email, password)) {
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            registerModal.hide();
            showToast('Registration successful', 'success');
        } else {
            showToast('Registration failed', 'error');
        }
    });

    // Botão de Logout
    const logoutButton = document.getElementById('logoutButton');
    logoutButton?.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
});

// Função para recuperar senha
async function forgotPassword(email) {
    try {
        await fetchAPI('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });

        showSuccess('Email de recuperação enviado com sucesso!');
    } catch (error) {
        showError(error.message);
    }
}

// Função para redefinir senha
async function resetPassword(token, password) {
    try {
        await fetchAPI('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        });

        showSuccess('Senha atualizada com sucesso!');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
    } catch (error) {
        showError(error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação e atualizar navbar
    updateNavbar();

    // Form de Recuperação de Senha
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = forgotPasswordForm.querySelector('input[type="email"]').value;
            await forgotPassword(email);
        });
    }

    // Form de Recuperação de Senha
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = resetPasswordForm.querySelector('#resetToken').value;
            const password = resetPasswordForm.querySelector('#resetPassword').value;
            await resetPassword(token, password);
        });
    }
}); 