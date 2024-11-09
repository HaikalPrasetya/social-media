import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { NotificationCountInfo } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const notifications = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    const result: NotificationCountInfo = {
      unreadCount: notifications,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
