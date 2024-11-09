"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { UserDataSelect } from "@/lib/types";
import { updateUserSchema, updateUserValues } from "@/lib/validate";

export async function updateUserProfile(values: updateUserValues) {
  const validateValues = updateUserSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorize");
  }

  const updateUserData = await prisma.user.update({
    where: { id: user.id },
    data: validateValues,
    select: UserDataSelect(user.id),
  });

  if (!updateUserData) {
    throw new Error("Unauthorize");
  }

  return updateUserData;
}
