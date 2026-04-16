// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Plus,
//   Search,
//   Filter,
//   Calendar,
//   Trophy,
//   Flame,
//   Zap,
//   Target,
//   TrendingUp,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   Sparkles,
//   LayoutGrid,
//   List,
//   Star,
//   Award,
//   Crown,
//   Bell,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";
// import { NucleoCoreCard } from "@/components/nucleo/ui/nucleo-core-card";
// import { NucleoCardCompact } from "@/components/nucleo/ui/nucleo-card-mini";
// import { NucleoProgress } from "@/components/nucleo/ui/nucleo-progress";
// import { NotificacaoIOS } from "@/components/nucleo/ui/notification";
// import { BadgeConquista } from "@/components/nucleo/ui/badge-conquist";
// import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";
// import { CheckCheck } from "lucide-react";
// import { cn } from "@/utils";
// // Mock do usuário
// const usuario = {
//   nome: "Ana Silva",
//   email: "ana@exemplo.com",
//   avatar: "/placeholder-user.jpg",
//   nivel: 24,
//   xpAtual: 8450,
//   xpProximo: 10000,
//   streak: 21,
//   conquistas: 47,
//   tempoFoco: "127h",
// };

// // Mock de atividades recentes
// const atividadesRecentes = [
//   {
//     id: "1",
//     tipo: "conquista",
//     titulo: "Streak de 7 dias",
//     nucleo: "Fitness",
//     xp: 150,
//     icone: Flame,
//     cor: "#FF8C42",
//     tempo: "há 2 horas",
//   },
//   {
//     id: "2",
//     tipo: "tarefa",
//     titulo: "Estudar React Hooks",
//     nucleo: "Estudos",
//     xp: 50,
//     icone: CheckCircle2,
//     cor: "#4D7CFF",
//     tempo: "há 3 horas",
//   },
//   {
//     id: "3",
//     tipo: "nivel",
//     titulo: "Subiu para nível 24",
//     nucleo: "Geral",
//     xp: 500,
//     icone: Crown,
//     cor: "#FFD700",
//     tempo: "há 5 horas",
//   },
//   {
//     id: "4",
//     tipo: "tarefa",
//     titulo: "Revisão de TypeScript",
//     nucleo: "Estudos",
//     xp: 75,
//     icone: CheckCircle2,
//     cor: "#4D7CFF",
//     tempo: "há 1 dia",
//   },
// ];

// // Mock de tarefas do dia
// const tarefasHoje = [
//   {
//     id: "1",
//     titulo: "Estudar React - Capítulo 5",
//     nucleo: "Estudos",
//     xp: 100,
//     concluida: false,
//     prioridade: "alta",
//     prazo: "18:00",
//   },
//   {
//     id: "2",
//     titulo: "Treino de musculação",
//     nucleo: "Fitness",
//     xp: 75,
//     concluida: true,
//     prioridade: "media",
//     prazo: "10:00",
//   },
//   {
//     id: "3",
//     titulo: "Revisar orçamento mensal",
//     nucleo: "Finanças",
//     xp: 50,
//     concluida: false,
//     prioridade: "baixa",
//     prazo: "22:00",
//   },
//   {
//     id: "4",
//     titulo: "Ler artigo sobre Next.js",
//     nucleo: "Estudos",
//     xp: 30,
//     concluida: true,
//     prioridade: "baixa",
//     prazo: "15:00",
//   },
//   {
//     id: "5",
//     titulo: "Meditação guiada",
//     nucleo: "Bem-estar",
//     xp: 40,
//     concluida: false,
//     prioridade: "media",
//     prazo: "20:00",
//   },
// ];

// // Mock de conquistas recentes
// const conquistasRecentes = [
//   {
//     id: "1",
//     nome: "Em Chamas",
//     descricao: "7 dias consecutivos",
//     icone: <Flame className="size-5 text-orange-500" />,
//     tier: "prata" as const,
//     desbloqueada: true,
//     xp: 250,
//   },
//   {
//     id: "2",
//     nome: "Centenário",
//     descricao: "100 tarefas completadas",
//     icone: <Target className="size-5 text-primary" />,
//     tier: "ouro" as const,
//     desbloqueada: true,
//     xp: 500,
//   },
//   {
//     id: "3",
//     nome: "Mestre dos Estudos",
//     descricao: "50 tarefas de estudo",
//     icone: <Star className="size-5 text-yellow-500" />,
//     tier: "ouro" as const,
//     desbloqueada: false,
//     progresso: 42,
//     progressoMax: 50,
//   },
// ];

// export default function DashboardPage() {
//   const [visualizacao, setVisualizacao] = useState<"grid" | "lista">("grid");
//   const [filtro, setFiltro] = useState("todos");

//   const tarefasConcluidas = tarefasHoje.filter((t) => t.concluida).length;
//   const progressoHoje = (tarefasConcluidas / tarefasHoje.length) * 100;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header do Dashboard */}
//       <header className="top-0 border-b border-border/50 bg-background/80 backdrop-blur-lg">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {/* <Link href="/dashboard" className="flex items-center gap-2">
//                 <Image src="/icon.svg" alt="Nucleos" width={32} height={32} />
//                 <span className="text-xl font-semibold">Nucleos</span>
//               </Link> */}
//               <Badge
//                 variant="outline"
//                 className="hidden md:flex gap-1 border-[#4D7CFF]/30 text-[#4D7CFF]"
//               >
//                 <Sparkles className="size-3" />
//                 Dashboard
//               </Badge>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="relative hidden md:block">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
//                 <Input placeholder="Buscar..." className="pl-9 w-64" />
//               </div>

//               <Button variant="outline" size="icon" className="relative">
//                 <div className="absolute -top-1 -right-1 size-2 rounded-full bg-[#4D7CFF]" />
//                 <Bell className="size-4" />
//               </Button>

//               <Avatar className="cursor-pointer">
//                 <AvatarImage src={usuario.avatar} />
//                 <AvatarFallback>AS</AvatarFallback>
//               </Avatar>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Conteúdo Principal */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Boas-vindas */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Olá, usuário! 👋</h1>
//           <p className="text-muted-foreground mt-1">
//             Aqui está seu resumo de hoje. Continue evoluindo!
//           </p>
//         </div>

//         {/* Cards de Estatísticas */}
//         <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
//           <Card className="border-l-4 border-l-[#4D7CFF]">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Nível Atual</p>
//                   <p className="text-2xl font-bold">{usuario.nivel}</p>
//                 </div>
//                 <div className="size-10 rounded-full bg-[#4D7CFF]/10 flex items-center justify-center">
//                   <TrendingUp className="size-5 text-[#4D7CFF]" />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <div className="flex justify-between text-xs mb-1">
//                   <span>{usuario.xpAtual} XP</span>
//                   <span>{usuario.xpProximo} XP</span>
//                 </div>
//                 <Progress
//                   value={(usuario.xpAtual / usuario.xpProximo) * 100}
//                   className="h-1"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-l-4 border-l-[#FF8C42]">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Streak</p>
//                   <p className="text-2xl font-bold">{usuario.streak} dias</p>
//                 </div>
//                 <div className="size-10 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
//                   <Flame className="size-5 text-[#FF8C42]" />
//                 </div>
//               </div>
//               <p className="text-xs text-muted-foreground mt-2">
//                 🔥 A 3 dias do seu recorde
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-l-4 border-l-[#FFD700]">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Conquistas</p>
//                   <p className="text-2xl font-bold">{usuario.conquistas}</p>
//                 </div>
//                 <div className="size-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
//                   <Trophy className="size-5 text-[#FFD700]" />
//                 </div>
//               </div>
//               <p className="text-xs text-muted-foreground mt-2">
//                 🏆 3 novas essa semana
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-l-4 border-l-[#00C9A7]">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Tempo Focado</p>
//                   <p className="text-2xl font-bold">{usuario.tempoFoco}</p>
//                 </div>
//                 <div className="size-10 rounded-full bg-[#00C9A7]/10 flex items-center justify-center">
//                   <Clock className="size-5 text-[#00C9A7]" />
//                 </div>
//               </div>
//               <p className="text-xs text-muted-foreground mt-2">
//                 ⏱️ +12h que ontem
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Grid Principal */}
//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Coluna Esquerda (2/3) */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Progresso do Dia */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center justify-between">
//                   <span>Progresso de Hoje</span>
//                   <Badge variant="outline" className="gap-1">
//                     <CheckCircle2 className="size-3 text-[#00C9A7]" />
//                     {tarefasConcluidas}/{tarefasHoje.length} concluídas
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>{Math.round(progressoHoje)}% completo</span>
//                     <span className="text-muted-foreground">Meta: 80%</span>
//                   </div>
//                   <Progress value={progressoHoje} className="h-2" />
//                 </div>

//                 <div className="space-y-2">
//                   {tarefasHoje.map((tarefa) => (
//                     <div
//                       key={tarefa.id}
//                       className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
//                         tarefa.concluida
//                           ? "bg-muted/30 border-muted"
//                           : "bg-card hover:border-[#4D7CFF]/30"
//                       }`}
//                     >
//                       <button
//                         className={`flex size-5 items-center justify-center rounded-full border-2 transition-colors ${
//                           tarefa.concluida
//                             ? "bg-[#00C9A7] border-[#00C9A7]"
//                             : "border-muted-foreground/30 hover:border-[#4D7CFF]"
//                         }`}
//                       >
//                         {tarefa.concluida && (
//                           <CheckCheck className="size-3 text-white" />
//                         )}
//                       </button>

//                       <div className="flex-1">
//                         <p
//                           className={`text-sm font-medium ${tarefa.concluida ? "line-through text-muted-foreground" : ""}`}
//                         >
//                           {tarefa.titulo}
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge
//                             variant="outline"
//                             className="text-[10px] px-1.5 py-0 h-5"
//                           >
//                             {tarefa.nucleo}
//                           </Badge>
//                           <span className="text-xs text-muted-foreground">
//                             {tarefa.prazo}
//                           </span>
//                         </div>
//                       </div>

//                       <span className="text-xs font-medium text-[#4D7CFF]">
//                         +{tarefa.xp} XP
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 <Button variant="outline" className="w-full mt-4 gap-2">
//                   <Plus className="size-4" />
//                   Adicionar tarefa
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Meus Nucleos */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg">Meus Nucleos</CardTitle>
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm" className="gap-2">
//                       <Filter className="size-4" />
//                       Filtrar
//                     </Button>
//                     <div className="flex items-center gap-1 border rounded-lg p-1">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className={cn(
//                           "size-7",
//                           visualizacao === "grid" && "bg-muted",
//                         )}
//                         onClick={() => setVisualizacao("grid")}
//                       >
//                         <LayoutGrid className="size-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className={cn(
//                           "size-7",
//                           visualizacao === "lista" && "bg-muted",
//                         )}
//                         onClick={() => setVisualizacao("lista")}
//                       >
//                         <List className="size-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {visualizacao === "grid" ? (
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     {mockNucleos.slice(0, 4).map((nucleo) => (
//                       <NucleoCardCompact
//                         key={nucleo.id}
//                         nucleo={nucleo}
//                         onClick={() => console.log("Abrir", nucleo.nome)}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {mockNucleos.slice(0, 4).map((nucleo) => (
//                       <NucleoCardCompact
//                         key={nucleo.id}
//                         nucleo={nucleo}
//                         onClick={() => console.log("Abrir", nucleo.nome)}
//                       />
//                     ))}
//                   </div>
//                 )}
//                 <Button
//                   variant="ghost"
//                   className="w-full mt-4 gap-2 text-muted-foreground"
//                 >
//                   <Plus className="size-4" />
//                   Criar novo núcleo
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Coluna Direita (1/3) */}
//           <div className="space-y-6">
//             {/* Perfil Rápido */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <Avatar className="size-16">
//                     <AvatarImage src={usuario.avatar} />
//                     <AvatarFallback>AS</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h3 className="font-semibold">{usuario.nome}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {usuario.email}
//                     </p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <Badge variant="outline" className="gap-1">
//                         <Crown className="size-3 text-[#FFD700]" />
//                         Nv. {usuario.nivel}
//                       </Badge>
//                       <Badge variant="outline" className="gap-1">
//                         <Flame className="size-3 text-[#FF8C42]" />
//                         {usuario.streak} dias
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Atividades Recentes */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Atividades Recentes</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {atividadesRecentes.map((atividade) => (
//                   <div key={atividade.id} className="flex items-start gap-3">
//                     <div
//                       className="flex size-8 items-center justify-center rounded-lg"
//                       style={{ backgroundColor: `${atividade.cor}15` }}
//                     >
//                       <atividade.icone
//                         className="size-4"
//                         style={{ color: atividade.cor }}
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{atividade.titulo}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {atividade.nucleo} • {atividade.tempo}
//                       </p>
//                     </div>
//                     <span className="text-xs font-medium text-[#4D7CFF]">
//                       +{atividade.xp} XP
//                     </span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Próximas Conquistas */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Próximas Conquistas</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {conquistasRecentes.map((conquista) => (
//                   <BadgeConquista
//                     key={conquista.id}
//                     conquista={conquista}
//                     variant="mini"
//                   />
//                 ))}
//                 <Link href="/badges">
//                   <Button variant="link" className="w-full text-sm">
//                     Ver todas as conquistas
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Dica do Dia */}
//             <Card className="bg-gradient-to-br from-[#4D7CFF]/10 to-[#00C9A7]/10 border-0">
//               <CardContent className="p-6">
//                 <div className="flex items-start gap-3">
//                   <div className="size-8 rounded-full bg-[#4D7CFF] flex items-center justify-center">
//                     <Sparkles className="size-4 text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Dica do Dia</h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Quebre tarefas grandes em pequenas metas diárias. Você
//                       ganha XP a cada pequena vitória! 🎯
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
