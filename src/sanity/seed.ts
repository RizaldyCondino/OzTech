import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-05-01",
  token: process.env.SANITY_API_TOKEN!, // needs write token
  useCdn: false,
});

async function seed() {
  console.log("🌱 Seeding Sanity...");
console.log("Token starts with:", process.env.SANITY_API_TOKEN?.slice(0, 20));
  // ─── Categories ─────────────────────────────────────────
  const categories = await Promise.all([
    client.createOrReplace({
      _id: "category-accessories",
      _type: "category",
      label: "Accessories",
      slug: { _type: "slug", current: "accessories" },
      description: "Phone cases, cables, chargers and more",
      order: 1,
    }),
    client.createOrReplace({
      _id: "category-smartphones",
      _type: "category",
      label: "Smartphones",
      slug: { _type: "slug", current: "smartphones" },
      description: "Latest smartphones from top brands",
      order: 2,
    }),
    client.createOrReplace({
      _id: "category-computers",
      _type: "category",
      label: "Computers",
      slug: { _type: "slug", current: "computers" },
      description: "Laptops, desktops and accessories",
      order: 3,
    }),
    client.createOrReplace({
      _id: "category-gaming",
      _type: "category",
      label: "Gaming",
      slug: { _type: "slug", current: "gaming" },
      description: "Consoles, controllers and gaming gear",
      order: 4,
    }),
    client.createOrReplace({
      _id: "category-tv-monitors",
      _type: "category",
      label: "TV & Monitors",
      slug: { _type: "slug", current: "tv-monitors" },
      description: "4K TVs, gaming monitors and displays",
      order: 5,
    }),
    client.createOrReplace({
      _id: "category-headphones",
      _type: "category",
      label: "Headphones",
      slug: { _type: "slug", current: "headphones" },
      description: "Wireless, noise-cancelling headphones",
      order: 6,
    }),
    client.createOrReplace({
      _id: "category-speakers",
      _type: "category",
      label: "Speakers",
      slug: { _type: "slug", current: "speakers" },
      description: "Bluetooth and smart speakers",
      order: 7,
    }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // ─── Brands ──────────────────────────────────────────────
  const brands = await Promise.all([
    client.createOrReplace({
      _id: "brand-samsung",
      _type: "brand",
      name: "Samsung",
      slug: { _type: "slug", current: "samsung" },
      description: "South Korean multinational electronics corporation",
      website: "https://samsung.com",
      featured: true,
    }),
    client.createOrReplace({
      _id: "brand-apple",
      _type: "brand",
      name: "Apple",
      slug: { _type: "slug", current: "apple" },
      description: "American multinational technology company",
      website: "https://apple.com",
      featured: true,
    }),
    client.createOrReplace({
      _id: "brand-sony",
      _type: "brand",
      name: "Sony",
      slug: { _type: "slug", current: "sony" },
      description: "Japanese multinational conglomerate",
      website: "https://sony.com",
      featured: true,
    }),
    client.createOrReplace({
      _id: "brand-lg",
      _type: "brand",
      name: "LG",
      slug: { _type: "slug", current: "lg" },
      description: "South Korean multinational electronics company",
      website: "https://lg.com",
      featured: false,
    }),
    client.createOrReplace({
      _id: "brand-jbl",
      _type: "brand",
      name: "JBL",
      slug: { _type: "slug", current: "jbl" },
      description: "American audio equipment manufacturer",
      website: "https://jbl.com",
      featured: false,
    }),
  ]);
  console.log(`✅ ${brands.length} brands seeded`);

  // ─── Products ────────────────────────────────────────────
  const products = await Promise.all([
    client.createOrReplace({
      _id: "product-1",
      _type: "product",
      name: "Samsung 65\" QLED 4K Smart TV",
      slug: { _type: "slug", current: "samsung-65-qled-4k-smart-tv" },
      brand: { _type: "reference", _ref: "brand-samsung" },
      category: { _type: "reference", _ref: "category-tv-monitors" },
      badge: "HOT",
      price: 1299.99,
      compareAtPrice: 1599.99,
      shortDescription: "Stunning 4K QLED display with Quantum Dot technology and smart features.",
      inStock: true,
      featured: true,
      variants: [
        {
          _type: "variantGroup",
          _key: "screen-size",
          optionName: "Screen Size",
          values: [
            { _key: "14in", label: '14"', priceModifier: -400, inStock: true },
            { _key: "24in", label: '24"', priceModifier: -200, inStock: true },
            { _key: "32in", label: '32"', priceModifier: 0,    inStock: true },
            { _key: "60in", label: '60"', priceModifier: 300,  inStock: false },
          ],
        },
      ],
      specs: [
        { _key: "spec-1", key: "Display Type",        value: "QLED" },
        { _key: "spec-2", key: "Resolution",          value: "4K Ultra HD (3840x2160)" },
        { _key: "spec-3", key: "HDR",                 value: "HDR10+ / HLG" },
        { _key: "spec-4", key: "Refresh Rate",        value: "120Hz" },
        { _key: "spec-5", key: "Smart TV",            value: "Tizen OS" },
        { _key: "spec-6", key: "Direct Full Array",   value: "Yes" },
        { _key: "spec-7", key: "Quantum Dot",         value: "Yes" },
        { _key: "spec-8", key: "HDMI Ports",          value: "4 x HDMI 2.1" },
      ],
    }),
    client.createOrReplace({
      _id: "product-2",
      _type: "product",
      name: "Apple MacBook Pro 14\"",
      slug: { _type: "slug", current: "apple-macbook-pro-14" },
      brand: { _type: "reference", _ref: "brand-apple" },
      category: { _type: "reference", _ref: "category-computers" },
      badge: "NEW",
      price: 1999.99,
      compareAtPrice: 2199.99,
      shortDescription: "Supercharged by M3 Pro chip for pro-level performance.",
      inStock: true,
      featured: true,
      variants: [
        {
          _type: "variantGroup",
          _key: "storage",
          optionName: "Storage",
          values: [
            { _key: "512gb", label: "512GB", priceModifier: 0,   inStock: true },
            { _key: "1tb",   label: "1TB",   priceModifier: 200, inStock: true },
            { _key: "2tb",   label: "2TB",   priceModifier: 400, inStock: true },
          ],
        },
      ],
      specs: [
        { _key: "spec-1", key: "Chip",          value: "Apple M3 Pro" },
        { _key: "spec-2", key: "CPU Cores",     value: "11-core" },
        { _key: "spec-3", key: "GPU Cores",     value: "14-core" },
        { _key: "spec-4", key: "RAM",           value: "18GB Unified Memory" },
        { _key: "spec-5", key: "Display",       value: "14.2\" Liquid Retina XDR" },
        { _key: "spec-6", key: "Battery Life",  value: "Up to 18 hours" },
        { _key: "spec-7", key: "Ports",         value: "3x Thunderbolt 4, HDMI, SD" },
      ],
    }),
    client.createOrReplace({
      _id: "product-3",
      _type: "product",
      name: "Sony WH-1000XM5 Headphones",
      slug: { _type: "slug", current: "sony-wh-1000xm5" },
      brand: { _type: "reference", _ref: "brand-sony" },
      category: { _type: "reference", _ref: "category-headphones" },
      badge: "BEST_SELLER",
      price: 349.99,
      compareAtPrice: 399.99,
      shortDescription: "Industry-leading noise cancellation with exceptional sound quality.",
      inStock: true,
      featured: false,
      variants: [
        {
          _type: "variantGroup",
          _key: "color",
          optionName: "Color",
          values: [
            { _key: "black",  label: "Black",  priceModifier: 0, inStock: true },
            { _key: "silver", label: "Silver", priceModifier: 0, inStock: true },
          ],
        },
      ],
      specs: [
        { _key: "spec-1", key: "Driver Size",         value: "30mm" },
        { _key: "spec-2", key: "Frequency Response",  value: "4Hz - 40kHz" },
        { _key: "spec-3", key: "Battery Life",        value: "30 hours" },
        { _key: "spec-4", key: "Charging",            value: "USB-C, 3min = 3hrs" },
        { _key: "spec-5", key: "Noise Cancellation",  value: "Industry Leading ANC" },
        { _key: "spec-6", key: "Multipoint Connect",  value: "2 devices simultaneously" },
      ],
    }),
    client.createOrReplace({
      _id: "product-4",
      _type: "product",
      name: "Samsung Galaxy S25 Ultra",
      slug: { _type: "slug", current: "samsung-galaxy-s25-ultra" },
      brand: { _type: "reference", _ref: "brand-samsung" },
      category: { _type: "reference", _ref: "category-smartphones" },
      badge: "NEW",
      price: 1199.99,
      compareAtPrice: 1299.99,
      shortDescription: "The ultimate Galaxy experience with AI-powered features.",
      inStock: true,
      featured: true,
      variants: [
        {
          _type: "variantGroup",
          _key: "storage",
          optionName: "Storage",
          values: [
            { _key: "256gb", label: "256GB", priceModifier: 0,   inStock: true },
            { _key: "512gb", label: "512GB", priceModifier: 100, inStock: true },
            { _key: "1tb",   label: "1TB",   priceModifier: 250, inStock: false },
          ],
        },
        {
          _type: "variantGroup",
          _key: "color",
          optionName: "Color",
          values: [
            { _key: "titanium-black",  label: "Titanium Black",  priceModifier: 0, inStock: true },
            { _key: "titanium-silver", label: "Titanium Silver", priceModifier: 0, inStock: true },
            { _key: "titanium-violet", label: "Titanium Violet", priceModifier: 0, inStock: true },
          ],
        },
      ],
      specs: [
        { _key: "spec-1", key: "Processor",   value: "Snapdragon 8 Elite" },
        { _key: "spec-2", key: "RAM",         value: "12GB" },
        { _key: "spec-3", key: "Display",     value: "6.9\" Dynamic AMOLED 2X" },
        { _key: "spec-4", key: "Camera",      value: "200MP + 50MP + 10MP + 12MP" },
        { _key: "spec-5", key: "Battery",     value: "5000mAh" },
        { _key: "spec-6", key: "S Pen",       value: "Included" },
        { _key: "spec-7", key: "OS",          value: "Android 15 / One UI 7" },
      ],
    }),
    client.createOrReplace({
      _id: "product-5",
      _type: "product",
      name: "JBL Charge 5 Bluetooth Speaker",
      slug: { _type: "slug", current: "jbl-charge-5" },
      brand: { _type: "reference", _ref: "brand-jbl" },
      category: { _type: "reference", _ref: "category-speakers" },
      badge: "SALE",
      price: 149.99,
      compareAtPrice: 199.99,
      shortDescription: "Powerful portable speaker with built-in powerbank and IP67 waterproof.",
      inStock: true,
      featured: false,
      variants: [
        {
          _type: "variantGroup",
          _key: "color",
          optionName: "Color",
          values: [
            { _key: "black", label: "Black", priceModifier: 0, inStock: true },
            { _key: "blue",  label: "Blue",  priceModifier: 0, inStock: true },
            { _key: "red",   label: "Red",   priceModifier: 0, inStock: true },
            { _key: "teal",  label: "Teal",  priceModifier: 0, inStock: false },
          ],
        },
      ],
      specs: [
        { _key: "spec-1", key: "Output Power",    value: "30W RMS" },
        { _key: "spec-2", key: "Battery Life",    value: "20 hours" },
        { _key: "spec-3", key: "Waterproof",      value: "IP67" },
        { _key: "spec-4", key: "Powerbank",       value: "Yes - charge devices" },
        { _key: "spec-5", key: "Connectivity",    value: "Bluetooth 5.1" },
        { _key: "spec-6", key: "PartyBoost",      value: "Yes - link 2+ speakers" },
      ],
    }),
  ]);
  console.log(`✅ ${products.length} products seeded`);

  // ─── Hero Slides ─────────────────────────────────────────
  const slides = await Promise.all([
    client.createOrReplace({
      _id: "hero-slide-1",
      _type: "heroSlide",
      title: "Samsung QLED TV Banner",
      accentColor: "#C4B0D8",
      categoryTag: "HOT PRODUCTS",
      headline: "Fill your desk full of technology",
      subLabel: "Start from",
      startingPrice: 45.00,
      ctaLabel: "LEARN MORE",
      ctaHref: "#products",
      linkedProduct: { _type: "reference", _ref: "product-1" },
      order: 1,
      active: true,
    }),
    client.createOrReplace({
      _id: "hero-slide-2",
      _type: "heroSlide",
      title: "MacBook Pro Banner",
      accentColor: "#F4C9B8",
      categoryTag: "NEW ARRIVALS",
      headline: "Power meets portability",
      subLabel: "Start from",
      startingPrice: 1999.99,
      ctaLabel: "SHOP NOW",
      ctaHref: "#computers",
      linkedProduct: { _type: "reference", _ref: "product-2" },
      order: 2,
      active: true,
    }),
    client.createOrReplace({
      _id: "hero-slide-3",
      _type: "heroSlide",
      title: "Sony Headphones Banner",
      accentColor: "#B0D8C4",
      categoryTag: "BEST SELLER",
      headline: "Silence the world, hear the music",
      subLabel: "Start from",
      startingPrice: 349.99,
      ctaLabel: "DISCOVER",
      ctaHref: "#headphones",
      linkedProduct: { _type: "reference", _ref: "product-3" },
      order: 3,
      active: true,
    }),
  ]);
  console.log(`✅ ${slides.length} hero slides seeded`);

  // ─── Blog Posts ──────────────────────────────────────────
  const posts = await Promise.all([
    client.createOrReplace({
      _id: "blog-post-1",
      _type: "blog",
      title: "OLED vs QLED: Which TV Technology is Right for You?",
      slug: { _type: "slug", current: "oled-vs-qled" },
      author: "OzTech Editorial",
      excerpt: "We break down the key differences between OLED and QLED display technologies to help you make the right choice for your home.",
      tags: ["TV", "Display", "Buying Guide"],
      publishedAt: new Date("2026-05-15").toISOString(),
      featured: true,
      category: { _type: "reference", _ref: "category-tv-monitors" },
    }),
    client.createOrReplace({
      _id: "blog-post-2",
      _type: "blog",
      title: "Top 5 Wireless Headphones for 2026",
      slug: { _type: "slug", current: "top-5-wireless-headphones-2026" },
      author: "OzTech Editorial",
      excerpt: "From noise-cancelling titans to budget-friendly picks — here are the best wireless headphones you can buy right now.",
      tags: ["Headphones", "Audio", "Top Picks"],
      publishedAt: new Date("2026-05-20").toISOString(),
      featured: false,
      category: { _type: "reference", _ref: "category-headphones" },
    }),
    client.createOrReplace({
      _id: "blog-post-3",
      _type: "blog",
      title: "MacBook Pro M3 vs Dell XPS 15: The Ultimate Comparison",
      slug: { _type: "slug", current: "macbook-pro-m3-vs-dell-xps-15" },
      author: "OzTech Editorial",
      excerpt: "Two of the most powerful laptops go head to head. We test performance, battery life, display quality and value for money.",
      tags: ["Laptops", "Apple", "Comparison"],
      publishedAt: new Date("2026-06-01").toISOString(),
      featured: true,
      category: { _type: "reference", _ref: "category-computers" },
    }),
    client.createOrReplace({
      _id: "blog-post-4",
      _type: "blog",
      title: "The Best Gaming Accessories to Upgrade Your Setup in 2026",
      slug: { _type: "slug", current: "best-gaming-accessories-2026" },
      author: "OzTech Editorial",
      excerpt: "Level up your gaming experience with these must-have accessories — from mechanical keyboards to ultra-wide monitors.",
      tags: ["Gaming", "Accessories", "Setup"],
      publishedAt: new Date("2026-06-05").toISOString(),
      featured: false,
      category: { _type: "reference", _ref: "category-gaming" },
    }),
    client.createOrReplace({
      _id: "blog-post-5",
      _type: "blog",
      title: "Samsung Galaxy S25 Ultra Full Review",
      slug: { _type: "slug", current: "samsung-galaxy-s25-ultra-review" },
      author: "OzTech Editorial",
      excerpt: "We spent 30 days with the Galaxy S25 Ultra. Here is everything you need to know before buying.",
      tags: ["Smartphones", "Samsung", "Review"],
      publishedAt: new Date("2026-06-08").toISOString(),
      featured: true,
      category: { _type: "reference", _ref: "category-smartphones" },
    }),
  ]);
  console.log(`✅ ${posts.length} blog posts seeded`);

  console.log("🎉 Sanity seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Sanity seed failed:", err);
  process.exit(1);
});