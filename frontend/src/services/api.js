// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Serviço de autenticação
export const authService = {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Erro ao fazer login');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Erro ao registrar usuário');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
};

// Serviço de cardápios
export const menuService = {
  async getAllMenus() {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`);
      if (!response.ok) throw new Error('Erro ao buscar cardápios');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async getMenuById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar cardápio');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
};

// Serviço de eventos
export const eventService = {
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Erro ao buscar eventos');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async getEventById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar evento');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
};

// API principal
const api = {
  auth: authService,
  menus: menuService,
  events: eventService
};

export default api; 