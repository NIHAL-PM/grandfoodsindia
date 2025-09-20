/**
 * Desktop-specific video content visibility optimization
 */
(function() {
  // Only apply on desktop
  if (window.innerWidth < 992) return;
  
  // Get the products video
  const productsVideo = document.getElementById('products-video');
  if (!productsVideo) return;
  
  // Ensure CSS controls the sizing (cover on desktop)
  productsVideo.addEventListener('loadeddata', function() {
    productsVideo.style.objectFit = "";
    productsVideo.style.objectPosition = "";
    productsVideo.style.transform = "";
  });
  
  // Handle window resize to ensure content remains visible
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
  // Desktop optimization handled by CSS (cover)
  productsVideo.style.objectFit = "";
  productsVideo.style.objectPosition = "";
  productsVideo.style.transform = "";
    }
  });
})();
