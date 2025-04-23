"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import { Alert, AlertDescription } from "./ui/alert";

export function LoginForm({ className, ...props }: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          {state?.message && (
            <Alert variant="destructive" className="bg-red-50 rounded-xs py-1.5">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  defaultValue={state?.data?.email ?? ""}
                  key={`email-${state?.data?.email ?? ""}`}
                />
                {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  defaultValue={state?.data?.password ?? ""}
                  key={`password-${state?.data?.password ?? ""}`}
                />
                {state?.errors?.password && (
                  <p className="text-sm font-medium text-destructive">{state.errors.password}</p>
                )}
              </div>

              <SubmitButton>Login</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
