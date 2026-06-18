// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/auth";
// import { useRouter } from "next/navigation";
// import { usersService } from "@/services/users.service";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   TrendingUp,
//   Zap,
//   Award,
//   Calendar,
//   Clock,
//   Target,
//   PlusCircle,
//   Timer,
//   CalendarPlus,
//   Bot,
// } from "lucide-react";
// import type { XpLog } from "@/types/logs";
// import type { UserLevel } from "@/types/user";

// // Interface para os dados de estatísticas
// interface DashboardStats {
//   totalXp: number;
//   level: number;
//   currentXp: number;
//   nextLevelXp: number;
//   streak: number;
//   achievements: number;
// }

// export function DashboardContent() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [level, setLevel] = useState<UserLevel | null>(null);
//   const [xpLogs, setXpLogs] = useState<XpLog[]>([]);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalXp: 0,
//     level: 1,
//     currentXp: 0,
//     nextLevelXp: 100,
//     streak: 0,
//     achievements: 0,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Buscar nível do usuário
//         const userLevel = await usersService.getUserLevel();
//         setLevel(userLevel);

//         // Atualizar stats
//         setStats((prev) => ({
//           ...prev,
//           level: userLevel?.level || 1,
//           currentXp: userLevel?.currentXp || 0,
//           nextLevelXp: userLevel?.nextLevelXp || 100,
//           totalXp: userLevel?.totalXpEarned || 0,
//         }));

//         // Buscar logs de XP recentes (últimos 5)
//         const logs = await usersService.getXpLogs();
//         setXpLogs(Array.isArray(logs) ? logs.slice(0, 5) : []);

//         // TODO: Buscar streak e conquistas quando as APIs estiverem prontas
//         // const streakData = await usersService.getUserStreak();
//         // const achievementsData = await usersService.getUserAchievements();
//       } catch (err) {
//         console.error("Erro ao carregar dados do dashboard:", err);
//         setError(
//           "Não foi possível carregar os dados. Tente novamente mais tarde.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Calcular progresso para o próximo nível
//   const levelProgress = {
//     currentLevel: stats.level,
//     nextLevel: stats.level + 1,
//     progress: Math.min(100, (stats.currentXp / stats.nextLevelXp) * 100 || 0),
//     xpNeeded: Math.max(0, stats.nextLevelXp - stats.currentXp),
//   };

//   // Stats cards data
//   const statCards = [
//     {
//       label: "XP Total",
//       value: stats.totalXp.toLocaleString(),
//       icon: TrendingUp,
//       color: "text-green-500",
//       bg: "bg-green-50 dark:bg-green-950/20",
//     },
//     {
//       label: "Nível Atual",
//       value: stats.level.toString(),
//       icon: Target,
//       color: "text-blue-500",
//       bg: "bg-blue-50 dark:bg-blue-950/20",
//     },
//     {
//       label: "Conquistas",
//       value: stats.achievements.toString(),
//       icon: Award,
//       color: "text-purple-500",
//       bg: "bg-purple-50 dark:bg-purple-950/20",
//     },
//     {
//       label: "Dias seguidos",
//       value: stats.streak.toString(),
//       icon: Calendar,
//       color: "text-orange-500",
//       bg: "bg-orange-50 dark:bg-orange-950/20",
//     },
//   ];

//   // Ações rápidas
//   const quickActions = [
//     {
//       label: "Criar novo Nucleo",
//       icon: PlusCircle,
//       onClick: () => router.push("/dashboard/nucleos/criar"),
//       color: "text-primary",
//     },
//     {
//       label: "Iniciar timer",
//       icon: Timer,
//       onClick: () => router.push("/dashboard/timer"),
//       color: "text-yellow-500",
//     },
//     {
//       label: "Adicionar evento",
//       icon: CalendarPlus,
//       onClick: () => router.push("/dashboard/calendario"),
//       color: "text-blue-500",
//     },
//     {
//       label: "Conversar com IA",
//       icon: Bot,
//       onClick: () => router.push("/dashboard/ia"),
//       color: "text-purple-500",
//     },
//   ];

//   // Formatar data relativa
//   const formatRelativeTime = (dateStr?: string) => {
//     if (!dateStr) return "";
//     try {
//       const date = new Date(dateStr);
//       const now = new Date();
//       const diffMs = now.getTime() - date.getTime();
//       const diffMins = Math.floor(diffMs / 60000);
//       const diffHours = Math.floor(diffMs / 3600000);
//       const diffDays = Math.floor(diffMs / 86400000);

//       if (diffMins < 1) return "agora mesmo";
//       if (diffMins < 60)
//         return `há ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
//       if (diffHours < 24)
//         return `há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
//       return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
//     } catch {
//       return "";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-4 w-64" />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <Skeleton key={i} className="h-32 w-full rounded-xl" />
//           ))}
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Skeleton className="lg:col-span-2 h-48 rounded-xl" />
//           <Skeleton className="h-48 rounded-xl" />
//           <Skeleton className="lg:col-span-3 h-64 rounded-xl" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
//         <CardContent className="p-6">
//           <p className="text-red-600 dark:text-red-400">{error}</p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => window.location.reload()}
//           >
//             Tentar novamente
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome section */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//             Olá,{" "}
//             {user?.fullName?.split(" ")[0] ||
//               user?.email?.split("@")[0] ||
//               "Usuário"}
//             ! 👋
//           </h1>
//           <p className="text-muted-foreground">
//             Bem-vindo de volta ao seu dashboard
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             onClick={() => router.push("/dashboard/nucleos/criar")}
//             className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90"
//           >
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Novo Nucleo
//           </Button>
//         </div>
//       </div>

//       {/* Stats grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statCards.map((stat) => {
//           const StatIcon = stat.icon;
//           return (
//             <Card
//               key={stat.label}
//               className="hover:shadow-md transition-shadow"
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       {stat.label}
//                     </p>
//                     <p className="text-2xl font-bold mt-1">{stat.value}</p>
//                   </div>
//                   <div className={cn("p-3 rounded-full", stat.bg)}>
//                     <StatIcon className={`h-5 w-5 ${stat.color}`} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Main content grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Level progress */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-primary" />
//               Progresso para próximo nível
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between text-sm">
//               <span className="font-medium">
//                 Nível {levelProgress.currentLevel}
//               </span>
//               <span className="text-muted-foreground">
//                 Faltam {levelProgress.xpNeeded} XP
//               </span>
//               <span className="font-medium">
//                 Nível {levelProgress.nextLevel}
//               </span>
//             </div>
//             <Progress value={levelProgress.progress} className="h-2" />
//             <div className="flex justify-between text-xs text-muted-foreground">
//               <span>{stats.currentXp} XP</span>
//               <span>{stats.nextLevelXp} XP</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Ações rápidas</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             {quickActions.map((action) => {
//               const ActionIcon = action.icon;
//               return (
//                 <Button
//                   key={action.label}
//                   variant="ghost"
//                   className="w-full justify-start gap-3 hover:bg-accent"
//                   onClick={action.onClick}
//                 >
//                   <ActionIcon className={`h-4 w-4 ${action.color}`} />
//                   <span>{action.label}</span>
//                 </Button>
//               );
//             })}
//           </CardContent>
//         </Card>

//         {/* Recent activity */}
//         <Card className="lg:col-span-3">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-primary" />
//               Atividade recente
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {xpLogs.length === 0 ? (
//               <div className="text-center py-8">
//                 <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-muted-foreground">
//                   Nenhuma atividade recente
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Comece a criar hábitos e tarefas para ganhar XP!
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {xpLogs.map((log, index) => (
//                   <div
//                     key={log.id || log._id || log.uuid || index}
//                     className="flex items-center justify-between py-3 border-b last:border-0"
//                   >
//                     <div>
//                       <p className="font-medium capitalize">
//                         {log.source || "Atividade"}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {formatRelativeTime(log.created_at)}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-yellow-500" />
//                       <span className="text-green-500 font-medium">
//                         +{log.xp_amount} XP
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // Helper function for className merging
// function cn(...classes: (string | undefined | boolean)[]) {
//   return classes.filter(Boolean).join(" ");
// }
