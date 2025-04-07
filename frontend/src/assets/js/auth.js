// auth.js - Authentication functionality

// Importa o serviço de autenticação
import { authService } from '../../services/api.js';

// Classe para gerenciar autenticação
class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.authService = null;
    }

    // Inicializa o serviço de autenticação
    init() {
        this.authService = authService;
        this.checkAuth();
    }

    // Verifica se o usuário está autenticado
    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(user);
        }
    }

    // Realiza o login
    async login(email, password) {
        try {
            const response = await this.authService.login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.isAuthenticated = true;
            this.currentUser = response.user;
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    }

    // Realiza o logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    // Registra um novo usuário
    async register(userData) {
        try {
            const response = await this.authService.register(userData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.isAuthenticated = true;
            this.currentUser = response.user;
            return true;
        } catch (error) {
            console.error('Erro no registro:', error);
            return false;
        }
    }

    // Retorna o usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verifica se o usuário está logado
    isLoggedIn() {
        return this.isAuthenticated;
    }
}

// Cria e exporta uma instância do Auth
export const authManager = new Auth();

// Main authentication controller
const authController = {
    init(apiService) {
        // Store the API service
        authService = apiService;
        
        // Initialize auth elements
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupLogoutButton();
        this.checkAuthStatus();
        this.checkProtectedPages();
    },
    
    // Setup login form event listeners
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    loginError.classList.add('d-none');
                    await authManager.login(email, password);
                    
                    // Close modal after successful login
                    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (modal) {
                        modal.hide();
                    }
                    
                    // Update UI for logged in user
                    this.updateAuthUI();
                    
                    // Redirect to dashboard if admin
                    const user = authManager.getCurrentUser();
                    if (user && user.role === 'admin') {
                        window.location.href = '/dashboard.html';
                    } else {
                        // Reload the current page to update UI
                        window.location.reload();
                    }
                } catch (error) {
                    loginError.textContent = error.message || 'Login failed. Please try again.';
                    loginError.classList.remove('d-none');
                }
            });
        }
    },
    
    // Setup register form event listeners
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const registerError = document.getElementById('registerError');
                
                // Validate password match
                if (password !== confirmPassword) {
                    registerError.textContent = 'Passwords do not match';
                    registerError.classList.remove('d-none');
                    return;
                }
                
                try {
                    registerError.classList.add('d-none');
                    await authManager.register({ name, email, password });
                    
                    // Close modal after successful registration
                    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    if (modal) {
                        modal.hide();
                    }
                    
                    // Show success message
                    alert('Registration successful! You can now log in.');
                    
                    // Open login modal
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                } catch (error) {
                    registerError.textContent = error.message || 'Registration failed. Please try again.';
                    registerError.classList.remove('d-none');
                }
            });
        }
    },
    
    // Setup logout button event listener
    setupLogoutButton() {
        const logoutBtn = document.querySelector('#logout-btn a');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
                window.location.href = '/';
            });
        }
    },
    
    // Function to update UI based on authentication status
    updateAuthUI() {
        const user = authManager.getCurrentUser();
        const loginBtn = document.getElementById('login-btn');
        const dashboardBtn = document.getElementById('dashboard-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (!loginBtn || !dashboardBtn || !logoutBtn) return;
        
        if (user) {
            loginBtn.classList.add('d-none');
            logoutBtn.classList.remove('d-none');
            
            if (user.role === 'admin') {
                dashboardBtn.classList.remove('d-none');
            } else {
                dashboardBtn.classList.add('d-none');
            }
        } else {
            loginBtn.classList.remove('d-none');
            dashboardBtn.classList.add('d-none');
            logoutBtn.classList.add('d-none');
        }
    },
    
    // Function to check authentication status on page load
    async checkAuthStatus() {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Validate the token
                await authManager.isLoggedIn();
                
                // Update UI for logged in user
                this.updateAuthUI();
        } catch (error) {
                console.error('Token validation failed:', error);
                authManager.logout();
            }
        }
    },
    
    // Check if current page is protected and redirect if needed
    checkProtectedPages() {
        const currentPath = window.location.pathname;
        
        // Protected routes that require authentication
        const protectedRoutes = [
            '/dashboard.html',
            '/admin/'
        ];
        
        // Check if current path is a protected route
        const isProtectedRoute = protectedRoutes.some(route => 
            currentPath.includes(route) || currentPath.startsWith(route)
        );
        
        if (isProtectedRoute) {
            const token = localStorage.getItem('token');
            const user = authManager.getCurrentUser();
            
            if (!token || !user) {
                // Redirect to home if not authenticated
                window.location.href = '/';
            } else if (currentPath.includes('/dashboard.html') && user.role !== 'admin') {
                // Check role for admin pages
                window.location.href = '/';
            }
        }
    }
};

// Export the auth module
export default authController;