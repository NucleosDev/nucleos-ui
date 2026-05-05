// src/components/document/HeaderBlock.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Star,
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Dumbbell,
  Palette,
  Music,
  Code,
  Star as StarIcon,
  Globe,
  Coffee,
  Camera,
  Plane,
  ShoppingBag,
  Users,
  Mic,
  Gamepad2,
  Leaf,
  GraduationCap,
  Target,
  Wallet,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import type { Nucleo } from "@/types/nucleo";

const TIPO_ICONS: Record<string, LucideIcon> = {
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
  trabalho: Briefcase,
  saude: Heart,
  educacao: GraduationCap,
};

function getNucleoIcon(tipo: string): LucideIcon {
  return TIPO_ICONS[tipo?.toLowerCase()] ?? Layers;
}

interface HeaderBlockProps {
  nucleo: Nucleo;
  fullWidth?: boolean;
}

export function HeaderBlock({ nucleo, fullWidth = false }: HeaderBlockProps) {
  const router = useRouter();
  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1400/400`;
  const cor = nucleo.corDestaque || "#4D7CFF";
  const Icon = getNucleoIcon(nucleo.tipo);

  return (
    <div className="w-full mb-2">
      <div>test</div>
    </div>
  );
}
