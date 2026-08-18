import os
import json

products_map = {
    'prod-4g-solar-camera': {
        'folder': '4G solar powered three lense  camera',
        'name': '4G Solar Powered Three Lense Camera',
        'category': 'cameras',
        'price': 1300,
        'stock': '50 PCs in Stock',
        'tagline': 'Ultra HD 360° Outdoor Security with Solar Charging'
    },
    'prod-rechargeable-smart-protector': {
        'folder': 'Rechargeable smart protector',
        'name': 'Rechargeable Smart Protector (Q7 Battery & Cinema Edition)',
        'category': 'projectors',
        'price': 1099,
        'stock': '20 PCs in Stock',
        'tagline': 'Built-in Rechargeable Battery & Cinema Quality Projection'
    },
    'prod-projectorr': {
        'folder': 'projectr',
        'name': 'Projectorr (Android Cinema HD)',
        'category': 'projectors',
        'price': 999,
        'stock': '10 PCs in Stock',
        'tagline': 'Android 11.0 Cinema HD with Apps & WiFi Screen Mirroring'
    },
    'prod-bose-soundbar': {
        'folder': 'philip sound bar',
        'name': 'Bose.st 3.1 Chanel Sound Bar',
        'category': 'audio',
        'price': 899,
        'stock': 'Limited Stock',
        'tagline': 'Deep Subwoofer Bass & Crystal Clear Wireless Bluetooth'
    },
    'prod-philip-soundbar': {
        'folder': 'philip sound bar',
        'name': 'Philip Sound Bar System',
        'category': 'audio',
        'price': 850,
        'stock': '15 PCs in Stock',
        'tagline': 'Surround Sound Home Cinema with Wireless Woofer'
    },
    'prod-rice-cooker-45l': {
        'folder': 'Rice cooker',
        'name': 'EXLG Deluxe 4.5L Rice Cooker',
        'category': 'appliances',
        'price': 350,
        'stock': 'In Stock',
        'tagline': 'Large Family Capacity with Automatic Keep-Warm'
    },
    'prod-electric-kettle': {
        'folder': 'electric kettle',
        'name': 'Heavy Duty Rapid Electric Kettle',
        'category': 'appliances',
        'price': 180,
        'stock': 'In Stock',
        'tagline': 'Rapid Boil Stainless Steel with Auto Shut-Off'
    },
    'prod-portable-juicer': {
        'folder': 'jucifer',
        'name': 'Portable USB Rechargeable Blender / Juicer',
        'category': 'appliances',
        'price': 150,
        'stock': 'In Stock',
        'tagline': '6 Stainless Blades with 4000mAh Battery'
    },
    'prod-deep-tissue-massage-gun': {
        'folder': 'massage gun',
        'name': 'Deep Tissue Percussion Massage Gun',
        'category': 'wellness',
        'price': 220,
        'stock': 'In Stock',
        'tagline': '6 Speed Levels with 4 Interchangeable Heads'
    },
    'prod-morgan-steam-iron': {
        'folder': 'Morgan Steam iron',
        'name': 'Morgan Professional Steam Iron',
        'category': 'appliances',
        'price': 250,
        'stock': 'In Stock',
        'tagline': 'Non-Stick Soleplate with Anti-Drip & Continuous Steam'
    }
}

verified_products = []
for pid, info in products_map.items():
    folder = info['folder']
    img_files = []
    if os.path.exists(folder):
        for f in sorted(os.listdir(folder)):
            if f.lower().endswith(('.jpeg', '.jpg', '.png')):
                img_files.append(f"{folder}/{f}")
    
    if not img_files:
        img_files = ['assets/logo.png']
        
    verified_products.append({
        'id': pid,
        'name': info['name'],
        'category': info['category'],
        'price': info['price'],
        'stock': info['stock'],
        'tagline': info['tagline'],
        'images': img_files
    })

print(f"Generated {len(verified_products)} products.")
for p in verified_products:
    print(f"- {p['name']}: {len(p['images'])} images | First: {p['images'][0]}")

with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(verified_products, f, indent=2)

js_content = f"// SLICK TEK — Official Verified Catalog Data\nconst INITIAL_PRODUCTS = {json.dumps(verified_products, indent=2)};\n"
with open('js/catalog_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
