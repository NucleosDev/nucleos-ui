import { ProtectedRoute } from "@/components/auth/protected-route";
import { QueryProvider } from "@/src/providers/QueryProvider";
import type { ReactNode } from "react";

export default function UserAuthLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
