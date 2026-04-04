"use client";

// import { ProtectedRoute } from "@/components/auth/protected-route";
// src/app/(user-auth)/layout.tsx
import { DashboardLayout } from "@/components/layout-auth/dashboard-layout";
import { AuthenticatedHeader } from "@/components/layout-auth/authenticated-header";

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-full py-0">
      <AuthenticatedHeader />
      <div>
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </main>
  );
}