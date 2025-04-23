"use server";
import { SignUpFormState } from "../types/auth-form-state";
import { redirect } from "next/navigation";
import { authApiLogin } from "../services/auth-service";
import { createSession } from "../session";
import { revalidatePath } from "next/cache";
import { LoginFormSchema } from "../validations/auth";

export async function signIn(state: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validatedFields = LoginFormSchema.safeParse(rawFormData);

  if (!validatedFields.success)
    return {
      data: rawFormData,
      errors: validatedFields.error.flatten().fieldErrors,
    };

  const { email, password } = validatedFields.data;

  const data = await authApiLogin(email, password);

  if (data.errors) {
    return {
      data: rawFormData,
      message: "Invalid Credentials",
    };
  }

  await createSession({
    user: {
      id: data.id,
      name: data.full_name,
      email: data.email,
    },
    accessToken: data.access_token,
  });
  revalidatePath("/admin");
  redirect("/admin");
}
