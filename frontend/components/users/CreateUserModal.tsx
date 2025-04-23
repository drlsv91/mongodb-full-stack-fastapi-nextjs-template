"use client";
import { useUsers } from "@/hooks/use-user-query";
import { useZodForm } from "@/hooks/use-zod-form";
import { userCreateSchema } from "@/lib/validations/user";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import ErrorMessage from "../error-message";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: Readonly<CreateUserModalProps>) {
  const { createUser, isCreating } = useUsers();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useZodForm({
    schema: userCreateSchema,

    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      is_active: true,
      is_superuser: false,
    },
  });

  // Watch values for controlled components
  const isActive = watch("is_active");
  const isSuperuser = watch("is_superuser");

  // Create a wrapped onClose function that resets the form
  const handleClose = () => {
    // Reset form data
    reset({
      email: "",
      full_name: "",
      password: "",
      is_active: true,
      is_superuser: false,
    });
    // Reset password visibility
    setShowPassword(false);
    // Call the original onClose function
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createUser({
        email: data.email,
        full_name: data.full_name,
        is_active: !!data.is_active,
        is_superuser: data.is_superuser,
        password: data.password,
      });
      toast.success("User created successfully");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    }
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the system. Fill in all the required fields.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 relative pb-3">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email")}
                className={clsx("col-span-3", { "border border-red-500": !!errors?.email?.message })}
              />

              <ErrorMessage className="absolute bottom-[0px] right-50">{errors?.email?.message}</ErrorMessage>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 relative pb-3">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                {...register("full_name")}
                className={clsx("col-span-3", { "border border-red-500": !!errors?.full_name?.message })}
              />
              <ErrorMessage className="absolute bottom-[0px] right-0">{errors?.full_name?.message}</ErrorMessage>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative pb-3">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={clsx("pr-20", { "border border-red-500": !!errors?.password?.message })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 text-xs"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>

                <ErrorMessage className="absolute bottom-[0px] right-0">{errors?.password?.message}</ErrorMessage>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                />
                <Label htmlFor="is_active" className="text-sm text-muted-foreground">
                  {isActive ? "User account is active" : "User account is inactive"}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_superuser" className="text-right">
                Admin
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is_superuser"
                  checked={isSuperuser}
                  onCheckedChange={(checked) => setValue("is_superuser", checked)}
                />
                <Label htmlFor="is_superuser" className="text-sm text-muted-foreground">
                  {isSuperuser ? "Admin privileges" : "Regular user privileges"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isCreating} type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
