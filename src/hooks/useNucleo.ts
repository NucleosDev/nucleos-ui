"use client";

import { useState, useEffect, useCallback } from "react";
import { nucleosService } from "@/services/nucleos.service";
import { blocosService } from "@/services/blocos.service";
import type {
  Nucleo,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/nucleo";
import type { Bloco } from "@/types/bloco";

export function useNucleos() {
  const [nucleos, setNucleos] = useState<Nucleo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await nucleosService.getNucleos();
      setNucleos(data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erro ao carregar núcleos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (payload: CreateNucleoPayload) => {
    const novo = await nucleosService.create(payload);
    setNucleos((prev) => [novo, ...prev]);
    return novo;
  }, []);

  const update = useCallback(
    async (id: string, payload: UpdateNucleoPayload) => {
      const updated = await nucleosService.update(id, payload);
      setNucleos((prev) => prev.map((n) => (n.id === id ? updated : n)));
      return updated;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await nucleosService.delete(id);
    setNucleos((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    nucleos,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
  };
}
