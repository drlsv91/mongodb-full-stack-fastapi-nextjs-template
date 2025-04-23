import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().min(1, { message: "item title is required" }),
  description: z
    .string()

    .min(3, { message: "Item description" })
    .max(2000, { message: "item description is too long" }),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
