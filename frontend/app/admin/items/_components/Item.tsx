"use client";
import { EditItemModal } from "@/components/items/EditItem";
import { NoData } from "@/components/no-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useItems } from "@/hooks/use-item-query";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import { DeleteConfirmationDialog } from "@/components/items/DeleteItem";
import LoadingItemsSkeleton from "@/components/items/LoadItemsSkeleton";
import { Item } from "@/types/item";
import { ItemsListHeader } from "./ItemHeader";

export function ItemsTable() {
  const { isLoading, itemData, error, isUpdating, deleteItem, isDeleting, handleSearch } = useItems();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const items = itemData?.data ?? [];

  if (error) return <p>Error occurred..</p>;

  if (isLoading || isUpdating) {
    return <LoadingItemsSkeleton />;
  }

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete._id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <ItemsListHeader onSearch={handleSearch} />
      {items.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <p className="line-clamp-2">{item.description}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentItem(item);
                          setIsEditModalOpen(true);
                        }}
                        title="Edit Item"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        disabled={isDeleting}
                        size="icon"
                        onClick={() => handleDeleteClick(item)}
                        title="Delete Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <EditItemModal
            onClose={() => {
              setIsEditModalOpen(false);
              setCurrentItem(null);
            }}
            isOpen={isEditModalOpen}
            item={currentItem}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmationDialog
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            item={itemToDelete}
            isDeleting={isDeleting}
          />
        </div>
      ) : (
        <NoData title="No Items Found" message="There are currently no items to display." />
      )}
    </>
  );
}
