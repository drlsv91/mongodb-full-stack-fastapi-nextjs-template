import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(3, { message: "full name must be greater than 3 characters" }),
  is_superuser: z.boolean().optional(),
  is_active: z.boolean(),
  password: z.string().min(3, { message: "password must be greater than 3 characters" }),
});

export const userUpdateSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  is_superuser: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
