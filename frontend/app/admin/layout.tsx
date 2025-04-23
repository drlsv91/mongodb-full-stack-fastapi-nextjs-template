import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  console.log(session);
  if (!session) {
    redirect("/sign-in");
  }

  const user = {
    name: session.user.name!,
    email: session.user.email,
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
