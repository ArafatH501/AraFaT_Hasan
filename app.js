(() => {
  const elHeroPortrait = document.getElementById('heroPortraitImg');

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

  // =================================================================
  // LUXURY FOOTER INTERACTIVE STRING ART & AUDIO SYNTHESIZER
  // =================================================================
  function initFooterInteractiveStringArt() {
    const canvas = document.getElementById('footerStringCanvas');
    const stage = document.getElementById('footerStringStage');
    const soundBtn = document.getElementById('footerSoundToggleBtn');
    const soundStatus = document.getElementById('footerSoundStatus');
    const soundHint = document.getElementById('footerSoundHint');
    const soundIconOn = document.querySelector('.icon-sound-on');
    const soundIconOff = document.querySelector('.icon-sound-off');
    const menuBtn = document.getElementById('footerMenuPillBtn');

    if (!canvas || !stage) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Audio Context (lazily initialized upon user interaction)
    let audioCtx = null;
    let audioMasterGain = null;
    let isSoundEnabled = true;

    function initAudio() {
      if (audioCtx) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          audioMasterGain = audioCtx.createGain();
          audioMasterGain.gain.setValueAtTime(0.14, audioCtx.currentTime);
          audioMasterGain.connect(audioCtx.destination);
        }
      } catch (e) {
        console.warn('Web Audio not supported', e);
      }
    }

    // Pentatonic harmonic scale for soothing harp/celesta glissando
    const PENTATONIC = [
      196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 
      440.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00,
      987.77, 1046.50, 1174.66, 1318.51
    ];

    let lastSoundTime = 0;
    function playStringChime(freq) {
      if (!isSoundEnabled) return;
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      if (now - lastSoundTime < 0.038) return; // rate limit to prevent audio clipping
      lastSoundTime = now;

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // High-end glass bell / harp sine wave
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);

        osc.connect(gain);
        gain.connect(audioMasterGain);

        osc.start(now);
        osc.stop(now + 0.84);
      } catch (err) {}
    }

    // Toggle Sound Button
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        initAudio();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

        if (soundStatus) soundStatus.textContent = isSoundEnabled ? 'SOUND ON' : 'SOUND OFF';
        if (soundIconOn) soundIconOn.style.display = isSoundEnabled ? 'inline-block' : 'none';
        if (soundIconOff) soundIconOff.style.display = isSoundEnabled ? 'none' : 'inline-block';
        if (soundHint) {
          soundHint.style.opacity = isSoundEnabled ? '1' : '0.4';
          const hintText = soundHint.querySelector('span:last-child');
          if (hintText) {
            hintText.textContent = isSoundEnabled ? 'SOUND ON \u{1F3B6} HOVER THE LINES.' : 'SOUND MUTED.';
          }
        }
      });
    }

    // Menu button trigger to open the luxury floating menu
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const mainMenuToggle = document.getElementById('menuToggleBtn');
        if (mainMenuToggle) mainMenuToggle.click();
      });
    }

    // String segments data structure
    let stringLines = [];
    const NUM_ROWS = 42;

    function buildStringSegments() {
      width = stage.clientWidth || window.innerWidth;
      height = stage.clientHeight || 380;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Off-screen canvas to render text mask for 'ARAFAT'
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      // Draw the 6 letters evenly spaced across the canvas width
      const letters = ['A', 'R', 'A', 'F', 'A', 'T'];
      const marginSide = Math.max(30, width * 0.035);
      const usableWidth = width - marginSide * 2;
      const colWidth = usableWidth / letters.length;
      const fontSize = Math.min(height * 0.88, colWidth * 1.25);

      offCtx.fillStyle = '#ffffff';
      offCtx.font = `900 ${fontSize}px 'Montserrat', sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const textY = height * 0.52;
      for (let k = 0; k < letters.length; k++) {
        const letterX = marginSide + (k + 0.5) * colWidth;
        offCtx.fillText(letters[k], letterX, textY);
      }

      const imgData = offCtx.getImageData(0, 0, width, height).data;

      stringLines = [];

      // Scan NUM_ROWS horizontal lines across the canvas
      const startY = height * 0.08;
      const endY = height * 0.94;
      const stepY = (endY - startY) / (NUM_ROWS - 1);

      for (let r = 0; r < NUM_ROWS; r++) {
        const y = Math.round(startY + r * stepY);
        const rowFreq = PENTATONIC[r % PENTATONIC.length];

        // Scan row pixels for white text presence (alpha > 110)
        let inSegment = false;
        let segStart = 0;

        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const alpha = imgData[idx + 3];
          const isLetter = alpha > 110;

          if (isLetter && !inSegment) {
            inSegment = true;
            segStart = x;
          } else if (!isLetter && inSegment) {
            inSegment = false;
            if (x - segStart > 6) {
              stringLines.push({
                x1: segStart,
                x2: x,
                baseY: y,
                amp: 0,
                vel: 0,
                k: 0.088,
                damping: 0.065,
                freq: rowFreq,
                rowIndex: r
              });
            }
          }
        }
        if (inSegment && width - segStart > 6) {
          stringLines.push({
            x1: segStart,
            x2: width,
            baseY: y,
            amp: 0,
            vel: 0,
            k: 0.088,
            damping: 0.065,
            freq: rowFreq,
            rowIndex: r
          });
        }
      }
    }

    // Mouse / Touch Plucking Physics
    function handlePointerMove(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      if (mx < 0 || mx > width || my < 0 || my > height) return;

      // Check string plucks
      for (let i = 0; i < stringLines.length; i++) {
        const s = stringLines[i];
        if (mx >= s.x1 - 15 && mx <= s.x2 + 15) {
          const dy = my - s.baseY;
          // If cursor is within plucking proximity of the string
          if (Math.abs(dy) < 18) {
            const impulse = (dy < 0 ? -1 : 1) * Math.min(24, Math.abs(dy) * 2.2 + 9);
            s.vel += impulse * 0.45;
            playStringChime(s.freq);
          }
        }
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener('mouseenter', () => {
      initAudio();
    });

    // Animation Loop (60 FPS Physical Simulation)
    let animId = null;
    function renderStrings() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stringLines.length; i++) {
        const s = stringLines[i];

        // Hooke's Law + viscous damping
        const force = -s.k * s.amp - s.damping * s.vel;
        s.vel += force;
        s.amp += s.vel;

        ctx.beginPath();
        if (Math.abs(s.amp) > 0.05) {
          // Vibrating physical wave (quadratic curve fundamental mode)
          const midX = (s.x1 + s.x2) / 2;
          const midY = s.baseY + s.amp;
          ctx.moveTo(s.x1, s.baseY);
          ctx.quadraticCurveTo(midX, midY, s.x2, s.baseY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, 0.72 + Math.abs(s.amp) * 0.04)})`;
          ctx.lineWidth = 1.35;
        } else {
          // Resting straight horizontal line segment
          ctx.moveTo(s.x1, s.baseY);
          ctx.lineTo(s.x2, s.baseY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.70)';
          ctx.lineWidth = 1.1;
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderStrings);
    }

    // Initialize
    buildStringSegments();
    renderStrings();

    // Window resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildStringSegments();
      }, 100);
    });
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

  // Cinematic Hero Visual Engine
  let targetProgress = 0;
  let currentProgress = 0;
  const LERP_FACTOR = 0.22;

  // Projects Showcase Progression
  let targetProjectsProgress = 0;
  let currentProjectsProgress = 0;
  let projectsEngine = null;

  // Subtle Parallax / Zoom on Hero Portrait as stages advance
  function renderCurrent() {
    if (!elHeroPortrait) return;
    const scale = 1.02 + currentProgress * 0.05;
    const translateY = currentProgress * -18;
    elHeroPortrait.style.transform = `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(1)}px)`;
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

  // Cached layout metrics to completely eliminate layout thrashing during scroll
  const cachedMetrics = {
    winHeight: window.innerHeight || 800,
    bloodTop: 0,
    bloodHeight: 0,
    bloodMaxScroll: 1,
    aboutTop: 0,
    projectsTop: 0,
    projectsHeight: 0
  };

  function updateCachedMetrics() {
    cachedMetrics.winHeight = window.innerHeight || 800;
    if (elBloodSection) {
      cachedMetrics.bloodTop = elBloodSection.offsetTop;
      cachedMetrics.bloodHeight = elBloodSection.offsetHeight;
      cachedMetrics.bloodMaxScroll = Math.max(cachedMetrics.bloodHeight - cachedMetrics.winHeight, 1);
    }
    const elAbout = document.getElementById('about');
    if (elAbout) {
      cachedMetrics.aboutTop = elAbout.offsetTop;
    }
    const elProjects = document.getElementById('projects');
    if (elProjects) {
      cachedMetrics.projectsTop = elProjects.offsetTop;
      cachedMetrics.projectsHeight = elProjects.offsetHeight;
    }
  }

  // Smart Section Visibility Observers (Sleep off-screen WebGL & SVG fluid engines)
  let isHeroVisible = true;
  let isBloodVisible = false;
  let isProjectsVisible = false;
  let isAboutVisible = false;

  function initSectionObservers() {
    if (!('IntersectionObserver' in window)) {
      isHeroVisible = true;
      isBloodVisible = true;
      isProjectsVisible = true;
      isAboutVisible = true;
      return;
    }

    const obsOptions = { root: null, rootMargin: '120px 0px', threshold: 0 };

    if (elHeroSection) {
      new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
      }, obsOptions).observe(elHeroSection);
    }

    if (elBloodSection) {
      new IntersectionObserver((entries) => {
        isBloodVisible = entries[0].isIntersecting;
      }, obsOptions).observe(elBloodSection);
    }

    const elProjects = document.getElementById('projects');
    if (elProjects) {
      new IntersectionObserver((entries) => {
        isProjectsVisible = entries[0].isIntersecting;
        if (isProjectsVisible && projectsEngine) {
          projectsEngine.triggerEntrance();
        }
      }, obsOptions).observe(elProjects);
    }

    const elAbout = document.getElementById('about');
    if (elAbout) {
      new IntersectionObserver((entries) => {
        isAboutVisible = entries[0].isIntersecting;
      }, obsOptions).observe(elAbout);
    }
  }

  // Fast Zero-Reflow Scroll Progression Handler
  function updateScroll(customScrollY) {
    const scrollTop = (typeof customScrollY === 'number')
      ? customScrollY
      : (window.pageYOffset || document.documentElement.scrollTop || 0);
    const winHeight = cachedMetrics.winHeight;

    if (!elHeroSection || !elBloodSection) return;

    const bloodTop = cachedMetrics.bloodTop;
    const bloodHeight = cachedMetrics.bloodHeight;
    const bloodMaxScroll = cachedMetrics.bloodMaxScroll;

    // Hero section progression
    targetProgress = Math.min(1, Math.max(0, scrollTop / Math.max(winHeight, 1)));

    // Blood fill section progression
    if (scrollTop < bloodTop) {
      targetBloodProgress = 0;
    } else {
      const bloodScroll = Math.min(bloodMaxScroll, scrollTop - bloodTop);
      targetBloodProgress = Math.min(1, Math.max(0, bloodScroll / bloodMaxScroll));
    }

    // Dynamic Site Header Theme Switch (transitions seamlessly when About Me reaches header)
    if (elSiteHeader) {
      if (scrollTop > 25) {
        elSiteHeader.classList.add('scrolled');
      } else {
        elSiteHeader.classList.remove('scrolled');
      }

      if (scrollTop > winHeight * 0.4) {
        elSiteHeader.classList.add('logo-hidden');
      } else {
        elSiteHeader.classList.remove('logo-hidden');
      }

      const aboutTop = cachedMetrics.aboutTop || (bloodTop + bloodHeight);
      if (scrollTop >= bloodTop - 70 && scrollTop < aboutTop - 70) {
        elSiteHeader.classList.add('light-theme');
      } else {
        elSiteHeader.classList.remove('light-theme');
      }
    }
  }

  // Unified High-Performance Animation Loop
  let lastRenderedProgress = -1;
  let lastScrollTop = 0;

  function tick(now) {
    // Sample scroll once per VSync frame for silky-smooth, jitter-free fluid velocity
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const deltaY = scrollTop - lastScrollTop;
    lastScrollTop = scrollTop;
    scrollVelocity = scrollVelocity * 0.82 + deltaY * 0.18;

    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * LERP_FACTOR;
    } else {
      currentProgress = targetProgress;
    }

    // 1. Hero Portrait: Only update style when visible and progress changed
    if (isHeroVisible && Math.abs(currentProgress - lastRenderedProgress) > 0.0002) {
      renderCurrent();
      lastRenderedProgress = currentProgress;
    }

    // 2. Liquid Blood Engine: Render fluid waves ONLY when blood section is visible in viewport
    if (isBloodVisible && bloodEngine) {
      bloodEngine.renderBlood((now || performance.now()) * 0.001);
    }

    // 3. Projects 3D WebGL Engine: Render ONLY when projects section is visible in viewport
    if (isProjectsVisible && projectsEngine) {
      projectsEngine.render(now);
    }

    requestAnimationFrame(tick);
  }

  // =========================================
  // LUXURY PRELOADER CONTROLLER
  // =========================================
  let preloaderFinished = !elPreloader;
  let displayedCount = 0;
  const startTime = performance.now();
  const MIN_PRELOAD_DURATION = 1400; // ms to ensure user enjoys the counting aesthetic

  if (!elPreloader) {
    setTimeout(() => {
      if (typeof line1Scramble !== 'undefined' && line1Scramble) line1Scramble.setText(STAGES[0].line1, 24);
      if (typeof line2Scramble !== 'undefined' && line2Scramble) line2Scramble.setText(STAGES[0].line2, 28);
      if (typeof line3Scramble !== 'undefined' && line3Scramble) line3Scramble.setText(STAGES[0].line3, 26);
      if (typeof descScramble !== 'undefined' && descScramble) descScramble.setText(STAGES[0].desc, 36);
    }, 100);
  }

  // Preload Hero Portrait
  let heroImageLoaded = false;
  const heroImg = new Image();
  heroImg.onload = () => { heroImageLoaded = true; };
  heroImg.onerror = () => { heroImageLoaded = true; };
  heroImg.src = 'assets/hero-portrait.png';
  if (heroImg.complete && heroImg.naturalWidth > 0) {
    heroImageLoaded = true;
  }

  function tickPreloader(now) {
    if (preloaderFinished || !elPreloader) return;

    const elapsed = now - startTime;
    const timeProgress = Math.min(100, Math.floor((elapsed / MIN_PRELOAD_DURATION) * 100));
    const targetCount = heroImageLoaded ? Math.min(100, timeProgress) : Math.min(85, timeProgress);

    // Smoothly step counter towards progress
    if (displayedCount < targetCount) {
      displayedCount += Math.max(1, Math.ceil((targetCount - displayedCount) * 0.18));
      if (displayedCount > 100) displayedCount = 100;
      if (elCounter) {
        elCounter.textContent = String(displayedCount).padStart(2, '0');
      }
    }

    // Ready trigger: 100 reached + hero portrait ready
    if (displayedCount >= 100 && (heroImageLoaded || elapsed > 1800)) {
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

    // Cached SVG bounds (recomputed on resize to eliminate per-frame layout thrashing)
    let cachedSvgRect = null;
    function refreshSvgRect() {
      if (svgLogo) {
        cachedSvgRect = svgLogo.getBoundingClientRect();
      }
    }
    window.addEventListener('resize', refreshSvgRect, { passive: true });
    refreshSvgRect();

    let lastLeftX = 0, lastLeftY = 0;
    let lastRightX = 0, lastRightY = 0;

    // Animation loop for fluid eye tracking
    function updateEyes(now) {
      // Pause completely if logo is hidden when scrolled past hero
      if (elSiteHeader && elSiteHeader.classList.contains('logo-hidden')) {
        requestAnimationFrame(updateEyes);
        return;
      }

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

      // Compute SVG element bounds & scale factors using cached geometry
      if (!cachedSvgRect || cachedSvgRect.width === 0) {
        refreshSvgRect();
      }

      const svgRect = cachedSvgRect;
      if (svgRect && svgRect.width > 0) {
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

        if (Math.abs(curLeftX - lastLeftX) > 0.04 || Math.abs(curLeftY - lastLeftY) > 0.04) {
          leftPupil.setAttribute('transform', `translate(${curLeftX.toFixed(2)}, ${curLeftY.toFixed(2)})`);
          lastLeftX = curLeftX;
          lastLeftY = curLeftY;
        }
        if (Math.abs(curRightX - lastRightX) > 0.04 || Math.abs(curRightY - lastRightY) > 0.04) {
          rightPupil.setAttribute('transform', `translate(${curRightX.toFixed(2)}, ${curRightY.toFixed(2)})`);
          lastRightX = curRightX;
          lastRightY = curRightY;
        }
      }

      // Preloader mini-avatar pupils update (active ONLY while preloader is visible)
      if (!preloaderFinished && miniPupilLeft && miniPupilRight) {
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

  // =========================================================================
  // CENTRALIZED NAVIGATION CONTENT CONFIGURATION (EDITABLE PLACEHOLDERS)
  // Replace placeholders with your actual personal/business details anytime.
  // =========================================================================
  const NAV_CONFIG = {
    logo: {
      name: 'AraFaT',
      dot: '.',
      tag: 'Shopify • Front-end',
      url: '#'
    },
    cta: {
      label: "Let's talk!",
      url: '#contact'
    },
    links: [
      { id: 'home', label: 'Home', url: '#', active: true },
      { id: 'about', label: 'About Us', url: '#about' },
      { id: 'work', label: 'Work', url: '#projects' },
      {
        id: 'services',
        label: 'Services',
        url: '#services',
        submenu: [
          { label: 'Shopify Development', url: '#services' },
          { label: 'Shopify Theme Development', url: '#services' },
          { label: 'Shopify Liquid', url: '#services' },
          { label: 'E-commerce Development', url: '#services' },
          { label: 'Frontend Development', url: '#services' },
          { label: 'UI/UX Development', url: '#services' },
          { label: 'Website Optimization', url: '#services' }
        ]
      },
      { id: 'blog', label: 'Blog', url: '#blog' },
      { id: 'contact', label: 'Contact', url: '#contact' }
    ],
    contact: {
      email: 'arafathasanprince501@gmail.com', // [MY_EMAIL]
      location: 'Sheridan, WY, USA', // [MY_LOCATION]
      emailHref: 'mailto:arafathasanprince501@gmail.com'
    },
    socials: [
      { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
      { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
      { platform: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com' },
      { platform: 'behance', label: 'Behance', url: 'https://behance.net' },
      { platform: 'whatsapp', label: 'WhatsApp', url: 'https://whatsapp.com' }
    ]
  };

  // =========================================
  // LUXURY FULLSCREEN NAVIGATION CONTROLLER
  // =========================================
  function initFloatingMenu() {
    const menuBtn = document.getElementById('menuToggleBtn');
    const navOverlay = document.getElementById('navOverlay');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const navBackdrop = document.getElementById('navBackdrop');
    const navCtaBtn = document.getElementById('navCtaBtn');
    const navOverlayLogo = document.getElementById('navOverlayLogo');
    const servicesItem = document.getElementById('navServicesItem');
    const servicesToggle = document.getElementById('navServicesToggle');
    const servicesSubmenu = document.getElementById('navServicesSubmenu');
    const thunderWaveContainer = document.getElementById('thunderWaveContainer');
    const navLinks = document.querySelectorAll('.nav-link, .nav-sub-link');

    if (!navOverlay) return;
    document.documentElement.style.removeProperty('--scrollbar-comp');

    let isOpen = false;
    let savedScrollY = 0;
    let closeTimer = null;

    // High-performance circular reveal coordinate synchronization
    function updateCircleOrigin() {
      if (!menuBtn) return;
      const rect = menuBtn.getBoundingClientRect();
      const cx = Math.round(rect.left + rect.width / 2);
      const cy = Math.round(rect.top + rect.height / 2);
      document.documentElement.style.setProperty('--circle-x', `${cx}px`);
      document.documentElement.style.setProperty('--circle-y', `${cy}px`);
      if (navOverlay) {
        navOverlay.style.setProperty('--circle-x', `${cx}px`);
        navOverlay.style.setProperty('--circle-y', `${cy}px`);
      }
      if (thunderWaveContainer) {
        thunderWaveContainer.style.setProperty('--circle-x', `${cx}px`);
        thunderWaveContainer.style.setProperty('--circle-y', `${cy}px`);
      }
    }

    updateCircleOrigin();
    window.addEventListener('resize', updateCircleOrigin, { passive: true });

    function openMenu() {
      if (isOpen) return;
      clearTimeout(closeTimer);
      savedScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      isOpen = true;

      updateCircleOrigin();

      if (menuBtn) {
        menuBtn.classList.add('is-active');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Cancel and Close Navigation Menu');
        menuBtn.setAttribute('title', 'Close Menu (Esc)');
      }

      // Lock body scroll and pause Lenis
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      if (window.__lenis && typeof window.__lenis.stop === 'function') {
        window.__lenis.stop();
      }

      // Clear any closing state
      navOverlay.classList.remove('is-closing');
      if (thunderWaveContainer) {
        thunderWaveContainer.classList.remove('is-closing');
        thunderWaveContainer.classList.remove('is-active');
      }

      // Launch silky-smooth GPU-accelerated thunder wave & circular reveal
      requestAnimationFrame(() => {
        if (thunderWaveContainer) {
          thunderWaveContainer.classList.add('is-active');
        }
        navOverlay.classList.add('is-open');
        navOverlay.setAttribute('aria-hidden', 'false');
      });
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;

      if (menuBtn) {
        menuBtn.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open Navigation Menu');
        menuBtn.setAttribute('title', 'Open Menu');
      }

      updateCircleOrigin();

      // Activate reverse implosion on both the wave container and overlay
      if (thunderWaveContainer) {
        thunderWaveContainer.classList.remove('is-active');
        thunderWaveContainer.classList.add('is-closing');
      }
      navOverlay.classList.add('is-closing');
      navOverlay.setAttribute('aria-hidden', 'true');

      // Cleanup after reverse implosion completes (500ms)
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!isOpen) {
          navOverlay.classList.remove('is-open', 'is-closing');
          if (thunderWaveContainer) {
            thunderWaveContainer.classList.remove('is-active', 'is-closing');
          }
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';

          if (window.__lenis && typeof window.__lenis.start === 'function') {
            window.__lenis.start();
          }
        }
      }, 500);

      // Restore exact previous scroll position immediately
      if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
        window.__lenis.scrollTo(savedScrollY, { immediate: true });
      } else {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      }

      // Restore focus to menu trigger button
      if (menuBtn) {
        menuBtn.focus();
      }
    }

    function toggleMenu() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Menu toggle button click (handles both opening and closing)
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // Backdrop click closes menu
    if (navBackdrop) {
      navBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    // Logo in top bar closes menu and smoothly scrolls to top
    if (navOverlayLogo) {
      navOverlayLogo.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
        if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
          window.__lenis.scrollTo(0, { duration: 1.1 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // "Let's talk!" action in top bar
    if (navCtaBtn) {
      navCtaBtn.addEventListener('click', (e) => {
        const href = navCtaBtn.getAttribute('href');
        closeMenu();
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const targetY = target.getBoundingClientRect().top + window.pageYOffset;
            if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
              window.__lenis.scrollTo(targetY, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        }
      });
    }

    // Services Submenu Toggle (Chevron button or Services link click)
    function toggleServicesSubmenu(e) {
      if (e) e.preventDefault();
      if (!servicesItem) return;
      const isExpanded = servicesItem.classList.toggle('is-expanded');
      if (servicesToggle) {
        servicesToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
      if (servicesSubmenu) {
        servicesSubmenu.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
      }
    }

    if (servicesToggle) {
      servicesToggle.addEventListener('click', toggleServicesSubmenu);
    }

    // Navigation Links click: smooth scroll to target & close menu
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;

        // If clicking parent "Services" link, toggle its submenu instead of closing
        if (link.closest('#navServicesItem') && href === '#services' && !link.classList.contains('nav-sub-link')) {
          e.preventDefault();
          toggleServicesSubmenu(e);
          return;
        }

        if (href.startsWith('#')) {
          e.preventDefault();
          closeMenu();

          if (href === '#' || href === '#home') {
            if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
              window.__lenis.scrollTo(0, { duration: 1.1 });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
          }

          const targetId = (href === '#work' || href === '#projects') ? 'projects' : href.replace('#', '');
          const target = document.getElementById(targetId) || document.querySelector(href);
          if (target) {
            const targetY = target.getBoundingClientRect().top + window.pageYOffset;
            if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
              window.__lenis.scrollTo(targetY, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        } else {
          closeMenu();
        }
      });
    });

    // Expose config for programmatic access
    window.NAV_CONFIG = NAV_CONFIG;
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

    // 24 individual characters across 3 lines:
    // Line 1: "WE DON'T" (7 characters: W, E, D, O, N, ', T)
    // Line 2: "JUST BUILD" (9 characters: J, U, S, T, B, U, I, L, D)
    // Line 3: "WE CREATE" (8 characters: W, E, C, R, E, A, T, E)
    const line1Chars = ['W', 'E', 'D', 'O', 'N', "'", 'T'];
    const line2Chars = ['J', 'U', 'S', 'T', 'B', 'U', 'I', 'L', 'D'];
    const line3Chars = ['W', 'E', 'C', 'R', 'E', 'A', 'T', 'E'];

    const LETTERS = [
      ...line1Chars.map((char, i) => ({
        char,
        line: 1,
        x: Math.round(410 + i * 140),
        y: 125,
        width: 120,
        height: 160
      })),
      ...line2Chars.map((char, i) => ({
        char,
        line: 2,
        x: Math.round(370 + i * 120),
        y: 355,
        width: 105,
        height: 160
      })),
      ...line3Chars.map((char, i) => ({
        char,
        line: 3,
        x: Math.round(360 + i * 135),
        y: 585,
        width: 115,
        height: 160
      }))
    ];

    // Dynamic browser font bounds refinement & responsive viewBox setup
    function refreshLetterCoordinates() {
      const isMobile = window.innerWidth <= 768;
      const clipL1 = document.getElementById('clipTextLine1');
      const clipL2 = document.getElementById('clipTextLine2');
      const clipL3 = document.getElementById('clipTextLine3');
      const bgL1 = document.getElementById('bgTextLine1');
      const bgL2 = document.getElementById('bgTextLine2');
      const bgL3 = document.getElementById('bgTextLine3');

      if (isMobile) {
        bloodSvg.setAttribute('viewBox', '0 0 540 440');
        if (clipL1) { clipL1.setAttribute('x', '270'); clipL1.setAttribute('y', '135'); }
        if (clipL2) { clipL2.setAttribute('x', '270'); clipL2.setAttribute('y', '235'); }
        if (clipL3) { clipL3.setAttribute('x', '270'); clipL3.setAttribute('y', '335'); }
        if (bgL1) { bgL1.setAttribute('x', '270'); bgL1.setAttribute('y', '135'); }
        if (bgL2) { bgL2.setAttribute('x', '270'); bgL2.setAttribute('y', '235'); }
        if (bgL3) { bgL3.setAttribute('x', '270'); bgL3.setAttribute('y', '335'); }
      } else {
        bloodSvg.setAttribute('viewBox', '0 0 1800 920');
        if (clipL1) { clipL1.setAttribute('x', '900'); clipL1.setAttribute('y', '275'); }
        if (clipL2) { clipL2.setAttribute('x', '900'); clipL2.setAttribute('y', '505'); }
        if (clipL3) { clipL3.setAttribute('x', '900'); clipL3.setAttribute('y', '735'); }
        if (bgL1) { bgL1.setAttribute('x', '900'); bgL1.setAttribute('y', '275'); }
        if (bgL2) { bgL2.setAttribute('x', '900'); bgL2.setAttribute('y', '505'); }
        if (bgL3) { bgL3.setAttribute('x', '900'); bgL3.setAttribute('y', '735'); }
      }

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
        } catch (e) { }
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

    // Set static waveBack layer once on init
    waveBack.setAttribute('d', 'M -100 -50 L 1950 -50 L 1950 990 L -100 990 Z');

    let isBloodMaskEmpty = true;
    let isFullySettled = false;

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

      // When empty at 0, clear mask once and return
      if (currentFill < 0.0005) {
        if (!isBloodMaskEmpty) {
          maskLettersPath.setAttribute('d', '');
          if (meniscusLine) meniscusLine.setAttribute('d', '');
          isBloodMaskEmpty = true;
        }
        isFullySettled = false;
        return;
      }
      isBloodMaskEmpty = false;

      // When completely filled and settled at 1.0, write static full rects once and sleep (0% CPU/GPU into About)
      if (currentFill >= 0.999 && Math.abs(fillDiff) < 0.0005 && Math.abs(tilt) < 0.02 && sloshAmp < 0.02) {
        if (!isFullySettled) {
          const isMobile = window.innerWidth <= 768;
          const fullMaskCommands = [];
          for (let k = 0; k < N; k++) {
            const letter = LETTERS[k];
            const lx = letter.x - 3;
            const rx = letter.x + letter.width + 3;
            const lyTop = (letter.y && letter.height > 0)
              ? (letter.y - 4)
              : (letter.line === 1 ? (isMobile ? 85 : 120) : letter.line === 2 ? (isMobile ? 185 : 350) : (isMobile ? 285 : 580));
            const lyBot = (letter.y && letter.height > 0)
              ? (letter.y + letter.height + 4)
              : (letter.line === 1 ? (isMobile ? 142 : 285) : letter.line === 2 ? (isMobile ? 242 : 515) : (isMobile ? 342 : 745));
            fullMaskCommands.push(`M ${lx} ${lyTop} H ${rx} V ${lyBot} H ${lx} Z`);
          }
          maskLettersPath.setAttribute('d', fullMaskCommands.join(' '));
          if (meniscusLine) {
            meniscusLine.setAttribute('d', '');
            meniscusLine.style.opacity = '0';
          }
          waveMid.setAttribute('d', 'M -100 -50 L 1950 -50 L 1950 990 L -100 990 Z');
          waveFront.setAttribute('d', 'M -100 -50 L 1950 -50 L 1950 990 L -100 990 Z');
          isFullySettled = true;
        }
        return;
      }
      isFullySettled = false;

      // 1. Render dynamic fluid background paths spanning the viewBox
      const wb = Math.sin(t1) * 2.5;
      const wm = Math.cos(t2) * 2.0;
      waveMid.setAttribute('d', `M -100 ${-50 + wb} L 1950 ${-50 - wb} L 1950 ${990 + wb} L -100 ${990 - wb} Z`);
      waveFront.setAttribute('d', `M -100 ${-50 + wm} L 1950 ${-50 - wm} L 1950 ${990 + wm} L -100 ${990 - wm} Z`);

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

        const lx = letter.x - 3;
        const rx = letter.x + letter.width + 3;
        const w = rx - lx;

        // Exact dynamic optical bounds derived from character geometry
        const isMobile = window.innerWidth <= 768;
        const lyTop = (letter.y && letter.height > 0)
          ? (letter.y - 4)
          : (letter.line === 1 ? (isMobile ? 85 : 120) : letter.line === 2 ? (isMobile ? 185 : 350) : (isMobile ? 285 : 580));
        const lyBot = (letter.y && letter.height > 0)
          ? (letter.y + letter.height + 4)
          : (letter.line === 1 ? (isMobile ? 142 : 285) : letter.line === 2 ? (isMobile ? 242 : 515) : (isMobile ? 342 : 745));

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

    return { renderBlood, refreshLetterCoordinates };
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
        let animId = null;

        function stepTilt() {
          curRotX += (targetRotX - curRotX) * 0.14;
          curRotY += (targetRotY - curRotY) * 0.14;
          card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;

          if (isHovered || Math.abs(curRotX) > 0.04 || Math.abs(curRotY) > 0.04) {
            animId = requestAnimationFrame(stepTilt);
          } else {
            card.style.transform = '';
            animId = null;
          }
        }

        function startTilt() {
          if (!animId) {
            animId = requestAnimationFrame(stepTilt);
          }
        }

        card.addEventListener('mouseenter', () => {
          isHovered = true;
          startTilt();
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          const normX = (e.clientX - rect.left) / rect.width;
          const normY = (e.clientY - rect.top) / rect.height;
          targetRotX = (normY - 0.5) * -6.0; // subtle max 3 deg
          targetRotY = (normX - 0.5) * 6.0;
          startTilt();
        });

        card.addEventListener('mouseleave', () => {
          isHovered = false;
          targetRotX = 0;
          targetRotY = 0;
          startTilt();
        });
      });
    }
  }

  // =========================================
  // TARGET CURSOR (ReactBits Snapping Reticle)
  // =========================================
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
        window.__lenis = lenis;

        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
          lenis.on('scroll', (e) => {
            ScrollTrigger.update();
            updateScroll(e.scroll);
          });
          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(500, 33);
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

    // Projects Data Matrix (10 Featured Real Projects from "Projects for portfolio")
    const PROJECTS_DATA = [
      {
        id: 1,
        title: "AURELIUM",
        category: "SHOPIFY 2.0 / LUXURY APPAREL",
        tag: "Custom Liquid",
        desc: "Custom embroidery & luxury streetwear flagship engineered with interactive customization & high-converting product pages.",
        img: "Projects for portfolio/aurelium/aurelium-header.png",
        desktopImg: "Projects for portfolio/aurelium/aurelium-desktop.png",
        mobileImg: "Projects for portfolio/aurelium/aurelium-mobile.png",
        liveUrl: "https://aurelium-9857.myshopify.com/",
        accent: "#38bdf8",
        bgDark: "#0b1320",
        link: "https://aurelium-9857.myshopify.com/"
      },
      {
        id: 2,
        title: "BUTCHERY MEAT SHOP",
        category: "SHOPIFY 2.0 / ARTISAN FOOD",
        tag: "E-Commerce",
        desc: "Handcrafted meat shop platform featuring ethical sourcing transparency, dynamic cuts selector, and cold-chain ordering.",
        img: "Projects for portfolio/butchery/butchery-header.png",
        desktopImg: "Projects for portfolio/butchery/butchery-desktop.png",
        mobileImg: "Projects for portfolio/butchery/butchery-mobile.png",
        liveUrl: "https://butchery-740.myshopify.com/",
        accent: "#ef4444",
        bgDark: "#1a0a0a",
        link: "https://butchery-740.myshopify.com/"
      },
      {
        id: 3,
        title: "CENTATRAINER",
        category: "PERFORMANCE APPAREL",
        tag: "Vintage Punk Wave",
        desc: "High-octane athletic performance and streetwear collection inspired by vintage Japanese wave aesthetics and bespoke typography.",
        img: "Projects for portfolio/centa/centa-header.png",
        desktopImg: "Projects for portfolio/centa/centa-desktop.png",
        mobileImg: "Projects for portfolio/centa/centa-mobile.png",
        liveUrl: "https://centatrainer.com/",
        accent: "#f43f5e",
        bgDark: "#181210",
        link: "https://centatrainer.com/"
      },
      {
        id: 4,
        title: "FANTA BENCHO",
        category: "BRAND EXPERIENCE",
        tag: "Interactive Web",
        desc: "Dynamic beverage showcase with bold citrus visual hierarchy, fluid animations, and high-impact brand storytelling.",
        img: "Projects for portfolio/fanta/Fanta-header.png",
        desktopImg: "Projects for portfolio/fanta/Fanta-header.png",
        desktopVideo: "Projects for portfolio/fanta/fanta-demo.mp4",
        mobileImg: "Projects for portfolio/fanta/Fanta-header.png",
        mobileVideo: "Projects for portfolio/fanta/fanta-demo.mp4",
        liveUrl: "https://fanta-jyregnb0.myshopify.com/",
        accent: "#f97316",
        bgDark: "#1f1003",
        link: "https://fanta-jyregnb0.myshopify.com/"
      },
      {
        id: 5,
        title: "HAWLUCHA PROTEIN",
        category: "SHOPIFY 2.0 / FITNESS",
        tag: "Sports Nutrition",
        desc: "Premium athletic supplement brand designed for maximum impact, performance nutrition subscriptions, and rapid checkout.",
        img: "Projects for portfolio/Hawlucha/hawlucha-header.png",
        desktopImg: "Projects for portfolio/Hawlucha/hawlucha-desktop.png",
        mobileImg: "Projects for portfolio/Hawlucha/hawlucha-mobile.png",
        liveUrl: "https://supplement-8817.myshopify.com/",
        accent: "#84cc16",
        bgDark: "#0d1306",
        link: "https://supplement-8817.myshopify.com/"
      },
      {
        id: 6,
        title: "LUNOX LIGHTING",
        category: "CONSUMER HARDWARE",
        tag: "Smart Projections",
        desc: "Magical holiday and architectural projection system store engineered with interactive pattern showcases and video testimonials.",
        img: "Projects for portfolio/lunox/Lunox-header.png",
        desktopImg: "Projects for portfolio/lunox/Lunox-desktop.png",
        mobileImg: "Projects for portfolio/lunox/Lunox-mobile.png",
        liveUrl: "https://christmas-projector-lights.myshopify.com/",
        accent: "#eab308",
        bgDark: "#151307",
        link: "https://christmas-projector-lights.myshopify.com/"
      },
      {
        id: 7,
        title: "MANGA MINT",
        category: "SHOPIFY 2.0 / POP CULTURE",
        tag: "Collectibles Hub",
        desc: "Specialty manga and collectible store featuring volume filtering, pre-order queues, and an authentic manga reader community vibe.",
        img: "Projects for portfolio/manga-mint/manga-header.png",
        desktopImg: "Projects for portfolio/manga-mint/manga-desktop.png",
        mobileImg: "Projects for portfolio/manga-mint/manga-mobile.png",
        liveUrl: "https://mangamint-2.myshopify.com/",
        accent: "#f97316",
        bgDark: "#180d05",
        link: "https://mangamint-2.myshopify.com/"
      },
      {
        id: 8,
        title: "SAGE BOTANICALS",
        category: "LUXURY SKINCARE",
        tag: "Organic Beauty",
        desc: "Clean botanical cosmetics & restorative skin wellness flagship featuring routine quizzes, clinical trial cards & minimalist elegance.",
        img: "Projects for portfolio/sage/sage-header.png",
        desktopImg: "Projects for portfolio/sage/sage-desktop.png",
        mobileImg: "Projects for portfolio/sage/sage-mobile.png",
        liveUrl: "https://sage-10102.myshopify.com/",
        accent: "#d4af37",
        bgDark: "#19150d",
        link: "https://sage-10102.myshopify.com/"
      },
      {
        id: 9,
        title: "VLORA FINE JEWELRY",
        category: "FINE JEWELRY / LUXURY",
        tag: "Diamonds & Bands",
        desc: "Luxury wedding ring and fine diamond atelier with carat filtering, 360-degree band inspection & bespoke appointment booking.",
        img: "Projects for portfolio/Vlora/vlora-header.png",
        desktopImg: "Projects for portfolio/Vlora/vlora-desktop.png",
        mobileImg: "Projects for portfolio/Vlora/vlora-mobile.png",
        liveUrl: "https://wedding-ring-113.myshopify.com/",
        accent: "#e2b887",
        bgDark: "#16120e",
        link: "https://wedding-ring-113.myshopify.com/"
      },
      {
        id: 10,
        title: "ZHUXIN CLINICAL",
        category: "CLINICAL DERMATOLOGY",
        tag: "Active Serums",
        desc: "Clinical-grade active serum storefront focusing on scientific formulations, clinical trial statistics, and minimalist aesthetic.",
        img: "Projects for portfolio/zhuxin/zhuxin-header.png",
        desktopImg: "Projects for portfolio/zhuxin/zhuxin-desktop.png",
        mobileImg: "Projects for portfolio/zhuxin/zhuxin-mobile.png",
        liveUrl: "https://serum-9929.myshopify.com/",
        accent: "#d97706",
        bgDark: "#161109",
        link: "https://serum-9929.myshopify.com/"
      }
    ];

    const TOTAL_CARDS = PROJECTS_DATA.length;

    // WebGL Renderer Setup (100% True Original Color Fidelity - No Tone Mapping or Color Space Distortion)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Guarantee matching sRGB pipeline across renderer and textures
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in renderer) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.toneMapping = THREE.NoToneMapping;
    if ('toneMappingExposure' in renderer) {
      renderer.toneMappingExposure = 1.0;
    }

    const scene = new THREE.Scene();

    // Studio Lighting (Chassis and accents only - Screen Mesh uses unlit MeshBasicMaterial for 100% true color)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight1.position.set(6, 9, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe7e8eb, 0.4);
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

    // Premium Studio Chassis & Display Dimensions
    // Width 3.84, Height 2.28 - matching modern 16:9.5 panoramic studio displays
    const CHASSIS_W = 3.84;
    const CHASSIS_H = 2.28;
    const chassisGeo = new THREE.PlaneGeometry(CHASSIS_W, CHASSIS_H);

    // Screen Dimensions: Width 3.696, Height 1.836 (Ratio ~ 2.013, exactly matching project header images)
    const SCREEN_W = 3.696;
    const SCREEN_H = 1.836;
    const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H);

    // 3D Ambient Drop Shadow Geometry & Texture
    const shadowGeo = new THREE.PlaneGeometry(CHASSIS_W * 1.10, CHASSIS_H * 1.12);
    function createShadowTexture() {
      const w = 512;
      const h = 320;
      const cvs = document.createElement('canvas');
      cvs.width = w;
      cvs.height = h;
      const ctx = cvs.getContext('2d');
      const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 2);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.22)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.06)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(16, 16, w - 32, h - 32, 60);
      ctx.fill();

      const tex = new THREE.CanvasTexture(cvs);
      if ('outputColorSpace' in renderer && 'colorSpace' in tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
      } else if ('encoding' in tex) {
        tex.encoding = THREE.sRGBEncoding;
      }
      return tex;
    }
    const sharedShadowTex = createShadowTexture();

    // Procedural Chassis Texture Generator (1200x712, 75% texture memory savings)
    function createChassisTexture(data, idx) {
      const w = 2400;
      const h = 1425;
      const cvs = document.createElement('canvas');
      cvs.width = 1200;
      cvs.height = 712;
      const ctx = cvs.getContext('2d');
      ctx.scale(0.5, 0.5);

      // Chassis Body Background (Obsidian dark titanium with subtle gradient)
      const bodyGrad = ctx.createLinearGradient(0, 0, 0, h);
      bodyGrad.addColorStop(0, '#0d111c');
      bodyGrad.addColorStop(1, '#080b13');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 30);
      ctx.fill();

      // Outer Bevel Edge Border (Hairline spec light)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Top Chrome Header Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(3, 3, w - 6, 138, [28, 28, 0, 0]);
      ctx.fill();

      // Header Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(3, 140);
      ctx.lineTo(w - 3, 140);
      ctx.stroke();

      // macOS Traffic Light Buttons with Glass Highlight
      const dotColors = [
        { bg: '#ff5f56', border: '#e0443e' },
        { bg: '#ffbd2e', border: '#dea123' },
        { bg: '#27c93f', border: '#1aab29' }
      ];
      dotColors.forEach((dot, dIdx) => {
        const cx = 66 + dIdx * 34;
        const cy = 70;
        const r = 9.5;
        ctx.fillStyle = dot.bg;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = dot.border;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Delicate glass highlight shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(cx - 2.5, cy - 2.5, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Browser URL Pill Capsule (Refined Glass Pill)
      const pillW = 600;
      const pillH = 56;
      const pillX = (w - pillW) / 2;
      const pillY = 42;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Secure Padlock & SSL Dot
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pillX + 28, pillY + pillH / 2, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // URL Hostname
      ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const cleanUrl = 'https://' + (data.title || '').toLowerCase().replace(/[^a-z0-9]/g, '') + '.myshopify.com';
      ctx.fillText(cleanUrl, w / 2 + 8, pillY + 35);

      // Project Category Tag (Right Side)
      ctx.fillStyle = data.accent || '#ff2a44';
      ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      const catText = '0' + (idx + 1) + ' // ' + (data.category || 'SHOPIFY 2.0');
      ctx.fillText(catText, w - 60, 78);

      // Screen Cutout Frame in Backplate (Recessed OLED Bezel)
      const screenX = 45;
      const screenY = 170;
      const screenW = 2310;
      const screenH = 1148;

      // Dark recessed bezel around the display
      ctx.fillStyle = '#05070c';
      ctx.beginPath();
      ctx.roundRect(screenX - 2, screenY - 2, screenW + 4, screenH + 4, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bottom Hardware Footer Bar (Chin)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(data.title + ' — ' + (data.tag || 'CASE STUDY'), screenX + 10, h - 34);

      // Interactive Click Indicator Pill
      const promptW = 320;
      const promptH = 38;
      const promptX = w - screenX - promptW;
      const promptY = h - 54;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(promptX, promptY, promptW, promptH, 19);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = data.accent || '#ff2a44';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CLICK DISPLAY TO PREVIEW ↗', promptX + promptW / 2, promptY + 24);

      const tex = new THREE.CanvasTexture(cvs);
      if ('outputColorSpace' in renderer && 'colorSpace' in tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
      } else if ('encoding' in tex) {
        tex.encoding = THREE.sRGBEncoding;
      }
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // Procedural Screen Fallback Texture (1155x574, 75% texture memory savings)
    function createFallbackScreenTexture(data, idx) {
      const cvs = document.createElement('canvas');
      cvs.width = 1155;
      cvs.height = 574;
      const ctx = cvs.getContext('2d');
      ctx.scale(0.5, 0.5);

      ctx.fillStyle = '#070a10';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 56px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.title, cvs.width / 2, cvs.height / 2 - 16);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(data.category || 'SHOPIFY 2.0', cvs.width / 2, cvs.height / 2 + 42);

      const tex = new THREE.CanvasTexture(cvs);
      if ('outputColorSpace' in renderer && 'colorSpace' in tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
      } else if ('encoding' in tex) {
        tex.encoding = THREE.sRGBEncoding;
      }
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // Load textures and construct luxury 3D card presentations
    const cardGroups = [];
    const cardMeshes = [];
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 4;

    PROJECTS_DATA.forEach((data, i) => {
      const cardGroup = new THREE.Group();
      cardGroup.userData = { index: i, project: data };

      // 0. Soft Ambient Drop Shadow Mesh (Gives realistic 3D floating depth)
      const shadowMat = new THREE.MeshBasicMaterial({
        map: sharedShadowTex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0, -0.06, -0.035);
      cardGroup.add(shadowMesh);
      cardGroup.userData.shadowMesh = shadowMesh;

      // 1. Sleek Chassis Frame Backplate
      const chassisTex = createChassisTexture(data, i);
      const chassisMat = new THREE.MeshBasicMaterial({
        map: chassisTex,
        toneMapped: false,
        transparent: true,
        opacity: 1.0,
        color: 0xffffff
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.userData = { index: i, project: data, group: cardGroup };
      cardGroup.add(chassisMesh);
      cardGroup.userData.chassisMesh = chassisMesh;

      // 2. Pure True-Color Display Screen Mesh (Unlit MeshBasicMaterial - 100% True To Original Asset)
      const fallbackTex = createFallbackScreenTexture(data, i);
      const screenMat = new THREE.MeshBasicMaterial({
        map: fallbackTex,
        toneMapped: false,
        transparent: false,
        opacity: 1.0,
        color: 0xffffff
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, -0.050, 0.01);
      screenMesh.userData = { index: i, project: data, group: cardGroup };
      cardGroup.add(screenMesh);
      cardGroup.userData.screenMesh = screenMesh;

      // Load original image with 100% color fidelity and maximum sharpness
      if (data.img) {
        textureLoader.load(data.img, (loadedTex) => {
          if ('outputColorSpace' in renderer && 'colorSpace' in loadedTex) {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
          } else if ('encoding' in loadedTex) {
            loadedTex.encoding = THREE.sRGBEncoding;
          }
          loadedTex.anisotropy = maxAnisotropy;
          loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
          loadedTex.magFilter = THREE.LinearFilter;
          loadedTex.generateMipmaps = true;

          // Aspect ratio fitting (cover without distorting pixel proportions):
          if (loadedTex.image && loadedTex.image.width && loadedTex.image.height) {
            const imgAspect = loadedTex.image.width / loadedTex.image.height;
            const screenAspect = SCREEN_W / SCREEN_H;
            if (imgAspect > screenAspect) {
              loadedTex.repeat.set(screenAspect / imgAspect, 1);
              loadedTex.offset.set((1 - screenAspect / imgAspect) / 2, 0);
            } else {
              loadedTex.repeat.set(1, imgAspect / screenAspect);
              loadedTex.offset.set(0, (1 - imgAspect / screenAspect) / 2);
            }
          }

          screenMat.map = loadedTex;
          screenMat.needsUpdate = true;
        }, undefined, (err) => {
          console.warn('Image load error for card', i, err);
        });
      }

      scene.add(cardGroup);
      cardGroups.push(cardGroup);
      cardMeshes.push(screenMesh, chassisMesh);
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

    // Sizing & Responsive Aspect Ratio Auto-Fitting
    function updateDimensions() {
      const rect = stageEl.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;

      // Ensure center card (CHASSIS_W = 3.84) fits with comfortable margins on all mobile & desktop viewports
      const targetCardW = CHASSIS_W;
      if (camera.aspect < 1.0) {
        // Mobile portrait: compute exact camera distance so card fits horizontally without clipping
        const horizontalMargin = w <= 480 ? 1.15 : 1.22;
        const desiredVisibleW = targetCardW * horizontalMargin;
        const desiredVisibleH = desiredVisibleW / camera.aspect;
        const halfFovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const reqDist = (desiredVisibleH * 0.5) / Math.tan(halfFovRad);
        // Center card is at curve Z = 1.8
        camera.position.z = 1.8 + reqDist;
        // Vertically raise camera lookAt on mobile so card floats nicely above the bottom HUD
        camera.position.y = w <= 480 ? 0.38 : 0.22;
      } else if (camera.aspect < 1.45) {
        // Tablet / square viewport
        camera.position.z = 8.6;
        camera.position.y = 0.08;
      } else {
        // Desktop landscape
        camera.position.z = 7.6;
        camera.position.y = 0.0;
      }
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

      if (isModalOpen) return; // Never scroll background page while modal is active

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

    let hasMouseMoved = false;
    let cachedCanvasRect = null;
    function refreshCanvasRect() {
      if (canvasEl) {
        cachedCanvasRect = canvasEl.getBoundingClientRect();
      }
    }
    window.addEventListener('resize', refreshCanvasRect, { passive: true });
    if (canvasEl) {
      canvasEl.addEventListener('pointerenter', refreshCanvasRect, { passive: true });
    }
    refreshCanvasRect();

    // Pointer Interaction (Drag / Swipe / Momentum / Raycasting)
    function onPointerDown(e) {
      refreshCanvasRect();
      isUserDragging = true;
      totalDragDistance = 0;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startPointerX = clientX;
      lastPointerX = clientX;
      dragVelocity = 0;
      canvasEl.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
      hasMouseMoved = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      // Update Mouse NDC for Raycasting using cached bounds
      if (!cachedCanvasRect || cachedCanvasRect.width === 0) {
        refreshCanvasRect();
      }
      const rect = cachedCanvasRect;
      if (rect && rect.width > 0) {
        mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      }

      if (!isUserDragging) return;

      const dx = clientX - lastPointerX;
      totalDragDistance += Math.abs(dx);
      dragVelocity = dx;
      lastPointerX = clientX;

      const dragSensitivity = window.innerWidth <= 768 ? 220 : 440;
      targetCarouselIndex -= dx / dragSensitivity;
      targetCarouselIndex = Math.max(-0.25, Math.min(TOTAL_CARDS - 0.75, targetCarouselIndex));
    }

    function onPointerUp(e) {
      if (!isUserDragging) return;
      isUserDragging = false;
      canvasEl.style.cursor = 'grab';

      // If user dragged more than 8px, apply momentum and snap cleanly to nearest project
      if (totalDragDistance > 8) {
        let snapIdx;
        if (Math.abs(dragVelocity) > 2.0) {
          snapIdx = dragVelocity < 0 ? Math.ceil(targetCarouselIndex) : Math.floor(targetCarouselIndex);
        } else {
          snapIdx = Math.round(targetCarouselIndex);
        }
        snapIdx = Math.max(0, Math.min(TOTAL_CARDS - 1, snapIdx));
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
        e.preventDefault();
        e.stopPropagation();
        const clickedMesh = intersects[0].object;
        if (clickedMesh.userData && typeof clickedMesh.userData.index === 'number') {
          const clickedIdx = clickedMesh.userData.index;
          // Open the luxury project preview modal immediately
          openProjectModal(clickedIdx);
        }
      }
    });

    // Explore Project button on HUD also opens preview modal
    if (hudBtn) {
      hudBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openProjectModal(activeCardIndex);
      });
    }

    /* -------------------------------------------------------------- */
    /* LUXURY PROJECT PREVIEW MODAL CONTROLLER (DESKTOP & MOBILE)     */
    /* -------------------------------------------------------------- */
    const modalEl = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('projectModalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const trafficCloseDot = document.getElementById('trafficCloseDot');
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalLiveLinkPill = document.getElementById('modalLiveLinkPill');
    const browserUrlText = document.getElementById('browserUrlText');
    const browserOpenLink = document.getElementById('browserOpenLink');
    const viewBtnDesktop = document.getElementById('viewBtnDesktop');
    const viewBtnMobile = document.getElementById('viewBtnMobile');
    const modalPreviewStage = document.getElementById('modalPreviewStage');
    const desktopFrameWrap = document.getElementById('desktopFrameWrap');
    const mobileFrameWrap = document.getElementById('mobileFrameWrap');
    const desktopScrollViewport = document.getElementById('desktopScrollViewport');
    const mobileScrollViewport = document.getElementById('mobileScrollViewport');
    const desktopPreviewImg = document.getElementById('desktopPreviewImg');
    const desktopPreviewVideo = document.getElementById('desktopPreviewVideo');
    const mobilePreviewImg = document.getElementById('mobilePreviewImg');
    const mobilePreviewVideo = document.getElementById('mobilePreviewVideo');
    const desktopScrollHint = document.getElementById('desktopScrollHint');
    const mobileScrollHint = document.getElementById('mobileScrollHint');
    const desktopScrollTopBtn = document.getElementById('desktopScrollTopBtn');
    const mobileScrollTopBtn = document.getElementById('mobileScrollTopBtn');
    const modalPrevProjectBtn = document.getElementById('modalPrevProjectBtn');
    const modalNextProjectBtn = document.getElementById('modalNextProjectBtn');
    const modalCurrentIndex = document.getElementById('modalCurrentIndex');
    const modalTotalProjects = document.getElementById('modalTotalProjects');

    let modalActiveIndex = 0;
    let modalCurrentView = 'desktop';
    let isModalOpen = false;
    let modalLockedScrollY = 0;

    function lockWindowScroll() {
      if (isModalOpen) {
        const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (Math.abs(currentY - modalLockedScrollY) > 0.5) {
          window.scrollTo(0, modalLockedScrollY);
        }
      }
    }

    function openProjectModal(index) {
      if (!modalEl) return;
      modalActiveIndex = Math.max(0, Math.min(TOTAL_CARDS - 1, index));
      const project = PROJECTS_DATA[modalActiveIndex];
      if (!project) return;

      // Capture exact page scroll position so the background stays locked at Projects section
      modalLockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Update meta
      if (modalCategoryBadge) modalCategoryBadge.textContent = project.category || 'SHOPIFY 2.0';
      if (modalProjectTitle) modalProjectTitle.textContent = project.title;
      if (modalLiveLinkPill) modalLiveLinkPill.href = project.liveUrl || project.link || '#';
      if (browserUrlText) browserUrlText.textContent = project.liveUrl || project.link || 'https://shopify.com';
      if (browserOpenLink) browserOpenLink.href = project.liveUrl || project.link || '#';
      if (modalEl) modalEl.style.setProperty('--project-accent', project.accent || '#ff2a44');

      // Update project counter
      if (modalCurrentIndex) {
        modalCurrentIndex.textContent = (modalActiveIndex + 1 < 10 ? '0' : '') + (modalActiveIndex + 1);
      }
      if (modalTotalProjects) {
        modalTotalProjects.textContent = (TOTAL_CARDS < 10 ? '0' : '') + TOTAL_CARDS;
      }

      // Load media for both desktop and mobile
      loadProjectMedia(project);

      // Reset scroll position of both frames
      if (desktopScrollViewport) desktopScrollViewport.scrollTop = 0;
      if (mobileScrollViewport) mobileScrollViewport.scrollTop = 0;
      if (desktopScrollHint) desktopScrollHint.classList.remove('is-hidden');
      if (mobileScrollHint) mobileScrollHint.classList.remove('is-hidden');
      if (desktopScrollTopBtn) desktopScrollTopBtn.classList.remove('is-visible');
      if (mobileScrollTopBtn) mobileScrollTopBtn.classList.remove('is-visible');

      // Set view (default to mobile frame on mobile screens)
      if (window.innerWidth <= 768) {
        modalCurrentView = 'mobile';
      }
      setViewMode(modalCurrentView, false);

      // Lock Lenis smooth scroll while modal is open
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      // Open modal
      modalEl.classList.add('is-open');
      modalEl.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('project-modal-open');
      document.body.classList.add('project-modal-open');
      isModalOpen = true;

      // Add scroll listener to guarantee background position stays locked in place
      window.addEventListener('scroll', lockWindowScroll, { passive: true });

      // Smoothly align the 3D ribbon carousel without scrolling the page window
      targetCarouselIndex = modalActiveIndex;
      updateActiveHUD();
    }

    function closeProjectModal() {
      if (!modalEl) return;
      modalEl.classList.remove('is-open');
      modalEl.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('project-modal-open');
      document.body.classList.remove('project-modal-open');
      isModalOpen = false;

      // Remove window scroll lock listener
      window.removeEventListener('scroll', lockWindowScroll);

      // Restore exact scroll position on projects section
      window.scrollTo(0, modalLockedScrollY);
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(modalLockedScrollY, { immediate: true });
      }

      // Resume Lenis smooth scroll
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
        lenis.start();
      }

      // Pause videos if playing
      if (desktopPreviewVideo) {
        desktopPreviewVideo.pause();
        desktopPreviewVideo.src = '';
      }
      if (mobilePreviewVideo) {
        mobilePreviewVideo.pause();
        mobilePreviewVideo.src = '';
      }
    }

    function setViewMode(view, animate = true) {
      modalCurrentView = view;
      const switcher = document.querySelector('.modal-view-switcher');
      if (switcher) switcher.setAttribute('data-active', view);

      if (view === 'desktop') {
        if (viewBtnDesktop) {
          viewBtnDesktop.classList.add('active');
          viewBtnDesktop.setAttribute('aria-selected', 'true');
        }
        if (viewBtnMobile) {
          viewBtnMobile.classList.remove('active');
          viewBtnMobile.setAttribute('aria-selected', 'false');
        }
        if (desktopFrameWrap) desktopFrameWrap.style.display = 'flex';
        if (mobileFrameWrap) mobileFrameWrap.style.display = 'none';
        if (modalPreviewStage) modalPreviewStage.setAttribute('data-active-view', 'desktop');
      } else {
        if (viewBtnDesktop) {
          viewBtnDesktop.classList.remove('active');
          viewBtnDesktop.setAttribute('aria-selected', 'false');
        }
        if (viewBtnMobile) {
          viewBtnMobile.classList.add('active');
          viewBtnMobile.setAttribute('aria-selected', 'true');
        }
        if (desktopFrameWrap) desktopFrameWrap.style.display = 'none';
        if (mobileFrameWrap) mobileFrameWrap.style.display = 'flex';
        if (modalPreviewStage) modalPreviewStage.setAttribute('data-active-view', 'mobile');
      }
    }

    function loadProjectMedia(project) {
      // Desktop View
      if (project.desktopVideo) {
        if (desktopPreviewImg) desktopPreviewImg.style.display = 'none';
        if (desktopPreviewVideo) {
          desktopPreviewVideo.style.display = 'block';
          desktopPreviewVideo.src = project.desktopVideo;
          desktopPreviewVideo.load();
          desktopPreviewVideo.play().catch(() => {});
        }
      } else {
        if (desktopPreviewVideo) {
          desktopPreviewVideo.pause();
          desktopPreviewVideo.style.display = 'none';
          desktopPreviewVideo.src = '';
        }
        if (desktopPreviewImg) {
          desktopPreviewImg.style.display = 'block';
          desktopPreviewImg.src = project.desktopImg || project.img || '';
        }
      }

      // Mobile View
      if (project.mobileVideo) {
        if (mobilePreviewImg) mobilePreviewImg.style.display = 'none';
        if (mobilePreviewVideo) {
          mobilePreviewVideo.style.display = 'block';
          mobilePreviewVideo.src = project.mobileVideo;
          mobilePreviewVideo.load();
          mobilePreviewVideo.play().catch(() => {});
        }
      } else {
        if (mobilePreviewVideo) {
          mobilePreviewVideo.pause();
          mobilePreviewVideo.style.display = 'none';
          mobilePreviewVideo.src = '';
        }
        if (mobilePreviewImg) {
          mobilePreviewImg.style.display = 'block';
          mobilePreviewImg.src = project.mobileImg || project.img || '';
        }
      }
    }

    // Scroll listeners for scroll hint and back-to-top button
    if (desktopScrollViewport) {
      desktopScrollViewport.addEventListener('scroll', () => {
        const top = desktopScrollViewport.scrollTop;
        if (desktopScrollHint) desktopScrollHint.classList.toggle('is-hidden', top > 50);
        if (desktopScrollTopBtn) desktopScrollTopBtn.classList.toggle('is-visible', top > 240);
      }, { passive: true });
    }

    if (mobileScrollViewport) {
      mobileScrollViewport.addEventListener('scroll', () => {
        const top = mobileScrollViewport.scrollTop;
        if (mobileScrollHint) mobileScrollHint.classList.toggle('is-hidden', top > 50);
        if (mobileScrollTopBtn) mobileScrollTopBtn.classList.toggle('is-visible', top > 240);
      }, { passive: true });
    }

    if (desktopScrollTopBtn) {
      desktopScrollTopBtn.addEventListener('click', () => {
        if (desktopScrollViewport) desktopScrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (mobileScrollTopBtn) {
      mobileScrollTopBtn.addEventListener('click', () => {
        if (mobileScrollViewport) mobileScrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Modal Scroll Isolation: Ensure mouse wheel and touch scrolling stay inside the preview
    // and never leak or scroll the background page behind the popup
    if (modalEl) {
      modalEl.addEventListener('wheel', (e) => {
        const inScrollArea = e.target.closest('#desktopScrollViewport, #mobileScrollViewport');
        if (!inScrollArea) {
          e.preventDefault();
        }
        e.stopPropagation();
      }, { passive: false });

      modalEl.addEventListener('touchmove', (e) => {
        const inScrollArea = e.target.closest('#desktopScrollViewport, #mobileScrollViewport');
        if (!inScrollArea) {
          e.preventDefault();
        }
        e.stopPropagation();
      }, { passive: false });
    }

    [desktopScrollViewport, mobileScrollViewport].forEach((vp) => {
      if (!vp) return;
      vp.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });
      vp.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: true });
    });

    // Switcher controls
    if (viewBtnDesktop) {
      viewBtnDesktop.addEventListener('click', () => setViewMode('desktop', true));
    }
    if (viewBtnMobile) {
      viewBtnMobile.addEventListener('click', () => setViewMode('mobile', true));
    }

    // Modal close controls
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
    if (trafficCloseDot) trafficCloseDot.addEventListener('click', closeProjectModal);

    // Modal Prev / Next buttons
    if (modalPrevProjectBtn) {
      modalPrevProjectBtn.addEventListener('click', () => {
        const prevIdx = (modalActiveIndex - 1 + TOTAL_CARDS) % TOTAL_CARDS;
        openProjectModal(prevIdx);
      });
    }
    if (modalNextProjectBtn) {
      modalNextProjectBtn.addEventListener('click', () => {
        const nextIdx = (modalActiveIndex + 1) % TOTAL_CARDS;
        openProjectModal(nextIdx);
      });
    }

    // Keyboard shortcuts for modal
    window.addEventListener('keydown', (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') {
        closeProjectModal();
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (modalActiveIndex - 1 + TOTAL_CARDS) % TOTAL_CARDS;
        openProjectModal(prevIdx);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (modalActiveIndex + 1) % TOTAL_CARDS;
        openProjectModal(nextIdx);
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

    // Reusable scratch objects to eliminate garbage collection allocations in per-frame ribbon loop
    const _upVec = new THREE.Vector3(0, 1, 0);
    const _normVec = new THREE.Vector3();
    const _binormVec = new THREE.Vector3();
    const _rotMatrix = new THREE.Matrix4();

    // Per-frame Render Loop
    function render(now) {
      // Lerp smooth carousel index
      const lerpSpeed = isUserDragging ? 0.28 : 0.12;
      currentCarouselIndex += (targetCarouselIndex - currentCarouselIndex) * lerpSpeed;

      // Throttled raycasting: only test when pointer actually moved
      if (!isUserDragging && hasMouseMoved) {
        raycaster.setFromCamera(mouseNDC, camera);
        const intersects = raycaster.intersectObjects(cardMeshes);
        if (intersects.length > 0) {
          hoveredCardIndex = intersects[0].object.userData.index;
          canvasEl.style.cursor = 'pointer';
        } else {
          hoveredCardIndex = -1;
          canvasEl.style.cursor = 'grab';
        }
        hasMouseMoved = false;
      }

      // Thread each card along the 3D Catmull-Rom Ribbon
      const spacingAlongCurve = 0.088;
      const centerU = 0.5;

      cardGroups.forEach((group, i) => {
        const offsetFromCenter = i - currentCarouselIndex;
        const u = centerU + offsetFromCenter * spacingAlongCurve;

        if (u < -0.05 || u > 1.05) {
          group.visible = false;
          return;
        }

        const clampedU = Math.max(0.001, Math.min(0.999, u));
        const pt = curve.getPointAt(clampedU);
        const tangent = curve.getTangentAt(clampedU).normalize();

        // Banking Orientation Frame (scratch vectors eliminate 40 heap allocations per frame)
        _normVec.crossVectors(tangent, _upVec).normalize();
        _binormVec.crossVectors(_normVec, tangent).normalize();

        // Bank with the curve
        const bankAngle = (clampedU - 0.5) * 0.42;
        _normVec.applyAxisAngle(tangent, bankAngle);
        _binormVec.applyAxisAngle(tangent, bankAngle);

        _rotMatrix.makeBasis(_normVec, _binormVec, tangent);
        group.quaternion.setFromRotationMatrix(_rotMatrix);
        group.position.copy(pt);

        // Scale: card in center fills frame at full size; off-center cards shrink naturally
        const distFromCenter = Math.abs(clampedU - 0.5);
        const isHovered = (i === hoveredCardIndex);
        const baseScale = Math.max(0.68, 1.0 - distFromCenter * 0.55);
        const scale = isHovered ? baseScale * 1.05 : baseScale;
        group.scale.set(scale, scale, scale);

        // Edge fade-out (Center card remains 100% solid with zero opacity loss or color degradation)
        const edgeAlpha = Math.max(0, Math.min(1, (0.48 - distFromCenter) * 8.0));
        group.visible = edgeAlpha > 0.01;

        const isCenterFocused = distFromCenter < 0.08;
        if (group.userData.shadowMesh && group.userData.shadowMesh.material) {
          group.userData.shadowMesh.material.transparent = true;
          group.userData.shadowMesh.material.opacity = edgeAlpha * 0.45;
        }
        if (group.userData.chassisMesh && group.userData.chassisMesh.material) {
          group.userData.chassisMesh.material.transparent = edgeAlpha < 0.999;
          group.userData.chassisMesh.material.opacity = edgeAlpha;
        }
        if (group.userData.screenMesh && group.userData.screenMesh.material) {
          // Keep screen 100% opaque and untouched when in focal center
          group.userData.screenMesh.material.transparent = !isCenterFocused && edgeAlpha < 0.999;
          group.userData.screenMesh.material.opacity = isCenterFocused ? 1.0 : edgeAlpha;
        }
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
      playEntrance: () => { },
      triggerEntrance: () => { },
      resetEntrance: () => { }
    };
  }

  /* ------------------------------------------------------------------ */
  /* 3-CARD EDITORIAL PORTRAIT STAGE & CREDENTIALS DETAIL MODAL         */
  /* ------------------------------------------------------------------ */
  function initCredentialsModalAndCards() {
    const cards = document.querySelectorAll('.portrait-card');
    const modal = document.getElementById('credentialsDetailModal');
    if (!cards.length && !modal) {
      return null;
    }
    const modalBackdrop = document.getElementById('credentialsModalBackdrop');
    const modalCloseBtn = document.getElementById('credModalCloseBtn');
    const closeViewBtn = document.getElementById('credCloseViewBtn');
    const prevBtn = document.getElementById('credPrevCardBtn');
    const nextBtn = document.getElementById('credNextCardBtn');
    const tabPills = document.querySelectorAll('.cred-tab-pill');

    const badgeEl = document.getElementById('credCategoryBadge');
    const titleEl = document.getElementById('credModalTitle');
    const subEl = document.getElementById('credModalSub');

    const stat1Val = document.getElementById('credStat1Val');
    const stat1Lbl = document.getElementById('credStat1Lbl');
    const stat2Val = document.getElementById('credStat2Val');
    const stat2Lbl = document.getElementById('credStat2Lbl');
    const stat3Val = document.getElementById('credStat3Val');
    const stat3Lbl = document.getElementById('credStat3Lbl');

    const panels = {
      education: document.getElementById('credPanelEducation'),
      experience: document.getElementById('credPanelExperience'),
      certifications: document.getElementById('credPanelCertifications')
    };

    const CRED_CATEGORIES = ['education', 'experience', 'certifications'];
    let currentCategory = 'education';
    let isModalOpen = false;

    const CRED_METADATA = {
      education: {
        badge: 'EDUCATION & QUALIFICATIONS',
        title: 'Academic Foundation & Credentials',
        sub: 'Comprehensive overview of degrees, institutions, and core quantitative coursework.',
        stats: [
          { val: 'BSS Degree', lbl: 'Major in Economics' },
          { val: '3.12 CGPA', lbl: 'Tejgaon National Univ.' },
          { val: '2 Milestones', lbl: 'Academic Excellence' }
        ]
      },
      experience: {
        badge: 'CAREER & LEADERSHIP',
        title: 'Professional Experience & Roles',
        sub: 'Track record of delivering enterprise Shopify 2.0 architectures and robust frontend applications.',
        stats: [
          { val: '5+ Years', lbl: 'Professional Craft' },
          { val: '40+ Projects', lbl: 'Global Deliveries' },
          { val: 'Shopify 2.0', lbl: 'Full-Stack Architect' }
        ]
      },
      certifications: {
        badge: 'ACCREDITATIONS & MASTERY',
        title: 'Industry Certifications & Skills',
        sub: 'Verified credentials in modern web engineering, Shopify ecosystem, and accessibility standards.',
        stats: [
          { val: '6+ Badges', lbl: 'Verified Credentials' },
          { val: 'Shopify Expert', lbl: 'Liquid & App Mastery' },
          { val: 'Modern Web', lbl: 'JavaScript & CSS Systems' }
        ]
      }
    };

    function switchCredTab(category) {
      if (!CRED_METADATA[category]) return;
      currentCategory = category;
      const data = CRED_METADATA[category];

      // Update Header
      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (subEl) subEl.textContent = data.sub;

      // Update Quick Stats
      if (stat1Val) stat1Val.textContent = data.stats[0].val;
      if (stat1Lbl) stat1Lbl.textContent = data.stats[0].lbl;
      if (stat2Val) stat2Val.textContent = data.stats[1].val;
      if (stat2Lbl) stat2Lbl.textContent = data.stats[1].lbl;
      if (stat3Val) stat3Val.textContent = data.stats[2].val;
      if (stat3Lbl) stat3Lbl.textContent = data.stats[2].lbl;

      // Update Tab Buttons
      tabPills.forEach(btn => {
        const isActive = btn.getAttribute('data-cred-tab') === category;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update Panels
      Object.keys(panels).forEach(key => {
        const panel = panels[key];
        if (panel) {
          panel.classList.toggle('active', key === category);
        }
      });

      // Reset scroll in dialog body
      const scrollBody = modal ? modal.querySelector('.credentials-body-scroll') : null;
      if (scrollBody) scrollBody.scrollTop = 0;
    }

    function openCredModal(category) {
      if (!modal) return;
      currentCategory = category || 'education';
      switchCredTab(currentCategory);

      // Stop Lenis smooth scroll
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      isModalOpen = true;
    }

    function closeCredModal() {
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      isModalOpen = false;

      // Resume Lenis smooth scroll
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    }

    function stepCategory(direction) {
      const currentIndex = CRED_CATEGORIES.indexOf(currentCategory);
      let nextIndex = (currentIndex + direction) % CRED_CATEGORIES.length;
      if (nextIndex < 0) nextIndex = CRED_CATEGORIES.length - 1;
      switchCredTab(CRED_CATEGORIES[nextIndex]);
    }

    // Bind cards hover to totally open the floating hovercard
    cards.forEach(card => {
      const cardType = card.getAttribute('data-card');

      // Hover totally opens the floating cyber-luxury hovercard
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => {
          if (c !== card) c.classList.remove('is-expanded');
        });
        card.classList.add('is-expanded');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-expanded');
      });

      // Keyboard accessibility support
      card.addEventListener('focus', () => {
        cards.forEach(c => {
          if (c !== card) c.classList.remove('is-expanded');
        });
        card.classList.add('is-expanded');
      });
      card.addEventListener('blur', () => {
        card.classList.remove('is-expanded');
      });

      // Explicit click opens the full detail modal dialog
      card.addEventListener('click', (e) => {
        // If clicking a button inside, let button handler manage
        if (e.target.closest('[data-open-card]') || e.target.closest('.hovercard-footer-btn')) {
          return;
        }
        openCredModal(cardType);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCredModal(cardType);
        }
      });
    });

    // Explicit data-open-card buttons & hovercard footer buttons
    document.querySelectorAll('[data-open-card], .hovercard-footer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-open-card') || btn.closest('.portrait-card')?.getAttribute('data-card') || 'education';
        openCredModal(type);
      });
    });

    // Tab pills hover & click inside modal
    tabPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-cred-tab');
        switchCredTab(cat);
      });

      pill.addEventListener('mouseenter', () => {
        const cat = pill.getAttribute('data-cred-tab');
        switchCredTab(cat);
      });
    });

    // Modal controls
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCredModal);
    if (closeViewBtn) closeViewBtn.addEventListener('click', closeCredModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCredModal);

    if (prevBtn) prevBtn.addEventListener('click', () => stepCategory(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepCategory(1));

    // Global keyboard listener
    window.addEventListener('keydown', (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') {
        closeCredModal();
      } else if (e.key === 'ArrowLeft') {
        stepCategory(-1);
      } else if (e.key === 'ArrowRight') {
        stepCategory(1);
      }
    });

    return {
      open: openCredModal,
      close: closeCredModal,
      switchTab: switchCredTab
    };
  }

  // Listeners
  window.addEventListener('scroll', () => updateScroll(), { passive: true });
  window.addEventListener('resize', () => {
    updateCachedMetrics();
    updateScroll();
    if (bloodEngine && bloodEngine.refreshLetterCoordinates) {
      bloodEngine.refreshLetterCoordinates();
    }
  }, { passive: true });

  // Initialize
  updateCachedMetrics();
  initSectionObservers();
  updateScroll();
  initMouseFollowingEyes();
  initFloatingMenu();
  bloodEngine = initBloodLiquidEngine();
  initAboutDeskInteractions();
  projectsEngine = initThreeJSRibbonShowcase();
  const credentialsEngine = initCredentialsModalAndCards();
  initFooterInteractiveStringArt();

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
  } else if (urlParams.get('preview') === 'journey' || urlParams.get('section') === 'journey' || urlParams.get('preview') === 'experience' || urlParams.get('preview') === 'credentials' || urlParams.get('preview') === 'education') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elBloodSection) elBloodSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('logo-hidden');
    }
    const journeySec = document.getElementById('journey');
    if (journeySec) {
      journeySec.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (credentialsEngine && (urlParams.get('preview') === 'credentials' || urlParams.has('modal'))) {
        const tab = urlParams.get('tab') || 'education';
        credentialsEngine.open(tab);
      }
    }
  } else if (urlParams.get('preview') === 'footer' || urlParams.get('section') === 'footer' || urlParams.get('preview') === 'contact') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elBloodSection) elBloodSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('logo-hidden');
    }
    const footerSec = document.getElementById('contact');
    if (footerSec) {
      footerSec.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  } else if (urlParams.get('preview') === 'marquee' || urlParams.get('section') === 'marquee' || urlParams.get('preview') === 'partners' || urlParams.get('preview') === 'ribbon') {
    if (elPreloader) {
      elPreloader.remove();
      preloaderFinished = true;
    }
    if (elHeroSection) elHeroSection.style.display = 'none';
    if (elBloodSection) elBloodSection.style.display = 'none';
    if (elSiteHeader) {
      elSiteHeader.classList.add('logo-hidden');
    }
    const marqSec = document.getElementById('brandMarquee');
    if (marqSec) {
      marqSec.scrollIntoView({ behavior: 'instant', block: 'start' });
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

  if (elPreloader) {
    requestAnimationFrame(tickPreloader);
  }
  requestAnimationFrame(tick);
})();
