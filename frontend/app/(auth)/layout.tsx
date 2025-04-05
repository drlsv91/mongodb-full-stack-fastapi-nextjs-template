import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">{children}</div>;
};

export default AuthLayout;
