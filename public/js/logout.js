document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
  
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          // Send a POST request to /api/users/logout
          const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
  
          if (response.ok) {
            // If logout was successful, redirect to homepage
            window.location.href = '/';
          } else {
            console.error('Logout failed.');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
      });
    }
  });
  