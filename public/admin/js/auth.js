async function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = '/login.html?redirect=' + window.location.pathname;
    return false;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    // Check role access
    if (user.role !== 'admin') {
      window.location.href = '/unauthorized.html';
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
    return false;
  }
}

// Add to each admin page
document.addEventListener('DOMContentLoaded', checkAuth);