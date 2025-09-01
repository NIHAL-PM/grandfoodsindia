/**
 * Home Page Timeline Animations
 * Enhanced beautiful scroll-triggered animations for the journey section
 */

// Add JS enabled class
document.documentElement.classList.add('js-enabled');

// Enhanced animations and interactions for Grand Foods India
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Initializing Grand Foods India animations...');
  
  // Initialize video handling
  initVideoHandling();
  
  // Initialize animations after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeAnimations();
  }, 500);
});

function initVideoHandling() {
  const video = document.querySelector('.hero-video');
  const fallback = document.querySelector('.hero-fallback');
  
  if (video && fallback) {
    console.log('🎬 Setting up video handling...');
    
    video.addEventListener('loadeddata', function() {
      console.log('✅ Video loaded successfully');
      video.style.opacity = '1';
      fallback.style.opacity = '0';
      video.play().catch(() => {
        console.log('🔇 Video autoplay prevented, showing fallback');
        video.style.display = 'none';
        fallback.style.opacity = '1';
      });
    });
    
    video.addEventListener('error', function() {
      console.log('❌ Video failed to load, showing fallback');
      video.style.display = 'none';
      fallback.style.opacity = '1';
    });
    
    // Set initial state
    video.style.opacity = '0';
    fallback.style.opacity = '1';
  }
}

function initializeAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.log('⚠️ GSAP not available, using CSS fallback animations');
    initializeFallbackAnimations();
    return;
  }
  
  console.log('🎨 Initializing GSAP animations...');
  
  try {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Section title animations
    gsap.utils.toArray('[data-animate]').forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    
    // Timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.getElementById('timelineLine');
    
    if (timelineItems.length > 0) {
      console.log(`🗓️ Animating ${timelineItems.length} timeline items...`);
      
      // Animate timeline line if it exists
      if (timelineLine) {
        gsap.fromTo(timelineLine, 
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".timeline-modern",
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1
            }
          }
        );
      }
      
      // Animate timeline items
      timelineItems.forEach((item, index) => {
        const isEven = index % 2 === 0;
        
        gsap.fromTo(item,
          { 
            opacity: 0, 
            x: isEven ? -50 : 50,
            y: 30
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }
    
    // Hero title animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      gsap.fromTo(heroTitle,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          delay: 0.5
        }
      );
    }
    
    // Hero subtitle animation
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      gsap.fromTo(heroSub,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power2.out",
          delay: 0.8
        }
      );
    }
    
    // Hero CTAs animation
    const heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas) {
      gsap.fromTo(heroCtas,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power2.out",
          delay: 1.1
        }
      );
    }
    
    console.log('✅ GSAP animations initialized successfully');
    
  } catch (error) {
    console.warn('⚠️ GSAP animation error, falling back to CSS:', error);
    initializeFallbackAnimations();
  }
}

function initializeFallbackAnimations() {
  console.log('🎨 Initializing CSS fallback animations...');
  
  // Add CSS animations for elements
  const animateElements = document.querySelectorAll('[data-animate], .timeline-item, .hero-title, .hero-sub, .hero-ctas');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animateElements.forEach(el => {
    // Set initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    observer.observe(el);
  });
  
  // Animate hero elements with delays
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }
  }, 500);
  
  setTimeout(() => {
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      heroSub.style.opacity = '1';
      heroSub.style.transform = 'translateY(0)';
    }
  }, 800);
  
  setTimeout(() => {
    const heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas) {
      heroCtas.style.opacity = '1';
      heroCtas.style.transform = 'translateY(0)';
    }
  }, 1100);
  
  console.log('✅ CSS fallback animations initialized');
}

// Enhanced Timeline Interactions
function initTimelineInteractions() {
  const timelineMarkers = document.querySelectorAll('.timeline-marker');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineMarkers.forEach((marker, index) => {
    const item = timelineItems[index];
    
    // Add hover interactions
    marker.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(marker, {
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (item) {
          gsap.to(item.querySelector('.timeline-content'), {
            boxShadow: "0 20px 60px rgba(0,194,199,0.3)",
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });
    
    marker.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(marker, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (item) {
          gsap.to(item.querySelector('.timeline-content'), {
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });
    
    // Add click interactions for timeline navigation
    marker.addEventListener('click', () => {
      const targetItem = timelineItems[index];
      if (targetItem) {
        targetItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Highlight effect
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetItem.querySelector('.timeline-content'), 
            { scale: 1 },
            { 
              scale: 1.05,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut"
            }
          );
        }
      }
    });
  });
  
  // Initialize counter animations for stats
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const finalValue = parseInt(stat.dataset.value || stat.textContent);
          animateCounter(stat, finalValue);
          observer.unobserve(stat);
        }
      });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
  }
}

function animateCounter(element, finalValue) {
  let currentValue = 0;
  const increment = finalValue / 60; // 60 frames for smooth animation
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= finalValue) {
      element.textContent = finalValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.round(currentValue);
    }
  }, 16); // ~60fps
}

// Initialize timeline interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTimelineInteractions();
});