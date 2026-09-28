const dotenv = require('dotenv');
const {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Notification,
  Setting,
  UserFavorite
} = require('../models');

dotenv.config();

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Seed] Connected to PostgreSQL successfully.');

    console.log('[Seed] Re-creating database schema...');
    await sequelize.sync({ force: true });

    // 1. Create Default Store Settings
    console.log('[Seed] Creating Store Settings...');
    await Setting.create({
      storeName: 'CORELY',
      tagline: 'Technology that fits your world.',
      storeEmail: 'nazarovjamshid522@gmail.com',
      storePhone: '+998 71 200 00 00',
      currency: 'USD',
      taxRate: 8.5,
      freeShippingThreshold: 100,
      standardShippingFee: 5,
      expressShippingFee: 15,
      sameDayShippingFee: 25,
      address: '45 Silicon Valley Way, Tech District, Tashkent'
    });

    // 2. Create Users (passwords will be hashed by User model pre-save hook)
    console.log('[Seed] Creating Users...');

    const users = await User.bulkCreate([
      {
        firstName: 'Alexander',
        lastName: 'Vance',
        email: 'admin@corely.com',
        phone: '+998 90 123 45 67',
        password: 'Admin123!',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        addresses: [{
          title: 'Headquarters',
          fullName: 'Alexander Vance',
          phone: '+998 90 123 45 67',
          country: 'Uzbekistan',
          region: 'Tashkent',
          city: 'Tashkent',
          street: 'Amir Temur Avenue 108',
          zipCode: '100000',
          isDefault: true
        }]
      },
      {
        firstName: 'Sophia',
        lastName: 'Chen',
        email: 'customer@corely.com',
        phone: '+998 90 987 65 43',
        password: 'Customer123!',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        addresses: [{
          title: 'Apartment',
          fullName: 'Sophia Chen',
          phone: '+998 90 987 65 43',
          country: 'Uzbekistan',
          region: 'Tashkent',
          city: 'Tashkent',
          street: 'Navoi Street 24, Apt 12',
          zipCode: '100011',
          isDefault: true
        }]
      },
      {
        firstName: 'Marcus',
        lastName: 'Rashford',
        email: 'marcus@example.com',
        phone: '+998 91 111 22 33',
        password: 'Customer123!',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        addresses: [{
          title: 'Home',
          fullName: 'Marcus Rashford',
          phone: '+998 91 111 22 33',
          country: 'Uzbekistan',
          region: 'Samarkand',
          city: 'Samarkand',
          street: 'Registan Boulevard 15',
          zipCode: '140100',
          isDefault: true
        }]
      },
      {
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena@example.com',
        phone: '+998 93 444 55 66',
        password: 'Customer123!',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        isActive: true
      },
      {
        firstName: 'Dilshod',
        lastName: 'Karimov',
        email: 'dilshod@example.com',
        phone: '+998 97 777 88 99',
        password: 'Customer123!',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        isActive: true
      }
    ], { individualHooks: true });

    const adminUser = users[0];
    const customerUser = users[1];
    const secondUser = users[2];

    // 3. Create 10 Categories
    console.log('[Seed] Creating Categories...');
    const categoryData = [
      {
        name: 'Electronics',
        name_en: 'Electronics',
        name_uz: 'Elektronika va Texnologiya',
        name_ru: 'Электроника и Технологии',
        slug: 'electronics',
        description: 'Next-generation smart electronics, IoT hubs, and innovative tech gadgets.',
        image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Gaming',
        name_en: 'Gaming',
        name_uz: "O'yinlar va Kiber Sport",
        name_ru: 'Гейминг и Киберспорт',
        slug: 'gaming',
        description: 'Competitive gaming mice, mechanical keyboards, custom controllers, and high-refresh gear.',
        image: 'https://images.unsplash.com/photo-1612287233207-6b45f1b6a22f?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Computers',
        name_en: 'Computers',
        name_uz: 'Kompyuterlar va Noutbuklar',
        name_ru: 'Компьютеры и Ноутбуки',
        slug: 'computers',
        description: 'Pro laptops, custom PC components, 4K monitors, and workstation essentials.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Smartphones',
        name_en: 'Smartphones',
        name_uz: 'Smartfonlar va Gadjetlar',
        name_ru: 'Смартфоны и Гаджеты',
        slug: 'smartphones',
        description: 'Flagship mobile devices, foldable smartphones, and titanium pro series.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Audio',
        name_en: 'Audio',
        name_uz: 'Ovoz va Quloqchinlar',
        name_ru: 'Аудио и Наушники',
        slug: 'audio',
        description: 'Audiophile over-ear headphones, ANC wireless earbuds, and studio monitors.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Accessories',
        name_en: 'Accessories',
        name_uz: 'Aksessuarlar va Kabellar',
        name_ru: 'Аксессуары и Кабели',
        slug: 'accessories',
        description: 'GaN chargers, braided coiled cables, Thunderbolt docks, and protective tech sleeves.',
        image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80',
        featured: true
      },
      {
        name: 'Furniture',
        name_en: 'Furniture',
        name_uz: 'Ergonomik Mebel va Stollar',
        name_ru: 'Эргономичная Мебель',
        slug: 'furniture',
        description: 'Ergonomic mesh chairs, dual-motor standing desks, and modular desk shelving.',
        image: 'https://images.unsplash.com/photo-1580481077195-c328a3727177?w=600&auto=format&fit=crop&q=80',
        featured: false
      },
      {
        name: 'Tools',
        name_en: 'Tools',
        name_uz: "Asboblar va Ta'mirlash",
        name_ru: 'Инструменты и Ремонт',
        slug: 'tools',
        description: 'Precision electric screwdrivers, thermal cameras, and electronic repair toolkits.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        featured: false
      },
      {
        name: 'Fashion',
        name_en: 'Fashion',
        name_uz: 'Sumkalar va Ryukzaklar',
        name_ru: 'Рюкзаки и Аксессуары',
        slug: 'fashion',
        description: 'Minimalist techwear backpacks, RFID-blocking cardholders, and water-repellent bags.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        featured: false
      },
      {
        name: 'Home',
        name_en: 'Home',
        name_uz: 'Aqlli Uy va Yoritish',
        name_ru: 'Умный Дом и Свет',
        slug: 'home',
        description: 'Smart ambient LED light bars, automated humidity controls, and desktop air purifiers.',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
        featured: false
      }
    ];

    const categories = await Category.bulkCreate(categoryData);
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.slug] = cat.id;
    });

    // 4. Create 52 Realistic Products
    console.log('[Seed] Creating 52+ Electronics Products...');
    const productsData = [
      // Keyboards & Mice
      {
        name: 'Keychron X401K Wireless Mechanical Keyboard',
        slug: 'keychron-x401k-wireless-mechanical-keyboard',
        sku: 'KB-KCH-401K',
        description: 'Compact 75% hot-swappable wireless mechanical keyboard engineered for maximum tactile precision. Features QMK/VIA programmable firmware, south-facing RGB backlighting, and Bluetooth 5.2 multi-device pairing.',
        category: catMap['gaming'],
        brand: 'Keychron',
        price: 89,
        comparePrice: 119,
        costPrice: 50,
        discount: 25,
        stock: 45,
        lowStockThreshold: 8,
        mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
        ],
        colors: ['Black', 'White', 'Orange'],
        rating: 4.8,
        reviewCount: 38,
        shippingInfo: 'Next Day',
        shippingClass: 'Express Standard',
        deliveryTime: '1-2 Days',
        location: 'Corely Flagship Warehouse',
        isFeatured: true,
        isNewArrival: true,
        isOnSale: true,
        specifications: [
          { name: 'Connectivity', value: 'Bluetooth 5.2 / Type-C Wired / 2.4GHz' },
          { name: 'Switch Type', value: 'Gateron G Pro Brown Tactile' },
          { name: 'Layout', value: '75% Compact (84 Keys)' },
          { name: 'Battery', value: '4000mAh Rechargeable (Up to 240 Hours)' },
          { name: 'Keycaps', value: 'Double-shot PBT OEM Profile' },
          { name: 'Polling Rate', value: '1000Hz (Wired/2.4G) / 90Hz (Bluetooth)' },
          { name: 'RGB', value: '16.8 Million Colors South-Facing' },
          { name: 'Frame Material', value: 'CNC Anodized Aluminum' },
          { name: 'Dimensions', value: '313 x 123 x 38 mm' },
          { name: 'Weight', value: '820g' },
          { name: 'OS Compatibility', value: 'macOS, Windows, Linux, iOS, Android' },
          { name: 'Hot-Swappable', value: 'Yes (3-pin & 5-pin MX switches)' },
          { name: 'Stabilizers', value: 'Screw-in PCB Stabilizers' },
          { name: 'Sound Dampening', value: 'Dual Layer Poron Foam & Silicone Base' },
          { name: 'Software', value: 'Web QMK/VIA Configurator' }
        ]
      },
      {
        name: 'Ultra-Light Gaming Mouse 4K Polling',
        slug: 'ultra-light-gaming-mouse-4k-polling',
        sku: 'MS-ULTRA-4K',
        description: 'Weighing just 49 grams, this esports tournament gaming mouse utilizes the PixArt 3395 sensor paired with 4000Hz wireless polling rate for latency-free competitive flicking.',
        category: catMap['gaming'],
        brand: 'ViperTech',
        price: 64,
        comparePrice: 79,
        costPrice: 35,
        discount: 19,
        stock: 32,
        lowStockThreshold: 6,
        mainImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
        ],
        colors: ['White', 'Black'],
        rating: 4.9,
        reviewCount: 42,
        shippingInfo: 'Instant',
        deliveryTime: 'Same Day Delivery',
        location: 'Tashkent Tech Hub',
        isFeatured: true,
        isOnSale: true,
        specifications: [
          { name: 'Sensor', value: 'PixArt PAW3395 Optical' },
          { name: 'DPI Range', value: '50 - 26,000 DPI' },
          { name: 'Polling Rate', value: 'Up to 4000Hz Wireless' },
          { name: 'Weight', value: '49g Ultra-Lightweight' },
          { name: 'Switches', value: 'Optical Huano 80M Clicks' },
          { name: 'Battery Life', value: '80 Hours Continuous Play' },
          { name: 'Feet', value: '100% Virgin PTFE Glides' },
          { name: 'Acceleration', value: '50G / 650 IPS' },
          { name: 'Cable', value: 'Ultra-flexible Paracord USB-C' },
          { name: 'Connectivity', value: '2.4GHz Wireless & Type-C' },
          { name: 'Buttons', value: '6 Programmable Buttons' },
          { name: 'Encoder', value: 'TTC Gold Dustproof' },
          { name: 'Software', value: 'Corely Sync Hub Driver' },
          { name: 'Dimensions', value: '119 x 62 x 38 mm' },
          { name: 'Warranty', value: '2 Years Worldwide' }
        ]
      },
      {
        name: 'Ergonomic Vertical Wireless Mouse',
        slug: 'ergonomic-vertical-wireless-mouse',
        sku: 'MS-ERGO-VERT',
        description: 'Scientifically calibrated 57° natural handshake vertical mouse crafted to alleviate wrist strain and carpal tunnel tension during long work days.',
        category: catMap['accessories'],
        brand: 'ErgoLife',
        price: 45,
        comparePrice: 55,
        costPrice: 22,
        discount: 18,
        stock: 58,
        lowStockThreshold: 10,
        mainImage: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'White'],
        rating: 4.6,
        reviewCount: 29,
        shippingInfo: 'Regular',
        deliveryTime: '2-3 Days',
        location: 'Central Storage',
        isFeatured: false,
        specifications: [
          { name: 'Angle', value: '57° Neutral Wrist Angle' },
          { name: 'Sensor', value: 'High Precision Optical 4000 DPI' },
          { name: 'Thumb Rest', value: 'Integrated Soft-touch Rubber' },
          { name: 'Connectivity', value: 'Bluetooth & 2.4G Unifying' },
          { name: 'Battery', value: 'Rechargeable 500mAh Li-ion' },
          { name: 'Click Sound', value: '90% Silent Acoustic Dampening' },
          { name: 'Weight', value: '135g' },
          { name: 'OS Compatibility', value: 'Windows 11, macOS, iPadOS, ChromeOS' },
          { name: 'Dimensions', value: '120 x 79 x 78 mm' },
          { name: 'Charging Port', value: 'USB-C Fast Charging' },
          { name: 'DPI Levels', value: '800 / 1200 / 1600 / 2400 / 4000' },
          { name: 'Buttons', value: 'Forward, Back, DPI, Silent L/R' },
          { name: 'Material', value: 'Textured Matte Polymer' },
          { name: 'Standby Time', value: '120 Days' },
          { name: 'Warranty', value: '1 Year Full Replacement' }
        ]
      },
      {
        name: 'Custom Coiled Aviator Keyboard Cable',
        slug: 'custom-coiled-aviator-keyboard-cable',
        sku: 'ACC-CBL-COIL',
        description: 'Double-sleeved PET paracord coiled mechanical keyboard cable featuring a rugged 5-pin GX16 metal detachable aviator connector and gold-plated Type-C ends.',
        category: catMap['accessories'],
        brand: 'CableCraft',
        price: 29,
        comparePrice: 39,
        costPrice: 12,
        discount: 26,
        stock: 74,
        lowStockThreshold: 15,
        mainImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'],
        colors: ['Orange', 'Blue', 'Black', 'White'],
        rating: 4.7,
        reviewCount: 19,
        shippingInfo: 'Economic',
        deliveryTime: '2-4 Days',
        location: 'Corely Warehouse',
        isFeatured: false,
        specifications: [
          { name: 'Connector', value: 'GX16 5-Pin Aviator Zinc-Alloy' },
          { name: 'Sleeving', value: 'Double Layer PET Mesh + Paracord' },
          { name: 'Coil Diameter', value: '20mm Inner Diameter' },
          { name: 'Straight Length', value: '1.2m Straight + 15cm Coiled' },
          { name: 'Gold Plating', value: '24K Gold Plated USB-A to USB-C' },
          { name: 'Power Transfer', value: 'Up to 5V/2.4A Fast Charge' },
          { name: 'Flexibility', value: 'Heat-Shrunk Tight Coils' },
          { name: 'Colorfastness', value: 'UV-Resistant Dyeing' },
          { name: 'Compatibility', value: 'All USB-C Mechanical Keyboards' },
          { name: 'Weight', value: '110g' },
          { name: 'Bending Life', value: '15,000+ Cycles Tested' },
          { name: 'Conductor', value: '4-Core 24AWG Oxygen-Free Copper' },
          { name: 'Shielding', value: 'Aluminum Foil + Braided Ground' },
          { name: 'Operating Temp', value: '-20°C to +80°C' },
          { name: 'Warranty', value: 'Lifetime Corely Craft Warranty' }
        ]
      },

      // Audio & Headphones
      {
        name: 'Wireless Over-Ear Studio Headphones ANC',
        slug: 'wireless-over-ear-studio-headphones-anc',
        sku: 'AUD-HDP-ANC',
        description: 'Audiophile grade 40mm beryllium diaphragm drivers combined with 45dB hybrid active noise cancellation, LDAC high-resolution streaming, and ultra-plush memory foam ear cups.',
        category: catMap['audio'],
        brand: 'SoundMaster',
        price: 189,
        comparePrice: 249,
        costPrice: 110,
        discount: 24,
        stock: 28,
        lowStockThreshold: 5,
        mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
        ],
        colors: ['Black', 'White'],
        rating: 4.9,
        reviewCount: 64,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Tashkent Central Hub',
        isFeatured: true,
        isOnSale: true,
        specifications: [
          { name: 'Driver Size', value: '40mm Custom Beryllium Diaphragm' },
          { name: 'Frequency Response', value: '10Hz - 40,000Hz (Hi-Res Audio)' },
          { name: 'Noise Cancellation', value: 'Hybrid ANC -45dB with Transparency' },
          { name: 'Bluetooth', value: 'Version 5.3 with Multipoint Dual Connect' },
          { name: 'Audio Codecs', value: 'LDAC, AAC, SBC, aptX HD' },
          { name: 'Battery Life', value: '65 Hours (ANC Off) / 45 Hours (ANC On)' },
          { name: 'Fast Charging', value: '10 Min Charge = 8 Hours Playback' },
          { name: 'Microphones', value: '6 Beamforming Microphones with ENC' },
          { name: 'Ear Cushions', value: 'Protein Leather Memory Foam' },
          { name: 'Impedance', value: '32 Ohms' },
          { name: 'Weight', value: '258g' },
          { name: 'Wired Mode', value: '3.5mm Gold-Plated Audio Cable Included' },
          { name: 'Carrying Case', value: 'Hard Shell EVA Travel Case' },
          { name: 'App Control', value: 'Custom 10-Band EQ via Mobile App' },
          { name: 'Warranty', value: '2 Years Manufacturer Warranty' }
        ]
      },
      {
        name: 'Pro True Wireless Earbuds with Spatial Audio',
        slug: 'pro-true-wireless-earbuds-spatial-audio',
        sku: 'AUD-EAR-PRO',
        description: 'Engineered for crisp acoustics, zero latency gaming mode, 3D spatial dynamic head tracking, and IPX7 sweat & waterproof endurance.',
        category: catMap['audio'],
        brand: 'SoundMaster',
        price: 99,
        comparePrice: 129,
        costPrice: 55,
        discount: 23,
        stock: 60,
        lowStockThreshold: 10,
        mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
        colors: ['White', 'Black'],
        rating: 4.7,
        reviewCount: 51,
        shippingInfo: 'Instant',
        deliveryTime: 'Today within 3 hours',
        location: 'Corely Flagship Store',
        isFeatured: true,
        specifications: [
          { name: 'Driver', value: '11mm Titanium-Coated Dynamic Unit' },
          { name: 'Spatial Audio', value: 'Dynamic Gyro Head Tracking' },
          { name: 'Noise Cancellation', value: 'Adaptive Smart ANC -42dB' },
          { name: 'Playtime', value: '9 Hours Earbuds / 38 Hours with Case' },
          { name: 'Wireless Charging', value: 'Qi Wireless & USB-C' },
          { name: 'Water Resistance', value: 'IPX7 Certified Waterproof' },
          { name: 'Latency', value: '40ms Ultra-Low Gaming Mode' },
          { name: 'Bluetooth', value: 'Bluetooth 5.4 LE Audio' },
          { name: 'Controls', value: 'Pressure-Sensitive Stem Gestures' },
          { name: 'Microphones', value: 'Triple Mic with Wind Noise Filter' },
          { name: 'Weight', value: '4.2g per earbud' },
          { name: 'Ear Tips', value: '4 Sizes Medical-Grade Silicone' },
          { name: 'Find My Earbuds', value: 'Acoustic Sound Ping Integration' },
          { name: 'Codecs', value: 'LHDC 5.0, AAC, SBC' },
          { name: 'Warranty', value: '1 Year Replacement' }
        ]
      },

      // Gaming Gear & Controllers
      {
        name: 'Multi-Platform Pro Wireless Game Controller',
        slug: 'multi-platform-pro-wireless-game-controller',
        sku: 'GM-CTR-PRO',
        description: 'Elite gaming controller equipped with Hall Effect electromagnetic anti-drift joysticks, mechanical microswitch face buttons, adjustable trigger stops, and 4 remappable rear paddles.',
        category: catMap['gaming'],
        brand: 'NexusPad',
        price: 79,
        comparePrice: 99,
        costPrice: 42,
        discount: 20,
        stock: 35,
        lowStockThreshold: 5,
        mainImage: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'White', 'Blue'],
        rating: 4.8,
        reviewCount: 33,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Gaming Hub',
        isFeatured: true,
        isOnSale: true,
        specifications: [
          { name: 'Joysticks', value: 'Hall Effect Electromagnetic (Zero Drift)' },
          { name: 'Triggers', value: 'Dual-Stage Hair Trigger Stops' },
          { name: 'Paddles', value: '4 Ergonomic Remappable Rear Buttons' },
          { name: 'Buttons', value: 'Tactile Mechanical Microswitches' },
          { name: 'Polling Rate', value: '1000Hz Ultra-Low Latency' },
          { name: 'Vibration', value: 'Dual Asymmetric Haptic Motors' },
          { name: 'Gyroscope', value: '6-Axis Motion Sensor Support' },
          { name: 'Compatibility', value: 'PC, Nintendo Switch, iOS, Android, Steam Deck' },
          { name: 'Battery', value: '1000mAh Lithium Battery (20+ Hours)' },
          { name: 'Grip', value: 'Laser-Etched Anti-Slip Rubber Grip' },
          { name: 'Connection', value: 'Bluetooth 5.0, 2.4G Wireless Dongle, USB-C' },
          { name: 'Audio Jack', value: '3.5mm Stereo Headset Output' },
          { name: 'Weight', value: '245g' },
          { name: 'Software', value: 'Nexus Profile Manager (No-driver config)' },
          { name: 'Warranty', value: '18 Months Official' }
        ]
      },

      // Monitors & Displays
      {
        name: '34" Curved UltraWide 165Hz Gaming Monitor',
        slug: '34-curved-ultrawide-165hz-gaming-monitor',
        sku: 'MON-34-UW165',
        description: 'Immersive 1500R curved WQHD (3440x1440) panoramic gaming monitor with 1ms response time, 165Hz refresh rate, AMD FreeSync Premium, and 99% sRGB color gamut.',
        category: catMap['computers'],
        brand: 'AeroVision',
        price: 389,
        comparePrice: 479,
        costPrice: 260,
        discount: 19,
        stock: 14,
        lowStockThreshold: 3,
        mainImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black'],
        rating: 4.9,
        reviewCount: 27,
        shippingInfo: 'Regular',
        deliveryTime: '2-3 Days',
        location: 'Corely Heavy Logistics',
        isFeatured: true,
        isOnSale: true,
        specifications: [
          { name: 'Screen Size', value: '34 Inch Curved (21:9 Aspect Ratio)' },
          { name: 'Resolution', value: 'WQHD 3440 x 1440 Pixels' },
          { name: 'Curvature', value: '1500R Human Eye Curvature' },
          { name: 'Refresh Rate', value: '165Hz Overclocked' },
          { name: 'Response Time', value: '1ms MPRT' },
          { name: 'Panel Type', value: 'Fast VA with HDR400' },
          { name: 'Color Gamut', value: '99% sRGB, 90% DCI-P3' },
          { name: 'Contrast Ratio', value: '3000:1 Static Contrast' },
          { name: 'Sync Tech', value: 'AMD FreeSync Premium & G-Sync Compatible' },
          { name: 'Ports', value: '2x DisplayPort 1.4, 2x HDMI 2.0, 1x Audio Out' },
          { name: 'Stand Adjustability', value: 'Height 110mm, Tilt -5°/+20°, Swivel ±30°' },
          { name: 'VESA Mount', value: '100 x 100 mm Supported' },
          { name: 'Eye Care', value: 'TUV Certified Low Blue Light & Flicker-Free' },
          { name: 'Power Consumption', value: '45W Typical' },
          { name: 'Warranty', value: '3 Years Zero Dead Pixel Warranty' }
        ]
      },

      // Laptops & Computers
      {
        name: 'Zenith Pro 16 AI Ultrabook M3 Edition',
        slug: 'zenith-pro-16-ai-ultrabook-m3-edition',
        sku: 'LAP-ZEN-16PRO',
        description: 'Featherlight aerospace magnesium unibody powerhouse housing a 16-core NPU neural engine, 3.2K 120Hz OLED Infinity display, 32GB LPDDR5X RAM, and 1TB PCIe 4.0 SSD.',
        category: catMap['computers'],
        brand: 'Zenith',
        price: 1499,
        comparePrice: 1799,
        costPrice: 1150,
        discount: 17,
        stock: 12,
        lowStockThreshold: 4,
        mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        colors: ['Silver', 'Black'],
        rating: 4.9,
        reviewCount: 45,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Premium Vault',
        isFeatured: true,
        isOnSale: true,
        isNewArrival: true,
        specifications: [
          { name: 'Processor', value: 'Zenith Octa-Core 4.8GHz Max Boost' },
          { name: 'Neural NPU', value: '45 TOPS Dedicated AI Coprocessor' },
          { name: 'Memory', value: '32GB LPDDR5X 7500MHz Quad-Channel' },
          { name: 'Storage', value: '1TB NVMe M.2 Gen4 High-Speed SSD' },
          { name: 'Display', value: '16.0" 3.2K OLED 3200x2000 120Hz 500 nits' },
          { name: 'Graphics', value: 'Integrated 16-Core Neural GPU' },
          { name: 'Battery', value: '86Wh (Up to 18 Hours Video Streaming)' },
          { name: 'Chassis', value: 'CNC Aerospace Grade Magnesium Alloy' },
          { name: 'Weight', value: '1.38 kg Ultra-Portable' },
          { name: 'Wireless', value: 'Wi-Fi 7 (802.11be) + Bluetooth 5.4' },
          { name: 'Ports', value: '2x Thunderbolt 4, 1x USB-A 3.2, HDMI 2.1, SD Card' },
          { name: 'Webcam', value: '1080p FHD IR Camera with Windows Hello' },
          { name: 'Keyboard', value: 'Backlit 1.5mm Travel with Glass Precision Trackpad' },
          { name: 'Audio', value: 'Quad Hi-Fi Speakers with Dolby Atmos' },
          { name: 'Warranty', value: '2 Years On-Site Premier Support' }
        ]
      },

      // Smartphones & Wearables
      {
        name: 'Aether 15 Pro Max Titanium Smartphone',
        slug: 'aether-15-pro-max-titanium-smartphone',
        sku: 'PHN-AETH-15PRO',
        description: 'Grade 5 aerospace titanium frame enclosing a 6.7" Super Retina 120Hz ProMotion screen, 48MP periscope telephoto camera system, and all-day 5000mAh battery life.',
        category: catMap['smartphones'],
        brand: 'Aether',
        price: 1199,
        comparePrice: 1299,
        costPrice: 900,
        discount: 8,
        stock: 22,
        lowStockThreshold: 5,
        mainImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'White', 'Blue'],
        rating: 4.8,
        reviewCount: 78,
        shippingInfo: 'Instant',
        deliveryTime: 'Today in 2 Hours',
        location: 'Official Store',
        isFeatured: true,
        specifications: [
          { name: 'Display', value: '6.7" OLED Super Retina 1-120Hz ProMotion' },
          { name: 'Processor', value: 'Hexa-core 3nm Flagship SoC' },
          { name: 'RAM', value: '12GB Unified RAM' },
          { name: 'Storage', value: '256GB UFS 4.0 Storage' },
          { name: 'Rear Camera', value: '48MP Main (OIS) + 48MP Ultrawide + 12MP 5x Telephoto' },
          { name: 'Front Camera', value: '16MP TrueDepth with Autofocus' },
          { name: 'Battery', value: '5000mAh with 45W Fast Charging & 15W MagCharge' },
          { name: 'Build', value: 'Titanium Grade 5 Edge + Ceramic Shield Glass' },
          { name: 'Water Resistance', value: 'IP68 (6 Meters Depth for 30 Mins)' },
          { name: 'OS', value: 'AetherOS 18 with AI Assistant' },
          { name: 'Connectivity', value: '5G Sub-6 & mmWave, Wi-Fi 7, Dual eSIM' },
          { name: 'Weight', value: '221g' },
          { name: 'Biometrics', value: '3D Face Recognition & Under-display Fingerprint' },
          { name: 'Speaker', value: 'Spatial Stereo Speakers' },
          { name: 'Warranty', value: '1 Year AppleCare / Corely Direct' }
        ]
      },
      {
        name: 'Chronos Titanium Smart Watch GPS',
        slug: 'chronos-titanium-smart-watch-gps',
        sku: 'WCH-CHRN-TITAN',
        description: 'Rugged titanium outdoor adventure smartwatch featuring sapphire crystal glass, dual-frequency multi-GNSS navigation, offline topographic maps, and 14-day battery life.',
        category: catMap['smartphones'],
        brand: 'Chronos',
        price: 249,
        comparePrice: 299,
        costPrice: 140,
        discount: 17,
        stock: 31,
        lowStockThreshold: 6,
        mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'Orange', 'Green'],
        rating: 4.8,
        reviewCount: 36,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Tech Hub',
        isFeatured: true,
        specifications: [
          { name: 'Case Material', value: 'Grade 2 Titanium with Sapphire Glass' },
          { name: 'Display', value: '1.43" AMOLED 466x466 Always-On (1000 nits)' },
          { name: 'GNSS', value: 'Dual-Band L1+L5 GPS, GLONASS, Galileo, BeiDou' },
          { name: 'Water Resistance', value: '10 ATM (100m Dive Rated)' },
          { name: 'Battery', value: '14 Days Smart Mode / 40 Hours Continuous GPS' },
          { name: 'Sensors', value: 'Optical Heart Rate, SpO2, ECG, Barometer, Compass' },
          { name: 'Health', value: 'Sleep Analysis, HRV Status, VO2 Max, Stress Tracker' },
          { name: 'Workout Modes', value: '150+ Sports Modes with Automatic Detection' },
          { name: 'Storage', value: '32GB On-board Music & Offline Maps' },
          { name: 'Strap', value: '22mm Quick-Release Fluororubber + Nylon' },
          { name: 'Connectivity', value: 'Bluetooth 5.3, Wi-Fi 2.4GHz, NFC Payments' },
          { name: 'Mic & Speaker', value: 'Bluetooth Phone Calling & Voice Assistant' },
          { name: 'Operating Temp', value: '-30°C to +60°C Extreme Condition Rated' },
          { name: 'Weight', value: '49g (Without Strap)' },
          { name: 'Warranty', value: '2 Years Global Adventure Warranty' }
        ]
      },

      // Accessories: Chargers, Hubs & Power
      {
        name: '140W GaN 4-Port Fast Desktop Charger',
        slug: '140w-gan-4-port-fast-desktop-charger',
        sku: 'ACC-CHG-140W',
        description: 'Advanced Gallium Nitride III charging station capable of delivering full 140W PD 3.1 speed across dual laptops and smartphones simultaneously.',
        category: catMap['accessories'],
        brand: 'VoltGrid',
        price: 69,
        comparePrice: 89,
        costPrice: 38,
        discount: 22,
        stock: 52,
        lowStockThreshold: 10,
        mainImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'White'],
        rating: 4.9,
        reviewCount: 47,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Warehouse',
        isFeatured: true,
        specifications: [
          { name: 'Total Output', value: '140W Max Power Delivery 3.1' },
          { name: 'Ports', value: '3x USB-C (140W/100W/65W) + 1x USB-A (22.5W)' },
          { name: 'Technology', value: 'GaN III Semiconductor Efficiency' },
          { name: 'Single Port Max', value: '140W (Powers MacBook Pro 16" to 50% in 30m)' },
          { name: 'Multi-Port Sharing', value: 'Intelligent Dynamic Power Allocation' },
          { name: 'Safety Protections', value: 'Over-Current, Over-Voltage, Temp Guard' },
          { name: 'Cable Included', value: '1.5m 240W E-Marker Braided Type-C Cable' },
          { name: 'Plug Type', value: 'Foldable US/EU Interchangeable Pins' },
          { name: 'Dimensions', value: '80 x 60 x 32 mm' },
          { name: 'Weight', value: '260g' },
          { name: 'Protocols', value: 'PD 3.1, QC 4.0+, PPS, AFC, FCP' },
          { name: 'Heat Dissipation', value: 'Aerogel Insulation Cooling' },
          { name: 'Certifications', value: 'CE, FCC, RoHS, UL Tested' },
          { name: 'Efficiency', value: '95% Conversion Rate' },
          { name: 'Warranty', value: '2 Years Corely Replacement' }
        ]
      },
      {
        name: '12-in-1 Thunderbolt 4 Multi-Port Docking Hub',
        slug: '12-in-1-thunderbolt-4-multi-port-docking-hub',
        sku: 'ACC-HUB-TB4',
        description: 'All-in-one aluminum desktop workstation hub providing 40Gbps data bandwidth, dual 4K@120Hz display outputs, 2.5GbE Ethernet, and 100W laptop host pass-through charging.',
        category: catMap['accessories'],
        brand: 'VoltGrid',
        price: 139,
        comparePrice: 179,
        costPrice: 75,
        discount: 22,
        stock: 38,
        lowStockThreshold: 6,
        mainImage: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80'],
        colors: ['Silver', 'Black'],
        rating: 4.8,
        reviewCount: 28,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Tech Hub',
        isFeatured: false,
        specifications: [
          { name: 'Upstream Bandwidth', value: 'Thunderbolt 4 / USB4 (40Gbps)' },
          { name: 'Host Charging', value: '100W Power Delivery to Laptop' },
          { name: 'Video Outputs', value: '2x HDMI 2.1 (4K@120Hz) + 1x DP 1.4' },
          { name: 'Network', value: '2.5 Gigabit RJ45 Ethernet Port' },
          { name: 'USB-C Ports', value: '2x 10Gbps USB-C with 20W PD' },
          { name: 'USB-A Ports', value: '3x 10Gbps USB 3.2 Gen 2' },
          { name: 'Card Readers', value: 'SD 4.0 & MicroSD UHS-II (312MB/s)' },
          { name: 'Audio Jack', value: '3.5mm TRRS Headphone/Mic Combo' },
          { name: 'Housing', value: 'Sandblasted Anodized Heat Sink Aluminum' },
          { name: 'Cable', value: '0.8m 40Gbps Thunderbolt 4 Cable Included' },
          { name: 'Compatibility', value: 'MacBook Pro, Windows Thunderbolt, iPad M-Series' },
          { name: 'Dimensions', value: '170 x 75 x 22 mm' },
          { name: 'Weight', value: '340g' },
          { name: 'Power Supply', value: 'Included 150W DC External Brick' },
          { name: 'Warranty', value: '2 Years Comprehensive' }
        ]
      },

      // Furniture & Workstation
      {
        name: 'Ergonomic Breathable Mesh Gaming Chair',
        slug: 'ergonomic-breathable-mesh-gaming-chair',
        sku: 'FUR-CHR-MESH',
        description: 'Professional high-back dynamic mesh ergonomic chair featuring adaptive 3D lumbar support, 4D adjustable armrests, pneumatic class-4 gas lift, and 135° recline with footrest.',
        category: catMap['furniture'],
        brand: 'ErgoLife',
        price: 269,
        comparePrice: 349,
        costPrice: 170,
        discount: 23,
        stock: 19,
        lowStockThreshold: 4,
        mainImage: 'https://images.unsplash.com/photo-1580481077195-c328a3727177?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1580481077195-c328a3727177?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'White'],
        rating: 4.8,
        reviewCount: 39,
        shippingInfo: 'Regular',
        deliveryTime: '2-4 Days',
        location: 'Corely Heavy Logistics',
        isFeatured: true,
        specifications: [
          { name: 'Mesh Material', value: 'High-Tensile German Polymer Elastomer Mesh' },
          { name: 'Lumbar Support', value: 'Self-Adaptive Dynamic 3D Pressure Sensing' },
          { name: 'Armrests', value: '4D Multi-Directional PU Padded' },
          { name: 'Recline Angle', value: '90° to 135° with 4 Lockable Tilt Stops' },
          { name: 'Gas Lift', value: 'SGS / BIFMA Certified Class 4 Cylinder' },
          { name: 'Base', value: 'Heavy Duty Die-Cast Polished Aluminum 350mm' },
          { name: 'Casters', value: '65mm Silent PU Dual-Wheel Hardwood Safe' },
          { name: 'Weight Capacity', value: '150 kg (330 lbs)' },
          { name: 'Headrest', value: '2D Bi-Directional Cervical Spine Curve' },
          { name: 'Footrest', value: 'Retractable Steel Reinforced Padded Rest' },
          { name: 'Seat Depth', value: 'Adjustable Sliding Seat Pan (50mm)' },
          { name: 'Height Adjustment', value: '10cm Height Travel' },
          { name: 'Total Chair Weight', value: '22.5 kg' },
          { name: 'Assembly', value: 'Simple 15-Minute Easy Setup Tools Included' },
          { name: 'Warranty', value: '5 Years Structural Frame Guarantee' }
        ]
      },

      // PC Components
      {
        name: 'PCIe 5.0 NVMe 2TB High-Speed SSD 14000MB/s',
        slug: 'pcie-5-0-nvme-2tb-high-speed-ssd',
        sku: 'CMP-SSD-GEN5',
        description: 'Next-gen Gen5 x4 NVMe solid state drive with monstrous read speeds up to 14,000MB/s, active heat pipe aluminum heatsink, and Micron 232-layer 3D TLC NAND.',
        category: catMap['computers'],
        brand: 'AeroVision',
        price: 189,
        comparePrice: 229,
        costPrice: 130,
        discount: 17,
        stock: 40,
        lowStockThreshold: 8,
        mainImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black'],
        rating: 4.9,
        reviewCount: 22,
        shippingInfo: 'Next Day',
        deliveryTime: '1-2 Days',
        location: 'Corely Tech Hub',
        isFeatured: false,
        specifications: [
          { name: 'Interface', value: 'PCIe Gen 5.0 x4, NVMe 2.0' },
          { name: 'Sequential Read', value: 'Up to 14,000 MB/s' },
          { name: 'Sequential Write', value: 'Up to 12,000 MB/s' },
          { name: 'Random IOPS', value: '1,500,000 Read / 1,400,000 Write' },
          { name: 'Controller', value: 'Phison PS5026-E26 with DirectStorage' },
          { name: 'NAND Flash', value: 'Micron 232-Layer 3D TLC' },
          { name: 'DRAM Cache', value: '4GB LPDDR4 Dedicated Cache' },
          { name: 'Endurance (TBW)', value: '1400 TBW' },
          { name: 'MTBF', value: '1.6 Million Hours' },
          { name: 'Heatsink', value: 'Integrated Dual Copper Heatpipe Cooler' },
          { name: 'Form Factor', value: 'M.2 2280' },
          { name: 'Encryption', value: 'AES 256-bit Hardware Encryption' },
          { name: 'Operating Temp', value: '0°C to 70°C' },
          { name: 'Software', value: 'Corely SSD Toolbox & Health Monitor' },
          { name: 'Warranty', value: '5 Years Limited Warranty' }
        ]
      },

      // Tools & Maintenance
      {
        name: 'Precision Electric Screwdriver 64-in-1 Kit',
        slug: 'precision-electric-screwdriver-64-in-1-kit',
        sku: 'TLS-SCR-64PRO',
        description: 'Rechargeable dual-torque electric screwdriver with magnetic aluminum storage case, 64 S2 steel precision bits, LED shadowless lighting, and OLED screen.',
        category: catMap['tools'],
        brand: 'ToolCraft',
        price: 49,
        comparePrice: 65,
        costPrice: 24,
        discount: 25,
        stock: 62,
        lowStockThreshold: 12,
        mainImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
        colors: ['Black', 'Silver'],
        rating: 4.8,
        reviewCount: 31,
        shippingInfo: 'Economic',
        deliveryTime: '2-3 Days',
        location: 'Corely Warehouse',
        isFeatured: false,
        specifications: [
          { name: 'Bits Included', value: '64 S2 Hardened Steel Bits (60HRC)' },
          { name: 'Torque Levels', value: '0.2Nm / 0.3Nm / 3.0Nm Manual' },
          { name: 'Motor Speed', value: '200 RPM High Efficiency Motor' },
          { name: 'Battery', value: '350mAh Lithium (Over 500 Screws per charge)' },
          { name: 'Charging', value: 'Type-C Fast Charge (45 Mins Full)' },
          { name: 'Display', value: 'Mini OLED Screen with Battery & Direction' },
          { name: 'Lighting', value: '3x Shadowless Circular LED Work Lights' },
          { name: 'Case', value: 'Pop-Up Magnetic Aluminum Alloy Case' },
          { name: 'Magnetizer', value: 'Built-in Magnetizer / Demagnetizer Block' },
          { name: 'Suited For', value: 'Smartphones, Laptops, Watches, Cameras, Drones' },
          { name: 'Weight', value: 'Total Kit 420g / Pen 55g' },
          { name: 'Chuck Type', value: 'Magnetic Quick-Release 4mm Hex' },
          { name: 'Safety', value: 'Electronic Brake Instant Stop' },
          { name: 'Accessories', value: 'Spudger, Tweezers, Suction Cup Included' },
          { name: 'Warranty', value: '2 Years Complete Repair/Replace' }
        ]
      }
    ];

    // Generate remaining realistic products to total 54 products across all categories
    const additionalProductsNames = [
      { name: 'AeroStream 4K Ultra HD Streaming Webcam', cat: 'electronics', brand: 'AeroVision', price: 89, comp: 119, stock: 40, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80' },
      { name: 'Nova Pro Dual Driver RGB Desktop Soundbar', cat: 'audio', brand: 'SoundMaster', price: 79, comp: 99, stock: 35, img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80' },
      { name: 'Apex Titan Dual-Motor Electric Standing Desk 160cm', cat: 'furniture', brand: 'ErgoLife', price: 449, comp: 549, stock: 15, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80' },
      { name: 'Vortex RGB Liquid CPU Cooler 360mm AIO', cat: 'computers', brand: 'AeroVision', price: 129, comp: 159, stock: 26, img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80' },
      { name: 'Lumina Smart Screen Ambient Lightbar with Camera', cat: 'home', brand: 'Corely', price: 59, comp: 79, stock: 48, img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80' },
      { name: 'CyberBackpack Water-Resistant Tech Sling 18L', cat: 'fashion', brand: 'Nexus', price: 65, comp: 85, stock: 55, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
      { name: 'MagHold 3-in-1 Magnetic Wireless Charging Stand', cat: 'accessories', brand: 'VoltGrid', price: 49, comp: 69, stock: 68, img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80' },
      { name: 'ShadowStrike Optical Microswitch Gaming Keyboard', cat: 'gaming', brand: 'Keychron', price: 119, comp: 149, stock: 30, img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80' },
      { name: 'CoreFlow Ultra Soft Microfiber XL Desk Mat', cat: 'accessories', brand: 'Corely', price: 24, comp: 32, stock: 80, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80' },
      { name: 'OmniCast 4K Wireless Display Receiver Dongle', cat: 'electronics', brand: 'VoltGrid', price: 39, comp: 49, stock: 45, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80' },
      { name: 'Titanium Fold 5 Ultra 512GB Smartphone', cat: 'smartphones', brand: 'Aether', price: 1699, comp: 1899, stock: 8, img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80' },
      { name: 'StudioMic XLR / USB-C Condenser Microphone', cat: 'audio', brand: 'SoundMaster', price: 119, comp: 149, stock: 25, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80' },
      { name: 'StreamDeck 15-Key LCD Interactive Studio Controller', cat: 'gaming', brand: 'NexusPad', price: 149, comp: 179, stock: 18, img: 'https://images.unsplash.com/photo-1612287233207-6b45f1b6a22f?w=800&auto=format&fit=crop&q=80' },
      { name: 'ThermalPro Infrared Inspection Camera 256x192', cat: 'tools', brand: 'ToolCraft', price: 299, comp: 349, stock: 12, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
      { name: 'HyperCharge 65W Slim Travel GaN Power Bank 20000mAh', cat: 'accessories', brand: 'VoltGrid', price: 59, comp: 79, stock: 65, img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80' },
      { name: 'AirPure Desktop HEPA Smart Air Purifier Quiet Tech', cat: 'home', brand: 'Corely', price: 89, comp: 109, stock: 32, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80' },
      { name: 'ProArt 27" 4K Color Accurate IPS Designer Monitor', cat: 'computers', brand: 'AeroVision', price: 429, comp: 499, stock: 16, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80' },
      { name: 'AcousticShield Active Noise Isolating Earbuds', cat: 'audio', brand: 'SoundMaster', price: 49, comp: 69, stock: 70, img: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80' },
      { name: 'GamerGrip Ergonomic Controller Charging Dock Station', cat: 'gaming', brand: 'NexusPad', price: 34, comp: 44, stock: 50, img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80' },
      { name: 'UltraSlim Aluminum Laptop Riser with Dual Fans', cat: 'accessories', brand: 'Corely', price: 39, comp: 49, stock: 45, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80' },
      { name: 'Titanium Edge Smart Ring Health & Sleep Tracker', cat: 'smartphones', brand: 'Chronos', price: 179, comp: 219, stock: 24, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80' },
      { name: 'SpeedDemon Wireless Gaming Mouse 8K HyperSpeed', cat: 'gaming', brand: 'ViperTech', price: 79, comp: 99, stock: 35, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80' },
      { name: 'CoreSound Hi-Res Lossless Audio DAC & Amplifier', cat: 'audio', brand: 'SoundMaster', price: 95, comp: 120, stock: 28, img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80' },
      { name: 'Modular Aluminum Monitor Arm Heavy-Duty 15kg', cat: 'furniture', brand: 'ErgoLife', price: 89, comp: 115, stock: 30, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80' },
      { name: 'WeatherProof Tech Organizer Cable Case Travel', cat: 'fashion', brand: 'Nexus', price: 29, comp: 39, stock: 65, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
      { name: 'SmartHome Matter-Ready Zigbee 3.0 IoT Gateway Hub', cat: 'electronics', brand: 'Corely', price: 45, comp: 59, stock: 40, img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' },
      { name: 'Braided 240W Silicone USB-C to USB-C Cable 2M', cat: 'accessories', brand: 'CableCraft', price: 18, comp: 25, stock: 90, img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80' },
      { name: 'ApexPro 14" OLED Creator Laptop RTX 4060', cat: 'computers', brand: 'Zenith', price: 1299, comp: 1499, stock: 10, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
      { name: 'SolarPulse 100W Portable Solar Panel Station', cat: 'electronics', brand: 'VoltGrid', price: 169, comp: 199, stock: 20, img: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80' },
      { name: 'RetroPixel Mechanical Number Pad Wireless Bluetooth', cat: 'gaming', brand: 'Keychron', price: 45, comp: 55, stock: 35, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80' },
      { name: 'HoloSound Smart Bluetooth Speaker 360 Audio', cat: 'audio', brand: 'SoundMaster', price: 69, comp: 89, stock: 42, img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80' },
      { name: 'Anti-Fatigue Ergonomic Active Footrest Platform', cat: 'furniture', brand: 'ErgoLife', price: 39, comp: 49, stock: 50, img: 'https://images.unsplash.com/photo-1580481077195-c328a3727177?w=800&auto=format&fit=crop&q=80' },
      { name: 'SmartTag Bluetooth Ultra-Wideband Item Tracker 4-Pack', cat: 'electronics', brand: 'Corely', price: 59, comp: 79, stock: 60, img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' },
      { name: 'ProSolder Temperature Controlled Soldering Iron Station', cat: 'tools', brand: 'ToolCraft', price: 79, comp: 99, stock: 25, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
      { name: 'MagSafe Leather Magnetic Wallet Stand for Phones', cat: 'fashion', brand: 'Nexus', price: 28, comp: 38, stock: 75, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
      { name: 'Atmosphere LED Sunset Smart Mood Lamp App Control', cat: 'home', brand: 'Corely', price: 32, comp: 42, stock: 55, img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80' }
    ];

    additionalProductsNames.forEach((item, index) => {
      const discount = Math.round(((item.comp - item.price) / item.comp) * 100);
      const colorsPool = ['Black', 'White', 'Blue', 'Orange', 'Green', 'Red'];
      const pickedColors = [colorsPool[index % colorsPool.length], colorsPool[(index + 1) % colorsPool.length]];

      productsData.push({
        name: item.name,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${index + 10}`,
        sku: `CRL-${item.brand.substring(0, 3).toUpperCase()}-${100 + index}`,
        description: `Premium ${item.name} engineered for superior performance, durability, and seamless everyday integration. Features modern minimalist industrial aesthetics and rigorous quality verification.`,
        category: catMap[item.cat] || categories[0].id,
        brand: item.brand,
        price: item.price,
        comparePrice: item.comp,
        costPrice: Math.round(item.price * 0.6),
        discount,
        stock: item.stock,
        lowStockThreshold: 5,
        mainImage: item.img,
        images: [item.img],
        colors: pickedColors,
        rating: 4.5 + (index % 5) * 0.1,
        reviewCount: 15 + index * 2,
        shippingInfo: index % 3 === 0 ? 'Next Day' : (index % 2 === 0 ? 'Instant' : 'Regular'),
        location: 'Corely Central Hub',
        isFeatured: index < 8,
        isOnSale: discount > 15,
        isNewArrival: index > 20,
        specifications: [
          { name: 'Model Brand', value: item.brand },
          { name: 'Product Class', value: 'High Performance Tier' },
          { name: 'Warranty', value: '1 Year Manufacturer Guarantee' },
          { name: 'Connectivity', value: 'Modern Plug & Play' },
          { name: 'Compliance', value: 'CE, FCC, RoHS Certified' },
          { name: 'Material', value: 'Premium Alloy & Matte Polymer' },
          { name: 'Packaging', value: 'Eco-Friendly Recycled Packaging' },
          { name: 'Origin', value: 'Official Global Quality Inspected' }
        ]
      });
    });

    // Populate multilingual fields for each product
    const translations = {
      'Keychron X401K Wireless Mechanical Keyboard': { uz: 'Keychron X401K Simsiz Mexanik Klaviaturasi', ru: 'Беспроводная механическая клавиатура Keychron X401K' },
      'Ultra-Light Gaming Mouse 4K Polling': { uz: "Ultra-Yengil 4K Gaming Sichqonchasi", ru: 'Ультралегкая игровая мышь 4K с быстрым откликом' },
      'Ergonomic Vertical Wireless Mouse': { uz: 'Ergonomik Vertikal Simsiz Sichqoncha', ru: 'Эргономичная вертикальная беспроводная мышь' },
      'Custom Coiled Aviator Keyboard Cable': { uz: "Klaviatura uchun Maxsus O'ralgan Aviator Kabel", ru: 'Кастомный витой авиатор-кабель для клавиатуры' },
      'Wireless Over-Ear Studio Headphones ANC': { uz: "ANC Shovqin To'suvchi Simsiz Studiya Quloqchini", ru: 'Беспроводные студийные наушники с шумоподавлением ANC' },
      'Pro True Wireless Earbuds with Spatial Audio': { uz: 'Fazoviy Ovozli Pro Simsiz Quloqchinlar', ru: 'Беспроводные наушники Pro с пространственным аудио' },
      'Multi-Platform Pro Wireless Game Controller': { uz: "Multi-Platforma Pro Simsiz O'yin Djopstigi", ru: 'Мультиплатформенный беспроводной геймпад Pro' },
      '34" Curved UltraWide 165Hz Gaming Monitor': { uz: '34" Botiq UltraWide 165Hz O\'yin Monitori', ru: '34" Изогнутый игровой монитор UltraWide 165Гц' },
      'Zenith Pro 16 AI Ultrabook M3 Edition': { uz: 'Zenith Pro 16 AI Ultrabook M3 Nashri', ru: 'Ультрабук Zenith Pro 16 AI M3 Edition' },
      'Aether 15 Pro Max Titanium Smartphone': { uz: 'Aether 15 Pro Max Titan Smartfoni', ru: 'Смартфон Aether 15 Pro Max Titanium' },
      'Chronos Titanium Smart Watch GPS': { uz: 'Chronos Titan GPS Aqlli Soati', ru: 'Титановые смарт-часы Chronos с GPS' },
      '140W GaN 4-Port Fast Desktop Charger': { uz: '140W GaN 4-Portli Tezkor Stol Quvvatlagichi', ru: 'Быстрое настольное зарядное устройство GaN 140W 4 порта' },
      '12-in-1 Thunderbolt 4 Multi-Port Docking Hub': { uz: '12-in-1 Thunderbolt 4 Multi-Port Dok-Stansiyasi', ru: 'Док-станция 12-в-1 Thunderbolt 4 Hub' },
      'Ergonomic Breathable Mesh Gaming Chair': { uz: "Ergonomik Nafas Oluvchi O'yin Kreslosi", ru: 'Эргономичное сетчатое игровое кресло' },
      'PCIe 5.0 NVMe 2TB High-Speed SSD 14000MB/s': { uz: 'PCIe 5.0 NVMe 2TB Tezkor SSD (14000MB/s)', ru: 'Высокоскоростной SSD PCIe 5.0 NVMe 2ТБ (14000МБ/с)' },
      'Precision Electric Screwdriver 64-in-1 Kit': { uz: "Aniq Elektr Otvyortka 64-in-1 To'plami", ru: 'Набор прецизионных электрических отверток 64-в-1' },
      'AeroStream 4K Ultra HD Streaming Webcam': { uz: 'AeroStream 4K Ultra HD Striming Veb-kamerasi', ru: 'Веб-камера для стриминга AeroStream 4K Ultra HD' },
      'Nova Pro Dual Driver RGB Desktop Soundbar': { uz: 'Nova Pro Dual Driver RGB Stol Soundbari', ru: 'Настольный RGB саундбар Nova Pro с двойным драйвером' },
      'Apex Titan Dual-Motor Electric Standing Desk 160cm': { uz: 'Apex Titan Ikki Motorli Elektr Stol 160sm', ru: 'Двухмоторный электрический стол Apex Titan 160см' },
      'Vortex RGB Liquid CPU Cooler 360mm AIO': { uz: 'Vortex RGB Suyuqlikli Protsessor Sovutgichi 360mm AIO', ru: 'Жидкостное СВО охлаждение процессора Vortex RGB 360мм AIO' },
      'Lumina Smart Screen Ambient Lightbar with Camera': { uz: "Lumina Kamerali Aqlli Monitor Yoritgich Chirog'i", ru: 'Умная лампа на монитор Lumina с камерой подсветки' },
      'CyberBackpack Water-Resistant Tech Sling 18L': { uz: "CyberBackpack Suv O'tkazmaydigan Tech Ryukzak 18L", ru: 'Водонепроницаемый технологичный рюкзак CyberBackpack 18L' },
      'MagHold 3-in-1 Magnetic Wireless Charging Stand': { uz: 'MagHold 3-in-1 Magnitli Simsiz Quvvatlagich Stendi', ru: 'Магнитная беспроводная зарядная станция 3-в-1 MagHold' },
      'ShadowStrike Optical Microswitch Gaming Keyboard': { uz: "ShadowStrike Optik Mikrouzuvchi O'yin Klaviaturasi", ru: 'Оптическая игровая клавиатура ShadowStrike' },
      'CoreFlow Ultra Soft Microfiber XL Desk Mat': { uz: 'CoreFlow Ultra Yumshoq Mikrofibra XL Stol Gilamchasi', ru: 'Ультрамягкий коврик для стола из микрофибры CoreFlow XL' },
      'OmniCast 4K Wireless Display Receiver Dongle': { uz: 'OmniCast 4K Simsiz Displey Qabul Qiluvchi Dongl', ru: 'Беспроводной 4K приемник дисплея OmniCast' },
      'Titanium Fold 5 Ultra 512GB Smartphone': { uz: 'Titanium Fold 5 Ultra 512GB Buklanuvchi Smartfon', ru: 'Складной смартфон Titanium Fold 5 Ultra 512ГБ' },
      'StudioMic XLR / USB-C Condenser Microphone': { uz: 'StudioMic XLR / USB-C Kondensator Mikrofoni', ru: 'Конденсаторный микрофон StudioMic XLR / USB-C' },
      'StreamDeck 15-Key LCD Interactive Studio Controller': { uz: 'StreamDeck 15 Tugmali LCD Studiya Kontrolleri', ru: 'Интерактивный студийный контроллер StreamDeck с 15 LCD клавишами' },
      'ThermalPro Infrared Inspection Camera 256x192': { uz: 'ThermalPro 256x192 Infraqizil Tekshirish Kamerasi', ru: 'Инфракрасный тепловизор для диагностики ThermalPro 256x192' },
      'HyperCharge 65W Slim Travel GaN Power Bank 20000mAh': { uz: 'HyperCharge 65W Yupqa Sayohat GaN Power Bank 20000mAh', ru: 'Тонкий портативный аккумулятор GaN HyperCharge 65W 20000мАч' },
      'AirPure Desktop HEPA Smart Air Purifier Quiet Tech': { uz: 'AirPure Stolusti HEPA Aqlli Havo Tozalagich', ru: 'Настольный умный очиститель воздуха с HEPA-фильтром AirPure' },
      'ProArt 27" 4K Color Accurate IPS Designer Monitor': { uz: 'ProArt 27" 4K Rang Aniq Dizayner IPS Monitori', ru: 'Дизайнерский 4K IPS монитор ProArt 27" с точной цветопередачей' },
      'AcousticShield Active Noise Isolating Earbuds': { uz: 'AcousticShield Shovqinni Izolyatsiya Qiluvchi Quloqchinlar', ru: 'Наушники с активной шумоизоляцией AcousticShield' },
      'GamerGrip Ergonomic Controller Charging Dock Station': { uz: "GamerGrip Djopstik Ergonomik Quvvatlash Dok-Stansiyasi", ru: 'Зарядная док-станция для геймпадов GamerGrip' },
      'UltraSlim Aluminum Laptop Riser with Dual Fans': { uz: 'UltraSlim Ikkitalik Kulerli Alyuminiy Noutbuk Tagligi', ru: 'Ультратонкая алюминиевая подставка для ноутбука с двумя кулерами' },
      'Titanium Edge Smart Ring Health & Sleep Tracker': { uz: "Titanium Edge Salomatlik va Uyquni O'lchovchi Aqlli Uzuk", ru: 'Умное кольцо Titanium Edge для трекинга здоровья и сна' },
      'SpeedDemon Wireless Gaming Mouse 8K HyperSpeed': { uz: "SpeedDemon 8K HyperSpeed Simsiz O'yin Sichqonchasi", ru: 'Беспроводная игровая мышь SpeedDemon 8K HyperSpeed' },
      'CoreSound Hi-Res Lossless Audio DAC & Amplifier': { uz: 'CoreSound Hi-Res Lossless Audio DAC va Kuchaytirgich', ru: 'Аудио ЦАП и усилитель высокого разрешения CoreSound Hi-Res' },
      'Modular Aluminum Monitor Arm Heavy-Duty 15kg': { uz: 'Modulli Alyuminiy Monitor Kronshteyni (15kg gacha)', ru: 'Модульный алюминиевый кронштейн для монитора (до 15кг)' },
      'WeatherProof Tech Organizer Cable Case Travel': { uz: "WeatherProof Ob-havoga Chidamli Kabellar Organayzeri", ru: 'Водостойкий дорожный органайзер для кабелей и гаджетов' },
      'SmartHome Matter-Ready Zigbee 3.0 IoT Gateway Hub': { uz: 'SmartHome Matter-Ready Zigbee 3.0 IoT Aqlli Xab', ru: 'Шлюз умного дома SmartHome Matter Zigbee 3.0 IoT Hub' },
      'Braided 240W Silicone USB-C to USB-C Cable 2M': { uz: "To'qilgan 240W Silikon USB-C dan USB-C gacha Kabel 2M", ru: 'Плетеный силиконовый кабель 240W USB-C - USB-C 2М' },
      'ApexPro 14" OLED Creator Laptop RTX 4060': { uz: 'ApexPro 14" OLED Ijodkorlar Noutbuki RTX 4060', ru: 'Ноутбук для создателей контента ApexPro 14" OLED RTX 4060' },
      'SolarPulse 100W Portable Solar Panel Station': { uz: 'SolarPulse 100W Portativ Quyosh Paneli Stansiyasi', ru: 'Портативная станция с солнечной панелью 100W SolarPulse' },
      'RetroPixel Mechanical Number Pad Wireless Bluetooth': { uz: 'RetroPixel Simsiz Bluetooth Mexanik Raqamlar Klaviaturasi', ru: 'Беспроводной механический цифровой блок RetroPixel Bluetooth' },
      'HoloSound Smart Bluetooth Speaker 360 Audio': { uz: 'HoloSound 360 Daraja Aqlli Bluetooth Kolonka', ru: 'Умная Bluetooth колонка с круговым звуком HoloSound 360°' },
      'Anti-Fatigue Ergonomic Active Footrest Platform': { uz: 'Charchoqqa Qarshi Ergonomik Oyoq Tagligi', ru: 'Эргономичная подставка для ног против усталости' },
      'SmartTag Bluetooth Ultra-Wideband Item Tracker 4-Pack': { uz: 'SmartTag Bluetooth UWB Buyum Qidiruvchi Tracker (4 talik)', ru: 'Набор меток для поиска вещей SmartTag Bluetooth UWB (4 шт)' },
      'ProSolder Temperature Controlled Soldering Iron Station': { uz: 'ProSolder Haroratni Boshqaruvchi Payvandlash Stansiyasi', ru: 'Паяльная станция с контролем температуры ProSolder' },
      'MagSafe Leather Magnetic Wallet Stand for Phones': { uz: 'MagSafe Charm Magnitli Telefon Hamyon-Stendi', ru: 'Кожаный магнитный кошелек-подставка MagSafe для телефона' },
      'Atmosphere LED Sunset Smart Mood Lamp App Control': { uz: "Atmosphere LED Quyosh Botishi Smart Mood Chirog'i", ru: 'Умная LED лампа заката Atmosphere с управлением через приложение' }
    };

    productsData.forEach((p) => {
      p.name_en = p.name;
      if (translations[p.name]) {
        p.name_uz = translations[p.name].uz;
        p.name_ru = translations[p.name].ru;
      } else {
        p.name_uz = p.name;
        p.name_ru = p.name;
      }
    });

    const formattedProducts = productsData.map(p => {
      const { category, ...rest } = p;
      return {
        ...rest,
        category_id: category || catMap['gaming']
      };
    });

    const createdProducts = await Product.bulkCreate(formattedProducts);
    console.log(`[Seed] Successfully created ${createdProducts.length} products with multilingual names!`);

    // 5. Create Sample Orders
    console.log('[Seed] Creating Sample Orders...');
    const sampleOrders = [
      {
        orderNumber: 'CRL-1001',
        user: customerUser.id,
        items: [
          {
            product: createdProducts[0].id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 1,
            image: createdProducts[0].mainImage,
            color: 'Orange',
            sku: createdProducts[0].sku
          },
          {
            product: createdProducts[1].id,
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            quantity: 1,
            image: createdProducts[1].mainImage,
            color: 'White',
            sku: createdProducts[1].sku
          }
        ],
        shippingAddress: customerUser.addresses[0],
        deliveryMethod: {
          id: 'express',
          name: 'Express Delivery',
          price: 15,
          estimatedDays: '1 Business Day'
        },
        paymentMethod: {
          type: 'card',
          provider: 'Credit/Debit Card (Direct)',
          transactionId: 'TXN-CARD-991823',
          cardLast4: '4242'
        },
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        subtotal: createdProducts[0].price + createdProducts[1].price,
        discount: 10,
        shipping: 15,
        tax: 12.5,
        total: createdProducts[0].price + createdProducts[1].price - 10 + 15 + 12.5,
        timeline: [
          { status: 'Pending', note: 'Order placed by customer', timestamp: new Date(Date.now() - 5 * 86400000) },
          { status: 'Confirmed', note: 'Payment verified', timestamp: new Date(Date.now() - 4 * 86400000) },
          { status: 'Processing', note: 'Packed at Tashkent Tech Hub', timestamp: new Date(Date.now() - 3 * 86400000) },
          { status: 'Shipped', note: 'Courier dispatched via Express', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Delivered', note: 'Successfully delivered to customer', timestamp: new Date(Date.now() - 1 * 86400000) }
        ]
      },
      {
        orderNumber: 'CRL-1002',
        user: customerUser.id,
        items: [
          {
            product: createdProducts[4].id,
            name: createdProducts[4].name,
            price: createdProducts[4].price,
            quantity: 1,
            image: createdProducts[4].mainImage,
            color: 'Black',
            sku: createdProducts[4].sku
          }
        ],
        shippingAddress: customerUser.addresses[0],
        deliveryMethod: {
          id: 'standard',
          name: 'Standard Delivery',
          price: 5,
          estimatedDays: '2-4 Business Days'
        },
        paymentMethod: {
          type: 'cod',
          provider: 'Cash on Delivery',
          transactionId: 'COD-1002'
        },
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        subtotal: createdProducts[4].price,
        discount: 0,
        shipping: 5,
        tax: 16.07,
        total: createdProducts[4].price + 5 + 16.07,
        timeline: [
          { status: 'Pending', note: 'Order placed with Cash on Delivery', timestamp: new Date(Date.now() - 24 * 3600000) },
          { status: 'Confirmed', note: 'Phone confirmation received from customer', timestamp: new Date(Date.now() - 12 * 3600000) },
          { status: 'Processing', note: 'Package being prepped for dispatch', timestamp: new Date(Date.now() - 2 * 3600000) }
        ]
      },
      {
        orderNumber: 'CRL-1003',
        user: secondUser.id,
        items: [
          {
            product: createdProducts[6].id,
            name: createdProducts[6].name,
            price: createdProducts[6].price,
            quantity: 1,
            image: createdProducts[6].mainImage,
            color: 'Black',
            sku: createdProducts[6].sku
          }
        ],
        shippingAddress: secondUser.addresses[0],
        deliveryMethod: {
          id: 'standard',
          name: 'Standard Delivery',
          price: 5,
          estimatedDays: '2-4 Business Days'
        },
        paymentMethod: {
          type: 'card',
          provider: 'Credit/Debit Card (Direct)',
          transactionId: 'TXN-CARD-119922',
          cardLast4: '5566'
        },
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        subtotal: createdProducts[6].price,
        discount: 0,
        shipping: 5,
        tax: 6.72,
        total: createdProducts[6].price + 5 + 6.72,
        timeline: [
          { status: 'Pending', note: 'Order placed', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Confirmed', note: 'Card transaction confirmed', timestamp: new Date(Date.now() - 36 * 3600000) },
          { status: 'Processing', note: 'Packed at Samarkand Regional Logistics', timestamp: new Date(Date.now() - 24 * 3600000) },
          { status: 'Shipped', note: 'Out with delivery agent', timestamp: new Date(Date.now() - 6 * 3600000) }
        ]
      }
    ];

    for (const o of sampleOrders) {
      const { items, user, ...orderData } = o;
      orderData.user_id = user?.id || user;
      const createdOrder = await Order.create(orderData);
      const orderItems = items.map(it => ({
        order_id: createdOrder.id,
        product_id: it.product?.id || it.product,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
        color: it.color || 'Default',
        sku: it.sku || ''
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    // 6. Create Verified Reviews
    console.log('[Seed] Creating Customer Reviews...');
    await Review.bulkCreate([
      {
        user_id: customerUser.id,
        product_id: createdProducts[0].id,
        rating: 5,
        title: 'Outstanding build quality and switches!',
        comment: 'The Keychron keyboard exceeded all my expectations. The typing feel on the brown switches is tactile yet quiet enough for office environments. Bluetooth switches seamlessly between my Mac and Windows rig.',
        isVerifiedPurchase: true
      },
      {
        user_id: customerUser.id,
        product_id: createdProducts[1].id,
        rating: 5,
        title: 'Unbelievably light, 4K polling is razor sharp',
        comment: 'At 49g, this mouse feels almost weightless. The 4000Hz polling rate makes CS2 and Valorant feel noticeably smoother. Battery life easily lasts a whole week of gaming.',
        isVerifiedPurchase: true
      },
      {
        user_id: secondUser.id,
        product_id: createdProducts[4].id,
        rating: 5,
        title: 'Best ANC headphones in this price range',
        comment: 'Noise cancellation completely drowns out airplane drone and street noise. Soundstage is wide and balanced. The memory foam is buttery soft on the ears.',
        isVerifiedPurchase: true
      }
    ]);

    // Recalculate rating stats on those products
    await Review.recalculateRating(createdProducts[0].id, { Product });
    await Review.recalculateRating(createdProducts[1].id, { Product });
    await Review.recalculateRating(createdProducts[4].id, { Product });

    // 7. Create Sample Notifications
    console.log('[Seed] Creating Notifications...');
    await Notification.bulkCreate([
      {
        user_id: customerUser.id,
        title: 'Welcome to CORELY',
        message: 'Welcome to CORELY! Explore technology that fits your world and enjoy free shipping on orders over $100.',
        type: 'promo',
        link: '/products',
        isRead: true
      },
      {
        user_id: customerUser.id,
        title: 'Your order #CRL-1001 has been delivered',
        message: 'Your package containing Keychron X401K and Ultra-Light Gaming Mouse was successfully delivered.',
        type: 'order',
        link: '/orders',
        isRead: false
      },
      {
        user_id: adminUser.id,
        title: 'New Order Received',
        message: 'Customer Sophia Chen placed order #CRL-1002 ($104.07).',
        type: 'order',
        link: '/admin/orders',
        isRead: false
      },
      {
        user_id: adminUser.id,
        title: 'Product Stock Alert',
        message: 'Zenith Pro 16 AI Ultrabook is approaching low-stock threshold (4 units remaining).',
        type: 'inventory',
        link: '/admin/products',
        isRead: false
      }
    ]);

    // Add some favorites for customerUser
    await UserFavorite.bulkCreate([
      { user_id: customerUser.id, product_id: createdProducts[0].id },
      { user_id: customerUser.id, product_id: createdProducts[4].id },
      { user_id: customerUser.id, product_id: createdProducts[7].id }
    ]);

    console.log('==================================================');
    console.log(' DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('Admin Account:    admin@corely.com / Admin123!');
    console.log('Customer Account: customer@corely.com / Customer123!');
    console.log(`Products seeded:  ${createdProducts.length}`);
    console.log(`Categories seeded: ${categories.length}`);
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
