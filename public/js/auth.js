const auth = {
    init() {
        this.initFirebase();
        this.checkAuthState();
        this.setupEventListeners();
    },

    initFirebase() {
        // Initialize Firebase Auth
        this.auth = firebase.auth();
    },

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
    },

    checkAuthState() {
        this.auth.onAuthStateChanged(user => {
            if (user) {
                this.updateUserInterface({
                    name: user.displayName || user.email,
                    email: user.email
                });
            }
        });
    },

    updateUserInterface(user) {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>${user.name}</span>
                    <i class="ri-arrow-down-s-line"></i>
                </div>
            `;
            
            // Add logout dropdown
            this.setupUserDropdown(loginBtn);
        }
    },

    setupUserDropdown(loginBtn) {
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute hidden mt-2 w-48 bg-white rounded-lg shadow-xl';
        dropdown.innerHTML = `
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100" id="logoutBtn">
                Sair
            </button>
        `;
        
        loginBtn.parentElement.classList.add('relative');
        loginBtn.parentElement.appendChild(dropdown);

        loginBtn.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
    },

    showLoginModal() {
        const loginModal = document.createElement('div');
        loginModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        loginModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-xl w-[480px]">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Entrar</h2>
                    <button class="close-login text-gray-500 hover:text-gray-700">
                        <i class="ri-close-line text-2xl"></i>
                    </button>
                </div>
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-gray-700 mb-2">Email</label>
                        <input type="email" name="email" required
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Senha</label>
                        <input type="password" name="password" required
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary">
                    </div>
                    <button type="submit" 
                        class="w-full py-3 bg-primary text-white rounded-button hover:bg-opacity-90">
                        Entrar
                    </button>
                    <p class="text-center text-gray-600">
                        Não tem uma conta? 
                        <a href="#" class="text-primary hover:underline" id="showRegister">Cadastre-se</a>
                    </p>
                </form>
            </div>
        `;

        document.body.appendChild(loginModal);
        this.setupLoginHandlers(loginModal);
    },

    async handleLogin(form, modal) {
        try {
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            modal.remove();
            this.updateUserInterface({
                name: user.displayName || user.email,
                email: user.email
            });
            showSuccessModal('Login realizado!', `Bem-vindo(a)!`);
        } catch (error) {
            showError('Erro de Login', this.getErrorMessage(error));
        }
    },

    async handleLogout() {
        try {
            await this.auth.signOut();
            location.reload();
        } catch (error) {
            showError('Erro ao sair', this.getErrorMessage(error));
        }
    },

    getErrorMessage(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/invalid-email': 'Email inválido',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
        };
        return errorMessages[error.code] || error.message;
    },

    setupLoginHandlers(modal) {
        const form = modal.querySelector('#loginForm');
        const closeBtn = modal.querySelector('.close-login');
        const showRegisterBtn = modal.querySelector('#showRegister');

        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            showRegisterModal();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(form, modal);
        });
    }
};

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});