"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

export function AppLoader({ isLoading }: { isLoading: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <Image
          src="/icon.svg"
          alt="Carregando..."
          width={90}
          height={90}
          priority
          className="relative z-10 animate-fade-in"
        />

        <div className="absolute inset-0 shimmer-mask" />
      </div>
    </div>,
    document.body,
  );
}
