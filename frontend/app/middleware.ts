import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.redirect(new URL("/", request.url));
}
