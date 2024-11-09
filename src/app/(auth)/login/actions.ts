"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginSchema, loginValues } from "@/lib/validate";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: loginValues,
): Promise<{ error: string }> {
  const { username, password } = loginSchema.parse(credentials);

  const existingUsername = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  if (!existingUsername || !existingUsername.password) {
    return {
      error: "Username atau password tidak valid!",
    };
  }

  const validPassword = await verify(existingUsername.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      error: "Username atau password tidak valid!",
    };
  }

  const session = await lucia.createSession(existingUsername.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
