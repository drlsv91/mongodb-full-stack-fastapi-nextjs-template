"use client";

import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import LoadingItemsSkeleton from "@/components/items/LoadItemsSkeleton";
import { NoData } from "@/components/no-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditUserModal } from "@/components/users/EditUserModal";
import { useUsers } from "@/hooks/use-user-query";
import { User } from "@/types/user";
import { Check, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";
import { UserListHeader } from "./UserListHeader";

export function UserList({ sessionUser }: Readonly<{ sessionUser: User }>) {
  const { isLoading, usersData, error, deleteUser, isDeleting, handleSearch } = useUsers();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const users = usersData?.data ?? [];

  if (error) return <NoData title="Failed" message="An Error Occurred, please retry" icon="error" />;

  if (isLoading) {
    return <LoadingItemsSkeleton />;
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <>
      <UserListHeader onSearch={handleSearch} />
      {users.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.email}

                    {sessionUser._id == user._id && (
                      <Badge variant="outline" className="text-blue-700 bg-blue-100 ml-2">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <X className="mr-1 h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_superuser ? (
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        User
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsEditModalOpen(true);
                        }}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        disabled={isDeleting}
                        size="icon"
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Edit User Modal */}
          {currentUser && (
            <EditUserModal
              onClose={() => {
                setIsEditModalOpen(false);
                setCurrentUser(null);
              }}
              isOpen={isEditModalOpen}
              user={currentUser}
            />
          )}

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmationDialog
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Delete User"
            description={`Are you sure you want to delete the user "${userToDelete?.email}"? This action cannot be undone.`}
            isDeleting={isDeleting}
          />
        </div>
      ) : (
        <NoData title="No Users Found" message="There are currently no users to display." />
      )}
    </>
  );
}
