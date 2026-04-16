"use client";

import type { Colecao } from "@/types/colecao";

type Props = {
  colecao: Colecao;
  nucleoId: string;
  blocoId: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ColecaoCard({
  colecao,
  nucleoId,
  blocoId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">
          {colecao.nome || "Coleção"}
        </h2>

        <div className="flex gap-2">
          {onEdit && (
            <button onClick={onEdit} className="text-blue-500">
              Editar
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-500">
              Excluir
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        ID: {colecao.id}
      </p>

      <p className="text-sm text-gray-400">
        Núcleo: {nucleoId}
      </p>

      <p className="text-sm text-gray-400">
        Bloco: {blocoId}
      </p>
    </div>
  );
}