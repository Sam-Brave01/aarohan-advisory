/* ============================================================
   AAROHAN ADVISORY – app.js
   Handles: Navbar, Counters, Carousel, Form, Scroll Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. STICKY NAVBAR SCROLL BEHAVIOUR
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ──────────────────────────────────────────
     2. MOBILE NAV TOGGLE
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ──────────────────────────────────────────
     3. SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     4. SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     5. ANIMATED NUMBER COUNTERS
  ────────────────────────────────────────── */
  let heroCountersDone = false;

  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startVal = 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  // Hero stats — fire once on page load (hero is visible)
  const triggerHeroCounters = () => {
    if (heroCountersDone) return;
    heroCountersDone = true;
    document.querySelectorAll('.hero .stat-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
  };

  // Slight delay so the animation is noticeable
  setTimeout(triggerHeroCounters, 600);

  // About section counters — fire on scroll
  const aboutCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter-about').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10));
        });
        aboutCounterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) aboutCounterObserver.observe(aboutSection);


  /* ──────────────────────────────────────────
     6. HERO PARTICLES (floating dots)
  ────────────────────────────────────────── */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const dur = Math.random() * 12 + 8;
      const delay = Math.random() * 6;
      const opc = Math.random() * 0.25 + 0.05;

      Object.assign(dot.style, {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: i % 3 === 0 ? '#C9960C' : '#ffffff',
        opacity: opc,
        animation: `floatDot ${dur}s ease-in-out ${delay}s infinite alternate`,
      });
      particleContainer.appendChild(dot);
    }

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatDot {
        0%   { transform: translate(0, 0) scale(1); }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 30 + 10)}px, -${Math.floor(Math.random() * 40 + 20)}px) scale(1.3); }
      }
    `;
    document.head.appendChild(style);
  }


  /* ──────────────────────────────────────────
     7. TESTIMONIAL CAROUSEL
  ────────────────────────────────────────── */
  const track = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.dot');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');

  if (track) {
    let current = 0;
    const total = track.children.length;
    let autoTimer;

    const goTo = (index) => {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    btnNext.addEventListener('click', () => { next(); resetAuto(); });
    btnPrev.addEventListener('click', () => { prev(); resetAuto(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        resetAuto();
      });
    });

    const startAuto = () => { autoTimer = setInterval(next, 4500); };
    const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

    startAuto();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', startAuto);

    // Touch / Swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetAuto(); }
    });
  }


  /* ──────────────────────────────────────────
     8. CONTACT FORM VALIDATION
  ────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    const validators = {
      name: {
        el: document.getElementById('name'),
        errEl: document.getElementById('nameError'),
        validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).'
      },
      phone: {
        el: document.getElementById('phone'),
        errEl: document.getElementById('phoneError'),
        validate: v => /^[0-9]{10}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit phone number.'
      },
      email: {
        el: document.getElementById('email'),
        errEl: document.getElementById('emailError'),
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.'
      },
      service: {
        el: document.getElementById('service'),
        errEl: document.getElementById('serviceError'),
        validate: v => v ? '' : 'Please select a service.'
      }
    };

    const showError = (key, msg) => {
      const { el, errEl } = validators[key];
      errEl.textContent = msg;
      el.closest('.form-group').classList.toggle('error', !!msg);
    };

    const validateField = (key) => {
      const { el, validate } = validators[key];
      const msg = validate(el.value);
      showError(key, msg);
      return !msg;
    };

    // Live validation on blur
    Object.keys(validators).forEach(key => {
      validators[key].el.addEventListener('blur', () => validateField(key));
      validators[key].el.addEventListener('input', () => {
        if (validators[key].el.closest('.form-group').classList.contains('error')) {
          validateField(key);
        }
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const allValid = Object.keys(validators).map(validateField).every(Boolean);
      if (!allValid) return;

      // Show loader briefly, then open WhatsApp
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
      submitBtn.disabled = true;

      // Collect all field values
      const nameVal = document.getElementById('name').value.trim();
      const phoneVal = document.getElementById('phone').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const serviceEl = document.getElementById('service');
      const serviceVal = serviceEl.options[serviceEl.selectedIndex].text;
      const messageVal = document.getElementById('message').value.trim();

      // Build formatted WhatsApp message
      const waText =
        'New Client Inquiry:%0A%0A' +
        'Name: ' + encodeURIComponent(nameVal) + '%0A' +
        'Phone: ' + encodeURIComponent(phoneVal) + '%0A' +
        'Email: ' + encodeURIComponent(emailVal) + '%0A' +
        'Service: ' + encodeURIComponent(serviceVal) + '%0A' +
        'Message: ' + encodeURIComponent(messageVal);

      const waURL = 'https://wa.me/919431778233?text=' + waText;

      setTimeout(() => {
        window.open(waURL, '_blank');
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 600);
    });
  }

}); // end DOMContentLoaded
