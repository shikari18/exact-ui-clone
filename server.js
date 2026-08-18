/**
 * SLICK TEK — Live Cloud Server & Storefront Backend
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to data files
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Default initial catalog
const INITIAL_PRODUCTS = [
  {
    "id": "prod-4g-solar-camera",
    "name": "4G Solar Powered Three Lense Camera",
    "category": "cameras",
    "price": 1300,
    "stock": "50 PCs in Stock",
    "tagline": "Ultra HD 360° Outdoor Security with Solar Charging",
    "images": [
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.40 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM (2).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM (2).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.47 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.47 PM.jpeg"
    ]
  },
  {
    "id": "prod-rechargeable-smart-protector",
    "name": "Rechargeable Smart Protector (Q7 Battery & Cinema Edition)",
    "category": "projectors",
    "price": 1099,
    "stock": "20 PCs in Stock",
    "tagline": "Built-in Rechargeable Battery & Cinema Quality Projection",
    "images": [
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM (1).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM (2).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.26 PM (1).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.26 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.33 PM (1).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.33 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.34 PM.jpeg"
    ]
  },
  {
    "id": "prod-projectorr",
    "name": "Projectorr (Android Cinema HD)",
    "category": "projectors",
    "price": 999,
    "stock": "10 PCs in Stock",
    "tagline": "Android 11.0 Cinema HD with Apps & WiFi Screen Mirroring",
    "images": [
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM (1).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM (2).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM.jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.48 PM (1).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.48 PM.jpeg"
    ]
  },
  {
    "id": "prod-bose-soundbar",
    "name": "Bose.st 3.1 Chanel Sound Bar",
    "category": "audio",
    "price": 899,
    "stock": "Limited Stock",
    "tagline": "Deep Subwoofer Bass & Crystal Clear Wireless Bluetooth",
    "images": [
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM (1).jpeg",
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM.jpeg"
    ]
  },
  {
    "id": "prod-philip-soundbar",
    "name": "Philip Sound Bar System",
    "category": "audio",
    "price": 850,
    "stock": "15 PCs in Stock",
    "tagline": "Surround Sound Home Cinema with Wireless Woofer",
    "images": [
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM (1).jpeg",
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM.jpeg"
    ]
  },
  {
    "id": "prod-rice-cooker-45l",
    "name": "EXLG Deluxe 4.5L Rice Cooker",
    "category": "appliances",
    "price": 350,
    "stock": "In Stock",
    "tagline": "Large Family Capacity with Automatic Keep-Warm",
    "images": [
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.04 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.05 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.05 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (3).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM.jpeg"
    ]
  },
  {
    "id": "prod-electric-kettle",
    "name": "Heavy Duty Rapid Electric Kettle",
    "category": "appliances",
    "price": 180,
    "stock": "In Stock",
    "tagline": "Rapid Boil Stainless Steel with Auto Shut-Off",
    "images": [
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.51 PM.jpeg",
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.52 PM (1).jpeg",
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.52 PM.jpeg"
    ]
  },
  {
    "id": "prod-portable-juicer",
    "name": "Portable USB Rechargeable Blender / Juicer",
    "category": "appliances",
    "price": 150,
    "stock": "In Stock",
    "tagline": "6 Stainless Blades with 4000mAh Battery",
    "images": [
      "jucifer/WhatsApp Image 2026-08-17 at 12.37.59 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.37.59 PM.jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM (2).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM.jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.16 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.16 PM.jpeg"
    ]
  },
  {
    "id": "prod-deep-tissue-massage-gun",
    "name": "Deep Tissue Percussion Massage Gun",
    "category": "wellness",
    "price": 220,
    "stock": "In Stock",
    "tagline": "6 Speed Levels with 4 Interchangeable Heads",
    "images": [
      "massage gun/WhatsApp Image 2026-08-17 at 12.38.58 PM.jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.38.59 PM (1).jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.38.59 PM (2).jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.38.59 PM.jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.39.00 PM (1).jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.39.00 PM (2).jpeg",
      "massage gun/WhatsApp Image 2026-08-17 at 12.39.00 PM.jpeg"
    ]
  },
  {
    "id": "prod-morgan-steam-iron",
    "name": "Morgan Professional Steam Iron",
    "category": "appliances",
    "price": 250,
    "stock": "In Stock",
    "tagline": "Non-Stick Soleplate with Anti-Drip & Continuous Steam",
    "images": [
      "Morgan Steam iron/WhatsApp Image 2026-08-17 at 12.38.34 PM.jpeg"
    ]
  }
];

// Helper to read/write JSON safely
function getStoredProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading products.json:', err);
  }
  // Initialize file with defaults
  saveStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(items) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing products.json:', err);
  }
}

function getStoredOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {}
  return [];
}

function saveStoredOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {}
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use(express.static(path.join(__dirname)));

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. GET Products (Live for everyone)
app.get('/api/products', (req, res) => {
  const products = getStoredProducts();
  res.json({ success: true, count: products.length, data: products });
});

// 2. POST Add Product (Admin)
app.post('/api/products', (req, res) => {
  try {
    const products = getStoredProducts();
    const newProduct = {
      id: "prod-" + Date.now(),
      name: req.body.name || "Unnamed Product",
      category: req.body.category || "projectors",
      price: Number(req.body.price) || 0,
      stock: req.body.stock || "In Stock",
      tagline: req.body.tagline || `${req.body.name} with fast 1–3 hour delivery`,
      images: Array.isArray(req.body.images) ? req.body.images : []
    };

    products.unshift(newProduct);
    saveStoredProducts(products);
    console.log(`[SLICK TEK] Added product: ${newProduct.name} (Total: ${products.length})`);
    res.json({ success: true, data: newProduct, total: products.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PUT Update Product (Price / Stock / Info)
app.put('/api/products/:id', (req, res) => {
  try {
    const products = getStoredProducts();
    const id = req.params.id;
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    products[index] = { ...products[index], ...req.body };
    saveStoredProducts(products);
    console.log(`[SLICK TEK] Updated product: ${products[index].name}`);
    res.json({ success: true, data: products[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. DELETE Product
app.delete('/api/products/:id', (req, res) => {
  try {
    let products = getStoredProducts();
    const id = req.params.id;
    products = products.filter(p => p.id !== id);
    if (products.length === 0) products = INITIAL_PRODUCTS;
    saveStoredProducts(products);
    console.log(`[SLICK TEK] Deleted product ${id} (Remaining: ${products.length})`);
    res.json({ success: true, remaining: products.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Reset Catalog to Defaults
app.post('/api/products/reset', (req, res) => {
  saveStoredProducts(INITIAL_PRODUCTS);
  res.json({ success: true, data: INITIAL_PRODUCTS });
});

// 6. Orders API
app.get('/api/orders', (req, res) => {
  const orders = getStoredOrders();
  res.json({ success: true, count: orders.length, data: orders });
});

app.post('/api/orders', (req, res) => {
  const orders = getStoredOrders();
  const newOrder = {
    id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);
  res.json({ success: true, data: newOrder });
});

app.delete('/api/orders', (req, res) => {
  saveStoredOrders([]);
  res.json({ success: true });
});

// Explicit HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", service: "SLICK TEK Live Cloud Backend", timestamp: new Date() });
});

// Catch-all fallback
app.get('*', (req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server (Bind to 0.0.0.0 for Render Linux Containers)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================`);
  console.log(`🚀 SLICK TEK Live Server running on port ${PORT}`);
  console.log(`🌐 Live Store: http://0.0.0.0:${PORT}`);
  console.log(`🔑 Admin Portal: http://0.0.0.0:${PORT}/admin.html`);
  console.log(`=============================================`);
});
