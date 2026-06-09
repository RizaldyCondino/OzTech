import { db } from "@/db";
import { productStats } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementView(sanityId: string) {
  await db
    .insert(productStats)
    .values({ sanityId, viewedCount: 1, soldCount: 0 })
    .onConflictDoUpdate({
      target: productStats.sanityId,
      set: { viewedCount: sql`viewed_count + 1` },
    });
}

export async function incrementSold(sanityId: string, quantity: number = 1) {
  await db
    .insert(productStats)
    .values({ sanityId, soldCount: quantity, viewedCount: 0 })
    .onConflictDoUpdate({
      target: productStats.sanityId,
      set: { soldCount: sql`sold_count + ${quantity}` },
    });
}

export async function getProductStats(sanityId: string) {
  const result = await db
    .select()
    .from(productStats)
    .where(eq(productStats.sanityId, sanityId));

  return result[0] ?? { soldCount: 0, viewedCount: 0 };
}