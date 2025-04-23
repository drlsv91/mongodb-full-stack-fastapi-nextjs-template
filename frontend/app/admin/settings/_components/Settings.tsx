"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./ProfileSetting";
import { PasswordSettings } from "./PasswordSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";

export default function Settings({ sessionUser }: Readonly<{ sessionUser: User }>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "password", label: "Password" },
    { id: "appearance", label: "Appearance" },
  ];

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeTab) {
      params.set("tab", activeTab);
    } else {
      params.delete("tab");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [activeTab, router, searchParams]);

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="p-1">
          <TabsList className="grid grid-cols-3 w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings currentUser={sessionUser} />
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <PasswordSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
