/* =============================================
   ASHISH KUMAR VERMA — PORTFOLIO
   JavaScript Application
   ============================================= */

(function () {
  'use strict';

  // ─── DOM CACHE ──────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ─── 1. PRELOADER ───────────────────────────
  function initPreloader() {
    const preloader = $('.preloader');
    const progressBar = $('.preloader-bar');
    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = progress + '%';
      if (progress >= 100) clearInterval(interval);
    }, 200);

    window.addEventListener('load', () => {
      if (progressBar) progressBar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 600);
    });

    // Fallback: hide preloader after 4s max
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 4000);
  }

  // ─── 2. CUSTOM CURSOR ──────────────────────
  function initCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = $('#cursor');
    const ring = $('#cursor-ring');
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!cursorVisible) {
        cursorVisible = true;
        document.body.classList.add('cursor-visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorVisible = false;
      document.body.classList.remove('cursor-visible');
    });

    document.addEventListener('mouseenter', () => {
      cursorVisible = true;
      document.body.classList.add('cursor-visible');
    });

    // Interactive hover states
    $$('a, button, .btn, .project-card, .skill-card, .edu-card, .contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });

    // Text hover state
    $$('.hero-desc, .about-text, .exp-bullets li').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });

    // Animation loop
    function animate() {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ─── 3. PARTICLE SYSTEM ────────────────────
  function initParticles() {
    const canvas = $('#particles-canvas');
    if (!canvas) return;

    let particleColorRGB = '91, 138, 240';
    window.refreshParticles = () => {
      const accent = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim();
      if (accent) particleColorRGB = accent;
    };
    window.refreshParticles();

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
    const CONNECTION_DIST = 140;
    const MOUSE_DIST = 200;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseAlpha = Math.random() * 0.4 + 0.1;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse repulsion
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.015;
          this.vx += dx * force;
          this.vy += dy * force;
        }

        // Dampen velocity
        this.vx *= 0.999;
        this.vy *= 0.999;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColorRGB}, ${this.alpha})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColorRGB}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
      resize();
    });

    init();
    animate();
  }

  // ─── 4. MOBILE MENU ────────────────────────
  function initMobileMenu() {
    const hamburger = $('.hamburger');
    const mobileMenu = $('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close on link click
    $$('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ─── 5. SCROLL PROGRESS ────────────────────
  function initScrollProgress() {
    const bar = $('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      bar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ─── 6. SCROLL REVEAL ──────────────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
  }

  // ─── 7. ACTIVE NAV HIGHLIGHTING ────────────
  function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a');
    const nav = $('nav');

    window.addEventListener('scroll', () => {
      // Scrolled state for nav
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Active section
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
          current = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }, { passive: true });
  }

  // ─── 8. TYPING EFFECT ─────────────────────
  function initTypingEffect() {
    const element = $('.hero-sub');
    if (!element) return;

    const strings = [
      'Backend Developer',
      'API Architect',
      'Node.js Developer',
      'Database Engineer',
      'Problem Solver'
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    // Create cursor element
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typed-cursor';
    element.appendChild(cursorSpan);

    function type() {
      const current = strings[stringIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, 50);
        return;
      }

      if (!isDeleting) {
        charIndex++;
        element.firstChild.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isPaused = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 80 + Math.random() * 40);
      } else {
        charIndex--;
        element.firstChild.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35 + Math.random() * 20);
      }
    }

    // Start with empty text node
    element.insertBefore(document.createTextNode(''), cursorSpan);
    setTimeout(type, 800);
  }

  // ─── 9. ANIMATED COUNTERS ──────────────────
  function initCounters() {
    const counters = $$('.stat-num[data-target]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(el) {
      const target = el.getAttribute('data-target');
      const suffix = el.getAttribute('data-suffix') || '';
      const isNumber = !isNaN(parseInt(target));

      if (!isNumber) {
        el.textContent = target;
        return;
      }

      const targetNum = parseInt(target);
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * targetNum);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }

  // ─── 10. PROJECT CARD EFFECTS ──────────────
  function initCardEffects() {
    const cards = $$('.project-card:not(.cta-card)');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Light spotlight effect
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        // Subtle 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── 11. BACK TO TOP ───────────────────────
  function initBackToTop() {
    const btn = $('.back-to-top');
    if (!btn) return;

    const progressCircle = $('.progress-ring circle', btn);
    let circumference = 0;

    if (progressCircle) {
      const radius = progressCircle.getAttribute('r');
      circumference = 2 * Math.PI * radius;
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      // Show/hide button
      if (scrollTop > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }

      // Update progress ring
      if (progressCircle && circumference) {
        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = offset;
      }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 12. SMOOTH SCROLL ─────────────────────
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─── 13. MAGNETIC BUTTONS ──────────────────
  function initMagneticButtons() {
    if ('ontouchstart' in window) return;

    $$('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ─── 14. THEME MANAGER ─────────────────────
  function initThemeManager() {
    const themeToggle = $('#theme-toggle');
    if (!themeToggle) return;
    
    const bodyElement = document.body; // or documentElement
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      bodyElement.setAttribute('data-theme', savedTheme);
    }
  
    themeToggle.addEventListener('click', () => {
      const currentTheme = bodyElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      bodyElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update canvas particle colors
      if (window.refreshParticles) window.refreshParticles();
    });
  }

  // ─── 15. PROJECT MODALS ────────────────────
  function initProjectModal() {
    const modalOverlay = $('#project-modal');
    const modalClose = $('#modal-close');
    const modalContent = $('#modal-content');
    const openModalBtns = $$('.open-modal-btn');
  
    if (!modalOverlay || !modalContent) return;

    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        
        const title = card.querySelector('.project-title').innerText;
        const tech = card.querySelector('.project-tech').innerHTML;
        const desc = card.querySelector('.project-desc').innerText;
        const featuresHTML = card.querySelector('.project-features').innerHTML;
        const link = card.getAttribute('data-link');
        
        modalContent.innerHTML = `
          <h3>${title}</h3>
          <div class="modal-tech project-tech" style="gap:8px; margin-bottom:24px;">${tech}</div>
          <p>${desc}</p>
          <h4 style="color:var(--text-bright); margin-bottom:12px; font-family:'Syne', sans-serif;">Key Features</h4>
          <ul class="project-features" style="margin-bottom:0;">${featuresHTML}</ul>
          <div class="modal-cta">
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:14px; padding:16px 32px;">Launch Project &nbsp; &#8594;</a>
          </div>
        `;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  
    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ─── INIT ALL ───────────────────────────────
  function init() {
    initPreloader();
    initCursor();
    initParticles();
    initMobileMenu();
    initScrollProgress();
    initScrollReveal();
    initActiveNav();
    initTypingEffect();
    initCounters();
    initCardEffects();
    initBackToTop();
    initSmoothScroll();
    initMagneticButtons();
    initThemeManager();
    initProjectModal();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
