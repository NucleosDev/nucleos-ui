// src/app/(user-auth)/dashboard/nucleos/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { NucleoGrid } from "@/components/nucleo/nucleo-grid";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Layers, Zap } from "lucide-react";
import { useNucleos } from "@/hooks/useNucleo";
import { adaptNucleoToComStats } from "@/utils/nucleo-adapter";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import type { NucleoComStats } from "@/types/nucleo";

export default function Nucleos() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: nucleos, isLoading, remove, update } = useNucleos();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const nucleosComStats: NucleoComStats[] =
    nucleos?.map(adaptNucleoToComStats) ?? [];

  const handleNucleoClick = (nucleo: NucleoComStats) => {
    router.push(`/dashboard/nucleos/${nucleo.id}`);
  };

  const handleUpdate = async (id: string, payload: any) => {
    await update({ id, payload });
  };

  const handleDelete = async (nucleo: NucleoComStats) => {
    if (
      confirm(
        `Tem certeza que deseja excluir "${nucleo.nome}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      try {
        await remove(nucleo.id);
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="pb-10">
        {/* ============ HEADER ============ */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#4D7CFF]/10 via-[#00C9A7]/10 to-[#4D7CFF]/10">
          {/* Background decorativo */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl bg-[#4D7CFF]/25" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-[#00C9A7]/25" />
            <div className="absolute top-10 left-1/3 w-32 h-32 rounded-full blur-2xl bg-[#4D7CFF]/15" />
          </div>

          <div className="relative px-4 md:px-6 py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#4D7CFF]/30 to-[#00C9A7]/30 border border-[#4D7CFF]/30">
                    <Layers className="h-5 w-5 text-[#4D7CFF]" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Meus Nucleos
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Olá, {user?.fullName?.split(" ")[0] || "Usuário"}!
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  Gerencie seus núcleos e continue de onde parou
                </p>
              </div>

              {/* Botão Desktop - visível apenas em desktop */}
              {/* {!isMobile && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  size="lg"
                  className="hidden md:flex items-center gap-2 rounded-xl shadow-lg bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:shadow-xl hover:shadow-[#4D7CFF]/25 transition-all duration-300 hover:scale-[1.02]"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-medium">Criar Nucleo</span>
                </Button>
              )} */}
            </div>

            {/* Stats rápidas */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/40">
                <Layers className="h-3.5 w-3.5 text-[#4D7CFF]" />
                <span className="text-sm font-medium">
                  {nucleosComStats.length} Nucleo
                  {nucleosComStats.length !== 1 ? "s" : ""}
                </span>
              </div>
              {nucleosComStats.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/40">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-sm font-medium">
                    {nucleosComStats
                      .reduce((sum, n) => sum + (n.xpTotal || 0), 0)
                      .toLocaleString()}{" "}
                    XP Total
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Wave inferior */}
          <div className="relative bottom-0 w-full text-background ">
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-background z-[1]" />
            <svg
              viewBox="0 0 500 100"
              preserveAspectRatio="none"
              className="w-full h-[60px]"
              fill="hsl(var(--background))"
            >
              <path
                d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* ============ GRID DE NUCLEOS ============ */}
        <section className="px-4 md:px-6 pt-6">
          {isLoading ? (
            <NucleoGridSkeleton />
          ) : nucleosComStats.length === 0 ? (
            <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
          ) : (
            <NucleoGrid
              nucleos={nucleosComStats}
              loading={isLoading}
              onNucleoClick={handleNucleoClick}
              onNucleoUpdate={handleUpdate}
              onNucleoDelete={handleDelete}
              onAddNucleo={() => setIsCreateModalOpen(true)}
            />
          )}
        </section>
      </div>

      {/* ============ BOTÃO FLUTUANTE MOBILE ============ */}
      <AnimatePresence>
        {isMobile && nucleosComStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="lg"
              className="rounded-full shadow-2xl shadow-[#4D7CFF]/40 bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:shadow-[#4D7CFF]/60 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <PlusCircle className="h-5 w-5 mr-1.5" />
              <span className="font-medium">Novo</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ MODAL DE CRIAÇÃO ============ */}
      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// ============ SKELETON LOADING ============
function NucleoGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/30 bg-card/50 animate-pulse overflow-hidden"
        >
          <div className="h-[140px] bg-muted/50" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-muted/50 rounded" />
            <div className="h-3 w-1/2 bg-muted/50 rounded" />
            <div className="h-2 w-full bg-muted/50 rounded" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 bg-muted/50 rounded-lg" />
              <div className="h-12 bg-muted/50 rounded-lg" />
              <div className="h-12 bg-muted/50 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ ESTADO VAZIO ============
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4D7CFF]/10 to-[#00C9A7]/10 flex items-center justify-center">
          <Layers className="h-10 w-10 text-[#4D7CFF]/40" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#4D7CFF] to-[#00C9A7] flex items-center justify-center shadow-lg">
          <Zap className="h-4 w-4 text-white" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-2">
        Nenhum Nucleo ainda
      </h2>
      <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8">
        Crie seu primeiro Nucleo para começar a organizar suas tarefas, hábitos,
        projetos e muito mais.
      </p>

      <Button
        onClick={onCreateClick}
        size="lg"
        className="rounded-xl shadow-lg bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:shadow-xl hover:shadow-[#4D7CFF]/25 transition-all duration-300"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Criar meu primeiro Nucleo
      </Button>

      <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-lg w-full">
        {[
          {
            icon: Layers,
            title: "Blocos",
            desc: "Tarefas, listas, calendário e mais",
          },
          {
            icon: Zap,
            title: "Gamificação",
            desc: "Ganhe XP e desbloqueie conquistas",
          },
          {
            icon: Sparkles,
            title: "AI Insights",
            desc: "Sugestões inteligentes para você",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/30 bg-card/50 text-center"
          >
            <item.icon className="h-5 w-5 mx-auto mb-2 text-[#4D7CFF]" />
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
