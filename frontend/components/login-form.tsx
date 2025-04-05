"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import SubmitButton from "./SubmitButton";

export function LoginForm({ className, ...props }: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          {state?.message && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
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
                  key={`email-${state?.data?.email ?? ""}`} // Force re-render on state change
                />
                {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue={state?.data?.password ?? ""}
                  key={`password-${state?.data?.password ?? ""}`} // Force re-render on state change
                />
                {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
              </div>

              <SubmitButton>Login</SubmitButton>
              <Button variant="outline" className="w-full" type="button">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
