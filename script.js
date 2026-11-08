
(() => {
  'use strict';

  // =========================================
  // DREAM LADDERS — INITIAL PAGE POSITION
  // =========================================

  const loader = document.getElementById('dl-loader');
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Prevent browser restoring an unwanted scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Lock scrolling while logo intro is playing
  if (loader && !reducedMotion) {
    document.body.style.overflow = 'hidden';
  }

  function finishIntro() {
    if (!loader || !loader.isConnected) return;

    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.remove();

        document.body.style.overflow = '';
        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });

        // Recalculate reveal positions
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    });
  }

  if (reducedMotion && loader) {
    loader.remove();
  } else if (loader && window.gsap) {

    gsap.set('.dl-part-1', {
      x: -120, rotation: -25, scale: .8
    });

    gsap.set('.dl-part-2', {
      x: 120, rotation: 25, scale: .8
    });

    gsap.set('.dl-part-3', {
      y: -80, rotation: -10
    });

    gsap.set('.dl-part-4', {
      scale: 0, opacity: 0
    });

    const intro = gsap.timeline({
      onComplete: finishIntro
    });

    intro.to('.dl-part-1', {
      opacity: 1,
      strokeDashoffset: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    });

    intro.to('.dl-part-2', {
      opacity: 1,
      strokeDashoffset: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=.9');

    intro.to('.dl-part-3', {
      opacity: 1,
      strokeDashoffset: 0,
      y: 0,
      rotation: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=.8');

    intro.to('.dl-part-4', {
      opacity: 1,
      strokeDashoffset: 0,
      scale: 1,
      duration: .8,
      ease: 'back.out(2)'
    }, '-=.6');

    intro.to('#dl-logo', {
      scale: 1.05,
      duration: .5
    });

    intro.to('.dl-loader-text', {
      opacity: 1,
      y: -5,
      duration: .8
    }, '-=.2');

    intro.to('.dl-loader-caption', {
      opacity: 1,
      duration: .6
    }, '-=.4');

    intro.to({}, { duration: 1 });

  } else if (loader) {
    loader.remove();
    document.body.style.overflow = '';
  }

  // =========================================
  // COSMOS BACKGROUND
  // =========================================

  const canvas = document.getElementById('cosmos');
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  let particles = [], sparks = [];

  const rand = (a, b) => Math.random() * (b - a) + a;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.7);

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({
      length: Math.min(95, Math.floor(w / 13))
    }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(.5, 1.8),
      a: rand(.12, .55),
      s: rand(.08, .35),
      p: rand(0, 6.28)
    }));
  }

  function burst(x, y) {
    for (let i = 0; i < 55; i++) {
      const a = Math.PI * 2 * i / 55 + rand(-.07, .07);
      const v = rand(1.1, 4.2);

      sparks.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: rand(45, 85),
        max: 85,
        r: rand(1, 2.5)
      });
    }
  }

  function frame(t) {
    if (!reducedMotion && document.visibilityState === 'visible') {

      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y -= p.s * .25;
        p.p += .012;

        if (p.y < 0) p.y = h;

        ctx.beginPath();
        ctx.fillStyle =
          `rgba(241,199,126,${p.a * (.65 + .35 * Math.sin(p.p + t * .0005))})`;

        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      sparks = sparks.filter(s => s.life > 0);

      sparks.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;

        s.vx *= .985;
        s.vy = s.vy * .985 + .018;
        s.life--;

        ctx.beginPath();
        ctx.fillStyle =
          `rgba(255,207,128,${Math.max(0, s.life / s.max)})`;

        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(frame);
  }

  resize();

  window.addEventListener('resize', resize, { passive: true });

  requestAnimationFrame(frame);

  // =========================================
  // TOAST
  // =========================================

  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // =========================================
  // DIYA INTERACTION
  // =========================================

  const lampStage = document.getElementById('lampStage');

  document.getElementById('lightBtn').addEventListener('click', () => {
    const r = lampStage.getBoundingClientRect();

    burst(
      r.left + r.width / 2,
      r.top + r.height * .52
    );

    showToast('A little light. A world of possibilities. ✨');
  });

  lampStage.addEventListener('click', e => {
    burst(e.clientX, e.clientY);
  });

  // =========================================
  // AUTOMATIC FIREWORKS
  // =========================================

  if (!reducedMotion) {
    setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        Math.random() > .25
      ) {
        burst(
          rand(w * .55, w * .95),
          rand(h * .12, h * .48)
        );
      }
    }, 2400);
  }

  // =========================================
  // SCROLL REVEAL
  // =========================================

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, {
      threshold: .12
    });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  // =========================================
  // SERVICE DEMONSTRATIONS
  // =========================================

  const content = {
    web: {
      label: 'DIGITAL PRESENCE / LIVE CONCEPT',
      title: 'A website that<br>works as hard as you do.',
      desc: 'A clear, mobile-friendly home for your business — with services, gallery, location and a simple way for customers to contact you.',
      bullets: [
        'Responsive business pages',
        'WhatsApp / email enquiry paths',
        'Fast, search-friendly structure'
      ],
      brand: 'THE GOOD TABLE',
      headline: 'Good food.<br>Good moments.',
      tag: 'FRESH · LOCAL · MADE WITH CARE',
      foot: 'OPEN DAILY · 10 AM – 10 PM'
    },

    civil: {
      label: 'CIVIL ENGINEERING / CONCEPT PREVIEW',
      title: 'Turn a plot of land<br>into a clear plan.',
      desc: 'Explore how drafting and estimation support can make early project decisions easier to understand.',
      bullets: [
        '2D drafting and plan presentation',
        'Preliminary quantity take-offs',
        'Estimate and project documentation'
      ],
      brand: 'YOUR PROJECT',
      headline: 'Plan clearly.<br>Build confidently.',
      tag: 'DESIGN · PLAN · ESTIMATE',
      foot: 'CONCEPTUAL PROJECT PREVIEW'
    },

    cloud: {
      label: 'CLOUD & DEVOPS / WORKFLOW PREVIEW',
      title: 'From a code change<br>to a live release.',
      desc: 'A simple visual of a modern delivery workflow — source control, automated checks and deployment to a cloud host.',
      bullets: [
        'Git-based source control',
        'Build and quality-check stages',
        'Repeatable cloud deployment'
      ],
      brand: 'DELIVERY PIPELINE',
      headline: 'Build. Test.<br>Deploy.',
      tag: 'SOURCE → BUILD → VERIFY',
      foot: 'AUTOMATED WORKFLOW CONCEPT'
    }
  };

  document.querySelectorAll('.service-tab').forEach(btn => {

    btn.addEventListener('click', () => {

      document.querySelectorAll('.service-tab').forEach(b => {
        b.classList.toggle('active', b === btn);

        b.setAttribute(
          'aria-selected',
          String(b === btn)
        );
      });

      const d = content[btn.dataset.tab];

      if (!d) return;

      document.getElementById('demoLabel').textContent = d.label;
      document.getElementById('demoTitle').innerHTML = d.title;
      document.getElementById('demoDescription').textContent = d.desc;

      document.getElementById('demoBullets').innerHTML =
        d.bullets.map(x => `<li>${x}</li>`).join('');

      document.getElementById('miniBrand').textContent = d.brand;
      document.getElementById('miniHeadline').innerHTML = d.headline;

      document.querySelector('.mini-hero small').textContent = d.tag;
      document.querySelector('.mini-foot span').textContent = d.foot;

      document.getElementById('miniAction').textContent =
        btn.dataset.tab === 'web'
          ? 'EXPLORE MENU ↗'
          : btn.dataset.tab === 'civil'
            ? 'VIEW PROJECT ↗'
            : 'VIEW PIPELINE ↗';

      document.getElementById('demoPanel').animate(
        [
          { opacity: .55, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 380,
          easing: 'ease-out'
        }
      );

    });

  });

  document.getElementById('miniAction').addEventListener('click', () => {
    showToast('This is a sample concept — ask us to create yours.');
  });

  // =========================================
  // MOBILE NAVIGATION
  // =========================================

  const menu = document.getElementById('menuBtn');
  const nav = document.querySelector('.topbar nav');

  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');

    menu.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });

})();
