/**
 * АннаСфера — Основной скрипт сайта
 * Отвечает за: меню, навигацию, фильтрацию, анимации, форму, год
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initReveal();
  initPortfolioFilter();
  initProjectImages();
  initProjectLightbox();
  initScrollTop();
  initContactForm();
  initCurrentYear();
  initHeroAurora();
  initGalleryCarousel();
});

/* ===== AURORA-ФОН НА ПЕРВОМ ЭКРАНЕ ===== */
function initHeroAurora() {
  const container = document.getElementById('aurora');
  if (!container || typeof initAurora !== 'function') return;

  initAurora(container, {
    colorStops: ['#EC4899', '#B497CF', '#7C3AED'],
    blend: 0.65,
    amplitude: 1.2,
    speed: 1.2
  });
}

/* ===== ШАПКА: плотный фон при прокрутке ===== */
function initHeader() {
  const header = document.getElementById('header');

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ===== МОБИЛЬНОЕ МЕНЮ ===== */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  function toggleMenu(open) {
    const isOpen = open ?? !mobileMenu.classList.contains('open');
    burger.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ===== ПЛАВНАЯ ПРОКРУТКА ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===== АКТИВНЫЙ ПУНКТ НАВИГАЦИИ ===== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    let current = 'hero';
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      link.classList.toggle('active', section === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ ПРОКРУТКЕ ===== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ===== ФИЛЬТРАЦИЯ ПОРТФОЛИО ===== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ===== ЗАГЛУШКИ ИЗОБРАЖЕНИЙ ПРОЕКТОВ ===== */
function initProjectImages() {
  document.querySelectorAll('[data-project-image]').forEach(img => {
    const markMissing = () => img.classList.add('is-missing');
    const markLoaded = () => img.classList.add('is-loaded');

    img.addEventListener('error', markMissing);
    img.addEventListener('load', markLoaded);

    if (img.complete) {
      if (img.naturalWidth === 0) markMissing();
      else markLoaded();
    }
  });
}

/* ===== LIGHTBOX ПРЕВЬЮ ПРОЕКТОВ И ГАЛЕРЕИ ===== */
function initProjectLightbox() {
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  if (!lightbox || !lightboxImg) return;

  const projectTriggers = document.querySelectorAll('.project-card__image--lightbox');
  const gallerySlides = document.querySelectorAll('.gallery-carousel__slide');
  let lastFocus = null;

  function openLightboxFromImg(img) {
    if (!img || img.classList.contains('is-missing') || !img.getAttribute('src')) return;

    lastFocus = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close')?.focus();
  }

  function openLightbox(trigger) {
    openLightboxFromImg(trigger.querySelector('img'));
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src');
    lightboxImg.alt = '';
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  projectTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openLightbox(trigger));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(trigger);
      }
    });
  });

  gallerySlides.forEach(slide => {
    slide.addEventListener('click', () => {
      if (!slide.classList.contains('is-active')) return;
      openLightboxFromImg(slide.querySelector('img'));
    });
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

/* ===== КНОПКА «НАВЕРХ» ===== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== ФОРМА ОБРАТНОЙ СВЯЗИ ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const toastClose = document.getElementById('toastClose');

  const fields = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (val) => val.trim().length >= 2 || 'Введите имя (минимум 2 символа)'
    },
    contact: {
      el: document.getElementById('contact'),
      error: document.getElementById('contactError'),
      validate: (val) => val.trim().length >= 3 || 'Укажите способ связи'
    },
    taskType: {
      el: document.getElementById('taskType'),
      error: document.getElementById('taskTypeError'),
      validate: (val) => val !== '' || 'Выберите тип задачи'
    },
    message: {
      el: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (val) => val.trim().length >= 10 || 'Сообщение должно содержать минимум 10 символов'
    }
  };

  function validateField(key) {
    const field = fields[key];
    const result = field.validate(field.el.value);

    if (result === true) {
      field.el.classList.remove('error');
      field.error.textContent = '';
      return true;
    }

    field.el.classList.add('error');
    field.error.textContent = result;
    return false;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) isValid = false;
    });

    if (!isValid) return;

    // Демонстрационный режим — без отправки на сервер
    form.reset();
    showToast();
  });

  function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  toastClose.addEventListener('click', () => {
    toast.classList.remove('show');
  });
}

/* ===== ТЕКУЩИЙ ГОД В ПОДВАЛЕ ===== */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
