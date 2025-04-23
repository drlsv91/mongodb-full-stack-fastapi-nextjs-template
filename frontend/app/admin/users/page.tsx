import { requireAuth } from "@/lib/server-auth";
import { Metadata } from "next";
import { UserList } from "./_components/UserList";

const UsersPage = async () => {
  const currentUser = await requireAuth();
  return (
    <div className="mt-10">
      <UserList sessionUser={currentUser} />
    </div>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Next-Starter - Users List",
  description: "View all users",
};

export default UsersPage;
