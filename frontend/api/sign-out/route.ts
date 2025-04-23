import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET() {
  await deleteSession();
  revalidatePath("/");
  //   redirect("/sign-in");
}
