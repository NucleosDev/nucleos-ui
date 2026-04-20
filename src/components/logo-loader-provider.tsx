"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const MIN_VISIBLE_TIME = 2000; // 👈 2.5 segundos

export function AppLoader({ isLoading }: { isLoading: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      // delay inicial pra evitar flicker
      timeout = setTimeout(() => {
        startTimeRef.current = Date.now();
        setVisible(true);
      }, 200);
    } else {
      const elapsed = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;

      const remaining = Math.max(MIN_VISIBLE_TIME - elapsed, 0);

      timeout = setTimeout(() => {
        setVisible(false);
        startTimeRef.current = null;
      }, remaining);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        <Image
          src="/icon.svg"
          alt="Carregando..."
          width={90}
          height={90}
          priority
          className="relative z-10 animate-fade-in"
        />

        <div className="shimmer-overlay" />
      </div>
    </div>,
    document.body,
  );
}

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  const isLoading = fetching > 0 || mutating > 0;

  return (
    <>
      <AppLoader isLoading={isLoading} />
      {children}
    </>
  );
}
