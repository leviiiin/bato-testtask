import './styles/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  // Sub-navigation toggle
  const triggers = document.querySelectorAll('.js-sub-nav');

  triggers.forEach(trigger => {
    const category = trigger.dataset.category;
    const subNav = document.querySelector(`.header__sub-nav[data-sub-nav="${category}"]`);

    if (!subNav) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = subNav.classList.contains('is-open');
      closeAllSubNavs();
      if (!isOpen) {
        subNav.classList.add('is-open');
        trigger.classList.add('is-active');
      }
    });
  });

  document.addEventListener('click', () => {
    closeAllSubNavs();
  });

  function closeAllSubNavs() {
    document.querySelectorAll('.header__sub-nav.is-open').forEach(nav => nav.classList.remove('is-open'));
    document.querySelectorAll('.js-sub-nav.is-active').forEach(el => el.classList.remove('is-active'));
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const headerNav = document.getElementById('headerNav');

  if (menuBtn && headerNav) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      headerNav.classList.toggle('is-open');
    });

    document.addEventListener('click', () => {
      headerNav.classList.remove('is-open');
    });
  }

  // FAQ accordion
  const questions = document.querySelectorAll('.faq__question');

  questions.forEach(button => {
    button.addEventListener('click', () => {
      const currentAnswer = button.nextElementSibling;

      document.querySelectorAll('.faq__answer.open').forEach(answer => {
        if (answer !== currentAnswer) {
          answer.classList.remove('open');
          answer.previousElementSibling.classList.remove('active');
        }
      });

      currentAnswer.classList.toggle('open');
      button.classList.toggle('active');
    });
  });

  // Contact popup
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
    if (headerNav) {
      headerNav.classList.remove('is-open');
    }

    if (popup && popup.classList.contains('open')) {
      if (!popup.contains(e.target) && e.target !== popupOpenBtn) {
        popup.classList.remove('open');
      }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup && popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  });

  // Form validation
  const form = document.getElementById('contactForm');

  if (form) {
    function clearErrors() {
      document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
      document.querySelectorAll('.footer__popup-input, .footer__popup-checkbox-label').forEach(el => {
        el.classList.remove('error');
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

      if (!checkbox.checked) {
        showError('checkboxError', 'You must agree to the Privacy Policy');
        document.querySelector('.footer__popup-checkbox-label').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        if (popup) {
          popup.classList.remove('open');
          form.reset();
          clearErrors();
        }
        console.log('Form submitted successfully!');
      }
    });
  }
});

// Slick slider initialization
import $ from 'jquery';
window.$ = window.jQuery = $;

import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const $slider = $('.reviews__list');
const $prevBtn = $('#reviewsPrevBtn');
const $nextBtn = $('#reviewsNextBtn');

$slider.slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: $prevBtn,
  nextArrow: $nextBtn,
  arrows: true,
  infinite: false,
  responsive: [
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    }
  ]
});

function updateArrows(slick) {
  const currentSlide = slick.currentSlide;
  const totalSlides = slick.slideCount;
  const slidesToShow = slick.options.slidesToShow;

  if (currentSlide > 0) {
    $prevBtn.addClass('active');
  } else {
    $prevBtn.removeClass('active');
  }

  const lastSlideIndex = totalSlides - slidesToShow;
  if (currentSlide < lastSlideIndex) {
    $nextBtn.addClass('active');
  } else {
    $nextBtn.removeClass('active');
  }
}

$slider.on('init', (event, slick) => {
  updateArrows(slick);
});

$slider.on('afterChange', (event, slick) => {
  updateArrows(slick);
});

$slider.on('breakpoint', (event, slick) => {
  setTimeout(() => updateArrows(slick), 0);
});