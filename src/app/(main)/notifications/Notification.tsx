import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { href: string; icon: JSX.Element; message: string }
  > = {
    COMMENT: {
      href: `/posts/${notification.postId}`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      message: `${notification.issuer.username} comment di postingan anda.`,
    },
    LIKE: {
      href: `/posts/${notification.postId}`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      message: `${notification.issuer.username} like di postingan anda.`,
    },
    FOLLOW: {
      href: `/users/${notification.issuer.username}`,
      icon: <User2 className="size-7 text-primary" />,
      message: `${notification.issuer.username} mulai follow akun anda.`,
    },
  };

  const { href, icon, message } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar
            avatarUrl={notification.issuer.profilePicUrl!}
            size={36}
          />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
