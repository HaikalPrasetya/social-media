"use client";

import { useFollowInfo } from "@/hooks/useFollowInfo";
import { FollowInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowCountProps {
  userId: string;
  initialState: FollowInfo;
}

function FollowCount({ initialState, userId }: FollowCountProps) {
  const { data } = useFollowInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followersCount)}</span>
    </span>
  );
}

export default FollowCount;
