import Image from "next/image";
import AvatarPlaceholder from "@/assets/avatar-placeholder.jpg";

function UserAvatar({ avatarUrl, size }: { avatarUrl: string; size?: number }) {
  return (
    <Image
      src={avatarUrl || AvatarPlaceholder}
      alt="Profile User"
      width={size ?? 48}
      height={size ?? 48}
      className="aspect-square h-fit flex-none rounded-full object-cover"
    />
  );
}

export default UserAvatar;
