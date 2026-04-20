"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  FileText,
  Table,
  Calendar,
  Timer,
  Layout,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BlocoTexto } from "../mocks/blocos.mock/block-text";
import { BlocoColecao } from "../mocks/blocos.mock/block-colection";
import { BlocoCalendario } from "../mocks/blocos.mock/block-calendar";
import { BlocoTimer } from "../mocks/blocos.mock/block-timer";
import { NucleoProgress } from "../ui/nucleo-progress";
import type { Nucleo } from "@/types/nucleo";
import type { BlocoWithData } from "../types/bloco-components.types";

interface NucleoDetailPageProps {
  nucleo: Nucleo;
  blocos: BlocoWithData[];
  xpTotal?: number;
  nivel?: number;
  nextLevelXp?: number;
  onAddBloco?: (tipo: string) => void;
  onUpdateBloco?: (blocoId: string, dados: any) => void;
  onDeleteBloco?: (blocoId: string) => void;
  onReorderBlocos?: (blocos: BlocoWithData[]) => void;
}

export function NucleoDetailPage({
  nucleo,
  blocos: blocosIniciais,
  xpTotal = 0,
  nivel = 1,
  nextLevelXp = 1000,
  onAddBloco,
  onUpdateBloco,
  onDeleteBloco,
  onReorderBlocos,
}: NucleoDetailPageProps) {
  const [blocos, setBlocos] = useState(blocosIniciais);
  const [abaAtiva, setAbaAtiva] = useState("conteudo");

  const handleReorder = (novosBlocos: BlocoWithData[]) => {
    setBlocos(novosBlocos);
    onReorderBlocos?.(novosBlocos);
  };

  const renderBloco = (bloco: BlocoWithData) => {
    switch (bloco.tipo) {
      case "texto":
        return (
          <BlocoTexto
            key={bloco.id}
            bloco={bloco as any}
            onEdit={(conteudo) => onUpdateBloco?.(bloco.id, { conteudo })}
            onDelete={() => onDeleteBloco?.(bloco.id)}
          />
        );
      case "colecao":
        return (
          <BlocoColecao
            key={bloco.id}
            bloco={bloco as any}
            onEdit={(data) => onUpdateBloco?.(bloco.id, data)}
            onDelete={() => onDeleteBloco?.(bloco.id)}
          />
        );
      case "calendario":
        return (
          <BlocoCalendario
            key={bloco.id}
            bloco={bloco as any}
            onEdit={(data) => onUpdateBloco?.(bloco.id, data)}
            onDelete={() => onDeleteBloco?.(bloco.id)}
          />
        );
      case "timer":
        return (
          <BlocoTimer
            key={bloco.id}
            bloco={bloco as any}
            onEdit={(data) => onUpdateBloco?.(bloco.id, data)}
            onDelete={() => onDeleteBloco?.(bloco.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/nucleos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>

            {/* Ícone e título */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="size-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${nucleo.corDestaque || "#4D7CFF"}20`,
                }}
              >
                {nucleo.icon?.icon_url ? (
                  <Image
                    src={nucleo.icon.icon_url}
                    alt={nucleo.nome}
                    width={24}
                    height={24}
                  />
                ) : (
                  <Layout
                    className="size-5"
                    style={{ color: nucleo.corDestaque || "#4D7CFF" }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{nucleo.nome}</h1>
                {nucleo.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {nucleo.descricao}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="ml-2">
                {nucleo.tipo}
              </Badge>
            </div>

            {/* Progresso rápido */}
            <div className="w-48">
              <NucleoProgress
                xpAtual={xpTotal}
                xpMax={nextLevelXp}
                nivel={nivel}
                variant="minimal"
                showDetails={false}
              />
            </div>

            {/* Menu de ações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Nucleo</DropdownMenuLabel>
                <DropdownMenuItem>Editar informações</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuItem>Arquivar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList>
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="conexoes">Conexões</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-6">
        {abaAtiva === "conteudo" && (
          <div className="space-y-6">
            {/* Botão adicionar bloco */}
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 hover:border-[#4D7CFF]/30"
                  >
                    <Plus className="size-4 text-[#4D7CFF]" />
                    Adicionar Bloco
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onAddBloco?.("texto")}>
                    <FileText className="size-4 mr-2 text-[#4D7CFF]" />
                    Texto
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddBloco?.("colecao")}>
                    <Table className="size-4 mr-2 text-[#00C9A7]" />
                    Coleção
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddBloco?.("calendario")}>
                    <Calendar className="size-4 mr-2 text-[#2EBD59]" />
                    Calendário
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddBloco?.("timer")}>
                    <Timer className="size-4 mr-2 text-[#0077BE]" />
                    Timer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Lista de blocos (reordenável) */}
            <Reorder.Group
              axis="y"
              values={blocos}
              onReorder={handleReorder}
              className="space-y-4"
            >
              {blocos.map((bloco) => (
                <Reorder.Item key={bloco.id} value={bloco}>
                  {renderBloco(bloco)}
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {blocos.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg border-[#4D7CFF]/20">
                <p className="text-muted-foreground">
                  Este Nucleo ainda não tem blocos. Adicione um para começar!
                </p>
              </div>
            )}
          </div>
        )}

        {abaAtiva === "analytics" && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Analytics em breve...</p>
          </div>
        )}

        {abaAtiva === "conexoes" && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Conexões em breve...</p>
          </div>
        )}
      </div>
    </div>
  );
}
