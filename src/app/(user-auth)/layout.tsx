// src/app/(user-auth)/layout.tsx
"use client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthenticatedHeader } from "@/components/layout-auth/authenticated-header";
import { AuthenticatedFooter } from "@/components/layout-auth/authenticated-footer";
import { DashboardLayout } from "@/components/layout-auth/dashboard-layout";

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden">
        <AuthenticatedHeader />
        <div className="">
          <DashboardLayout>
            {children}
            <AuthenticatedFooter />
          </DashboardLayout>
        </div>
      </div>
    </ProtectedRoute>
  );
}
