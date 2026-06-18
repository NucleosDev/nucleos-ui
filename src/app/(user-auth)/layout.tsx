"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AuthenticatedHeader } from "@/components/user/authenticated-header";
import { AuthenticatedMobileHeader } from "@/components/user/authenticated-mobile-header";
import { AuthenticatedFooter } from "@/components/user/authenticated-footer";
import { AuthenticatedMobileFooter } from "@/components/user/autenticated-mobile-footer";
import { DashboardLayout } from "@/components/user/dashboard-layout";
import { XpToast } from "@/components/gamification/XpToast";
import { useGamificationSocket } from "@/hooks/useGamificationSocket";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";
import { BgUser } from "@/components/user/bg-user";
import { FocusTimerProvider } from "@/contexts/FocusTimerContext";
import { FocusTimerPopup } from "@/components/focus/FocusTimerPopup";

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
      <FocusTimerProvider>
      <FocusTimerPopup />
      <div className="relative min-h-screen ">
        <DashboardLayout
          collapsed={isSidebarCollapsed}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMobileMenuClose}
        >
          <BgUser />
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
              isMobile && "pb-20",
              "transition-all duration-300 relative z-10 ",
            )}
          >
            {children}
            <div className="h-30"></div>
          </div>
        </DashboardLayout>
      </div>
      </FocusTimerProvider>
    </ProtectedRoute>
  );
}
