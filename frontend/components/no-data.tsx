"use client";
import { AlertTriangle, FileQuestion, InboxIcon, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

type NoDataProps = {
  title?: string;
  message?: string;
  icon?: "empty" | "search" | "file" | "error";
  className?: string;
};

export function NoData({
  title = "No Data Available",
  message = "There are no items to display at the moment.",
  icon = "empty",
  className = "",
}: Readonly<NoDataProps>) {
  const searchParams = useSearchParams();
  if (searchParams.get("q")) {
    icon = "search";
  }

  // Map icon type to the appropriate Lucide icon
  const IconComponent = {
    empty: () => <InboxIcon className="h-12 w-12 text-muted-foreground" />,
    search: () => <Search className="h-12 w-12 text-muted-foreground" />,
    file: () => <FileQuestion className="h-12 w-12 text-muted-foreground" />,
    error: () => <AlertTriangle className="h-12 w-12 text-destructive" />,
  }[icon];

  return (
    <div className={`flex items-center justify-center mt-5 ${className}`}>
      <div
        className={`text-center max-w-md mx-auto p-6 rounded-lg border border-dashed ${
          icon === "error" ? "border-destructive/30 bg-destructive/5" : "border-muted-foreground/20 bg-muted/40"
        }`}
      >
        <div className="flex justify-center mb-4">
          <IconComponent />
        </div>
        <h3 className={`text-lg font-medium mb-2 ${icon === "error" ? "text-destructive" : ""}`}>{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
