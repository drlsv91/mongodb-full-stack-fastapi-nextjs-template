import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-red-600" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">Access Denied</h1>
      <p className="text-center text-muted-foreground max-w-md mb-8">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
