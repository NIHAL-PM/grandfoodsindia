(function() {
  // Define categories to match products.js exactly
  const C = {
    MUFFINS: 'Muffins',
    BISCUITS: 'Biscuits & Cookies',
    CHIKKIS: 'Chikkis',
    SNACKS: 'Snacks'
  };

  // Default products to match products.js exactly
  const defaultProducts = [
    // Muffins
    {name:'CHOCOLATE MUFFIN', img:'./assets/img/products/CHOCOLATE%20MUFFIN.png', net:'58g', shelf:6, cat:C.MUFFINS},
    {name:'CHOCOLATE MUFFIN BOX', img:'./assets/img/products/CHOCOLATE%20BOX.png', net:'6 pc', shelf:30, cat:C.MUFFINS},
    {name:'VANILLA MUFFIN', img:'./assets/img/products/VANILLA%20MUFFIN.png', net:'58g', shelf:6, cat:C.MUFFINS},
    {name:'VANILLA MUFFIN BOX', img:'./assets/img/products/VANILLA%20BOX.png', net:'6 pc', shelf:30, cat:C.MUFFINS},
    {name:'RED VELVET MUFFIN', img:'./assets/img/products/RED%20VELVET%20MUFFIN.png', net:'58g', shelf:6, cat:C.MUFFINS},
    {name:'RED VELVET BOX', img:'./assets/img/products/RED%20VELVET%20MOCKUP.png', net:'6 pc', shelf:30, cat:C.MUFFINS},
    {name:'PINEAPPLE MUFFIN', img:'./assets/img/products/PINEAPPLE%20MUFFIN.png', net:'58g', shelf:6, cat:C.MUFFINS},
    {name:'PINEAPPLE MUFFIN BOX', img:'./assets/img/products/PINEAPPLE%20BOX.png', net:'6 pc', shelf:30, cat:C.MUFFINS},
    {name:'BUTTERSCOTCH MUFFIN', img:'./assets/img/products/BUTTERSCOTCH.png', net:'58g', shelf:6, cat:C.MUFFINS},
    {name:'CHOCOLATE MUFFINS 58 PA', img:'./assets/img/products/CHOCOLATE%20MUFFIN.png', net:'58g', shelf:6, cat:C.MUFFINS},

    // Biscuits & Cookies
    {name:'COCONUT BISCUITS', img:'./assets/img/products/COCONUT%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'BUTTER BISCUITS', img:'./assets/img/products/BUTTER%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'MILK BISCUITS', img:'./assets/img/products/MILK%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'OSMANIA BISCUITS', img:'./assets/img/products/OSMANIA%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'CASHEW BISCUITS', img:'./assets/img/products/CASHEW%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'SALT BISCUITS', img:'./assets/img/products/SALT%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'RAGI BISCUITS', img:'./assets/img/products/RAGI%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'TUTTY FRUITTY BISCUIT', img:'./assets/img/products/TUTTY%20FRUITTY%20BISCUIT.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 01', img:'./assets/img/products/COOKIE%2001.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 02', img:'./assets/img/products/COOKIE%2002.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 03', img:'./assets/img/products/COOKIE%2003.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 04', img:'./assets/img/products/COOKIE%2004.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 05', img:'./assets/img/products/COOKIE%2005.png', net:'150g', shelf:180, cat:C.BISCUITS},

    // Chikkis
    {name:'PEANUT BAR 200G', img:'./assets/img/products/PEANUT%20BAR%20200%20G.png', net:'200g', shelf:120, cat:C.CHIKKIS},
    {name:'PEANUT BAR 100G', img:'./assets/img/products/PEANUT%20BAR%20100%20G.png', net:'100g', shelf:120, cat:C.CHIKKIS},
    {name:'FINE PEANUT BAR', img:'./assets/img/products/FINE%20PEANUT%20BAR.png', net:'', shelf:120, cat:C.CHIKKIS},
    {name:'PEANUT BALL', img:'./assets/img/products/PEANUT%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'WHITE GINGELLY BALL', img:'./assets/img/products/WHITE%20GINGELLY%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'BLACK GINGELLY BALL', img:'./assets/img/products/BLACK%20GINGELLY%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'5 Rs JAR - PEANUT', img:'./assets/img/products/5rspeanut%20candy.png', net:'jar', shelf:180, cat:C.CHIKKIS},
    {name:'PEANUT BAR (FSSAI)', img:'./assets/img/products/r5s.png', net:'', shelf:120, cat:C.CHIKKIS},

    // Snacks
    {name:'BUTTER CHILLY POPCORN', img:'./assets/img/products/BUTTER%20CHILLY%20POPCORN.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'BUTTER MASALA POPCORN', img:'./assets/img/products/BUTTER%20MASALA%20POPCORN.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'BUTTER SALT POPCORN', img:'./assets/img/products/BUTTER%20SALT%20POPCORN.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'MASALA PEANUT', img:'./assets/img/products/MASALA%20PEANUT.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'PLAIN PEANUT', img:'./assets/img/products/PLAIN%20PEANUT.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'ROASTED PEANUT', img:'./assets/img/products/ROASTED%20PEANUT.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'ONION CHIPS', img:'./assets/img/products/ONION%20CHIPS.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'WHEEL CHIPS', img:'./assets/img/products/WHEEL%20CHIPS.png', net:'', shelf:120, cat:C.SNACKS},
    {name:'FRYUMS BOTI', img:'./assets/img/products/FRYUMS%20BOTI.png', net:'', shelf:120, cat:C.SNACKS}
  ];

  const PRODUCT_KEY = 'grand_products';
  let products = JSON.parse(localStorage.getItem(PRODUCT_KEY)) || defaultProducts;

  const grid = document.getElementById('admin-product-grid');
  const form = document.getElementById('product-form');
  const nameInput = document.getElementById('name');
  const imgInput = document.getElementById('img');
  const netInput = document.getElementById('net');
  const shelfInput = document.getElementById('shelf');
  const catInput = document.getElementById('cat');
  const editIndexInput = document.getElementById('edit-index');

  function renderProducts() {
    if (!grid) return;
    grid.innerHTML = '';
    
    if (products.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#666;padding:40px;">No products found. Add your first product below.</p>';
      return;
    }

    products.forEach((p, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:16px;margin:8px;min-width:280px;';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" loading="lazy" style="width:100%;height:180px;object-fit:cover;border-radius:4px;margin-bottom:12px;">
        <h3 style="margin:0 0 8px 0;font-size:1.1em;">${p.name}</h3>
        <p style="margin:4px 0;font-size:0.9em;color:#666;"><strong>Category:</strong> ${p.cat}</p>
        <p style="margin:4px 0;font-size:0.9em;color:#666;"><strong>Net:</strong> ${p.net}</p>
        <p style="margin:4px 0;font-size:0.9em;color:#666;"><strong>Shelf:</strong> ${p.shelf} days</p>
        <div style="margin-top:12px;display:flex;gap:8px;">
          <button class="btn" onclick="editProduct(${index})" style="flex:1;padding:8px;font-size:0.9em;">Edit</button>
          <button class="btn btn-error" onclick="deleteProduct(${index})" style="flex:1;padding:8px;font-size:0.9em;background:#ff4444;color:white;">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function saveProducts() {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
    console.log('Products saved to localStorage:', products.length, 'products');
  }

  function loadProducts() {
    const saved = localStorage.getItem(PRODUCT_KEY);
    if (saved) {
      try {
        products = JSON.parse(saved);
        console.log('Products loaded from localStorage:', products.length, 'products');
      } catch (e) {
        console.error('Error loading products from localStorage:', e);
        products = defaultProducts;
        saveProducts();
      }
    } else {
      console.log('No saved products found, using defaults');
      products = defaultProducts;
      saveProducts();
    }
    renderProducts();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const index = parseInt(editIndexInput.value);
    const product = {
      name: nameInput.value.trim(),
      img: imgInput.value.trim(),
      net: netInput.value.trim(),
      shelf: parseInt(shelfInput.value),
      cat: catInput.value
    };

    if (!product.name || !product.img || !product.net || isNaN(product.shelf)) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    if (isNaN(index)) {
      // Add new product
      products.push(product);
      console.log('Added new product:', product.name);
    } else {
      // Edit existing product
      products[index] = product;
      console.log('Updated product:', product.name, 'at index', index);
      editIndexInput.value = '';
    }
    
    saveProducts();
    renderProducts();
    form.reset();
    
    // Show success message
    const message = document.createElement('div');
    message.textContent = 'Product saved successfully!';
    message.style.cssText = 'background:#4CAF50;color:white;padding:10px;border-radius:4px;margin:10px 0;';
    form.insertBefore(message, form.firstChild);
    setTimeout(() => message.remove(), 3000);
  });

  window.editProduct = function(index) {
    if (index < 0 || index >= products.length) {
      console.error('Invalid product index:', index);
      return;
    }
    
    const p = products[index];
    nameInput.value = p.name;
    imgInput.value = p.img;
    netInput.value = p.net;
    shelfInput.value = p.shelf;
    catInput.value = p.cat;
    editIndexInput.value = index;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
    nameInput.focus();
  };

  window.deleteProduct = function(index) {
    if (index < 0 || index >= products.length) {
      console.error('Invalid product index:', index);
      return;
    }
    
    const productName = products[index].name;
    if (confirm(`Delete "${productName}"? This action cannot be undone.`)) {
      products.splice(index, 1);
      saveProducts();
      renderProducts();
      
      // Reset form if we were editing this product
      if (parseInt(editIndexInput.value) === index) {
        form.reset();
        editIndexInput.value = '';
      }
      
      console.log('Deleted product:', productName);
    }
  };

  // Initialize
  loadProducts();

  // Add reset to defaults functionality
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.textContent = 'Reset to Defaults';
  resetButton.style.cssText = 'margin-left:10px;padding:8px 16px;background:#ff9800;color:white;border:none;border-radius:4px;cursor:pointer;';
  resetButton.onclick = function() {
    if (confirm('Reset all products to default? This will overwrite all changes.')) {
      products = [...defaultProducts];
      saveProducts();
      renderProducts();
      form.reset();
      editIndexInput.value = '';
      console.log('Reset products to defaults');
    }
  };
  form.appendChild(resetButton);

  console.log('Admin panel initialized successfully');

  // ===== TAB NAVIGATION =====
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Update button states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#333';
      });
      button.classList.add('active');
      button.style.background = '#007d83';
      
      // Show/hide tab contents
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(`${targetTab}-tab`).style.display = 'block';
    });
  });

  // ===== SITE CONTENT MANAGEMENT =====
  const defaultSiteContent = {
    hero: {
      title: "Deliciously Different",
      subtitle: "Discover the finest selection of artisanal foods and gourmet treats that bring joy to every bite."
    },
    company: {
      name: "Grand Foods India",
      description: "Creating delicious, high-quality food products with traditional recipes and modern techniques.",
      phone: "+91 96862 81458",
      email: "grandfoodsindia1@gmail.com",
      address: "The Grand Foods, Bangalore, India"
    },
    social: {
      instagram: "https://www.instagram.com/grandfoodsindia",
      facebook: "https://www.facebook.com/grandfoodsindia",
      linkedin: "https://www.linkedin.com/company/grandfoodsindia",
      maps: "https://maps.google.com/"
    }
  };

  const CONTENT_KEY = 'grand_site_content';
  let siteContent = JSON.parse(localStorage.getItem(CONTENT_KEY)) || defaultSiteContent;

  // Load site content into forms
  function loadSiteContent() {
    // Hero content
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroTitle) heroTitle.value = siteContent.hero?.title || '';
    if (heroSubtitle) heroSubtitle.value = siteContent.hero?.subtitle || '';

    // Company info
    const companyName = document.getElementById('company-name');
    const companyDesc = document.getElementById('company-description');
    const companyPhone = document.getElementById('company-phone');
    const companyEmail = document.getElementById('company-email');
    const companyAddress = document.getElementById('company-address');
    if (companyName) companyName.value = siteContent.company?.name || '';
    if (companyDesc) companyDesc.value = siteContent.company?.description || '';
    if (companyPhone) companyPhone.value = siteContent.company?.phone || '';
    if (companyEmail) companyEmail.value = siteContent.company?.email || '';
    if (companyAddress) companyAddress.value = siteContent.company?.address || '';

    // Social links
    const instagramUrl = document.getElementById('instagram-url');
    const facebookUrl = document.getElementById('facebook-url');
    const linkedinUrl = document.getElementById('linkedin-url');
    const mapsUrl = document.getElementById('maps-url');
    if (instagramUrl) instagramUrl.value = siteContent.social?.instagram || '';
    if (facebookUrl) facebookUrl.value = siteContent.social?.facebook || '';
    if (linkedinUrl) linkedinUrl.value = siteContent.social?.linkedin || '';
    if (mapsUrl) mapsUrl.value = siteContent.social?.maps || '';
  }

  function saveSiteContent() {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(siteContent));
    console.log('Site content saved to localStorage');
  }

  // Hero form handler
  const heroForm = document.getElementById('hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      siteContent.hero = {
        title: document.getElementById('hero-title').value.trim(),
        subtitle: document.getElementById('hero-subtitle').value.trim()
      };
      saveSiteContent();
      showSuccessMessage(heroForm, 'Hero content saved successfully!');
    });
  }

  // Company form handler
  const companyForm = document.getElementById('company-form');
  if (companyForm) {
    companyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      siteContent.company = {
        name: document.getElementById('company-name').value.trim(),
        description: document.getElementById('company-description').value.trim(),
        phone: document.getElementById('company-phone').value.trim(),
        email: document.getElementById('company-email').value.trim(),
        address: document.getElementById('company-address').value.trim()
      };
      saveSiteContent();
      showSuccessMessage(companyForm, 'Company information saved successfully!');
    });
  }

  // Social form handler
  const socialForm = document.getElementById('social-form');
  if (socialForm) {
    socialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      siteContent.social = {
        instagram: document.getElementById('instagram-url').value.trim(),
        facebook: document.getElementById('facebook-url').value.trim(),
        linkedin: document.getElementById('linkedin-url').value.trim(),
        maps: document.getElementById('maps-url').value.trim()
      };
      saveSiteContent();
      showSuccessMessage(socialForm, 'Social media links saved successfully!');
    });
  }

  // ===== TEAM MANAGEMENT =====
  const defaultTeam = [
    {
      name: "Rajesh Gupta",
      title: "Chairman & Founder",
      description: "Visionary leader with over 20 years of experience in the food industry.",
      initials: "RG"
    },
    {
      name: "Priya Sharma",
      title: "Chief Executive Officer",
      description: "Strategic operations expert focused on quality and growth.",
      initials: "PS"
    },
    {
      name: "Amit Kumar",
      title: "Head of Production",
      description: "Ensures highest quality standards in all our manufacturing processes.",
      initials: "AK"
    }
  ];

  const TEAM_KEY = 'grand_team';
  let teamMembers = JSON.parse(localStorage.getItem(TEAM_KEY)) || defaultTeam;

  function renderTeam() {
    const teamList = document.getElementById('team-list');
    if (!teamList) return;
    
    teamList.innerHTML = '';
    
    teamMembers.forEach((member, index) => {
      const memberCard = document.createElement('div');
      memberCard.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:16px;';
      memberCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#007d83;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;">
            ${member.initials}
          </div>
          <div>
            <h4 style="margin:0;font-size:1.1em;">${member.name}</h4>
            <p style="margin:2px 0;color:#666;font-size:0.9em;">${member.title}</p>
          </div>
        </div>
        <p style="margin:8px 0;font-size:0.9em;color:#333;">${member.description}</p>
        <div style="margin-top:12px;display:flex;gap:8px;">
          <button class="btn" onclick="editTeamMember(${index})" style="flex:1;padding:6px;font-size:0.9em;">Edit</button>
          <button class="btn btn-error" onclick="deleteTeamMember(${index})" style="flex:1;padding:6px;font-size:0.9em;background:#ff4444;color:white;">Delete</button>
        </div>
      `;
      teamList.appendChild(memberCard);
    });
  }

  function saveTeam() {
    localStorage.setItem(TEAM_KEY, JSON.stringify(teamMembers));
    console.log('Team data saved to localStorage');
  }

  // Team form handler
  const teamForm = document.getElementById('team-form');
  const memberEditIndex = document.getElementById('member-edit-index');
  
  if (teamForm) {
    teamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const member = {
        name: document.getElementById('member-name').value.trim(),
        title: document.getElementById('member-title').value.trim(),
        description: document.getElementById('member-description').value.trim(),
        initials: document.getElementById('member-initials').value.trim().toUpperCase()
      };

      if (!member.name || !member.title || !member.initials) {
        alert('Please fill in all required fields');
        return;
      }

      const index = parseInt(memberEditIndex.value);
      if (isNaN(index)) {
        teamMembers.push(member);
      } else {
        teamMembers[index] = member;
        memberEditIndex.value = '';
      }
      
      saveTeam();
      renderTeam();
      teamForm.reset();
      showSuccessMessage(teamForm, 'Team member saved successfully!');
    });
  }

  window.editTeamMember = function(index) {
    if (index < 0 || index >= teamMembers.length) return;
    
    const member = teamMembers[index];
    document.getElementById('member-name').value = member.name;
    document.getElementById('member-title').value = member.title;
    document.getElementById('member-description').value = member.description;
    document.getElementById('member-initials').value = member.initials;
    memberEditIndex.value = index;
    
    teamForm.scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteTeamMember = function(index) {
    if (index < 0 || index >= teamMembers.length) return;
    
    const memberName = teamMembers[index].name;
    if (confirm(`Delete "${memberName}"? This action cannot be undone.`)) {
      teamMembers.splice(index, 1);
      saveTeam();
      renderTeam();
      
      if (parseInt(memberEditIndex.value) === index) {
        teamForm.reset();
        memberEditIndex.value = '';
      }
    }
  };

  // Helper function for success messages
  function showSuccessMessage(form, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = 'background:#4CAF50;color:white;padding:10px;border-radius:4px;margin:10px 0;';
    form.insertBefore(messageDiv, form.firstChild);
    setTimeout(() => messageDiv.remove(), 3000);
  }

  // Initialize all content
  loadSiteContent();
  renderTeam();

})();
