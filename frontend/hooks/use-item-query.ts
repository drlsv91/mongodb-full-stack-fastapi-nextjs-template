"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CreateItemData, Item, ItemData } from "@/types/item";
import { useState } from "react";

export function useItems() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") ?? "");

  // Get all items
  const {
    data: itemData,
    isLoading,
    error,
    refetch,
  } = useQuery<ItemData>({
    queryKey: ["items", searchQuery],
    queryFn: async () => {
      // Build URL with search parameters if they exist
      let url = "/items";
      if (searchQuery) {
        url = `/items?q=${encodeURIComponent(searchQuery)}`;
      }
      return axiosInstance.get(url).then((res) => res.data);
    },
    staleTime: 60 * 1000, // 60s
    retry: 3,
  });

  // Handle search queries
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    // Update URL without full page refresh
    const newPath = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
    router.push(newPath, { scroll: false });
  };

  const createItemMutation = useMutation({
    mutationFn: (newItem: CreateItemData) => axiosInstance.post("/items", newItem).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item created successfully");
      router.push("/admin/items");
    },
    onError: (error) => {
      toast.error("Failed to create item");
      console.error("Create error:", error);
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateItemData> }) =>
      axiosInstance.put(`/items/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item updated successfully");
      router.push("/admin/items");
    },
    onError: (error) => {
      toast.error("Failed to update item");
      console.error("Update error:", error);
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/items/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete item");
      console.error("Delete error:", error);
    },
  });

  const handleViewItem = (item: Item) => {
    router.push(`/admin/items/${item.id}`);
  };

  const handleEditItem = (item: Item) => {
    router.push(`/admin/items/${item.id}/edit`);
  };

  const handleDeleteItem = async (item: Item) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItemMutation.mutateAsync(item.id);
    }
  };

  return {
    // Query results
    itemData,
    isLoading,
    error,
    refetch,

    // Mutations
    createItem: createItemMutation.mutateAsync,
    isCreating: createItemMutation.isPending,
    updateItem: updateItemMutation.mutateAsync,
    isUpdating: updateItemMutation.isPending,
    deleteItem: deleteItemMutation.mutateAsync,
    isDeleting: deleteItemMutation.isPending,

    // Search functionality
    handleSearch,
    // UI action handlers
    actions: {
      viewItem: handleViewItem,
      editItem: handleEditItem,
      deleteItem: handleDeleteItem,
    },
  };
}
