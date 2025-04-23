import { getSession } from "@/lib/session";
import { Metadata } from "next";

async function AdminPage() {
  const session = await getSession();
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <p>
            <span className="text-sm">Welcome to your Dashboard</span>{" "}
            <span className="font-semibold">{session?.user.name}!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Next-Starter - Dashboard",
  description: "Admin dashboard",
};
export default AdminPage;
