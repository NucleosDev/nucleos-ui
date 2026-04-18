"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColecoes } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Campo, TipoCampo } from "@/types/colecao";
import { Trash2, Loader2 } from "lucide-react";

interface GerenciarCamposModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  colecaoNome: string;
}

export function GerenciarCamposModal({
  open,
  onClose,
  colecaoId,
  colecaoNome,
}: GerenciarCamposModalProps) {
  const { getCampos, createCampo, deleteCampo, loading } = useColecoes();
  const [campos, setCampos] = useState<Campo[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoCampo>("texto");
  const [carregando, setCarregando] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  const carregarCampos = async () => {
    setCarregando(true);
    const dados = await getCampos(colecaoId);
    if (dados) setCampos(dados);
    setCarregando(false);
  };

  useEffect(() => {
    if (open && colecaoId) {
      carregarCampos();
    }
  }, [open, colecaoId]);

  const handleAdicionar = async () => {
    if (!novoNome.trim()) return;
    setAdicionando(true);
    const novoCampo = await createCampo(colecaoId, novoNome.trim(), novoTipo);
    if (novoCampo) {
      setCampos([...campos, novoCampo]);
      setNovoNome("");
      toast({ title: "Campo adicionado!" });
    } else {
      toast({ title: "Erro ao adicionar campo", variant: "destructive" });
    }
    setAdicionando(false);
  };

  const handleRemover = async (campoId: string) => {
    if (
      !confirm("Remover este campo? Todos os dados associados serão perdidos.")
    )
      return;
    setRemovendoId(campoId);
    const sucesso = await deleteCampo(campoId);
    if (sucesso) {
      setCampos(campos.filter((c) => c.id !== campoId));
      toast({ title: "Campo removido" });
    } else {
      toast({ title: "Erro ao remover campo", variant: "destructive" });
    }
    setRemovendoId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar campos de "{colecaoNome}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do campo"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              disabled={adicionando}
            />
            <Select
              value={novoTipo}
              onValueChange={(v) => setNovoTipo(v as TipoCampo)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto">Texto</SelectItem>
                <SelectItem value="numero">Número</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="booleano">Sim/Não</SelectItem>
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAdicionar}
              disabled={adicionando || !novoNome.trim()}
            >
              {adicionando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Adicionar"
              )}
            </Button>
          </div>

          {carregando ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : campos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum campo definido. Adicione pelo menos um.
            </p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {campos.map((campo) => (
                <li
                  key={campo.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{campo.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {campo.tipoCampo}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemover(campo.id)}
                    disabled={removendoId === campo.id}
                  >
                    {removendoId === campo.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
