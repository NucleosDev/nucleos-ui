"use client";

import { useEffect } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function DemoPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="min-h-screen min-h-dvh">
      {/* <Header /> */}
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-4">Página de Demonstração</h1>
        <p className="mb-2">
          Esta é uma página de demonstração para testar funcionalidades e
          componentes.
        </p>
        {/* Adicione aqui os componentes ou funcionalidades que deseja testar */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
