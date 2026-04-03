(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────────
  const CFG = {
    numArms:          3,
    spiralTightness:  1.8,     // radians of twist (shorter, less-wrapped arms)
    rotationSpeed:    2.00,    // rad/s for the whole structure (~3s/revolution)
    armWidthBase:     0.40,    // angular half-width of arms
    blackHoleRadius:  0.11,
    accretionRadius:  0.155,
    accretionWidth:   0.016,
    numParticles:     280,
    targetFPS:        30,
    charRamp:         ' .`\',:;-~=+*ix#%@',
    // Char aspect ratio (height / width). Used to keep grid cells square on screen
    // so the black hole renders as a circle, not an ellipse.
    charAspect:       2.1,
  };

  // ── State ────────────────────────────────────────────────────────────────────
  let cols, rows, particles, particleGrid, highlightGrid;
  // Precomputed per-cell (nx, ny, r, theta) so renderFrame doesn't redo it each frame
  let cellCoords;
  let lastTime = null, animating = false, rafId = null, gradientApplied = false;
  let pre, container;
  let resizeTimer = null;
  // ── Orbital state ─────────────────────────────────────────────────────────────
  // The vortex orbits the profile photo like a body in a gravity well.
  let orbX, orbY, orbVx, orbVy;
  let orbActive   = false;  // becomes true after the initial 5 s delay
  let offScreenTs = null;   // safety-net: respawn if off-screen too long
  let respawning  = false;
  let entryTimer  = null;   // handle for the 5 s startup delay
  const ORB_GM  = 3e6;  // gravitational parameter (px³ s⁻²)
  const ORB_EPS = 55;   // softening length (px) — prevents singularity at close approach

  // ── Math helpers ─────────────────────────────────────────────────────────────
  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function wrapAngle(a) {
    while (a >  Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  // ── Coordinate system ─────────────────────────────────────────────────────────
  // We want a visually circular black hole.
  //
  // A character cell is charAspect times taller than it is wide on screen.
  // For equal physical distance in x and y to look equal on screen:
  //   dx_screen = dx_col * charWidth
  //   dy_screen = dy_row * charWidth * charAspect
  // Equal ⟹ dx_col = dy_row * charAspect
  //
  // So we set:  rows = cols / charAspect
  // and use unnormalised coords:
  //   nx = (col / (cols-1) - 0.5) * 2        ← range [-1, 1]
  //   ny = (row / (rows-1) - 0.5) * 2        ← range [-1, 1]
  //   r  = sqrt(nx² + ny²)                   ← circular in screen space ✓
  //
  // The inverse (used when placing particles on the grid):
  //   col = round((nx/2 + 0.5) * (cols-1))
  //   row = round((ny/2 + 0.5) * (rows-1))

  function buildCellCoords() {
    cellCoords = new Float32Array(cols * rows * 4); // nx, ny, r, theta per cell
    for (let row = 0; row < rows; row++) {
      const ny = ((row / (rows - 1)) - 0.5) * 2.0;
      for (let col = 0; col < cols; col++) {
        const nx    = ((col / (cols - 1)) - 0.5) * 2.0;
        const r     = Math.sqrt(nx * nx + ny * ny);
        const theta = Math.atan2(ny, nx);
        const base  = (row * cols + col) * 4;
        cellCoords[base]     = nx;
        cellCoords[base + 1] = ny;
        cellCoords[base + 2] = r;
        cellCoords[base + 3] = theta;
      }
    }
  }

  // ── Particle system ──────────────────────────────────────────────────────────
  function spawnParticle(p) {
    const armIdx = Math.floor(Math.random() * CFG.numArms);
    const armBase = (2 * Math.PI * armIdx) / CFG.numArms;
    p.r         = 0.72 + Math.random() * 0.22;
    p.theta     = armBase + (Math.random() - 0.5) * 1.9;
    p.bright    = 0.55 + Math.random() * 0.35;
    p.speed     = 0.045 + Math.random() * 0.030;
    p.life      = 0;
    // ~8% of particles are "bright sparks" — rendered as a dense glyph
    // regardless of surrounding density, making individual trajectories visible
    p.highlight = Math.random() < 0.08;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < CFG.numParticles; i++) {
      const p = { r: 0, theta: 0, bright: 0, speed: 0, life: 0 };
      spawnParticle(p);
      // Scatter initial r so the vortex isn't empty at startup
      p.r = CFG.blackHoleRadius + 0.03 + Math.random() * (0.88 - CFG.blackHoleRadius);
      particles.push(p);
    }
  }

  function updateParticles(dt) {
    for (const p of particles) {
      const omega = 0.32 / (p.r * p.r + 0.04);
      p.r     -= p.speed * dt;
      p.theta -= omega * dt;  // clockwise, matching arm rotation
      p.life  += dt;
      // Fade from bright (outer) to dim (inner): clear "sucked in" narrative
      const fraction = Math.max(0, (p.r - CFG.blackHoleRadius) / (0.88 - CFG.blackHoleRadius));
      p.bright = 0.10 + 0.80 * fraction;

      if (p.r < CFG.blackHoleRadius) spawnParticle(p);
    }
  }

  function buildParticleGrid() {
    const n = cols * rows;
    for (let i = 0; i < n; i++) { particleGrid[i] = 0; highlightGrid[i] = 0; }

    const halfCols = (cols - 1) / 2;
    const halfRows = (rows - 1) / 2;
    const bhR2     = CFG.blackHoleRadius * CFG.blackHoleRadius;

    for (const p of particles) {
      if (p.r < CFG.blackHoleRadius + 0.015) continue; // don't plot into BH zone

      const nx  = p.r * Math.cos(p.theta);
      const ny  = p.r * Math.sin(p.theta);
      const col = Math.round((nx / 2 + 0.5) * (cols - 1));
      const row = Math.round((ny / 2 + 0.5) * (rows - 1));
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;

      // Double-check the cell is outside the BH in render-space coords
      const cnx = ((col / (cols - 1)) - 0.5) * 2;
      const cny = ((row / (rows - 1)) - 0.5) * 2;
      if (cnx * cnx + cny * cny < bhR2) continue;

      const idx = row * cols + col;
      particleGrid[idx] = Math.min(1, particleGrid[idx] + p.bright * 0.55);
      if (p.highlight) highlightGrid[idx] = 1;
    }
  }

  // ── Density functions ─────────────────────────────────────────────────────────
  function spiralDensity(r, theta, time) {
    let total = 0;
    const TWO_PI = 2 * Math.PI;
    for (let i = 0; i < CFG.numArms; i++) {
      const rot   = time * CFG.rotationSpeed;
      const noise = 0.18 * Math.sin(r * 7.3 + i * 2.17 - rot)
                  + 0.10 * Math.sin(r * 13.1 + i * 3.88 - rot);
      const armAngle = (TWO_PI * i) / CFG.numArms
                     + r * CFG.spiralTightness
                     - time * CFG.rotationSpeed
                     + noise;
      const delta = Math.abs(wrapAngle(theta - armAngle));
      const width = CFG.armWidthBase * (0.4 + 0.6 * (1.0 - 0.5 * r));
      const gaussian = Math.exp(-(delta * delta) / (2 * width * width));
      const radialFade = smoothstep(CFG.blackHoleRadius, 0.20, r)
                       * (1.0 - smoothstep(0.62, 0.82, r));
      total += gaussian * radialFade;
    }
    return Math.min(1, total);
  }

  function accretionDensity(r, theta, time) {
    const dist  = r - CFG.accretionRadius;
    const ring  = Math.exp(-(dist * dist) / (CFG.accretionWidth * CFG.accretionWidth));
    const spots = 0.55 + 0.45 * Math.sin(theta * 4 - time * 0.8)
                        * Math.cos(theta * 2 - time * 0.48);
    const fade  = smoothstep(CFG.blackHoleRadius, CFG.accretionRadius, r);
    return ring * spots * fade;
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  function renderFrame(time) {
    buildParticleGrid();

    const ramp    = CFG.charRamp;
    const rampLen = ramp.length;
    const bhR2    = CFG.blackHoleRadius * CFG.blackHoleRadius;
    const lines   = [];

    for (let row = 0; row < rows; row++) {
      let line = '';
      const rowBase = row * cols;
      for (let col = 0; col < cols; col++) {
        const base  = (rowBase + col) * 4;
        const nx    = cellCoords[base];
        const ny    = cellCoords[base + 1];
        const r     = cellCoords[base + 2];
        const theta = cellCoords[base + 3];

        // Black hole: hard empty circle
        if (nx * nx + ny * ny < bhR2) { line += ' '; continue; }
        // Outside vortex disc
        if (r > 1.02) { line += ' '; continue; }

        let density = 0;
        density += spiralDensity(r, theta, time) * 0.72;
        density += accretionDensity(r, theta, time) * 0.98;
        density += particleGrid[rowBase + col] * 0.58;
        density += 0.04 * Math.sin(col * 0.73 + row * 0.51 + time * 0.2);

        if (highlightGrid[rowBase + col]) {
          const sparkDensity = Math.max(density + 0.28, 0.42);
          const ch = ramp[Math.floor(Math.min(0.9999, sparkDensity) * rampLen)];
          line += '<span class="vortex-spark">' + ch + '</span>';
          continue;
        }
        line += ramp[Math.floor(Math.min(0.9999, Math.max(0, density)) * rampLen)];
      }
      lines.push(line);
    }
    return lines.join('\n');
  }

  // ── Animation loop ────────────────────────────────────────────────────────────
  const frameInterval = 1000 / CFG.targetFPS;

  function loop(ts) {
    if (!animating) return;
    rafId = requestAnimationFrame(loop);
    if (lastTime === null) { lastTime = ts; return; }
    const elapsed = ts - lastTime;
    if (elapsed < frameInterval * 0.85) return;
    lastTime = ts;
    updateParticles(elapsed / 1000);
    updateOrbit(elapsed / 1000);
    pre.innerHTML = renderFrame(ts / 1000);
    if (!gradientApplied) { setGradient(); gradientApplied = true; }
  }

  // ── Orbital mechanics ─────────────────────────────────────────────────────────
  // Returns the document-space centre of the profile photo, or null if not found.
  // Using document coords keeps the orbit fixed in page space — scrolling the page
  // scrolls the vortex along with it.
  function photoCenter() {
    const img = document.querySelector('img.rounded-full');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return {
      x: r.left + r.width  / 2 + window.scrollX,
      y: r.top  + r.height / 2 + window.scrollY,
    };
  }

  // Place the vortex at apoapsis of a highly-eccentric ellipse centred on the
  // photo — Halley's-comet style.  The vortex drifts slowly off-screen near
  // apoapsis, then falls in, whips around the photo at high speed, and flings
  // back out along the same path.  The orbital mechanics guarantee it returns
  // from the same direction every time without any edge-tracking logic.
  //
  // Orbit parameters (with GM = 3e6):
  //   ra   550–850 px  →  apoapsis off-screen in most directions
  //   rp    55–110 px  →  dramatic close pass (above softening radius)
  //   T   ≈ 25–40 s    →  returns roughly every half-minute
  //   v at periapsis ≈ 200–320 px/s  (fast slingshot)
  //   v at apoapsis  ≈  18–28 px/s  (slow drift)
  function spawnComet(ph) {
    const ra  = 550 + Math.random() * 300;
    const rp  = 55   + Math.random() * 55;
    // Exact apoapsis velocity from vis-viva / angular-momentum conservation
    const v_a = Math.sqrt(ORB_GM * 2 * rp / (ra * (rp + ra)));
    // Random apoapsis direction — comet "comes from" a different place each time
    const theta = Math.random() * 2 * Math.PI;
    orbX  = ph.x + ra * Math.cos(theta);
    orbY  = ph.y + ra * Math.sin(theta);
    // Perpendicular velocity (tangent to the ellipse at apoapsis), random CW/CCW
    const s = Math.random() < 0.5 ? 1 : -1;
    orbVx = -s * v_a * Math.sin(theta);
    orbVy =  s * v_a * Math.cos(theta);
  }

  function isOffViewport() {
    const margin = 200;
    const vx = orbX - window.scrollX;
    const vy = orbY - window.scrollY;
    return vx < -margin || vx > window.innerWidth  + margin ||
           vy < -margin || vy > window.innerHeight + margin;
  }

  function updateOrbit(dt) {
    if (!orbActive || respawning) return;
    if (dt > 0.1) dt = 0.1;

    const ph = photoCenter();
    if (!ph) return;

    // Safety net: if somehow off-screen for > 120 s (e.g. energy escaped due to
    // numerical drift), fade out and respawn a fresh comet.
    if (isOffViewport()) {
      if (!offScreenTs) offScreenTs = performance.now();
      if (performance.now() - offScreenTs > 120000) {
        respawning = true;
        container.style.transition = 'opacity 0.4s';
        container.style.opacity    = '0';
        setTimeout(() => {
          spawnComet(photoCenter() || ph);
          container.style.transition = 'opacity 1s';
          container.style.opacity    = '0.8';
          offScreenTs = null;
          respawning  = false;
        }, 500);
      }
    } else {
      offScreenTs = null;
    }

    const dx  = ph.x - orbX;
    const dy  = ph.y - orbY;
    const r2  = dx * dx + dy * dy + ORB_EPS * ORB_EPS;
    const r   = Math.sqrt(r2);
    const acc = ORB_GM / r2;

    orbVx += acc * (dx / r) * dt;
    orbVy += acc * (dy / r) * dt;
    orbX  += orbVx * dt;
    orbY  += orbVy * dt;

    const cw = container.offsetWidth  || 400;
    const ch = container.offsetHeight || 200;
    container.style.left = (orbX - window.scrollX - cw / 2) + 'px';
    container.style.top  = (orbY - window.scrollY - ch / 2) + 'px';
  }

  // ── Sizing ────────────────────────────────────────────────────────────────────
  function computeSize() {
    // Overlay: ~45% of viewport width, capped so it stays manageable.
    // On mobile, double the size: 90% width with larger char estimate.
    const isMobile = window.innerWidth <= 640;
    const widthFrac = isMobile ? 0.90 : 0.45;
    const widthCap  = isMobile ? 1040 : 520;
    const charW     = isMobile ? 17   : 8.5;
    const w = Math.min(Math.round(window.innerWidth * widthFrac), widthCap);
    container.style.width = w + 'px';
    cols = Math.max(40, Math.min(100, Math.floor(w / charW)));
    rows = Math.max(16, Math.round(cols / CFG.charAspect));
  }

  // ── Gradient ──────────────────────────────────────────────────────────────────
  const GRADIENT_STOPS = '#ffff99 0%, #ffdd00 10%, #66ffcc 23%, #00bbff 42%, #0044aa 63%, #001428 82%, transparent 96%';

  function setGradient() {
    // Measure the actual rendered width of a full row of characters.
    // This accounts for the real font metrics (not our 8.5px estimate),
    // so the gradient center lands exactly on the vortex center.
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;letter-spacing:inherit;';
    probe.textContent = ' '.repeat(cols);
    pre.appendChild(probe);
    const contentW = probe.offsetWidth;
    pre.removeChild(probe);

    const preW = pre.offsetWidth;
    if (!preW || !contentW) return; // bail — fallback CSS color stays visible
    const cx = ((contentW / 2) / preW * 100).toFixed(2);
    pre.style.background = `radial-gradient(circle at ${cx}% 50%, ${GRADIENT_STOPS})`;
    pre.style.webkitBackgroundClip = 'text';
    pre.style.backgroundClip = 'text';
    pre.style.color = 'transparent'; // only go transparent once gradient is in place
  }

  function rebuildAfterResize() {
    computeSize();
    particleGrid  = new Float32Array(cols * rows);
    highlightGrid = new Uint8Array(cols * rows);
    buildCellCoords();
    gradientApplied = false;
    lastTime = null;
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildAfterResize, 150);
  }

  // ── Visibility ────────────────────────────────────────────────────────────────
  function startAnimation() {
    if (animating) return;
    animating = true;
    lastTime  = null;
    rafId     = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    animating = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // ── Toggle (called by toolbar button on any page) ─────────────────────────────
  // Defined at IIFE level so it's set exactly once and has stable closure over
  // all state variables including entryTimer.
  window.vortexToggle = function () {
    if (!container) return;                     // vortex not present on this page
    const nowOn = localStorage.getItem('vortexEnabled') === 'false';
    localStorage.setItem('vortexEnabled', nowOn);

    document.querySelectorAll('.vortex-toggle-btn').forEach(function (btn) {
      btn.style.opacity = nowOn ? '1' : '0.25'; btn.style.color = nowOn ? 'white' : '';
    });

    if (nowOn) {
      container.style.transition = 'opacity 0.5s';
      if (!orbActive) {
        const ph = photoCenter();
        if (ph) spawnComet(ph);
        orbActive = true;
      }
      container.style.opacity = '0.8';
      startAnimation();
    } else {
      if (entryTimer) { clearTimeout(entryTimer); entryTimer = null; }
      orbActive = false;
      container.style.transition = 'opacity 0.5s';
      container.style.opacity    = '0';
      stopAnimation();
    }
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    pre       = document.getElementById('ascii-vortex');
    container = document.getElementById('ascii-vortex-container');
    if (!pre || !container) return;

    container.style.filter = [
      'drop-shadow(0 0 2px rgba(0,0,0,1))',
      'drop-shadow(0 0 5px rgba(0,0,0,1))',
      'drop-shadow(0 0 12px rgba(0,0,0,1))',
      'drop-shadow(0 0 22px rgba(0,0,0,1))',
      'drop-shadow(0 0 38px rgba(0,0,0,0.9))',
    ].join(' ');

    computeSize();
    particleGrid  = new Float32Array(cols * rows);
    highlightGrid = new Uint8Array(cols * rows);
    buildCellCoords();
    initParticles();

    container.style.transition = 'opacity 1s ease-in';

    // Respect stored preference; default is on
    if (localStorage.getItem('vortexEnabled') !== 'false') {
      entryTimer = setTimeout(() => {
        const ph = photoCenter();
        if (ph) spawnComet(ph);
        orbActive = true;
        // Position the container at the spawn point before fading in so there
        // is no 1-frame flash at the initial top:0 left:0 position.
        const cw = container.offsetWidth  || 400;
        const ch = container.offsetHeight || 200;
        container.style.left = (orbX - window.scrollX - cw / 2) + 'px';
        container.style.top  = (orbY - window.scrollY - ch / 2) + 'px';
        container.style.opacity = '0.8';
      }, 5000);
    }

    startAnimation();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAnimation();
      } else if (localStorage.getItem('vortexEnabled') !== 'false') {
        startAnimation();
      }
    });

    window.addEventListener('resize', onResize, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
