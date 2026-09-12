(() => {
  const TOTAL_FRAMES = 192;
  const canvas = document.getElementById('frameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  // Preloader Elements
  const elPreloader = document.getElementById('preloader');
  const elPreloaderCard = document.getElementById('preloaderCard');
  const elCounter = document.getElementById('preloaderCounter');
  const elStatusLabel = document.getElementById('preloaderStatusLabel');

  // Text Scramble Elements
  const elLine1 = document.getElementById('scrambleLine1');
  const elLine2 = document.getElementById('scrambleLine2');
  const elLine3 = document.getElementById('scrambleLine3');
  const elDesc = document.getElementById('scrambleDesc');

  // Stages Content
  const STAGES = [
    {
      line1: "I build Front–end &",
      line2: "Shopify stores",
      line3: "that convert.",
      desc: "Hi, I'm Arafat Hasan, a developer in Dhaka building fast, modern, and high-converting web experiences with the MERN stack & Shopify 2.0."
    },
    {
      line1: "Engineering with",
      line2: "cutting-edge tech",
      line3: "& precision.",
      desc: "Transforming bold concepts into seamless, ultra-fast web architectures powered by Next.js, React, and robust custom Shopify solutions."
    },
    {
      line1: "Delivering real",
      line2: "business results",
      line3: "& scale.",
      desc: "Crafting high-impact digital experiences that elevate brand identity, maximize customer retention, and drive measurable revenue growth."
    }
  ];

  // High-Performance Butter-Smooth Text Scramble Engine
  class TextScramble {
    constructor(element, chars = '!<>-_\\/[]{}—=+*^?#_0123456789') {
      this.el = element;
      this.chars = chars;
      this.frameRequest = null;
      this.queue = [];
      this.frame = 0;
      this.resolve = null;
      this.currentText = element.textContent ? element.textContent.trim() : '';
      this.update = this.update.bind(this);
    }

    setText(newText, duration = 26) {
      const oldText = this.currentText || '';
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const isSpace = (to === ' ' || from === ' ');

        const start = Math.floor((i / Math.max(length, 1)) * (duration * 0.42)) + Math.floor(Math.random() * 3);
        const end = start + Math.floor(duration * 0.58) + Math.floor(Math.random() * 4);

        this.queue.push({ from, to, start, end, char: '', isSpace });
      }

      if (this.frameRequest) {
        cancelAnimationFrame(this.frameRequest);
      }
      this.frame = 0;
      this.currentText = newText;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;

      for (let i = 0; i < this.queue.length; i++) {
        let { from, to, start, end, char, isSpace } = this.queue[i];

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (isSpace && (to === ' ' || from === ' ')) {
            output += ' ';
          } else {
            if (!char || Math.random() < 0.24) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += char;
          }
        } else {
          output += from;
        }
      }

      this.el.textContent = output;

      if (complete === this.queue.length) {
        this.el.textContent = this.currentText;
        if (this.resolve) this.resolve();
      } else {
        this.frame++;
        this.frameRequest = requestAnimationFrame(this.update);
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Initialize Scramblers
  const line1Scramble = new TextScramble(elLine1);
  const line2Scramble = new TextScramble(elLine2);
  const line3Scramble = new TextScramble(elLine3);
  const descScramble = new TextScramble(elDesc);

  let currentStageIndex = 0;

  function transitionToStage(stageIndex) {
    if (stageIndex === currentStageIndex) return;
    const stage = STAGES[stageIndex];
    currentStageIndex = stageIndex;

    line1Scramble.setText(stage.line1, 20);
    line2Scramble.setText(stage.line2, 22);
    line3Scramble.setText(stage.line3, 20);
    descScramble.setText(stage.desc, 28);
  }

  // Stage Detection with Hysteresis
  function updateTextStage(progress) {
    let nextStage = currentStageIndex;

    if (currentStageIndex === 0) {
      if (progress > 0.35) nextStage = 1;
    } else if (currentStageIndex === 1) {
      if (progress < 0.28) nextStage = 0;
      else if (progress > 0.69) nextStage = 2;
      else nextStage = 1;
    } else if (currentStageIndex === 2) {
      if (progress < 0.63) nextStage = 1;
      else nextStage = 2;
    }

    if (nextStage !== currentStageIndex) {
      transitionToStage(nextStage);
    }
  }

  // Video Frame Scrubbing Engine
  const images = new Array(TOTAL_FRAMES);
  const loaded = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;

  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnImg = null;
  const LERP_FACTOR = 0.22;

  // Projects Showcase Progression
  let targetProjectsProgress = 0;
  let currentProjectsProgress = 0;
  let projectsEngine = null;

  const getFramePath = (index) => {
    return `frames/frame_${String(index).padStart(6, '0')}.png`;
  };

  // High-DPI canvas sizing
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    lastDrawnImg = null;
    renderCurrent();
  }

  // Find the closest loaded frame to eliminate flicker
  function getBestFrame(target) {
    if (loaded[target] && images[target] && images[target].complete && images[target].naturalWidth > 0) {
      return images[target];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = target - offset;
      if (left >= 0 && loaded[left] && images[left] && images[left].complete && images[left].naturalWidth > 0) {
        return images[left];
      }
      const right = target + offset;
      if (right < TOTAL_FRAMES && loaded[right] && images[right] && images[right].complete && images[right].naturalWidth > 0) {
        return images[right];
      }
    }
    return null;
  }

  // Draw frame with object-fit: cover logic
  function drawToCanvas(img) {
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const iWidth = img.naturalWidth;
    const iHeight = img.naturalHeight;

    const hRatio = cWidth / iWidth;
    const vRatio = cHeight / iHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = iWidth * ratio;
    const drawH = iHeight * ratio;
    const drawX = (cWidth - drawW) / 2;
    const drawY = (cHeight - drawH) / 2;

    ctx.drawImage(img, 0, 0, iWidth, iHeight, drawX, drawY, drawW, drawH);
  }

  // Render current frame corresponding to currentProgress
  function renderCurrent() {
    const targetIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    const img = getBestFrame(targetIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (img !== lastDrawnImg) {
      drawToCanvas(img);
      lastDrawnImg = img;
    }
  }

  // Header Element
  // Header & Section Elements
  const elSiteHeader = document.getElementById('siteHeader');
  const elHeroSection = document.getElementById('heroSection');
  const elBloodSection = document.getElementById('bloodFillSection');

  let targetBloodProgress = 0;
  let lastScrollY = 0;
  let scrollVelocity = 0;
  let bloodEngine = null;

  // Sequential Continuous Scroll Progression Engine
  // 1. Enter Hero section -> Hero is pinned/sticky.
  // 2. Scroll -> Hero animation progresses normally (frames 0-191 & text stages 0 -> 1 -> 2).
  // 3. Keep Hero pinned until 100% of the animation is complete.
  // 4. Only after the animation finishes -> release Hero.
  // 5. Continue directly into the Blood Fill section (zero gap).
  // 6. Blood then fills from the top based on scroll position.
  function updateScroll() {
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
    const winHeight = window.innerHeight;

    // Track smoothed scroll velocity for fluid sloshing & inertia
    const deltaY = scrollTop - lastScrollY;
    lastScrollY = scrollTop;
    scrollVelocity = scrollVelocity * 0.8 + deltaY * 0.2;

    if (!elHeroSection || !elBloodSection) return;

    const heroHeight = elHeroSection.offsetHeight;
    const heroMaxScroll = Math.max(heroHeight - winHeight, 1);

    const bloodTop = elBloodSection.offsetTop;
    const bloodHeight = elBloodSection.offsetHeight;
    const bloodMaxScroll = Math.max(bloodHeight - winHeight, 1);

    // 1. HERO ANIMATION PROGRESSION (Pinned until 100% completed)
    if (scrollTop <= heroMaxScroll) {
      targetProgress = Math.min(1, Math.max(0, scrollTop / heroMaxScroll));
      targetBloodProgress = 0;
    } else {
      // Hero has finished 100% and is released to scroll away
      targetProgress = 1.0;

      // 2. BLOOD FILL SECTION PROGRESSION
      if (scrollTop < bloodTop) {
        // Direct seamless handoff: Hero is scrolling out, Blood section is scrolling in (zero gap)
        targetBloodProgress = 0;
      } else {
        // Blood section is docked & pinned at top: 0: fill from top to bottom based on scroll
        const bloodScroll = Math.min(bloodMaxScroll, scrollTop - bloodTop);
        targetBloodProgress = Math.min(1, Math.max(0, bloodScroll / bloodMaxScroll));
      }
    }

    // Dynamic Site Header Theme Switch (Light theme when over #f3f5f0 background)
    if (elSiteHeader) {
      if (scrollTop > 25) {
        elSiteHeader.classList.add('scrolled');
      } else {
        elSiteHeader.classList.remove('scrolled');
      }

      // Brand logo only shown in hero section; hide when scrolled past hero
      if (scrollTop > heroMaxScroll) {
        elSiteHeader.classList.add('logo-hidden');
      } else {
        elSiteHeader.classList.remove('logo-hidden');
      }

      if (scrollTop >= bloodTop - 70 && scrollTop <= (bloodTop + bloodHeight - 70)) {
        elSiteHeader.classList.add('light-theme');
      } else {
        elSiteHeader.classList.remove('light-theme');
      }
    }

    // 3. PROJECTS SHOWCASE SECTION TRIGGER
    const elProjects = document.getElementById('projects');
    if (elProjects && projectsEngine) {
      const rect = elProjects.getBoundingClientRect();
      if (rect.top <= winHeight * 0.85 && rect.bottom >= 0) {
        projectsEngine.triggerEntrance();
      } else if (rect.top > winHeight + 150) {
        projectsEngine.resetEntrance();
      }
    }
  }

  // Animation Loop (LERP scrubbing + synchronous text updates + fluid simulation)
  function tick(now) {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * LERP_FACTOR;
    } else {
      currentProgress = targetProgress;
    }

    // Decay scroll velocity smoothly
    scrollVelocity *= 0.88;

    renderCurrent();
    updateTextStage(currentProgress);

    // Render continuous fluid blood waves
    if (bloodEngine) {
      bloodEngine.renderBlood((now || performance.now()) * 0.001);
    }

    // Render Projects 3D Upward Emergence & Carousel Engine
    if (projectsEngine) {
      projectsEngine.render(now);
    }

    requestAnimationFrame(tick);
  }

  // =========================================
  // LUXURY PRELOADER CONTROLLER
  // =========================================
  let preloaderFinished = false;
  let displayedCount = 0;
  const startTime = performance.now();
  const MIN_PRELOAD_DURATION = 1600; // ms to ensure user enjoys the counting aesthetic

  function tickPreloader(now) {
    if (preloaderFinished) return;

    const elapsed = now - startTime;
    const timeProgress = Math.min(100, Math.floor((elapsed / MIN_PRELOAD_DURATION) * 100));
    const networkProgress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

    // Smoothly step counter towards progress
    const targetCount = Math.min(100, Math.max(timeProgress, networkProgress));

    if (displayedCount < targetCount) {
      displayedCount += Math.max(1, Math.ceil((targetCount - displayedCount) * 0.15));
      if (displayedCount > 100) displayedCount = 100;
      if (elCounter) {
        elCounter.textContent = String(displayedCount).padStart(2, '0');
      }
    }

    // Ready trigger: 100 reached + frame 0 is ready
    if (displayedCount >= 100 && loaded[0]) {
      completePreloader();
    } else {
      requestAnimationFrame(tickPreloader);
    }
  }

  function completePreloader() {
    if (preloaderFinished) return;
    preloaderFinished = true;

    if (elCounter) elCounter.textContent = '100';
    if (elStatusLabel) elStatusLabel.textContent = 'Ready';

    // Cinematic card expansion and fade
    setTimeout(() => {
      if (elPreloaderCard) elPreloaderCard.classList.add('expand-reveal');
      if (elPreloader) elPreloader.classList.add('fade-out');

      // Trigger initial text scramble decryption
      setTimeout(() => {
        line1Scramble.setText(STAGES[0].line1, 24);
        line2Scramble.setText(STAGES[0].line2, 28);
        line3Scramble.setText(STAGES[0].line3, 26);
        descScramble.setText(STAGES[0].desc, 36);
      }, 250);

      // Clean up DOM after transition finishes
      setTimeout(() => {
        if (elPreloader) elPreloader.style.display = 'none';
      }, 900);
    }, 200);
  }

  // Preload all 192 frames in background
  function preloadFrames() {
    // Frame 0 priority
    const firstImg = new Image();
    firstImg.onload = () => {
      loaded[0] = true;
      loadedCount++;
      renderCurrent();
      loadRemainingFrames();
    };
    firstImg.onerror = () => {
      loadRemainingFrames();
    };
    firstImg.src = getFramePath(0);
    images[0] = firstImg;
  }

  function loadRemainingFrames() {
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => {
        loaded[i] = true;
        loadedCount++;
        renderCurrent();
      };
      img.onerror = () => {
        loadedCount++;
      };
      img.src = getFramePath(i);
      images[i] = img;
    }
  }

  // =========================================
  // MOUSE-FOLLOWING RED EYES CONTROLLER
  // =========================================
  function initMouseFollowingEyes() {
    const svgLogo = document.getElementById('logoEyesSvg');
    const leftPupil = document.getElementById('leftPupilGroup');
    const rightPupil = document.getElementById('rightPupilGroup');
    const leftEyeGroup = document.getElementById('leftEyeGroup');
    const rightEyeGroup = document.getElementById('rightEyeGroup');
    const brandLogo = document.getElementById('brandLogo');

    const miniPupilLeft = document.getElementById('miniPupilLeft');
    const miniPupilRight = document.getElementById('miniPupilRight');

    if (!svgLogo || !leftPupil || !rightPupil) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseMoveTime = performance.now();

    // Pupil smoothing coordinates (SVG units)
    let curLeftX = 0, curLeftY = 0;
    let curRightX = 0, curRightY = 0;

    // Mini avatar pupil coordinates (px)
    let curMiniLX = 0, curMiniLY = 0;
    let curMiniRX = 0, curMiniRY = 0;

    // Idle wander state
    let idleTargetLX = 0, idleTargetLY = 0;
    let idleTargetRX = 0, idleTargetRY = 0;
    let nextIdleShiftTime = 0;

    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMoveTime = performance.now();
    }

    function handleTouchMove(e) {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        lastMouseMoveTime = performance.now();
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    // Blink Engine
    let isBlinking = false;
    function triggerBlink(duration = 160) {
      if (isBlinking) return;
      isBlinking = true;
      if (leftEyeGroup) leftEyeGroup.classList.add('blinking');
      if (rightEyeGroup) rightEyeGroup.classList.add('blinking');

      setTimeout(() => {
        if (leftEyeGroup) leftEyeGroup.classList.remove('blinking');
        if (rightEyeGroup) rightEyeGroup.classList.remove('blinking');
        isBlinking = false;
      }, duration);
    }

    function triggerWink() {
      if (isBlinking) return;
      isBlinking = true;
      if (rightEyeGroup) rightEyeGroup.classList.add('blinking');
      setTimeout(() => {
        if (rightEyeGroup) rightEyeGroup.classList.remove('blinking');
        isBlinking = false;
      }, 160);
    }

    // Periodic organic blinks
    function scheduleNextBlink() {
      const delay = 3200 + Math.random() * 3200;
      setTimeout(() => {
        // 20% chance of double-blink
        if (Math.random() < 0.2) {
          triggerBlink(140);
          setTimeout(() => triggerBlink(130), 220);
        } else {
          triggerBlink(160);
        }
        scheduleNextBlink();
      }, delay);
    }
    scheduleNextBlink();

    // Click on Logo: Wink and smooth scroll to top
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        triggerWink();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Animation loop for fluid eye tracking
    function updateEyes(now) {
      const isIdle = (now - lastMouseMoveTime > 2600);

      // In idle mode, smoothly wander gaze
      if (isIdle) {
        if (now > nextIdleShiftTime) {
          idleTargetLX = (Math.random() - 0.5) * 4.2;
          idleTargetLY = (Math.random() - 0.5) * 2.0;
          idleTargetRX = idleTargetLX + (Math.random() - 0.5) * 0.4;
          idleTargetRY = idleTargetLY;
          nextIdleShiftTime = now + 1800 + Math.random() * 2400;
        }
      }

      // Compute SVG element bounds & scale factors
      const svgRect = svgLogo.getBoundingClientRect();
      if (svgRect.width > 0) {
        const scaleX = svgRect.width / 58;
        const scaleY = svgRect.height / 38;

        const leftEyeScreenX = svgRect.left + 18.25 * scaleX;
        const leftEyeScreenY = svgRect.top + 19 * scaleY;

        const rightEyeScreenX = svgRect.left + 39.75 * scaleX;
        const rightEyeScreenY = svgRect.top + 19 * scaleY;

        const maxTravelX = 3.6;
        const maxTravelY = 2.1;

        let targetLX = 0, targetLY = 0;
        let targetRX = 0, targetRY = 0;

        if (!isIdle) {
          // Left Eye vector & angle
          const dxL = mouseX - leftEyeScreenX;
          const dyL = mouseY - leftEyeScreenY;
          const angleL = Math.atan2(dyL, dxL);
          const distL = Math.hypot(dxL, dyL);
          const factorL = Math.min(distL / 120, 1);
          targetLX = Math.cos(angleL) * maxTravelX * factorL;
          targetLY = Math.sin(angleL) * maxTravelY * factorL;

          // Right Eye vector & angle (independent convergence)
          const dxR = mouseX - rightEyeScreenX;
          const dyR = mouseY - rightEyeScreenY;
          const angleR = Math.atan2(dyR, dxR);
          const distR = Math.hypot(dxR, dyR);
          const factorR = Math.min(distR / 120, 1);
          targetRX = Math.cos(angleR) * maxTravelX * factorR;
          targetRY = Math.sin(angleR) * maxTravelY * factorR;
        } else {
          targetLX = idleTargetLX;
          targetLY = idleTargetLY;
          targetRX = idleTargetRX;
          targetRY = idleTargetRY;
        }

        // LERP interpolation
        const lerp = 0.22;
        curLeftX += (targetLX - curLeftX) * lerp;
        curLeftY += (targetLY - curLeftY) * lerp;
        curRightX += (targetRX - curRightX) * lerp;
        curRightY += (targetRY - curRightY) * lerp;

        leftPupil.setAttribute('transform', `translate(${curLeftX.toFixed(2)}, ${curLeftY.toFixed(2)})`);
        rightPupil.setAttribute('transform', `translate(${curRightX.toFixed(2)}, ${curRightY.toFixed(2)})`);
      }

      // Preloader mini-avatar pupils update if active
      if (miniPupilLeft && miniPupilRight) {
        const miniRect = miniPupilLeft.getBoundingClientRect();
        if (miniRect.width > 0 && miniRect.top < window.innerHeight) {
          const mDx = mouseX - (miniRect.left + miniRect.width / 2);
          const mDy = mouseY - (miniRect.top + miniRect.height / 2);
          const mAngle = Math.atan2(mDy, mDx);
          const mDist = Math.hypot(mDx, mDy);
          const mFactor = Math.min(mDist / 120, 1);
          const mTargetX = Math.cos(mAngle) * 3.2 * mFactor;
          const mTargetY = Math.sin(mAngle) * 2.2 * mFactor;

          curMiniLX += (mTargetX - curMiniLX) * 0.22;
          curMiniLY += (mTargetY - curMiniLY) * 0.22;

          miniPupilLeft.style.transform = `translate(${curMiniLX.toFixed(1)}px, ${curMiniLY.toFixed(1)}px)`;
          miniPupilRight.style.transform = `translate(${curMiniLX.toFixed(1)}px, ${curMiniLY.toFixed(1)}px)`;
        }
      }

      requestAnimationFrame(updateEyes);
    }

    requestAnimationFrame(updateEyes);
  }

  // =========================================
  // FLOATING MENU & NAVIGATION OVERLAY CONTROLLER
  // =========================================
  function initFloatingMenu() {
    const menuBtn = document.getElementById('menuToggleBtn');
    const navOverlay = document.getElementById('navOverlay');
    const navBackdrop = document.getElementById('navBackdrop');
    const navLinks = document.querySelectorAll('.nav-panel-link');

    if (!menuBtn || !navOverlay) return;

    let isOpen = false;

    function updateCircleOrigin() {
      const rect = menuBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      navOverlay.style.setProperty('--circle-x', `${x.toFixed(1)}px`);
      navOverlay.style.setProperty('--circle-y', `${y.toFixed(1)}px`);
    }

    function openMenu() {
      updateCircleOrigin();
      isOpen = true;
      menuBtn.classList.add('is-active');
      menuBtn.setAttribute('aria-expanded', 'true');
      navOverlay.classList.add('is-open');
      navOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      updateCircleOrigin();
      isOpen = false;
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
      navOverlay.classList.remove('is-open');
      navOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    updateCircleOrigin();
    window.addEventListener('resize', updateCircleOrigin, { passive: true });

    function toggleMenu() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    // Close on navigation link click & smooth scroll
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          closeMenu();
          const targetId = (href === '#work' || href === '#projects') ? 'projects' : href.replace('#', '');
          const target = document.getElementById(targetId) || document.querySelector(href);
          if (target) {
            const targetY = target.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        } else {
          closeMenu();
        }
      });
    });
  }

  // =========================================
  // =========================================
  // SCROLL-DRIVEN VISCOUS BLOOD LIQUID ENGINE (TOP-TO-BOTTOM FILL)
  // =========================================
  // SCROLL-DRIVEN LETTER-BY-LETTER BLOOD FLUID ENGINE
  // Progresses continuously from letter 0 ('C') to letter 23 ('B')
  // =========================================
  function initBloodLiquidEngine() {
    const bloodSvg = document.getElementById('bloodSvg');
    const waveBack = document.getElementById('bloodWaveBack');
    const waveMid = document.getElementById('bloodWaveMid');
    const waveFront = document.getElementById('bloodWaveFront');
    const meniscusLine = document.getElementById('bloodMeniscusHighlight');
    const maskLettersPath = document.getElementById('maskLettersPath');

    if (!bloodSvg || !waveBack || !waveMid || !waveFront || !maskLettersPath) return null;

    // 24 individual characters in exact sequential reading order (Line 1 -> Line 2 -> Line 3)
    // Pixel-perfect baseline character bounding boxes
    const LETTERS = [
      { char: 'C', line: 1, x: 269, y: 25, width: 143, height: 258 },
      { char: 'O', line: 1, x: 412, y: 25, width: 172, height: 258 },
      { char: 'D', line: 1, x: 583, y: 25, width: 167, height: 258 },
      { char: 'I', line: 1, x: 750, y: 25, width: 66, height: 258 },
      { char: 'N', line: 1, x: 817, y: 25, width: 162, height: 258 },
      { char: 'G', line: 1, x: 979, y: 25, width: 155, height: 258 },
      { char: 'I', line: 1, x: 1134, y: 25, width: 66, height: 258 },
      { char: 'S', line: 1, x: 1200, y: 25, width: 131, height: 258 },
      { char: 'M', line: 2, x: 123, y: 230, width: 198, height: 258 },
      { char: 'O', line: 2, x: 320, y: 230, width: 175, height: 258 },
      { char: 'R', line: 2, x: 495, y: 230, width: 153, height: 258 },
      { char: 'E', line: 2, x: 649, y: 230, width: 138, height: 258 },
      { char: 'T', line: 2, x: 846, y: 230, width: 134, height: 258 },
      { char: 'H', line: 2, x: 980, y: 230, width: 166, height: 258 },
      { char: 'A', line: 2, x: 1145, y: 230, width: 166, height: 258 },
      { char: 'N', line: 2, x: 1312, y: 230, width: 166, height: 258 },
      { char: 'J', line: 3, x: 168, y: 435, width: 115, height: 258 },
      { char: 'U', line: 3, x: 284, y: 435, width: 160, height: 258 },
      { char: 'S', line: 3, x: 443, y: 435, width: 131, height: 258 },
      { char: 'T', line: 3, x: 574, y: 435, width: 132, height: 258 },
      { char: 'A', line: 3, x: 764, y: 435, width: 165, height: 258 },
      { char: 'J', line: 3, x: 985, y: 435, width: 115, height: 258 },
      { char: 'O', line: 3, x: 1101, y: 435, width: 173, height: 258 },
      { char: 'B', line: 3, x: 1274, y: 435, width: 158, height: 258 }
    ];

    // Dynamic browser font bounds refinement
    function refreshLetterCoordinates() {
      const lineIds = ['clipTextLine1', 'clipTextLine2', 'clipTextLine3'];
      let idx = 0;
      lineIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || typeof el.getNumberOfChars !== 'function') return;
        try {
          const len = el.getNumberOfChars();
          for (let i = 0; i < len; i++) {
            const ch = el.textContent[i];
            if (ch === ' ') continue;
            if (idx < LETTERS.length) {
              const r = el.getExtentOfChar(i);
              if (r && r.width > 0) {
                LETTERS[idx].x = Math.round(r.x);
                LETTERS[idx].y = Math.round(r.y);
                LETTERS[idx].width = Math.round(r.width);
                LETTERS[idx].height = Math.round(r.height);
              }
              idx++;
            }
          }
        } catch (e) {}
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshLetterCoordinates);
    }
    refreshLetterCoordinates();

    let currentFill = 0;
    let tilt = 0;
    let tiltVelocity = 0;
    let sloshAmp = 0;

    const N = LETTERS.length; // 24 letters
    const OVERLAP = 0.38; // Smooth liquid stream overlap between adjacent letters
    const totalSpan = (N - 1) + (1 + OVERLAP);

    function renderBlood(timeSeconds) {
      // Buttery-smooth viscous liquid response towards target scroll position
      const fillDiff = targetBloodProgress - currentFill;
      currentFill += fillDiff * 0.085;

      // Inertial tilt from scroll velocity (viscous liquid slosh)
      const targetTilt = Math.max(-14, Math.min(14, scrollVelocity * 0.28));
      const tiltDiff = targetTilt - tilt;
      tiltVelocity = tiltVelocity * 0.84 + tiltDiff * 0.06;
      tilt += tiltVelocity;

      const targetSlosh = Math.min(8, Math.abs(scrollVelocity) * 0.22);
      sloshAmp = sloshAmp * 0.88 + targetSlosh * 0.12;

      const t1 = timeSeconds * 2.0;
      const t2 = timeSeconds * 2.8;

      // When empty at 0, render empty mask
      if (currentFill < 0.0005) {
        maskLettersPath.setAttribute('d', '');
        if (meniscusLine) meniscusLine.setAttribute('d', '');
        return;
      }

      // 1. Render multi-layer fluid background paths spanning the viewBox
      const wb = Math.sin(t1) * 2.5;
      const wm = Math.cos(t2) * 2.0;
      waveBack.setAttribute('d', 'M -50 -50 L 1650 -50 L 1650 760 L -50 760 Z');
      waveMid.setAttribute('d', `M -50 ${-50 + wb} L 1650 ${-50 - wb} L 1650 ${760 + wb} L -50 ${760 - wb} Z`);
      waveFront.setAttribute('d', `M -50 ${-50 + wm} L 1650 ${-50 - wm} L 1650 ${760 + wm} L -50 ${760 - wm} Z`);

      // 2. Letter-by-letter continuous progressive reveal
      const currentPos = currentFill * totalSpan;
      const maskCommands = [];
      const meniscusCommands = [];

      for (let k = 0; k < N; k++) {
        const letter = LETTERS[k];
        // Continuous normalized fill progress for letter k (0.0 to 1.0)
        const p_raw = (currentPos - k) / (1 + OVERLAP);
        const p_k = Math.max(0, Math.min(1, p_raw));

        if (p_k <= 0.0005) {
          // Unreached letter: remains completely empty in mask
          continue;
        }

        const lx = letter.x - 2;
        const rx = letter.x + letter.width + 2;
        const w = rx - lx;

        // Exact optical cap-height to baseline bounds per line
        let lyTop = 68;
        let lyBot = 233;
        if (letter.line === 2) {
          lyTop = 273;
          lyBot = 438;
        } else if (letter.line === 3) {
          lyTop = 478;
          lyBot = 643;
        }

        if (p_k >= 0.999) {
          // 100% Filled letter: full solid rectangular reveal
          maskCommands.push(`M ${lx} ${lyTop} H ${rx} V ${lyBot} H ${lx} Z`);
        } else {
          // Smooth Hermite interpolation (smoothstep): gentle start, fluid mid-rise, smooth cushion at top
          const smooth_p = p_k * p_k * (3 - 2 * p_k);
          const fillH = (lyBot - lyTop) * smooth_p;
          const levelY = lyBot - fillH;

          // Wave envelope: wave smoothly fades in from baseline and settles flat as letter reaches full
          const waveEnv = Math.sin(p_k * Math.PI);
          const currentWaveAmp = (2.2 + sloshAmp * 0.35) * waveEnv;

          // Silky-smooth high-density curve points (step size ~4px)
          const pts = [];
          const numSteps = Math.max(16, Math.round(w / 4));
          for (let s = 0; s <= numSteps; s++) {
            const frac = s / numSteps;
            const px = lx + frac * w;
            const wave = Math.sin(frac * Math.PI * 2.8 + t1 + k * 1.3) * currentWaveAmp;
            const wave2 = Math.cos(frac * Math.PI * 4.6 - t2) * (1.1 * waveEnv);
            const tiltOff = (frac - 0.5) * (tilt * 0.5 * waveEnv);
            const py = Math.min(lyBot, Math.max(lyTop, levelY + wave + wave2 + tiltOff));
            pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
          }

          // Build closed liquid polygon for this letter
          const firstPt = pts[0].split(',');
          let poly = `M ${firstPt[0]} ${firstPt[1]} `;
          for (let s = 1; s < pts.length; s++) {
            poly += `L ${pts[s]} `;
          }
          poly += `L ${rx} ${lyBot} L ${lx} ${lyBot} Z`;
          maskCommands.push(poly);

          // Specular meniscus highlight curve along liquid surface
          let men = `M ${firstPt[0]} ${firstPt[1]} `;
          for (let s = 1; s < pts.length; s++) {
            men += `L ${pts[s]} `;
          }
          meniscusCommands.push(men);
        }
      }

      maskLettersPath.setAttribute('d', maskCommands.join(' '));

      if (meniscusLine) {
        meniscusLine.setAttribute('d', meniscusCommands.join(' '));
        meniscusLine.style.opacity = (currentFill > 0.005 && currentFill < 0.995) ? '0.92' : '0';
      }
    }

    return { renderBlood };
  }

  // =========================================
  // ABOUT ME / DESK COLLAGE INTERACTIVITY
  // =========================================
  function initAboutDeskInteractions() {
    const copyToast = document.getElementById('copyToast');
    const copyToastText = document.getElementById('copyToastText');
    let toastTimeout = null;

    // 1. Toast Notification Helper
    function showToast(message) {
      if (!copyToast || !copyToastText) return;
      copyToastText.textContent = message;
      copyToast.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        copyToast.classList.remove('show');
      }, 2400);
    }

    // 2. Click-to-Copy Triggers (Email, Phone)
    document.querySelectorAll('.copy-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const copyVal = btn.getAttribute('data-copy') || '';
        const label = btn.getAttribute('data-label') || 'Item';
        if (copyVal && navigator.clipboard) {
          navigator.clipboard.writeText(copyVal).then(() => {
            showToast(`${label} copied to clipboard!`);
          }).catch(() => {
            showToast(`Copied: ${copyVal}`);
          });
        } else if (copyVal) {
          showToast(`Copied: ${copyVal}`);
        }
      });
    });

    // 3. Subtle 3D Perspective Tilt on Interactive Cards
    if (window.matchMedia('(min-width: 1025px)').matches) {
      const tiltCards = document.querySelectorAll('.polaroid-card, .card-setup-showcase, .card-skills-pad, .card-services-pad');
      tiltCards.forEach((card) => {
        let isHovered = false;
        let curRotX = 0, curRotY = 0;
        let targetRotX = 0, targetRotY = 0;

        card.addEventListener('mouseenter', () => {
          isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          const normX = (e.clientX - rect.left) / rect.width;
          const normY = (e.clientY - rect.top) / rect.height;
          targetRotX = (normY - 0.5) * -6.0; // subtle max 3 deg
          targetRotY = (normX - 0.5) * 6.0;
        });

        card.addEventListener('mouseleave', () => {
          isHovered = false;
          targetRotX = 0;
          targetRotY = 0;
        });

        function stepTilt() {
          if (isHovered || Math.abs(curRotX) > 0.05 || Math.abs(curRotY) > 0.05) {
            curRotX += (targetRotX - curRotX) * 0.14;
            curRotY += (targetRotY - curRotY) * 0.14;
            card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
          }
          requestAnimationFrame(stepTilt);
        }
        requestAnimationFrame(stepTilt);
      });
    }
  }

  // =========================================
  // TARGET CURSOR (ReactBits Snapping Reticle)
  // =========================================
  function initTargetCursor() {
    const elCursor = document.getElementById('targetCursor');
    const elCursorInner = document.getElementById('targetCursorInner');
    const aboutSection = document.getElementById('about');
    if (!elCursor || !elCursorInner || !aboutSection) return;

    // Exit on touch-only mobile devices
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;

    const RETICLE_SIZE = 26; // Idle reticle diameter (px)
    const TARGET_PADDING = 5; // Offset surrounding target elements (px)
    const LERP_FACTOR = 0.32; // Responsive 0.2s smoothing

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;
    let curW = RETICLE_SIZE, curH = RETICLE_SIZE;
    let targetX = -100, targetY = -100;
    let targetW = RETICLE_SIZE, targetH = RETICLE_SIZE;

    let isInsideActiveZone = false;
    let currentTargetEl = null;

    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const aboutRect = aboutSection.getBoundingClientRect();
      const inside = (
        mouseX >= aboutRect.left &&
        mouseX <= aboutRect.right &&
        mouseY >= aboutRect.top &&
        mouseY <= aboutRect.bottom
      );

      if (inside !== isInsideActiveZone) {
        isInsideActiveZone = inside;
        if (isInsideActiveZone) {
          elCursor.classList.add('active');
          curX = mouseX - RETICLE_SIZE / 2;
          curY = mouseY - RETICLE_SIZE / 2;
        } else {
          elCursor.classList.remove('active');
          if (currentTargetEl) {
            currentTargetEl = null;
            elCursor.classList.remove('is-targeted');
          }
        }
      }

      if (!isInsideActiveZone) return;

      // Identify hovered target element within skills area
      const target = e.target.closest('.skill-chip, .tech-pill');
      if (target) {
        if (currentTargetEl !== target) {
          currentTargetEl = target;
          elCursor.classList.add('is-targeted');
        }
      } else {
        if (currentTargetEl) {
          currentTargetEl = null;
          elCursor.classList.remove('is-targeted');
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    function renderTargetCursor() {
      if (isInsideActiveZone) {
        if (currentTargetEl) {
          const rect = currentTargetEl.getBoundingClientRect();
          targetW = rect.width + TARGET_PADDING * 2;
          targetH = rect.height + TARGET_PADDING * 2;
          targetX = rect.left - TARGET_PADDING;
          targetY = rect.top - TARGET_PADDING;
        } else {
          targetW = RETICLE_SIZE;
          targetH = RETICLE_SIZE;
          targetX = mouseX - RETICLE_SIZE / 2;
          targetY = mouseY - RETICLE_SIZE / 2;
        }

        curX += (targetX - curX) * LERP_FACTOR;
        curY += (targetY - curY) * LERP_FACTOR;
        curW += (targetW - curW) * LERP_FACTOR;
        curH += (targetH - curH) * LERP_FACTOR;

        elCursor.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
        elCursor.style.width = `${curW.toFixed(2)}px`;
        elCursor.style.height = `${curH.toFixed(2)}px`;
      }

      requestAnimationFrame(renderTargetCursor);
    }

    requestAnimationFrame(renderTargetCursor);
  }

  /* ------------------------------------------------------------------ */
  /* COLLECTION/014PRO: 3D THREE.JS WEBGL CURVED IMAGE RIBBON ENGINE   */
  /* ------------------------------------------------------------------ */
  function initThreeJSRibbonShowcase() {
    const sectionEl = document.getElementById('projects');
    const canvasEl = document.getElementById('projectsWebGLCanvas');
    const stageEl = document.getElementById('projectsPinnedStage');
    const headlineLeft = document.getElementById('ribbonHeadlineLeft');
    const headlineRight = document.getElementById('ribbonHeadlineRight');
    const hudEl = document.getElementById('projectInfoHud');
    const hudCategory = document.getElementById('hudCategoryBadge');
    const hudTitle = document.getElementById('hudProjectTitle');
    const hudDesc = document.getElementById('hudProjectDesc');
    const hudBtn = document.getElementById('hudExploreBtn');
    const prevBtn = document.getElementById('projectPrevBtn');
    const nextBtn = document.getElementById('projectNextBtn');
    const dots = Array.from(document.querySelectorAll('.project-dot'));

    if (!sectionEl || !canvasEl || typeof THREE === 'undefined') {
      console.warn('Three.js or projectsWebGLCanvas not available');
      return null;
    }

    // Register GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll if available & wire with GSAP ScrollTrigger
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
      try {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false
        });

        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        } else {
          function lenisTick(time) {
            lenis.raf(time);
            requestAnimationFrame(lenisTick);
          }
          requestAnimationFrame(lenisTick);
        }
      } catch (err) {
        console.warn('Lenis init:', err);
      }
    }

    // Projects Data Matrix (9 Featured Projects)
    const PROJECTS_DATA = [
      {
        id: 1,
        title: "LUMINA HYPERCAR",
        category: "AUTOMOTIVE CONCEPT",
        tag: "Concept HMI",
        desc: "Next-generation generative telemetry & spatial HMI interface for autonomous electric hypercars.",
        img: "assets/projects/project_1.jpg",
        accent: "#38bdf8",
        bgDark: "#090d16",
        link: "#contact"
      },
      {
        id: 2,
        title: "KINETIX MOTION",
        category: "CREATIVE ENGINEERING",
        tag: "WebGL 3D",
        desc: "High-frequency WebGL 3D motion design showcase with real-time physical simulation physics.",
        img: "assets/projects/project_2.jpg",
        accent: "#f43f5e",
        bgDark: "#150d18",
        link: "#contact"
      },
      {
        id: 3,
        title: "AURA SPATIAL OS",
        category: "SPATIAL COMPUTING",
        tag: "VisionOS",
        desc: "VisionOS volumetric spatial interface with fluid gesture physics and contextual workspaces.",
        img: "assets/projects/project_3.jpg",
        accent: "#818cf8",
        bgDark: "#0e111d",
        link: "#contact"
      },
      {
        id: 4,
        title: "CHRONO WEALTH OS",
        category: "FINTECH ECOSYSTEM",
        tag: "Fintech Platform",
        desc: "Algorithmic multi-asset portfolio command center with ultra-low latency data streaming.",
        img: null,
        accent: "#10b981",
        bgDark: "#061814",
        link: "#contact"
      },
      {
        id: 5,
        title: "NEURAL STUDIO X",
        category: "AI GENERATIVE RESEARCH",
        tag: "AI Architecture",
        desc: "Deep-learning prompt-to-3D visual engine with real-time neural diffusion pipelines.",
        img: null,
        accent: "#a855f7",
        bgDark: "#150b24",
        link: "#contact"
      },
      {
        id: 6,
        title: "VELOCITY KINETIC",
        category: "LUXURY COMMERCE",
        tag: "Next.js & Shopify",
        desc: "Editorial brand identity, interactive 3D product customizer, and headless e-commerce.",
        img: null,
        accent: "#f59e0b",
        bgDark: "#1a1205",
        link: "#contact"
      },
      {
        id: 7,
        title: "MONOLITH SOUND",
        category: "AUDIO HARDWARE / UI",
        tag: "Spatial Audio",
        desc: "Analog-digital hybrid synthesizer interface with dynamic harmonic spectrum visualizers.",
        img: null,
        accent: "#06b6d4",
        bgDark: "#05151b",
        link: "#contact"
      },
      {
        id: 8,
        title: "SYNAPSE BIOMETRICS",
        category: "HEALTH BIOTECH",
        tag: "Biotech Dashboard",
        desc: "Preventative circadian & vital biomarker monitoring dashboard with predictive telemetry.",
        img: null,
        accent: "#ec4899",
        bgDark: "#1a0814",
        link: "#contact"
      },
      {
        id: 9,
        title: "ECLIPSE STUDIOS",
        category: "CREATIVE PRODUCTION",
        tag: "Motion Direction",
        desc: "Avant-garde film production agency site with dynamic WebGL showreels and typography.",
        img: null,
        accent: "#e2e8f0",
        bgDark: "#111318",
        link: "#contact"
      }
    ];

    const TOTAL_CARDS = PROJECTS_DATA.length;

    // WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.92);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight1.position.set(6, 9, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe7e8eb, 0.45);
    dirLight2.position.set(-6, -5, -4);
    scene.add(dirLight2);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    // Catmull-Rom Ribbon Spline Curve
    // Sweeps from far bottom-left, banks across center at full size, and recedes to top-right
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-19.5, -9.2, -18.0),
      new THREE.Vector3(-12.0, -5.2, -9.0),
      new THREE.Vector3(-5.6, -2.2, -2.4),
      new THREE.Vector3(0.0, 0.0, 1.8),
      new THREE.Vector3(5.6, 2.3, -2.6),
      new THREE.Vector3(12.0, 5.4, -9.2),
      new THREE.Vector3(19.5, 9.6, -18.5)
    ]);
    curve.curveType = 'catmullrom';
    curve.tension = 0.5;

    // Card Plane Geometry with subtle cylindrical curvature
    const CARD_W = 3.65;
    const CARD_H = 2.4;
    const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H, 32, 16);
    const posAttr = cardGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      posAttr.setZ(i, -Math.pow(px / (CARD_W * 0.5), 2) * 0.18);
    }
    cardGeo.computeVertexNormals();

    // High-resolution procedural texture generator for mockups
    function createProceduralCardTexture(data, idx) {
      const w = 1024;
      const h = 672;
      const cvs = document.createElement('canvas');
      cvs.width = w;
      cvs.height = h;
      const ctx = cvs.getContext('2d');

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, data.bgDark || '#0b0f19');
      grad.addColorStop(1, '#020408');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient glowing orb
      const radGrad = ctx.createRadialGradient(w * 0.72, h * 0.35, 10, w * 0.72, h * 0.35, 380);
      radGrad.addColorStop(0, (data.accent || '#38bdf8') + '33');
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Browser Mockup Top Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, w, 52);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 52, w, 1);

      // Traffic Light Buttons
      const dotColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
      dotColors.forEach((color, dIdx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(36 + dIdx * 20, 26, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Browser URL Pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 140, 12, 280, 28, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('https://' + data.title.toLowerCase().replace(/[^a-z0-9]/g, '') + '.io', w / 2, 30);

      // UI Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 100; y < h; y += 70) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(w - 40, y);
        ctx.stroke();
      }

      // Project Number Tag
      ctx.fillStyle = data.accent || '#38bdf8';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('0' + (idx + 1) + ' // ' + data.category, 54, 120);

      // Project Large Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px "Montserrat", sans-serif';
      ctx.fillText(data.title, 54, 175);

      // Subtitle / Description
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
      const words = data.desc.split(' ');
      let line = '';
      let lineY = 220;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > 480 && n > 0) {
          ctx.fillText(line, 54, lineY);
          line = words[n] + ' ';
          lineY += 28;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 54, lineY);

      // Interactive UI Mockup Dashboard Graphic (Right Side)
      const cardX = 580;
      const cardY = 120;
      const cardW = 390;
      const cardH = 480;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Mini chart / waveform inside UI panel
      ctx.strokeStyle = data.accent || '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= cardW - 60; x += 15) {
        const py = cardY + 220 + Math.sin((x + idx * 40) * 0.04) * 45 + Math.cos(x * 0.08) * 15;
        if (x === 0) ctx.moveTo(cardX + 30 + x, py);
        else ctx.lineTo(cardX + 30 + x, py);
      }
      ctx.stroke();

      // UI stat cards
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.beginPath();
      ctx.roundRect(cardX + 30, cardY + 30, 155, 90, 10);
      ctx.fill();
      ctx.roundRect(cardX + 205, cardY + 30, 155, 90, 10);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ACTIVE TELEMETRY', cardX + 45, cardY + 58);
      ctx.fillText('EFFICIENCY RATING', cardX + 220, cardY + 58);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px "Montserrat", sans-serif';
      ctx.fillText('99.4%', cardX + 45, cardY + 96);
      ctx.fillText('60 FPS', cardX + 220, cardY + 96);

      // Bottom Tech Badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(54, h - 85, 140, 36, 18);
      ctx.fill();
      ctx.fillStyle = data.accent || '#38bdf8';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.tag || 'CASE STUDY', 124, h - 62);

      const tex = new THREE.CanvasTexture(cvs);
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // Load textures and construct meshes
    const cardMeshes = [];
    const textureLoader = new THREE.TextureLoader();

    PROJECTS_DATA.forEach((data, i) => {
      const defaultTex = createProceduralCardTexture(data, i);
      const mat = new THREE.MeshStandardMaterial({
        map: defaultTex,
        roughness: 0.22,
        metalness: 0.12,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      });

      // If project has an image file, load image texture seamlessly
      if (data.img) {
        textureLoader.load(data.img, (loadedTex) => {
          loadedTex.minFilter = THREE.LinearFilter;
          loadedTex.generateMipmaps = true;
          mat.map = loadedTex;
          mat.needsUpdate = true;
        }, undefined, (err) => {
          console.warn('Image load error for card', i, err);
        });
      }

      const mesh = new THREE.Mesh(cardGeo, mat);
      mesh.userData = { index: i, project: data };
      scene.add(mesh);
      cardMeshes.push(mesh);
    });

    // Raycasting for interactive card hovering & clicking
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-999, -999);
    let hoveredCardIndex = -1;

    // Interaction State
    let targetCarouselIndex = 0.0;
    let currentCarouselIndex = 0.0;
    let isUserDragging = false;
    let isProgrammaticScroll = false;
    let totalDragDistance = 0;
    let startPointerX = 0;
    let lastPointerX = 0;
    let dragVelocity = 0;
    let activeCardIndex = 0;

    // Sizing & Aspect Ratio
    function updateDimensions() {
      const rect = stageEl.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;

      const isMobile = w <= 768;
      camera.position.z = isMobile ? 9.2 : 7.6;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', updateDimensions, { passive: true });
    updateDimensions();

    // GSAP ScrollTrigger Integration for Runway Scrubbing
    let scrollTriggerInstance = null;
    if (typeof ScrollTrigger !== 'undefined') {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
        onUpdate: (self) => {
          if (!isUserDragging && !isProgrammaticScroll) {
            targetCarouselIndex = self.progress * (TOTAL_CARDS - 1);
            updateActiveHUD();
          }
        }
      });
    }

    // Synchronized Project Navigation (Smoothly moves ribbon and locks window scroll)
    function goToProject(index, smooth = true) {
      const targetIdx = Math.max(0, Math.min(TOTAL_CARDS - 1, index));
      targetCarouselIndex = targetIdx;
      updateActiveHUD();

      if (!sectionEl) return;
      const sectionTop = sectionEl.getBoundingClientRect().top + window.pageYOffset;
      const scrollDist = sectionEl.offsetHeight - window.innerHeight;
      if (scrollDist <= 0) return;

      const targetScrollY = sectionTop + (targetIdx / (TOTAL_CARDS - 1)) * scrollDist;

      isProgrammaticScroll = true;
      if (lenis) {
        lenis.scrollTo(targetScrollY, {
          duration: smooth ? 0.95 : 0.001,
          onComplete: () => {
            setTimeout(() => { isProgrammaticScroll = false; }, 80);
          }
        });
      } else {
        window.scrollTo({
          top: targetScrollY,
          behavior: smooth ? 'smooth' : 'instant'
        });
        setTimeout(() => { isProgrammaticScroll = false; }, 600);
      }
    }

    // Pointer Interaction (Drag / Swipe / Momentum / Raycasting)
    function onPointerDown(e) {
      isUserDragging = true;
      totalDragDistance = 0;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startPointerX = clientX;
      lastPointerX = clientX;
      dragVelocity = 0;
      canvasEl.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      // Update Mouse NDC for Raycasting
      const rect = canvasEl.getBoundingClientRect();
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (!isUserDragging) return;

      const dx = clientX - lastPointerX;
      totalDragDistance += Math.abs(dx);
      dragVelocity = dx;
      lastPointerX = clientX;

      const dragSensitivity = window.innerWidth <= 768 ? 260 : 440;
      targetCarouselIndex -= dx / dragSensitivity;
      targetCarouselIndex = Math.max(-0.25, Math.min(TOTAL_CARDS - 0.75, targetCarouselIndex));
    }

    function onPointerUp() {
      if (!isUserDragging) return;
      isUserDragging = false;
      canvasEl.style.cursor = 'grab';

      // If user dragged more than 8px, apply momentum and snap cleanly to nearest project
      if (totalDragDistance > 8) {
        targetCarouselIndex = Math.round(targetCarouselIndex - dragVelocity / 40);
        const snapIdx = Math.max(0, Math.min(TOTAL_CARDS - 1, targetCarouselIndex));
        goToProject(snapIdx, true);
      }
    }

    canvasEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    canvasEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Click on canvas to select card via Raycaster (guarded against drag release)
    canvasEl.addEventListener('click', (e) => {
      if (totalDragDistance > 8) return; // Prevent drag gesture from triggering click jump

      const rect = canvasEl.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (clickedMesh.userData && typeof clickedMesh.userData.index === 'number') {
          const clickedIdx = clickedMesh.userData.index;
          // If already centered, follow link
          if (Math.abs(currentCarouselIndex - clickedIdx) < 0.35) {
            const proj = clickedMesh.userData.project;
            if (proj && proj.link) {
              if (proj.link.startsWith('#')) {
                const targetEl = document.querySelector(proj.link);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open(proj.link, '_blank');
              }
            }
          } else {
            // Smoothly center this project card and sync scroll
            goToProject(clickedIdx, true);
          }
        }
      }
    });

    // HUD Pagination & Arrows (Synchronized via goToProject)
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = Math.round(targetCarouselIndex);
        if (cur > 0) goToProject(cur - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = Math.round(targetCarouselIndex);
        if (cur < TOTAL_CARDS - 1) goToProject(cur + 1, true);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToProject(idx, true);
      });
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const rect = sectionEl.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const cur = Math.round(targetCarouselIndex);
        if (e.key === 'ArrowLeft' && cur > 0) {
          goToProject(cur - 1, true);
        } else if (e.key === 'ArrowRight' && cur < TOTAL_CARDS - 1) {
          goToProject(cur + 1, true);
        }
      }
    });

    // Update HUD information card and pagination
    function updateActiveHUD() {
      const newActiveIdx = Math.round(Math.max(0, Math.min(TOTAL_CARDS - 1, targetCarouselIndex)));
      if (newActiveIdx !== activeCardIndex) {
        activeCardIndex = newActiveIdx;
        const project = PROJECTS_DATA[activeCardIndex];

        if (hudEl) {
          hudEl.style.opacity = '0.4';
          hudEl.style.transform = 'translateY(6px)';
          setTimeout(() => {
            if (hudCategory) hudCategory.textContent = project.category;
            if (hudTitle) hudTitle.textContent = project.title;
            if (hudDesc) hudDesc.textContent = project.desc;
            if (hudBtn) hudBtn.href = project.link;
            hudEl.style.opacity = '1.0';
            hudEl.style.transform = 'translateY(0)';
          }, 150);
        }

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeCardIndex);
        });
      }
    }

    // Set Index Directly
    function setIndex(idx) {
      goToProject(idx, false);
    }

    // Per-frame Render Loop
    function render(now) {
      // Lerp smooth carousel index
      const lerpSpeed = isUserDragging ? 0.28 : 0.12;
      currentCarouselIndex += (targetCarouselIndex - currentCarouselIndex) * lerpSpeed;

      // Raycasting for hover
      if (!isUserDragging) {
        raycaster.setFromCamera(mouseNDC, camera);
        const intersects = raycaster.intersectObjects(cardMeshes);
        if (intersects.length > 0) {
          hoveredCardIndex = intersects[0].object.userData.index;
          canvasEl.style.cursor = 'pointer';
        } else {
          hoveredCardIndex = -1;
          canvasEl.style.cursor = 'grab';
        }
      }

      // Thread each card along the 3D Catmull-Rom Ribbon
      const spacingAlongCurve = 0.088;
      const centerU = 0.5;

      cardMeshes.forEach((mesh, i) => {
        const offsetFromCenter = i - currentCarouselIndex;
        const u = centerU + offsetFromCenter * spacingAlongCurve;

        if (u < -0.05 || u > 1.05) {
          mesh.visible = false;
          return;
        }

        const clampedU = Math.max(0.001, Math.min(0.999, u));
        const pt = curve.getPointAt(clampedU);
        const tangent = curve.getTangentAt(clampedU).normalize();

        // Banking Orientation Frame
        const upVec = new THREE.Vector3(0, 1, 0);
        const normVec = new THREE.Vector3().crossVectors(tangent, upVec).normalize();
        const binormVec = new THREE.Vector3().crossVectors(normVec, tangent).normalize();

        // Bank with the curve
        const bankAngle = (clampedU - 0.5) * 0.42;
        normVec.applyAxisAngle(tangent, bankAngle);
        binormVec.applyAxisAngle(tangent, bankAngle);

        const rotMatrix = new THREE.Matrix4().makeBasis(normVec, binormVec, tangent);
        mesh.quaternion.setFromRotationMatrix(rotMatrix);
        mesh.position.copy(pt);

        // Scale: card in center fills frame at full size; off-center cards shrink naturally
        const distFromCenter = Math.abs(clampedU - 0.5);
        const isHovered = (i === hoveredCardIndex);
        const baseScale = Math.max(0.68, 1.0 - distFromCenter * 0.55);
        const scale = isHovered ? baseScale * 1.06 : baseScale;
        mesh.scale.set(scale, scale, scale);

        // Edge fade-out
        const edgeAlpha = Math.max(0, Math.min(1, (0.48 - distFromCenter) * 8.0));
        mesh.material.opacity = edgeAlpha;
        mesh.visible = edgeAlpha > 0.01;
      });

      // Kinetic Headline Parallax (Counter-directional drifting)
      if (headlineLeft && headlineRight) {
        const normalizedProg = currentCarouselIndex / (TOTAL_CARDS - 1);
        const parallaxPx = (normalizedProg - 0.5) * 380;
        headlineLeft.style.transform = `translateX(${-parallaxPx.toFixed(1)}px)`;
        headlineRight.style.transform = `translateX(${parallaxPx.toFixed(1)}px)`;
      }

      // Render WebGL Scene
      renderer.render(scene, camera);
    }

    // Initial HUD trigger
    updateActiveHUD();

    return {
      render,
      setIndex,
      setCarouselIndex: setIndex,
      playEntrance: () => {},
      triggerEntrance: () => {},
      resetEntrance: () => {}
    };
  }

  // Listeners
  window.addEventListener('scroll', updateScroll, { passive: true });
  document.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScroll();
  }, { passive: true });

  // Initialize
  resizeCanvas();
  updateScroll();
  preloadFrames();
  initMouseFollowingEyes();
  initFloatingMenu();
  bloodEngine = initBloodLiquidEngine();
  initAboutDeskInteractions();
  initTargetCursor();
  projectsEngine = initThreeJSRibbonShowcase();

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Support direct URL previewing (e.g. ?preview=hero&progress=0.5 or ?preview=blood&fill=0.55 or ?preview=about or ?preview=projects)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('preview') === 'hero') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    const prog = urlParams.has('progress') ? Math.min(1, Math.max(0, parseFloat(urlParams.get('progress')))) : 0.5;
    targetProgress = prog;
    currentProgress = prog;
    renderCurrent();
    updateTextStage(prog);
  } else if ((urlParams.get('preview') === 'blood' || urlParams.get('section') === 'blood' || urlParams.has('fill')) && elBloodSection) {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    document.body.classList.add('preview-blood');
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('light-theme');
      elSiteHeader.classList.add('logo-hidden');
    }
    const fillRatio = urlParams.has('fill') ? Math.min(1, Math.max(0, parseFloat(urlParams.get('fill')))) : 0.55;
    targetBloodProgress = fillRatio;
    currentProgress = 1.0;
    targetProgress = 1.0;
    if (bloodEngine) {
      bloodEngine.renderBlood(0.5);
    }
  } else if (urlParams.get('preview') === 'about' || urlParams.get('section') === 'about') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elBloodSection) elBloodSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('logo-hidden');
    }
    const aboutSec = document.getElementById('about');
    if (aboutSec) {
      window.scrollTo(0, 0);
    }
  } else if (urlParams.get('preview') === 'projects' || urlParams.get('section') === 'projects') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elBloodSection) elBloodSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('logo-hidden');
    }
    const projectsSec = document.getElementById('projects');
    if (projectsSec) {
      projectsSec.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (projectsEngine) {
        const idx = parseInt(urlParams.get('index') || '0', 10);
        projectsEngine.setIndex(idx);
      }
    }
  } else if (urlParams.has('scrollPx')) {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    const px = parseFloat(urlParams.get('scrollPx'));
    window.scrollTo(0, px);
    updateScroll();
    currentProgress = targetProgress;
    renderCurrent();
    updateTextStage(currentProgress);
    if (bloodEngine) {
      bloodEngine.renderBlood(0.5);
    }
  }

  requestAnimationFrame(tickPreloader);
  requestAnimationFrame(tick);
})();
