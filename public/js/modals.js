const modals = {
  showError(title, message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl animate-shake">
        <div class="text-center">
          <i class="ri-error-warning-line text-5xl text-red-500"></i>
          <h3 class="text-xl font-bold mt-4">${title}</h3>
          <p class="text-gray-600 mt-2">${message}</p>
          <button class="mt-6 px-6 py-2 bg-primary text-white rounded-button hover:bg-opacity-90">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('button').addEventListener('click', () => modal.remove());
  },

  showSuccess(title, message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="text-center">
          <i class="ri-checkbox-circle-line text-5xl text-green-500"></i>
          <h3 class="text-xl font-bold mt-4">${title}</h3>
          <p class="text-gray-600 mt-2">${message}</p>
          <button class="mt-6 px-6 py-2 bg-primary text-white rounded-button hover:bg-opacity-90">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('button').addEventListener('click', () => modal.remove());
  }
};