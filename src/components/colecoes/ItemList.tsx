// components/colecoes/ItemList.tsx
import { useEffect, useState } from "react";
import { useColecoes } from "@/hooks/useColecoes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { Campo, Item } from "@/types/colecao";

interface ItemListProps {
  colecaoId: string;
  campos: Campo[];
}

export function ItemList({ colecaoId, campos }: ItemListProps) {
  const { getItens, createItem, updateItem, deleteItem } = useColecoes();
  const [itens, setItens] = useState<Item[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarItens();
  }, [colecaoId]);

  const carregarItens = async () => {
    const data = await getItens(colecaoId);
    if (data) setItens(data);
  };

  const handleSubmit = async () => {
    if (editandoId) {
      // Atualizar item existente
      const itemAtualizado = await updateItem(
        colecaoId,
        editandoId,
        formValues,
      );
      if (itemAtualizado) {
        setItens(itens.map((i) => (i.id === editandoId ? itemAtualizado : i)));
        setEditandoId(null);
      }
    } else {
      // Criar novo item
      const novoItem = await createItem(colecaoId, formValues);
      if (novoItem) {
        setItens([...itens, novoItem]);
      }
    }
    setFormValues({});
  };

  const handleEdit = (item: Item) => {
    setEditandoId(item.id);
    setFormValues(item.valores);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(colecaoId, id);
    setItens(itens.filter((i) => i.id !== id));
  };

  const handleCancel = () => {
    setEditandoId(null);
    setFormValues({});
  };

  // Renderizar campo de formulário baseado no tipo
  const renderCampoForm = (campo: Campo) => {
    const value = formValues[campo.id] || "";

    switch (campo.tipoCampo) {
      case "texto":
        return (
          <Input
            placeholder={campo.nome}
            value={value}
            onChange={(e) =>
              setFormValues({ ...formValues, [campo.id]: e.target.value })
            }
          />
        );
      case "numero":
        return (
          <Input
            type="number"
            placeholder={campo.nome}
            value={value}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [campo.id]: parseFloat(e.target.value),
              })
            }
          />
        );
      case "data":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) =>
              setFormValues({ ...formValues, [campo.id]: e.target.value })
            }
          />
        );
      case "booleano":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) =>
              setFormValues({ ...formValues, [campo.id]: e.target.checked })
            }
          />
        );
      default:
        return (
          <Input
            placeholder={campo.nome}
            value={value}
            onChange={(e) =>
              setFormValues({ ...formValues, [campo.id]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de criação/edição */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">
              {editandoId ? "Editar Item" : "Novo Item"}
            </h3>
            <div className="grid gap-4">
              {campos.map((campo) => (
                <div key={campo.id}>
                  <label className="text-sm font-medium">{campo.nome}</label>
                  {renderCampoForm(campo)}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                <Plus className="mr-2 h-4 w-4" />
                {editandoId ? "Atualizar" : "Adicionar"}
              </Button>
              {editandoId && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      <div className="space-y-2">
        <h3 className="font-semibold">Itens ({itens.length})</h3>
        {itens.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  {campos.map((campo) => (
                    <div key={campo.id}>
                      <span className="text-sm font-medium">
                        {campo.nome}:{" "}
                      </span>
                      <span className="text-sm">
                        {campo.tipoCampo === "booleano"
                          ? item.valores[campo.id]
                            ? "Sim"
                            : "Não"
                          : item.valores[campo.id]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
