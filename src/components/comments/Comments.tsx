import kyInstance from "@/lib/ky";
import { CommentPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentInput from "./CommentInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";

interface CommentsProps {
  post: PostData;
}

function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pagesParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((p) => p.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load Previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet</p>
      )}
      {status === "error" && (
        <p className="text-destructive">
          An error occured while loading comments
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default Comments;
