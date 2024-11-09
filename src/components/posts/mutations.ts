import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "./actions";
import { toast } from "sonner";
import { PostPage } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

export function useDeletePost() {
  const pathname = usePathname();
  const { push } = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryKey: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries();

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((p) => {
              return {
                nextCursor: p.nextCursor,
                posts: p.posts.filter((post) => post.id !== deletedPost.id),
              };
            }),
          };
        },
      );
      toast.success("Postingan berhasil dihapus");

      if (pathname === `/posts/${deletedPost.id}`) {
        push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return mutation;
}
