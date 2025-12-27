// ENHANCED: Advanced JavaScript with modern features and animations

// ENHANCED: Global configuration and state management
const CONFIG = {
  TYPING_SPEED: 100,
  DELETING_SPEED: 50,
  DELAY_BETWEEN_ROLES: 1200,
  SCROLL_THRESHOLD: 100,
  ANIMATION_DURATION: 300,
  PARTICLE_COUNT: 80,
  roles: ["a Web Developer", "a Software Developer", "a Mathie", "a Problem Solver", "an Innovator"]
};

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

  // ENHANCED: Initialize all functionality
  init() {
    this.setupEventListeners();
    this.initializeLoadingScreen();
    this.initializeParticles();
    this.initializeAOS();
    this.setupSmoothScrolling();
    this.setupNavigationHighlight();
    this.setupSkillFilters();
    this.setupFormValidation();
    this.setupCursorFollower();
    this.startTypingAnimation();
  }

  // ENHANCED: Loading screen with progress animation
  initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    // Simulate loading progress
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
          
          // Start other animations after loading
          this.animateOnScroll();
        }, 500);
      }
      
      progressBar.style.width = progress + '%';
    }, 150);
  }

  // ENHANCED: Particles.js configuration
  initializeParticles() {
    if (typeof particlesJS !== 'undefined' && CONFIG.PARTICLE_COUNT > 0) {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: CONFIG.PARTICLE_COUNT,
            density: { enable: true, value_area: 800 }
          },
          color: { value: '#2563eb' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000000' }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#2563eb',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }
  }

  // ENHANCED: Initialize AOS (Animate On Scroll)
  initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 50,
        delay: 100
      });
    }
  }

  // ENHANCED: Setup all event listeners
  setupEventListeners() {
    // Scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Navigation events
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMobileMenu();
      this.setupScrollToTop();
      const portfolio = new PortfolioManager();
    });
    
    // Form events
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    
    // Resize events
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Mouse events for cursor follower
    document.addEventListener('mousemove', this.updateCursorFollower.bind(this));
  }

  // ENHANCED: Advanced typing animation
  startTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const typeText = () => {
      const currentRole = CONFIG.roles[this.currentRoleIndex];
      
      if (!this.isDeleting && this.currentCharIndex <= currentRole.length) {
        // Typing
        const currentText = currentRole.substring(0, this.currentCharIndex++);
        typingElement.textContent = "I am " + currentText;
        setTimeout(typeText, CONFIG.TYPING_SPEED + Math.random() * 50);
      } else if (this.isDeleting && this.currentCharIndex >= 0) {
        // Deleting
        const currentText = currentRole.substring(0, this.currentCharIndex--);
        typingElement.textContent = "I am " + currentText;
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

  // ENHANCED: Advanced scroll handling
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update scroll progress
    this.updateScrollProgress(scrollTop);
    
    // Update navbar appearance
    this.updateNavbar(scrollTop);
    
    // Show/hide scroll to top button
    this.updateScrollToTop(scrollTop);
    
    // Animate elements on scroll
    if (!this.isLoading) {
      this.animateOnScroll();
    }
    
    // Update active navigation link
    this.updateActiveNavigation();
  }

  // ENHANCED: Scroll progress indicator
  updateScrollProgress(scrollTop) {
    const scrollProgress = document.querySelector('.scroll-progress');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = Math.min(progress, 100) + '%';
    }
  }

  // ENHANCED: Dynamic navbar styling
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

  // ENHANCED: Scroll to top button
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

  // ENHANCED: Smooth scrolling setup
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }

  // ENHANCED: Navigation highlighting
  setupNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  // ENHANCED: Mobile menu functionality
  setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links-enhanced');
    
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
      });
      
      // Close menu when clicking on a link
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

  // ENHANCED: Skill filtering system
  setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.skill-filter');
    const skillCards = document.querySelectorAll('.skill-card-enhanced');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter skills
        skillCards.forEach(card => {
          const cardCategory = card.dataset.category;
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ENHANCED: Scroll to top functionality
  setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ENHANCED: Animate elements on scroll
  animateOnScroll() {
    // Animate stats counter
    this.animateStats();
    
    // Animate skill proficiency bars
    this.animateSkillBars();
    
    // Add glow effect to project cards
    this.addProjectGlow();
  }

  // ENHANCED: Stats counter animation
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

  // ENHANCED: Skill bar animation
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

  // ENHANCED: Project cards glow effect
  addProjectGlow() {
    const projectCards = document.querySelectorAll('.project-card-enhanced');
    
    projectCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      
      if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
        card.style.boxShadow = '0 10px 30px rgba(0, 210, 255, 0.2)';
      }
    });
  }

  // ENHANCED: Form validation and submission
  setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styles
    this.clearErrors(field);
    
    if (!value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (fieldType === 'email' && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    } else if (field.name === 'name' && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters';
    } else if (field.name === 'message' && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters';
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }
    
    return isValid;
  }

  clearErrors(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
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

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ENHANCED: Form submission handler
  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-send-message');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      this.showSuccessModal();
      form.reset();
      
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      
      // Clear all errors
      inputs.forEach(input => this.clearErrors(input));
    }, 2000);
  }

  // ENHANCED: Success modal
  showSuccessModal() {
    const modal = document.getElementById('message-modal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  // ENHANCED: Notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      background: ${type === 'error' ? '#ff6b6b' : '#4ade80'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // ENHANCED: Cursor follower
  setupCursorFollower() {
    const cursor = document.getElementById('cursor-follower');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(updateCursor);
    };
    
    updateCursor();
  }

  updateCursorFollower(e) {
    const cursor = document.getElementById('cursor-follower');
    if (cursor) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  }

  // ENHANCED: Active navigation update
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

  // ENHANCED: Handle window resize
  handleResize() {
    // Reinitialize particles on resize
    if (typeof particlesJS !== 'undefined') {
      this.initializeParticles();
    }
    
    // Update AOS on resize
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }
}

// ENHANCED: Utility functions
const Utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Smooth animation helper
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

// ENHANCED: Modal closing function (global)
function closeModal() {
  const modal = document.getElementById('message-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// ENHANCED: Intersection Observer for performance optimization
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// ENHANCED: Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main portfolio manager
  const portfolio = new PortfolioManager();

  // ===== Theme Toggle (pill) =====
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  const key = "theme";

  if (btn && icon && label) {
    const saved = localStorage.getItem(key);
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const startDark = saved ? saved === "dark" : prefersDark;
    setTheme(startDark);

    btn.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark");
      setTheme(isDark);
      localStorage.setItem(key, isDark ? "dark" : "light");
    });

    function setTheme(isDark) {
      document.body.classList.toggle("dark", isDark);
      label.textContent = isDark ? "dark" : "light";
      icon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
      btn.setAttribute("aria-pressed", String(isDark));
    }
  }

  // Setup initial styles and fade-in animations for elements
  document.querySelectorAll('.skill-card-enhanced, .project-card-enhanced, .timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(item);
  });

  // ENHANCED: Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu and modals
    if (e.key === 'Escape') {
      portfolio.closeMobileMenu();
      closeModal();
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remove keyboard navigation class on mouse click
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // ENHANCED: Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Portfolio loaded in ${loadTime}ms`);
    });
  }
  
  // ENHANCED: Service Worker registration (if available)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker not available, continue without it
    });
  }
});

// ENHANCED: Global error handling
window.addEventListener('error', (e) => {
  console.error('Portfolio Error:', e.error);
  // Could send error reports to analytics service
});

// ENHANCED: Performance optimization - lazy load images
document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// ENHANCED: Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioManager, Utils };
}