"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { CreateUserData, UpdateMePassword, User, UserData } from "@/types/user";

const USER_URL = "/users";
const KEY = "users";
const USER_PATH = "/admin/users";

export function useUsers() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") ?? "");

  // Get all items
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery<UserData>({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      // Build URL with search parameters if they exist
      let url = USER_URL;
      if (searchQuery) {
        url = `${url}?q=${encodeURIComponent(searchQuery)}`;
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

  const createUserMutation = useMutation({
    mutationFn: (newUser: CreateUserData) => axiosInstance.post(USER_URL, newUser).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("User created successfully");
      router.push(USER_PATH);
    },
    onError: (error) => {
      toast.error("Failed to create user");
      console.error("Create error:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserData> }) =>
      axiosInstance.patch(`/users/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("User updated successfully");
      router.push(USER_PATH);
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    },
  });
  // Update user profile mutation
  const updateUserProfileMutation = useMutation({
    mutationFn: (data: Partial<CreateUserData>) => axiosInstance.patch(`/users/me`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("Profile updated successfully");
      router.push("/admin/settings?tab=profile");
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    },
  });
  const updateProfilePasswordMutation = useMutation({
    mutationFn: (data: UpdateMePassword) => axiosInstance.patch(`/users/me/password`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("User password successfully");
      router.push("/admin/settings?tab=password");
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/users/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error("Delete error:", error);
    },
  });

  const handleViewUser = (user: User) => {
    router.push(`${USER_PATH}/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    router.push(`${USER_PATH}/${user.id}/edit`);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserMutation.mutateAsync(user.id);
    }
  };

  return {
    // Query results
    usersData,
    isLoading,
    error,
    refetch,

    // Mutations
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,

    // Profile functionality
    updateUserProfile: updateUserProfileMutation.mutateAsync,
    isUpdatingProfile: updateUserProfileMutation.isPending,
    updateMePassword: updateProfilePasswordMutation.mutateAsync,
    isUpdatingPassword: updateProfilePasswordMutation.isPending,

    // Search functionality
    handleSearch,
    // UI action handlers
    actions: {
      viewUser: handleViewUser,
      editUser: handleEditUser,
      deleteUser: handleDeleteUser,
    },
  };
}
