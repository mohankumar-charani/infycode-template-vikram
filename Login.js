// ============================================================
//  INFYCODE — login.js
// ============================================================

// ── Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.site-header').style.boxShadow =
    window.scrollY > 10
      ? '0 3px 20px rgba(0,0,0,.10)'
      : '0 2px 15px rgba(0,0,0,.06)';
});

// ── Grab elements
const emailInput    = document.querySelector('.form-input[placeholder="Username or Email"]');
const passwordInput = document.querySelector('.form-input[placeholder="Password"]');
const loginBtn      = document.querySelector('.btn-login');
const googleBtn     = document.querySelector('.btn-google');

// ── Inject keyframes + error class once
const style = document.createElement('style');
style.textContent = `
  @keyframes shakeInput {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-7px); }
    75%       { transform: translateX(7px); }
  }
  .input-error {
    border-color: #e74c3c !important;
    box-shadow:   0 0 0 3px rgba(231,76,60,.13) !important;
  }
  .btn-login.loading {
    opacity: 0.72;
    cursor: not-allowed;
    letter-spacing: 1px;
  }
`;
document.head.appendChild(style);

// ── Helper: mark field as error with shake
function showError(input) {
  input.classList.add('input-error');
  input.style.animation = 'none';
  requestAnimationFrame(() => {
    input.style.animation = 'shakeInput .35s ease';
  });
}

// ── Helper: clear error state
function clearError(input) {
  input.classList.remove('input-error');
  input.style.borderColor = '#538ce1';
  input.style.boxShadow   = '0 0 0 3px rgba(83,140,225,.12)';
}

// ── Focus / blur / input listeners
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('focus', () => {
    clearError(input);
    input.style.borderColor = '#538ce1';
    input.style.boxShadow   = '0 0 0 3px rgba(83,140,225,.12)';
  });

  input.addEventListener('blur', () => {
    if (!input.classList.contains('input-error')) {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }
  });

  input.addEventListener('input', () => clearError(input));

  // Enter key submits
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginBtn.click();
  });
});

// ── Login button click — validation + loading state
loginBtn.addEventListener('click', () => {
  const emailVal = emailInput.value.trim();
  const passVal  = passwordInput.value;
  let valid = true;

  // Username / email check (3+ chars or contains @)
  if (!emailVal || emailVal.length < 3) {
    showError(emailInput);
    emailInput.placeholder = 'Please enter your username or email';
    setTimeout(() => { emailInput.placeholder = 'Username or Email'; }, 2200);
    valid = false;
  }

  // Password check (min 6 chars)
  if (!passVal || passVal.length < 6) {
    showError(passwordInput);
    const prev = passwordInput.placeholder;
    passwordInput.placeholder = passVal ? 'Password must be at least 6 characters' : 'Password is required!';
    setTimeout(() => { passwordInput.placeholder = prev; }, 2200);
    valid = false;
  }

  if (!valid) return;

  // Simulate login request
  loginBtn.textContent = 'Logging in…';
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;

  setTimeout(() => {
    loginBtn.textContent = 'Login';
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
    window.location.href = 'index.html';
  }, 2000);
});

// ── Google login button — loading state
googleBtn.addEventListener('click', () => {
  const originalHTML   = googleBtn.innerHTML;
  googleBtn.innerHTML  = 'Redirecting to Google…';
  googleBtn.disabled   = true;
  googleBtn.style.opacity = '0.72';
  googleBtn.style.cursor  = 'not-allowed';

  setTimeout(() => {
    googleBtn.innerHTML     = originalHTML;
    googleBtn.disabled      = false;
    googleBtn.style.opacity = '1';
    googleBtn.style.cursor  = '';
    // Replace with: window.location.href = '/auth/google';
  }, 1800);
});