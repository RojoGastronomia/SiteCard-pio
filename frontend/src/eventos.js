// Eventos page functionality
import api, { eventService, authService } from './services/api.js';

class EventsPage {
  constructor() {
    this.events = [];
    this.filteredEvents = [];
    this.selectedEvent = null;
    this.init();
  }

  init() {
    // Load events
    this.loadEvents();
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  async loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    try {
      // Load events from API
      this.events = await eventService.getAllEvents();
      
      // Sort events by date (newest first)
      this.events.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Apply initial filter (all events)
      this.filteredEvents = [...this.events];
      
      // Render events
      this.renderEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      eventsContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger text-center">
            Erro ao carregar eventos: ${error.message}
          </div>
        </div>
      `;
    }
  }
  
  renderEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    if (this.filteredEvents.length === 0) {
      eventsContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            Nenhum evento encontrado com os filtros selecionados.
          </div>
        </div>
      `;
      return;
    }
    
    // Generate HTML for events
    const eventsHTML = this.filteredEvents.map(event => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate > new Date();
      
      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            ${event.image ? `<img src="${event.image}" class="card-img-top" alt="${event.title}">` : ''}
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h3 class="card-title">${event.title}</h3>
                <span class="badge bg-${isUpcoming ? 'primary' : 'secondary'}">
                  ${isUpcoming ? 'Próximo' : 'Passado'}
                </span>
              </div>
              <p class="card-text">${event.description ? 
                (event.description.length > 100 ? 
                  event.description.substring(0, 100) + '...' : 
                  event.description) : 
                'Sem descrição disponível.'}</p>
              <p class="card-text">
                <strong>Data:</strong> ${eventDate.toLocaleDateString('pt-BR')}
              </p>
              <p class="card-text">
                <strong>Local:</strong> ${event.location || 'A definir'}
              </p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <button class="btn btn-primary w-100 view-event" data-event-id="${event._id}">
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    eventsContainer.innerHTML = eventsHTML;
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-event').forEach(button => {
      button.addEventListener('click', () => {
        const eventId = button.getAttribute('data-event-id');
        this.showEventDetails(eventId);
      });
    });
  }
  
  async showEventDetails(eventId) {
    // Get modal elements
    const modalTitle = document.getElementById('event-detail-title');
    const modalBody = document.getElementById('event-detail-body');
    const registerBtn = document.getElementById('register-event-btn');
    
    // Reset modal content
    modalTitle.textContent = '';
    modalBody.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p>Carregando detalhes...</p>
      </div>
    `;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    modal.show();
    
    try {
      // Load event details
      const event = await eventService.getEventById(eventId);
      this.selectedEvent = event;
      
      // Update modal title
      modalTitle.textContent = event.title;
      
      // Format date
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate > new Date();
      
      // Generate modal body content
      let bodyContent = '';
      
      // Add image if available
      if (event.image) {
        bodyContent += `<img src="${event.image}" class="img-fluid mb-3" alt="${event.title}">`;
      }
      
      // Add description
      bodyContent += `<p>${event.description || 'Sem descrição disponível.'}</p>`;
      
      // Add badge for upcoming/past event
      bodyContent += `
        <div class="mb-3">
          <span class="badge bg-${isUpcoming ? 'primary' : 'secondary'}">
            ${isUpcoming ? 'Evento Futuro' : 'Evento Passado'}
          </span>
        </div>
      `;
      
      // Add event details
      bodyContent += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Detalhes do Evento</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <strong>Data:</strong> ${eventDate.toLocaleDateString('pt-BR')}
              </li>
              <li class="list-group-item">
                <strong>Horário:</strong> ${eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </li>
              <li class="list-group-item">
                <strong>Local:</strong> ${event.location || 'A definir'}
              </li>
              ${event.price ? `
                <li class="list-group-item">
                  <strong>Preço:</strong> R$ ${parseFloat(event.price).toFixed(2)}
                </li>
              ` : ''}
            </ul>
          </div>
        </div>
      `;
      
      // Update modal body
      modalBody.innerHTML = bodyContent;
      
      // Show or hide registration button
      if (isUpcoming) {
        registerBtn.classList.remove('d-none');
      } else {
        registerBtn.classList.add('d-none');
      }
    } catch (error) {
      console.error('Error loading event details:', error);
      modalBody.innerHTML = `
        <div class="alert alert-danger">
          Erro ao carregar detalhes do evento: ${error.message}
        </div>
      `;
      registerBtn.classList.add('d-none');
    }
  }
  
  setupEventListeners() {
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.filterEvents());
    }
    
    // Search input enter key
    const searchInput = document.getElementById('event-search');
    if (searchInput) {
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.filterEvents();
        }
      });
    }
    
    // Filter radio buttons
    const filterRadios = document.querySelectorAll('input[name="event-filter"]');
    filterRadios.forEach(radio => {
      radio.addEventListener('change', () => this.filterEvents());
    });
    
    // Date filter
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter) {
      dateFilter.addEventListener('change', () => this.filterEvents());
    }
    
    // Register for event button
    const registerEventBtn = document.getElementById('register-event-btn');
    if (registerEventBtn) {
      registerEventBtn.addEventListener('click', () => this.showRegistrationForm());
    }
    
    // Submit registration button
    const submitRegistrationBtn = document.getElementById('submit-registration-btn');
    if (submitRegistrationBtn) {
      submitRegistrationBtn.addEventListener('click', () => this.submitRegistration());
    }
  }
  
  filterEvents() {
    // Get search term
    const searchTerm = document.getElementById('event-search').value.toLowerCase().trim();
    
    // Get filter type
    const filterType = document.querySelector('input[name="event-filter"]:checked').id;
    
    // Get date filter
    const dateFilter = document.getElementById('date-filter').value;
    const filterDate = dateFilter ? new Date(dateFilter) : null;
    
    // Apply filters
    this.filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      
      // Text search
      const matchesSearch = 
        !searchTerm || 
        event.title.toLowerCase().includes(searchTerm) ||
        (event.description && event.description.toLowerCase().includes(searchTerm)) ||
        (event.location && event.location.toLowerCase().includes(searchTerm));
      
      // Filter type
      let matchesFilterType = true;
      if (filterType === 'filter-upcoming') {
        matchesFilterType = eventDate > now;
      } else if (filterType === 'filter-past') {
        matchesFilterType = eventDate <= now;
      }
      
      // Date filter
      let matchesDate = true;
      if (filterDate) {
        // Compare only year, month, and day
        matchesDate = 
          eventDate.getFullYear() === filterDate.getFullYear() &&
          eventDate.getMonth() === filterDate.getMonth() &&
          eventDate.getDate() === filterDate.getDate();
      }
      
      return matchesSearch && matchesFilterType && matchesDate;
    });
    
    // Render filtered events
    this.renderEvents();
  }
  
  showRegistrationForm() {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    
    if (!user) {
      // Show login modal instead
      alert('Por favor, faça login para se inscrever neste evento.');
      
      // Close event details modal
      const eventModal = bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal'));
      eventModal.hide();
      
      // Show login modal
      const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.show();
      return;
    }
    
    // Pre-fill form with user data
    document.getElementById('event-id').value = this.selectedEvent._id;
    document.getElementById('participant-name').value = user.name || '';
    document.getElementById('participant-email').value = user.email || '';
    
    // Hide error message
    document.getElementById('registration-error').classList.add('d-none');
    
    // Show registration modal
    const modal = new bootstrap.Modal(document.getElementById('registerEventModal'));
    modal.show();
  }
  
  submitRegistration() {
    // Get form data
    const eventId = document.getElementById('event-id').value;
    const name = document.getElementById('participant-name').value;
    const email = document.getElementById('participant-email').value;
    const phone = document.getElementById('participant-phone').value;
    const guests = document.getElementById('participant-guests').value;
    const comments = document.getElementById('participant-comments').value;
    const errorElement = document.getElementById('registration-error');
    
    // Validate form
    if (!name || !email || !phone) {
      errorElement.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      errorElement.classList.remove('d-none');
      return;
    }
    
    // In a real application, this would send the registration to the API
    // For now, we'll just show a success message
    
    // Close registration modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerEventModal'));
    registerModal.hide();
    
    // Close event details modal
    const eventModal = bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal'));
    eventModal.hide();
    
    // Show success message
    alert('Inscrição realizada com sucesso! Você receberá um email com os detalhes da sua inscrição.');
    
    // Reset form
    document.getElementById('event-registration-form').reset();
  }
}

// Initialize the page when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.eventsPage = new EventsPage();
}); 