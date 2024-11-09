"use client";

import { FollowInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { useFollowInfo } from "@/hooks/useFollowInfo";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initalState: FollowInfo;
}

function FollowButton({ userId, initalState }: FollowButtonProps) {
  const { data } = useFollowInfo(userId, initalState);

  const queryClient = useQueryClient();

  const queryKey: QueryKey = [`follow-info`, userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowInfo>(queryKey);

      queryClient.setQueryData<FollowInfo>(queryKey, () => ({
        followersCount:
          (previousState?.followersCount || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}

export default FollowButton;
