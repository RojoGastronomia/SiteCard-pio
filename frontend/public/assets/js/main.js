// main.js - Módulo principal da aplicação

import { auth } from './auth/auth.js';
import { modals } from './modals/modals.js';
import { events } from './components/events.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjp5U6OmKREqB5DFOWn3eAkUC5E26MRT4",
    authDomain: "explosaorojo.firebaseapp.com",
    projectId: "explosaorojo",
    storageBucket: "explosaorojo.firebasestorage.app",
    messagingSenderId: "407190784605",
    appId: "1:407190784605:web:285cf70c6e0a9dbf0bdbb4",
    measurementId: "G-035R706Z68"
};

// Objeto principal da aplicação
const app = {
    // Inicialização da aplicação
    init() {
        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);

        // Inicializar módulos
        auth.init();
        modals.init();
        events.init();

        // Expor módulos globalmente para uso em eventos inline
        window.auth = auth;
        window.modals = modals;
        window.events = events;

        // Configurar tema Tailwind
        this.configureTailwind();
    },

    // Configuração do tema Tailwind
    configureTailwind() {
        if (window.tailwind) {
            window.tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: '#FF6B6B',
                            secondary: '#4ECDC4'
                        },
                        borderRadius: {
                            'none': '0px',
                            'sm': '4px',
                            DEFAULT: '8px',
                            'md': '12px',
                            'lg': '16px',
                            'xl': '20px',
                            '2xl': '24px',
                            '3xl': '32px',
                            'full': '9999px',
                            'button': '8px'
                        }
                    }
                }
            };
        }
    }
};

// Inicializar a aplicação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
