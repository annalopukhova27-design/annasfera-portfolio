/**
 * Галерея работ — 3D-карусель (адаптация feature-carousel под ванильный JS)
 */

function initGalleryCarousel() {
  const root = document.getElementById('galleryCarousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.gallery-carousel__slide'));
  if (slides.length === 0) return;

  const prevBtn = root.querySelector('.gallery-carousel__btn--prev');
  const nextBtn = root.querySelector('.gallery-carousel__btn--next');
  const dotsWrap = root.querySelector('.gallery-carousel__dots');
  const autoplayMs = Number(root.dataset.autoplay) || 4000;

  let current = Math.floor(slides.length / 2);
  let timer = null;
  const total = slides.length;

  // Точки навигации
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-carousel__dot';
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.gallery-carousel__dot'));

  function getPos(index) {
    let offset = index - current;
    let pos = ((offset % total) + total) % total;
    if (pos > Math.floor(total / 2)) pos -= total;
    return pos;
  }

  function render() {
    slides.forEach((slide, index) => {
      const pos = getPos(index);
      const isCenter = pos === 0;
      const isAdjacent = Math.abs(pos) === 1;
      const absPos = Math.abs(pos);

      slide.style.transform = `
        translateX(${pos * 45}%)
        scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
        rotateY(${pos * -10}deg)
      `;
      slide.style.zIndex = isCenter ? 10 : isAdjacent ? 5 : 1;
      slide.style.opacity = isCenter ? '1' : isAdjacent ? '0.4' : '0';
      slide.style.filter = isCenter ? 'blur(0)' : 'blur(4px)';
      slide.style.visibility = absPos > 1 ? 'hidden' : 'visible';
      slide.classList.toggle('is-active', isCenter);
      slide.setAttribute('aria-hidden', isCenter ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    render();
    restartAutoplay();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(next, autoplayMs);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (index !== current) goTo(index);
    });
  });

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) startAutoplay();
  });

  // Свайп на мобильных
  let touchStartX = 0;
  root.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    } else {
      startAutoplay();
    }
  }, { passive: true });

  render();
  startAutoplay();
}
