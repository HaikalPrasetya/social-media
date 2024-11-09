"use client";

import { updateUserValues } from "@/lib/validate";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateUserProfile } from "./actions";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { PostPage } from "@/lib/types";
import { useRouter } from "next/navigation";

export function useUpdatePeofileMutation() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload } = useUploadThing("profilePicUrl");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      profilePic,
    }: {
      values: updateUserValues;
      profilePic?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        profilePic && startUpload([profilePic]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries();

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page: any) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post: any) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      profilePicUrl: uploadResult || updatedUser.profilePicUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast.success("User berhasil di update!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Update user profile gagal. Silahkan coba lagi");
    },
  });

  return mutation;
}
