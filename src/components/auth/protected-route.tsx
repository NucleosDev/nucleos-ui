"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/auth";
import { getLoginUrlWithCallback, isPublicRoute } from "@/constants/routes";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = isPublicRoute(pathname);

    if (!isAuthenticated && !isPublic) {
      router.push(getLoginUrlWithCallback(pathname));
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
