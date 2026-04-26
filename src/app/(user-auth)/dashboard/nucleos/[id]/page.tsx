// src/app/(user-auth)/dashboard/nucleos/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { NucleoCanvas } from "@/components/nucleo/NucleoCanvas";
import type { CreateBlocoPayload } from "@/types/bloco";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FunctionalBlocksList } from "@/components/nucleo/FunctionalBlocksList";

export default function NucleoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(id);
  const {
    blocos,
    isLoading: blocosLoading,
    create,
    remove,
    isCreating,
  } = useBlocos(id);
  const [modalOpen, setModalOpen] = useState(false);

  if (nucleoLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleAddBlock = () => setModalOpen(true);

  const handleCreateBlock = async (payload: CreateBlocoPayload) => {
    try {
      await create(payload);
      toast({ title: "Bloco criado com sucesso!" });
      setModalOpen(false);
    } catch (error) {
      toast({ title: "Erro ao criar bloco", variant: "destructive" });
    }
  };

  return (
    <>
      <NucleoCanvas
        nucleoId={id}
        onAddFunctionalBlock={handleAddBlock}
        isLoading={nucleoLoading}
      />

      <FunctionalBlocksList
        blocos={blocos}
        isLoading={blocosLoading}
        nucleoId={id}
        onEdit={() => {}}
        onDelete={remove}
        onAddBlock={handleAddBlock}
      />

      <CriarBlocoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateBlock}
        nucleoId={id}
        isCreating={isCreating}
      />
    </>
  );
}
