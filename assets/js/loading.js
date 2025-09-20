/**
 * Loading Screen Controller - Fixed Version
 * Professional implementation with better error handling
 */

class LoadingScreen {
  constructor() {
    this.loadingElement = null;
    this.minLoadingTime = 3000; // Minimum 3 seconds
    this.maxLoadingTime = 6000; // Maximum 6 seconds
    this.startTime = performance.now();
    this.isComplete = false;
    this.resourcesLoaded = false;
    
    this.init();
  }
  
  init() {
    try {
      // Create loading screen element
      this.createLoadingScreen();
      
      // Start loading process
      this.startLoading();
      
      // Handle page load completion
      if (document.readyState === 'complete') {
        this.resourcesLoaded = true;
        this.checkCompletion();
      } else {
        window.addEventListener('load', () => {
          this.resourcesLoaded = true;
          this.checkCompletion();
        });
      }
      
      // Fallback timeout
      setTimeout(() => {
        if (!this.isComplete) {
          console.log('⏰ Loading timeout reached, completing...');
          this.completeLoading();
        }
      }, this.maxLoadingTime);
      
    } catch (error) {
      console.error('Loading screen error:', error);
      // If loading screen fails, just complete immediately
      this.completeLoading();
    }
  }
  
  createLoadingScreen() {
    // Create main container
    this.loadingElement = document.createElement('div');
    this.loadingElement.className = 'loading-screen';
    this.loadingElement.setAttribute('aria-label', 'Loading Grand Foods India');
    this.loadingElement.setAttribute('role', 'status');
    
    // Create background animation
    const background = document.createElement('div');
    background.className = 'loading-background';
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'loading-logo-container';
    
    // Create logo
    const logo = document.createElement('img');
    logo.className = 'loading-logo';
    logo.src = './assets/img/Grands-Logo-Vector.svg';
    logo.alt = 'Grand Foods India';
    logo.onerror = () => {
      // Fallback if logo fails to load
      logoContainer.innerHTML = `
        <div style="
          font-size: 3rem; 
          font-weight: 800; 
          color: #00c2c7;
          background: linear-gradient(135deg, #00c2c7, #007d83);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.1em;
        ">GFI</div>
      `;
    };
    
    // Create progress bar
    const progress = document.createElement('div');
    progress.className = 'loading-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';
    progress.appendChild(progressBar);
    
    // Create loading indicator
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'loading-dot';
      indicator.appendChild(dot);
    }
    
    // Assemble the loading screen
    logoContainer.appendChild(logo);
    logoContainer.appendChild(progress);
    
    this.loadingElement.appendChild(background);
    this.loadingElement.appendChild(logoContainer);
    this.loadingElement.appendChild(indicator);
    
    // Insert at the beginning of body
    document.body.insertBefore(this.loadingElement, document.body.firstChild);
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
  }
  
  startLoading() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Trigger initial animations
    requestAnimationFrame(() => {
      if (this.loadingElement) {
        this.loadingElement.style.opacity = '1';
      }
    });
    
    console.log('🎬 Loading screen started...');
  }
  
  checkCompletion() {
    const loadTime = performance.now() - this.startTime;
    
    if (this.resourcesLoaded && loadTime >= this.minLoadingTime) {
      // Both resources loaded and minimum time passed
      setTimeout(() => this.completeLoading(), 300);
    } else if (this.resourcesLoaded) {
      // Resources loaded but need to wait for minimum time
      const remainingTime = this.minLoadingTime - loadTime;
      setTimeout(() => this.completeLoading(), remainingTime);
    }
    // If resources not loaded yet, wait for them
  }
  
  completeLoading() {
    if (this.isComplete) return;
    
    this.isComplete = true;
    
    const totalLoadTime = performance.now() - this.startTime;
    console.log(`🏁 Loading completed in ${Math.round(totalLoadTime)}ms`);
    
    // Add fade-out class
    if (this.loadingElement) {
      this.loadingElement.classList.add('fade-out');
    }
    
    // Remove loading class from body
    document.body.classList.remove('loading');
    
    // Restore scrolling
    document.body.style.overflow = '';
    
    // Remove loading screen after transition
    setTimeout(() => {
      if (this.loadingElement && this.loadingElement.parentNode) {
        this.loadingElement.parentNode.removeChild(this.loadingElement);
      }
      
      // Trigger page animations
      this.triggerPageAnimations();
      
      console.log('🎉 Welcome to Grand Foods India!');
    }, 1000);
  }
  
  triggerPageAnimations() {
    // Trigger any page-specific animations after loading
    const event = new CustomEvent('loadingComplete', {
      detail: { 
        loadTime: performance.now() - this.startTime,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
  }
}

// Initialize loading screen when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
  });
} else {
  new LoadingScreen();
}
