"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCampos, useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Colecao } from "@/types/colecao";
import { GerenciarCamposModal } from "./GerenciarCamposModal";
import { ColecaoBoard } from "./ColecaoBoard";

interface ColecaoCardProps {
  colecao: Colecao;
  blocoId: string;
  onRefresh?: () => void;
}

export function ColecaoCard({ colecao, blocoId, onRefresh }: ColecaoCardProps) {
  const [gerenciarCamposOpen, setGerenciarCamposOpen] = useState(false);
  const { campos } = useCampos(colecao.id);

  return (
    <>
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{colecao.nome}</CardTitle>
            <Badge variant="outline">{campos.length} campos</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ColecaoBoard
            colecao={colecao}
            blocoId={blocoId}
            onRefresh={onRefresh}
          />
        </CardContent>
      </Card>
      <GerenciarCamposModal
        open={gerenciarCamposOpen}
        onClose={() => setGerenciarCamposOpen(false)}
        colecaoId={colecao.id}
        colecaoNome={colecao.nome}
        onRefresh={onRefresh}
      />
    </>
  );
}
