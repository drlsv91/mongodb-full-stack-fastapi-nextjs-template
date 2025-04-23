import { cn } from "@/lib/utils";
import React from "react";

const ErrorMessage = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  if (!children) return null;

  return <p className={cn("text-red-500 text-xs", className)}>{children}</p>;
};

export default ErrorMessage;
