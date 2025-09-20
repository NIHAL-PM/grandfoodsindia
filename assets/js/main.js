/* Main interactions, parallax, particles, transitions */
(function(){
  // Dual Video System Implementation
  function initializeDualVideoSystem() {
    const muffinVideo = document.getElementById('muffin-video');
    const productsVideo = document.getElementById('products-video');
    const videoSwitches = document.querySelectorAll('.video-switch');
    const videoIndicators = document.querySelectorAll('.video-indicator');

    if (!muffinVideo || !productsVideo) return;

    // Set initial state
    let currentVideo = 'muffin';
    
    function switchToVideo(videoType) {
      if (currentVideo === videoType) return;
      
      // Update video visibility with fade effect
      if (videoType === 'muffin') {
        muffinVideo.style.opacity = '1';
        muffinVideo.style.zIndex = '2';
        productsVideo.style.opacity = '0';
        productsVideo.style.zIndex = '1';
        
        // Play muffin video and pause products
        muffinVideo.play().catch(e => console.log('Muffin video play failed:', e));
        productsVideo.pause();
        
        // Apply square video styling (480×480)
        document.documentElement.classList.remove('showing-products-video');
        document.documentElement.classList.add('showing-muffin-video');
      } else {
        productsVideo.style.opacity = '1';
        productsVideo.style.zIndex = '2';
        muffinVideo.style.opacity = '0';
        muffinVideo.style.zIndex = '1';
        
        // Play products video and pause muffin
        productsVideo.play().catch(e => console.log('Products video play failed:', e));
        muffinVideo.pause();
        
        // Apply portrait video styling (480×848)
        document.documentElement.classList.remove('showing-muffin-video');
        document.documentElement.classList.add('showing-products-video');
      }
      
      // Update active states
      videoSwitches.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.video === videoType);
      });
      
      videoIndicators.forEach(indicator => {
        indicator.classList.toggle('active', indicator.dataset.video === videoType);
      });
      
      currentVideo = videoType;
    }

    // Add click handlers for video switches
    videoSwitches.forEach(btn => {
      btn.addEventListener('click', () => {
        const videoType = btn.dataset.video;
        switchToVideo(videoType);
      });
    });

    // Add click handlers for video indicators
    videoIndicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        const videoType = indicator.dataset.video;
        switchToVideo(videoType);
      });
    });

    // Initialize video properties
    [muffinVideo, productsVideo].forEach((video, index) => {
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      // Ensure no forced cover on desktop; CSS will set contain
      
      video.addEventListener('loadeddata', () => {
        console.log(`Video ${index === 0 ? 'muffin' : 'products'} loaded successfully`);
      });
      
      video.addEventListener('error', (e) => {
        console.error(`Video ${index === 0 ? 'muffin' : 'products'} error:`, e);
      });
    });

    // Auto-switch videos every 15 seconds if user doesn't interact
    let autoSwitchInterval = setInterval(() => {
      switchToVideo(currentVideo === 'muffin' ? 'products' : 'muffin');
    }, 15000);

    // Clear auto-switch when user interacts
    [...videoSwitches, ...videoIndicators].forEach(element => {
      element.addEventListener('click', () => {
        clearInterval(autoSwitchInterval);
        // Restart auto-switch after 30 seconds of no interaction
        autoSwitchInterval = setInterval(() => {
          switchToVideo(currentVideo === 'muffin' ? 'products' : 'muffin');
        }, 30000);
      });
    });

    // Start with muffin video
    switchToVideo('muffin');
  }

  // Initialize dual video system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeDualVideoSystem();
      // Add initial class to properly style videos on first load
      document.documentElement.classList.add('showing-muffin-video');
    });
  } else {
    initializeDualVideoSystem();
    document.documentElement.classList.add('showing-muffin-video');
  }

  // Smooth scroll - removed Lenis for better performance

  // Modern Mobile Navigation
  const navbarToggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
  
  function openMobileMenu(){
    if(mobileMenu){
      mobileMenu.classList.add('active');
      navbarToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeMobileMenu(){
    if(mobileMenu){
      mobileMenu.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
  
  if(navbarToggle){
    navbarToggle.addEventListener('click', openMobileMenu);
  }
  
  if(mobileMenuClose){
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  if(mobileMenuBackdrop){
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
  }
  
  // Close mobile menu on navigation link clicks
  if(mobileMenu){
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')){
      closeMobileMenu();
    }
  });

  // Legacy mobile nav fallback
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const drawer = document.getElementById('menuDrawer');
  if(toggle && !navbarToggle){
    toggle.addEventListener('click', ()=>{
      if(drawer){
        const isOpen = drawer.classList.toggle('open');
        drawer.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
      }else{
        const open = nav.style.display === 'flex';
        nav.style.display = open ? 'none' : 'flex';
        toggle.setAttribute('aria-expanded', String(!open));
      }
    });
    // close on link click (mobile)
    const closers = [nav, drawer].filter(Boolean);
    closers.forEach(el=> el.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
      if(window.innerWidth < 720){
        if(drawer){ drawer.classList.remove('open'); drawer.hidden = true; }
        if(nav){ nav.style.display='none'; }
        toggle.setAttribute('aria-expanded','false');
      }
    })));
  }

  // Page transition overlay
  const overlay = document.getElementById('page-transition');
  if(overlay){
    overlay.style.position='fixed';
    overlay.style.inset='0';
    overlay.style.pointerEvents='none';
    overlay.style.background='linear-gradient(180deg, rgba(0,125,131,.15), rgba(0,125,131,.02))';
  overlay.style.opacity='1';
    overlay.style.transition='opacity .6s ease';
  window.addEventListener('load', ()=>{ requestAnimationFrame(()=> overlay.style.opacity='0'); });
    window.addEventListener('beforeunload', ()=>{ overlay.style.opacity='1'; });
  }

  // GSAP setups
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);

    // Split title reveal
    const title = document.querySelector('[data-split]');
    if(title){
      gsap.fromTo(title,{opacity:0, y:20},{opacity:1,y:0,duration:1,ease:'power3.out', delay:.2});
    }

    // Parallax hover cards
    document.querySelectorAll('.parallax').forEach((el)=>{
      const depth = parseFloat(el.getAttribute('data-depth')||'0.2');
      el.addEventListener('mousemove', (e)=>{
        const r = el.getBoundingClientRect();
        const rx = ((e.clientX - r.left)/r.width - .5) * depth * 20;
        const ry = ((e.clientY - r.top)/r.height - .5) * depth * -20;
        el.style.transform = `translateY(-4px) rotateX(${ry}deg) rotateY(${rx}deg)`;
      });
      el.addEventListener('mouseleave', ()=>{
        el.style.transform = 'translateY(0)';
      });
    });

    // Enhanced Timeline reveal
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if(timelineContainer && timelineItems.length > 0){
      // Animate timeline line
      if(timelineLine){
        gsap.fromTo(timelineLine, 
          { scaleY: 0, transformOrigin: 'top' },
          { 
            scaleY: 1, 
            ease: 'power2.out', 
            duration: 1.5,
            scrollTrigger: {
              trigger: timelineContainer,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 1
            }
          }
        );
      }
      
      // Animate timeline items
      timelineItems.forEach((item, index) => {
        const isEven = index % 2 === 0;
        
        gsap.from(item, {
          opacity: 0,
          x: isEven ? -50 : 50,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
        
        // Animate counters in timeline stats
        const statNumbers = item.querySelectorAll('.stat-number[data-value]');
        statNumbers.forEach(statNumber => {
          const target = parseInt(statNumber.getAttribute('data-value'));
          
          // Ensure initial state is 0
          statNumber.textContent = '0';
          
          gsap.fromTo(statNumber, 
            { textContent: 0 },
            {
              textContent: target,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              delay: 0.3,
              scrollTrigger: {
                trigger: statNumber,
                start: 'top 85%',
                toggleActions: 'play none none reset',
                onStart: () => {
                  console.log('Counter animation started for:', target);
                }
              }
            }
          );
        });
      });
    }
    
    // Legacy timeline support (if exists)
    const legacyTimeline = document.querySelector('.timeline');
    if(legacyTimeline && !timelineContainer){
      gsap.utils.toArray('.timeline li').forEach((item)=>{
        gsap.from(item,{opacity:0, y:16, duration:.5, ease:'power2.out', scrollTrigger:{trigger:item, start:'top 88%'}});
      });
    }

    // Footer subtle entrance
    const footer = document.querySelector('.site-footer');
    if(footer){
      gsap.from(footer,{opacity:0, y:20, duration:.6, ease:'power2.out', scrollTrigger:{trigger:footer, start:'top 90%'}});
    }

    // Category cards mild scroll parallax
    gsap.utils.toArray('.category-card img').forEach((img)=>{
      gsap.to(img, {y:20, ease:'none', scrollTrigger:{trigger:img, start:'top bottom', end:'bottom top', scrub:true}});
    });
  }

  // Particles canvas (lightweight)
  const canvas = document.getElementById('particles');
  if(canvas){
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const particles = Array.from({length: 70}, ()=>({
      x: Math.random(), y: Math.random(), r: Math.random()*1.5 + .3,
      vx: (Math.random()-.5)*.0008, vy: (Math.random()-.5)*.0008
    }));
    function resize(){ canvas.width = canvas.clientWidth * DPR; canvas.height = canvas.clientHeight * DPR; }
    function step(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'rgba(0,194,199,.7)';
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>1) p.vx*=-1; if(p.y<0||p.y>1) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x*canvas.width, p.y*canvas.height, p.r*DPR, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(step);
    }
    resize();
    new ResizeObserver(resize).observe(canvas);
    step();
  }

  // Time-of-day theme
  try{
    const h = new Date().getHours();
    const b = document.body;
    b.classList.remove('theme-day','theme-dusk','theme-night');
    if(h >= 6 && h < 17) b.classList.add('theme-day');
    else if(h >= 17 && h < 20) b.classList.add('theme-dusk');
    else b.classList.add('theme-night');
  }catch(e){}

  // Visibility-aware video playback
  (function(){
    const vids = Array.from(document.querySelectorAll('video'));
    if(!('IntersectionObserver' in window) || vids.length===0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(({isIntersecting, target})=>{
        try{
          if(reduce){ target.pause(); return; }
          if(isIntersecting){ target.play().catch(()=>{}); }
          else{ target.pause(); }
        }catch(e){}
      });
    }, {threshold: .25});
    vids.forEach(v=> io.observe(v));
  })();

  // Scroll progress bar
  (function(){
    const bar = document.getElementById('scroll-progress');
    if(!bar) return;
    Object.assign(bar.style, {position:'fixed',left:'0',top:'0',height:'3px',background:'linear-gradient(90deg, var(--accent), var(--victoria))',width:'0%',zIndex:'100'});
    function onScroll(){
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max>0 ? (h.scrollTop/max)*100 : 0;
      bar.style.width = p + '%';
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  })();

  // Back-to-top FAB
  (function(){
    const btn = document.getElementById('backToTop');
    if(!btn) return;
    // base styles via inline to avoid CSS file changes dependency
    Object.assign(btn.style, {position:'fixed', right:'16px', bottom:'16px', width:'46px', height:'46px', borderRadius:'50%', display:'grid', placeItems:'center', background:'linear-gradient(135deg, var(--victoria), #00a5ab)', color:'white', border:'0', boxShadow:'0 10px 24px rgba(0,0,0,.35)', cursor:'pointer', opacity:'0', transform:'translateY(10px)', transition:'opacity .2s ease, transform .2s ease', zIndex:'90'});
    function toggle(){
      if(window.scrollY > 300){ btn.style.opacity='1'; btn.style.transform='translateY(0)'; }
      else{ btn.style.opacity='0'; btn.style.transform='translateY(10px)'; }
    }
    window.addEventListener('scroll', toggle, {passive:true});
    toggle();
    btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  })();

  // Enhanced video handling for hero section
  (function(){
    const heroVideo = document.querySelector('.hero-video');
    const heroFallback = document.querySelector('.hero-fallback');
    
    if(!heroVideo) return;
    
    // Video loading and error handling
    const handleVideoLoad = () => {
      heroVideo.style.opacity = '1';
      if(heroFallback) heroFallback.style.opacity = '0';
      console.log('✅ Hero video loaded successfully');
    };
    
    const handleVideoError = () => {
      heroVideo.style.display = 'none';
      if(heroFallback) heroFallback.style.opacity = '1';
      console.log('⚠️ Hero video failed to load, showing fallback');
    };
    
    heroVideo.addEventListener('loadeddata', handleVideoLoad);
    heroVideo.addEventListener('error', handleVideoError);
    
    // Try to play video
    const playVideo = () => {
      heroVideo.play().catch(() => {
        console.log('Video autoplay prevented, showing fallback');
        if(heroFallback) heroFallback.style.opacity = '1';
      });
    };
    
    if(heroVideo.readyState >= 2) {
      handleVideoLoad();
      playVideo();
    }
  })();
})();
