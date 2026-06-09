import { db } from "@/db";
import {
  productStats,
  reviews,
  wishlist,
  comments,
} from "@/db/schema";

async function seed() {
  console.log("🌱 Seeding Neon database...");

  // ─── Product Stats ───────────────────────────────────────
  await db.insert(productStats).values([
    { sanityId: "product-1", soldCount: 4320, viewedCount: 12400 },
    { sanityId: "product-2", soldCount: 1200, viewedCount: 8900 },
    { sanityId: "product-3", soldCount: 890,  viewedCount: 5600 },
    { sanityId: "product-4", soldCount: 2100, viewedCount: 9800 },
    { sanityId: "product-5", soldCount: 560,  viewedCount: 3200 },
  ]).onConflictDoNothing();

  console.log("✅ product_stats seeded");

  // ─── Reviews ─────────────────────────────────────────────
  await db.insert(reviews).values([
    {
      sanityId: "product-1",
      userId: "user_test_1",
      userName: "John Dela Cruz",
      rating: 5,
      title: "Absolutely love this!",
      body: "Best tech purchase I've made this year. Build quality is top notch.",
      verified: true,
    },
    {
      sanityId: "product-1",
      userId: "user_test_2",
      userName: "Maria Santos",
      rating: 4,
      title: "Great product, fast delivery",
      body: "Really happy with this purchase. Exactly as described.",
      verified: true,
    },
    {
      sanityId: "product-2",
      userId: "user_test_3",
      userName: "Carlos Reyes",
      rating: 5,
      title: "Exceeded my expectations",
      body: "The display quality is incredible. Worth every peso.",
      verified: false,
    },
    {
      sanityId: "product-3",
      userId: "user_test_4",
      userName: "Anna Lim",
      rating: 3,
      title: "Good but could be better",
      body: "Decent product for the price. Battery life could be improved.",
      verified: true,
    },
    {
      sanityId: "product-4",
      userId: "user_test_5",
      userName: "Rico Fontaine",
      rating: 5,
      title: "Perfect for gaming",
      body: "Smooth performance, zero lag. Highly recommend for gamers.",
      verified: true,
    },
  ]).onConflictDoNothing();

  console.log("✅ reviews seeded");

  // ─── Wishlist ─────────────────────────────────────────────
  await db.insert(wishlist).values([
    { userId: "user_test_1", sanityId: "product-2" },
    { userId: "user_test_1", sanityId: "product-3" },
    { userId: "user_test_2", sanityId: "product-1" },
    { userId: "user_test_3", sanityId: "product-4" },
    { userId: "user_test_4", sanityId: "product-5" },
  ]).onConflictDoNothing();

  console.log("✅ wishlist seeded");

  // ─── Comments ─────────────────────────────────────────────
  await db.insert(comments).values([
    // Top level comments
    {
      sanityId: "blog-post-1",
      userId: "user_test_1",
      userName: "John Dela Cruz",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      body: "Great article! Really helped me understand the difference between OLED and QLED.",
      parentId: null,
      likes: 12,
    },
    {
      sanityId: "blog-post-1",
      userId: "user_test_2",
      userName: "Maria Santos",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      body: "Very informative. Would love to see a follow-up on mini-LED technology.",
      parentId: null,
      likes: 8,
    },
    {
      sanityId: "blog-post-2",
      userId: "user_test_3",
      userName: "Carlos Reyes",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      body: "This convinced me to finally upgrade my setup. Thanks OzTech!",
      parentId: null,
      likes: 5,
    },
    // Replies
    {
      sanityId: "blog-post-1",
      userId: "user_test_3",
      userName: "Carlos Reyes",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      body: "Agreed! OLED blacks are unmatched for movie watching.",
      parentId: 1, // reply to John's comment
      likes: 4,
    },
    {
      sanityId: "blog-post-1",
      userId: "user_test_4",
      userName: "Anna Lim",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
      body: "Mini-LED article would be great! Please do it soon.",
      parentId: 2, // reply to Maria's comment
      likes: 2,
    },
  ]).onConflictDoNothing();

  console.log("✅ comments seeded");
  console.log("🎉 Neon database seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});