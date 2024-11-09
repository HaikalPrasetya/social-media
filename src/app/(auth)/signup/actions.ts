"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/db";
import { signUpSchema, signUpValues } from "@/lib/validate";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(
  credentials: signUpValues,
): Promise<{ error: string }> {
  const validateRequest = signUpSchema.parse(credentials);

  const passwordHash = await hash(credentials.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10);

  const existingUsername = await prisma.user.findFirst({
    where: {
      username: {
        equals: credentials.username,
        mode: "insensitive",
      },
    },
  });

  if (existingUsername) {
    return {
      error: "Username sudah terpakai, Silahkan anda coba lagi!",
    };
  }

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: {
        equals: credentials.email,
        mode: "insensitive",
      },
    },
  });

  if (existingEmail) {
    return {
      error: "Email sudah terpakai, Silahkan anda coba lagi!",
    };
  }

  await prisma.user.create({
    data: {
      id: userId,
      email: validateRequest.email,
      username: validateRequest.username,
      displayName: validateRequest.username,
      password: passwordHash,
    },
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
