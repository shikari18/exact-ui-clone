// SLICK TEK — Unified Catalog Manager (Storefront + Admin Portal)

const INITIAL_PRODUCTS = [
  {
    id: "prod-4g-solar-camera",
    name: "4G Solar Powered Three Lense Camera",
    stock: "50 PCs in Stock",
    price: 1300,
    category: "cameras",
    images: [
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.40 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.41 PM (2).jpeg"
    ]
  },
  {
    id: "prod-rechargeable-smart-protector",
    name: "Rechargeable Smart Protector (Q7 Battery & 360°)",
    stock: "20 PCs in Stock",
    price: 1099,
    category: "projectors",
    images: [
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM (2).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.46 PM.jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.47 PM (1).jpeg",
      "4G solar powered three lense  camera/WhatsApp Image 2026-08-17 at 12.38.47 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM (1).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.25 PM (2).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.26 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.26 PM (1).jpeg"
    ]
  },
  {
    id: "prod-projectorr",
    name: "Projectorr (Android Cinema HD)",
    stock: "10 PCs in Stock",
    price: 999,
    category: "projectors",
    images: [
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM (1).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM (2).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.47 PM.jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.48 PM (1).jpeg",
      "projectr/WhatsApp Image 2026-08-17 at 12.35.48 PM.jpeg"
    ]
  },
  {
    id: "prod-bose-soundbar",
    name: "Bose.st 3.1 Chanel Sound Bar",
    stock: "Limited Stock",
    price: 899,
    category: "audio",
    images: [
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.16 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.14 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.15 PM.jpeg"
    ]
  },
  {
    id: "prod-philips-soundbar-woofer",
    name: "Philips Sound Bar and Woofer",
    stock: "20 PCs in Stock",
    price: 1350,
    category: "audio",
    images: [
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM (1).jpeg",
      "philip sound bar/WhatsApp Image 2026-08-17 at 12.38.17 PM.jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.16 PM (1).jpeg"
    ]
  },
  {
    id: "prod-rice-cooker",
    name: "Rice Cooker (4.5L Deluxe)",
    stock: "100 PCs in Stock",
    price: 499,
    category: "appliances",
    images: [
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.04 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.05 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.05 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM.jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (1).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (2).jpeg",
      "Rice cooker/WhatsApp Image 2026-08-17 at 12.39.06 PM (3).jpeg"
    ]
  },
  {
    id: "prod-jucifer",
    name: "Jucifer (Electric Fruit Juicer)",
    stock: "20 PCs in Stock",
    price: 499,
    category: "appliances",
    images: [
      "jucifer/WhatsApp Image 2026-08-17 at 12.37.59 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.37.59 PM.jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM (1).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM (2).jpeg",
      "jucifer/WhatsApp Image 2026-08-17 at 12.38.00 PM.jpeg"
    ]
  },
  {
    id: "prod-massage-gun",
    name: "Massage Gun (Deep Tissue)",
    stock: "50 PCs in Stock",
    price: 350,
    category: "wellness",
    images: [
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
    id: "prod-electric-kettle",
    name: "Electric Kettle (1.8L Fast Boil)",
    stock: "20 PCs in Stock",
    price: 150,
    category: "appliances",
    images: [
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.51 PM.jpeg",
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.52 PM (1).jpeg",
      "electric kettle/WhatsApp Image 2026-08-17 at 12.38.52 PM.jpeg"
    ]
  },
  {
    id: "prod-morgan-steam-iron",
    name: "Morgan Steam Iron",
    stock: "5 PCs in Stock",
    price: 250,
    category: "appliances",
    images: [
      "Morgan Steam iron/WhatsApp Image 2026-08-17 at 12.38.34 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.33 PM (1).jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.33 PM.jpeg",
      "Rechargeable smart protector/WhatsApp Image 2026-08-17 at 12.38.34 PM.jpeg"
    ]
  }
];

// Product Store API (Persisted via LocalStorage + In-Memory Fallback)
const ProductStore = {
  KEY: 'slick_tek_catalog',

  getAll() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) {
      this.save(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    window.PRODUCTS = items;
  },

  getById(id) {
    return this.getAll().find(p => p.id === id);
  },

  add(productData) {
    const items = this.getAll();
    const newProduct = {
      id: "prod-" + Date.now(),
      ...productData
    };
    items.unshift(newProduct);
    this.save(items);
    return newProduct;
  },

  update(id, updatedFields) {
    const items = this.getAll();
    const index = items.findIndex(p => p.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.save(items);
      return items[index];
    }
    return null;
  },

  delete(id) {
    const items = this.getAll().filter(p => p.id !== id);
    this.save(items);
  },

  resetToDefault() {
    this.save(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
};

// Global accessor for PRODUCTS
window.PRODUCTS = ProductStore.getAll();

function formatPrice(amount) {
  return "GH₵ " + Number(amount || 0).toLocaleString();
}
