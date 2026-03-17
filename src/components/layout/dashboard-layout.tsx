"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Home,
  LayoutGrid,
  Calendar,
  Clock,
  Brain,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: Home },
  { label: "Nucleos", href: ROUTES.NUCLEOS, icon: LayoutGrid },
  { label: "Calendário", href: ROUTES.CALENDAR, icon: Calendar },
  { label: "Timers", href: ROUTES.TIMERS, icon: Clock },
  { label: "IA Assistente", href: ROUTES.AI_ASSISTANT, icon: Brain },
  { label: "Insights IA", href: ROUTES.AI_INSIGHTS, icon: TrendingUp },
  { label: "Conquistas", href: "/achievements", icon: Award },
  { label: "Notificações", href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: "Configurações", href: ROUTES.SETTINGS, icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "Admin", href: ROUTES.ADMIN, icon: Users, roles: ["admin"] },
  {
    label: "Usuários",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Nucleos Admin",
    href: ROUTES.ADMIN_NUCLEOS,
    icon: LayoutGrid,
    roles: ["admin"],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.some((role) => hasPermission(role)),
  );

  const filteredAdminItems = adminNavItems.filter((item) =>
    item.roles?.some((role) => hasPermission(role)),
  );

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive &&
            "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
      </Link>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
            "transform transition-transform duration-200 ease-in-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo area */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <Link href={ROUTES.DASHBOARD} className="text-xl font-bold">
                Nucleos
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">
                    {user?.profile?.full_name?.charAt(0) ||
                      user?.email?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.profile?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}

              {filteredAdminItems.length > 0 && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-gray-800" />
                  {filteredAdminItems.map((item) => (
                    <NavLink key={item.href} item={item} />
                  ))}
                </>
              )}
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex-1" />

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Link
                  href={ROUTES.NOTIFICATIONS}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge example */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Link>

                {/* Settings */}
                <Link
                  href={ROUTES.SETTINGS}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Settings className="h-5 w-5" />
                </Link>

                {/* User menu (mobile) */}
                <div className="lg:hidden">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                      {user?.profile?.full_name?.charAt(0) ||
                        user?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
