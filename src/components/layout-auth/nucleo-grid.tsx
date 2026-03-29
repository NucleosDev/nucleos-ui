"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NucleoCard, type NucleoData } from "./nucleo-card";

interface NucleoGridProps {
  nucleos: NucleoData[] | null;
  isLoading?: boolean;
  onOpenNucleo?: (id: string) => void;
  onCreateNucleo?: () => void;
}

function NucleoCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <div className="h-3 w-14 animate-pulse rounded bg-muted" />
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-3 w-28 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function NucleoGrid({
  nucleos,
  isLoading,
  onOpenNucleo,
  onCreateNucleo,
}: NucleoGridProps) {
  const showSkeleton = isLoading || nucleos === null;
  const isEmpty = !isLoading && nucleos !== null && nucleos.length === 0;

  return (
    <section aria-label="Seus Núcleos">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Seus Núcleos
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
            Acompanhe e evolua seus focos principais
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="hidden shrink-0 gap-1.5 text-xs md:flex"
          onClick={onCreateNucleo}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo
        </Button>
      </div>

      {/* Estado vazio */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 px-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            Você ainda não tem núcleos
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Crie seu primeiro núcleo para começar a acompanhar seu progresso.
          </p>
          <Button
            size="sm"
            className="mt-4 gap-1.5 text-xs"
            onClick={onCreateNucleo}
          >
            <Plus className="h-3.5 w-3.5" />
            Criar primeiro núcleo
          </Button>
        </div>
      )}

      {/* Grid de cards */}
      {!isEmpty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showSkeleton
            ? Array.from({ length: 6 }).map((_, i) => (
                <NucleoCardSkeleton key={i} />
              ))
            : nucleos!.map((nucleo) => (
                <NucleoCard
                  key={nucleo.id}
                  nucleo={nucleo}
                  onClick={onOpenNucleo}
                />
              ))}
        </div>
      )}
    </section>
  );
}
