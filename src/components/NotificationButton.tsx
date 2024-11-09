"use client";

import { NotificationCountInfo } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface NotificationButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationButton({
  initialState,
}: NotificationButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/get-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
