"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { commentSchema } from "@/lib/validate";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  const { content: contentValidated } = commentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        postId: post.id,
        userId: user.id,
        content,
      },
      include: getCommentDataInclude(user.id),
    }),
    prisma.notification.create({
      data: {
        issuerId: user.id,
        recipientId: post.userId,
        postId: post.id,
        type: "COMMENT",
      },
    }),
  ]);

  return newComment;
}
