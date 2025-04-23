"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { ArrowRight, Database, LogIn, Package, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const checkApiStatus = async () => {
    setApiStatus("loading");
    try {
      const response = await axiosInstance.get("/utils/health-check");
      const data = response.data;
      if (data) {
        setApiStatus("success");
      } else {
        setApiStatus("error");
      }
    } catch (error) {
      console.log(error);
      setApiStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background px-10">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-bold text-xl">FastAPI-NextJS Project</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8 mx-auto">
        <section className="mb-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to Our Admin Portal</h2>
            <p className="text-muted-foreground mb-6">Manage users and items with our simple and intuitive interface</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={checkApiStatus} disabled={apiStatus === "loading"}>
                {apiStatus === "loading" ? "Checking..." : "Check API Status"}
              </Button>
              {apiStatus === "success" && <p className="flex items-center text-green-500">API is online and healthy</p>}
              {apiStatus === "error" && (
                <p className="flex items-center text-red-500">API is offline or experiencing issues</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <ShieldCheck className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Super admin controls for system management</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 mb-6">
                <li>Add, update, and delete users</li>
                <li>Add, update, and delete items</li>
                <li>Monitor system activity</li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin" className="flex items-center justify-between">
                  Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 mb-6">
                <li>Create new user accounts</li>
                <li>Update existing user details</li>
                <li>Manage user roles and access</li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/users" className="flex items-center justify-between">
                  User Management
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <Package className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Item Management</CardTitle>
              <CardDescription>Manage items in the system</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 mb-6">
                <li>Add new items to inventory</li>
                <li>Update item details and status</li>
                <li>Remove deprecated items</li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/items" className="flex items-center justify-between">
                  Item Management
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} FastAPI MongoDB NextJS Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
