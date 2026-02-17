/**
 * Crack PTE - Visual Effects Engine
 * Particles, scroll reveal, parallax, ripple effects, mobile bottom nav
 */
window.PTE = window.PTE || {};

PTE.Effects = {
  _particleCanvas: null,
  _particleCtx: null,
  _particles: [],
  _raf: null,
  _observer: null,

  // ── Initialize all effects ─────────────────────────────────
  init() {
    this.initParticles();
    this.initScrollReveal();
    this.initRipple();
    this.initParallax();
    this.initMobileBottomNav();

    // Re-init on page change
    window.addEventListener('hashchange', () => {
      setTimeout(() => {
        this.refreshScrollReveal();
        this.refreshMobileBottomNav();
      }, 100);
    });
  },

  // ══════════════════════════════════════════════════
  // PARTICLE SYSTEM
  // ══════════════════════════════════════════════════

  initParticles() {
    // Create canvas
    let canvas = document.getElementById('particles-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particles-canvas';
      document.body.prepend(canvas);
    }

    this._particleCanvas = canvas;
    this._particleCtx = canvas.getContext('2d');
    this._particles = [];

    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    // Create particles
    const count = window.innerWidth < 640 ? 30 : 50;
    for (let i = 0; i < count; i++) {
      this._particles.push(this._createParticle());
    }

    this._animateParticles();
  },

  _resizeCanvas() {
    if (!this._particleCanvas) return;
    this._particleCanvas.width = window.innerWidth;
    this._particleCanvas.height = window.innerHeight;
  },

  _createParticle() {
    const colors = [
      'rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(34,211,238,',
      'rgba(16,185,129,', 'rgba(236,72,153,'
    ];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  },

  _animateParticles() {
    const ctx = this._particleCtx;
    const canvas = this._particleCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    this._particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Pulse opacity
      const pulse = Math.sin(time * p.pulseSpeed * 10 + p.pulsePhase) * 0.3 + 0.7;
      const alpha = p.opacity * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();
    });

    // Draw connections between nearby particles
    for (let i = 0; i < this._particles.length; i++) {
      for (let j = i + 1; j < this._particles.length; j++) {
        const a = this._particles[i];
        const b = this._particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    this._raf = requestAnimationFrame(() => this._animateParticles());
  },

  // ══════════════════════════════════════════════════
  // SCROLL REVEAL
  // ══════════════════════════════════════════════════

  initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    this.refreshScrollReveal();
  },

  refreshScrollReveal() {
    if (!this._observer) return;
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      // Reset for re-observation
      if (!el.classList.contains('visible')) {
        this._observer.observe(el);
      }
    });
  },

  // ══════════════════════════════════════════════════
  // RIPPLE EFFECT
  // ══════════════════════════════════════════════════

  initRipple() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.ripple, button, a[href]');
      if (!target || target.closest('.no-ripple')) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // Create ripple element
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.width = wave.style.height = size + 'px';
      wave.style.left = x + 'px';
      wave.style.top = y + 'px';

      // Ensure parent has relative positioning and overflow hidden
      const pos = getComputedStyle(target).position;
      if (pos === 'static') target.style.position = 'relative';
      target.style.overflow = 'hidden';

      target.appendChild(wave);
      setTimeout(() => wave.remove(), 600);
    });
  },

  // ══════════════════════════════════════════════════
  // PARALLAX
  // ══════════════════════════════════════════════════

  initParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this._updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },

  _updateParallax() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-bg').forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.3');
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY) * speed;
      el.style.transform = `translateY(${scrollY * speed - offset}px)`;
    });
  },

  // ══════════════════════════════════════════════════
  // MOBILE BOTTOM NAVIGATION
  // ══════════════════════════════════════════════════

  initMobileBottomNav() {
    // Only add once
    if (document.getElementById('mobile-bottom-nav')) return;

    const nav = document.createElement('div');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'mobile-bottom-nav';
    document.body.appendChild(nav);

    this.refreshMobileBottomNav();
  },

  refreshMobileBottomNav() {
    const nav = document.getElementById('mobile-bottom-nav');
    if (!nav) return;

    // Don't show on login/signup pages
    const hash = location.hash.slice(1) || '/';
    if (hash === '/login' || hash === '/signup') {
      nav.style.display = 'none';
      return;
    }
    nav.style.display = '';

    const currentPage = hash.split('/')[1] || '';
    const items = [
      { href: '#/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home', page: '' },
      { href: '#/practice', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', label: 'Practice', page: 'practice' },
      { href: '#/predictions', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Predict', page: 'predictions' },
      { href: '#/progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Stats', page: 'progress' },
      { href: '#/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile', page: 'profile' },
    ];

    nav.innerHTML = items.map(item => {
      const active = currentPage === item.page;
      return `<a href="${item.href}" class="${active ? 'active' : ''}">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${item.icon}"/></svg>
        <span>${item.label}</span>
      </a>`;
    }).join('');
  }
};

// Boot effects after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to let app render first
  setTimeout(() => PTE.Effects.init(), 300);
});
