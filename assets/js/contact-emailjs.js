// EmailJS integration for contact forms
// API key: CxWrw2kmVtd4xw5Nw
// Service and template IDs must be set up in your EmailJS dashboard

(function(){
  // Load EmailJS SDK
  if (!window.emailjs) {
    var script = document.createElement('script');
    script.src = 'https://cdn.emailjs.com/dist/email.min.js';
    script.onload = function() {
      emailjs.init('CxWrw2kmVtd4xw5Nw');
      bindEmailJS();
    };
    document.head.appendChild(script);
  } else {
    emailjs.init('CxWrw2kmVtd4xw5Nw');
    bindEmailJS();
  }

  function bindEmailJS() {
    // Manufacturer form
    var manForm = document.getElementById('manufacturer');
    if (manForm) {
      manForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendEmail(manForm, 'manufacturer');
      });
    }
    // Consumer form
    var conForm = document.getElementById('consumer');
    if (conForm) {
      conForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendEmail(conForm, 'consumer');
      });
    }
  }

  function sendEmail(form, type) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn.textContent;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = 'Submitting…';
    status.className = 'form-status';

    // Prepare params
    var params = {};
    Array.from(form.elements).forEach(function(el) {
      if (el.name) params[el.name] = el.value;
    });
    // Add a type field for template logic if needed
    params.form_type = type;

    // You must set up a service and template in EmailJS dashboard
    // Example: service ID 'service_xxx', template ID 'template_xxx'
    var serviceID = 'service_tvjlvn6'; // replace with your EmailJS service ID
    var templateID = 'template_h4odvbb'; // replace with your EmailJS template ID

    // Add recipient email for customer service
    params.to_email = 'grandfoodsindia1@gmail.com';

    emailjs.send(serviceID, templateID, params)
      .then(function() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        status.textContent = 'Thanks! We will get back to you shortly.';
        status.className = 'form-status success';
        form.reset();
        setTimeout(function(){
          status.textContent = '';
          status.className = 'form-status';
        }, 5000);
      }, function(error) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        status.textContent = 'Sorry, there was an error. Please try again.';
        status.className = 'form-status error';
      });
  }
})();
