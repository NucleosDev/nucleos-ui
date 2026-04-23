"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";
import { CreateNucleoModal } from "@/components/nucleo/ui/nucleo-create-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNucleos } from "@/hooks/useNucleo";
import { adaptNucleoToComStats } from "@/utils/nucleo-adapter";
import type { NucleoComStats } from "@/types/nucleo";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: nucleos, isLoading, remove, update } = useNucleos();

  const nucleosComStats: NucleoComStats[] =
    nucleos?.map(adaptNucleoToComStats) ?? [];

  // CORRIGIDO: rota correta para a página de detalhes do Nucleo
  const handleNucleoClick = (nucleo: NucleoComStats) => {
    router.push(`/dashboard/nucleos/${nucleo.id}`); // ← adicionado "s" em nucleos
  };

  const handleUpdate = async (id: string, payload: any) => {
    await update({ id, payload });
  };

  const handleDelete = async (nucleo: NucleoComStats) => {
    if (confirm("Tem certeza que deseja excluir este Nucleo?")) {
      try {
        await remove(nucleo.id);
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir Nucleo. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/10 px-4 md:px-6">
      <div className="pb-10">
        <section className="space-y-4 px-4 md:px-6">
          <NucleoGrid
            nucleos={nucleosComStats}
            loading={isLoading}
            onNucleoClick={handleNucleoClick}
            onNucleoUpdate={handleUpdate}
            onNucleoDelete={handleDelete}
            onAddNucleo={() => setIsCreateModalOpen(true)}
          />
        </section>
      </div>
      s{/* Botão Mobile flutuante */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90 transition"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          <span>Novo</span>
        </Button>
      </div>
      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
