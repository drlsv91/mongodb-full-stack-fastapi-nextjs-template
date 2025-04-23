import { Plus, Search, X } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  searchQuery: string;
  addButtonText?: string;
  inputPlaceholder?: string;

  onSeachQuery: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onSetModalOpen: (state: boolean) => void;
}

const ActionHeader = ({
  title,
  description,
  searchQuery,

  onSeachQuery,
  onKeyDown,
  onClearSearch,
  onSetModalOpen,
  addButtonText = "Add Item",
  inputPlaceholder = "Search... (press Enter)",
}: Props) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:min-w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={inputPlaceholder}
            className="pl-8 pr-10 text-xs"
            value={searchQuery}
            onChange={(e) => onSeachQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <Button onClick={() => onSetModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ActionHeader;
