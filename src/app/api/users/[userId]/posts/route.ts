import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPostDataInclude, PostData, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorizd" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const feeds: PostData[] = await prisma.post.findMany({
      where: {
        userId,
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = feeds.length > pageSize ? feeds[pageSize].id : null;

    const resultData: PostPage = {
      posts: feeds.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(resultData);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
