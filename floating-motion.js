// ============================================
// SMOOTH FLOATING EFFECT 
// Save this as: floating-motion.js
// ============================================

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Mouse follow settings
    mouseFollowStrength: 0.03,      // How much elements follow mouse (lower = smoother)
    mouseFollowDistance: 100,        // Max distance elements can move
    
    // Floating animation settings
    floatAmplitude: 20,              // How far elements float up/down
    floatSpeed: 0.001,               // Speed of floating animation
    
    // Tilt settings
    tiltStrength: 5,                 // Degrees of tilt on hover
    
    // Smooth transitions
    transitionSpeed: 0.08,           // Smoothness of all movements
  };

  // Store mouse position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  // Track all animated elements
  const animatedElements = new Map();

  // ============================================
  // Initialize Floating Elements
  // ============================================
  function initFloatingElements() {
    // Select all elements that should float
    const selectors = [
      '.skill-card-enhanced',
      '.project-card-enhanced',
      '.timeline-content',
      '.stat-item',
      '.interest-item',
      '.contact-method',
      '.resume-preview',
      '.about-left',
      '.about-right',
      '.profile-pic-enhanced',
      '.hero-content',
      '.section-header',
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (!animatedElements.has(element)) {
          animatedElements.set(element, {
            // Current position
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            
            // Target position (where it wants to go)
            targetX: 0,
            targetY: 0,
            targetRotation: 0,
            targetScale: 1,
            
            // Floating animation offset
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: CONFIG.floatSpeed * (0.8 + Math.random() * 0.4),
            floatAmplitude: CONFIG.floatAmplitude * (0.5 + Math.random() * 0.5),
            
            // Mouse follow settings
            followStrength: CONFIG.mouseFollowStrength * (0.5 + Math.random() * 0.5),
            
            // Original position
            originalRect: element.getBoundingClientRect(),
            
            // Hover state indicator for tilt effect
            isHovered: false,
          });

          // Set initial styles
          element.style.transition = 'none';
          element.style.willChange = 'transform';
          
          // Add hover listeners
          element.addEventListener('mouseenter', () => {
            const data = animatedElements.get(element);
            data.isHovered = true;
            data.targetScale = 1.05;
          });
          
          element.addEventListener('mouseleave', () => {
            const data = animatedElements.get(element);
            data.isHovered = false;
            data.targetScale = 1;
            data.targetRotation = 0;
          });

          element.addEventListener('mousemove', (e) => {
            const data = animatedElements.get(element);
            if (data.isHovered) {
              const rect = element.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              
              const deltaX = (e.clientX - centerX) / rect.width;
              const deltaY = (e.clientY - centerY) / rect.height;
              
              data.targetRotation = deltaX * CONFIG.tiltStrength;
            }
          });
        }
      });
    });
  }

  // ============================================
  // Smooth Mouse Tracking
  // ============================================
  function updateMousePosition(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }

  // ============================================
  // Calculate Floating Position
  // ============================================
  function calculateFloatingPosition(element, data, time) {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    // Calculate distance from mouse
    const distanceX = mouseX - elementCenterX;
    const distanceY = mouseY - elementCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Mouse follow effect (inverse - elements move away slightly from mouse)
    const maxDistance = CONFIG.mouseFollowDistance;
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(distanceY, distanceX);
      
      data.targetX = -Math.cos(angle) * strength * 20 * data.followStrength;
      data.targetY = -Math.sin(angle) * strength * 20 * data.followStrength;
    } else {
      data.targetX = 0;
      data.targetY = 0;
    }

    // Add floating animation
    const floatY = Math.sin(time * data.floatSpeed + data.floatOffset) * data.floatAmplitude;
    data.targetY += floatY;

    // Smooth interpolation
    data.x += (data.targetX - data.x) * CONFIG.transitionSpeed;
    data.y += (data.targetY - data.y) * CONFIG.transitionSpeed;
    data.rotation += (data.targetRotation - data.rotation) * CONFIG.transitionSpeed;
    data.scale += (data.targetScale - data.scale) * CONFIG.transitionSpeed;
  }

  // ============================================
  // Apply Transform to Element
  // ============================================
  function applyTransform(element, data) {
    const transform = `
      translate3d(${data.x}px, ${data.y}px, 0)
      rotateY(${data.rotation}deg)
      scale(${data.scale})
    `;
    
    element.style.transform = transform;
  }

  // ============================================
  // Main Animation Loop
  // ============================================
  let lastTime = 0;
  function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Smooth mouse position
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    // Update all animated elements
    animatedElements.forEach((data, element) => {
      // Check if element is still in viewport
      const rect = element.getBoundingClientRect();
      const isVisible = (
        rect.top < window.innerHeight + 100 &&
        rect.bottom > -100
      );

      if (isVisible) {
        calculateFloatingPosition(element, data, currentTime);
        applyTransform(element, data);
      }
    });

    requestAnimationFrame(animate);
  }

  // ============================================
  // Parallax Background Effect 
  // ============================================
  function initParallaxBackground() {
    const hero = document.querySelector('.hero-container');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      // Hero parallax
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      // Section parallax
      sections.forEach((section, index) => {
        const speed = 0.3 + (index * 0.05);
        const yPos = -(scrolled * speed * 0.05);
        section.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // ============================================
  // Smooth Page Transitions
  // ============================================
  function initSmoothTransitions() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const targetPosition = target.offsetTop - 80;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 1000;
          let start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            
            // Easing function (ease-in-out)
            const ease = percent < 0.5
              ? 4 * percent * percent * percent
              : 1 - Math.pow(-2 * percent + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < duration) {
              requestAnimationFrame(step);
            }
          }

          requestAnimationFrame(step);
        }
      });
    });
  }

  // ============================================
  // Handle Window Resize 
  // ============================================
  function handleResize() {
    // Update original positions on resize
    animatedElements.forEach((data, element) => {
      data.originalRect = element.getBoundingClientRect();
    });
  }

  // ============================================
  // Initialize Everything
  // ============================================
  function init() {
    console.log('🌊 Initializing smooth floating effects...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Small delay to ensure elements are rendered
    setTimeout(() => {
      // Initialize all features
      initFloatingElements();
      initParallaxBackground();
      initSmoothTransitions();

      // Start animation loop
      requestAnimationFrame(animate);

      // Event listeners
      document.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('resize', handleResize);

      console.log('✨ Smooth floating effects active!');
      console.log(`📊 Animating ${animatedElements.size} elements`);
    }, 300);
  }

  // Start initialization
  init();

  // Re-initialize when new elements are added (for dynamic content)
  const observer = new MutationObserver(() => {
    initFloatingElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Disable on mobile for performance
  if (window.innerWidth <= 768) {
    console.log('📱 Mobile detected - reducing animations');
    CONFIG.mouseFollowStrength = 0.01;
    CONFIG.floatAmplitude = 10;
  }

})();