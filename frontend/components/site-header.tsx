"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import axios from "axios";

interface SiteHeaderProps {
  user: {
    name: string;
    email: string;
  };
}

export function SiteHeader({ user }: Readonly<SiteHeaderProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pageTitle = useMemo(() => {
    const dashboard = "Dashboard";
    if (!pathname) return dashboard;

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length == 0) {
      return dashboard;
    }

    // Map path segments to readable titles
    const titleMap: Record<string, string> = {
      admin: "Dashboard",
      items: "Items",
      users: "Users",
      settings: "Settings",
    };

    const lastSegment = segments[segments.length - 1];

    return titleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }, [pathname]);

  const userInitials = useMemo(() => {
    if (!user?.name) return "U";

    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else {
      return user.name.substring(0, 2).toUpperCase();
    }
  }, [user?.name]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get("/api/sign-out");

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium capitalize">{pageTitle}</h1>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
