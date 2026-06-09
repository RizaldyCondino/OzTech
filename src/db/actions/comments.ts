import { db } from "@/db";
import { comments } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function addComment(
  sanityId: string,
  body: string,
  parentId?: number
) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) throw new Error("Not authenticated");

  await db.insert(comments).values({
    sanityId,
    userId,
    userName: `${user.firstName} ${user.lastName}`.trim() || user.emailAddresses[0].emailAddress,
    userAvatar: user.imageUrl,
    body,
    parentId: parentId ?? null,
  });
}

export async function getComments(sanityId: string) {
  return db.select().from(comments).where(eq(comments.sanityId, sanityId));
}