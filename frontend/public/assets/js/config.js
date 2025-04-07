// config.js - Configurações globais da aplicação

export const CONFIG = {
    // Configurações do Firebase
    firebase: {
        apiKey: "AIzaSyDjp5U6OmKREqB5DFOWn3eAkUC5E26MRT4",
        authDomain: "explosaorojo.firebaseapp.com",
        projectId: "explosaorojo",
        storageBucket: "explosaorojo.firebasestorage.app",
        messagingSenderId: "407190784605",
        appId: "1:407190784605:web:285cf70c6e0a9dbf0bdbb4",
        measurementId: "G-035R706Z68"
    },

    // Configurações de eventos
    events: {
        wedding: {
            minGuests: 50,
            maxGuests: 500,
            basePrice: 150,
            selections: {
                appetizers: 2,
                mainCourses: 3,
                desserts: 2,
                drinks: 4
            }
        },
        corporate: {
            minGuests: 30,
            maxGuests: 300,
            basePrice: 100,
            selections: {
                appetizers: 2,
                mainCourses: 2,
                desserts: 2,
                drinks: 3
            }
        },
        birthday: {
            minGuests: 20,
            maxGuests: 150,
            basePrice: 80,
            selections: {
                appetizers: 3,
                mainCourses: 2,
                desserts: 3,
                drinks: 3
            }
        }
    },

    // Configurações da API
    api: {
        baseUrl: 'http://localhost:3000/api',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    },

    // Configurações de UI
    ui: {
        theme: {
            colors: {
                primary: '#FF6B6B',
                secondary: '#4ECDC4',
                success: '#38A169',
                error: '#E53E3E',
                warning: '#ECC94B',
                info: '#4299E1'
            },
            fonts: {
                body: 'system-ui, sans-serif',
                heading: 'Pacifico, cursive'
            }
        },
        animations: {
            duration: {
                short: 200,
                medium: 300,
                long: 500
            }
        }
    }
};
