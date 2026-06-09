import {
  pgTable, serial, text, integer,
  decimal, timestamp, boolean, uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Product Stats ───────────────────────────────────────────
// One row per Sanity product (linked by sanity_id)
export const productStats = pgTable("product_stats", {
  id:           serial("id").primaryKey(),
  sanityId:     text("sanity_id").notNull().unique(),  // Sanity document._id
  soldCount:    integer("sold_count").notNull().default(0),
  viewedCount:  integer("viewed_count").notNull().default(0),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

// ─── Reviews ─────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id:          serial("id").primaryKey(),
  sanityId:    text("sanity_id").notNull(),            // which product
  userId:      text("user_id").notNull(),              // clerk/auth user id
  userName:    text("user_name").notNull(),
  rating:      integer("rating").notNull(),            // 1–5
  title:       text("title"),
  body:        text("body"),
  verified:    boolean("verified").notNull().default(false),
  createdAt:   timestamp("created_at").defaultNow(),
});

// ─── Wishlist ─────────────────────────────────────────────────
export const wishlist = pgTable("wishlist", {
  id:        serial("id").primaryKey(),
  userId:    text("user_id").notNull(),
  sanityId:  text("sanity_id").notNull(),             // which product
  addedAt:   timestamp("added_at").defaultNow(),
}, (t) => ({
  uniq: uniqueIndex("wishlist_user_product_idx").on(t.userId, t.sanityId),
}));

// ─── Orders ───────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id:          serial("id").primaryKey(),
  userId:      text("user_id").notNull(),
  status:      text("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

// ─── Order Items ──────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id:           serial("id").primaryKey(),
  orderId:      integer("order_id").notNull(),         // → orders.id
  sanityId:     text("sanity_id").notNull(),           // which product
  variantLabel: text("variant_label"),                 // e.g. '24"'
  quantity:     integer("quantity").notNull().default(1),
  unitPrice:    decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// ─── Blog Comments ────────────────────────────────────────────
export const comments = pgTable("comments", {
  id:         serial("id").primaryKey(),
  sanityId:   text("sanity_id").notNull(),   // blog post _id from Sanity
  userId:     text("user_id").notNull(),      // auth user id
  userName:   text("user_name").notNull(),
  userAvatar: text("user_avatar"),            // profile image URL
  body:       text("body").notNull(),
  parentId:   integer("parent_id"),           // null = top-level, set = reply
  likes:      integer("likes").notNull().default(0),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});