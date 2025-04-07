// auth.js - Módulo de autenticação

export const auth = {
    // Estado do usuário
    currentUser: null,

    // Inicialização do módulo de autenticação
    init() {
        this.setupAuthStateListener();
        this.setupEventListeners();
    },

    // Configurar listener para mudanças no estado de autenticação
    setupAuthStateListener() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.handleSuccessfulLogin(user);
            }
        });
    },

    // Configurar event listeners para formulários
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    },

    // Manipular tentativa de login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.closeLoginModal();
            this.handleSuccessfulLogin(userCredential.user);
        } catch (error) {
            this.handleAuthError('login', error);
        }
    },

    // Manipular tentativa de cadastro
    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validações
        if (password !== confirmPassword) {
            this.showError('Erro de Cadastro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            this.showError('Erro de Cadastro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: name });
            
            this.closeSignupModal();
            this.showSuccessModal('Conta Criada!', 'Sua conta foi criada com sucesso!');
            this.handleSuccessfulLogin(userCredential.user);
        } catch (error) {
            this.handleAuthError('signup', error);
        }
    },

    // Manipular login bem-sucedido
    handleSuccessfulLogin(user) {
        this.currentUser = user;
        this.updateLoginButton(user);
        this.saveUserData(user);
        this.showSuccessModal('Login realizado!', `Bem-vindo(a), ${user.displayName || 'Usuário'}!`);
    },

    // Atualizar botão de login
    updateLoginButton(user) {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>${user.displayName || 'Usuário'}</span>
                    <i class="ri-arrow-down-s-line"></i>
                </div>
            `;
        }
    },

    // Salvar dados do usuário
    saveUserData(user) {
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email
        }));
    },

    // Manipular erros de autenticação
    handleAuthError(type, error) {
        let errorMessage = '';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Usuário não encontrado.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Senha incorreta.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está em uso.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'A senha é muito fraca.';
                break;
            default:
                errorMessage = `Erro ao ${type === 'login' ? 'fazer login' : 'criar conta'}. Tente novamente.`;
        }
        this.showError(`Erro de ${type === 'login' ? 'Login' : 'Cadastro'}`, errorMessage);
    },

    // Utilitários de UI
    showError(title, message) {
        // Implementar função de mostrar erro
    },

    showSuccessModal(title, message) {
        // Implementar função de mostrar sucesso
    },

    closeLoginModal() {
        document.getElementById('loginModal')?.classList.add('hidden');
    },

    closeSignupModal() {
        document.getElementById('signupModal')?.classList.add('hidden');
    }
};

// Inicializar o módulo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});
