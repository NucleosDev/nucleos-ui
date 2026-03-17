// /components/nucleos/ui/nucleo-grid.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NucleoCard } from "./nucleo-card";
import type { NucleoWithStats } from "../types/nucleo-components.types";

type Visualizacao = "grid" | "list";
type Ordenacao = "nome" | "xp" | "nivel" | "criacao" | "progresso";

interface NucleoGridProps {
  nucleos: NucleoWithStats[];
  onNucleoClick?: (nucleo: NucleoWithStats) => void;
  onNucleoEdit?: (nucleo: NucleoWithStats) => void;
  onNucleoDelete?: (nucleo: NucleoWithStats) => void;
  onNucleoArchive?: (nucleo: NucleoWithStats) => void;
  carregando?: boolean;
  className?: string;
}

export function NucleoGrid({
  nucleos,
  onNucleoClick,
  onNucleoEdit,
  onNucleoDelete,
  onNucleoArchive,
  carregando = false,
  className,
}: NucleoGridProps) {
  const [visualizacao, setVisualizacao] = useState<Visualizacao>("grid");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("criacao");
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);

  // Filtragem
  const nucleosFiltrados = nucleos.filter((nucleo) => {
    if (busca && !nucleo.nome.toLowerCase().includes(busca.toLowerCase()))
      return false;
    if (filtroTipo && nucleo.tipo !== filtroTipo) return false;
    return true;
  });

  const nucleosOrdenados = [...nucleosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome":
        return a.nome.localeCompare(b.nome);
      case "xp":
        return (b.xpTotal || 0) - (a.xpTotal || 0);
      case "nivel":
        return (b.level || 0) - (a.level || 0);
      case "progresso":
        const progressA = ((a.xpTotal || 0) / (a.nextLevelXp || 1000)) * 100;
        const progressB = ((b.xpTotal || 0) / (b.nextLevelXp || 1000)) * 100;
        return progressB - progressA;
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const tipos = Array.from(new Set(nucleos.map((n) => n.tipo)));

  if (carregando) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          className,
        )}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Nucleos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filtro por tipo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                {filtroTipo ? `Tipo: ${filtroTipo}` : "Filtrar"}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFiltroTipo(null)}>
                Todos
              </DropdownMenuItem>
              {tipos.map((tipo) => (
                <DropdownMenuItem
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                >
                  {tipo}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ordenação */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="size-4" />
                Ordenar
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOrdenacao("criacao")}>
                Data de criação
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao("nome")}>
                Nome
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao("xp")}>
                XP total
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao("nivel")}>
                Nível
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao("progresso")}>
                Progresso
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toggle visualização */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "size-8 p-0",
                visualizacao === "grid" && "bg-muted",
              )}
              onClick={() => setVisualizacao("grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "size-8 p-0",
                visualizacao === "list" && "bg-muted",
              )}
              onClick={() => setVisualizacao("list")}
            >
              <LayoutList className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {nucleosOrdenados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">Nenhum Nucleo encontrado</p>
          </motion.div>
        ) : (
          <motion.div
            key={visualizacao}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "grid gap-4",
              visualizacao === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {nucleosOrdenados.map((nucleo) => (
              <NucleoCard
                key={nucleo.id}
                nucleo={nucleo}
                variant={visualizacao === "grid" ? "detailed" : "compact"}
                onClick={() => onNucleoClick?.(nucleo)}
                onEdit={() => onNucleoEdit?.(nucleo)}
                onDelete={() => onNucleoDelete?.(nucleo)}
                onArchive={() => onNucleoArchive?.(nucleo)}
                href={`/nucleos/${nucleo.id}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info de resultados */}
      <div className="text-sm text-muted-foreground text-center">
        Mostrando {nucleosOrdenados.length} de {nucleos.length} Nucleos
      </div>
    </div>
  );
}
