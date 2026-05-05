// src/components/document/HeaderBlock.tsx
"use client";

import { useRouter } from "next/navigation";
import type { Nucleo } from "@/types/nucleo";

interface HeaderBlockProps {
  nucleo: Nucleo;
  fullWidth?: boolean;
}

export function HeaderBlock({ nucleo, fullWidth = false }: HeaderBlockProps) {
  const router = useRouter();

  return (
    <div className="w-full mb-2">
      <div>test</div>
    </div>
  );
}
