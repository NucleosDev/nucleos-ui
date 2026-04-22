// // src/types/gamification.ts

// export interface UserProfile {
//   nome: string;
//   nivel: number;
//   streakDias: number;
//   avatar?: string;
// }

// export interface UserGamificationData {
//   userId: string;
//   nivel: number;
//   xpAtual: number;
//   xpProximoNivel: number;
//   streakAtual: number;
//   streakMelhor: number;
//   energiaAtual: number;
//   energiaMaxima: number;
//   conquistasTotal: number;
//   fezTarefaHoje: boolean;
//   ultimaAtualizacao: Date;
// }

// export interface NucleoData {
//   id: string;
//   nome: string;
//   tipo: 'pessoal' | 'trabalho' | 'estudo';
//   nivel: number;
//   progresso: number;
//   criadoEm: Date;
// }

// export interface StreakInsightProps {
//   dias: number;
//   className?: string;
// }

// export interface NucleoCardProps {
//   nucleo: NucleoData;
//   onClick?: () => void;
//   className?: string;
// }

// export interface UserHeaderProps {
//   profile: UserProfile;
//   className?: string;
// }

// export interface XPBarProps {
//   xpAtual: number;
//   xpProximo: number;
//   nivel: number;
//   className?: string;
// }

// // src/hooks/useGamification.ts

// import { useState, useEffect, useCallback } from 'react';
// import { UserGamificationData } from '@/types/gamification';

// interface UseGamificationReturn {
//   userData: UserGamificationData | null;
//   xpPercentage: number;
//   isLoading: boolean;
//   atualizarStreak: () => Promise<void>;
//   completarTarefa: (tarefaId: string) => Promise<void>;
// }

// export const useGamification = (userId: string): UseGamificationReturn => {
//   const [userData, setUserData] = useState<UserGamificationData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const carregarDados = async (): Promise<void> => {
//       try {
//         // Simulação - Substituir pela chamada real à API
//         const mockData: UserGamificationData = {
//           userId,
//           nivel: 5,
//           xpAtual: 350,
//           xpProximoNivel: 500,
//           streakAtual: 12,
//           streakMelhor: 21,
//           energiaAtual: 85,
//           energiaMaxima: 100,
//           conquistasTotal: 8,
//           fezTarefaHoje: true,
//           ultimaAtualizacao: new Date()
//         };

//         setUserData(mockData);
//       } catch (error) {
//         console.error('Erro ao carregar dados de gamificação:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     carregarDados();
//   }, [userId]);

//   const xpPercentage: number = userData
//     ? Math.min((userData.xpAtual / userData.xpProximoNivel) * 100, 100)
//     : 0;

//   const atualizarStreak = useCallback(async (): Promise<void> => {
//     if (!userData) return;

//     setUserData(prev => prev ? {
//       ...prev,
//       streakAtual: prev.streakAtual + 1,
//       streakMelhor: Math.max(prev.streakMelhor, prev.streakAtual + 1)
//     } : null);
//   }, [userData]);

//   const completarTarefa = useCallback(async (tarefaId: string): Promise<void> => {
//     if (!userData) return;

//     const xpGanho: number = 10;
//     const novoXP: number = userData.xpAtual + xpGanho;

//     setUserData(prev => prev ? {
//       ...prev,
//       xpAtual: novoXP,
//       energiaAtual: Math.max(prev.energiaAtual - 5, 0),
//       fezTarefaHoje: true
//     } : null);
//   }, [userData]);

//   return {
//     userData,
//     xpPercentage,
//     isLoading,
//     atualizarStreak,
//     completarTarefa
//   };
// };

// // src/components/gamificacao/UserHeader.tsx

// import React from 'react';
// import { UserHeaderProps } from '@/types/gamification';

// export const UserHeader: React.FC<UserHeaderProps> = ({
//   profile,
//   className = ''
// }): JSX.Element => {
//   return (
//     <div className={`user-header ${className}`}>
//       <h1 className="user-name">
//         {profile.nome}
//       </h1>
//       <div className="user-stats">
//         <span className="user-stat">
//           <span className="stat-icon">📊</span>
//           Nv.{profile.nivel}
//         </span>
//         <span className="user-stat">
//           <span className="stat-icon">🔥</span>
//           {profile.streakDias}d
//         </span>
//       </div>
//     </div>
//   );
// };
