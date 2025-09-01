// Animated counter effect for about-stats
function animateCounters() {
  const counters = document.querySelectorAll('.about-stats .stat-number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    let isK = false;
    let displayTarget = target;
    if (counter.textContent.includes('K')) {
      isK = true;
      displayTarget = target / 1000;
    }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let value = Math.floor(progress * (target - start) + start);
      if (isK) {
        value = (progress * (target - start) + start) / 1000;
        counter.textContent = value.toFixed(1) + 'K';
      } else {
        counter.textContent = value;
      }
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = isK ? displayTarget.toFixed(1) + 'K' : target;
      }
    }
    requestAnimationFrame(update);
  });
}

// Trigger counter animation when about-stats enters viewport
document.addEventListener('DOMContentLoaded', function() {
  const stats = document.querySelector('.about-stats');
  let animated = false;
  if (!stats) return;
  function onScroll() {
    const rect = stats.getBoundingClientRect();
    if (!animated && rect.top < window.innerHeight - 80) {
      animateCounters();
      animated = true;
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
});
// Ensure stats are always visible even if animation fails or is blocked
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.stat-item, .stat-number').forEach(function(el) {
    el.style.opacity = '';
    el.style.transform = '';
  });
});
/* About page micro animations */
(function(){
  if(!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Create and position timeline line dynamically
  function createTimelineLine() {
    const timeline = document.querySelector('.timeline-modern');
    if (!timeline) return;
    
    // Remove existing timeline line if present
    const existingLine = timeline.querySelector('.timeline-line');
    if (existingLine) {
      existingLine.remove();
    }
    
    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length < 2) return;
    
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    
    // Get the markers within the items
    const firstMarker = firstItem.querySelector('.timeline-marker');
    const lastMarker = lastItem.querySelector('.timeline-marker');
    
    if (!firstMarker || !lastMarker) return;
    
    // Calculate positions
    const timelineRect = timeline.getBoundingClientRect();
    const firstMarkerRect = firstMarker.getBoundingClientRect();
    const lastMarkerRect = lastMarker.getBoundingClientRect();
    
    // Calculate relative positions with marker center
    const firstMarkerCenter = (firstMarkerRect.top - timelineRect.top) + (firstMarkerRect.height / 2);
    const lastMarkerCenter = (lastMarkerRect.top - timelineRect.top) + (lastMarkerRect.height / 2);
    
    // Create timeline line element
    const timelineLine = document.createElement('div');
    timelineLine.className = 'timeline-line';
    
    // Position the line from first marker center to last marker center
    timelineLine.style.position = 'absolute';
    timelineLine.style.top = firstMarkerCenter + 'px';
    timelineLine.style.height = (lastMarkerCenter - firstMarkerCenter) + 'px';
    
    // Insert the line into the timeline
    timeline.appendChild(timelineLine);
  }

  // Animated counter for stats
  function animateCounters(){
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const obj = {value: 0};
      
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function(){
          if(target >= 1000){
            counter.textContent = (obj.value / 1000).toFixed(1) + 'K';
          } else {
            counter.textContent = Math.round(obj.value);
          }
        },
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%',
          once: true
        }
      });
    });
  }

  // Hero section entrance
  gsap.timeline()
    .from('.about-hero-title', {opacity: 0, y: 30, duration: 0.8, ease: 'power2.out'})
    .from('.about-hero-subtitle', {opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'}, '-=0.4')
    .from('.about-stats .stat-item', {opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out'}, '-=0.3');

  // Story section animations
  gsap.from('.story-content', {
    opacity: 0, 
    x: -30, 
    duration: 0.8, 
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-story',
      start: 'top 70%'
    }
  });

  gsap.from('.story-visual .story-card', {
    opacity: 0, 
    y: 30, 
    duration: 0.6, 
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.story-visual',
      start: 'top 75%'
    }
  });

  // Timeline animations
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%'
      }
    });
  });

  // Leadership cards stagger animation
  gsap.from('.leader-card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.leadership-grid',
      start: 'top 75%'
    }
  });

  // CTA section animation
  gsap.from('.cta-content > *', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-cta',
      start: 'top 80%'
    }
  });

  // Initialize counter animations
  animateCounters();
  
  // Timeline line creation disabled - using CSS approach
})();

// Fallback timeline line creation without GSAP
document.addEventListener('DOMContentLoaded', function() {
  // Add data-year attributes to markers if they don't exist
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const marker = item.querySelector('.timeline-marker');
    const year = item.getAttribute('data-year');
    if (marker && year) {
      marker.setAttribute('data-year', year);
    }
  });
  
  // If GSAP is not available, create timeline line without animations
  if (!window.gsap) {
    setTimeout(function() {
      createSimpleTimelineLine();
    }, 100);
  }
});

// Simple timeline line creation for non-GSAP fallback
function createSimpleTimelineLine() {
  const timeline = document.querySelector('.timeline-modern');
  if (!timeline) return;
  
  // Remove existing timeline line if present
  const existingLine = timeline.querySelector('.timeline-line');
  if (existingLine) {
    existingLine.remove();
  }
  
  const markers = timeline.querySelectorAll('.timeline-marker');
  if (markers.length < 2) return;
  
  const firstMarker = markers[0];
  const lastMarker = markers[markers.length - 1];
  
  // Get positions relative to timeline container
  const timelineRect = timeline.getBoundingClientRect();
  const firstMarkerRect = firstMarker.getBoundingClientRect();
  const lastMarkerRect = lastMarker.getBoundingClientRect();
  
  // Calculate relative positions
  const firstMarkerTop = firstMarkerRect.top - timelineRect.top + window.scrollY + firstMarkerRect.height / 2;
  const lastMarkerTop = lastMarkerRect.top - timelineRect.top + window.scrollY + lastMarkerRect.height / 2;
  
  // Create timeline line element
  const timelineLine = document.createElement('div');
  timelineLine.className = 'timeline-line';
  
  // Position the line from first marker center to last marker center
  timelineLine.style.position = 'absolute';
  timelineLine.style.top = (firstMarkerTop - window.scrollY) + 'px';
  timelineLine.style.height = (lastMarkerTop - firstMarkerTop) + 'px';
  
  // Insert the line into the timeline
  timeline.style.position = 'relative';
  timeline.appendChild(timelineLine);
}
