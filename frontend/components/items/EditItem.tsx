"use client";
import { useItems } from "@/hooks/use-item-query";
import { useZodForm } from "@/hooks/use-zod-form";
import { itemSchema } from "@/lib/validations/item";
import { Item } from "@/types/item";
import { useEffect } from "react";
import ErrorMessage from "../error-message";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface EditItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditItemModal({ item, isOpen, onClose }: Readonly<EditItemModalProps>) {
  const { updateItem, isUpdating } = useItems();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: itemSchema,
  });

  useEffect(() => {
    if (item) {
      reset({
        title: item.title,
        description: item.description,
      });
    }
  }, [item, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateItem({
        id: item!._id,
        data,
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Make changes to the item below. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" defaultValue={item?.title} {...register("title")} className="col-span-3" />
            </div>
            <ErrorMessage>{errors.title?.message}</ErrorMessage>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>

              <Textarea
                id="description"
                defaultValue={item?.description}
                className="col-span-3"
                {...register("description")}
                rows={4}
              />
            </div>
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
