/* ================================================================
   YELLOW ROSE CAFE - Administrative Dashboard JS Controller
   ================================================================ */

let dbState = {};
let activeMenuCategory = 'breakfast';
let simulatedVisits = 4;
const recentActivities = [
  { text: "Someone clicked 'Call Cafe' link", time: "2m ago", interactive: true },
  { text: "Guest viewed Menu - Breakfast Specials", time: "4m ago", interactive: false },
  { text: "Guest from Chicago, IL viewed Home page", time: "6m ago", interactive: false },
  { text: "User subscribed to newsletter: test@example.com", time: "10m ago", interactive: true }
];

// ==========================================
// AUTHENTICATION & INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initDashboard();
});

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
  const loginOverlay = document.getElementById("login-overlay");
  const adminContainer = document.getElementById("admin-container");

  if (isLoggedIn) {
    loginOverlay.style.display = "none";
    adminContainer.style.display = "flex";
  } else {
    loginOverlay.style.display = "flex";
    adminContainer.style.display = "none";
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user, password: pass })
    });
    const result = await res.json();
    if (res.ok && result.status === "success") {
      sessionStorage.setItem("adminLoggedIn", "true");
      checkAuth();
      initDashboard();
      showToast("Welcome back, Administrator! 🌹");
    } else {
      showToast(result.message || "Invalid administrator credentials.");
    }
  } catch (err) {
    console.error("Login request failed:", err);
    // Fallback to local offline check for debugging stability
    if (user === "admin" && pass === "admin") {
      sessionStorage.setItem("adminLoggedIn", "true");
      checkAuth();
      initDashboard();
      showToast("Access granted (offline fallback) 🌹");
    } else {
      showToast("Login connection error!");
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem("adminLoggedIn");
  checkAuth();
}

// ==========================================
// CORE STATE MANAGEMENT
// ==========================================

async function loadDb() {
  try {
    const response = await fetch('/api/db');
    if (!response.ok) throw new Error("API call failed");
    dbState = await response.json();
    return dbState;
  } catch (err) {
    console.error("Failed to load DB from server:", err);
    showToast("Error connecting to server backend!");
    return null;
  }
}

async function saveDb() {
  try {
    const response = await fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dbState)
    });
    if (!response.ok) throw new Error("API POST failed");
    showToast("Changes saved successfully! 💾");
    return true;
  } catch (err) {
    console.error("Failed to save DB:", err);
    showToast("Failed to save changes to server!");
    return false;
  }
}

async function initDashboard() {
  if (sessionStorage.getItem("adminLoggedIn") !== "true") return;

  const data = await loadDb();
  if (!data) return;

  // 1. Fill statistics
  updateDashboardStats();

  // 2. Render active panel tabs
  renderMenuManager();
  renderPendingGallery();
  renderLiveGallery();
  renderPendingReviews();
  renderLiveReviews();
  renderCustomSectionsList();
  renderSubscribers();
  renderEmailLogs();
  fillSettingsForm();

  // Set up a 3-second database sync loop for the admin panel to fetch new reviews and uploads
  if (!window.adminSyncInterval) {
    window.adminSyncInterval = setInterval(async () => {
      // Don't poll if we're not logged in or if a modal is open (to avoid overwriting inputs)
      if (sessionStorage.getItem("adminLoggedIn") !== "true") return;
      
      const modalOpen = document.getElementById("menu-item-modal").style.display === "flex" || 
                        document.activeElement.classList.contains("form-input") ||
                        document.activeElement.classList.contains("form-textarea");
      if (modalOpen) return;

      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const newData = await response.json();
          // Check if pending reviews, pending gallery, subscribers, or analytics changed
          const oldStateStr = JSON.stringify({
            pendingReviews: dbState.pendingReviews,
            pendingGallery: dbState.pendingGallery,
            subscribers: dbState.subscribers,
            emailLogs: dbState.emailLogs,
            analytics: dbState.analytics,
            menuData: dbState.menuData,
            galleryData: dbState.galleryData,
            customSections: dbState.customSections,
            siteSettings: dbState.siteSettings,
            promotions: dbState.promotions
          });
          const newStateStr = JSON.stringify({
            pendingReviews: newData.pendingReviews,
            pendingGallery: newData.pendingGallery,
            subscribers: newData.subscribers,
            emailLogs: newData.emailLogs,
            analytics: newData.analytics,
            menuData: newData.menuData,
            galleryData: newData.galleryData,
            customSections: newData.customSections,
            siteSettings: newData.siteSettings,
            promotions: newData.promotions
          });

          if (oldStateStr !== newStateStr) {
            console.log("Admin DB updated on server! Reloading dashboard views...");
            dbState = newData;
            updateBadges();
            
            // Re-render whichever tab is currently open (but don't reload inputs if the user is typing)
            const activePanel = document.querySelector(".tab-panel.active");
            if (activePanel) {
              if (activePanel.id === "panel-dashboard") {
                updateDashboardStats();
              } else if (activePanel.id === "panel-menu") {
                renderMenuManager();
              } else if (activePanel.id === "panel-gallery") {
                renderPendingGallery();
                renderLiveGallery();
              } else if (activePanel.id === "panel-reviews") {
                renderPendingReviews();
                renderLiveReviews();
              } else if (activePanel.id === "panel-sections") {
                renderCustomSectionsList();
              } else if (activePanel.id === "panel-subscribers") {
                renderSubscribers();
                renderEmailLogs();
              }
            }
          }
        }
      } catch (err) {
        console.warn("Admin sync poll failed.");
      }
    }, 3000);
  }
}

function switchTab(tabId) {
  // Update nav buttons active state
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  // Show active panel
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `panel-${tabId}`);
  });

  // Set tab header text
  const titles = {
    dashboard: "Dashboard Overview & Analytics",
    menu: "Menu Offerings CMS",
    gallery: "Gallery Moderation & File Uploads",
    reviews: "Customer Reviews & Moderation Queue",
    sections: "Dynamic Homepage Sections",
    subscribers: "Subscribers Mailing List",
    settings: "Web settings & SMTP Configurations"
  };
  document.getElementById("current-tab-title").textContent = titles[tabId] || "Yellow Rose CMS";

  // Reload statistics if returning to dashboard
  if (tabId === 'dashboard') {
    updateDashboardStats();
  }
}

// ==========================================
// SIMULATIONS & ANALYTICS TICKER
// ==========================================

function updateDashboardStats() {
  const analytics = dbState.analytics || { totalVisits: 1200, interactions: 300, pageViews: {}, clicks: {} };
  
  document.getElementById("stat-total-views").textContent = analytics.totalVisits;
  document.getElementById("stat-total-interactions").textContent = analytics.interactions;
  document.getElementById("stat-subscribers").textContent = dbState.subscribers ? dbState.subscribers.length : 0;

  // Calculate real active visitors (unique IPs in the last 5 minutes)
  const activeIPs = new Set();
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const logs = dbState.activityLogs || [];
  logs.forEach(log => {
    if (log.ip && log.time) {
      const logTime = new Date(log.time.replace(' ', 'T')).getTime();
      if (logTime > fiveMinAgo) {
        activeIPs.add(log.ip);
      }
    }
  });
  const activeCount = Math.max(1, activeIPs.size); // Default to 1 (current session/admin)
  document.getElementById("stat-active-visitors").textContent = activeCount;

  // Render Page Views Bar Chart
  const chart = document.getElementById("page-views-chart");
  if (chart) {
    const views = analytics.pageViews || {};
    const maxVal = Math.max(...Object.values(views), 10);
    
    chart.innerHTML = Object.entries(views).map(([page, val]) => {
      const percentage = (val / maxVal) * 100;
      return `
        <div class="chart-bar-row">
          <span class="chart-label">${page}</span>
          <div class="chart-bar-wrapper">
            <div class="chart-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <span class="chart-val">${val}</span>
        </div>
      `;
    }).join("");
  }

  // Render activity log
  renderActivityLog();

  // Render badges
  updateBadges();
}

function updateBadges() {
  const prBadge = document.getElementById("pending-reviews-badge");
  const pendingReviewsCount = dbState.pendingReviews ? dbState.pendingReviews.length : 0;
  if (prBadge) {
    prBadge.textContent = pendingReviewsCount;
    prBadge.style.display = pendingReviewsCount > 0 ? "inline-block" : "none";
  }

  const pgBadge = document.getElementById("pending-gallery-badge");
  const pendingGalleryCount = dbState.pendingGallery ? dbState.pendingGallery.length : 0;
  if (pgBadge) {
    pgBadge.textContent = pendingGalleryCount;
    pgBadge.style.display = pendingGalleryCount > 0 ? "inline-block" : "none";
  }
}

function formatRelativeTime(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr.replace(' ', 'T')).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return "Just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return dateStr.split(" ")[0];
  } catch (e) {
    return dateStr;
  }
}

function renderActivityLog() {
  const container = document.getElementById("live-activity-log");
  if (!container) return;

  const logs = dbState.activityLogs || [];
  if (logs.length === 0) {
    container.innerHTML = `<div class="timeline-empty">No visitor activity recorded yet. Logs will appear in real time!</div>`;
    return;
  }

  container.innerHTML = logs.map(act => `
    <div class="timeline-entry">
      <span class="timeline-bullet ${act.interactive ? 'interactive' : ''}"></span>
      <div class="timeline-content">
        <div class="timeline-text">${act.text}</div>
        <div class="timeline-time">${formatRelativeTime(act.time)}</div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// MENU MANAGER CMS
// ==========================================

function filterMenuManager(category) {
  activeMenuCategory = category;
  document.querySelectorAll("#menu-mgr-tabs .tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(category === 'dinners' ? 'dinner' : category));
  });
  renderMenuManager();
}

function renderMenuManager() {
  const container = document.getElementById("menu-manager-list");
  if (!container) return;

  const items = (dbState.menuData && dbState.menuData[activeMenuCategory]) || [];

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No menu items in this category. Click 'Add Menu Item' to create one!</td></tr>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <tr>
      <td><img src="${item.img || 'images/coffee.png'}" class="item-img-cell" alt="${item.name}" /></td>
      <td style="font-weight:600; color:#fff;">${item.name}</td>
      <td style="color:var(--primary); font-weight:600;">${item.price}</td>
      <td style="max-width:320px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${item.desc}</td>
      <td>${item.tags ? item.tags.map(t => `<span class="badge" style="background:#24304f; border:1px solid #3c4f7c;">${t}</span>`).join(" ") : ""}</td>
      <td style="text-align:right;">
        <div style="display:inline-flex; gap:8px;">
          <button class="btn-icon-secondary" onclick="editMenuItem('${index}')">
            <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
          </button>
          <button class="btn-icon-danger" onclick="deleteMenuItem('${index}')">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openMenuModal() {
  document.getElementById("menu-item-modal").style.display = "flex";
  document.getElementById("menu-modal-title").textContent = "Add Menu Item";
  document.getElementById("menu-item-form").reset();
  document.getElementById("menu-item-id").value = "";
  document.getElementById("menu-photo-preview").style.display = "none";
  document.getElementById("menu-image-url").value = "";
}

function closeMenuModal() {
  document.getElementById("menu-item-modal").style.display = "none";
}

async function handleMenuPhotoSelect(input) {
  if (input.files && input.files[0]) {
    showToast("Processing photo...");
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        document.getElementById("menu-image-url").value = result.url;
        const preview = document.getElementById("menu-photo-preview");
        preview.style.backgroundImage = `url(${result.url})`;
        preview.style.display = "block";
        showToast("Photo uploaded successfully!");
      } else {
        showToast("Photo upload failed.");
      }
    } catch (err) {
      console.error(err);
      showToast("Upload API Error.");
    }
  }
}

function editMenuItem(index) {
  const item = dbState.menuData[activeMenuCategory][index];
  
  openMenuModal();
  document.getElementById("menu-modal-title").textContent = "Edit Menu Item";
  document.getElementById("menu-item-id").value = index;
  document.getElementById("menu-name").value = item.name;
  document.getElementById("menu-price").value = item.price;
  document.getElementById("menu-desc").value = item.desc;
  document.getElementById("menu-category").value = activeMenuCategory;
  document.getElementById("menu-tags").value = item.tags ? item.tags.join(", ") : "";

  if (item.img) {
    document.getElementById("menu-image-url").value = item.img;
    const preview = document.getElementById("menu-photo-preview");
    preview.style.backgroundImage = `url(${item.img})`;
    preview.style.display = "block";
  }
}

async function handleMenuItemSubmit(e) {
  e.preventDefault();
  
  const idVal = document.getElementById("menu-item-id").value;
  const name = document.getElementById("menu-name").value.trim();
  const price = document.getElementById("menu-price").value.trim();
  const desc = document.getElementById("menu-desc").value.trim();
  const category = document.getElementById("menu-category").value;
  const tagsVal = document.getElementById("menu-tags").value;
  const imgUrl = document.getElementById("menu-image-url").value || "images/coffee.png";

  const tags = tagsVal ? tagsVal.split(",").map(t => t.trim()).filter(Boolean) : [];

  const itemData = { name, price, desc, tags, img: imgUrl };

  if (idVal === "") {
    // Add Item
    if (!dbState.menuData[category]) dbState.menuData[category] = [];
    dbState.menuData[category].push(itemData);
  } else {
    // Edit Item
    const idx = parseInt(idVal);
    
    // If the category was changed, remove it from old category first
    if (category !== activeMenuCategory) {
      dbState.menuData[activeMenuCategory].splice(idx, 1);
      if (!dbState.menuData[category]) dbState.menuData[category] = [];
      dbState.menuData[category].push(itemData);
    } else {
      dbState.menuData[activeMenuCategory][idx] = itemData;
    }
  }

  const success = await saveDb();
  if (success) {
    closeMenuModal();
    filterMenuManager(category);
  }
}

async function deleteMenuItem(index) {
  if (confirm(`Are you sure you want to delete this menu item?`)) {
    dbState.menuData[activeMenuCategory].splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderMenuManager();
    }
  }
}

// ==========================================
// GALLERY MODERATION
// ==========================================

function renderPendingGallery() {
  const container = document.getElementById("pending-gallery-list");
  if (!container) return;

  const items = dbState.pendingGallery || [];
  updateBadges();

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding: 40px; color:#888;">No pending gallery submissions.</div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="gallery-pending-card">
      <img src="${item.src}" class="gallery-pending-img" />
      <div class="gallery-pending-info">
        <h4>${item.caption || 'User Upload'}</h4>
        <p style="font-size:11px;">By: ${item.submittedBy || 'Anonymous'}</p>
        ${item.feedback ? `<p style="margin-top:6px; font-style:italic;">"${item.feedback}"</p>` : ""}
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn-approve" style="padding:6px 12px; font-size:11px; flex:1;" onclick="approveGalleryItem('${index}')">Approve</button>
          <button class="btn-reject" style="padding:6px 12px; font-size:11px;" onclick="rejectGalleryItem('${index}')">✕</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderLiveGallery() {
  const container = document.getElementById("live-gallery-list");
  if (!container) return;

  const items = dbState.galleryData || [];

  if (items.length === 0) {
    container.innerHTML = `<p style="color:#888;">No photos in live gallery.</p>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="gallery-live-card">
      <img src="${item.src}" alt="${item.caption}" />
      <div class="gallery-live-card-actions">
        <button class="btn-icon-danger" onclick="deleteGalleryItem('${index}')" title="Delete Photo">
          <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
        </button>
      </div>
    </div>
  `).join("");
}

async function approveGalleryItem(index) {
  const item = dbState.pendingGallery[index];
  
  // Move to live gallery
  if (!dbState.galleryData) dbState.galleryData = [];
  dbState.galleryData.push({
    src: item.src,
    caption: item.caption,
    category: item.category || 'food'
  });

  // Remove from pending
  dbState.pendingGallery.splice(index, 1);

  const success = await saveDb();
  if (success) {
    renderPendingGallery();
    renderLiveGallery();
  }
}

async function rejectGalleryItem(index) {
  if (confirm("Are you sure you want to reject and delete this uploaded photo?")) {
    dbState.pendingGallery.splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderPendingGallery();
    }
  }
}

async function deleteGalleryItem(index) {
  if (confirm("Are you sure you want to delete this live photo?")) {
    dbState.galleryData.splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderLiveGallery();
    }
  }
}

async function handleAdminPhotoSelect(input) {
  if (input.files && input.files[0]) {
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        const preview = document.getElementById("gal-photo-preview");
        preview.style.backgroundImage = `url(${result.url})`;
        preview.style.display = "block";
        input.dataset.uploadedUrl = result.url;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function handleAdminGallerySubmit(e) {
  e.preventDefault();
  const fileInput = document.getElementById("gal-photo-file");
  const caption = document.getElementById("gal-caption").value.trim();
  const category = document.getElementById("gal-category").value;
  const uploadedUrl = fileInput.dataset.uploadedUrl;

  if (!uploadedUrl) {
    showToast("Please upload an image file first.");
    return;
  }

  dbState.galleryData.push({
    src: uploadedUrl,
    caption: caption,
    category: category
  });

  const success = await saveDb();
  if (success) {
    document.getElementById("admin-gallery-form").reset();
    document.getElementById("gal-photo-preview").style.display = "none";
    delete fileInput.dataset.uploadedUrl;
    renderLiveGallery();
  }
}

// ==========================================
// REVIEW MODERATION
// ==========================================

function renderPendingReviews() {
  const container = document.getElementById("pending-reviews-list");
  if (!container) return;

  const items = dbState.pendingReviews || [];
  updateBadges();

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; color:#888;">No pending reviews. Excellent!</div>`;
    return;
  }

  container.innerHTML = items.map((review, index) => `
    <div class="review-moderation-item">
      <div class="review-mod-header">
        <div class="review-mod-user">
          <div class="brand-avatar" style="width:36px; height:36px; border-radius:50%; font-size:14px; background:#ffb703; color:#111;">${review.initials}</div>
          <div class="review-mod-meta">
            <h4>${review.name}</h4>
            <div class="review-mod-stars">${renderStarsHtml(review.rating)}</div>
          </div>
        </div>
        <span style="font-size:12px; color:var(--text-muted);">${review.date}</span>
      </div>
      <div class="review-mod-body">"${review.text}"</div>
      
      <div class="form-group review-mod-response-input">
        <label class="form-label" style="font-size:11px;">Your Response (Replies as Owner)</label>
        <input type="text" id="reply-pending-${index}" class="form-input" style="font-size:12.5px;" placeholder="Write a thank you message..." />
      </div>

      <div class="review-mod-actions">
        <button class="btn-approve" onclick="approveReview('${index}')">Approve Review</button>
        <button class="btn-reject" onclick="rejectReview('${index}')">Reject</button>
      </div>
    </div>
  `).join("");
}

function renderLiveReviews() {
  const container = document.getElementById("live-reviews-list");
  if (!container) return;

  const items = dbState.reviewsData || [];

  if (items.length === 0) {
    container.innerHTML = `<p style="color:#888;">No live reviews found.</p>`;
    return;
  }

  container.innerHTML = items.map((review, index) => `
    <div class="review-moderation-item" style="border-left: 3px solid #22c55e;">
      <div class="review-mod-header">
        <div class="review-mod-user">
          <div class="brand-avatar" style="width:36px; height:36px; border-radius:50%; font-size:14px; background:#e2e8f0; color:#111;">${review.initials}</div>
          <div class="review-mod-meta">
            <h4>${review.name} <span class="badge" style="background:rgba(34,197,94,0.15); color:#22c55e; font-size:9px;">Live</span></h4>
            <div class="review-mod-stars">${renderStarsHtml(review.rating)}</div>
          </div>
        </div>
        <span style="font-size:12px; color:var(--text-muted);">${review.date}</span>
      </div>
      <div class="review-mod-body">"${review.text}"</div>
      
      ${review.response ? `
        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:6px; border:1px solid #202b44; margin-bottom:12px;">
          <div style="font-weight:700; font-size:11px; color:var(--primary); text-transform:uppercase;">Owner Response:</div>
          <p style="font-size:13px; margin-top:2px;">${review.response}</p>
        </div>
      ` : ""}

      <div class="form-group review-mod-response-input" style="display: flex; gap: 8px; margin-top:12px;">
        <input type="text" id="reply-live-${index}" class="form-input" style="font-size:12.5px;" placeholder="${review.response ? 'Update response...' : 'Respond to this review...'}" />
        <button class="btn-primary" style="padding: 8px 16px; font-size:12px;" onclick="replyLiveReview('${index}')">${review.response ? 'Update' : 'Send Reply'}</button>
      </div>

      <div class="review-mod-actions" style="margin-top:10px;">
        <button class="btn-reject" style="background:#dc2626; padding: 6px 12px; font-size:11px;" onclick="deleteLiveReview('${index}')">Delete Review</button>
      </div>
    </div>
  `).join("");
}

function renderStarsHtml(rating) {
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

async function approveReview(index) {
  const review = dbState.pendingReviews[index];
  const replyInput = document.getElementById(`reply-pending-${index}`);
  const replyText = replyInput ? replyInput.value.trim() : "";

  if (replyText) {
    review.response = replyText;
  }

  // Prepend to live reviews
  if (!dbState.reviewsData) dbState.reviewsData = [];
  dbState.reviewsData.unshift(review);

  // Remove from pending
  dbState.pendingReviews.splice(index, 1);

  const success = await saveDb();
  if (success) {
    renderPendingReviews();
    renderLiveReviews();
  }
}

async function rejectReview(index) {
  if (confirm("Are you sure you want to reject and delete this review?")) {
    dbState.pendingReviews.splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderPendingReviews();
    }
  }
}

async function replyLiveReview(index) {
  const replyInput = document.getElementById(`reply-live-${index}`);
  const replyText = replyInput ? replyInput.value.trim() : "";

  if (!replyText) return;

  dbState.reviewsData[index].response = replyText;
  const success = await saveDb();
  if (success) {
    replyInput.value = "";
    renderLiveReviews();
  }
}

async function deleteLiveReview(index) {
  if (confirm("Are you sure you want to delete this published review?")) {
    dbState.reviewsData.splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderLiveReviews();
    }
  }
}

// ==========================================
// DYNAMIC DYNAMIC CUSTOM SECTIONS
// ==========================================

function renderCustomSectionsList() {
  const container = document.getElementById("custom-sections-list");
  if (!container) return;

  const sections = dbState.customSections || [];

  if (sections.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; color:#888;">No custom sections added yet. Build one on the right!</div>`;
    return;
  }

  container.innerHTML = sections.map((sec, index) => `
    <div class="section-item">
      <div class="section-item-details">
        <h4>${sec.title}</h4>
        <span>Layout: ${sec.layout} · Status: <strong>${sec.active ? 'Active (Live)' : 'Disabled'}</strong></span>
      </div>
      <div class="section-item-actions">
        <button class="btn-icon-secondary" onclick="editSection('${index}')">
          <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
        </button>
        <button class="btn-icon-danger" onclick="deleteSection('${index}')">
          <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
        </button>
      </div>
    </div>
  `).join("");
}

async function handleSectionPhotoSelect(input) {
  if (input.files && input.files[0]) {
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        document.getElementById("sec-image-url").value = result.url;
        const preview = document.getElementById("sec-photo-preview");
        preview.style.backgroundImage = `url(${result.url})`;
        preview.style.display = "block";
        showToast("Section photo uploaded!");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function resetSectionForm() {
  document.getElementById("custom-section-form").reset();
  document.getElementById("section-edit-id").value = "";
  document.getElementById("sec-image-url").value = "";
  document.getElementById("sec-photo-preview").style.display = "none";
  document.getElementById("btn-cancel-section-edit").style.display = "none";
  document.getElementById("section-form-title").textContent = "Create Dynamic Section";
  document.getElementById("btn-save-section").textContent = "Create Section";
}

function editSection(index) {
  const sec = dbState.customSections[index];
  
  document.getElementById("section-form-title").textContent = "Edit Section Context";
  document.getElementById("btn-save-section").textContent = "Update Section";
  document.getElementById("btn-cancel-section-edit").style.display = "inline-flex";
  
  document.getElementById("section-edit-id").value = index;
  document.getElementById("sec-title").value = sec.title;
  document.getElementById("sec-subtitle").value = sec.subtitle || "";
  document.getElementById("sec-content").value = sec.content;
  document.getElementById("sec-layout").value = sec.layout;
  document.getElementById("sec-active").checked = sec.active;

  if (sec.image) {
    document.getElementById("sec-image-url").value = sec.image;
    const preview = document.getElementById("sec-photo-preview");
    preview.style.backgroundImage = `url(${sec.image})`;
    preview.style.display = "block";
  } else {
    document.getElementById("sec-image-url").value = "";
    document.getElementById("sec-photo-preview").style.display = "none";
  }
}

async function handleSectionSubmit(e) {
  e.preventDefault();
  
  const idVal = document.getElementById("section-edit-id").value;
  const title = document.getElementById("sec-title").value.trim();
  const subtitle = document.getElementById("sec-subtitle").value.trim();
  const content = document.getElementById("sec-content").value.trim();
  const layout = document.getElementById("sec-layout").value;
  const active = document.getElementById("sec-active").checked;
  const image = document.getElementById("sec-image-url").value;

  const sectionData = { title, subtitle, content, layout, active, image };

  if (!dbState.customSections) dbState.customSections = [];

  if (idVal === "") {
    dbState.customSections.push(sectionData);
  } else {
    dbState.customSections[parseInt(idVal)] = sectionData;
  }

  const success = await saveDb();
  if (success) {
    resetSectionForm();
    renderCustomSectionsList();
  }
}

async function deleteSection(index) {
  if (confirm("Are you sure you want to delete this custom website section?")) {
    dbState.customSections.splice(index, 1);
    const success = await saveDb();
    if (success) {
      renderCustomSectionsList();
    }
  }
}

// ==========================================
// MAILING LIST & SUBSCRIBERS
// ==========================================

function renderSubscribers() {
  const container = document.getElementById("subscribers-table-body");
  if (!container) return;

  const subs = dbState.subscribers || [];

  if (subs.length === 0) {
    container.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888;">No subscribers yet.</td></tr>`;
    return;
  }

  container.innerHTML = subs.map(sub => `
    <tr>
      <td style="font-weight:600; color:#fff;">${sub.email}</td>
      <td>${sub.date || 'N/A'}</td>
      <td><span class="badge" style="background:rgba(6,214,160,0.15); color:#06d6a0;">${sub.status || 'Active'}</span></td>
    </tr>
  `).join("");
}

function filterSubscribers() {
  const q = document.getElementById("subscriber-search").value.toLowerCase().trim();
  const container = document.getElementById("subscribers-table-body");
  if (!container) return;

  const subs = dbState.subscribers || [];
  const filtered = subs.filter(sub => sub.email.toLowerCase().includes(q));

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888;">No matching subscribers found.</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(sub => `
    <tr>
      <td style="font-weight:600; color:#fff;">${sub.email}</td>
      <td>${sub.date || 'N/A'}</td>
      <td><span class="badge" style="background:rgba(6,214,160,0.15); color:#06d6a0;">${sub.status || 'Active'}</span></td>
    </tr>
  `).join("");
}

function renderEmailLogs() {
  const container = document.getElementById("email-logs-list");
  if (!container) return;

  const logs = dbState.emailLogs || [];

  if (logs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color:#888; font-size:12px;">No outbox email transmissions.</div>`;
    return;
  }

  container.innerHTML = logs.map(log => {
    const isSuccess = log.status.toLowerCase().includes("sent");
    const isFailed = log.status.toLowerCase().includes("error") || log.status.toLowerCase().includes("fail");
    
    let statusClass = "pending";
    if (isSuccess) statusClass = "success";
    if (isFailed) statusClass = "failed";

    return `
      <div class="email-log-item">
        <div class="email-log-header">
          <span class="email-log-recipient">${log.email}</span>
          <span class="email-log-status ${statusClass}">${log.status}</span>
        </div>
        <div class="email-log-subject">${log.subject}</div>
        <div style="font-size:10px; color:#6b7280; display:flex; justify-content:space-between; margin-top:2px;">
          <span>${log.date}</span>
          <span style="font-style:italic;">Details: ${log.details || 'Processed'}</span>
        </div>
      </div>
    `;
  }).join("");
}

async function handleSendNewsletter(e) {
  e.preventDefault();
  
  const subject = document.getElementById("mail-subject").value.trim();
  const body = document.getElementById("mail-body").value.trim();
  const btn = document.getElementById("btn-send-mail");

  if (!subject || !body) return;

  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px; vertical-align:middle; margin-right:4px; animation:blink 1.5s infinite;">send</span> Sending Broadcast...`;

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: subject, body: body })
    });

    if (res.ok) {
      const result = await res.json();
      showToast(`Mailing list broadcast complete! Sent: ${result.sent_count} emails. 🚀`);
      document.getElementById("newsletter-compose-form").reset();
      
      // Reload dbState
      await loadDb();
      renderEmailLogs();
    } else {
      const err = await res.json();
      showToast("Broadcast failed: " + (err.message || "Unknown SMTP error"));
    }
  } catch (err) {
    showToast("SMTP transmission API error.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px; vertical-align:middle; margin-right:4px;">send</span> Send Broadcast Email`;
  }
}

// ==========================================
// SETTINGS CONFIGURATIONS & SMTP
// ==========================================

function fillSettingsForm() {
  const settings = dbState.siteSettings || {};
  const logoText = settings.logoText || "Yellow Rose Cafe";
  document.getElementById("set-logo").value = logoText;

  // Update admin sidebar logo title and subtitle
  const sidebarHeader = document.querySelector(".sidebar-header");
  if (sidebarHeader) {
    const titleEl = sidebarHeader.querySelector(".logo-title");
    const subtitleEl = sidebarHeader.querySelector(".logo-subtitle");
    if (titleEl) {
      const lowerText = logoText.toLowerCase();
      if (lowerText.endsWith(" cafe")) {
        titleEl.textContent = logoText.substring(0, logoText.length - 5);
        if (subtitleEl) {
          subtitleEl.textContent = "C A F E";
          subtitleEl.style.display = "";
        }
      } else if (lowerText.endsWith("cafe")) {
        titleEl.textContent = logoText.substring(0, logoText.length - 4);
        if (subtitleEl) {
          subtitleEl.textContent = "C A F E";
          subtitleEl.style.display = "";
        }
      } else {
        titleEl.textContent = logoText;
        if (subtitleEl) {
          subtitleEl.style.display = "none";
        }
      }
    }
  }

  document.getElementById("set-phone").value = settings.phone || "(773) 631-2397";
  document.getElementById("set-address").value = settings.address || "5640 N Elston Ave, Chicago, IL 60646";
  document.getElementById("set-hours").value = settings.hours || "Monday – Sunday: 6:00 AM – 2:00 PM";
  document.getElementById("set-hero-title").value = settings.heroTitle || "Chicago's Favorite Breakfast Spot";
  document.getElementById("set-hero-subtitle").value = settings.heroSubtitle || "";

  if (settings.heroBg) {
    document.getElementById("set-hero-bg-url").value = settings.heroBg;
    const preview = document.getElementById("hero-bg-preview");
    preview.style.backgroundImage = `url(${settings.heroBg})`;
    preview.style.display = "block";
  }

  document.getElementById("set-about-title").value = settings.aboutTitle || "";
  document.getElementById("set-about-subtitle").value = settings.aboutSubtitle || "";
  document.getElementById("set-about-heading").value = settings.aboutHeading || "";
  document.getElementById("set-about-content").value = settings.aboutContent || "";
  document.getElementById("set-about-quote").value = settings.aboutQuote || "";
  document.getElementById("set-about-stat-year").value = settings.aboutStatYear || "1954";
  document.getElementById("set-about-stat-rating").value = settings.aboutStatRating || "4.7★";
  document.getElementById("set-about-stat-count").value = settings.aboutStatCount || "555+";

  if (settings.aboutImage) {
    document.getElementById("set-about-image-url").value = settings.aboutImage;
    const preview = document.getElementById("about-image-preview");
    preview.style.backgroundImage = `url(${settings.aboutImage})`;
    preview.style.display = "block";
  } else {
    document.getElementById("set-about-image-url").value = "images/owner.png";
    const preview = document.getElementById("about-image-preview");
    preview.style.display = "none";
  }

  const promo = dbState.promotions || {};
  document.getElementById("set-promo-active").checked = promo.topBannerActive;
  document.getElementById("set-promo-text").value = promo.topBannerText || "";

  // Fill SMTP setup
  const smtp = dbState.smtpSettings || {};
  document.getElementById("smtp-host").value = smtp.host || "";
  document.getElementById("smtp-port").value = smtp.port || 587;
  document.getElementById("smtp-user").value = smtp.username || "";
  document.getElementById("smtp-pass").value = smtp.password || "";
  document.getElementById("smtp-from").value = smtp.fromEmail || "";
  document.getElementById("smtp-tls").checked = smtp.useTls !== false;
}

async function handleHeroBgSelect(input) {
  if (input.files && input.files[0]) {
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        document.getElementById("set-hero-bg-url").value = result.url;
        const preview = document.getElementById("hero-bg-preview");
        preview.style.backgroundImage = `url(${result.url})`;
        preview.style.display = "block";
        showToast("Hero photo uploaded!");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function handleAboutImageSelect(input) {
  if (input.files && input.files[0]) {
    showToast("Processing biography photo...");
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        document.getElementById("set-about-image-url").value = result.url;
        const preview = document.getElementById("about-image-preview");
        preview.style.backgroundImage = `url(${result.url})`;
        preview.style.display = "block";
        showToast("Biography photo uploaded successfully!");
      } else {
        showToast("Biography photo upload failed.");
      }
    } catch (err) {
      console.error(err);
      showToast("Upload API Error.");
    }
  }
}

async function handleSiteSettingsSubmit(e) {
  e.preventDefault();

  dbState.siteSettings = {
    logoText: document.getElementById("set-logo").value.trim(),
    phone: document.getElementById("set-phone").value.trim(),
    address: document.getElementById("set-address").value.trim(),
    hours: document.getElementById("set-hours").value.trim(),
    heroTitle: document.getElementById("set-hero-title").value.trim(),
    heroSubtitle: document.getElementById("set-hero-subtitle").value.trim(),
    heroBg: document.getElementById("set-hero-bg-url").value || "images/hero.png",
    aboutTitle: document.getElementById("set-about-title").value.trim(),
    aboutSubtitle: document.getElementById("set-about-subtitle").value.trim(),
    aboutHeading: document.getElementById("set-about-heading").value.trim(),
    aboutContent: document.getElementById("set-about-content").value.trim(),
    aboutQuote: document.getElementById("set-about-quote").value.trim(),
    aboutImage: document.getElementById("set-about-image-url").value || "images/owner.png",
    aboutStatYear: document.getElementById("set-about-stat-year").value.trim(),
    aboutStatRating: document.getElementById("set-about-stat-rating").value.trim(),
    aboutStatCount: document.getElementById("set-about-stat-count").value.trim()
  };

  dbState.promotions = {
    topBannerActive: document.getElementById("set-promo-active").checked,
    topBannerText: document.getElementById("set-promo-text").value.trim()
  };

  // Log admin action
  if (!dbState.activityLogs) dbState.activityLogs = [];
  dbState.activityLogs.unshift({
    ip: "127.0.0.1",
    text: "Administrator updated site and About Us settings",
    time: new Date().toISOString().replace('T', ' ').slice(0, 19),
    interactive: true
  });
  dbState.activityLogs = dbState.activityLogs.slice(0, 100);

  const success = await saveDb();
  if (success) {
    fillSettingsForm();
  }
}

async function handleSmtpSettingsSubmit(e) {
  e.preventDefault();

  dbState.smtpSettings = {
    host: document.getElementById("smtp-host").value.trim(),
    port: parseInt(document.getElementById("smtp-port").value),
    username: document.getElementById("smtp-user").value.trim(),
    password: document.getElementById("smtp-pass").value.trim(),
    fromEmail: document.getElementById("smtp-from").value.trim(),
    useTls: document.getElementById("smtp-tls").checked
  };

  const success = await saveDb();
  if (success) {
    fillSettingsForm();
  }
}

async function testSmtpConnection() {
  const host = document.getElementById("smtp-host").value.trim();
  const user = document.getElementById("smtp-user").value.trim();
  const testBox = document.getElementById("smtp-test-result");

  if (!host || !user) {
    showToast("Please fill in SMTP Host and Username to test connection.");
    return;
  }

  // Save current settings first to be sure
  dbState.smtpSettings = {
    host: host,
    port: parseInt(document.getElementById("smtp-port").value),
    username: user,
    password: document.getElementById("smtp-pass").value.trim(),
    fromEmail: document.getElementById("smtp-from").value.trim(),
    useTls: document.getElementById("smtp-tls").checked
  };
  await saveDb();

  testBox.style.display = "block";
  testBox.style.background = "#1e293b";
  testBox.style.color = "#9ca3af";
  testBox.textContent = "Connecting to SMTP server and sending test email...";

  try {
    // We send a subscription event to the SMTP email sender
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.email_sent) {
        testBox.style.background = "rgba(6, 214, 160, 0.1)";
        testBox.style.color = "#06d6a0";
        testBox.innerHTML = `<strong>Success!</strong> Sent a test welcome email to <u>${user}</u>. Check your inbox!`;
      } else {
        testBox.style.background = "rgba(255, 183, 3, 0.1)";
        testBox.style.color = "#ffb703";
        testBox.innerHTML = `<strong>Warning:</strong> Saved to DB, but email not dispatched. Details: <em>${result.email_status}</em>`;
      }
      
      // Reload email logs
      await loadDb();
      renderEmailLogs();
    } else {
      const err = await response.json();
      testBox.style.background = "rgba(239, 71, 111, 0.1)";
      testBox.style.color = "#ef476f";
      testBox.textContent = "SMTP Test Failed: " + (err.message || "Unknown connection error");
    }
  } catch (err) {
    testBox.style.background = "rgba(239, 71, 111, 0.1)";
    testBox.style.color = "#ef476f";
    testBox.textContent = "SMTP Connection request failed: " + err;
  }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message) {
  const toast = document.getElementById("admin-toast");
  const msgEl = document.getElementById("admin-toast-message");
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }
}

async function handleChangeCredentials(e) {
  e.preventDefault();
  const newUser = document.getElementById("new-admin-username").value.trim();
  const newPass = document.getElementById("new-admin-password").value.trim();
  const confirmPass = document.getElementById("confirm-admin-password").value.trim();

  if (newPass !== confirmPass) {
    showToast("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch('/api/admin/change-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: newUser, password: newPass })
    });
    const result = await res.json();
    if (res.ok && result.status === "success") {
      showToast("Login credentials updated successfully! 🔐");
      document.getElementById("admin-credentials-form").reset();
      loadDb();
    } else {
      showToast(result.message || "Failed to update credentials.");
    }
  } catch (err) {
    console.error("Failed to change credentials:", err);
    showToast("Error updating login credentials.");
  }
}
