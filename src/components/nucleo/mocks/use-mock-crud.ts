"use client";

import { useState, useEffect, useCallback } from "react";
import { mockCrudService } from "./index";
import type { MockNucleo, MockBloco, MockUser } from "./mock-crud-service";

export function useMockCrud() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [nucleos, setNucleos] = useState<MockNucleo[]>([]);
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar com dados
  useEffect(() => {
    const loadedUsers = mockCrudService.getUsers();
    setUsers(loadedUsers);
    setCurrentUser(loadedUsers[0]); // Usuário padrão: Ana
    setIsInitialized(true);
  }, []);

  // Carregar Nucleos quando usuário mudar
  useEffect(() => {
    if (currentUser) {
      const userNucleos = mockCrudService.getNucleos(currentUser.id);
      setNucleos(userNucleos);
    }
  }, [currentUser]);

  // Resetar para estado inicial
  const resetToInitial = useCallback(() => {
    mockCrudService.resetToInitial();
    const loadedUsers = mockCrudService.getUsers();
    setUsers(loadedUsers);
    setCurrentUser(loadedUsers[0]);
  }, []);

  // CRUD de Nucleos
  const createNucleo = useCallback(
    (data: Partial<MockNucleo>) => {
      if (!currentUser) return null;
      const novoNucleo = mockCrudService.createNucleo({
        ...data,
        user_id: currentUser.id,
      });
      setNucleos((prev) => [...prev, novoNucleo]);
      return novoNucleo;
    },
    [currentUser],
  );

  const updateNucleo = useCallback((id: string, data: Partial<MockNucleo>) => {
    const nucleoAtualizado = mockCrudService.updateNucleo(id, data);
    if (nucleoAtualizado) {
      setNucleos((prev) =>
        prev.map((n) => (n.id === id ? nucleoAtualizado : n)),
      );
    }
    return nucleoAtualizado;
  }, []);

  const deleteNucleo = useCallback((id: string) => {
    const sucesso = mockCrudService.deleteNucleo(id);
    if (sucesso) {
      setNucleos((prev) => prev.filter((n) => n.id !== id));
    }
    return sucesso;
  }, []);

  // CRUD de Blocos
  const getBlocos = useCallback((nucleoId: string) => {
    return mockCrudService.getBlocos(nucleoId);
  }, []);

  const createBloco = useCallback(
    (nucleoId: string, data: Partial<MockBloco>) => {
      return mockCrudService.createBloco(nucleoId, data);
    },
    [],
  );

  const updateBloco = useCallback((id: string, data: Partial<MockBloco>) => {
    return mockCrudService.updateBloco(id, data);
  }, []);

  const deleteBloco = useCallback((id: string) => {
    return mockCrudService.deleteBloco(id);
  }, []);

  const reorderBlocos = useCallback((nucleoId: string, novaOrdem: string[]) => {
    return mockCrudService.reorderBlocos(nucleoId, novaOrdem);
  }, []);

  // Estatísticas
  const getNucleoStats = useCallback((nucleoId: string) => {
    return mockCrudService.getNucleoStats(nucleoId);
  }, []);

  const getUserLevel = useCallback(() => {
    if (!currentUser) return null;
    return mockCrudService.getUserLevel(currentUser.id);
  }, [currentUser]);

  // Trocar usuário (para demonstrar múltiplos usuários)
  const switchUser = useCallback((userId: string) => {
    const user = mockCrudService.getUserById(userId);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return {
    // Estado
    users,
    currentUser,
    nucleos,
    isInitialized,

    // Ações
    resetToInitial,
    switchUser,

    // CRUD Nucleos
    createNucleo,
    updateNucleo,
    deleteNucleo,

    // CRUD Blocos
    getBlocos,
    createBloco,
    updateBloco,
    deleteBloco,
    reorderBlocos,

    // Estatísticas
    getNucleoStats,
    getUserLevel,

    // Acesso direto ao serviço (para casos específicos)
    service: mockCrudService,
  };
}
