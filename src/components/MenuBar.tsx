import Link from "next/link";
import { Button } from "./ui/button";
import { Bookmark, Home, Mail } from "lucide-react";
import NotificationButton from "./NotificationButton";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/auth";

async function MenuBar({ className }: { className: string }) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationButton
        initialState={{
          unreadCount,
        }}
      />
      <Button
        asChild
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}

export default MenuBar;
