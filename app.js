(() => {
  'use strict';
  const carousel = document.querySelector('.hero-story');
  const photos = [...document.querySelectorAll('.hero-photo')];
  const copies = [...document.querySelectorAll('.hero-copy')];
  const marks = [...document.querySelectorAll('.hero-progress > button')];
  const counter = document.querySelector('.hero-progress b');
  const readLink = document.querySelector('.hero-read');
  const storyIds = ['student-uc-davis', 'student-rutgers', 'student-wisconsin-madison'];
  if (!carousel || !photos.length || copies.length !== photos.length || !counter) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer;
  const show = index => {
    current = (index + photos.length) % photos.length;
    if (readLink && storyIds[current]) readLink.setAttribute('href', '#' + storyIds[current]);
    photos.forEach((photo, i) => { photo.classList.toggle('is-active', i === current); photo.setAttribute('aria-hidden', String(i !== current)); });
    copies.forEach((copy, i) => copy.hidden = i !== current);
    marks.forEach((mark, i) => { mark.classList.toggle('is-active', i === current); mark.setAttribute('aria-pressed', String(i === current)); });
    counter.textContent = String(current + 1).padStart(2, '0') + ' / 03';
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => { stop(); if (!motion.matches && !document.hidden && !carousel.matches(':focus-within') && !carousel.matches(':hover')) timer = setInterval(() => show(current + 1), 5000); };
  marks.forEach((mark, i) => mark.addEventListener('click', () => { stop(); show(i); }));
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', () => setTimeout(start, 0));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); } });
  document.addEventListener('visibilitychange', start);
  motion.addEventListener('change', start);
  readLink?.addEventListener('click', event => {
    const href = readLink.getAttribute('href');
    const target = href && document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', href);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  });
  show(0); start();
})();


(() => {
  'use strict';
  const compact = matchMedia('(max-width: 760px)');
  const courses = [...document.querySelectorAll('.course-year')];
  const admissions = [...document.querySelectorAll('.admission-group')];
  const mobileState = new Map([...courses, ...admissions].map(item => [item, item.open]));
  const applyLayout = () => {
    [...courses, ...admissions].forEach(item => { item.open = compact.matches ? mobileState.get(item) : true; });
  };
  [...courses, ...admissions].forEach(item => item.addEventListener('toggle', () => {
    if (compact.matches) mobileState.set(item, item.open);
  }));
  compact.addEventListener('change', applyLayout);
  applyLayout();

  const menu = document.querySelector('.chapter-menu');
  if (!menu) return;
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  links.forEach(link => link.addEventListener('click', event => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    menu.open = false;
    history.pushState(null, '', link.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  }));
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary')?.focus();
  });
  compact.addEventListener('change', () => { menu.open = false; });
})();
