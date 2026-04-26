// src/app/(user-auth)/dashboard/nucleos/[id]/layout.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getNucleoIcon } from "@/lib/nucleo-icons"; // ✅ import do arquivo separado

export default function NucleoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(id);

  if (nucleoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative w-full h-[340px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              viewBox="0 0 500 100"
              preserveAspectRatio="none"
              className="w-full h-[110px]"
              fill="hsl(var(--background))"
            >
              <path
                d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
          <Skeleton className="w-20 h-20 rounded-xl -mt-12 mb-8" />
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!nucleo) return null;

  const randomImageUrl = `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const capaUrl = nucleo.imagemCapa || randomImageUrl;
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const IconComponent = getNucleoIcon(nucleo.tipo, nucleo.iconId);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de capa */}
      <div className="relative w-full h-[340px] overflow-hidden">
        <Image
          src={capaUrl}
          alt={`Capa de ${nucleo.nome}`}
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

        {/* WAVE */}
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none text-background">
          <svg
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            className="w-full h-[110px]"
            fill="hsl(var(--background))"
          >
            <path
              d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Botão voltar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white z-20"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
        {/* Ícone flutuante */}
        <div className="relative -mt-12 mb-8 z-30">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        {/* Título e descrição */}
        <div className="space-y-2 max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {nucleo.nome}
          </h1>
          {nucleo.descricao && (
            <p className="text-muted-foreground text-base md:text-lg">
              {nucleo.descricao}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{nucleo.tipo}</span>
            <span>•</span>
            <span>
              Criado em{" "}
              {new Date(nucleo.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Conteúdo da página */}
        {children}
      </div>
    </div>
  );
}
