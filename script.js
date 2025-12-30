// Global configuration
const CONFIG = {
  TYPING_SPEED: 100,
  DELETING_SPEED: 50,
  DELAY_BETWEEN_ROLES: 1200,
  SCROLL_THRESHOLD: 100,
  ANIMATION_DURATION: 300,
  PARTICLE_COUNT: 80,
  roles: ["a Web Developer", "a Software Developer", "a Mathie", "a Problem Solver", "an Innovator"]
};

// =========================
// THEME TOGGLE - MUST RUN IMMEDIATELY
// =========================
(function initTheme() {
  // Run as soon as possible to prevent flash
  const STORAGE_KEY = "portfolio-theme";
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
  
  // Apply theme immediately
  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }
})();

// Setup theme toggle button when DOM is ready
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  const STORAGE_KEY = "portfolio-theme";

  if (!btn || !icon || !label) {
    console.error("Theme toggle elements not found! Check your HTML.");
    return;
  }

  console.log("Theme toggle button found and initializing...");

  // Check current theme
  const isDark = document.body.classList.contains("dark");
  updateThemeUI(isDark);

  // Add click event
  btn.addEventListener("click", function() {
    console.log("Theme button clicked!");
    const currentlyDark = document.body.classList.contains("dark");
    const newTheme = !currentlyDark;
    
    // Toggle dark class
    if (newTheme) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    
    // Update UI
    updateThemeUI(newTheme);
    
    // Save preference
    localStorage.setItem(STORAGE_KEY, newTheme ? "dark" : "light");
    
    console.log("Theme changed to:", newTheme ? "dark" : "light");
  });

  function updateThemeUI(isDark) {
    if (isDark) {
      icon.className = "fa-solid fa-moon";
      label.textContent = "dark";
      btn.setAttribute("aria-pressed", "true");
    } else {
      icon.className = "fa-solid fa-sun";
      label.textContent = "light";
      btn.setAttribute("aria-pressed", "false");
    }
  }
}

class PortfolioManager {
  constructor() {
    this.isLoading = true;
    this.currentRoleIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.statsAnimated = false;
    this.skillsAnimated = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeLoadingScreen();
    this.initializeParticles();
    this.initializeAOS();
    this.setupSmoothScrolling();
    this.setupNavigationHighlight();
    this.setupSkillFilters();
    this.setupFormValidation();
    this.startTypingAnimation();
  }

  initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          document.body.style.overflow = 'auto';
          this.isLoading = false;
          this.animateOnScroll();
        }, 500);
      }
      
      if (progressBar) progressBar.style.width = progress + '%';
    }, 150);
  }

  initializeParticles() {
    if (typeof particlesJS !== 'undefined' && CONFIG.PARTICLE_COUNT > 0) {
      particlesJS('particles-js', {
        particles: {
          number: { value: CONFIG.PARTICLE_COUNT, density: { enable: true, value_area: 800 } },
          color: { value: '#2563eb' },
          shape: { type: 'circle' },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#2563eb', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    }
  }

  initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 1000, easing: 'ease-in-out-cubic', once: true, offset: 50, delay: 100 });
    }
  }

  setupEventListeners() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
  }

  startTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const typeText = () => {
      const currentRole = CONFIG.roles[this.currentRoleIndex];
      
      if (!this.isDeleting && this.currentCharIndex <= currentRole.length) {
        typingElement.textContent = "I am " + currentRole.substring(0, this.currentCharIndex++);
        setTimeout(typeText, CONFIG.TYPING_SPEED + Math.random() * 50);
      } else if (this.isDeleting && this.currentCharIndex >= 0) {
        typingElement.textContent = "I am " + currentRole.substring(0, this.currentCharIndex--);
        setTimeout(typeText, CONFIG.DELETING_SPEED);
      } else {
        if (!this.isDeleting) {
          this.isDeleting = true;
          setTimeout(typeText, CONFIG.DELAY_BETWEEN_ROLES);
        } else {
          this.isDeleting = false;
          this.currentRoleIndex = (this.currentRoleIndex + 1) % CONFIG.roles.length;
          setTimeout(typeText, CONFIG.TYPING_SPEED);
        }
      }
    };

    typeText();
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.updateScrollProgress(scrollTop);
    this.updateNavbar(scrollTop);
    this.updateScrollToTop(scrollTop);
    
    if (!this.isLoading) {
      this.animateOnScroll();
    }
    
    this.updateActiveNavigation();
  }

  updateScrollProgress(scrollTop) {
    const scrollProgress = document.querySelector('.scroll-progress');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = Math.min(progress, 100) + '%';
  }

  updateNavbar(scrollTop) {
    const navbar = document.querySelector('.navbar-enhanced');
    if (navbar) {
      if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  updateScrollToTop(scrollTop) {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
      if (scrollTop > CONFIG.SCROLL_THRESHOLD * 3) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          this.closeMobileMenu();
        }
      });
    });
  }

  setupNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' });
    
    sections.forEach(section => observer.observe(section));
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links-enhanced');
    
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
      });
      
      navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          this.closeMobileMenu();
        }
      });
    }
  }

  closeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links-enhanced');
    
    if (menuToggle && navLinks) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.skill-filter');
    const skillCards = document.querySelectorAll('.skill-card-enhanced');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        skillCards.forEach(card => {
          const cardCategory = card.dataset.category;
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  animateOnScroll() {
    this.animateStats();
    this.animateSkillBars();
  }

  animateStats() {
    if (this.statsAnimated) return;
    
    const statsSection = document.querySelector('.stats-container');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight - 100) {
      const statNumbers = document.querySelectorAll('.stat-number');
      
      statNumbers.forEach(stat => {
        const finalCount = parseInt(stat.dataset.count);
        let currentCount = 0;
        const increment = finalCount / 50;
        
        const counter = setInterval(() => {
          currentCount += increment;
          if (currentCount >= finalCount) {
            currentCount = finalCount;
            clearInterval(counter);
          }
          stat.textContent = Math.floor(currentCount);
        }, 40);
      });
      
      this.statsAnimated = true;
    }
  }

  animateSkillBars() {
    if (this.skillsAnimated) return;
    
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const rect = skillsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight - 100) {
      const proficiencyBars = document.querySelectorAll('.proficiency-fill');
      
      proficiencyBars.forEach((bar, index) => {
        setTimeout(() => {
          const proficiency = bar.dataset.proficiency;
          bar.style.width = proficiency + '%';
        }, index * 200);
      });
      
      this.skillsAnimated = true;
    }
  }

  setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    this.clearErrors(field);
    
    if (!value) {
      this.showFieldError(field, 'This field is required');
      return false;
    }
    return true;
  }

  clearErrors(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
  }

  showFieldError(field, message) {
    field.style.borderColor = '#ff6b6b';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const modal = document.getElementById('message-modal');
    if (modal) {
      modal.classList.add('show');
      e.target.reset();
    }
  }

  updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  handleResize() {
    if (typeof particlesJS !== 'undefined') {
      this.initializeParticles();
    }
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }
}

function closeModal() {
  const modal = document.getElementById('message-modal');
  if (modal) modal.classList.remove('show');
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initializing portfolio...");
  
  // Setup theme toggle FIRST
  setupThemeToggle();
  
  // Initialize portfolio manager
  const portfolio = new PortfolioManager();
  portfolio.setupMobileMenu();
  portfolio.setupScrollToTop();
  
  // Setup fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.skill-card-enhanced, .project-card-enhanced, .timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      portfolio.closeMobileMenu();
      closeModal();
    }
  });
});

// =========================
// ADVANCED MOUSE TRACKING & 3D EFFECTS
// Add this code to the END of your script.js file
// =========================

// 3D Tilt Effect for Cards
function init3DTiltEffect() {
  const cards = document.querySelectorAll('.skill-card-enhanced, .project-card-enhanced, .timeline-content, .resume-preview');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });
  
  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.05, 1.05, 1.05)
      translateZ(20px)
    `;
  }
  
  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }
}

// Parallax Effect on Mouse Move
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.hero-content, .section-header, .about-left, .about-right');
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseX - 0.5) * speed * 20;
      const y = (mouseY - 0.5) * speed * 20;
      
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Magnetic Button Effect
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.btn-hero, .btn-resume, .social-float, .theme-pill');
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 50;
      
      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = x * strength * 0.3;
        const moveY = y * strength * 0.3;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      }
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}

// Floating Cursor Effect
function initFloatingCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dotX = e.clientX;
    dotY = e.clientY;
  });
  
  function animateCursor() {
    // Smooth follow for main cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Instant follow for dot
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Cursor expand on hover
  const hoverElements = document.querySelectorAll('a, button, .skill-card-enhanced, .project-card-enhanced');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.borderColor = '#2563eb';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'rgba(37, 99, 235, 0.5)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// Smooth Scroll with Inertia
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let start = null;
        
        function animation(currentTime) {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutCubic(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        }
        
        requestAnimationFrame(animation);
      }
    });
  });
}

// Background Gradient Following Mouse
function initBackgroundGradient() {
  const hero = document.querySelector('.hero-container');
  
  if (hero) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      hero.style.background = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(37, 99, 235, 0.08) 0%,
          rgba(37, 99, 235, 0.04) 25%,
          transparent 50%
        ),
        var(--bg-primary)
      `;
    });
  }
}

// Ripple Effect on Click
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn-hero, .btn-resume, .btn-more-projects, .btn-send-message');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Scroll-Based Parallax for Sections
function initScrollParallax() {
  const parallaxSections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxSections.forEach((section, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed * 0.1);
      section.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Initialize all effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing floating and flow effects...');
  
  // Add small delay to ensure elements are rendered
  setTimeout(() => {
    init3DTiltEffect();
    initParallaxEffect();
    initMagneticButtons();
    initFloatingCursor();
    initSmoothScroll();
    initBackgroundGradient();
    initRippleEffect();
    initScrollParallax();
    
    console.log('Floating effects initialized!');
  }, 500);
});

// Add CSS for custom cursor and ripple effect
const customStyles = document.createElement('style');
customStyles.textContent = `
  /* Custom Cursor */
  .custom-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(37, 99, 235, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, border-color 0.2s ease;
    mix-blend-mode: difference;
  }
  
  .custom-cursor-dot {
    position: fixed;
    width: 6px;
    height: 6px;
    background: #0d2455ff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease;
  }
  
  body.dark .custom-cursor {
    border-color: rgba(10, 86, 178, 0.5);
  }
  
  body.dark .custom-cursor-dot {
    background: #2c5382ff;
  }
  
  /* Hide custom cursor on mobile */
  @media (max-width: 768px) {
    .custom-cursor,
    .custom-cursor-dot {
      display: none;
    }
  }
  
  /* Ripple Effect */
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(240, 214, 214, 0.6);
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  }
   
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  /* Smooth transitions for all interactive elements */
  .btn-hero,
  .btn-resume,
  .social-float,
  .theme-pill {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease;
  }
  
  /* Hide default cursor on desktop */
  @media (min-width: 769px) {
    * {
      cursor: none !important;
    }
    
    a, button, input, textarea {
      cursor: none !important;
    }
  }
`;
document.head.appendChild(customStyles);