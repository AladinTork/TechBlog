document.addEventListener('DOMContentLoaded', () => {
  const formTitle = document.getElementById('form-title');
  const authForm = document.getElementById('auth-form');
  const submitBtn = document.getElementById('submit-btn');
  const switchText = document.getElementById('switch-text');

  // Helper to display validation messages
  const displayError = (input, message) => {
    let errorBanner = input.parentElement.querySelector('.error-message');
    if (!errorBanner) {
      errorBanner = document.createElement('span');
      errorBanner.className = 'error-message';
      input.parentElement.appendChild(errorBanner);
    }
    errorBanner.textContent = message;
    errorBanner.style.display = 'block';
  };

  // Helper to clear validation messages
  const clearError = (input) => {
    const errorBanner = input.parentElement.querySelector('.error-message');
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
  };

  // Helper to reset the form
  const resetForm = () => {
    authForm.reset(); // Clear all form inputs
    document.querySelectorAll('.error-message').forEach((errorBanner) => {
      errorBanner.style.display = 'none'; // Hide all error messages
    });
  };

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must include at least one capital letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must include at least one number.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must include at least one special character.';
    }
    return ''; // No errors
  };

  // Function to toggle between Login and Sign Up forms
  const toggleForm = () => {
    resetForm();

    if (formTitle.textContent === 'Login') {
      formTitle.textContent = 'Sign Up';
      switchText.innerHTML = `Already have an account? <a href="#" id="switch-link">Login</a>`;
      submitBtn.textContent = 'Sign Up';
    } else {
      formTitle.textContent = 'Login';
      switchText.innerHTML = `Don't have an account? <a href="#" id="switch-link">Sign Up</a>`;
      submitBtn.textContent = 'Login';
    }

    // Reattach event listener to the new "switch-link"
    document.getElementById('switch-link').addEventListener('click', (e) => {
      e.preventDefault();
      toggleForm();
    });
  };

  // Attach initial switch event listener
  document.getElementById('switch-link').addEventListener('click', (e) => {
    e.preventDefault();
    toggleForm();
  });

  // Form submission logic
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    // Clear previous errors
    clearError(password);

    // Password validation
    const passwordError = validatePassword(password.value);
    if (passwordError) {
      displayError(password, passwordError);
      return; // Prevent form submission
    }

    // Determine endpoint based on the form type
    const endpoint = formTitle.textContent === 'Login' ? '/api/users/login' : '/api/users/signup';

    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ username: username.value, password: password.value }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = '/'; // Redirect to main page
        } else {
          const errorMessage =
            formTitle.textContent === 'Login'
              ? 'Invalid username or password. Please check your details or sign up if you’re new.'
              : 'An error occurred during sign up. Please try again.';
          displayError(password, errorMessage);
        }
      })
      .catch((err) => {
        displayError(password, 'An unexpected error occurred. Please try again later.');
        console.error('Error:', err);
      });
  });
});
