// components/colecoes/CampoList.tsx
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
import type { Campo } from "@/types/colecao";

export function CampoLists({ colecaoId }: { colecaoId: string }) {
  const { getCampos, createCampo, updateCampo, deleteCampo } = useColecoes();
  const [campos, setCampos] = useState<Campo[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState("texto");

  useEffect(() => {
    getCampos(colecaoId).then((data) => data && setCampos(data));
  }, [colecaoId]);

  const handleAdd = async () => {
    if (!novoNome.trim()) return;
    const campo = await createCampo(colecaoId, novoNome, novoTipo);
    if (campo) {
      setCampos([...campos, campo]);
      setNovoNome("");
    }
  };

  return (
    <div>
      <h3>Campos</h3>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nome do campo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <Select value={novoTipo} onValueChange={setNovoTipo}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="texto">Texto</SelectItem>
            <SelectItem value="numero">Número</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="booleano">Sim/Não</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>
      <ul>
        {campos.map((c) => (
          <li key={c.id}>
            {c.nome} ({c.tipoCampo})
          </li>
        ))}
      </ul>
    </div>
  );
}
