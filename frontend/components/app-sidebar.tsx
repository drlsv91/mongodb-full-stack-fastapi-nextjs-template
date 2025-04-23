"use client";
import { ArrowUpCircleIcon, LayoutDashboardIcon, Package, SettingsIcon, Users } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface AppSidebarProps extends Readonly<React.ComponentProps<typeof Sidebar>> {
  readonly user: {
    name: string;
    email: string;
    avatar: string;
    isSuperUser: boolean;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navMainItems = useMemo(() => {
    // Base navigation items for all users
    const items = [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Items",
        url: "/admin/items",
        icon: Package,
      },
    ];

    // Add admin-only navigation items
    if (user.isSuperUser) {
      items.push({
        title: "Users",
        url: "/admin/users",
        icon: Users,
      });
    }

    return items;
  }, [user.isSuperUser]);

  const navSecondaryItems = [
    {
      title: "User Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/admin">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Nextjs-starter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />

        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
