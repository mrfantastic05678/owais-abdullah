import React, { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";
import { RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Vault Access & Password Reset | Owais Abdullah",
  description: "Secure 1-click access and password management for Owais Abdullah Admin Suite.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              Loading security portal...
            </span>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
