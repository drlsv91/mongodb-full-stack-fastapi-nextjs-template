"use client";

import ActionHeader from "@/components/common/ActionHeader";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface UserListHeaderProps {
  onSearch?: (query: string) => void;
  title?: string;
  description?: string;
}

export function UserListHeader({
  onSearch,
  title = "Users",
  description = "Manage user accounts",
}: Readonly<UserListHeaderProps>) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4 mb-3">
      <ActionHeader
        title={title}
        description={description}
        onSeachQuery={setSearchQuery}
        searchQuery={searchQuery}
        onKeyDown={handleKeyDown}
        onClearSearch={handleClearSearch}
        onSetModalOpen={setIsCreateModalOpen}
        addButtonText="Add User"
      />

      {/* Create User Modal */}
      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
