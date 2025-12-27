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