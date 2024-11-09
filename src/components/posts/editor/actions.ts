"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validate";

export async function submitPost(values: {
  content: string;
  mediaIds: string[];
}) {
  // const { content, attachments } = createPostSchema.parse({
  //   content: values.content,
  //   attachments: values.mediaIds,
  // });

  const { user } = await validateRequest();

  if (!user) return;

  const newPost = await prisma.post.create({
    data: {
      content: values.content,
      userId: user.id,
      attachments: {
        connect: values.mediaIds.map((a) => ({ id: a })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
