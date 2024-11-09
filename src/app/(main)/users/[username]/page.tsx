import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { FollowInfo, PostData, UserData, UserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPost from "./UserPost";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import TrendsSidebar from "../../TrendsSidebar";
import FollowCount from "@/components/FollowCount";
import EditProfileButton from "@/app/api/users/username/[username]/EditProfileButton";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: UserDataSelect(loggedInUserId),
  });

  if (!user) return notFound();

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) return {};

  const { username } = await params;

  const user = await getUser(username, loggedInUserId.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) {
    return (
      <p className="text-destructive">
        Anda tidak bisa melihat halaman ini, karena ada belum login!
      </p>
    );
  }
  const { username } = await params;

  const user = await getUser(username, loggedInUserId.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUserId.id} />
        <div className="rounded-2xl bg-secondary p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName} posts
          </h2>
        </div>
        <UserPost userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

function UserProfile({ loggedInUserId, user }: UserProfileProps) {
  const followInfo: FollowInfo = {
    followersCount: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-secondary p-5 shadow-sm">
      <UserAvatar avatarUrl={user.profilePicUrl!} size={250} />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Bergabung sejak {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowCount userId={user.id} initialState={followInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton data={user} />
        ) : (
          <FollowButton
            userId={user.id}
            initalState={followInfo}
          ></FollowButton>
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
}
