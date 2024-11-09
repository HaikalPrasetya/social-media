"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import Link from "next/link";
import {
  LogOutIcon,
  Monitor,
  Moon,
  MoonStar,
  Sun,
  UserIcon,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();

  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.profilePicUrl!} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Masuk sebagai @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MoonStar className="mr-2 size-4" />
            Mode
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className={theme === "system" ? "text-primary" : ""}
                onClick={() => setTheme("system")}
              >
                <Monitor className="mr-2 size-4" />
                Sistem
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "light" ? "text-primary" : ""}
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 size-4" />
                Terang
              </DropdownMenuItem>
              <DropdownMenuItem
                className={theme === "dark" ? "text-primary" : ""}
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 size-4" />
                Gelap
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            queryClient.clear();

            await logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
