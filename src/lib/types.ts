import { Prisma } from "@prisma/client";

export function UserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    profilePicUrl: true,
    username: true,
    displayName: true,
    createdAt: true,
    bio: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: UserDataSelect(loggedInUserId),
    },
    attachments: true,
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>; //typeof getPostDataInclude;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: UserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const getNotificationInclude = {
  issuer: {
    select: {
      profilePicUrl: true,
      username: true,
      displayName: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof getNotificationInclude;
}>;

export interface NotificationPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowInfo {
  followersCount: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likeCount: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
