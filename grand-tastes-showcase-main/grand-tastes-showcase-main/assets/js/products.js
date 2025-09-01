/* Products listing, filters, skeletons, micro-interactions */
(function(){
  const grid = document.getElementById('productGrid');
  const categorySel = document.getElementById('categoryFilter');
  const shelfSel = document.getElementById('shelfFilter');
  const searchInput = document.getElementById('searchInput');
  // insert a sort control next to filters if not present
  const filtersSection = document.querySelector('.filters .filter-row');
  let sortSel;
  if(filtersSection){
    const div = document.createElement('div');
    div.className='filter-group';
    div.innerHTML = '<label>Sort</label><select id="sortSel"><option value="relevance">Relevance</option><option value="name-asc">Name A→Z</option><option value="name-desc">Name Z→A</option><option value="shelf-desc">Shelf life ↓</option><option value="shelf-asc">Shelf life ↑</option></select>';
    filtersSection.appendChild(div);
    sortSel = div.querySelector('#sortSel');
  }

  // Source product data from attached folder names; map to categories & shelf
  // Simple catalog; later you can expand/replace with JSON
  const C = {
    MUFFINS: 'Muffins',
    BISCUITS: 'Biscuits & Cookies',
    CHIKKIS: 'Chikkis',
    SNACKS: 'Snacks'
  };

  const defaultProducts = [
    // 10 Muffin SKUs: 5 flavours x single + box variants (10 total)
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

    // Biscuits & Cookies (bottles / packets)
    {name:'COCONUT BISCUITS', img:'./assets/img/products/COCONUT%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'BUTTER BISCUITS', img:'./assets/img/products/BUTTER%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'MILK BISCUITS', img:'./assets/img/products/MILK%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'OSMANIA BISCUITS', img:'./assets/img/products/OSMANIA%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'CASHEW BISCUITS', img:'./assets/img/products/CASHEW%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'SALT BISCUITS', img:'./assets/img/products/SALT%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'RAGI BISCUITS', img:'./assets/img/products/RAGI%20BISCUITS.png', net:'200g', shelf:180, cat:C.BISCUITS},
    {name:'TUTTY FRUITTY BISCUIT', img:'./assets/img/products/TUTTY%20FRUITTY%20BISCUIT.png', net:'150g', shelf:180, cat:C.BISCUITS},
    // Cookie bottle variants (5)
    {name:'COOKIE 01', img:'./assets/img/products/COOKIE%2001.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 02', img:'./assets/img/products/COOKIE%2002.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 03', img:'./assets/img/products/COOKIE%2003.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 04', img:'./assets/img/products/COOKIE%2004.png', net:'150g', shelf:180, cat:C.BISCUITS},
    {name:'COOKIE 05', img:'./assets/img/products/COOKIE%2005.png', net:'150g', shelf:180, cat:C.BISCUITS},

    // Chikkis (bars, balls, jars) - include up to 8 varieties & 5 Rs jar variants
    {name:'PEANUT BAR 200G', img:'./assets/img/products/PEANUT%20BAR%20200%20G.png', net:'200g', shelf:120, cat:C.CHIKKIS},
    {name:'PEANUT BAR 100G', img:'./assets/img/products/PEANUT%20BAR%20100%20G.png', net:'100g', shelf:120, cat:C.CHIKKIS},
    {name:'FINE PEANUT BAR', img:'./assets/img/products/FINE%20PEANUT%20BAR.png', net:'', shelf:120, cat:C.CHIKKIS},
    {name:'PEANUT BALL', img:'./assets/img/products/PEANUT%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'WHITE GINGELLY BALL', img:'./assets/img/products/WHITE%20GINGELLY%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'BLACK GINGELLY BALL', img:'./assets/img/products/BLACK%20GINGELLY%20BALL.png', net:'60g', shelf:120, cat:C.CHIKKIS},
    {name:'5 Rs JAR - PEANUT', img:'./assets/img/products/5rspeanut%20candy.png', net:'jar', shelf:180, cat:C.CHIKKIS},
    {name:'PEANUT BAR (FSSAI)', img:'./assets/img/products/r5s.png', net:'', shelf:120, cat:C.CHIKKIS},

    // Snacks (everything else grouped here)
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
  let PRODUCTS = JSON.parse(localStorage.getItem(PRODUCT_KEY)) || defaultProducts;

  // Persist likes in localStorage
  const LIKE_KEY = 'gfi_likes_v1';
  const liked = new Set(JSON.parse(localStorage.getItem(LIKE_KEY)||'[]'));

  // Simulated loading delay to show skeletons
  setTimeout(()=>{
    const initial = withHashPreselect(PRODUCTS.slice());
    render(initial);
    syncFromURL();
  }, 600);

  function render(list){
    if(!grid) return;
    grid.innerHTML = '';
    if(!list.length){
      grid.innerHTML = '<p class="muted" style="grid-column:1/-1">No products found.</p>';
      return;
    }
    list.forEach((p,i)=>{
      const card = document.createElement('article');
      card.className = 'product-card';
      card.tabIndex = 0;
      const likeActive = liked.has(p.name);
        card.innerHTML = `
          <div class="media">
            <img src="${p.img.replace('.png', '-400.webp')}" srcset="${p.img.replace('.png', '-400.webp')} 400w, ${p.img.replace('.png', '-800.webp')} 800w" alt="${p.name}" loading="lazy" />
          </div>
          <div class="meta">
            <h3>${p.name}</h3>
            <div class="sub">Net wt: ${p.net || '—'} • Shelf: ${p.shelf} days • ${p.cat}</div>
          </div>
          <div class="actions" style="display:flex;align-items:center;gap:12px;">
            <a class="btn btn-victoria" href="./contact.html#manufacturer" style="flex:1;min-width:0;">
              <i class="ti ti-message-circle"></i> Enquire Now
            </a>
            <button class="btn btn-action" data-quick title="Quick View" aria-label="Quick View">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn btn-action${likeActive?' active':''}" data-like title="Add to Wishlist" aria-label="Add to Wishlist">
              <i class="ti ti-heart${likeActive ? ' filled' : ''}"></i>
            </button>
          </div>`;
      grid.appendChild(card);
      // Animate in
      if(window.gsap){
        gsap.from(card, {opacity:0, y:16, duration:.4, ease:'power2.out', delay: i*0.04});
      }
      const likeBtn = card.querySelector('[data-like]');
      likeBtn && likeBtn.addEventListener('click', ()=>{
        likeBtn.classList.toggle('active');
        const icon = likeBtn.querySelector('i');
        if(likeBtn.classList.contains('active')){
          liked.add(p.name);
          icon.classList.add('filled');
        } else {
          liked.delete(p.name);
          icon.classList.remove('filled');
        }
        localStorage.setItem(LIKE_KEY, JSON.stringify([...liked]));
      });
      const qv = card.querySelector('[data-quick]');
      qv && qv.addEventListener('click', ()=> openQuickView(p));
    });
  }

  function applyFilters(){
    const cat = categorySel?.value || 'all';
    const shelf = shelfSel?.value || 'all';
    const q = (searchInput?.value||'').toLowerCase();
    let out = PRODUCTS.filter(p=>{
      let ok = true;
      if(cat !== 'all') ok = ok && (p.cat === cat);
      if(shelf !== 'all'){
        if(shelf === '>=30') ok = ok && (p.shelf >= 30);
        if(shelf === '<7') ok = ok && (p.shelf < 7);
      }
      if(q) ok = ok && p.name.toLowerCase().includes(q);
      return ok;
    });
    // sort
    const s = sortSel?.value || 'relevance';
    if(s === 'name-asc') out.sort((a,b)=> a.name.localeCompare(b.name));
    if(s === 'name-desc') out.sort((a,b)=> b.name.localeCompare(a.name));
    if(s === 'shelf-desc') out.sort((a,b)=> b.shelf - a.shelf);
    if(s === 'shelf-asc') out.sort((a,b)=> a.shelf - b.shelf);
    render(out);
    // sync URL
    const params = new URLSearchParams();
    if(cat!=='all') params.set('cat', cat);
    if(shelf!=='all') params.set('shelf', shelf);
    if(q) params.set('q', q);
    if(s!=='relevance') params.set('sort', s);
    const qs = params.toString();
    const hash = encodeURIComponent(cat);
    history.replaceState(null,'', `?${qs}${hash?('#'+hash):''}`);
  }

  categorySel && categorySel.addEventListener('change', applyFilters);
  shelfSel && shelfSel.addEventListener('change', applyFilters);
  searchInput && searchInput.addEventListener('input', applyFilters);
  sortSel && sortSel.addEventListener('change', applyFilters);

  function withHashPreselect(list){
    const hash = decodeURIComponent(location.hash.replace('#',''));
    if(hash && categorySel){
      [...categorySel.options].forEach(o=>{ if(o.value===hash) categorySel.value = hash; });
    }
    return list;
  }

  function syncFromURL(){
    const url = new URL(location.href);
    const p = url.searchParams;
    const cat = p.get('cat');
    const shelf = p.get('shelf');
    const q = p.get('q');
    const s = p.get('sort');
    if(cat && categorySel) categorySel.value = cat;
    if(shelf && shelfSel) shelfSel.value = shelf;
    if(q && searchInput) searchInput.value = q;
    if(s && sortSel) sortSel.value = s;
    applyFilters();
  }

  // Enhanced product information
  function getProductInfo(p) {
    const info = {
      description: '',
      features: [],
      badge: '',
      ingredients: '',
      nutritional: ''
    };

    // Category-based content
    if (p.cat === C.MUFFINS) {
      info.badge = p.shelf >= 30 ? 'Long Lasting' : 'Fresh & Best';
      info.description = `Rich, moist ${p.name.toLowerCase()} made with premium ingredients and traditional recipes for an unforgettable taste experience.`;
      info.features = [
        '• Premium quality ingredients',
        '• Fresh and hygienic preparation', 
        '• No artificial preservatives',
        '• Perfect for breakfast or snacking',
        '• Available in retail and wholesale'
      ];
      info.ingredients = 'Refined flour, sugar, eggs, butter, premium cocoa (for chocolate variants), vanilla extract, baking powder';
    } else if (p.cat === C.BISCUITS) {
      info.badge = 'Premium Quality';
      info.description = `Crispy, golden ${p.name.toLowerCase()} baked to perfection with carefully selected ingredients for exceptional taste and texture.`;
      info.features = [
        '• Authentic traditional recipe',
        '• Crispy texture and rich flavor',
        '• Extended shelf life for freshness',
        '• Ideal for tea time and gifting',
        '• Bulk packaging available'
      ];
      info.ingredients = 'Wheat flour, sugar, vegetable oil, salt, baking powder, natural flavors';
    } else if (p.cat === C.CHIKKIS) {
      info.badge = 'Healthy Snack';
      info.description = `Traditional ${p.name.toLowerCase()} prepared with authentic methods, combining nutrition and taste in every bite.`;
      info.features = [
        '• 100% natural ingredients',
        '• Rich in protein and energy',
        '• Traditional preparation method',
        '• No artificial colors or flavors',
        '• Perfect healthy snacking option'
      ];
      info.ingredients = 'Premium peanuts/sesame seeds, jaggery, cardamom, ghee';
    } else if (p.cat === C.SNACKS) {
      info.badge = 'Crispy Delight';
      info.description = `Deliciously seasoned ${p.name.toLowerCase()} with the perfect blend of spices for an irresistible snacking experience.`;
      info.features = [
        '• Perfectly seasoned and flavored',
        '• Crispy texture in every bite',
        '• Made with quality ingredients',
        '• Great for parties and events',
        '• Multiple pack sizes available'
      ];
      info.ingredients = 'Selected grains/nuts, vegetable oil, spice mix, salt, natural flavors';
    }

    return info;
  }

  // Enhanced Quick view modal
  function openQuickView(p){
    let modal = document.getElementById('qvModal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'qvModal';
      Object.assign(modal.style, {
        position:'fixed', 
        inset:'0', 
        background:'rgba(0,0,0,.7)', 
        display:'grid', 
        placeItems:'center', 
        zIndex:'200',
        backdropFilter:'blur(4px)'
      });
      modal.innerHTML = '<div style="background:linear-gradient(135deg, #0f1414, #121717);border:1px solid rgba(0,194,199,.15);border-radius:20px;max-width:900px;width:95%;max-height:90vh;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.05)"><div id="qvBody"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
      window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
    }
    
    const info = getProductInfo(p);
    const body = modal.querySelector('#qvBody');
    
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:0;min-height:500px;">
        <!-- Image Section -->
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02));padding:40px;position:relative;">
          <div style="position:absolute;top:20px;right:20px;">
            <span style="background:linear-gradient(135deg, var(--accent), var(--victoria));color:white;padding:6px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;">${info.badge}</span>
          </div>
          <img src="${p.img.replace('.png', '-400.webp')}" srcset="${p.img.replace('.png', '-400.webp')} 400w, ${p.img.replace('.png', '-800.webp')} 800w" alt="${p.name}" style="max-height:280px;width:auto;filter:drop-shadow(0 20px 40px rgba(0,0,0,.4));transition:transform .3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
          <div style="margin-top:20px;display:flex;gap:12px;">
            <div style="text-align:center;padding:8px 16px;background:rgba(0,194,199,.1);border-radius:12px;border:1px solid rgba(0,194,199,.2);">
              <div style="font-size:0.8rem;color:var(--muted);margin-bottom:2px;">Net Weight</div>
              <div style="font-weight:600;color:var(--accent);">${p.net || '—'}</div>
            </div>
            <div style="text-align:center;padding:8px 16px;background:rgba(0,194,199,.1);border-radius:12px;border:1px solid rgba(0,194,199,.2);">
              <div style="font-size:0.8rem;color:var(--muted);margin-bottom:2px;">Shelf Life</div>
              <div style="font-weight:600;color:var(--accent);">${p.shelf} days</div>
            </div>
          </div>
        </div>
        
        <!-- Content Section -->
        <div style="padding:40px;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
            <div>
              <div style="font-size:0.9rem;color:var(--accent);font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">${p.cat}</div>
              <h2 style="margin:0;font-size:1.8rem;font-weight:700;color:var(--text);line-height:1.2;">${p.name}</h2>
            </div>
            <button id="qvClose" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--muted);cursor:pointer;transition:all .2s ease;" onmouseover="this.style.background='rgba(255,255,255,.15)';this.style.color='var(--text)'" onmouseout="this.style.background='rgba(255,255,255,.1)';this.style.color='var(--muted)'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p style="color:var(--muted);line-height:1.6;margin:0 0 24px;font-size:1.05rem;">${info.description}</p>
          
          <div style="margin-bottom:24px;">
            <h4 style="margin:0 0 12px;color:var(--text);font-size:1.1rem;font-weight:600;">Product Features</h4>
            <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;">
              ${info.features.map(feature => `<div style="color:var(--muted);margin:6px 0;font-size:0.95rem;">${feature}</div>`).join('')}
            </div>
          </div>
          
          <div style="margin-bottom:24px;">
            <h4 style="margin:0 0 12px;color:var(--text);font-size:1.1rem;font-weight:600;">Key Ingredients</h4>
            <p style="color:var(--muted);font-size:0.9rem;line-height:1.5;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:12px;margin:0;">${info.ingredients}</p>
          </div>
          
          <div style="display:flex;gap:12px;margin-top:32px;">
            <a class="btn btn-victoria" href="./contact.html#manufacturer" style="flex:1;justify-content:center;padding:14px 24px;font-weight:600;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Get Quote
            </a>
            <button class="btn" id="qvLike" style="padding:14px 24px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);">
              <svg viewBox="0 0 24 24" fill="${liked.has(p.name) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              ${liked.has(p.name) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile responsive styles -->
      <style>
        @media (max-width: 768px) {
          #qvModal > div {
            grid-template-columns: 1fr !important;
            max-width: 95% !important;
            max-height: 95vh !important;
          }
          #qvModal .qv-image-section {
            padding: 20px !important;
            min-height: 250px !important;
          }
          #qvModal .qv-content-section {
            padding: 24px !important;
          }
        }
      </style>
    `;
    
    // Add classes for mobile targeting
    body.querySelector('div > div:first-child').className = 'qv-image-section';
    body.querySelector('div > div:last-child').className = 'qv-content-section';
    
    document.getElementById('qvClose').addEventListener('click', closeModal);
    document.getElementById('qvLike').addEventListener('click', ()=>{
      if(liked.has(p.name)) {
        liked.delete(p.name);
      } else {
        liked.add(p.name);
      }
      localStorage.setItem(LIKE_KEY, JSON.stringify([...liked]));
      closeModal();
      applyFilters(); // re-render to update hearts
    });
    
    modal.style.opacity='0';
    modal.style.transform='scale(0.9)';
    modal.style.transition='all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    requestAnimationFrame(()=> {
      modal.style.opacity='1';
      modal.style.transform='scale(1)';
    });
  }
  function closeModal(){
    const m = document.getElementById('qvModal');
    if(!m) return;
    m.style.opacity='0';
    setTimeout(()=> m.remove(), 200);
  }
})();
