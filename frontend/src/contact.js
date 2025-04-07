// Contact page functionality
import api from './services/api.js';

class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    // Setup contact form
    this.setupContactForm();
  }
  
  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('contact-success');
    const errorAlert = document.getElementById('contact-error');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Hide alerts
      successAlert.classList.add('d-none');
      errorAlert.classList.add('d-none');
      
      try {
        // In a real application, this would send the data to an API endpoint
        // For now, we'll just simulate a successful submission
        
        // Simulate API call
        await this.simulateApiCall({
          name,
          email,
          subject,
          message
        });
        
        // Show success message
        successAlert.classList.remove('d-none');
        
        // Reset form
        contactForm.reset();
        
        // Scroll to success message
        successAlert.scrollIntoView({ behavior: 'smooth' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successAlert.classList.add('d-none');
        }, 5000);
      } catch (error) {
        // Show error message
        errorAlert.textContent = error.message || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.';
        errorAlert.classList.remove('d-none');
        
        // Scroll to error message
        errorAlert.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  simulateApiCall(data) {
    // This is a simulated API call
    return new Promise((resolve, reject) => {
      console.log('Contact form data:', data);
      
      // Simulate network delay
      setTimeout(() => {
        // 90% chance of success, 10% chance of failure (for testing)
        const random = Math.random();
        if (random < 0.9) {
          resolve({ success: true, message: 'Mensagem enviada com sucesso!' });
        } else {
          reject(new Error('Falha na conexão com o servidor. Por favor, tente novamente.'));
        }
      }, 1000);
    });
  }
}

// Initialize the page when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contactPage = new ContactPage();
}); 