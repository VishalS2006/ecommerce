export const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    icon: 'Headphones',
    description: 'Cutting-edge audio, cameras, and smart gadgets for everyday life'
  },
  {
    name: 'Mobiles',
    slug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    icon: 'Smartphone',
    description: 'Latest 5G smartphones, flagship devices, and modern accessories'
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    icon: 'Laptop',
    description: 'High-performance laptops for creators, engineers, and gamers'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    icon: 'Shirt',
    description: 'Curated modern apparel, premium jackets, and timeless styles'
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    icon: 'Footprints',
    description: 'Performance running shoes, boots, and casual sneakers'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    icon: 'Home',
    description: 'Smart appliances, espresso machines, and aesthetic home decor'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    icon: 'Sparkles',
    description: 'Luxury organic skincare, fine fragrances, and wellness essentials'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    icon: 'Watch',
    description: 'Minimalist timepieces, leather goods, and premium travel gear'
  }
];

export const productsData = [
  // Electronics
  {
    name: 'AcousticPro Studio Wireless Noise-Cancelling Headphones',
    sku: 'AUDIO-AP-001',
    categorySlug: 'electronics',
    brand: 'AcousticPro',
    price: 349,
    discount: 15,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Industry-leading Active Noise Cancellation with spatial audio and 40-hour battery life.',
    description: 'Engineered for audio purists and daily commuters alike, the AcousticPro Studio features custom 40mm beryllium drivers delivering ultra-wide frequency response. Featuring hybrid 6-microphone ANC, crystal clear voice calling, plush memory foam earcups, and multipoint Bluetooth 5.3 connection.',
    specifications: [
      { key: 'Driver Size', value: '40mm Beryllium' },
      { key: 'Battery Life', value: 'Up to 40 Hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.3, USB-C, 3.5mm Aux' },
      { key: 'Noise Cancellation', value: 'Hybrid Active Noise Cancellation' },
      { key: 'Weight', value: '254g' }
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Silver Moon', 'Midnight Blue'] }
    ],
    ratingsAverage: 4.8,
    ratingsCount: 42,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'VibePulse Portable Waterproof Bluetooth Speaker',
    sku: 'AUDIO-VP-002',
    categorySlug: 'electronics',
    brand: 'VibePulse',
    price: 129,
    discount: 20,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'IPX7 waterproof 360-degree surround speaker with punchy bass and 24-hour runtime.',
    description: 'Take vibrant sound everywhere you go. The VibePulse delivers room-filling sound with dual passive radiators for deep low-end resonance. Built rugged with an IPX7 waterproof and dustproof exterior.',
    specifications: [
      { key: 'Output Power', value: '30W RMS' },
      { key: 'Water Resistance', value: 'IPX7 certified' },
      { key: 'Battery', value: '5200 mAh (24 hours)' }
    ],
    variants: [
      { name: 'Color', options: ['Obsidian Black', 'Forest Green', 'Sunset Orange'] }
    ],
    ratingsAverage: 4.6,
    ratingsCount: 29,
    isFeatured: false,
    isDealOfDay: true,
    isBestSeller: false
  },
  {
    name: 'CineView 4K Ultra-HD Mirrorless Digital Camera',
    sku: 'CAM-CV-003',
    categorySlug: 'electronics',
    brand: 'LumixPro',
    price: 1199,
    discount: 10,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '26.1MP BSI CMOS sensor with 4K/60p video, 5-axis IBIS, and real-time subject tracking.',
    description: 'Designed for serious visual storytellers. The CineView combines a class-leading backside-illuminated sensor with lightning-fast AI autofocus and in-body 5-axis stabilization for cinematic 4K footage and crisp stills.',
    specifications: [
      { key: 'Sensor', value: '26.1MP APS-C X-Trans BSI CMOS 4' },
      { key: 'Video Resolution', value: '4K DCI up to 60fps' },
      { key: 'Stabilization', value: '5-Axis In-Body Image Stabilization' }
    ],
    variants: [
      { name: 'Package', options: ['Body Only', 'With 18-55mm Lens Kit'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 19,
    isFeatured: true,
    isDealOfDay: false,
    isBestSeller: false
  },

  // Mobiles
  {
    name: 'Apex Phone 15 Pro Max 5G Flagship',
    sku: 'MBL-AP-101',
    categorySlug: 'mobiles',
    brand: 'Apex',
    price: 1099,
    discount: 8,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Aerospace-grade titanium design with A17 Bionic chip and 48MP periscope telephoto lens.',
    description: 'The pinnacle of mobile engineering. Boasting a Super Retina XDR 120Hz ProMotion OLED display, cinematic spatial video capture, all-day battery life, and high-speed USB 3 transfer speeds.',
    specifications: [
      { key: 'Display', value: '6.7-inch OLED 120Hz ProMotion' },
      { key: 'Processor', value: 'Hexa-core 3nm Flagship SoC' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra-wide + 12MP 5x Telephoto' },
      { key: 'Battery', value: '4441 mAh with 30W Fast Charging' }
    ],
    variants: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Natural Titanium', 'Deep Blue', 'Black Titanium'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 78,
    isFeatured: true,
    isDealOfDay: false,
    isBestSeller: true
  },
  {
    name: 'Nova Fold Ultra Dual Screen Smartphone',
    sku: 'MBL-NF-102',
    categorySlug: 'mobiles',
    brand: 'NovaTech',
    price: 1499,
    discount: 12,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Next-gen foldable with zero-gap hinge, stylus support, and multitasking split displays.',
    description: 'Unfold endless possibilities. A phone in your pocket that expands into a 7.6-inch tablet experience with Armor Aluminum frame and ultra-thin glass durability.',
    specifications: [
      { key: 'Main Display', value: '7.6-inch Dynamic AMOLED 2X (120Hz)' },
      { key: 'Cover Display', value: '6.2-inch AMOLED Display' },
      { key: 'RAM / Storage', value: '12GB RAM + 512GB Storage' }
    ],
    variants: [
      { name: 'Color', options: ['Phantom Black', 'Icy Blue'] }
    ],
    ratingsAverage: 4.7,
    ratingsCount: 31,
    isFeatured: false,
    isDealOfDay: true,
    isBestSeller: false
  },

  // Laptops
  {
    name: 'ZenithBlade 16 Gaming & Creator Laptop',
    sku: 'LAP-ZB-201',
    categorySlug: 'laptops',
    brand: 'Zenith',
    price: 1899,
    discount: 15,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Intel Core i9 14th Gen, RTX 4080 GPU, 32GB DDR5 RAM, and 240Hz QHD+ display.',
    description: 'Uncompromised portable computing. Crafted inside a CNC milled aluminum chassis, the ZenithBlade 16 blends extreme gaming prowess with color-calibrated 100% DCI-P3 workspace for video editors and 3D artists.',
    specifications: [
      { key: 'Processor', value: 'Intel Core i9-14900HX (24 cores, 5.8 GHz)' },
      { key: 'Graphics', value: 'NVIDIA GeForce RTX 4080 12GB GDDR6' },
      { key: 'Display', value: '16.0" QHD+ (2560x1600) 240Hz 500 nits' },
      { key: 'Memory & Storage', value: '32GB DDR5 5600MHz + 1TB NVMe Gen4 SSD' }
    ],
    variants: [
      { name: 'RAM/Storage', options: ['32GB RAM / 1TB SSD', '64GB RAM / 2TB SSD'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 38,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'AeroBook Air 14 Ultralight Laptop',
    sku: 'LAP-AA-202',
    categorySlug: 'laptops',
    brand: 'AeroTech',
    price: 999,
    discount: 10,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Featherlight 1.1kg magnesium body with 18-hour battery and vibrant 2.8K OLED screen.',
    description: 'Designed for effortless productivity anywhere you wander. Silent fanless architecture, backlit ergonomic keyboard, fingerprint biometric sign-in, and all-day stamina.',
    specifications: [
      { key: 'Weight', value: '1.13 kg (2.49 lbs)' },
      { key: 'Battery Life', value: 'Up to 18 Hours' },
      { key: 'Display', value: '14.0" 2.8K OLED 90Hz HDR 600' }
    ],
    variants: [
      { name: 'Color', options: ['Space Gray', 'Starlight Silver'] }
    ],
    ratingsAverage: 4.7,
    ratingsCount: 45,
    isFeatured: false,
    isDealOfDay: false,
    isBestSeller: true
  },

  // Fashion
  {
    name: 'Vintage Biker Genuine Full-Grain Leather Jacket',
    sku: 'FAS-LJ-301',
    categorySlug: 'fashion',
    brand: 'UrbanCraft',
    price: 289,
    discount: 25,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Handcrafted premium calfskin leather with antique brass hardware and satin interior lining.',
    description: 'A modern classic built to last decades. Hand-finished full-grain leather develops a rich, personalized patina over time. Features zippered cuffs, asymmetrical moto collar, and double-stitched reinforcements.',
    specifications: [
      { key: 'Material', value: '100% Genuine Full-Grain Calfskin' },
      { key: 'Lining', value: 'Quilted Thermal Satin' },
      { key: 'Hardware', value: 'Heavy-duty YKK Brass Zippers' }
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Classic Black', 'Distressed Cognac'] }
    ],
    ratingsAverage: 4.8,
    ratingsCount: 52,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'Heritage Raw Selvedge Denim Trucker Jacket',
    sku: 'FAS-DJ-302',
    categorySlug: 'fashion',
    brand: 'IronWeave',
    price: 159,
    discount: 15,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '14oz Japanese shuttle-loomed selvedge denim with shank buttons and chest flap pockets.',
    description: 'Woven on vintage shuttle looms in Okayama, this rugged denim jacket offers structure, comfort, and unique fading patterns tailored to your wear.',
    specifications: [
      { key: 'Weight', value: '14 oz Raw Selvedge Denim' },
      { key: 'Fit', value: 'Regular Tailored Trucker' }
    ],
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL'] }
    ],
    ratingsAverage: 4.6,
    ratingsCount: 24,
    isFeatured: false,
    isDealOfDay: false,
    isBestSeller: false
  },

  // Footwear
  {
    name: 'CloudStrider Pro Carbon Marathon Running Shoes',
    sku: 'SHOE-CS-401',
    categorySlug: 'footwear',
    brand: 'AeroStrider',
    price: 199,
    discount: 20,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Full-length carbon fiber propulsion plate with dual-density nitrogen-infused foam.',
    description: 'Engineered for personal bests. The CloudStrider Pro delivers maximum energy return with every stride. Breathable engineered mesh upper locks down your midfoot while keeping feet cool over marathon distances.',
    specifications: [
      { key: 'Plate', value: 'Full-length 3D Carbon Fiber Plate' },
      { key: 'Drop', value: '8mm' },
      { key: 'Weight', value: '198g (Size 9)' }
    ],
    variants: [
      { name: 'Size', options: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'] },
      { name: 'Color', options: ['Crimson Red / White', 'Neon Volt / Black'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 64,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'Artisan Handcrafted Italian Leather Chelsea Boots',
    sku: 'SHOE-CB-402',
    categorySlug: 'footwear',
    brand: 'Bellucci',
    price: 249,
    discount: 10,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Goodyear welted Italian crust leather with elastic side gussets and Vibram rubber sole.',
    description: 'Timeless silhouette for upscale dressing or casual flair. Hand-dyed in Tuscany, featuring natural cork footbeds that mold comfortably to your feet.',
    specifications: [
      { key: 'Construction', value: 'Goodyear Welted (Resolable)' },
      { key: 'Leather', value: 'Full-Grain Tuscan Crust Leather' }
    ],
    variants: [
      { name: 'Size', options: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', options: ['Caramel Brown', 'Onyx Black'] }
    ],
    ratingsAverage: 4.8,
    ratingsCount: 33,
    isFeatured: false,
    isDealOfDay: false,
    isBestSeller: true
  },

  // Home & Kitchen
  {
    name: 'BaristaTouch Thermal Espresso Machine & Grinder',
    sku: 'KIT-BT-501',
    categorySlug: 'home-kitchen',
    brand: 'CaféLuxe',
    price: 649,
    discount: 15,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '15-bar Italian pump, PID temperature control, integrated conical burr grinder, and micro-foam steam wand.',
    description: 'Cafe-quality espresso in the comfort of your kitchen. Intuitive touch interface guides you through 5 preset third-wave specialty coffee styles, from velvety flat whites to bold ristrettos.',
    specifications: [
      { key: 'Pump Pressure', value: '15 Bar Italian Vibration Pump' },
      { key: 'Grinder', value: 'Integrated Stainless Steel Conical Burr (30 settings)' },
      { key: 'Water Tank', value: '2.0 Liters with Charcoal Filter' }
    ],
    variants: [
      { name: 'Finish', options: ['Brushed Stainless Steel', 'Matte Black', 'Sea Salt White'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 57,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'SmartAir Digital Multi-Function Air Fryer Oven',
    sku: 'KIT-AF-502',
    categorySlug: 'home-kitchen',
    brand: 'ChefWave',
    price: 139,
    discount: 30,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '8-quart dual-zone rapid air circulation oven with 12 one-touch cooking presets.',
    description: 'Crisp food with up to 85% less oil. Dual independent heating zones let you roast chicken on one side while crisping fries on the other with synced finish times.',
    specifications: [
      { key: 'Capacity', value: '8 Quarts (Dual 4-qt baskets)' },
      { key: 'Power', value: '1750 Watts' }
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Graphite Gray'] }
    ],
    ratingsAverage: 4.7,
    ratingsCount: 41,
    isFeatured: false,
    isDealOfDay: true,
    isBestSeller: false
  },

  // Beauty
  {
    name: 'Radiance Peptide & Hyaluronic Multi-Active Face Serum',
    sku: 'BEA-RP-601',
    categorySlug: 'beauty',
    brand: 'AuraBotanica',
    price: 74,
    discount: 10,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Quadruple hyaluronic acid complex with copper peptides and botanical antioxidants.',
    description: 'Deep cellular hydration for a firm, radiant glow. Clinically formulated without parabens, fragrances, or artificial colors. Absorbs rapidly without greasy residue.',
    specifications: [
      { key: 'Volume', value: '50 ml / 1.7 fl oz' },
      { key: 'Skin Type', value: 'All skin types, sensitive friendly' },
      { key: 'Certifications', value: 'Cruelty-Free, 100% Vegan' }
    ],
    variants: [
      { name: 'Size', options: ['30ml Travel', '50ml Standard', '100ml Value'] }
    ],
    ratingsAverage: 4.8,
    ratingsCount: 82,
    isFeatured: true,
    isDealOfDay: false,
    isBestSeller: true
  },
  {
    name: 'Midnight Amber Eau De Parfum Luxury Fragrance',
    sku: 'BEA-MA-602',
    categorySlug: 'beauty',
    brand: 'Maison Noir',
    price: 145,
    discount: 15,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Exotic blend of Madagascar vanilla, smoky agarwood oud, and sun-drenched bergamot.',
    description: 'An intoxicating, long-lasting unisex scent handcrafted in Grasse, France. Opens with sparkling citrus notes followed by deep resinous amber and warm woods.',
    specifications: [
      { key: 'Concentration', value: 'Eau de Parfum (22% oil concentration)' },
      { key: 'Volume', value: '100 ml / 3.4 fl oz' }
    ],
    variants: [
      { name: 'Size', options: ['50ml', '100ml'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 46,
    isFeatured: false,
    isDealOfDay: true,
    isBestSeller: true
  },

  // Accessories
  {
    name: 'ChronoClassic Sapphire Automatic Watch',
    sku: 'ACC-CC-701',
    categorySlug: 'accessories',
    brand: 'NordicHorology',
    price: 449,
    discount: 18,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Japanese 24-jewel automatic mechanical movement with scratchproof sapphire crystal.',
    description: 'Understated Scandinavian luxury. Featuring an exhibition caseback displaying the rotating balance wheel, surgical grade 316L stainless steel, and vegetable-tanned Italian leather band.',
    specifications: [
      { key: 'Movement', value: 'Miyota 9015 Automatic (42-hr power reserve)' },
      { key: 'Case Diameter', value: '40mm' },
      { key: 'Water Resistance', value: '100m (10 ATM)' }
    ],
    variants: [
      { name: 'Dial & Strap', options: ['White Dial / Brown Strap', 'Black Dial / Black Strap', 'Sunburst Blue / Tan Strap'] }
    ],
    ratingsAverage: 4.9,
    ratingsCount: 39,
    isFeatured: true,
    isDealOfDay: true,
    isBestSeller: true
  },
  {
    name: 'NomadPro Weatherproof Travel Backpack 30L',
    sku: 'ACC-NP-702',
    categorySlug: 'accessories',
    brand: 'VentureGear',
    price: 159,
    discount: 20,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Cordura ballistic nylon with clamshell opening, padded 16" laptop pocket, and TSA pass-through.',
    description: 'The ultimate one-bag travel companion. Waterproof sealed zippers, hidden passport security pocket, expandable water bottle holder, and breathable EVA molded back panel.',
    specifications: [
      { key: 'Capacity', value: '30 Liters (Expandable to 35L)' },
      { key: 'Material', value: '840D Cordura Ballistic Nylon' },
      { key: 'Laptop Compartment', value: 'Fits up to 16-inch laptops' }
    ],
    variants: [
      { name: 'Color', options: ['Tactical Charcoal', 'Olive Green', 'Deep Navy'] }
    ],
    ratingsAverage: 4.8,
    ratingsCount: 51,
    isFeatured: false,
    isDealOfDay: true,
    isBestSeller: false
  }
];

export const couponsData = [
  {
    code: 'SAVE20',
    description: 'Get 20% off on all orders above $100',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 100,
    maxDiscountAmount: 50,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    usageLimit: 1000
  },
  {
    code: 'WELCOME10',
    description: 'Special 10% discount for first-time shoppers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 30,
    maxDiscountAmount: 30,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    usageLimit: 5000
  },
  {
    code: 'FREESHIP',
    description: 'Flat $6 discount to cover standard shipping',
    discountType: 'fixed',
    discountValue: 6,
    minOrderAmount: 25,
    maxDiscountAmount: 6,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 2000
  },
  {
    code: 'FESTIVE50',
    description: 'Flat $50 off on mega luxury orders over $300',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 300,
    maxDiscountAmount: 50,
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    usageLimit: 500
  }
];
