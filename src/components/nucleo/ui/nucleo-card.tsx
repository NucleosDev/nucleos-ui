// /components/nucleos/ui/nucleo-card.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Calendar,
  Layers,
  Link as LinkIcon,
  Trophy,
  Flame,
  Image as ImageIcon,
  BookOpen,
  Heart,
  Briefcase,
  Wallet,
  Dumbbell,
  Coffee,
  Users,
  Home,
  Target,
  Code,
  Music,
  Camera,
  Palette,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { NucleoProgress } from "./nucleo-progress";
import { getTypeStyles, formatXp } from "../utils/nucleo-helpers";
import type { NucleoCardProps } from "../types/nucleo-components.types";

// Mapa de ícones por tipo (fallback)
const tipoIcons: Record<string, React.ElementType> = {
  estudo: BookOpen,
  hobby: Heart,
  profissional: Briefcase,
  pessoal: Home,
  projeto: Target,
  fitness: Dumbbell,
  bemestar: Coffee,
  social: Users,
  programacao: Code,
  musica: Music,
  fotografia: Camera,
  arte: Palette,
  idiomas: Globe,
  financas: Wallet,
};

export function NucleoCard({
  nucleo,
  variant = "default",
  onClick,
  onEdit,
  onDelete,
  onArchive,
  className,
  href,
}: NucleoCardProps) {
  const {
    id,
    nome,
    descricao,
    tipo,
    cor_destaque = "#4D7CFF", // chart-1
    imagem_capa,
    icon,
    blocos = [],
    relations = [],
    created_at,
    xpTotal = 0,
    level = 1,
    nextLevelXp = 1000,
    energyTotal = 0,
    conquistasDesbloqueadas = 0,
  } = nucleo;

  const typeStyles = getTypeStyles(tipo);

  // Fallback de ícone baseado no tipo
  const IconComponent = tipoIcons[tipo] || Layers;

  // Fallback de imagem de capa (se não tiver, usa gradiente com padrão)
  const capaUrl = imagem_capa || "";
  const temCapa = capaUrl && capaUrl.length > 0;

  const cardContent = (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-all",
        "hover:shadow-lg hover:shadow-[#4D7CFF]/5 hover:border-[#4D7CFF]/30",
        "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Capa ou gradiente de fundo - TODOS OS CARDS TÊM CAPA (fallback gradiente) */}
      {temCapa ? (
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={capaUrl}
            alt={nome}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      ) : (
        <div
          className="h-20 w-full bg-gradient-to-r"
          style={{
            background: `linear-gradient(135deg, ${cor_destaque}40 0%, ${cor_destaque}20 50%, ${cor_destaque}10 100%)`,
          }}
        />
      )}

      {/* Conteúdo principal */}
      <div className="p-5">
        {/* Header com ícone e título - TODOS OS CARDS TÊM ÍCONE (fallback) */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Ícone - sempre presente */}
            <div
              className="flex size-10 items-center justify-center rounded-lg overflow-hidden"
              style={{ backgroundColor: `${cor_destaque}20` }}
            >
              {icon?.icon_url ? (
                <Image
                  src={icon.icon_url}
                  alt={nome}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <IconComponent
                  className="size-5"
                  style={{ color: cor_destaque }}
                />
              )}
            </div>

            <div>
              <h3 className="font-semibold leading-none tracking-tight">
                {nome}
              </h3>
              {variant === "detailed" && descricao && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {descricao}
                </p>
              )}
            </div>
          </div>

          {/* Menu de ações */}
          {(onEdit || onDelete || onArchive) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                )}
                {onArchive && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive();
                    }}
                  >
                    Arquivar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="text-destructive"
                    >
                      Deletar
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Badge de tipo */}
        <Badge variant="outline" className={cn("mb-4", typeStyles)}>
          {tipo}
        </Badge>

        {/* Progresso */}
        {variant === "compact" ? (
          // Versão ultra compacta para modo lista
          <div className="mt-2 mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Nv.{level}</span>
              <span className="text-muted-foreground">
                {xpTotal}/{nextLevelXp}
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] rounded-full"
                style={{ width: `${(xpTotal / nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <NucleoProgress
            xpAtual={xpTotal}
            xpMax={nextLevelXp}
            nivel={level}
            energy={energyTotal}
            conquistas={conquistasDesbloqueadas}
            showDetails={variant === "detailed"}
            variant={variant === "detailed" ? "default" : "minimal"}
          />
        )}

        {/* Stats e metadados */}
        {variant === "detailed" && (
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
            {/* XP hoje */}
            {nucleo.xpHoje !== undefined && nucleo.xpHoje > 0 && (
              <div className="flex items-center gap-1">
                <Flame className="size-3.5 text-[#FF8C42]" />{" "}
                {/* laranja personalizado */}
                <span>+{formatXp(nucleo.xpHoje)} hoje</span>
              </div>
            )}

            {/* Conquistas */}
            {conquistasDesbloqueadas > 0 && (
              <div className="flex items-center gap-1">
                <Trophy className="size-3.5 text-[#FFD700]" /> {/* ouro */}
                <span>{conquistasDesbloqueadas}</span>
              </div>
            )}

            {/* Conexões */}
            {relations.length > 0 && (
              <div className="flex items-center gap-1">
                <LinkIcon className="size-3.5 text-[#2EBD59]" />{" "}
                {/* chart-3 verde */}
                <span>{relations.length}</span>
              </div>
            )}

            {/* Blocos */}
            {blocos.length > 0 && (
              <div className="flex items-center gap-1">
                <Layers className="size-3.5 text-[#0077BE]" />{" "}
                {/* chart-4 azul médio */}
                <span>{blocos.length}</span>
              </div>
            )}
          </div>
        )}

        {/* Data de criação */}
        {variant !== "compact" && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/60">
            <Calendar className="size-3 text-[#8CD47E]" />{" "}
            {/* chart-5 verde claro */}
            <span>
              Criado em {new Date(created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // descomentar em prod.
  //   if (href) {
  //     return <Link href={href}>{cardContent}</Link>;
  //   }

  //por enquanto apenas dados mock, sem navegação real.

  return cardContent;
}
