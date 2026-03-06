/* ========================================
   RoseLoe Motel - Premium Interaction Engine
   3D Tilt | Parallax | Magnetic Buttons | Particles
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // === PRELOADER ===
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1400);
  });
  // Fallback: hide preloader after 3s max
  setTimeout(() => preloader.classList.add('hidden'), 3000);

  // === SCROLL PROGRESS BAR ===
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // === CURSOR GLOW ===
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.transform = `translate(${mouseX - 200}px, ${mouseY - 200}px)`;
    });
  }

  // === NAVBAR ===
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }

  // === BACK TO TOP ===
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === COMBINED SCROLL HANDLER ===
  function onScroll() {
    updateScrollProgress();
    updateNavbar();
    updateBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === MOBILE NAV ===
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // === HERO SLIDER ===
  const slides = document.querySelectorAll('.hero-slide');
  const slideNumEl = document.getElementById('currentSlideNum');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (slideNumEl) {
      slideNumEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  startSlider();

  // === HERO PARTICLES ===
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (8 + Math.random() * 12) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.2 + Math.random() * 0.4;
      particleContainer.appendChild(particle);
    }
  }

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === SCROLL REVEAL ===
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // === 3D TILT CARDS ===
  const tiltCards = document.querySelectorAll('.tilt-card');

  if (window.matchMedia('(hover: hover)').matches) {
    tiltCards.forEach(card => {
      const maxTilt = parseFloat(card.dataset.tiltMax) || 8;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(${1000}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease-out';

        // Move shine
        const shine = card.querySelector('.img-shine');
        if (shine) {
          const shineX = (x / rect.width) * 100;
          const shineY = (y / rect.height) * 100;
          shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
          shine.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        const shine = card.querySelector('.img-shine');
        if (shine) shine.style.opacity = '0';
      });
    });
  }

  // === MAGNETIC BUTTONS ===
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        btn.style.transition = 'transform 0.2s ease-out';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  // === ANIMATED COUNTERS ===
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          counter.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // === PARALLAX BACKGROUNDS ===
  const parallaxElements = document.querySelectorAll('.parallax-bg');

  function updateParallax() {
    parallaxElements.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const scrollPercent = rect.top / window.innerHeight;
      const yOffset = scrollPercent * 60;
      el.style.transform = `translateY(${yOffset}px) scale(1.1)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // === GALLERY LIGHTBOX ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let lightboxIndex = 0;

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      lightboxIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = galleryItems[lightboxIndex].querySelector('img').src;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryItems.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox();
  });

  document.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
    openLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
  });

  // === ACTIVE NAV HIGHLIGHTING ===
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          const isActive = a.getAttribute('href') === `#${id}`;
          a.style.opacity = isActive ? '1' : '';
          if (isActive) {
            a.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(section => sectionObserver.observe(section));

});
