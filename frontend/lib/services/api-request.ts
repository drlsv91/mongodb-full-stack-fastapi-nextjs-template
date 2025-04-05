import { getSession } from "../session";

type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiRequest = async (url: string, method: Method = "GET", body?: Record<string, unknown>) => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json();
  if (result.errors) {
    console.error("Request errors:", result.errors);
    throw new Error("Failed to make API request");
  }

  return result.data;
};
