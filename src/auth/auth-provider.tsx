"use client";

import { AuthProvider as InternalAuthProvider } from "./auth-context";
import { type ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Evita problemas de hydration (Next.js + localStorage)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <InternalAuthProvider>{children}</InternalAuthProvider>;
}
