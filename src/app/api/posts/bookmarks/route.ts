import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const bookmarksPost = await prisma.bookmark.findMany({
      where: {
        userId: loggedInUser.id,
      },
      include: {
        post: {
          include: getPostDataInclude(loggedInUser.id),
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarksPost.length > pageSize ? bookmarksPost[pageSize].id : null;

    const result: PostPage = {
      nextCursor,
      posts: bookmarksPost.slice(0, pageSize).map((b) => b.post),
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
