import { google, lucia } from "@/lib/auth";
import prisma from "@/lib/db";
import kyInstance from "@/lib/ky";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = (await cookies()).get("state")?.value;
  const storedCodeVerifier = (await cookies()).get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json<{ id: string; name: string }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: googleUser.name,
        googleId: googleUser.id,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}