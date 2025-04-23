"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ children, loading, ...props }: { children: React.ReactNode; loading?: boolean }) => {
  let { pending } = useFormStatus();
  if (typeof loading === "boolean") {
    pending = loading;
  }
  return (
    <Button disabled={pending} color="blue" type="submit" aria-disabled={pending} {...props}>
      {pending ? (
        <span className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
