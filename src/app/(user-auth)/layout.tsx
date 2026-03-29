"use client";

// import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/layout-auth/dashboard-layout";
import { AuthenticatedHeader } from "@/components/layout-auth/authenticated-header";

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ProtectedRoute>
      <main className=" px-full py-0">
        <AuthenticatedHeader />
        <div>
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </main>
    // </ProtectedRoute>
  );
}
