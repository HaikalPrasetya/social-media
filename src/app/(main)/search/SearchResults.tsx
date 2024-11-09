"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostLoadingSkeleton from "@/components/PostLoadingSkeleton";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  query: string;
}

function SearchResults({ query }: SearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "search", query],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get("/api/search", {
            searchParams: {
              q: query,
              ...(pageParam ? { cursor: pageParam } : {}),
            },
          })
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      gcTime: 0,
    });

  const posts = data?.pages.flatMap((p) => p.posts) || [];

  if (status === "pending") {
    return <PostLoadingSkeleton />;
  }

  if (!posts.length && status === "success") {
    return (
      <p className="text-center text-muted-foreground">
        Belum ada postingan untuk pencarian ini
      </p>
    );
  }

  if (status === "error") {
    return <p className="text-center text-destructive">Error Occured</p>;
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}

export default SearchResults;
