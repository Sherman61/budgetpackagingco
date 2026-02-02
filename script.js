const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.primary-nav a');
const sections = document.querySelectorAll('main section[id]');
const backToTop = document.querySelector('.back-to-top');
const year = document.getElementById('year');
const form = document.getElementById('quote-form');
const formNote = document.getElementById('form-note');
const revealElements = document.querySelectorAll('.reveal');
const trustItems = document.querySelectorAll('.trust-item');
const interestButtons = document.querySelectorAll('[data-interest]');

const closeNav = () => {
  body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle.addEventListener('click', () => {
  const isOpen = body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeNav();
  });
});

const setActiveLink = () => {
  let currentSection = sections[0]?.id;
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentSection}`;
    link.classList.toggle('active', isActive);
  });
};

const handleBackToTop = () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
};

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rotateTrustItems = () => {
  if (trustItems.length === 0) return;
  trustItems.forEach((item) => item.classList.remove('is-active'));
  trustItems[trustIndex].classList.add('is-active');
  trustIndex = (trustIndex + 1) % trustItems.length;
};

let trustIndex = 0;
rotateTrustItems();
setInterval(rotateTrustItems, 3500);

interestButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const interest = button.getAttribute('data-interest');
    const select = form.querySelector('[name="interest"]');
    if (select && interest) {
      select.value = interest;
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const errors = [];

  form.querySelectorAll('[required]').forEach((field) => {
    if (!field.value.trim()) {
      errors.push(`${field.name}`);
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  });

  const emailValue = formData.get('email')?.toString().trim() ?? '';
  if (emailValue && !emailPattern.test(emailValue)) {
    errors.push('email');
    form.querySelector('[name="email"]').setAttribute('aria-invalid', 'true');
  }

  if (errors.length > 0) {
    formNote.textContent = 'Please complete all required fields with valid information.';
    formNote.className = 'form-note error';
    return;
  }

  formNote.textContent = 'Thanks—We’ll get back to you within 1 business day.';
  formNote.className = 'form-note success';
  form.reset();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});

window.addEventListener('scroll', () => {
  setActiveLink();
  handleBackToTop();
});

window.addEventListener('load', () => {
  setActiveLink();
  handleBackToTop();
});

if (year) {
  year.textContent = new Date().getFullYear();
}
