import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/server-auth";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const sessionUser = await requireAuth();
  const user = {
    name: sessionUser.name!,
    email: sessionUser.email,
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={user} />

      <SidebarInset>
        <SiteHeader />
        <main className="px-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
