/* ==========================================================================
   ARJHUN O - PORTFOLIO INTERACTIVE LOGIC & CONTROLLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Sound System (Web Audio API Synthesizer)
     -------------------------------------------------------------------------- */
  let soundEnabled = true;
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  let audioCtx = null;

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.1) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  }

  soundToggleBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    if (soundEnabled) playTone(587.33, 'triangle', 0.15); // D5
  });

  // Attach button sound click handlers
  document.querySelectorAll('button, a.btn, .social-circle-btn, .filter-tab').forEach(el => {
    el.addEventListener('click', () => {
      playTone(440, 'sine', 0.08); // A4
    });
  });

  /* --------------------------------------------------------------------------
     2. Navbar Scroll Tracking & Mobile Menu
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksMenu = document.getElementById('nav-links');

  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (!scrollTicking) {
      requestAnimationFrame(() => {
        // Scroll spy
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 100;
          const sectionId = current.getAttribute('id');
          const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
          }
        });

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  mobileToggle?.addEventListener('click', () => {
    navLinksMenu?.classList.toggle('active');
  });

  // Fast JS smooth scroll on nav link click — offset for fixed navbar
  const navbarEl = document.getElementById('navbar');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbarEl ? navbarEl.offsetHeight : 70;
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
      navLinksMenu?.classList.remove('active');
    });
  });


  /* --------------------------------------------------------------------------
     3. Ambient Canvas Particle Effect
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(width < 768 ? 25 : 50, 60);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 0, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* --------------------------------------------------------------------------
     4. Portfolio Filter Tabs
     -------------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     5. Project Inspection Detail Modal
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  const projectDetails = {
    minvis: {
      title: "MinVis",
      subtitle: "Minimal Intelligent Virtual Interactive System",
      tech: "PHP, MySQL, JavaScript, Ollama AI",
      img: "assets/thumbnails/minvis_user.png",
      description: "MinVis is a cutting-edge full-stack data visualization platform. It combines dynamic frontend interaction, relational MySQL data pipelines, and offline local AI prompt processing powered by Ollama. It enables users to input dataset queries and receive AI-driven visual analytics in real time without external API latency.",
      highlights: ["Offline AI Analysis with Ollama LLMs", "PHP & MySQL relational schema design", "Interactive frontend charts with ES6 Canvas"],
      github: "https://github.com/arjhun03"
    },
    fintrack: {
      title: "FinTrack",
      subtitle: "Personal Finance Tracker",
      tech: "React.js, Firebase, Tailwind CSS, Recharts",
      img: "assets/thumbnails/fintrack.png",
      description: "FinTrack is a real-time income and expense management dashboard. Built with React.js and Firebase Firestore, it provides seamless multi-device state synchronization, spending categorization analytics with Recharts, transaction history search, and visual budgeting goals.",
      highlights: ["Real-time Firebase Firestore data synchronization", "Recharts spending analytics", "Responsive UI styled with Tailwind CSS"],
      github: "https://github.com/arjhun03/FinTrack"
    },
    eldorado: {
      title: "El Dorado Casino",
      subtitle: "Full-Stack Multiplayer Web App",
      tech: "React 19, PeerJS, Supabase, Zustand",
      img: "assets/thumbnails/eldorado_user3.png",
      description: "El Dorado Casino is a peer-to-peer multiplayer gaming platform. It utilizes WebRTC (PeerJS) for instant room-based player communication, Supabase for authentication and session data persistence, Zustand for reactive state management, and an admin dashboard for table controls.",
      highlights: ["Peer-to-Peer WebRTC via PeerJS", "Supabase authentication & real-time DB", "State management using Zustand"],
      github: "https://github.com/arjhun03/El-Dorado-Casino"
    },
    gameboy: {
      title: "Aju's 3D Gameboy Portfolio",
      subtitle: "Interactive 3D Gamer Experience",
      tech: "Three.js, GSAP, WebGL, GLTF",
      img: "assets/thumbnails/gameboy_user2.png",
      description: "An interactive 3D portfolio featuring a custom-rendered Gameboy console model in Three.js WebGL environment. Complete with baked textures, GSAP camera animations, interactive screen apps, and retro sound effects.",
      highlights: ["Custom 3D GLTF Gameboy model", "Baked texture mapping & WebGL lighting", "GSAP interactive camera transitions"],
      demo: "https://idas-gameboy.netlify.app",
      github: "https://github.com/Arjhun03/3D-portfolio"
    },
    corpindex: {
      title: "Corpindex Internship",
      subtitle: "PHP Developer Intern",
      tech: "PHP, MySQL, REST APIs, CRUD",
      img: "assets/thumbnails/corpindex_user.png",
      description: "During my internship at Corpindex, I engineered production RESTful APIs in PHP, optimized complex MySQL queries for high performance, fixed core web app bugs, and collaborated on clean backend CRUD pipelines.",
      highlights: ["RESTful API design and documentation", "MySQL query indexing and optimization", "Full-stack feature deployment"],
      github: "https://github.com/arjhun03"
    },
    codealpha: {
      title: "Code Alpha Internship",
      subtitle: "Full Stack Intern",
      tech: "HTML, CSS, JavaScript, PHP",
      img: "assets/thumbnails/codealpha_user.png",
      description: "As a Full Stack Intern at Code Alpha, I built responsive frontend UI components, developed database CRUD functionality using PHP and MySQL, and integrated web fundamentals for production features.",
      highlights: ["Responsive UI component design", "Database integration & web security fundamentals"],
      github: "https://github.com/arjhun03"
    },
    codebreaker: {
      title: "Code Breaker Game",
      subtitle: "Password Digit Guessing Game",
      tech: "HTML, CSS, JavaScript",
      img: "assets/thumbnails/codebreaker_user.png",
      description: "Code Breaker Game is a browser-based JavaScript challenge where players try to guess the last digit of a password within 10 attempts. It focuses on simple game-state handling, player feedback, and replayable interaction.",
      highlights: ["10-try guessing game loop", "JavaScript conditional logic", "Immediate player feedback"],
      demo: "https://lnkd.in/grzdKagk"
    },
    cyberquiz: {
      title: "Cyberpunk Quiz App",
      subtitle: "Neon-Styled Interactive Quiz",
      tech: "HTML, CSS, JavaScript",
      img: "assets/thumbnails/cyberquiz_user.png",
      description: "Cyberpunk Quiz App is an interactive quiz interface with a neon visual style. It combines styled question screens, JavaScript-driven answer flow, and responsive frontend presentation.",
      highlights: ["Neon cyberpunk visual theme", "Interactive quiz progression", "Responsive HTML, CSS, and JavaScript UI"],
      demo: "https://lnkd.in/gSKy-td6"
    },
    ecommerce: {
      title: "E-Commerce Store",
      subtitle: "Product, Cart and Checkout Flow",
      tech: "HTML, CSS, JavaScript, Express.js",
      img: "assets/thumbnails/ecommerce_user.png",
      description: "E-Commerce Store is a simple full-stack storefront with product listings, cart behavior, and checkout flow. It combines static frontend structure with Express.js-backed application flow.",
      highlights: ["Product listing interface", "Cart and checkout workflow", "HTML frontend with Express.js app structure"],
      demo: "https://lnkd.in/gm-TEU_H"
    },
    socialui: {
      title: "Social Media UI",
      subtitle: "Responsive Social Platform Frontend",
      tech: "HTML, CSS, JavaScript",
      img: "assets/screensImages/userScreen.jpg",
      description: "Social Media UI is a frontend prototype for a social platform, focused on clean layout, responsive presentation, profile areas, and user-facing content sections.",
      highlights: ["Responsive social layout", "Profile and content UI structure", "Clean frontend component styling"],
      demo: "https://lnkd.in/gUeGp39w"
    },
    flames: {
      title: "FLAMES",
      subtitle: "Relationship Status Game",
      tech: "HTML, CSS, JavaScript",
      img: "assets/thumbnails/flames_user.png",
      description: "FLAMES is a playful JavaScript game that takes two names and detects relationship status through a classic FLAMES-style calculation.",
      highlights: ["Name-based game input flow", "JavaScript relationship-status logic", "Playful frontend feedback"],
      demo: "https://arjhun03.github.io/FLAME/"
    },
    fractionsolver: {
      title: "Fraction Order Solver",
      subtitle: "JavaScript Math Challenge",
      tech: "JavaScript, HTML, CSS",
      img: "assets/thumbnails/fractionsolver_user2.png",
      description: "Fraction Order Solver is a math-focused JavaScript tool that compares fractions and orders them through browser-side logic, turning a small algorithmic challenge into an interactive UI.",
      highlights: ["Fraction comparison logic", "DOM-based input and feedback", "Algorithmic JavaScript practice"],
      demo: "https://lnkd.in/gudHPB8Q"
    },
    datamanagement: {
      title: "Data Management System",
      subtitle: "CorpIndex Backend CRUD App",
      tech: "PHP, CodeIgniter 4, MySQL, CRUD",
      img: "assets/thumbnails/datamanagement_user2.png",
      description: "Data Management System is a CodeIgniter 4 backend application built for CorpIndex workflows. It handles data flow, business logic, and CRUD operations through a PHP and database-backed structure.",
      highlights: ["CodeIgniter 4 backend flow", "Database CRUD operations", "CorpIndex data management use case"],
      demo: "https://github.com/arjhun010905/data-management"
    },
    techsphaera: {
      title: "Tech-Sphaera Club Site",
      subtitle: "Dynamic CI4 Club Website",
      tech: "PHP, CodeIgniter 4, MySQL, Bootstrap",
      img: "assets/screensImages/projectsScreen.jpg",
      description: "Tech-Sphaera Club Site is a dynamic CodeIgniter 4 website for a student club. It stores event suggestions from members in a database and presents the club presence through a structured web interface.",
      highlights: ["Dynamic club website", "Database-backed event suggestions", "PHP CI4 and Bootstrap implementation"],
      demo: "https://github.com/arjhun010905/tech-sphaera"
    }
  };

  document.querySelectorAll('.btn-inspect').forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      modalContent.innerHTML = `
        <img src="${data.img}" alt="${data.title}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-light);">
        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 0.25rem;">${data.title}</h2>
        <div style="color: var(--primary-orange); font-weight: 600; font-size: 0.95rem; margin-bottom: 1rem;">${data.subtitle}</div>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">${data.description}</p>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Key Highlights:</h4>
          <ul style="padding-left: 1.25rem; color: var(--text-secondary); font-size: 0.9rem;">
            ${data.highlights.map(h => `<li style="margin-bottom: 0.25rem;">${h}</li>`).join('')}
          </ul>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          ${data.github ? `<a href="${data.github}" target="_blank" rel="noopener" class="btn btn-orange-pill"><i class="fab fa-github"></i> View GitHub Repo</a>` : ''}
          ${data.demo ? `<a href="${data.demo}" target="_blank" rel="noopener" class="btn btn-dark-outline-pill"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
        </div>
      `;

      projectModal?.classList.add('active');
      playTone(659.25, 'triangle', 0.15); // E5
    });
  });

  modalClose?.addEventListener('click', () => {
    projectModal?.classList.remove('active');
  });

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('active');
  });

  /* --------------------------------------------------------------------------
     6. 3D Gameboy & Retro Arcade Modal + Mini Canvas Game
     -------------------------------------------------------------------------- */
  const gameboyModal = document.getElementById('gameboy-modal');
  const gameboyModalClose = document.getElementById('gameboy-modal-close');
  const heroGameboyBtn = document.getElementById('hero-gameboy-btn');
  const gbCanvas = document.getElementById('gameboy-mini-canvas');
  const gbLeftBtn = document.getElementById('gb-left');
  const gbRightBtn = document.getElementById('gb-right');
  let gameboyAnimationId = null;
  let gameboyInitialized = false;
  let paddleX = 160;
  let ballX = 200;
  let ballY = 150;
  let dx = 3;
  let dy = -3;

  heroGameboyBtn?.addEventListener('click', () => {
    playTone(523.25, 'square', 0.2); // C5
  });

  gameboyModalClose?.addEventListener('click', () => {
    gameboyModal?.classList.remove('active');
    stopGameboyCanvas();
  });

  function initGameboyCanvas() {
    if (!gbCanvas) return;
    const gctx = gbCanvas.getContext('2d');
    if (!gctx || gameboyAnimationId) return;

    if (!gameboyInitialized) {
      gbLeftBtn?.addEventListener('click', () => {
        paddleX = Math.max(0, paddleX - 25);
      });

      gbRightBtn?.addEventListener('click', () => {
        paddleX = Math.min(gbCanvas.width - 80, paddleX + 25);
      });

      gameboyInitialized = true;
    }

    function renderGame() {
      if (!gameboyModal?.classList.contains('active')) {
        stopGameboyCanvas();
        return;
      }

      gctx.fillStyle = '#8bac0f';
      gctx.fillRect(0, 0, gbCanvas.width, gbCanvas.height);

      // Draw Ball
      gctx.fillStyle = '#0f380f';
      gctx.fillRect(ballX, ballY, 10, 10);

      // Draw Paddle
      gctx.fillRect(paddleX, 280, 80, 10);

      // Ball collision
      ballX += dx;
      ballY += dy;

      if (ballX <= 0 || ballX >= gbCanvas.width - 10) dx = -dx;
      if (ballY <= 0) dy = -dy;

      if (ballY >= 270 && ballX >= paddleX && ballX <= paddleX + 80) {
        dy = -dy;
        playTone(330, 'square', 0.05);
      }

      if (ballY > gbCanvas.height) {
        ballX = 200;
        ballY = 150;
        dy = -3;
      }

      gameboyAnimationId = requestAnimationFrame(renderGame);
    }

    renderGame();
  }

  function stopGameboyCanvas() {
    if (!gameboyAnimationId) return;
    cancelAnimationFrame(gameboyAnimationId);
    gameboyAnimationId = null;
  }

  /* --------------------------------------------------------------------------
     7. Bunny Virus Easter Egg Overlay
     -------------------------------------------------------------------------- */
  const bunnyOverlay = document.getElementById('bunny-virus-overlay');
  const triggerBunnyBtn = document.getElementById('trigger-bunny-virus');
  const clearBunnyBtn = document.getElementById('clear-bunny-virus');

  triggerBunnyBtn?.addEventListener('click', () => {
    gameboyModal?.classList.remove('active');
    bunnyOverlay?.classList.add('active');
    playTone(150, 'sawtooth', 0.5);
  });

  clearBunnyBtn?.addEventListener('click', () => {
    bunnyOverlay?.classList.remove('active');
    playTone(880, 'sine', 0.3);
  });

  /* --------------------------------------------------------------------------
     8. Command Palette (Ctrl + K)
     -------------------------------------------------------------------------- */
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdBtn = document.getElementById('cmd-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmdPalette() {
    cmdPalette?.classList.add('active');
    cmdInput?.focus();
    playTone(523.25, 'triangle', 0.1);
  }

  function closeCmdPalette() {
    cmdPalette?.classList.remove('active');
  }

  cmdBtn?.addEventListener('click', openCmdPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      cmdPalette?.classList.contains('active') ? closeCmdPalette() : openCmdPalette();
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      projectModal?.classList.remove('active');
      gameboyModal?.classList.remove('active');
      stopGameboyCanvas();
    }
  });

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCmdPalette();

      if (action === 'resume') {
        window.open('https://drive.google.com/file/d/1lNiYAaoV4RtExp6FZuctJWOBVVMoTZwy/view?usp=sharing', '_blank');
      } else if (action === 'gameboy') {
        window.open('https://idas-gameboy.netlify.app', '_blank', 'noopener');
      } else {
        const targetSec = document.getElementById(action);
        targetSec?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     9. Contact Form Handling
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Visitor';
    const email = document.getElementById('contact-email')?.value || '';
    const subject = document.getElementById('contact-subject')?.value || 'Portfolio Inquiry';
    const message = document.getElementById('contact-message')?.value || '';

    if (formStatus) {
      formStatus.innerHTML = `<span style="color: #00b8a3; font-weight: 600;"><i class="fas fa-paper-plane"></i> Thank you, ${name}! Your message is sending to arjhun010905@gmail.com...</span>`;
    }

    playTone(659.25, 'sine', 0.25);

    setTimeout(() => {
      const mailtoUrl = `mailto:arjhun010905@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.innerHTML = `<span style="color: var(--primary-orange); font-weight: 600;"><i class="fas fa-check-circle"></i> Message dispatched! Opening mail app to send to arjhun010905@gmail.com.</span>`;
      }
    }, 800);
  });

});
