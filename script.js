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
  initCaseGalleries();
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

/* ===== ДАННЫЕ ГАЛЕРЕЙ КЕЙСОВ ===== */
const CASE_GALLERIES = {
  neurophoto: {
    title: 'Нейрофотосессии',
    items: [
      { src: 'images/projects/neurophoto-01.PNG', alt: 'Семейная новогодняя нейрофотосессия' },
      { src: 'images/projects/neurophoto-02.PNG', alt: 'Тематический нейрофотообраз ко Дню Победы' },
      { src: 'images/projects/neurophoto-03.PNG', alt: 'Весенняя нейрофотосессия с тюльпанами' },
      { src: 'images/projects/neurophoto-04.PNG', alt: 'Нейрофотообраз на морском побережье' },
      { src: 'images/projects/neurophoto-05.PNG', alt: 'Студийный женский образ в зелёном платье' },
      { src: 'images/projects/neurophoto-06.PNG', alt: 'Праздничный нейрофотообраз с конфетти' }
    ]
  },
  'ai-song-video': {
    title: 'Персональные песни и AI-видео',
    items: [
      { src: 'images/projects/ai-video-01.JPEG', alt: 'Кадр проекта с дочерью — персональное AI-видео' },
      { src: 'images/projects/ai-video-02.JPEG', alt: 'Кадр проекта с дочерью — визуальная сцена' },
      { src: 'images/projects/ai-video-03.JPEG', alt: 'Кадр проекта с дочерью — AI-история' },
      { src: 'images/projects/ai-video-04.PNG', alt: 'Кадр проекта с дочерью — оживление образа' },
      { src: 'images/projects/ai-video-05.JPEG', alt: 'Кадр проекта с дочерью — персональный ролик' },
      { src: 'images/projects/ai-video-06.PNG', alt: 'Кадр проекта с подругой — персональное AI-видео' }
    ]
  },
  'ai-visual': {
    title: 'AI-визуал и креативы',
    items: [
      { src: 'images/projects/ai-visual-01.png', alt: 'Рекламный персонажный AI-визуал' },
      { src: 'images/projects/ai-visual-02.PNG', alt: 'Предметный рекламный визуал с телефоном' },
      { src: 'images/projects/ai-visual-03.PNG', alt: 'Рекламная обложка «Сварочные работы»', wide: true },
      { src: 'images/projects/ai-visual-04.JPEG', alt: 'Зимний визуал Белорецка со снежным шаром', square: true },
      { src: 'images/projects/ai-visual-05.PNG', alt: 'Атмосферный AI-пейзаж и креатив' },
      { src: 'images/projects/ai-visual-06.PNG', alt: 'Рекламный макет сварочных услуг' }
    ]
  }
};

/* ===== LIGHTBOX И ГАЛЕРЕИ КЕЙСОВ ===== */
function initProjectLightbox() {
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counter = document.getElementById('lightboxCounter');
  if (!lightbox || !lightboxImg) return;

  let lastFocus = null;
  let items = [];
  let currentIndex = 0;

  function updateNav() {
    const multi = items.length > 1;
    if (prevBtn) prevBtn.hidden = !multi;
    if (nextBtn) nextBtn.hidden = !multi;
    if (counter) {
      counter.hidden = !multi;
      if (multi) counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }
  }

  function showCurrent() {
    const item = items[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || '';
    updateNav();
  }

  function openLightbox(list, startIndex = 0) {
    if (!list || !list.length) return;
    items = list;
    currentIndex = ((startIndex % list.length) + list.length) % list.length;
    lastFocus = document.activeElement;
    showCurrent();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close')?.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src');
    lightboxImg.alt = '';
    items = [];
    currentIndex = 0;
    updateNav();
    const caseGallery = document.getElementById('caseGallery');
    if (!caseGallery || caseGallery.hidden) {
      document.body.style.overflow = '';
    }
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function step(delta) {
    if (items.length < 2) return;
    currentIndex = (currentIndex + delta + items.length) % items.length;
    showCurrent();
  }

  window.__openProjectLightbox = openLightbox;
  window.__closeProjectLightbox = closeLightbox;

  document.querySelectorAll('.project-card__image--lightbox').forEach(trigger => {
    const open = () => {
      const img = trigger.querySelector('img');
      if (!img || img.classList.contains('is-missing') || !img.getAttribute('src')) return;
      openLightbox([{ src: img.currentSrc || img.src, alt: img.alt || '' }], 0);
    };
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  document.querySelectorAll('[data-lightbox-single]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-lightbox-single');
      const card = btn.closest('.project-card');
      const img = card?.querySelector('.project-card__image img');
      if (!img) return;
      openLightbox([{ src: img.currentSrc || img.src, alt: img.alt || '' }], 0);
      void key;
    });
  });

  document.querySelectorAll('.gallery-carousel__slide').forEach(slide => {
    slide.addEventListener('click', () => {
      if (!slide.classList.contains('is-active')) return;
      const img = slide.querySelector('img');
      if (!img) return;
      openLightbox([{ src: img.currentSrc || img.src, alt: img.alt || '' }], 0);
    });
  });

  prevBtn?.addEventListener('click', () => step(-1));
  nextBtn?.addEventListener('click', () => step(1));

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

function initCaseGalleries() {
  const modal = document.getElementById('caseGallery');
  const titleEl = document.getElementById('caseGalleryTitle');
  const gridEl = document.getElementById('caseGalleryGrid');
  if (!modal || !titleEl || !gridEl) return;

  let lastFocus = null;
  let activeKey = null;

  function closeCaseGallery() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    gridEl.innerHTML = '';
    activeKey = null;
    if (!document.getElementById('projectLightbox') || document.getElementById('projectLightbox').hidden) {
      document.body.style.overflow = '';
    }
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function openCaseGallery(key) {
    const data = CASE_GALLERIES[key];
    if (!data) return;

    activeKey = key;
    lastFocus = document.activeElement;
    titleEl.textContent = data.title;
    gridEl.innerHTML = '';

    data.items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'case-gallery__item';
      if (item.wide) btn.classList.add('case-gallery__item--wide');
      if (item.square) btn.classList.add('case-gallery__item--square');
      btn.setAttribute('aria-label', `Открыть: ${item.alt}`);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      btn.appendChild(img);

      btn.addEventListener('click', () => {
        if (typeof window.__openProjectLightbox === 'function') {
          window.__openProjectLightbox(data.items, index);
        }
      });

      gridEl.appendChild(btn);
    });

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.case-gallery__close')?.focus();
  }

  document.querySelectorAll('[data-case-gallery]').forEach(el => {
    const open = () => openCaseGallery(el.getAttribute('data-case-gallery'));
    el.addEventListener('click', open);
    if (el.matches('[role="button"]')) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    }
  });

  modal.querySelectorAll('[data-case-gallery-close]').forEach(el => {
    el.addEventListener('click', closeCaseGallery);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || modal.hidden) return;
    const lightbox = document.getElementById('projectLightbox');
    if (lightbox && !lightbox.hidden) return;
    closeCaseGallery();
  });

  void activeKey;
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
