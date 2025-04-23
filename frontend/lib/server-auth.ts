import { redirect } from "next/navigation";
import { getSession } from "./session";
import axiosInstance from "./axios";
import { User } from "@/types/user";

/**
 * Check if user is authenticated in server components
 * Use this in server components to protect routes and get the current user
 */
export async function requireAuth(requiredRole?: "admin" | "user") {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (requiredRole && session.user.role !== requiredRole) {
    redirect("/unauthorized");
  }

  const response = await axiosInstance.get("/users/me", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return response.data as User;
}

/**
 * Get the current authenticated user if available
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();

  return session?.user || null;
}

/**
 * Check if a user is authenticated and redirect to dashboard if they are
 * Use this for login/register pages to prevent authenticated users from accessing them
 */
export async function redirectIfAuthenticated() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }
}
