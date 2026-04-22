import mongoose from 'mongoose'
import { config } from 'dotenv'
import { Product } from './models/Product'

config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecombuzz'

const products = [
  // Mobiles
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'The ultimate Galaxy experience with a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. 12GB RAM, 256GB storage.',
    price: 109999,
    originalPrice: 129999,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    ],
    category: 'Mobiles',
    brand: 'Samsung',
    stock: 50,
    rating: 4.7,
    reviewCount: 2341,
    tags: ['smartphone', '5g', 's-pen', 'android'],
  },
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom, and USB 3 speeds. 256GB.',
    price: 159900,
    originalPrice: 164900,
    discount: 3,
    images: [
      'https://images.unsplash.com/photo-1695048132263-99c37c6a6ece?w=600&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
    ],
    category: 'Mobiles',
    brand: 'Apple',
    stock: 35,
    rating: 4.8,
    reviewCount: 5120,
    tags: ['smartphone', 'ios', '5g', 'titanium'],
  },
  {
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    description: 'Snapdragon 8 Gen 3, Hasselblad camera system, 5400mAh battery with 100W SUPERVOOC charging. 12GB RAM, 256GB.',
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    ],
    category: 'Mobiles',
    brand: 'OnePlus',
    stock: 80,
    rating: 4.5,
    reviewCount: 1872,
    tags: ['smartphone', '5g', 'fast-charging', 'android'],
  },
  {
    name: 'Redmi Note 13 Pro+',
    slug: 'redmi-note-13-pro-plus',
    description: '200MP OIS camera, Dimensity 7200 Ultra, 120W HyperCharge, 6.67" AMOLED display. 8GB RAM, 256GB.',
    price: 31999,
    originalPrice: 35999,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80',
    ],
    category: 'Mobiles',
    brand: 'Redmi',
    stock: 120,
    rating: 4.4,
    reviewCount: 3210,
    tags: ['smartphone', '5g', 'budget', 'android'],
  },

  // Laptops
  {
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    description: 'Apple M3 chip, 13.6" Liquid Retina display, 18-hour battery life, 8GB RAM, 256GB SSD. Fanless design.',
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871525-5dc7ef1a1ea5?w=600&q=80',
    ],
    category: 'Laptops',
    brand: 'Apple',
    stock: 25,
    rating: 4.9,
    reviewCount: 4523,
    tags: ['laptop', 'macos', 'm3', 'ultrabook'],
  },
  {
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    description: 'Intel Core i7-13700H, 15.6" OLED 3.5K display, NVIDIA RTX 4060, 16GB DDR5, 512GB NVMe SSD.',
    price: 149990,
    originalPrice: 169990,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    ],
    category: 'Laptops',
    brand: 'Dell',
    stock: 18,
    rating: 4.6,
    reviewCount: 987,
    tags: ['laptop', 'oled', 'gaming', 'windows'],
  },
  {
    name: 'ASUS ROG Strix G16',
    slug: 'asus-rog-strix-g16',
    description: 'AMD Ryzen 9 7945HX, NVIDIA RTX 4070 8GB, 16" QHD 240Hz display, 16GB DDR5, 1TB SSD. Ultimate gaming laptop.',
    price: 149990,
    originalPrice: 179990,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    ],
    category: 'Laptops',
    brand: 'ASUS',
    stock: 15,
    rating: 4.5,
    reviewCount: 654,
    tags: ['laptop', 'gaming', 'rtx', 'windows'],
  },

  // TVs
  {
    name: 'Sony Bravia XR 55" OLED',
    slug: 'sony-bravia-xr-55-oled',
    description: 'Cognitive Processor XR, 4K HDR OLED panel, Google TV, Dolby Vision & Atmos, 55-inch.',
    price: 189990,
    originalPrice: 219990,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f4834f?w=600&q=80',
    ],
    category: 'TVs',
    brand: 'Sony',
    stock: 12,
    rating: 4.8,
    reviewCount: 432,
    tags: ['oled', '4k', 'smart-tv', 'google-tv'],
  },
  {
    name: 'Samsung Neo QLED 65" 4K',
    slug: 'samsung-neo-qled-65-4k',
    description: 'Neo Quantum Processor 4K, Mini LED technology, Tizen OS, 144Hz Game Mode, 65-inch.',
    price: 129990,
    originalPrice: 159990,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80',
    ],
    category: 'TVs',
    brand: 'Samsung',
    stock: 20,
    rating: 4.6,
    reviewCount: 876,
    tags: ['qled', '4k', 'smart-tv', 'gaming'],
  },

  // Headphones
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection, Speak-to-Chat technology.',
    price: 26990,
    originalPrice: 34990,
    discount: 23,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    ],
    category: 'Headphones',
    brand: 'Sony',
    stock: 60,
    rating: 4.7,
    reviewCount: 8921,
    tags: ['wireless', 'anc', 'over-ear', 'bluetooth'],
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    slug: 'apple-airpods-pro-2nd-gen',
    description: 'H2 chip, Adaptive Transparency, Personalized Spatial Audio, USB-C MagSafe case, 30-hour total battery.',
    price: 24900,
    originalPrice: 26900,
    discount: 7,
    images: [
      'https://images.unsplash.com/photo-1588156979435-379b9d5a3e5c?w=600&q=80',
    ],
    category: 'Headphones',
    brand: 'Apple',
    stock: 90,
    rating: 4.8,
    reviewCount: 12045,
    tags: ['wireless', 'anc', 'in-ear', 'ios'],
  },
  {
    name: 'boAt Rockerz 550',
    slug: 'boat-rockerz-550',
    description: '50mm drivers, 20-hour playback, foldable design, soft padded earcups, Bluetooth 5.0.',
    price: 1299,
    originalPrice: 3990,
    discount: 67,
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    category: 'Headphones',
    brand: 'boAt',
    stock: 200,
    rating: 4.2,
    reviewCount: 45231,
    tags: ['wireless', 'over-ear', 'budget', 'bluetooth'],
  },

  // Cameras
  {
    name: 'Canon EOS R6 Mark II',
    slug: 'canon-eos-r6-mark-ii',
    description: '40MP full-frame CMOS, 4K 60fps video, in-body image stabilization, dual card slots, RF mount.',
    price: 214995,
    originalPrice: 239995,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    ],
    category: 'Cameras',
    brand: 'Canon',
    stock: 10,
    rating: 4.8,
    reviewCount: 321,
    tags: ['mirrorless', 'full-frame', '4k', 'photography'],
  },
  {
    name: 'GoPro HERO12 Black',
    slug: 'gopro-hero12-black',
    description: '5.3K60 + 4K120 video, HyperSmooth 6.0 stabilization, waterproof to 10m, HDR video & photos.',
    price: 35500,
    originalPrice: 43500,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    ],
    category: 'Cameras',
    brand: 'GoPro',
    stock: 45,
    rating: 4.6,
    reviewCount: 2109,
    tags: ['action-camera', '4k', 'waterproof', 'sports'],
  },

  // Tablets
  {
    name: 'iPad Pro 12.9" M2',
    slug: 'ipad-pro-12-9-m2',
    description: 'Apple M2 chip, 12.9" Liquid Retina XDR display, Wi-Fi 6E, 256GB, Apple Pencil hover.',
    price: 112900,
    originalPrice: 119900,
    discount: 6,
    images: [
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80',
    ],
    category: 'Tablets',
    brand: 'Apple',
    stock: 30,
    rating: 4.9,
    reviewCount: 3201,
    tags: ['tablet', 'ipados', 'm2', 'stylus'],
  },
  {
    name: 'Samsung Galaxy Tab S9+',
    slug: 'samsung-galaxy-tab-s9-plus',
    description: 'Snapdragon 8 Gen 2, 12.4" Dynamic AMOLED 2X, S Pen included, IP68, 12GB RAM, 256GB.',
    price: 84999,
    originalPrice: 96999,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1632198223868-db09e7c63fa3?w=600&q=80',
    ],
    category: 'Tablets',
    brand: 'Samsung',
    stock: 40,
    rating: 4.7,
    reviewCount: 1543,
    tags: ['tablet', 'android', 'amoled', 's-pen'],
  },
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  await Product.deleteMany({})
  console.log('Cleared existing products')

  await Product.insertMany(products)
  console.log(`Seeded ${products.length} products`)

  await mongoose.disconnect()
  console.log('Done.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
