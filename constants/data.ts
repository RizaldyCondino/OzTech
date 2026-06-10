'use client';
import { Phone, Mail, MapPin, Package } from "lucide-react";

// ─── Top Bar ───────────────────────────────────────────────
export const TOP_BAR_LEFT = [
  {
    icon: Phone,
    label: "+221 33 66 22",
    href: "tel:+22133662",
  },
  {
    icon: Mail,
    label: "support@oztech.io",
    href: "mailto:support@oztech.io",
  },
];

export const TOP_BAR_RIGHT = [
  {
    icon: MapPin,
    fill: "full",
    label: "Store Locations",
    href: "#locations",
  },
  {
    icon: Package,
    label: "Track Your Order",
    href: "#track",
  },
];

export const CURRENCIES = ["$ Dollar (US)", "€ Euro", "£ Pound"];
export const LANGUAGES = ["EN", "FR", "ES"];

// ─── Categories ────────────────────────────────────────────
export const CATEGORIES = [
  { label: "All Categories", href: "/category/all" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "Smartphones", href: "/category/smartphones" },
  { label: "Computers", href: "/category/computers" },
  { label: "Gaming", href: "/category/gaming" },
  { label: "TV & Monitors", href: "/category/tv-monitors" },
  { label: "Headphones", href: "/category/headphones" },
  { label: "Speakers", href: "/category/speakers" },
];

// ─── Nav Items ─────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solutions" },
  { label: "Resources & Support", href: "#resources" },
  { label: "Shop", href: "#shop" },
];

// ─── Brand ─────────────────────────────────────────────────
// data.ts
import { Headphones } from "lucide-react";
import { FaFacebook, FaYoutube, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

// ─── Footer Data ─────────────────────────────────────────────
 
export const QUICK_LINKS = [
  { label: "About us", href: "#about" },
  { label: "Contact us", href: "#contact" },
  { label: "Products", href: "#products" },
  { label: "Login", href: "#login" },
  { label: "Sign Up", href: "#signup" },
];

export const CUSTOMER_LINKS = [
  { label: "My Account", href: "#account" },
  { label: "Orders", href: "#orders" },
  { label: "Tracking List", href: "#tracking" },
  { label: "Terms", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "My Cart", href: "#cart" },
];

export const SOCIAL_LINKS = [
  { icon: FaYoutube, label: "YouTube", href: "#youtube" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#linkedin" },
  { icon: FaTwitter, label: "Twitter", href: "#twitter" },
  { icon: FaFacebook, label: "Facebook", href: "#facebook" },
  { icon: FaInstagram, label: "Instagram", href: "#instagram" },
];

export const PAYMENT_METHODS = [
  { label: "VISA", color: "#1a56db" },
  { label: "MASTERCARD", color: "##303655" },
  { label: "PAYPAL", color: "#0ea5e9" },
  { label: "BITCOIN", color: "#303655" },
];

// Contact Column specific data
export const CONTACT_INFO = {
  phone: "+ 123 456 789",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  liveChatHref: "#chat",
  appStoreHref: "#appstore",
  googlePlayHref: "#googleplay",
};

// Re-export Headphones for ContactColumn
export { Headphones };