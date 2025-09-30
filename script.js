// =====================
// Utilities
// =====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// =====================
// Typing effect for roles
// =====================
(function initTypingEffect() {
  const roles = [
    'Creators • Engineers • Storytellers',
    'AI enthusiast • Designer • Founder-in-making',
    'Content creators with 6M+ views'
  ];
  const typeEl = $('#type');
  if (!typeEl) return;

  let rIndex = 0, cIndex = 0, forward = true;

  function typeTick() {
    const txt = roles[rIndex];
    typeEl.textContent = txt.slice(0, cIndex);

    if (forward) {
      cIndex++;
      if (cIndex > txt.length) {
        forward = false;
        return setTimeout(typeTick, 900);
      }
    } else {
      cIndex--;
      if (cIndex < 0) {
        forward = true;
        rIndex = (rIndex + 1) % roles.length;
        cIndex = 0;
      }
    }
    setTimeout(typeTick, 80);
  }
  typeTick();
})();

// =====================
// Skill bar animation
// =====================
document.addEventListener('DOMContentLoaded', () => {
  $$('.fill').forEach(f => {
    setTimeout(() => f.style.width = f.dataset.fill || '60%', 400);
  });
});

// =====================
// Hero card parallax tilt
// =====================
(function initHeroTilt() {
  const hero = $('.hero-card');
  if (!hero || 'ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const my = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    hero.style.transform = `rotateY(${mx * 4}deg) rotateX(${-my * 4}deg)`;
  });
  hero.addEventListener('mouseleave', () => hero.style.transform = 'none');
})();

// =====================
// Hire button scroll
// =====================
$('#hireBtn')?.addEventListener('click', () => {
  $('#contact')?.scrollIntoView({ behavior: 'smooth' });
});

// =====================
// Smooth scrolling & nav highlight
// =====================
(function initSmoothScroll() {
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      $(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = $(`nav a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(n => n.classList.remove('active'));
        link.classList.add('active');
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: '0px 0px -40% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

// =====================
// Theme toggle
// =====================
(function initThemeToggle() {
  const toggle = $('#themeToggle');
  if (!toggle) return;

  function setTheme(isLight) {
    document.body.classList.toggle('light', isLight);
    localStorage.setItem('prefers-light', String(isLight));
    toggle.textContent = isLight ? "☀️" : "🌙";
    toggle.setAttribute('aria-pressed', String(isLight));
  }

  setTheme(localStorage.getItem('prefers-light') === 'true');

  toggle.addEventListener('click', () => {
    toggle.classList.add("rotate");
    setTimeout(() => toggle.classList.remove("rotate"), 300);
    setTheme(!document.body.classList.contains('light'));
  });
})();

// =====================
// Carousel
// =====================
(function initCarousel() {
  const track = $('.carousel-track');
  if (!track) return;

  const container = $('.carousel-track-container');
  const prevButton = $('.carousel-btn.prev');
  const nextButton = $('.carousel-btn.next');

  const slides = Array.from(track.children);
  if (!slides.length) return;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.dataset.clone = lastClone.dataset.clone = 'true';
  track.append(firstClone);
  track.prepend(lastClone);

  let allSlides = Array.from(track.children);
  let currentIndex = 1;

  function setPositions() {
    const slideWidth = allSlides[0].getBoundingClientRect().width + 20;
    allSlides.forEach((s, i) => s.style.left = `${slideWidth * i}px`);
  }

  function centerSlide(index) {
    const containerWidth = container.getBoundingClientRect().width;
    const slide = allSlides[index];
    const slideLeft = parseFloat(slide.style.left) || 0;
    const slideCenter = slideLeft + slide.offsetWidth / 2;
    const offset = containerWidth / 2 - slideCenter;
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(${offset}px)`;
  }

  function moveTo(i) {
    currentIndex = i;
    centerSlide(currentIndex);
  }

  window.addEventListener('resize', () => {
    allSlides = Array.from(track.children);
    setPositions();
    centerSlide(currentIndex);
  });

  track.addEventListener('transitionend', () => {
    const current = allSlides[currentIndex];
    if (current?.dataset.clone === 'true') {
      track.style.transition = 'none';
      currentIndex = current === firstClone ? 1 : allSlides.length - 2;
      centerSlide(currentIndex);
    }
  });

  prevButton?.addEventListener('click', () => moveTo(currentIndex - 1));
  nextButton?.addEventListener('click', () => moveTo(currentIndex + 1));

  setPositions();
  setTimeout(() => centerSlide(currentIndex), 50);
})();

// =====================
// Contact form UX
// =====================
$('#contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const formData = new FormData(e.target);

  const messageDiv = document.getElementById('formMessage');

  try {
    const response = await fetch(e.target.action, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (response.ok) {
      messageDiv.textContent = 'Message sent successfully!';
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#d4edda';
      messageDiv.style.color = '#155724';
      messageDiv.style.border = '1px solid #c3e6cb';
      e.target.reset();
    } else {
      messageDiv.textContent = 'Error: ' + result.error;
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.color = '#721c24';
      messageDiv.style.border = '1px solid #f5c6cb';
    }
  } catch (error) {
    messageDiv.textContent = 'Error sending message: ' + error.message;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
});

// =====================
// Navbar hide on scroll
// =====================
(function initNavbarScroll() {
  const header = $('header');
  if (!header) return;
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    header.classList.toggle("hide", window.scrollY > lastScrollY);
    lastScrollY = window.scrollY;
  });
})();

// =====================
// Achievements rotator
// =====================
(function initAchievementsRotator(){
  const items = [
    '✨ Founders of <strong class="highlight">Judwaah</strong> (6M+ views)',
    '🏆 <strong class="highlight">Smart India Hackathon Runner-up</strong>',
    '🚀 Builders of tech & fashion ideas'
  ];

  let idx = 0;
  const animMs = 600;    // must match CSS transition (0.6s)
  const displayMs = 3000;

  const cur = document.getElementById('rotCurrent');
  const nxt = document.getElementById('rotNext');
  if (!cur || !nxt) return;

  cur.innerHTML = items[0];
  nxt.innerHTML = '';

  function cycleOnce(){
    const nextIdx = (idx + 1) % items.length;
    nxt.innerHTML = items[nextIdx];
    nxt.classList.remove('exit-to-left','show');
    nxt.classList.add('enter-from-right');
    void nxt.offsetWidth;
    nxt.classList.add('show');
    cur.classList.add('exit-to-left');

    setTimeout(() => {
      cur.innerHTML = items[nextIdx];
      cur.classList.remove('exit-to-left');
      cur.classList.add('show');
      nxt.classList.remove('show','enter-from-right','exit-to-left');
      nxt.innerHTML = '';
      idx = nextIdx;
    }, animMs + 30);
  }

  setInterval(cycleOnce, displayMs);
})();

// =====================
// Logo modal
// =====================
(function initLogoModal() {
  const logoImg = $(".logo img");
  const logoModal = $("#logoModal");
  const logoModalImg = $("#logoModalImg");
  const close = $(".close-modal");

  if (!logoImg || !logoModal || !logoModalImg) return;

  logoImg.addEventListener("click", () => {
    logoModal.style.display = "block";
    logoModalImg.src = logoImg.src;
  });
  close?.addEventListener("click", () => logoModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === logoModal) logoModal.style.display = "none";
  });
})();

// =====================
// Twin cards modal
// =====================
(function initTwinModal() {
  const twinModal = $("#twinModal");
  if (!twinModal) return;

  const twinModalImg = $("#twinModalImg");
  const twinModalName = $("#twinModalName");
  const twinModalBio = $("#twinModalBio");
  const twinClose = twinModal.querySelector(".close-modal");

  // =====================
// Twin cards modal
// =====================
(function initTwinModal() {
  const twinModal = $("#twinModal");
  if (!twinModal) return;

  const twinModalImg = $("#twinModalImg");
  const twinModalName = $("#twinModalName");
  const twinModalBio = $("#twinModalBio");
  const twinClose = twinModal.querySelector(".close-modal");

  const twinProfiles = {
    aditya: {
      name: "Aditya Jain",
      img: "images/aditya.jpg",
      bio: `
        <p>I am Aditya Jain, a final-year B.Tech student in <strong>Computer Science and Design</strong>, passionate about exploring the intersection of <strong>software development, AI-ML, and design</strong>. Skilled in Python and front-end development, I am expanding my expertise in full-stack development, AI-ML, and game development, while integrating my interests in video editing, graphic design, and data analytics. I enjoy tackling challenges with logic and creativity, transforming ideas into impactful and user-friendly digital solutions.</p>

        <h4>Leadership Roles</h4>
        <ul>
          <li>Training & Placement Committee Member (2024–25)</li>
          <li>Placement Secretary (2023–24)</li>
          <li>House Captain (2020–21 & 2021–22)</li>
        </ul>

        <h4>Soft Skills</h4>
        <p>Leadership • Quick Learning • Communication • Teamwork • Problem-solving • Adaptability • Critical Thinking • Creativity</p>

        <h4>Strengths</h4>
        <p>Family • Dedication towards work • Patience • Politeness</p>

        <h4>Hobbies</h4>
        <p>Dancing • Singing • Drawing • Content Creating • Travelling</p>
      `
    },
    abhishek: {
      name: "Abhishek Jain",
      img: "images/abhishek.jpg",
      bio: `
        <p>I am Abhishek Jain, a final-year B.Tech student in <strong>Computer Science and Design</strong>, with a strong passion for blending <strong>software development, design, and AI-ML</strong>. Skilled in Python, Data Science, and front-end development, I am expanding my expertise as a Data Analyst and Python Engineer, while further exploring my interests in UI/UX design, web development, and artificial intelligence. My goal is to combine technical and creative skills to craft innovative and user-centric digital solutions.</p>

        <h4>Leadership Roles</h4>
        <ul>
          <li>Cultural Secretary (2023–24)</li>
          <li>House Captain (2020–21 & 2021–22)</li>
        </ul>

        <h4>Soft Skills</h4>
        <p>Leadership • Quick Learner • Critical Thinking • Communication • Teamwork • Problem-solving • Adaptability • Creativity</p>

        <h4>Strengths</h4>
        <p>Family • Confidence • Analytical skills • Good listener</p>

        <h4>Hobbies</h4>
        <p>Dancing • Singing • Drawing • Content Creating • Travelling</p>
      `
    }
  };

  function openProfile(profile) {
    if (!profile) return;
    twinModalImg.src = profile.img;
    twinModalName.textContent = profile.name;
    twinModalBio.innerHTML = profile.bio; // ✅ use HTML instead of textContent
    twinModal.style.display = "block";
  }

  $$(".twin-photo-block").forEach(block =>
    block.addEventListener("click", () => openProfile(twinProfiles[block.dataset.member]))
  );

  twinClose?.addEventListener("click", () => twinModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === twinModal) twinModal.style.display = "none";
  });

  const btnAditya = $("#btnAditya");
  const btnAbhishek = $("#btnAbhishek");
  [btnAditya, btnAbhishek].forEach(btn =>
    btn?.addEventListener("click", () => {
      openProfile(twinProfiles[btn.id.replace("btn", "").toLowerCase()]);
      [btnAditya, btnAbhishek].forEach(b => b?.classList.remove("active"));
      btn.classList.add("active");
    })
  );
})();

  function openProfile(profile) {
    if (!profile) return;
    twinModalImg.src = profile.img;
    twinModalName.textContent = profile.name;
    twinModalBio.textContent = profile.bio;
    twinModal.style.display = "block";
  }

  $$(".twin-photo-block").forEach(block =>
    block.addEventListener("click", () => openProfile(twinProfiles[block.dataset.member]))
  );

  twinClose?.addEventListener("click", () => twinModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === twinModal) twinModal.style.display = "none";
  });

  const btnAditya = $("#btnAditya");
  const btnAbhishek = $("#btnAbhishek");
  [btnAditya, btnAbhishek].forEach(btn =>
    btn?.addEventListener("click", () => {
      openProfile(twinProfiles[btn.id.replace("btn", "").toLowerCase()]);
      [btnAditya, btnAbhishek].forEach(b => b?.classList.remove("active"));
      btn.classList.add("active");
    })
  );
})();

// =====================
// Project Modals (simplified) - updated to ignore clicks right after intro
// =====================
(function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const modalImg = document.getElementById("projectModalImg");
  const modalTitle = document.getElementById("projectModalTitle");
  const modalText = document.getElementById("projectModalText");
  const closeBtn = modal.querySelector(".close-modal");

  const projectData = {
    chatbot: {
      title: "AI Chatbot — PGRKAM (SIH)",
      text: "An NLP-driven chatbot built during Smart India Hackathon for Punjab Ghar Ghar Rozgar portal. It helps job seekers and citizens get instant answers to queries, improves accessibility, and reduces human workload.",
      img: "images/chatbot.jpg"
    },
    games: {
      title: "Water Conservation Games",
      text: "The game aims to engage users by blending education with entertainment, creating an interactive learning experience that highlights the importance of groundwater, the challenges it faces, and effective strategies for its management. Through a series of missions, quizzes, and simulations, players will not only learn about groundwater systems but also be empowered to make informed decisions in virtual environments that mirror real-world scenarios.",
      img: "images/games.png"
    },
    gesture: {
      title: "Brightness Gesture Control",
      text: "A computer vision project using OpenCV and MediaPipe to measure finger distance and map it to brightness control. Users can increase or decrease brightness simply by moving their fingers apart or together.",
      img: "images/gesture.png"
    },
    beatboxify: {
      title: "Beatboxify — Music App",
      text: "A lightweight music player web app designed to test audio playback, playlists, and simple UX patterns. Includes basic play/pause, track switching, and responsive design.",
      img: "images/beatboxify.png"
    }
  };

  $$(".project").forEach(proj =>
    proj.addEventListener("click", (e) => {
      // Ignore accidental clicks that happen immediately after the intro finishes/closes.
      // This prevents "click-through" where a click used to close the intro hits an element underneath.
      if (window.__introLocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const data = projectData[proj.dataset.project];
      if (!data) return;
      modalTitle.textContent = data.title;
      modalText.textContent = data.text;
      modalImg.src = data.img;
      modal.style.display = "flex";
    })
  );

  closeBtn?.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
})();

// =====================
// Intro video splash - updated to use a short JS lock instead of toggling body pointer-events
// =====================
(function initIntroVideo() {
  const container = $("#introVideoContainer");
  const video = $("#introVideo");
  const overlay = $("#introOverlay");
  const exploreBtn = $("#exploreBtn");
  const skipBtn = $("#skipBtn");

  if (!container) return;

  // small guard flag to avoid click-throughs immediately after intro is closed
  window.__introLocked = false;

  function closeIntro() {
    // Lock interactions briefly to avoid accidental click-throughs
    window.__introLocked = true;

    container.style.opacity = "0";
    // hide after the fade
    setTimeout(() => {
      container.style.display = "none";
      // release the lock shortly after the element is hidden
      // keep a tiny buffer so no stray event slips through
      setTimeout(() => { window.__introLocked = false; }, 40);
    }, 650);
  }

  video?.addEventListener("ended", () => overlay?.classList.add("show"));

  exploreBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // extra safety to stop any other click handlers from running
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    closeIntro();
  });
  skipBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    closeIntro();
  });
})();
