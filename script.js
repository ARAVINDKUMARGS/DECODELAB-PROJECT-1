const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Fade-in animation for key sections and cards as they enter viewport.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    let isValid = true;

    clearFieldState(nameInput);
    clearFieldState(emailInput);
    clearFieldState(messageInput);
    setFormStatus('', '');

    if (nameValue.length < 2) {
      setFieldError(nameInput, 'Please enter at least 2 characters for your name.');
      isValid = false;
    }

    if (!isValidEmail(emailValue)) {
      setFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (messageValue.length < 15) {
      setFieldError(messageInput, 'Message should be at least 15 characters long.');
      isValid = false;
    }

    if (!isValid) {
      setFormStatus('Please fix the highlighted fields and try again.', 'error');
      return;
    }

    setFormStatus('Message sent successfully. Thanks for reaching out!', 'success');
    contactForm.reset();
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function setFieldError(input, message) {
  const formField = input.closest('.form-field');
  if (!formField) {
    return;
  }

  formField.classList.add('invalid');
  const errorSlot = formField.querySelector('.error-message');
  if (errorSlot) {
    errorSlot.textContent = message;
  }
}

function clearFieldState(input) {
  const formField = input.closest('.form-field');
  if (!formField) {
    return;
  }

  formField.classList.remove('invalid');
  const errorSlot = formField.querySelector('.error-message');
  if (errorSlot) {
    errorSlot.textContent = '';
  }
}

function setFormStatus(message, type) {
  if (!formStatus) {
    return;
  }

  formStatus.className = 'form-status';
  if (type) {
    formStatus.classList.add(type);
  }
  formStatus.textContent = message;
}
