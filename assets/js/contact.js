/* Contact forms: client-side validation + fake submit */
(function(){
  function bind(id){
    const form = document.getElementById(id);
    if(!form) return;
    
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      
      // Add loading state to button
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Update status
      status.textContent = 'Submitting…';
      status.className = 'form-status';
      
      // Simulate submission delay
      setTimeout(()=>{
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Show success message
        status.textContent = 'Thanks! We will get back to you shortly.';
        status.className = 'form-status success';
        
        // Reset form
        form.reset();
        
        // Clear success message after 5 seconds
        setTimeout(()=>{
          status.textContent = '';
          status.className = 'form-status';
        }, 5000);
        
      }, 1200); // Slightly longer delay for more realistic feel
    });
    
    // Enhanced form validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e){
      const field = e.target;
      const value = field.value.trim();
      
      if(!value){
        showFieldError(field, 'This field is required');
      } else if(field.type === 'email' && !isValidEmail(value)){
        showFieldError(field, 'Please enter a valid email address');
      } else {
        clearFieldError(e);
      }
    }
    
    function showFieldError(field, message){
      field.style.borderColor = 'var(--error)';
      field.style.boxShadow = '0 0 0 3px rgba(255,107,107,.15)';
      
      let errorEl = field.parentNode.querySelector('.field-error');
      if(!errorEl){
        errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.style.color = 'var(--error)';
        errorEl.style.fontSize = '0.85rem';
        errorEl.style.marginTop = '4px';
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }
    
    function clearFieldError(e){
      const field = e.target;
      field.style.borderColor = '';
      field.style.boxShadow = '';
      
      const errorEl = field.parentNode.querySelector('.field-error');
      if(errorEl){
        errorEl.remove();
      }
    }
    
    function isValidEmail(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }
  
  bind('manufacturer');
  bind('consumer');
})();
