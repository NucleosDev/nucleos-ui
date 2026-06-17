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
      <div className="relative min-h-screen ">
        {/* Provavel feature futura: deixar o usuario escolher o fundo */}
        {/* <div
          className="fixed inset-0 z-0 opacity-90"
          style={{
            backgroundImage: `url('https://thumbs.dreamstime.com/b/frosted-glass-blur-clean-modern-abstract-background-featuring-frosted-glass-effect-smooth-blur-soft-cool-tones-366766907.jpg')`, // Adicione a URL da imagem de fundo aqui.
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div> */}

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
    </ProtectedRoute>
  );
}
