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

export const profileFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
});

export const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, { message: "Current password is required." }),
    new_password: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
      message: "Please confirm your new password.",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ["confirm_password"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
