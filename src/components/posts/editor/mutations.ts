import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { toast } from "sonner";
import { PostPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPost() {
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newData) => {
      const queryFilters = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you-feed") ||
            (query.queryKey.includes("users") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilters);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilters,
        (oldData: any) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  nextCursor: firstPage?.nextCursor,
                  posts: [newData, ...firstPage?.posts],
                },
                ...oldData?.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilters.queryKey,
        predicate(query) {
          return queryFilters.predicate(query) && !query.state.data;
        },
      });

      toast.success("Berhasil memposting!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Internal server error");
    },
  });

  return mutation;
}
