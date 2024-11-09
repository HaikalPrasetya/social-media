import z from "zod";

const requiredString = z.string().trim().min(1, "required");

export const signUpSchema = z.object({
  email: requiredString,
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only latters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export const createPostSchema = z.object({
  content: requiredString,
  attachments: z
    .array(z.string())
    .max(5, "Hanya bisa mengirim 5 file/lampiran!"),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;

export const updateUserSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Tidak boleh lebih dari 1000"),
});

export type updateUserValues = z.infer<typeof updateUserSchema>;

export const commentSchema = z.object({
  content: requiredString,
});
