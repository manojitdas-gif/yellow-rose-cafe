/* ============================================
   YELLOW ROSE CAFE - Dynamic JavaScript Client
   ============================================ */

// Global state
let dbState = {};
let currentPage = "home";
let currentRating = 0;
let lightboxImages = [];
let lightboxIndex = 0;

// Fallback data if server is offline (backward compatibility)
const fallbackMenuData = {
  breakfast: [
    {
      name: "Breakfast Combo",
      price: "$6.99",
      desc: "2 eggs, 2 pancakes, and your choice of bacon, ham, or sausage. Available Monday–Friday, all day. The best deal in Chicago!",
      img: "images/breakfast-combo.png",
      tags: ["best value", "mon–fri"],
    },
    {
      name: "Chicago Breakfast",
      price: "$9.99",
      desc: "2 eggs, your choice of meat (ham, bacon, or sausage patty), 1 sausage link, crispy hash browns, and 1 fluffy pancake. A Chicago classic.",
      img: "images/chicago-breakfast.png",
      tags: ["popular"],
    },
    {
      name: "Special",
      price: "$10.99",
      desc: "2 eggs, 2 sausage links, golden hash browns, toast, and a hot cup of coffee. Everything you need to start the day right.",
      img: "images/eggs-breakfast.png",
      tags: ["includes coffee"],
    },
    {
      name: "Country Fried Steak & 2 Eggs",
      price: "$11.99",
      desc: "Crispy country fried steak smothered in creamy white gravy, served with 2 eggs any style, hash browns, and toast.",
      img: "images/country-fried-steak.png",
      tags: ["hearty"],
    },
    {
      name: "Tribune French Toast",
      price: "$12.99",
      desc: "Thick-cut brioche dipped in our secret cinnamon batter, griddled to golden perfection. Dusted with powdered sugar and served with fresh berries.",
      img: "images/french-toast.png",
      tags: ["popular"],
    },
    {
      name: "King of the Hill Omelette",
      price: "$13.99",
      desc: "The ultimate omelette — loaded with ham, bacon, sausage, onion, peppers, potatoes, and melted cheddar cheese. Not for the faint of heart!",
      img: "images/omelette.png",
      tags: ["popular"],
    },
    {
      name: "Triple Threat",
      price: "$14.00",
      desc: "2 eggs any style, 2 strips of bacon, 2 sausage links, crispy hash browns, and toast. Triple the meat, triple the satisfaction.",
      img: "images/breakfast-combo.png",
      tags: ["hearty"],
    },
    {
      name: "Corned Beef Hash & Eggs",
      price: "$14.99",
      desc: "Our legendary homemade corned beef hash — crispy outside, tender inside. Featured on Chicago's Best. Served with 2 eggs any style and toast.",
      img: "images/corned-beef-hash.png",
      tags: ["popular", "featured on tv"],
    },
    {
      name: "Buttermilk Pancakes",
      price: "$9.99",
      desc: "A tall stack of fluffy buttermilk pancakes served with real butter and warm maple syrup. The fluffiest in Chicago — add them to any breakfast!",
      img: "images/pancakes.png",
      tags: ["classic"],
    },
  ],
  lunch: [
    {
      name: "Chicken Sandwich",
      price: "$10.49",
      desc: "Grilled chicken sandwich served with a cup of soup, golden fries, and a soft drink. A complete lunch at a great price.",
      img: "images/chicken-sandwich.png",
      tags: ["lunch special"],
    },
    {
      name: "Chicken Melt",
      price: "$10.49",
      desc: "Grilled chicken with avocado, crispy bacon, melted Swiss cheese, lettuce, and tomato on toasted multi-grain bread. Includes soup, fries, and a soft drink.",
      img: "images/chicken-melt.png",
      tags: ["lunch special"],
    },
    {
      name: "Small Julienne Salad",
      price: "$10.49",
      desc: "Fresh julienne salad with strips of turkey, ham, Swiss cheese, hard-boiled egg, tomato, and crisp lettuce. Includes soup, fries, and a soft drink.",
      img: "images/julienne-salad.png",
      tags: ["lunch special"],
    },
    {
      name: "Chicken Wrap",
      price: "$10.49",
      desc: "Grilled chicken, crispy bacon, cheddar cheese, lettuce, tomato, and ranch dressing wrapped in a flour tortilla. Includes soup, fries, and a soft drink.",
      img: "images/chicken-wrap.png",
      tags: ["lunch special"],
    },
    {
      name: "Corned Beef Sandwich",
      price: "$14.99",
      desc: "Piled high with our house-made corned beef on your choice of bread. The same legendary corned beef featured on Chicago's Best.",
      img: "images/corned-beef-hash.png",
      tags: ["popular"],
    },
    {
      name: "Jr. Club Sandwich",
      price: "$11.99",
      desc: "A classic club sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread. Served with fries or coleslaw.",
      img: "images/chicken-sandwich.png",
      tags: [],
    },
  ],
  dinners: [
    {
      name: "Meatloaf Dinner",
      price: "Market Price",
      desc: "Homestyle meatloaf with rich brown gravy, served with creamy mashed potatoes and seasonal vegetables. Made fresh daily. Available Monday–Friday.",
      img: "images/meatloaf-dinner.png",
      tags: ["mon–fri", "homemade"],
    },
    {
      name: "Hot Turkey Dinner",
      price: "Market Price",
      desc: "Hand-carved fresh turkey breast (prepared daily by Angelo) with mashed potatoes, homemade gravy, and seasonal vegetables. Available Monday–Friday.",
      img: "images/meatloaf-dinner.png",
      tags: ["mon–fri", "made fresh daily"],
    },
    {
      name: "Chicken Breast Dinner",
      price: "Market Price",
      desc: "Golden-seared chicken breast served with creamy mashed potatoes, gravy, and steamed vegetables. A hearty comfort classic. Available Monday–Friday.",
      img: "images/chicken-wrap.png",
      tags: ["mon–fri"],
    },
    {
      name: "Pork Chops",
      price: "$14.99",
      desc: "Two tender grilled pork chops served with creamy mashed potatoes and sautéed green beans. Angelo's recipe, perfected over decades.",
      img: "images/pork-chops.png",
      tags: ["chef's pick"],
    },
  ],
  drinks: [
    {
      name: "Bottomless Coffee",
      price: "$2.99",
      desc: "Hot, fresh-brewed coffee that never runs dry. The backbone of every great breakfast. Refills always free.",
      img: "images/coffee.png",
      tags: ["popular"],
    },
    {
      name: "Fresh Orange Juice",
      price: "$3.99",
      desc: "Freshly squeezed orange juice — bright, sweet, and the perfect way to start your morning.",
      img: "images/coffee.png",
      tags: [],
    },
    {
      name: "Soft Drink",
      price: "$2.49",
      desc: "Choice of Coca-Cola, Diet Coke, Sprite, or other fountain beverages. Included free with all lunch specials.",
      img: "images/coffee.png",
      tags: [],
    },
    {
      name: "Hot Chocolate",
      price: "$3.49",
      desc: "Rich, creamy hot chocolate topped with whipped cream. A cozy treat on cold Chicago mornings.",
      img: "images/coffee.png",
      tags: [],
    },
    {
      name: "Iced Tea",
      price: "$2.49",
      desc: "Refreshing house-brewed iced tea. Sweetened or unsweetened, your choice.",
      img: "images/coffee.png",
      tags: [],
    },
    {
      name: "Milkshake",
      price: "$5.99",
      desc: "Thick, old-fashioned milkshake in chocolate, vanilla, or strawberry. Made with real ice cream.",
      img: "images/coffee.png",
      tags: ["classic"],
    },
    {
      name: "Hot Tea",
      price: "$2.49",
      desc: "Selection of herbal and classic teas. Ask your server for available flavors.",
      img: "images/coffee.png",
      tags: [],
    },
  ],
};

// ==========================================
// DATABASE & SETTINGS LOADING
// ==========================================

async function initDb() {
  try {
    const response = await fetch('/api/db');
    if (!response.ok) throw new Error("API call failed");
    dbState = await response.json();
  } catch (err) {
    console.warn("Could not connect to backend server, using offline fallback data:", err);
    dbState = {
      menuData: fallbackMenuData,
      galleryData: [
        { src: "images/french-toast.png", caption: "Tribune French Toast", category: "food" },
        { src: "images/coffee.png", caption: "Morning Coffee", category: "food" },
        { src: "images/hero.png", caption: "The Dining Room", category: "vibe" },
        { src: "images/pancakes.png", caption: "Buttermilk Pancakes", category: "food" },
        { src: "images/corned-beef-hash.png", caption: "Famous Corned Beef Hash", category: "food" },
        { src: "images/owner.png", caption: "Chef Angelo at Work", category: "people" },
        { src: "images/pork-chops.png", caption: "Grilled Pork Chops", category: "food" },
        { src: "images/eggs-breakfast.png", caption: "Classic Breakfast", category: "food" },
        { src: "images/breakfast-combo.png", caption: "Breakfast Combo", category: "food" },
        { src: "images/chicken-sandwich.png", caption: "Chicken Sandwich Lunch Special", category: "food" },
        { src: "images/chicken-melt.png", caption: "Chicken Melt", category: "food" },
        { src: "images/country-fried-steak.png", caption: "Country Fried Steak & Eggs", category: "food" },
        { src: "images/omelette.png", caption: "King of the Hill Omelette", category: "food" },
        { src: "images/meatloaf-dinner.png", caption: "Homestyle Meatloaf Dinner", category: "food" },
        { src: "images/chicken-wrap.png", caption: "Chicken Wrap", category: "food" },
        { src: "images/julienne-salad.png", caption: "Julienne Salad", category: "food" },
        { src: "images/chicago-breakfast.png", caption: "The Chicago Breakfast", category: "food" }
      ],
      reviewsData: [
        {
          id: "rev_fallback_1",
          name: "Steven Piotrowski",
          initials: "SP",
          rating: 5,
          date: "3 months ago",
          text: "My favorite spot in Chicago to grab breakfast with friendly and familiar faces. Angelo, the owner and operator, treats patrons like neighbors and is always accommodating. The prices are very reasonable and the homemade quality and effort shows in every dish.",
          badge: "Local Guide",
          bg: "bg-1",
          response: "Thank you, Steven. This review made our day."
        }
      ],
      siteSettings: {
        logoText: "Yellow Rose Cafe",
        phone: "(773) 631-2397",
        address: "5640 N Elston Ave, Chicago, IL 60646",
        hours: "Monday – Sunday: 6:00 AM – 2:00 PM",
        payment: "Cash Only",
        heroTitle: "Chicago's Favorite Breakfast Spot",
        heroSubtitle: "Homemade classics, friendly faces, and the best corned beef hash in the city. Serving our neighborhood with love since 1954.",
        heroBg: "images/hero.png"
      },
      promotions: {
        topBannerActive: true,
        topBannerText: "Cash Only · Serving Chicago Since 1954"
      },
      customSections: []
    };
  }

  // Apply configurations
  applySiteSettings();
  renderCustomSections();

  // If initial load completed, render current active page
  if (currentPage === "menu") renderMenu("breakfast");
  if (currentPage === "gallery") renderGallery("all");
  if (currentPage === "reviews") renderReviews();
  
  // Re-observe dynamic reveals
  setTimeout(observeReveals, 150);
}

function applySiteSettings() {
  const settings = dbState.siteSettings || {};

  // 1. Logo text mapping
  const logoText = settings.logoText || "Yellow Rose Cafe";
  const navLogo = document.getElementById("nav-logo");
  if (navLogo) navLogo.textContent = logoText;

  const footerLogo = document.querySelector(".footer-brand-name");
  if (footerLogo) footerLogo.textContent = logoText;

  // 2. Hero Content
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle && settings.heroTitle) {
    heroTitle.innerHTML = settings.heroTitle.replace("Breakfast", `<span class="highlight">Breakfast</span>`);
  }

  const heroSubtitle = document.getElementById("hero-subtitle");
  if (heroSubtitle && settings.heroSubtitle) {
    heroSubtitle.textContent = settings.heroSubtitle;
  }

  const heroBgImg = document.getElementById("hero-bg-img");
  if (heroBgImg && settings.heroBg) {
    heroBgImg.src = settings.heroBg;
  }

  // 3. Top Banner
  const topBanner = document.getElementById("top-banner");
  const topBannerText = document.getElementById("top-banner-text");
  const promo = dbState.promotions || {};

  if (topBanner && topBannerText) {
    if (promo.topBannerActive) {
      topBanner.style.display = "flex";
      topBannerText.textContent = promo.topBannerText || "Cash Only · Serving Chicago Since 1954";
    } else {
      topBanner.style.display = "none";
    }
  }

  // 4. Contact Details
  if (settings.phone) {
    document.querySelectorAll("a[href^='tel:']").forEach((link) => {
      link.href = "tel:" + settings.phone.replace(/[^0-9]/g, "");
      if (link.textContent.toLowerCase().includes("call")) {
        link.innerHTML = `<span class="material-symbols-outlined">call</span> Call ${settings.phone}`;
      } else {
        link.textContent = settings.phone;
      }
    });
  }

  if (settings.address) {
    document.querySelectorAll(".contact-detail-text").forEach((detail) => {
      if (detail.querySelector("h4")?.textContent.toLowerCase().includes("address")) {
        const p = detail.querySelector("p");
        if (p) {
          const parts = settings.address.split(",");
          p.innerHTML = parts[0] + "<br />" + (parts[1] || "").trim() + (parts[2] ? ", " + parts[2].trim() : "");
        }
      }
    });
  }

  if (settings.hours) {
    document.querySelectorAll(".contact-detail-text").forEach((detail) => {
      if (detail.querySelector("h4")?.textContent.toLowerCase().includes("hours")) {
        const p = detail.querySelector("p");
        if (p) p.textContent = settings.hours;
      }
    });
  }

  // 5. About Us dynamic mapping
  const aboutTitle = document.getElementById("about-title");
  if (aboutTitle && settings.aboutTitle) aboutTitle.textContent = settings.aboutTitle;

  const aboutSubtitle = document.getElementById("about-subtitle");
  if (aboutSubtitle && settings.aboutSubtitle) aboutSubtitle.textContent = settings.aboutSubtitle;

  const aboutHeading = document.getElementById("about-heading");
  if (aboutHeading && settings.aboutHeading) aboutHeading.textContent = settings.aboutHeading;

  const aboutQuote = document.getElementById("about-quote");
  if (aboutQuote && settings.aboutQuote) aboutQuote.textContent = settings.aboutQuote;

  const aboutImage = document.getElementById("about-image");
  if (aboutImage && settings.aboutImage) aboutImage.src = settings.aboutImage;

  const aboutStatYear = document.getElementById("about-stat-year");
  if (aboutStatYear && settings.aboutStatYear) aboutStatYear.textContent = settings.aboutStatYear;

  const aboutStatRating = document.getElementById("about-stat-rating");
  if (aboutStatRating && settings.aboutStatRating) aboutStatRating.textContent = settings.aboutStatRating;

  const aboutStatCount = document.getElementById("about-stat-count");
  if (aboutStatCount && settings.aboutStatCount) aboutStatCount.textContent = settings.aboutStatCount;

  const aboutContentBody = document.getElementById("about-content-body");
  if (aboutContentBody && settings.aboutContent) {
    aboutContentBody.innerHTML = settings.aboutContent
      .split("\n\n")
      .map(p => `<p style="color: var(--on-surface-variant); line-height: 1.7; margin-bottom: 12px;">${p}</p>`)
      .join("");
  }
}

function renderCustomSections() {
  const container = document.getElementById("custom-sections-container");
  if (!container) return;

  const sections = dbState.customSections || [];
  container.innerHTML = sections
    .map((sec, i) => {
      if (!sec.active) return "";

      const isImageLeft = sec.layout === "left";
      const showImage = sec.image && sec.image.trim() !== "";

      let sectionHtml = "";
      if (showImage) {
        sectionHtml = `
          <div class="about-grid" style="direction: ${isImageLeft ? 'ltr' : 'rtl'}; margin-top: var(--space-xl);">
            <div class="about-image-wrapper reveal" style="direction: ltr;">
              <img src="${sec.image}" alt="${sec.title}" class="about-image" loading="lazy" />
              <div class="about-image-accent" style="${isImageLeft ? 'right: -20px; left: auto;' : 'left: -20px; right: auto;'}"></div>
            </div>
            <div class="about-content reveal" style="direction: ltr; padding: var(--space-lg);">
              <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: var(--space-sm);">${sec.title}</h2>
              ${sec.subtitle ? `<p class="font-body-lg" style="color: var(--primary); font-weight:600; margin-bottom: var(--space-md);">${sec.subtitle}</p>` : ""}
              <p style="color: var(--on-surface-variant); line-height: 1.7; white-space: pre-line;">${sec.content}</p>
            </div>
          </div>
        `;
      } else {
        sectionHtml = `
          <div class="reveal" style="max-width: 800px; margin: 0 auto; text-align: center; padding: var(--space-xl) var(--space-md);">
            <h2 class="font-display-lg" style="color: var(--on-surface); margin-bottom: var(--space-sm);">${sec.title}</h2>
            ${sec.subtitle ? `<p class="font-body-lg" style="color: var(--primary); font-weight:600; margin-bottom: var(--space-md);">${sec.subtitle}</p>` : ""}
            <p style="color: var(--on-surface-variant); line-height: 1.7; font-size: 1.05rem; white-space: pre-line;">${sec.content}</p>
          </div>
        `;
      }

      return `
        <section class="section reveal" style="background: ${i % 2 === 0 ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)'}; border-top: 1px solid var(--outline-variant); padding: var(--space-3xl) 0;">
          <div class="container">
            ${sectionHtml}
          </div>
        </section>
      `;
    })
    .join("");
}

// ==========================================
// NAVIGATION
// ==========================================

function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));

  // Show selected page
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.style.display = "block";
    target.style.animation = "none";
    target.offsetHeight; // force reflow
    target.style.animation = "fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
  }

  // Update nav links
  document.querySelectorAll(".navbar-links a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
  document.querySelectorAll(".mobile-menu a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  currentPage = page;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Initialize page-specific content
  if (page === "menu") renderMenu("breakfast");
  if (page === "gallery") renderGallery("all");
  if (page === "reviews") renderReviews();

  // Log analytics view
  logInteraction('view', page);

  // Re-observe reveals
  setTimeout(observeReveals, 100);
}

function scrollToContact() {
  setTimeout(() => {
    document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" });
  }, 300);
}

// ==========================================
// MOBILE MENU
// ==========================================

function closeMobileMenu() {
  document.getElementById("mobile-menu").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileClose = document.getElementById("mobile-menu-close");

  if (mobileBtn && mobileMenu && mobileClose) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    mobileClose.addEventListener("click", closeMobileMenu);
  }
});

// ==========================================
// MENU RENDERING
// ==========================================

function renderMenu(category) {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  const items = (dbState.menuData && dbState.menuData[category]) || [];

  // Update active tab
  document.querySelectorAll(".menu-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });

  // Category info banners
  const categoryBanners = {
    breakfast: `<div style="grid-column: 1 / -1; background: var(--primary-fixed); padding: 16px 24px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; margin-bottom: 8px; animation: fadeInUp 0.4s ease both;">
      <span class="material-symbols-outlined" style="color: var(--on-primary-fixed); font-size: 22px;">local_fire_department</span>
      <div>
        <strong style="color: var(--on-primary-fixed);">Breakfast Specials</strong>
        <span style="color: var(--on-primary-fixed); opacity: 0.8; font-size: 0.85rem;"> — Breakfast Combo $6.99 (Mon–Fri, All Day) · Special $10.99 includes coffee</span>
      </div>
    </div>`,
    lunch: `<div style="grid-column: 1 / -1; background: var(--primary-fixed); padding: 16px 24px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; margin-bottom: 8px; animation: fadeInUp 0.4s ease both;">
      <span class="material-symbols-outlined" style="color: var(--on-primary-fixed); font-size: 22px;">lunch_dining</span>
      <div>
        <strong style="color: var(--on-primary-fixed);">Lunch Specials — $10.49</strong>
        <span style="color: var(--on-primary-fixed); opacity: 0.8; font-size: 0.85rem;"> — Each lunch special includes a cup of soup, fries, and a soft drink</span>
      </div>
    </div>`,
    dinners: `<div style="grid-column: 1 / -1; background: var(--primary-fixed); padding: 16px 24px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; margin-bottom: 8px; animation: fadeInUp 0.4s ease both;">
      <span class="material-symbols-outlined" style="color: var(--on-primary-fixed); font-size: 22px;">dinner_dining</span>
      <div>
        <strong style="color: var(--on-primary-fixed);">Hot Dinners</strong>
        <span style="color: var(--on-primary-fixed); opacity: 0.8; font-size: 0.85rem;"> — Available Monday–Friday. Prepared daily by Chef Angelo</span>
      </div>
    </div>`,
    drinks: "",
  };

  const popularTags = ["popular", "featured on tv", "lunch special", "best value", "chef's pick", "homemade", "made fresh daily"];

  grid.innerHTML = (categoryBanners[category] || "") + items
    .map(
      (item, i) => `
    <div class="menu-item" style="animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s both;" onclick="logInteraction('click', 'menu_item_${item.name.toLowerCase().replace(/ /g, '_')}')">
      <img src="${item.img}" alt="${item.name}" class="menu-item-img" loading="lazy" />
      <div class="menu-item-content">
        <div class="menu-item-header">
          <h3 class="menu-item-name">${item.name}</h3>
          <span class="menu-item-price">${item.price}</span>
        </div>
        <p class="menu-item-desc">${item.desc}</p>
        ${
          item.tags && item.tags.length
            ? `<div class="menu-item-tags">${item.tags
                .map(
                  (tag) =>
                    `<span class="menu-tag ${popularTags.includes(tag) ? "popular" : ""}">${tag}</span>`
                )
                .join("")}</div>`
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");
}

// Menu tab event delegation
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.getElementById("menu-tabs");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".menu-tab");
      if (tab) renderMenu(tab.dataset.category);
    });
  }
});

// ==========================================
// GALLERY RENDERING
// ==========================================

function renderGallery(filter) {
  const masonry = document.getElementById("gallery-masonry");
  if (!masonry) return;

  // Update active filter
  document.querySelectorAll(".gallery-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  const source = dbState.galleryData || [];
  const filtered = filter === "all" ? source : source.filter((item) => item.category === filter);

  // Store for lightbox
  lightboxImages = filtered.map((item) => item.src);

  masonry.innerHTML = filtered
    .map(
      (item, i) => `
    <div class="gallery-item" style="animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s both;" onclick="openLightbox(${i})">
      <img src="${item.src}" alt="${item.caption}" loading="lazy" />
      <div class="gallery-item-overlay">
        <span class="gallery-item-caption">${item.caption}</span>
      </div>
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.getElementById("gallery-filters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-filter-btn");
      if (btn) renderGallery(btn.dataset.filter);
    });
  }
});

// ==========================================
// LIGHTBOX
// ==========================================

function openLightbox(index) {
  lightboxIndex = index;
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (lightbox && img) {
    img.src = lightboxImages[index];
    img.alt = `Gallery photo ${index + 1}`;
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
    logInteraction('click', 'view_photo');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.style.display = "none";
    document.body.style.overflow = "";
  }
}

function lightboxNav(dir) {
  if (lightboxImages.length === 0) return;
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById("lightbox-img");
  if (img) {
    img.style.opacity = "0";
    img.style.transform = "scale(0.95)";
    setTimeout(() => {
      img.src = lightboxImages[lightboxIndex];
      img.style.opacity = "1";
      img.style.transform = "scale(1)";
    }, 150);
  }
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox");
  if (lightbox && lightbox.style.display === "flex") {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxNav(-1);
    if (e.key === "ArrowRight") lightboxNav(1);
  }

  const modal = document.getElementById("review-modal");
  if (modal && modal.classList.contains("open") && e.key === "Escape") {
    closeReviewModal();
  }
});

// ==========================================
// REVIEWS RENDERING
// ==========================================

function renderReviews() {
  const list = document.getElementById("reviews-list");
  if (!list) return;

  const data = dbState.reviewsData || [];

  list.innerHTML = data
    .map(
      (review, i) => `
    <div class="review-card" style="animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both;">
      ${
        review.badge
          ? `<div class="review-card-badge">
              <span class="material-symbols-outlined">verified</span>
              ${review.badge}
             </div>`
          : ""
      }
      <div class="review-card-header">
        <div class="review-avatar ${review.bg}">${review.initials}</div>
        <div class="review-meta">
          <div class="review-name">${review.name}</div>
          <div class="review-stars-small">
            ${renderStars(review.rating)}
          </div>
        </div>
        <span class="review-date">${review.date}</span>
      </div>
      <p class="review-text">"${review.text}"</p>
      ${
        review.response
          ? `<div class="review-owner-response">
              <div class="review-owner-label">Response from the Owner</div>
              <p class="review-owner-text">${review.response}</p>
             </div>`
          : ""
      }
    </div>
  `
    )
    .join("");
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<span class="material-symbols-outlined">star</span>';
    } else if (i - 0.5 <= rating) {
      stars += '<span class="material-symbols-outlined">star_half</span>';
    } else {
      stars += '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 0;">star</span>';
    }
  }
  return stars;
}

// ==========================================
// REVIEW MODAL & SUBMIT
// ==========================================

function openReviewModal() {
  const modal = document.getElementById("review-modal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeReviewModal() {
  const modal = document.getElementById("review-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("review-form").reset();
    setRating(0);
    const preview = document.getElementById("review-photo-preview");
    if (preview) preview.innerHTML = "";
  }
}

function setRating(rating) {
  currentRating = rating;
  document.querySelectorAll("#star-rating-input .star-btn").forEach((btn) => {
    const btnRating = parseInt(btn.dataset.rating);
    btn.classList.toggle("active", btnRating <= rating);
  });
}

function handleReviewPhoto(input) {
  const preview = document.getElementById("review-photo-preview");
  if (!preview) return;
  preview.innerHTML = "";
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `
        <div class="file-preview-item">
          <img src="${e.target.result}" alt="Review photo preview" />
          <button type="button" class="file-preview-remove" onclick="this.parentElement.remove(); document.getElementById('review-photo-input').value = '';">✕</button>
        </div>
      `;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function handleReviewSubmit(e) {
  e.preventDefault();

  if (currentRating === 0) {
    showToast("Please select a star rating! 🌟");
    return;
  }

  const name = document.getElementById("review-name").value.trim();
  const text = document.getElementById("review-text").value.trim();
  const photoInput = document.getElementById("review-photo-input");

  if (!name || !text) return;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bgClasses = ["bg-1", "bg-2", "bg-3", "bg-4"];
  const bgSelected = bgClasses[Math.floor(Math.random() * bgClasses.length)];

  // Simple review structure
  const review = {
    id: "rev_" + Date.now(),
    name: name,
    initials: initials,
    rating: currentRating,
    date: "Just now",
    text: text,
    badge: null,
    bg: bgSelected,
    response: null,
    submittedAt: new Date().toISOString()
  };

  showToast("Submitting review for moderation...");

  try {
    // If they selected a photo, upload it first
    if (photoInput && photoInput.files && photoInput.files[0]) {
      const formData = new FormData();
      formData.append('file', photoInput.files[0]);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (uploadRes.ok) {
        const uploadResult = await uploadRes.json();
        review.photo = uploadResult.url;
      }
    }

    // Add to pendingReviews
    if (!dbState.pendingReviews) dbState.pendingReviews = [];
    dbState.pendingReviews.push(review);

    // Save Database state
    const response = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbState)
    });

    if (response.ok) {
      showToast("Thank you! Your review is pending approval. 🌟");
      logInteraction('click', 'review_submit');
    } else {
      showToast("Could not submit review to backend.");
    }
  } catch (err) {
    console.error("Failed to submit review:", err);
    showToast("Error connecting to server. Review not saved.");
  }

  closeReviewModal();
}

// ==========================================
// GALLERY UPLOAD
// ==========================================

function handleFileSelect(input) {
  const preview = document.getElementById("file-preview");
  if (!preview) return;
  preview.innerHTML = "";

  if (input.files) {
    Array.from(input.files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement("div");
        div.className = "file-preview-item";
        div.innerHTML = `
          <img src="${e.target.result}" alt="Upload preview ${i + 1}" />
          <button type="button" class="file-preview-remove" onclick="this.parentElement.remove();">✕</button>
        `;
        preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  }
}

async function handleGalleryUpload(e) {
  e.preventDefault();
  const name = document.getElementById("upload-name").value.trim();
  const feedback = document.getElementById("upload-feedback").value.trim();
  const fileInput = document.getElementById('file-input');

  if (!name) return;
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showToast("Please select a photo to upload!");
    return;
  }

  showToast("Uploading photo...");

  try {
    // 1. Upload photo to server
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      showToast("Upload failed: " + (err.message || "Unknown error"));
      return;
    }

    const uploadResult = await uploadRes.json();
    const imgUrl = uploadResult.url;

    // 2. Add to pendingGallery queue
    const pendingItem = {
      id: "gal_" + Date.now(),
      src: imgUrl,
      caption: `Photo by ${name}`,
      category: "people",
      feedback: feedback,
      submittedBy: name,
      submittedAt: new Date().toISOString()
    };

    if (!dbState.pendingGallery) dbState.pendingGallery = [];
    dbState.pendingGallery.push(pendingItem);

    // 3. Save DB
    const dbRes = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbState)
    });

    if (dbRes.ok) {
      showToast(`Thank you, ${name}! Photo submitted for moderation. 📸`);
      logInteraction('click', 'gallery_submit');
    } else {
      showToast("Failed to save submission metadata.");
    }
  } catch (err) {
    console.error("Gallery upload error:", err);
    showToast("Failed to communicate with server.");
  }

  // Reset form
  document.getElementById("gallery-upload-form").reset();
  const preview = document.getElementById("file-preview");
  if (preview) preview.innerHTML = "";
}

// ==========================================
// NEWSLETTER & MOCK EMAIL NOTIFICATION
// ==========================================

async function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const email = input.value.trim();
  if (!email) return;

  showToast("Subscribing...");

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    
    if (res.ok) {
      const result = await res.json();
      
      // Update our local state
      await initDb();
      
      if (result.email_sent) {
        showToast(`Subscribed! Welcome email sent to ${email} 📧`);
      } else {
        showToast(`Subscribed! Logged email ${email} in subscribers. 🌹`);
      }
      
      // Trigger the slide-in mock mail view
      openEmailToast(email);
    } else {
      showToast("Subscription failed. Please check your connection.");
    }
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    showToast("Server error subscribing to mailing list.");
  }
  input.value = "";
}

function openEmailToast(email) {
  const toast = document.getElementById("email-toast");
  if (toast) {
    toast.classList.add("show");
    logInteraction('click', 'subscribe');
  }
}

function closeEmailToast() {
  const toast = document.getElementById("email-toast");
  if (toast) {
    toast.style.animation = "slideOutRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) both";
    setTimeout(() => {
      toast.classList.remove("show");
      toast.style.animation = "";
    }, 500);
  }
}

// ==========================================
// ANALYTICS & TOASTS
// ==========================================

function logInteraction(type, label) {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: type, label: label })
  }).catch(() => {});
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-message");
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }
}

// ==========================================
// SCROLL EFFECTS & INITIALIZATION
// ==========================================

function observeReveals() {
  const reveals = document.querySelectorAll(".reveal:not(.visible)");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

function handleScroll() {
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("back-to-top");

  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }
}

function animateCounters() {
  const counters = document.querySelectorAll(".highlight-number[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + (target > 100 ? "+" : "+");
        return;
      }
      counter.textContent = Math.floor(current);
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          update();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(counter);
  });
}

// Initialization DOM Loading
document.addEventListener("DOMContentLoaded", () => {
  // Load dynamic data from DB server
  initDb();

  window.addEventListener("scroll", handleScroll, { passive: true });
  observeReveals();
  animateCounters();

  // Initial page layout
  navigateTo("home");

  const lightboxImg = document.getElementById("lightbox-img");
  if (lightboxImg) {
    lightboxImg.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
  }

  const modal = document.getElementById("review-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "review-modal") closeReviewModal();
    });
  }

  // Setup drag & drop image handlers
  const uploadArea = document.getElementById("file-upload-area");
  if (uploadArea) {
    ["dragenter", "dragover"].forEach((event) => {
      uploadArea.addEventListener(event, (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = "var(--primary)";
        uploadArea.style.background = "var(--surface-container-low)";
      });
    });

    ["dragleave", "drop"].forEach((event) => {
      uploadArea.addEventListener(event, (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = "";
        uploadArea.style.background = "";
      });
    });

    uploadArea.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      const fileInput = document.getElementById("file-input");
      if (fileInput) {
        fileInput.files = files;
        handleFileSelect(fileInput);
      }
    });
  }

  // Add click listeners to record interactions
  document.querySelectorAll("a[href^='tel:']").forEach(link => {
    link.addEventListener('click', () => logInteraction('click', 'call'));
  });

  const mapFrame = document.querySelector(".contact-map iframe");
  if (mapFrame) {
    mapFrame.parentElement.addEventListener('click', () => logInteraction('click', 'directions'));
  }

  // Poll database for updates every 3 seconds to ensure real-time changes
  setInterval(async () => {
    try {
      const response = await fetch('/api/db');
      if (response.ok) {
        const newData = await response.json();
        
        // Compare stringified versions of relevant dynamic content
        const oldDynamic = JSON.stringify({
          menuData: dbState.menuData,
          galleryData: dbState.galleryData,
          reviewsData: dbState.reviewsData,
          siteSettings: dbState.siteSettings,
          promotions: dbState.promotions,
          customSections: dbState.customSections
        });
        const newDynamic = JSON.stringify({
          menuData: newData.menuData,
          galleryData: newData.galleryData,
          reviewsData: newData.reviewsData,
          siteSettings: newData.siteSettings,
          promotions: newData.promotions,
          customSections: newData.customSections
        });
        
        if (oldDynamic !== newDynamic) {
          console.log("Database update detected! Synchronizing UI...");
          dbState = newData;
          applySiteSettings();
          renderCustomSections();
          if (currentPage === "menu") renderMenu(document.querySelector(".menu-tab.active")?.dataset.category || "breakfast");
          if (currentPage === "gallery") renderGallery(document.querySelector(".gallery-filter-btn.active")?.dataset.filter || "all");
          if (currentPage === "reviews") renderReviews();
        }
      }
    } catch (err) {
      console.warn("Real-time sync poll failed. Server might be restarting.");
    }
  }, 3000);
});
