import { db } from "@/db";
import { reviews } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function addReview(
  sanityId: string,
  rating: number,
  title: string,
  body: string
) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) throw new Error("Not authenticated");

  await db.insert(reviews).values({
    sanityId,
    userId,
    userName: `${user.firstName} ${user.lastName}`.trim() || user.emailAddresses[0].emailAddress,
    rating,
    title,
    body,
  });
}

export async function getReviews(sanityId: string) {
  return db.select().from(reviews).where(eq(reviews.sanityId, sanityId));
}