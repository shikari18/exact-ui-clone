/**
 * SLICK TEK — Admin Dashboard Controller
 */

let currentFormImages = [];
let adminFilterQuery = '';
let orderFilterQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderAdminProducts();
  renderAdminOrders();
  updateKPIs();
  if (window.lucide) lucide.createIcons();
});

// Render Product Cards with Inline Quick-Edit
function renderAdminProducts() {
  const grid = document.getElementById('adminProductGrid');
  if (!grid) return;

  let products = ProductStore.getAll();

  if (adminFilterQuery.trim()) {
    const q = adminFilterQuery.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <i data-lucide="package-open" style="width: 36px; height: 36px; margin: 0 auto 8px auto; opacity: 0.5;"></i>
        <p style="font-weight: 700;">No products found.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = products.map(p => {
    const cover = p.images && p.images.length > 0 ? p.images[0] : 'assets/logo.svg';
    const photoCount = p.images ? p.images.length : 0;

    return `
      <div class="admin-card">
        <div class="admin-card-top">
          <div class="admin-thumb-wrap">
            <img src="${encodeURI(cover)}" alt="${p.name}" />
            <span class="admin-photo-tag">📷 ${photoCount}</span>
          </div>

          <div class="admin-card-details">
            <h4 class="admin-card-title">${p.name}</h4>
            <div class="admin-card-category">${p.category}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
              ${p.stock || 'In Stock'}
            </div>
          </div>
        </div>

        <!-- Quick Inline Price & Stock Edit -->
        <div class="quick-edit-row">
          <div style="flex:1;">
            <span class="quick-edit-label">Price (GH₵):</span>
            <input 
              type="number" 
              class="quick-input-price" 
              value="${p.price}" 
              onchange="quickUpdatePrice('${p.id}', this.value)"
              title="Change price and press enter"
            />
          </div>

          <div style="flex:1;">
            <span class="quick-edit-label">Stock:</span>
            <input 
              type="text" 
              class="quick-input-price" 
              style="width:100%;text-align:left;font-weight:600;font-size:0.8rem;" 
              value="${p.stock || ''}" 
              onchange="quickUpdateStock('${p.id}', this.value)"
              placeholder="e.g. 20 PCs"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="admin-card-actions">
          <button class="btn-card-action" onclick="copyAdminProductLink('${p.id}', this)" title="Copy direct link for customer">
            <i data-lucide="link" style="width:14px;height:14px;color:var(--primary);"></i>
            <span>Copy Link</span>
          </button>

          <button class="btn-card-action" onclick="openEditProductModal('${p.id}')">
            <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
            <span>Edit & Photos</span>
          </button>

          <button class="btn-card-action danger" onclick="confirmDeleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')">
            <i data-lucide="trash" style="width:14px;height:14px;"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  updateKPIs();
  if (window.lucide) lucide.createIcons();
}

// Quick Inline Updates
window.quickUpdatePrice = function(id, newPrice) {
  const priceNum = Number(newPrice);
  if (isNaN(priceNum) || priceNum <= 0) {
    alert("Please enter a valid price.");
    renderAdminProducts();
    return;
  }
  ProductStore.update(id, { price: priceNum });
  showToast("✅ Price updated to GH₵ " + priceNum);
  updateKPIs();
};

window.quickUpdateStock = function(id, newStock) {
  ProductStore.update(id, { stock: newStock.trim() || "In Stock" });
  showToast("✅ Stock status updated.");
// Copy Direct Product Link for WhatsApp Customers
window.copyAdminProductLink = function(productId, btn) {
  const url = window.location.origin + '/?p=' + productId;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("📋 Link copied! Ready to paste on WhatsApp");
      if (btn) {
        const oldHtml = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;color:var(--green);"></i><span>Copied!</span>`;
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
          btn.innerHTML = oldHtml;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      }
    }).catch(() => {
      prompt("Copy direct product link for WhatsApp:", url);
    });
  } else {
    prompt("Copy direct product link for WhatsApp:", url);
  }
};

// Filter Products
window.filterAdminProducts = function(query) {
  adminFilterQuery = query;
  renderAdminProducts();
};

// Modal Handling (Add / Edit)
window.openAddProductModal = function() {
  document.getElementById('editProductId').value = '';
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('btnSaveLabel').textContent = 'Save Product';
  document.getElementById('prodName').value = '';
  document.getElementById('prodCategory').value = 'projectors';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodStock').value = '20 PCs in Stock';
  document.getElementById('prodTagline').value = '';
  
  currentFormImages = [];
  renderImagePreviewStrip();

  openModal('productModal');
};

window.openEditProductModal = function(id) {
  const p = ProductStore.getById(id);
  if (!p) return;

  document.getElementById('editProductId').value = p.id;
  document.getElementById('modalTitle').textContent = 'Edit ' + p.name;
  document.getElementById('btnSaveLabel').textContent = 'Save Changes';
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodCategory').value = p.category || 'projectors';
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodStock').value = p.stock || '20 PCs in Stock';
  document.getElementById('prodTagline').value = p.tagline || '';

  currentFormImages = p.images ? [...p.images] : [];
  renderImagePreviewStrip();

  openModal('productModal');
};

window.closeProductModal = function() {
  closeModal('productModal');
};

// Image Upload Handler (FileReader converting to base64 DataURL)
window.handleImageFilesUpload = function(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentFormImages.push(e.target.result);
      renderImagePreviewStrip();
    };
    reader.readAsDataURL(file);
  });

  event.target.value = ''; // Reset input
};

window.addCustomImageUrl = function() {
  const field = document.getElementById('customImageUrl');
  const url = field.value.trim();
  if (!url) return;

  currentFormImages.push(url);
  field.value = '';
  renderImagePreviewStrip();
};

window.removeFormImage = function(index) {
  currentFormImages.splice(index, 1);
  renderImagePreviewStrip();
};

function renderImagePreviewStrip() {
  const strip = document.getElementById('imagePreviewStrip');
  if (!strip) return;

  if (currentFormImages.length === 0) {
    strip.innerHTML = `
      <div style="font-size:0.78rem;color:var(--text-muted);padding:8px 0;">
        No images added yet. Upload at least 1 image.
      </div>
    `;
    return;
  }

  strip.innerHTML = currentFormImages.map((img, idx) => `
    <div class="preview-thumb-box">
      <img src="${encodeURI(img)}" alt="Thumb ${idx + 1}" />
      <button type="button" class="btn-remove-thumb" onclick="removeFormImage(${idx})" title="Remove photo">
        ×
      </button>
      ${idx === 0 ? `
        <span style="position:absolute;bottom:0;left:0;right:0;background:rgba(245,166,35,0.9);color:#FFFFFF;font-size:8px;font-weight:800;text-align:center;padding:1px 0;">
          COVER
        </span>
      ` : ''}
    </div>
  `).join('');
}

// Save Product from Modal Form
window.saveProductFromForm = function() {
  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = Number(document.getElementById('prodPrice').value);
  const stock = document.getElementById('prodStock').value.trim();
  const tagline = document.getElementById('prodTagline').value.trim();

  if (!name) {
    alert("Please enter a product name.");
    return;
  }

  if (isNaN(price) || price <= 0) {
    alert("Please enter a valid price in GH₵.");
    return;
  }

  if (currentFormImages.length === 0) {
    alert("Please add at least 1 image for the product.");
    return;
  }

  const productData = {
    name,
    category,
    price,
    stock: stock || "In Stock",
    tagline: tagline || `${name} with fast 1–3 hour delivery`,
    images: currentFormImages
  };

  if (editId) {
    ProductStore.update(editId, productData);
    showToast("✅ Product updated successfully!");
  } else {
    ProductStore.add(productData);
    showToast("✅ New product added!");
  }

  closeProductModal();
  renderAdminProducts();
};

window.confirmDeleteProduct = function(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    ProductStore.delete(id);
    showToast("🗑️ Product deleted.");
    renderAdminProducts();
  }
};

// =========================================================================
// ORDERS MANAGER
// =========================================================================

function renderAdminOrders() {
  const tbody = document.getElementById('ordersTableBody');
  const badge = document.getElementById('tabOrdersBadge');
  if (!tbody) return;

  let orders = JSON.parse(localStorage.getItem('slick_tek_orders') || '[]');
  if (badge) badge.textContent = orders.length;

  if (orderFilterQuery.trim()) {
    const q = orderFilterQuery.toLowerCase().trim();
    orders = orders.filter(o => 
      (o.product && o.product.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted);">
          No customer orders found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders.map((ord, idx) => `
    <tr>
      <td style="font-weight:700;color:var(--primary);">${ord.id || ('ORD-' + (idx + 1))}</td>
      <td style="font-weight:700;">${ord.product}</td>
      <td style="font-weight:800;color:var(--primary);">${formatPrice(ord.price)}</td>
      <td>
        <a href="tel:${ord.phone}" style="color:var(--text-dark);font-weight:700;text-decoration:none;">
          📞 ${ord.phone}
        </a>
      </td>
      <td style="max-width:220px;">${ord.address}</td>
      <td style="font-size:0.78rem;color:var(--text-muted);">
        ${new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td>
        <a 
          href="https://wa.me/233${ord.phone.replace(/^0/, '')}?text=${encodeURIComponent('Hello! This is SLICK TEK regarding your order for ' + ord.product)}" 
          target="_blank" 
          class="btn-store-link"
          style="background:#25D366;font-size:0.75rem;padding:5px 10px;"
        >
          <span>Chat WhatsApp</span>
        </a>
      </td>
    </tr>
  `).join('');

  updateKPIs();
}

window.filterAdminOrders = function(query) {
  orderFilterQuery = query;
  renderAdminOrders();
};

window.clearAllOrders = function() {
  if (confirm("Are you sure you want to clear all received order records?")) {
    localStorage.removeItem('slick_tek_orders');
    renderAdminOrders();
    showToast("🗑️ Order history cleared.");
  }
};

// =========================================================================
// BACKUP & EXPORT
// =========================================================================

window.exportCatalogJson = function() {
  const products = ProductStore.getAll();
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `slick_tek_products_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("📥 Exported catalog JSON!");
};

window.exportCatalogJs = function() {
  const products = ProductStore.getAll();
  const fileContent = 
    `// SLICK TEK — Exported Inventory Catalog\n\n` +
    `const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};\n\n` +
    `// Product Store API (Persisted via LocalStorage + In-Memory Fallback)\n` +
    `const ProductStore = {\n` +
    `  KEY: 'slick_tek_catalog',\n` +
    `  getAll() {\n` +
    `    const raw = localStorage.getItem(this.KEY);\n` +
    `    if (!raw) { this.save(INITIAL_PRODUCTS); return INITIAL_PRODUCTS; }\n` +
    `    try { return JSON.parse(raw); } catch(e) { return INITIAL_PRODUCTS; }\n` +
    `  },\n` +
    `  save(items) {\n` +
    `    localStorage.setItem(this.KEY, JSON.stringify(items));\n` +
    `    window.PRODUCTS = items;\n` +
    `  },\n` +
    `  getById(id) { return this.getAll().find(p => p.id === id); },\n` +
    `  add(productData) { const items = this.getAll(); const newP = { id: "prod-" + Date.now(), ...productData }; items.unshift(newP); this.save(items); return newP; },\n` +
    `  update(id, updatedFields) { const items = this.getAll(); const idx = items.findIndex(p => p.id === id); if (idx !== -1) { items[idx] = { ...items[idx], ...updatedFields }; this.save(items); return items[idx]; } return null; },\n` +
    `  delete(id) { const items = this.getAll().filter(p => p.id !== id); this.save(items); },\n` +
    `  resetToDefault() { this.save(INITIAL_PRODUCTS); return INITIAL_PRODUCTS; }\n` +
    `};\n\n` +
    `window.PRODUCTS = ProductStore.getAll();\n\n` +
    `function formatPrice(amount) {\n` +
    `  return "GH₵ " + Number(amount || 0).toLocaleString();\n` +
    `}\n`;

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.js';
  a.click();
  URL.revokeObjectURL(url);
  showToast("📥 Exported updated products.js!");
};

window.confirmResetDefaults = function() {
  if (confirm("Reset catalog back to initial 10 products? Any custom products will be restored to defaults.")) {
    ProductStore.resetToDefault();
    renderAdminProducts();
    showToast("🔄 Catalog reset to default products.");
  }
};

// =========================================================================
// HELPERS & TABS
// =========================================================================

window.switchAdminTab = function(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('sectionProducts').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('sectionOrders').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('sectionBackup').style.display = tab === 'backup' ? 'block' : 'none';

  if (tab === 'products') document.getElementById('tabProductsBtn').classList.add('active');
  if (tab === 'orders') {
    document.getElementById('tabOrdersBtn').classList.add('active');
    renderAdminOrders();
  }
  if (tab === 'backup') document.getElementById('tabBackupBtn').classList.add('active');
  if (window.lucide) lucide.createIcons();
};

function updateKPIs() {
  const products = ProductStore.getAll();
  const orders = JSON.parse(localStorage.getItem('slick_tek_orders') || '[]');
  
  let totalPhotos = 0;
  products.forEach(p => {
    if (p.images) totalPhotos += p.images.length;
  });

  const pEl = document.getElementById('statTotalProducts');
  const oEl = document.getElementById('statTotalOrders');
  const phEl = document.getElementById('statTotalPhotos');

  if (pEl) pEl.textContent = products.length;
  if (oEl) oEl.textContent = orders.length;
  if (phEl) phEl.textContent = totalPhotos;
}

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

function showToast(msg) {
  const existing = document.getElementById('adminToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'adminToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #1D1D1F;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 0.88rem;
    padding: 12px 20px;
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}
