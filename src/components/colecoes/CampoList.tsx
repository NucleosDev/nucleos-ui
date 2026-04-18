// components/colecoes/CampoListsExtended.tsx
import { useEffect, useState } from "react";
import { useColecoes } from "@/hooks/useColecoes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Campo, TipoCampo } from "@/types/colecao";

interface CampoListsExtendedProps {
  colecaoId: string;
  onCamposChange?: (campos: Partial<Campo>[]) => void;
  modoCriacao?: boolean;
}

export function CampoLists({
  colecaoId,
  onCamposChange,
  modoCriacao = false,
}: CampoListsExtendedProps) {
  const { getCampos, createCampo, deleteCampo } = useColecoes();
  const [campos, setCampos] = useState<Partial<Campo>[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoCampo>("texto");

  useEffect(() => {
    if (!modoCriacao && colecaoId !== "temp") {
      getCampos(colecaoId).then((data) => data && setCampos(data));
    }
  }, [colecaoId, modoCriacao, getCampos]);

  const handleAdd = async () => {
    if (!novoNome.trim()) return;

    if (modoCriacao) {
      const novoCampo: Partial<Campo> = {
        id: `temp-${Date.now()}`,
        nome: novoNome,
        tipoCampo: novoTipo,
      };

      const novosCampos = [...campos, novoCampo];
      setCampos(novosCampos);
      onCamposChange?.(novosCampos);
      setNovoNome("");
    } else {
      const campo = await createCampo(colecaoId, novoNome, novoTipo);
      if (campo) {
        setCampos([...campos, campo]);
        setNovoNome("");
      }
    }
  };

  const handleRemove = async (id: string | undefined) => {
    if (!id) return; // Se não tem id, não faz nada

    if (modoCriacao) {
      const novosCampos = campos.filter((c) => c.id !== id);
      setCampos(novosCampos);
      onCamposChange?.(novosCampos);
    } else {
      await deleteCampo(colecaoId);
      setCampos(campos.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <h3>{modoCriacao ? "Campos (prévia)" : "Campos"}</h3>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nome do campo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <Select
          value={novoTipo}
          onValueChange={(value: TipoCampo) => setNovoTipo(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="texto">Texto</SelectItem>
            <SelectItem value="numero">Número</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="booleano">Sim/Não</SelectItem>
            <SelectItem value="arquivo">Arquivo</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="relacao">Relação</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>
      <ul className="space-y-2">
        {campos.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {c.nome || "Sem nome"} ({c.tipoCampo})
            </span>
            {modoCriacao && c.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(c.id)}
              >
                Remover
              </Button>
            )}
          </li>
        ))}
      </ul>
      {modoCriacao && campos.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Adicione pelo menos um campo para sua coleção
        </p>
      )}
    </div>
  );
}
