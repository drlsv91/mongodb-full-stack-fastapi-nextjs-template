"use client";
import SubmitButton from "../SubmitButton";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useUsers } from "@/hooks/use-user-query";
import { useZodForm } from "@/hooks/use-zod-form";
import { userUpdateSchema } from "@/lib/validations/user";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserModal({ user, isOpen, onClose }: Readonly<EditUserModalProps>) {
  const { updateUser, isUpdating } = useUsers();

  const { register, handleSubmit, reset, setValue, watch } = useZodForm({
    schema: userUpdateSchema,
    defaultValues: {
      email: "",
      full_name: "",
      is_active: true,
      is_superuser: false,
    },
  });

  // Watch values for controlled components
  const isActive = watch("is_active");
  const isSuperuser = watch("is_superuser");

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        full_name: user.full_name || "",
        is_active: user.is_active,
        is_superuser: user.is_superuser,
      });
    }
  }, [user, reset]);

  // Create a wrapped onClose function that resets the form
  const handleClose = () => {
    // Reset form data
    reset({
      email: "",
      full_name: "",
      is_active: true,
      is_superuser: false,
    });
    // Call the original onClose function
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;

    try {
      await updateUser({
        id: user._id,
        data,
      });

      toast.success("User updated successfully");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user");
    }
  });

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Make changes to the user account. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" {...register("email")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input id="full_name" {...register("full_name")} className="col-span-3" />
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
                  {isActive ? "User is active" : "User is inactive"}
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isUpdating}>Save Changes</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
