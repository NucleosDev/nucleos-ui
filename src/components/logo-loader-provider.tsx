// src/components/logo-loader-provider.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const MIN_VISIBLE_TIME = 800;
const SHOW_DELAY = 150;

export function AppLoader({ isLoading }: { isLoading: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    if (isLoading) {
      showTimeoutRef.current = setTimeout(() => {
        startTimeRef.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY);
    } else {
      const elapsed = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;
      const remaining = Math.max(MIN_VISIBLE_TIME - elapsed, 0);

      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        startTimeRef.current = null;
      }, remaining);
    }

    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isLoading]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="relative w-20 h-20">
          <Image
            src="/icon.svg"
            alt="Carregando..."
            fill
            priority
            className="object-contain animate-pulse"
          />
          <div className="shimmer-overlay" />
        </div>
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
