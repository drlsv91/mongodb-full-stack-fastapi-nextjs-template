import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().min(1, { message: "item title is required" }),
  description: z
    .string()

    .min(3, { message: "Item description" })
    .max(2000, { message: "item description is too long" }),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
