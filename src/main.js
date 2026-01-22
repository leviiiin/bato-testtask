import './styles/style.scss';
import Swiper from 'swiper';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById('menuBtn');
  const headerNav = document.getElementById('headerNav');

  if (menuBtn && headerNav) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      headerNav.classList.toggle('is-open');
    });
  }

  // --- Mobile services toggle ---
  const isTouch =
    window.matchMedia('(hover: none)').matches ||
    'ontouchstart' in window;

  if (!isTouch) return;

  const serviceItem = document.querySelector('.services-nav');
  const trigger = serviceItem?.querySelector('.header__nav-link');

  if (!serviceItem || !trigger) return;

  trigger.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    serviceItem.classList.toggle('is-open');
  });

  document.addEventListener('click', e => {
    if (!serviceItem.contains(e.target)) {
      serviceItem.classList.remove('is-open');
    }
  });

  // --- Swiper ---
  const sliderEl = document.querySelector('.reviews__swiper');
  const btnNext = document.querySelector('.reviews__nav-btn--next');
  const btnPrev = document.querySelector('.reviews__nav-btn--prev');

  if (sliderEl && btnNext && btnPrev) {
    const swiper = new Swiper(sliderEl, {
      slidesPerView: 'auto',
      spaceBetween: 24,
      speed: 600,
      watchOverflow: false,
    });

    btnNext.addEventListener('click', () => swiper.slideNext());
    btnPrev.addEventListener('click', () => swiper.slidePrev());

    function updateButtons() {
      btnPrev.classList.toggle('active', !swiper.isBeginning);
      btnNext.classList.toggle('active', !swiper.isEnd);
    }

    updateButtons();
    swiper.on('slideChange', updateButtons);
    swiper.on('reachBeginning', updateButtons);
    swiper.on('reachEnd', updateButtons);
    swiper.on('fromEdge', updateButtons);
  }

  // --- FAQ accordion ---
  const questions = document.querySelectorAll('.faq__question');

  function updateOpenAnswersHeight() {
    document.querySelectorAll('.faq__answer.open').forEach(answer => {
      if (answer) {
        answer.style.height = 'auto';
        const newHeight = answer.scrollHeight;
        answer.style.height = newHeight + 'px';
      }
    });
  }

  if (questions.length > 0) {
    const firstAnswer = questions[0].nextElementSibling;
    if (firstAnswer) {
      firstAnswer.classList.add('open');
      firstAnswer.style.height = firstAnswer.scrollHeight + 'px';
      questions[0].classList.add('active');
    }
  }

  questions.forEach(button => {
    button.addEventListener('click', () => {
      const currentAnswer = button.nextElementSibling;
      if (!currentAnswer) return;

      document.querySelectorAll('.faq__answer.open').forEach(answer => {
        if (answer !== currentAnswer) {
          answer.style.height = 0;
          answer.classList.remove('open');
          if (answer.previousElementSibling) {
            answer.previousElementSibling.classList.remove('active');
          }
        }
      });

      if (currentAnswer.classList.contains('open')) {
        currentAnswer.style.height = 0;
        currentAnswer.classList.remove('open');
        button.classList.remove('active');
      } else {
        currentAnswer.classList.add('open');
        button.classList.add('active');
        currentAnswer.style.height = currentAnswer.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', updateOpenAnswersHeight);

  // --- Contact popup ---
  const popupOpenBtn = document.getElementById('contactBtn');
  const popup = document.getElementById('contactPopup');
  const popupCloseBtn = document.getElementById('contactPopupClose');

  if (popupOpenBtn && popup) {
    popupOpenBtn.addEventListener('click', e => {
      e.stopPropagation();
      popup.classList.add('open');
    });
  }

  if (popupCloseBtn && popup) {
    popupCloseBtn.addEventListener('click', e => {
      e.stopPropagation();
      popup.classList.remove('open');
    });
  }

  document.addEventListener('click', e => {
    const headerNav = document.querySelector('.header__nav');
    const servicesToggle = document.getElementById('services-toggle');
    const popup = document.getElementById('contactPopup');
    const popupOpenBtn = document.getElementById('contactBtn');

    if (headerNav && !e.target.closest('.header__nav') && !e.target.closest('#menuBtn')) {
      headerNav.classList.remove('is-open');
      if (servicesToggle) servicesToggle.checked = false;
    }

    if (popup && popup.classList.contains('open') &&
      !e.target.closest('#contactPopup') && e.target !== popupOpenBtn) {
      popup.classList.remove('open');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup && popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  });

  // --- Form validation ---
  const form = document.getElementById('contactForm');

  if (form) {
    function clearErrors() {
      document.querySelectorAll('.error-message').forEach(el => {
        if (el) {
          el.textContent = '';
          el.style.display = 'none';
        }
      });
      document.querySelectorAll('.footer__popup-input, .footer__popup-checkbox-label').forEach(el => {
        if (el) el.classList.remove('error');
      });
    }

    function isValidUkrainianPhone(phone) {
      const phoneRegex = /^(\+380|0)\d{9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function showError(id, message) {
      const errorEl = document.getElementById(id);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();

      const phoneInput = document.getElementById('phoneInput');
      const emailInput = document.getElementById('emailInput');
      const checkbox = document.getElementById('checkbox');

      let isValid = true;

      if (phoneInput) {
        const phone = phoneInput.value.trim();
        if (!phone) {
          showError('phoneError', 'Phone is required');
          phoneInput.classList.add('error');
          isValid = false;
        } else if (!isValidUkrainianPhone(phone)) {
          showError('phoneError', 'Please enter a valid Ukrainian phone number (e.g. +380XXXXXXXXX or 0XXXXXXXXX)');
          phoneInput.classList.add('error');
          isValid = false;
        }
      }

      if (emailInput) {
        const email = emailInput.value.trim();
        if (!email) {
          showError('emailError', 'Email is required');
          emailInput.classList.add('error');
          isValid = false;
        } else if (!isValidEmail(email)) {
          showError('emailError', 'Please enter a valid email');
          emailInput.classList.add('error');
          isValid = false;
        }
      }

      if (checkbox && !checkbox.checked) {
        showError('checkboxError', 'You must agree to the Privacy Policy');
        const checkboxLabel = document.querySelector('.footer__popup-checkbox-label');
        if (checkboxLabel) checkboxLabel.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        if (popup) popup.classList.remove('open');
        form.reset();
        clearErrors();
        console.log('Form submitted successfully!');
      }
    });
  }
});
