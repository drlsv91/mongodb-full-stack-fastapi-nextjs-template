"use client";

import { useItems } from "@/hooks/use-item-query";
import { useZodForm } from "@/hooks/use-zod-form";
import { itemSchema } from "@/lib/validations/item";
import { useEffect } from "react";
import ErrorMessage from "../error-message";
import SubmitButton from "../SubmitButton";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateItemModal({ isOpen, onClose }: Readonly<CreateItemModalProps>) {
  const { createItem, isCreating } = useItems();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: itemSchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await createItem(data);

    onClose();
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>Fill in the details for your new item. Click create when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" {...register("title")} className="col-span-3" />
            </div>
            <ErrorMessage>{errors.title?.message}</ErrorMessage>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" {...register("description")} rows={4} />
            </div>
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isCreating} type="submit">
              {isCreating ? "Creating.." : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
