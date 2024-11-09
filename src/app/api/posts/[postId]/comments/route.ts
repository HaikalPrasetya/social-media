import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 6;

    const posts = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(loggedInUser.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = posts.length > pageSize ? posts[0].id : null;

    const result: CommentPage = {
      comments: posts.length > pageSize ? posts.slice(1) : posts,
      previousCursor,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
