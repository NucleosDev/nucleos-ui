"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AuthenticatedHeader } from "@/components/layout-auth/authenticated-header";
import { AuthenticatedMobileHeader } from "@/components/layout-auth/authenticated-mobile-header";
import { AuthenticatedFooter } from "@/components/layout-auth/authenticated-footer";
import { AuthenticatedMobileFooter } from "@/components/layout-auth/autenticated-mobile-footer";
import { DashboardLayout } from "@/components/layout-auth/dashboard-layout";
import { XpToast } from "@/components/gamification/XpToast";
import { useGamificationSocket } from "@/hooks/useGamificationSocket";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  useGamificationSocket();

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-background flex flex-col">
        {/* Header condicional */}

        {/* Layout principal com sidebar e conteúdo */}
        <DashboardLayout
          collapsed={isSidebarCollapsed}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMobileMenuClose}
        >
          {!isMobile ? (
            <AuthenticatedHeader
              onToggleSidebar={handleToggleSidebar}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          ) : (
            <AuthenticatedMobileHeader
              onMenuToggle={handleMobileMenuToggle}
              isOpen={isMobileMenuOpen}
            />
          )}
          <div
            className={cn(
              "",
              "",
              isMobile && "pb-20", // Espaço para footer mobile
              "transition-all duration-300",
            )}
          >
            {children}
            <div className="h-30"></div>
          </div>
        </DashboardLayout>

        {/* Footer condicional */}
        {/* {!isMobile ? <AuthenticatedFooter /> : <AuthenticatedMobileFooter />}
        <XpToast /> */}
      </div>
    </ProtectedRoute>
  );
}
