import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  initialState,
  postId,
}: BookmarkButtonProps) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarked`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance
            .delete(`/api/posts/${postId}/bookmarked`)
            .json<BookmarkInfo>()
        : kyInstance
            .post(`/api/posts/${postId}/bookmarked`)
            .json<BookmarkInfo>(),
    onMutate: async () => {
      toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, (oldData) => {
        if (!oldData) return;

        return {
          isBookmarkedByUser: !oldData.isBookmarkedByUser,
        };
      });

      return { previousData };
    },
    onError(error, variables, context) {
      console.error(error);
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error(error.message);
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn("size-5", data.isBookmarkedByUser && "fill-primary")}
      />
    </button>
  );
}
