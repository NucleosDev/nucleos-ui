import { useEffect, useState } from "react";
import { useColecoes } from "@/hooks/useColecoes";
import type { Item, Campo } from "@/types/colecao";

export function ItemList({
  colecaoId,
  campos,
}: {
  colecaoId: string;
  campos: Campo[];
}) {
  const { getItens, createItem } = useColecoes();
  const [itens, setItens] = useState<Item[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    getItens(colecaoId).then((data) => data && setItens(data));
  }, [colecaoId]);

  const handleSubmit = async () => {
    const item = await createItem(colecaoId, formValues);
    if (item) {
      setItens([...itens, item]);
      setFormValues({});
    }
  };

  return (
    <div>
      <h3>Itens</h3>
      <div>
        {campos.map((campo) => (
          <div key={campo.id}>
            <label>{campo.nome}</label>
            <input
              type={campo.tipoCampo === "numero" ? "number" : "text"}
              value={formValues[campo.id] || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, [campo.id]: e.target.value })
              }
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Adicionar Item</button>
      </div>
      <ul>
        {itens.map((item) => (
          <li key={item.id}>{JSON.stringify(item.valores)}</li>
        ))}
      </ul>
    </div>
  );
}
