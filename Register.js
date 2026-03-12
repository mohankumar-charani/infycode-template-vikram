// ============================================================
//  INFYCODE — register.js
// ============================================================

// ── Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.site-header').style.boxShadow =
    window.scrollY > 10
      ? '0 3px 20px rgba(0,0,0,.10)'
      : '0 2px 14px rgba(0,0,0,.06)';
});

// ── Grab fields and buttons
const nameInput    = document.querySelector('.field[placeholder="Name"]');
const emailInput   = document.querySelector('.field[placeholder="Email"]');
const passInput    = document.querySelector('.field[placeholder="Password"]');
const cpassInput   = document.querySelector('.field[placeholder="Confirm Password"]');
const createBtn    = document.getElementById('createBtn');
const googleBtn    = document.getElementById('googleBtn');

// ── Inject shake keyframes + error class (once)
const style = document.createElement('style');
style.textContent = `
  @keyframes shakeField {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-7px); }
    75%       { transform: translateX(7px); }
  }
  .field-error {
    border-color: #e74c3c !important;
    box-shadow:   0 0 0 3px rgba(231,76,60,.13) !important;
    animation:    shakeField .35s ease;
  }
  .btn-create.loading {
    opacity: 0.72;
    cursor: not-allowed;
    letter-spacing: 1px;
  }
`;
document.head.appendChild(style);

// ── Helper: show error on a field
function showError(input, msg) {
  input.classList.add('field-error');
  if (msg) {
    const prev = input.placeholder;
    input.placeholder = msg;
    setTimeout(() => {
      input.placeholder = prev;
      clearError(input);
    }, 2200);
  }
}

// ── Helper: clear error on a field
function clearError(input) {
  input.classList.remove('field-error');
  input.style.borderColor = '#3a9e5f';
  input.style.boxShadow   = '0 0 0 3px rgba(58,158,95,.12)';
}

// ── Focus / blur / input listeners for all fields
[nameInput, emailInput, passInput, cpassInput].forEach(f => {
  f.addEventListener('focus', () => {
    clearError(f);
    f.style.borderColor = '#3a9e5f';
    f.style.boxShadow   = '0 0 0 3px rgba(58,158,95,.12)';
  });

  f.addEventListener('blur', () => {
    if (!f.classList.contains('field-error')) {
      f.style.borderColor = '';
      f.style.boxShadow   = '';
    }
  });

  f.addEventListener('input', () => clearError(f));

  // Enter on any field triggers create button
  f.addEventListener('keydown', e => {
    if (e.key === 'Enter') createBtn.click();
  });
});

// ── Validate email format
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// ── Create account button — validate then redirect to login
createBtn.addEventListener('click', () => {
  let valid = true;

  // Name check
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    showError(nameInput, 'Please enter your full name');
    valid = false;
  }

  // Email check
  if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
    showError(emailInput, 'Please enter a valid email address');
    valid = false;
  }

  // Password check (min 6 chars)
  if (!passInput.value || passInput.value.length < 6) {
    showError(passInput, 'Password must be at least 6 characters');
    valid = false;
  }

  // Confirm password check
  if (!cpassInput.value) {
    showError(cpassInput, 'Please confirm your password');
    valid = false;
  } else if (passInput.value && cpassInput.value !== passInput.value) {
    showError(cpassInput, 'Passwords do not match!');
    valid = false;
  }

  if (!valid) return;

  // ── All valid: show loading state then redirect to login.html
  createBtn.textContent = 'Creating account…';
  createBtn.classList.add('loading');
  createBtn.disabled = true;

  setTimeout(() => {
    // ✅ Redirect to login page after successful registration
    window.location.href = 'login.html';
  }, 1800);
});

// ── Google Sign-up button — loading state then redirect to login
googleBtn.addEventListener('click', e => {
  e.preventDefault();
  const originalHTML      = googleBtn.innerHTML;
  googleBtn.innerHTML     = 'Connecting to Google…';
  googleBtn.style.opacity = '0.72';
  googleBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    // ✅ Replace with real OAuth URL; for now redirect to login
    window.location.href = 'login.html';
  }, 1600);
});