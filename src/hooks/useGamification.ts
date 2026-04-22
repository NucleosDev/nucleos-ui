// import { useState, useEffect, useCallback } from 'react';
// import { UserLevel, Streak, Conquista } from '@/src/types/gamification';

// interface UseGamificationReturn {
//   level: UserLevel | null;
//   streaks: Streak[] | null;
//   conquistas: Conquista[] | null;
//   isLoading: boolean;
//   error: Error | null;
//   addXP: (amount: number, source: string) => Promise<void>;
//   checkStreak: () => Promise<void>;
//   unlockConquista: (conquistaId: string) => Promise<void>;
//   refreshData: () => Promise<void>;
// }

// export const useGamification = (userId: string): UseGamificationReturn => {
//   const [level, setLevel] = useState<UserLevel | null>(null);
//   const [streaks, setStreaks] = useState<Streak[] | null>(null);
//   const [conquistas, setConquistas] = useState<Conquista[] | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);

//   const fetchData = useCallback(async (): Promise<void> => {
//     try {
//       setIsLoading(true);

//       // Simulação - Substituir pela chamada real à API
//       const mockLevel: UserLevel = {
//         nivel: 5,
//         xpAtual: 350,
//         xpProximoNivel: 500,
//         titulo: 'Aprendiz'
//       };

//       const mockStreaks: Streak[] = [
//         { tipo: 'Diário', atual: 12, maximo: 21, ativo: true },
//         { tipo: 'Tarefas', atual: 8, maximo: 15, ativo: true },
//         { tipo: 'Hábitos', atual: 5, maximo: 10, ativo: true },
//         { tipo: 'Nucleos', atual: 3, maximo: 7, ativo: true }
//       ];

//       const mockConquistas: Conquista[] = [
//         {
//           id: '1',
//           nome: 'Primeiro Passo',
//           descricao: 'Complete sua primeira tarefa',
//           icone: '🎯',
//           categoria: 'tarefa',
//           desbloqueada: true,
//           dataDesbloqueio: new Date('2026-04-15')
//         },
//         {
//           id: '2',
//           nome: 'Rei dos Hábitos',
//           descricao: 'Mantenha um hábito por 7 dias',
//           icone: '👑',
//           categoria: 'habito',
//           desbloqueada: false,
//           progresso: 5,
//           meta: 7
//         },
//         {
//           id: '3',
//           nome: 'Construtor',
//           descricao: 'Crie 5 Nucleos',
//           icone: '🏗️',
//           categoria: 'nucleo',
//           desbloqueada: false,
//           progresso: 1,
//           meta: 5
//         },
//         {
//           id: '4',
//           nome: 'Lendário',
//           descricao: 'Alcance o nível 10',
//           icone: '⭐',
//           categoria: 'especial',
//           desbloqueada: false,
//           progresso: 5,
//           meta: 10
//         }
//       ];

//       setLevel(mockLevel);
//       setStreaks(mockStreaks);
//       setConquistas(mockConquistas);
//       setError(null);
//     } catch (err) {
//       setError(err as Error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const addXP = useCallback(async (amount: number, source: string): Promise<void> => {
//     if (!level) return;

//     const newXP = level.xpAtual + amount;
//     let newLevel = level.nivel;
//     let newXpAtual = newXP;
//     let newXpProximo = level.xpProximoNivel;

//     // Verificar level up
//     while (newXpAtual >= newXpProximo) {
//       newLevel++;
//       newXpAtual -= newXpProximo;
//       newXpProximo = Math.floor(newXpProximo * 1.5); // Aumenta dificuldade
//     }

//     const updatedLevel: UserLevel = {
//       ...level,
//       nivel: newLevel,
//       xpAtual: newXpAtual,
//       xpProximoNivel: newXpProximo,
//       titulo: getTituloPorNivel(newLevel)
//     };

//     setLevel(updatedLevel);

//     // Aqui você faria a chamada à API para salvar
//     console.log(`+${amount} XP de ${source}`);
//   }, [level]);

//   const checkStreak = useCallback(async (): Promise<void> => {
//     if (!streaks) return;

//     // Verificar se usuário fez alguma atividade hoje
//     const hoje = new Date().toDateString();
//     const ultimaAtividade = localStorage.getItem(`lastActivity_${userId}`);

//     if (ultimaAtividade !== hoje) {
//       // Atualizar streaks
//       const updatedStreaks = streaks.map(streak => ({
//         ...streak,
//         atual: streak.ativo ? streak.atual + 1 : 1,
//         ativo: true
//       }));

//       setStreaks(updatedStreaks);
//       localStorage.setItem(`lastActivity_${userId}`, hoje);

//       // Bonus XP por manter streak
//       await addXP(5, 'streak');
//     }
//   }, [streaks, userId, addXP]);

//   const unlockConquista = useCallback(async (conquistaId: string): Promise<void> => {
//     if (!conquistas) return;

//     const updatedConquistas = conquistas.map(c =>
//       c.id === conquistaId
//         ? { ...c, desbloqueada: true, dataDesbloqueio: new Date() }
//         : c
//     );

//     setConquistas(updatedConquistas);

//     // Bonus XP por desbloquear conquista
//     await addXP(50, 'conquista');
//   }, [conquistas, addXP]);

//   const refreshData = useCallback(async (): Promise<void> => {
//     await fetchData();
//   }, [fetchData]);

//   return {
//     level,
//     streaks,
//     conquistas,
//     isLoading,
//     error,
//     addXP,
//     checkStreak,
//     unlockConquista,
//     refreshData
//   };
// };

// // Helper function
// function getTituloPorNivel(nivel: number): string {
//   if (nivel < 5) return 'Iniciante';
//   if (nivel < 10) return 'Aprendiz';
//   if (nivel < 15) return 'Dedicado';
//   if (nivel < 20) return 'Mestre';
//   return 'Lendário';
// }

// export const useUserLevel = () => {
//   const { level, isLoading, error } = useGamification('current-user');
//   return { data: level, isLoading, error };
// };

// export const useStreaks = () => {
//   const { streaks, isLoading } = useGamification('current-user');
//   return { data: streaks, isLoading };
// };

// export const useConquistas = () => {
//   const { conquistas, isLoading, error } = useGamification('current-user');
//   return { data: conquistas, isLoading, error };
// };
