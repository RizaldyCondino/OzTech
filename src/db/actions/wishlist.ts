import { db } from "@/db";
import { wishlist } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function addToWishlist(sanityId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.insert(wishlist).values({ userId, sanityId }).onConflictDoNothing();
}

export async function removeFromWishlist(sanityId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.delete(wishlist).where(
    and(eq(wishlist.userId, userId), eq(wishlist.sanityId, sanityId))
  );
}

export async function getWishlist() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.select().from(wishlist).where(eq(wishlist.userId, userId));
}