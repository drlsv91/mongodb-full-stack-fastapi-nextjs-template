import React from "react";
import Settings from "./_components/Settings";
import { requireAuth } from "@/lib/server-auth";

const SettingsPage = async () => {
  const currentUser = await requireAuth();
  return (
    <div>
      <Settings sessionUser={currentUser} />
    </div>
  );
};

export default SettingsPage;
