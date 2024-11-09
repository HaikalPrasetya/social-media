"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostLoadingSkeleton from "@/components/PostLoadingSkeleton";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

function ForYouFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "for-you-feed"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/for-you",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostLoadingSkeleton />;
  }

  if (status === "success" && posts.length < 1 && status === "success") {
    return (
      <p className="text-center text-muted-foreground">Belum ada postingan</p>
    );
  }

  if (status === "error") {
    return <p className="text-center text-destructive">Terjadi kesalahan</p>;
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() =>
        !isFetchingNextPage && hasNextPage && fetchNextPage()
      }
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto size-8 animate-spin" />
      )}
    </InfiniteScrollContainer>
  );
}

export default ForYouFeed;
