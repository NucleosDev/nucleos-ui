"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Página não encontrada</p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 rounded-lg bg-primary text-white"
      >
        Voltar para o início
      </button>
    </div>
  );
}
