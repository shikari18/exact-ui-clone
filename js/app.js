/**
 * SLICK TEK — Exact UI Clone Application Controller
 */

const OWNER_WHATSAPP = "233509737543"; // 0509737543

let selectedProduct = null;
let detectedGpsCoords = null;
let activeCategory = 'all';
let searchQuery = '';
let countdownInterval = null;
let favorites = JSON.parse(localStorage.getItem('slick_tek_favs') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid();
  updateOrdersBadge();
  initEvents();
  checkUrlDirectProduct();
  if (window.lucide) lucide.createIcons();
});

// Check if a direct product link was opened (e.g. ?p=prod-projectorr or #prod-projectorr)
function checkUrlDirectProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('p') || urlParams.get('product') || urlParams.get('id') || window.location.hash.replace('#', '');
  
  if (targetId) {
    const p = ProductStore.getById(targetId) || ProductStore.getAll().find(item => item.id === targetId || item.id.includes(targetId) || item.name.toLowerCase().includes(targetId.toLowerCase()));
    if (p) {
      setTimeout(() => {
        openOrderModal(p.id);
        const card = document.querySelector(`[data-product-id="${p.id}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
}

// Render Exact Product Grid matching clone cards
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let items = ProductStore.getAll();

  if (activeCategory !== 'all') {
    items = items.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 10px;color:var(--muted-foreground);">
        <i data-lucide="search-x" style="width:36px;height:36px;margin:0 auto 8px auto;opacity:0.6;"></i>
        <p style="font-size:0.95rem;font-weight:700;">No matching products found</p>
        <p style="font-size:0.8rem;margin-top:4px;">Try searching for another keyword or view all categories.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = items.map(p => {
    const coverImage = p.images[0];
    const isFav = favorites.includes(p.id);

    return `
      <article class="product-card" onclick="openOrderModal('${p.id}')">
        <!-- Favorite Heart Icon -->
        <button 
          type="button" 
          class="btn-card-heart ${isFav ? 'active' : ''}" 
          onclick="toggleFavorite('${p.id}', event)" 
          aria-label="Favorite"
        >
          <i data-lucide="heart" style="width:16px;height:16px;${isFav ? 'fill:currentColor;' : ''}"></i>
        </button>

        <!-- Product Image Frame -->
        <div class="card-img-frame">
          <img src="${encodeURI(coverImage)}" alt="${p.name}" loading="lazy" />
        </div>

        <!-- Details -->
        <div>
          <h4 class="card-title">${p.name}</h4>
          <div class="card-stock">📦 ${p.stock}</div>
          <div class="card-price">${formatPrice(p.price)}</div>

          <div class="card-delivery-badge">
            <i data-lucide="zap" style="width:12px;height:12px;fill:currentColor;"></i>
            <span>1–3 HRS DELIVERY</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Search Filter
window.handleSearch = function(query) {
  searchQuery = query;
  renderProductGrid();
};

// Category Filter
window.filterByCategory = function(category) {
  activeCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  renderProductGrid();
  scrollToProducts();
};

// Scroll to Products
window.scrollToProducts = function() {
  const el = document.getElementById('popularPicksHeader');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Favorite Toggle
window.toggleFavorite = function(productId, event) {
  event.stopPropagation();
  const idx = favorites.indexOf(productId);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(productId);
  }
  localStorage.setItem('slick_tek_favs', JSON.stringify(favorites));
  renderProductGrid();
};

window.showFavorites = function() {
  if (favorites.length === 0) {
    alert("You have no favorite items saved yet! Tap the heart icon on any product to save it.");
    return;
  }
  const grid = document.getElementById('productGrid');
  const favItems = PRODUCTS.filter(p => favorites.includes(p.id));
  activeCategory = 'all';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  
  grid.innerHTML = favItems.map(p => {
    return `
      <article class="product-card" onclick="openOrderModal('${p.id}')">
        <button type="button" class="btn-card-heart active" onclick="toggleFavorite('${p.id}', event)">
          <i data-lucide="heart" style="width:16px;height:16px;fill:currentColor;"></i>
        </button>
        <div class="card-img-frame">
          <img src="${encodeURI(p.images[0])}" alt="${p.name}" loading="lazy" />
        </div>
        <div>
          <h4 class="card-title">${p.name}</h4>
          <div class="card-stock">📦 ${p.stock}</div>
          <div class="card-price">${formatPrice(p.price)}</div>
          <div class="card-delivery-badge">
            <i data-lucide="zap" style="width:12px;height:12px;fill:currentColor;"></i>
            <span>1–3 HRS DELIVERY</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
  if (window.lucide) lucide.createIcons();
  scrollToProducts();
};

// Switch Bottom Nav Tab
window.switchNavTab = function(btn, tab) {
  document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (tab === 'home') {
    activeCategory = 'all';
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.category-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    renderProductGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Open Quick Order Modal with Slideable Photo Gallery
window.openOrderModal = function(productId) {
  const product = ProductStore.getById(productId) || ProductStore.getAll().find(p => p.id === productId);
  if (!product) return;

  selectedProduct = product;
  const totalImgs = product.images.length;
  const hasMultiple = totalImgs > 1;

  // Sync URL for direct link sharing
  const shareUrl = window.location.origin + window.location.pathname + '?p=' + product.id;
  try {
    history.replaceState(null, '', '?p=' + product.id);
  } catch (e) {}

  const container = document.getElementById('sheetProductRecap');

  container.innerHTML = `
    <!-- Multi-Image Carousel inside the Modal -->
    <div class="modal-gallery-box">
      ${hasMultiple ? `
        <div class="modal-slider-pill" id="modalSlidePill">1 / ${totalImgs}</div>
        <button class="modal-arrow-btn prev" onclick="slideModalImg(-1)" aria-label="Previous">
          <i data-lucide="chevron-left" style="width:18px;height:18px;"></i>
        </button>
        <button class="modal-arrow-btn next" onclick="slideModalImg(1)" aria-label="Next">
          <i data-lucide="chevron-right" style="width:18px;height:18px;"></i>
        </button>
      ` : ''}

      <div class="modal-gallery-track" id="modalGalleryTrack" onscroll="handleModalGalleryScroll(${totalImgs})">
        ${product.images.map((img, idx) => `
          <img src="${encodeURI(img)}" alt="${product.name} - Photo ${idx + 1}" class="modal-slide-img" />
        `).join('')}
      </div>

      ${hasMultiple ? `
        <!-- Thumbnail Strip -->
        <div class="modal-thumb-strip" id="modalThumbStrip">
          ${product.images.map((img, idx) => `
            <img 
              src="${encodeURI(img)}" 
              alt="Thumb ${idx + 1}" 
              class="modal-thumb-item ${idx === 0 ? 'active' : ''}" 
              onclick="goToModalSlide(${idx})"
            />
          `).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Product Title & Price Row -->
    <div class="modal-product-title-row">
      <div>
        <div style="font-size:0.75rem;font-weight:700;color:var(--accent-foreground);margin-bottom:2px;">
          📦 ${product.stock}
        </div>
        <h3>${product.name}</h3>
      </div>
      <div class="modal-price">${formatPrice(product.price)}</div>
    </div>

    <!-- Share Direct Link Buttons -->
    <div class="modal-share-row">
      <button type="button" class="btn-share-link" onclick="copyDirectProductLink('${product.id}', this)" title="Copy direct link to send to customer">
        <i data-lucide="link" style="width:14px;height:14px;"></i>
        <span>Copy Item Link</span>
      </button>

      <a 
        href="https://wa.me/?text=${encodeURIComponent('Check out ' + product.name + ' on SLICK TEK (GH₵ ' + Number(product.price).toLocaleString() + '): ' + shareUrl)}" 
        target="_blank" 
        class="btn-share-whatsapp"
        title="Send direct link via WhatsApp"
      >
        <i data-lucide="message-circle" style="width:14px;height:14px;"></i>
        <span>Share to WhatsApp</span>
      </a>
    </div>
  `;

  // Reset GPS states
  document.getElementById('gpsLabel').textContent = "📍 Allow Current Location (Auto-Fill)";
  document.getElementById('gpsMsg').style.display = "none";

  openModal('orderModal');
  if (window.lucide) lucide.createIcons();
};

window.copyDirectProductLink = function(productId, btn) {
  const url = window.location.origin + window.location.pathname + '?p=' + productId;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;color:#137734;"></i> <span>Link Copied!</span>`;
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
          btn.innerHTML = oldText;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      }
    }).catch(() => {
      prompt("Copy direct product link:", url);
    });
  } else {
    prompt("Copy direct product link:", url);
  }
};

// Modal Gallery Navigation
window.slideModalImg = function(direction) {
  const track = document.getElementById('modalGalleryTrack');
  if (!track) return;
  const width = track.clientWidth;
  track.scrollBy({ left: direction * width, behavior: 'smooth' });
};

window.goToModalSlide = function(index) {
  const track = document.getElementById('modalGalleryTrack');
  if (!track) return;
  const width = track.clientWidth;
  track.scrollTo({ left: index * width, behavior: 'smooth' });
};

window.handleModalGalleryScroll = function(total) {
  const track = document.getElementById('modalGalleryTrack');
  const pill = document.getElementById('modalSlidePill');
  const thumbs = document.querySelectorAll('.modal-thumb-item');
  if (!track) return;

  const width = track.clientWidth;
  const currentIdx = Math.round(track.scrollLeft / width);

  if (pill) {
    pill.textContent = `${Math.min(currentIdx + 1, total)} / ${total}`;
  }

  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === currentIdx);
  });
};

// Geolocation Auto-Fill
async function handleAutoLocation() {
  const label = document.getElementById('gpsLabel');
  const msg = document.getElementById('gpsMsg');
  const addressField = document.getElementById('addressInput');

  label.textContent = "📍 Locating via GPS...";
  msg.style.display = "block";
  msg.style.color = "var(--primary)";
  msg.textContent = "Accessing device satellite GPS...";

  try {
    const geo = await GeoService.getAutoAddress((status) => {
      msg.textContent = status;
    });

    detectedGpsCoords = geo.coords;
    addressField.value = geo.formattedAddress;
    label.textContent = "✅ Address Auto-Filled";
    msg.textContent = `GPS Pin on Map: ${geo.coords.latitude.toFixed(4)}, ${geo.coords.longitude.toFixed(4)}`;
    msg.style.color = "var(--green-text)";
  } catch (err) {
    label.textContent = "📍 Tap to Retry Location";
    msg.style.color = "var(--primary)";
    msg.innerHTML = `
      Could not auto-detect GPS.<br>
      <a href="javascript:void(0)" onclick="fillSampleAddress()" style="color:var(--primary);font-weight:700;text-decoration:underline;">
        Tap here to fill sample address
      </a>
    `;
  }
}

window.fillSampleAddress = function() {
  const demo = GeoService.getDemoLocation();
  detectedGpsCoords = demo.coords;
  document.getElementById('addressInput').value = demo.formattedAddress;
  document.getElementById('gpsLabel').textContent = "✅ Address Filled";
  document.getElementById('gpsMsg').style.display = "none";
};

// Submit Order (Opens WhatsApp directly to 0509737543 with Google Maps Pin)
window.submitOrder = function() {
  const phone = document.getElementById('phoneInput').value.trim();
  const address = document.getElementById('addressInput').value.trim();

  if (!phone || phone.length < 7) {
    alert("Please enter a valid phone number for the delivery call.");
    document.getElementById('phoneInput').focus();
    return;
  }

  if (!address || address.length < 5) {
    alert("Please provide your delivery address or allow current location.");
    document.getElementById('addressInput').focus();
    return;
  }

  // Build Google Maps pin link
  const mapsLink = detectedGpsCoords 
    ? `https://maps.google.com/?q=${detectedGpsCoords.latitude},${detectedGpsCoords.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // Store order in local orders log
  const orderRecord = {
    id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    product: selectedProduct.name,
    price: selectedProduct.price,
    phone: phone,
    address: address,
    mapsLink: mapsLink,
    timestamp: new Date().toISOString()
  };

  const existingOrders = JSON.parse(localStorage.getItem('slick_tek_orders') || '[]');
  existingOrders.unshift(orderRecord);
  localStorage.setItem('slick_tek_orders', JSON.stringify(existingOrders));
  updateOrdersBadge();

  // Send background notification if configured
  sendBackgroundWhatsAppAlert(orderRecord);

  // Format WhatsApp Order Message directly to 0509737543
  const whatsappMsg = `🛒 *NEW ORDER ON SLICK TEK*\n\n` +
    `📦 *Item:* ${selectedProduct.name}\n` +
    `💰 *Price (Pay on Delivery):* ${formatPrice(selectedProduct.price)}\n\n` +
    `👤 *Customer Phone:* ${phone}\n` +
    `📍 *Delivery Address:* ${address}\n` +
    `🗺️ *Google Maps Location:* ${mapsLink}\n\n` +
    `⚡ *Delivery Speed:* 1–3 Hours Express\n` +
    `💵 *Payment:* 100% Pay on Delivery`;

  const targetWhatsApp = localStorage.getItem('slick_tek_alert_phone') || OWNER_WHATSAPP;
  const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(whatsappMsg)}`;

  // Open WhatsApp directly to 0509737543
  window.open(whatsappUrl, '_blank');

  // Close Order Sheet & Show On-Screen Confirmation to Customer
  closeModal('orderModal');

  const receipt = document.getElementById('receiptBox');
  receipt.innerHTML = `
    <div class="receipt-row">
      <span style="color:var(--muted-foreground);">Item Ordered:</span>
      <span style="font-weight:700;">${selectedProduct.name}</span>
    </div>
    <div class="receipt-row">
      <span style="color:var(--muted-foreground);">Contact Phone:</span>
      <span>${phone}</span>
    </div>
    <div class="receipt-row">
      <span style="color:var(--muted-foreground);">Delivery Address:</span>
      <span style="max-width:220px;text-align:right;">${address}</span>
    </div>
    <div class="receipt-row">
      <span style="color:var(--muted-foreground);">Google Maps Pin:</span>
      <a href="${mapsLink}" target="_blank" style="color:var(--primary);font-weight:700;text-decoration:underline;font-size:0.78rem;">
        View on Google Maps 📍
      </a>
    </div>
    <div class="receipt-row total">
      <span>Amount to Pay on Delivery:</span>
      <span style="color:var(--primary);font-size:1.05rem;">${formatPrice(selectedProduct.price)}</span>
    </div>
    <div style="margin-top:8px;padding:8px 10px;background:#FFFFFF;border-radius:8px;border:1px solid var(--border);font-size:0.8rem;color:var(--foreground);">
      ✅ Order sent directly to WhatsApp! Courier is dispatching.
    </div>
    <div style="margin-top:6px;color:var(--green-text);font-size:0.8rem;font-weight:700;">
      💵 Pay upon arrival via Cash, POS or Mobile Money (MOMO).
    </div>
  `;

  startCountdown(90 * 60); // 1h 30m countdown
  openModal('successModal');
  if (window.lucide) lucide.createIcons();
};

function startCountdown(durationSec) {
  if (countdownInterval) clearInterval(countdownInterval);

  let remaining = durationSec;
  const display = document.getElementById('liveCountdown');

  function tick() {
    if (remaining <= 0) {
      if (display) display.textContent = "ARRIVING NOW";
      clearInterval(countdownInterval);
      return;
    }

    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    if (display) {
      display.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    remaining--;
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

// Send Automated WhatsApp Alert in background
function sendBackgroundWhatsAppAlert(order) {
  const apiKey = localStorage.getItem('slick_tek_callmebot_key');
  const ownerPhone = localStorage.getItem('slick_tek_alert_phone') || OWNER_WHATSAPP;
  
  if (!apiKey) return;

  const text = `📦 *NEW ORDER ON SLICK TEK!*\n\n` +
    `🛒 *Product:* ${order.product}\n` +
    `💰 *Amount (POD):* GH₵ ${Number(order.price).toLocaleString()}\n` +
    `📞 *Customer Phone:* ${order.phone}\n` +
    `📍 *Delivery Address:* ${order.address}\n` +
    `⏰ *Time:* ${new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n` +
    `💬 *Chat Customer:* https://wa.me/233${order.phone.replace(/^0/, '')}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${ownerPhone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
  
  try {
    fetch(url, { mode: 'no-cors' }).catch(() => {});
  } catch (e) {}
}

// Orders Manager Dashboard
function updateOrdersBadge() {
  const existing = JSON.parse(localStorage.getItem('slick_tek_orders') || '[]');
  const count = existing.length;
  const b1 = document.getElementById('ordersCountBadge');
  const b2 = document.getElementById('ordersCartBadge');
  if (b1) b1.textContent = count;
  if (b2) b2.textContent = count;
}

window.openOrdersManager = function() {
  closeDrawer();
  const existing = JSON.parse(localStorage.getItem('slick_tek_orders') || '[]');
  const container = document.getElementById('ordersListContainer');

  if (existing.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px 10px;color:var(--muted-foreground);">
        <i data-lucide="inbox" style="width:36px;height:36px;margin:0 auto 8px auto;opacity:0.5;"></i>
        <p style="font-size:0.9rem;font-weight:600;">No orders received yet.</p>
        <p style="font-size:0.75rem;margin-top:2px;">New customer orders will appear here automatically.</p>
      </div>
    `;
  } else {
    container.innerHTML = existing.map((ord) => `
      <div style="background:var(--muted);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:5px;font-size:0.84rem;border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--foreground);font-size:0.9rem;">${ord.product}</strong>
          <span style="color:var(--primary);font-weight:800;">${formatPrice(ord.price)}</span>
        </div>
        <div style="color:var(--foreground);display:flex;align-items:center;gap:4px;">
          <i data-lucide="phone" style="width:12px;height:12px;"></i>
          <a href="tel:${ord.phone}" style="color:var(--foreground);font-weight:700;text-decoration:none;">${ord.phone}</a>
        </div>
        <div style="color:var(--muted-foreground);display:flex;align-items:flex-start;gap:4px;">
          <i data-lucide="map-pin" style="width:12px;height:12px;margin-top:2px;"></i>
          <span>${ord.address}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;padding-top:4px;border-top:1px solid rgba(0,0,0,0.06);font-size:0.72rem;color:var(--muted-foreground);">
          <span>${new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <a href="https://wa.me/233${ord.phone.replace(/^0/, '')}" target="_blank" style="color:var(--green-text);font-weight:700;text-decoration:none;">
            Chat Customer on WhatsApp →
          </a>
        </div>
      </div>
    `).join('');
  }

  openModal('ordersManagerModal');
  if (window.lucide) lucide.createIcons();
};

// Modals & Drawer Helpers
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openDrawer() {
  const drawer = document.getElementById('menuDrawer');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDrawer() {
  const drawer = document.getElementById('menuDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.openContactModal = function() {
  alert("SLICK TEK Express Doorstep Tech Delivery.\nWhatsApp Support: +233 248191726");
};

// Event Bindings
function initEvents() {
  document.getElementById('btnOpenMenu')?.addEventListener('click', openDrawer);
  document.getElementById('btnCloseMenu')?.addEventListener('click', closeDrawer);

  document.getElementById('menuDrawer')?.addEventListener('click', (e) => {
    if (e.target.id === 'menuDrawer') closeDrawer();
  });

  document.getElementById('btnCloseOrderModal')?.addEventListener('click', () => closeModal('orderModal'));
  document.getElementById('btnDone')?.addEventListener('click', () => closeModal('successModal'));

  document.getElementById('btnGps')?.addEventListener('click', handleAutoLocation);

  document.querySelectorAll('.sheet-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });
}
