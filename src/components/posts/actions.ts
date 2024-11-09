"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";

export const deletePost = async (postId: string) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize!");

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
};
