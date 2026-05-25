/* Velshift Canvas Engine v2 — replaces Three.js r128 (~600KB → ~3KB) */
(function () {
  'use strict';

  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  // ── STARS ──────────────────────────────────────────────────────────────────
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 0.3 + Math.random() * 1.1,
    base: 0.15 + Math.random() * 0.65,
    phase: Math.random() * 6.28,
    spd: 0.3 + Math.random() * 1.4
  }));

  // ── FLOATING PARTICLES ─────────────────────────────────────────────────────
  const particles = Array.from({ length: 110 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.20,
    r: 1.0 + Math.random() * 2.6,
    warm: Math.random() > 0.44,
    phase: Math.random() * 6.28
  }));

  // ── MOUSE PARALLAX ─────────────────────────────────────────────────────────
  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
  document.addEventListener('mousemove', e => {
    tmx = e.clientX / W;
    tmy = e.clientY / H;
  }, { passive: true });

  // ── SCROLL PROGRESS BAR ────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const sp = document.getElementById('scene-progress');
    if (sp) sp.style.width =
      Math.min(window.scrollY / (document.body.scrollHeight - innerHeight) * 100, 100) + '%';
  }, { passive: true });

  // ── RENDER LOOP ────────────────────────────────────────────────────────────
  let t = 0, alpha = 0;

  function frame() {
    requestAnimationFrame(frame);
    t   += 0.008;
    mx  += (tmx - mx) * 0.05;
    my  += (tmy - my) * 0.05;
    if (alpha < 1) alpha = Math.min(1, alpha + 0.014);

    /* Background */
    ctx.globalAlpha = 1;
    ctx.fillStyle   = '#030918';
    ctx.fillRect(0, 0, W, H);

    /* Stars */
    ctx.fillStyle = '#ffffff';
    for (const s of stars) {
      ctx.globalAlpha = s.base * (0.5 + 0.5 * Math.sin(t * s.spd + s.phase)) * alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fill();
    }

    /* Glow rings */
    const cx   = W * 0.5  + (mx - 0.5) * W * 0.07;
    const cy   = H * 0.38 + (my - 0.5) * H * 0.05;
    const base = Math.min(W, H) * 0.18;
    const rings = [
      { r: base * 0.70 + Math.sin(t * 0.50) * 12, c: 'rgba(255,90,87,0.14)'  },
      { r: base * 1.05 + Math.sin(t * 0.35) * 18, c: 'rgba(224,47,117,0.09)' },
      { r: base * 1.60 + Math.sin(t * 0.22) * 26, c: 'rgba(85,51,255,0.06)'  }
    ];
    ctx.globalAlpha = alpha;
    for (const ring of rings) {
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, 6.2832);
      ctx.strokeStyle = ring.c;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    /* Floating particles */
    for (const p of particles) {
      p.x += p.vx + (mx - 0.5) * 0.09;
      p.y += p.vy + (my - 0.5) * 0.06;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      ctx.globalAlpha = (0.28 + 0.24 * Math.sin(t * 0.55 + p.phase)) * alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fillStyle = p.warm ? '#FF6058' : '#8855EE';
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  frame();

  /* Resize */
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });
})();
