import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  console.log("session =>", session);
  if (session?.user) {
    redirect("/admin");
  }
  return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">{children}</div>;
};

export default AuthLayout;
