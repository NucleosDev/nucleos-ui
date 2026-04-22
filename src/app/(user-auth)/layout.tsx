"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AuthenticatedHeader } from "@/components/layout-auth/authenticated-header";
import { AuthenticatedMobileHeader } from "@/components/layout-auth/authenticated-mobile-header";
import { AuthenticatedFooter } from "@/components/layout-auth/authenticated-footer";
import { AuthenticatedMobileFooter } from "@/components/layout-auth/autenticated-mobile-footer";
import { DashboardLayout } from "@/components/layout-auth/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar se é mobile (768px é o breakpad do Tailwind para md)
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Recuperar estado salvo no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ProtectedRoute>
      <div className="">
        {/* Desktop Header - visível apenas em desktop */}
        {!isMobile && (
          <AuthenticatedHeader
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}

        {/* Mobile Header - visível apenas em mobile */}
        {isMobile && (
          <AuthenticatedMobileHeader
            onMenuToggle={handleMobileMenuToggle}
            isOpen={isMobileMenuOpen}
          />
        )}

        {/* Conteúdo principal com sidebar - sem footers dentro */}
        <div>
          <DashboardLayout
            collapsed={isSidebarCollapsed}
            isMobile={isMobile}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          >
            {children}
          </DashboardLayout>
        </div>

        {/* Footer - fora do DashboardLayout, na mesma camada que children */}
        {/* Desktop Footer */}
        {!isMobile && <AuthenticatedFooter />}

        {/* Mobile Footer */}
        {isMobile && <AuthenticatedMobileFooter />}
      </div>
    </ProtectedRoute>
  );
}
