"use client";

import { AuthProvider as InternalAuthProvider } from "./auth-context";
import { type ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <InternalAuthProvider>{children}</InternalAuthProvider>;
}
