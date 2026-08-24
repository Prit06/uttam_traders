/* ==========================================================================
   UTTAM TRADERS - Main Interactive Logic
   Catalog Data, Filtering, Search, Modals, Lightbox, Calculator & GSAP Animations
   ========================================================================== */

(function () {
  'use strict';

  // Catalog Master Dataset
  // Catalog Master Dataset
  const PRODUCTS_DATA = [
    // --- CEMENT BRANDS & PRODUCTS ---
    {
      id: 'c1',
      name: 'UltraTech Super Cement',
      category: 'Cement',
      brand: 'UltraTech',
      cementType: 'OPC',
      grade: '53 Grade',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'The Engineer’s Choice. UltraTech OPC 53 Grade offers high compressive strength and quick setting for critical structural RCC works.',
      sizes: '50 Kg Bag',
      applications: 'RCC Slabs, Beams, Columns, Bridges, High-rise Buildings',
      featured: true
    },
    {
      id: 'c2',
      name: 'Ambuja Kavach Waterproof Cement',
      category: 'Cement',
      brand: 'Ambuja',
      cementType: 'PPC',
      grade: 'PPC Pozzolana',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Formulated with Active Silicates for hydrophobic water repellency, safeguarding homes against efflorescence and water seepage.',
      sizes: '50 Kg Bag',
      applications: 'Roof Slabs, External Plastering, Underground Water Tanks',
      featured: true
    },
    {
      id: 'c3',
      name: 'ACC Concrete Plus Xtra Strong',
      category: 'Cement',
      brand: 'ACC',
      cementType: 'PPC',
      grade: 'PPC Pozzolana',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Engineered with unique sphere-shaped particles for optimal compaction, high density, and superior long-term strength.',
      sizes: '50 Kg Bag',
      applications: 'Foundations, Columns, Retaining Walls, Residential Units',
      featured: true
    },
    {
      id: 'c4',
      name: 'Sanghi Classic Cement',
      category: 'Cement',
      brand: 'Sanghi',
      cementType: 'PSC',
      grade: 'Portland Slag',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Top choice in coastal Gujarat. Offers high sulphate and chloride resistance, protecting steel rebar from rusting.',
      sizes: '50 Kg Bag',
      applications: 'Coastal Construction, Marine Works, Piles, Basements',
      featured: false
    },
    {
      id: 'c5',
      name: 'Wonder Cement Xtreme',
      category: 'Cement',
      brand: 'Wonder',
      cementType: 'OPC',
      grade: '43 / 53 Grade',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Extremely consistent quality produced with German robotic technology, ensuring ultra-fine particle distribution.',
      sizes: '50 Kg Bag',
      applications: 'Pavement, Heavy Foundations, General RCC Construction',
      featured: false
    },
    {
      id: 'c6',
      name: 'JK Super Cement OPC 53',
      category: 'Cement',
      brand: 'JK Cement',
      cementType: 'OPC',
      grade: '53 Grade',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Provides rapid strength development and maximum durability for commercial complexes and industrial floors.',
      sizes: '50 Kg Bag',
      applications: 'Industrial Floors, Pre-stressed Concrete, RCC Frames',
      featured: false
    },
    {
      id: 'c7',
      name: 'Shree Jung Rodhak Cement',
      category: 'Cement',
      brand: 'Shree Cement',
      cementType: 'PPC',
      grade: 'PPC Pozzolana',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Special anti-corrosion technology that safeguards internal steel reinforcement against rusting and chemical attack.',
      sizes: '50 Kg Bag',
      applications: 'Residential Plastering, Brick Masonry, Roof Slabs',
      featured: false
    },
    {
      id: 'c8',
      name: 'Nuvoco Concreto Cement',
      category: 'Cement',
      brand: 'Nuvoco',
      cementType: 'PSC',
      grade: 'Slag Cement',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Premium slag cement designed for seamless surface finish, zero thermal cracking, and supreme longevity.',
      sizes: '50 Kg Bag',
      applications: 'Basements, Sump Tanks, Structural Concrete',
      featured: false
    },
    {
      id: 'c9',
      name: 'JSW Concreel HD Cement',
      category: 'Cement',
      brand: 'JSW Cement',
      cementType: 'PSC',
      grade: 'Green PSC',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'High-density eco-friendly slag cement with quick initial setting time and superior chemical resistance.',
      sizes: '50 Kg Bag',
      applications: 'Heavy Concrete Works, Canals, Bridges, Damp-proof Walls',
      featured: false
    },
    {
      id: 'c10',
      name: 'Birla Samrat Unique Cement',
      category: 'Cement',
      brand: 'Birla Cement',
      cementType: 'PPC',
      grade: 'Premium PPC',
      image: 'images/cement_bags.png',
      logo: 'images/logo.png',
      desc: 'Ultrafine grain composition preventing micro-cracking and delivering ultra-smooth plaster finishes.',
      sizes: '50 Kg Bag',
      applications: 'Smooth Plastering, Brick Mortar, Residential Framing',
      featured: false
    },

    // --- TMT STEEL BARS PRODUCTS ---
    {
      id: 't1',
      name: 'Tata Tiscon 550SD Super Ductile TMT',
      category: 'TMT Bars',
      brand: 'Tata Tiscon',
      tmtGrade: 'Fe 550D',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'India’s leading TMT rebar made from virgin iron ore. 550SD provides high earthquake resistance and superior bendability.',
      sizes: '8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm',
      applications: 'Earthquake-Prone Structures, Multi-story Towers, Heavy Beams',
      featured: true
    },
    {
      id: 't2',
      name: 'JSW Neosteel 550D High Rib TMT',
      category: 'TMT Bars',
      brand: 'JSW Neosteel',
      tmtGrade: 'Fe 550D',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'Manufactured with state-of-the-art Morgan rolling mill. Features precise rib pattern for exceptional concrete bonding strength.',
      sizes: '6mm, 8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm',
      applications: 'Commercial Complexes, Bridges, Heavy Foundations, Flyovers',
      featured: true
    },
    {
      id: 't3',
      name: 'Jindal Panther Fe 550D TMT Rebars',
      category: 'TMT Bars',
      brand: 'Jindal Panther',
      tmtGrade: 'Fe 550D',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'Produced using HYQST technology. High yield strength combined with high strain hardening capacity for ultimate safety.',
      sizes: '8mm, 10mm, 12mm, 16mm, 20mm, 25mm',
      applications: 'Residential Bungalows, Industrial Sheds, Dams, Metro Rail',
      featured: true
    },
    {
      id: 't4',
      name: 'SAIL TMT Fe 500D High Strength Bars',
      category: 'TMT Bars',
      brand: 'SAIL TMT',
      tmtGrade: 'Fe 500D',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'Government-grade steel manufactured by Steel Authority of India. Trusted for public infrastructure and mega structures.',
      sizes: '8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm',
      applications: 'Highways, Power Plants, Dams, Heavy Foundations',
      featured: false
    },
    {
      id: 't5',
      name: 'Kamdhenu NXT Next-Gen TMT Rebars',
      category: 'TMT Bars',
      brand: 'Kamdhenu TMT',
      tmtGrade: 'Fe 500D',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'Featuring double-rib design for 2.5x stronger inter-locking grip with concrete. Fire and corrosion resistant.',
      sizes: '8mm, 10mm, 12mm, 16mm, 20mm',
      applications: 'Residential Villas, Commercial Malls, Roof Slabs',
      featured: false
    },
    {
      id: 't6',
      name: 'Metro Ispat Fe 500 TMT Steel Bars',
      category: 'TMT Bars',
      brand: 'Metro Ispat TMT',
      tmtGrade: 'Fe 500',
      image: 'images/tmt_rebars.png',
      logo: 'images/logo.png',
      desc: 'Economical high-performance TMT steel engineered specifically for standard residential construction across Gujarat.',
      sizes: '8mm, 10mm, 12mm, 16mm, 20mm',
      applications: 'Individual Home Building, Boundary Walls, Columns',
      featured: false
    },

    // --- OTHER STEEL PRODUCTS ---
    {
      id: 's1',
      name: 'Mild Steel Angles (MS Angle)',
      category: 'Steel',
      brand: 'Uttam Steel',
      tmtGrade: 'IS 2022',
      image: 'images/steel_channels.png',
      logo: 'images/logo.png',
      desc: 'L-shaped structural steel angles for frame fabrication, industrial trusses, sheds, and equipment support.',
      sizes: '25x25mm to 100x100mm (3mm - 12mm thickness)',
      applications: 'Industrial Fabrication, Roofing Trusses, Towers, Shelving',
      featured: false
    },
    {
      id: 's2',
      name: 'MS Channels (ISMC Steel Channel)',
      category: 'Steel',
      brand: 'Uttam Steel',
      tmtGrade: 'IS 2062',
      image: 'images/steel_channels.png',
      logo: 'images/logo.png',
      desc: 'C-shaped structural steel channels engineered for high bending rigidity and load-bearing framing.',
      sizes: 'ISMC 75 to ISMC 300 (6m & 12m length)',
      applications: 'Structural Framing, Vehicle Bodies, Factory Buildings',
      featured: false
    },
    {
      id: 's3',
      name: 'GI Binding Wire (18 Gauge)',
      category: 'Steel',
      brand: 'Uttam Hardware',
      tmtGrade: 'Annealed GI',
      image: 'images/steel_channels.png',
      logo: 'images/logo.png',
      desc: 'High ductility annealed galvanized binding wire for firmly tying TMT rebar mesh during shuttering.',
      sizes: '18 Gauge (25 Kg / 50 Kg Bundles)',
      applications: 'Rebar Tying, Shuttering Work, Construction Mesh',
      featured: false
    }
  ];

  // Gallery Photos Data
  const GALLERY_DATA = [
    { title: 'Premium UltraTech & Ambuja Cement Stock', cat: 'Cement', img: 'images/cement_bags.png' },
    { title: 'Tata Tiscon & JSW TMT Rebar Bundles', cat: 'TMT Bars', img: 'images/tmt_rebars.png' },
    { title: 'Uttam Traders Main Warehouse Gujarat', cat: 'Warehouse', img: 'images/warehouse_logistics.png' },
    { title: 'Heavy Steel Loading & Logistics Fleet', cat: 'Warehouse', img: 'images/warehouse_logistics.png' },
    { title: 'High Grade ACC & Sanghi Cement Stack', cat: 'Cement', img: 'images/cement_bags.png' },
    { title: 'Jindal Panther & SAIL TMT Rebar Yard', cat: 'TMT Bars', img: 'images/steel_channels.png' }
  ];

  // State Management
  let currentCategoryFilter = 'All';
  let currentBrandFilter = 'All';
  let currentTypeFilter = 'All';
  let currentGradeFilter = 'All';
  let currentSearchQuery = '';

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const catFilterBtns = document.querySelectorAll('.filter-cat-btn');
  const modalOverlay = document.getElementById('product-modal');
  const lightboxModal = document.getElementById('lightbox-modal');
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    renderProducts();
    initFilterControls();
    initGallery();
    initQuoteCalculator();
    initCounterAnimation();
  });

  // Header Scroll Shadow
  function initHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Navigation Menu Toggle
  function initMobileNav() {
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile nav on click link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Filter Logic & Product Grid Rendering
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = PRODUCTS_DATA.filter(item => {
      const matchCat = currentCategoryFilter === 'All' || item.category === currentCategoryFilter;
      const matchType = currentTypeFilter === 'All' || item.cementType === currentTypeFilter;
      const matchGrade = currentGradeFilter === 'All' || item.tmtGrade === currentGradeFilter;
      const matchSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(currentSearchQuery.toLowerCase());
      return matchCat && matchType && matchGrade && matchSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-gold); margin-bottom: 1rem;"></i>
          <h3>No products match your criteria</h3>
          <p>Try clearing search or filter selections to view available steel and cement products.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(item => `
      <div class="product-card" data-id="${item.id}">
        <div class="product-thumb">
          <span class="product-category-tag">${item.category}</span>
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${item.name}</h3>
          <p class="product-desc">${item.desc.substring(0, 90)}...</p>
          <div class="product-footer">
            <span style="font-size: 0.85rem; color: var(--primary-gold); font-weight: 700;">
              ${item.grade || item.cementType || 'Gujarat Stock'}
            </span>
            <button class="btn btn-outline btn-sm view-detail-btn" data-id="${item.id}">
              Details <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click events for product detail modal
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = card.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  // Filter Buttons Initialization
  function initFilterControls() {
    // Search input event
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderProducts();
      });
    }

    // Category Buttons
    catFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategoryFilter = btn.getAttribute('data-category');
        renderProducts();
      });
    });

    // Cement Type Filter Dropdown / Buttons
    const typeSelect = document.getElementById('filter-cement-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        currentTypeFilter = e.target.value;
        renderProducts();
      });
    }

    // TMT Grade Filter Dropdown
    const gradeSelect = document.getElementById('filter-tmt-grade');
    if (gradeSelect) {
      gradeSelect.addEventListener('change', (e) => {
        currentGradeFilter = e.target.value;
        renderProducts();
      });
    }
  }

  // Product Detail Modal Trigger
  window.openProductModal = function (productId) {
    const item = PRODUCTS_DATA.find(p => p.id === productId);
    if (!item || !modalOverlay) return;

    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-brand').textContent = 'Brand: ' + item.brand;
    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-desc').textContent = item.desc;
    document.getElementById('modal-sizes').textContent = item.sizes || 'Multiple Standard Sizes Available';
    document.getElementById('modal-apps').textContent = item.applications || 'Structural & General Construction';

    // WhatsApp Pre-filled link
    const waText = encodeURIComponent(`Hello Uttam Traders (Steel & Cement), I am interested in inquiring about ${item.name} (${item.brand}). Please provide price per unit/ton for Gondal/Gujarat delivery.`);
    document.getElementById('modal-wa-btn').href = `https://wa.me/919624359317?text=${waText}`;

    modalOverlay.classList.add('active');
  };

  // Close Modals setup
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (lightboxModal) lightboxModal.classList.remove('active');
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // Gallery Setup & Lightbox
  function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = GALLERY_DATA.map(g => `
      <div class="gallery-item" onclick="openLightbox('${g.img}', '${g.title}')">
        <img src="${g.img}" alt="${g.title}" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-cat">${g.cat}</span>
          <h4 class="gallery-title">${g.title}</h4>
        </div>
      </div>
    `).join('');
  }

  window.openLightbox = function (imgSrc, title) {
    if (!lightboxModal) return;
    document.getElementById('lightbox-img').src = imgSrc;
    lightboxModal.classList.add('active');
  };

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // Quote Calculator Logic
  function initQuoteCalculator() {
    const calcForm = document.getElementById('quote-form');
    if (!calcForm) return;

    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name').value;
      const phone = document.getElementById('quote-phone').value;
      const productType = document.getElementById('quote-type').value;
      const qty = document.getElementById('quote-qty').value;

      alert(`Thank you ${name}! Your quotation inquiry for ${qty} of ${productType} has been received. Our sales engineer will call you at ${phone} shortly with wholesale Gujarat rates.`);
      calcForm.reset();
      
      const quoteModal = document.getElementById('quote-modal-wrap');
      if (quoteModal) quoteModal.classList.remove('active');
    });
  }

  // Global Quote Modal Open helper
  window.openQuoteModal = function () {
    const quoteModal = document.getElementById('quote-modal-wrap');
    if (quoteModal) quoteModal.classList.add('active');
  };

  // Animated Statistics Counter
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endVal = parseInt(target.getAttribute('data-target') || '0', 10);
          let start = 0;
          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = endVal / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= endVal) {
              target.textContent = endVal;
              clearInterval(timer);
            } else {
              target.textContent = Math.floor(start);
            }
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }
})();
