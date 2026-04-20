// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";
// import { NucleoDetailPage } from "@/components/nucleo/ui/nucleo-main";
// import { NucleoCoreCard } from "@/components/nucleo/ui/nucleo-core-card";
// import { NucleoCardCompact } from "@/components/nucleo/ui/nucleo-card-mini";
// import {
//   NotificacaoIOS,
//   NotificacoesContainer,
// } from "@/components/nucleo/ui/notification";
// import { NotificacoesTempoReal } from "@/components/nucleo/ui/notification-real-time";
// import {
//   BadgeConquista,
//   ConquistasGrid,
// } from "@/components/nucleo/ui/badge-conquist";
// import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";
// import { getBlocosPorNucleo } from "@/components/nucleo/mocks/blocos.mock";
// import {
//   ArrowLeft,
//   Info,
//   Database,
//   Eye,
//   LayoutGrid,
//   List,
//   Square,
//   Grid3X3,
//   Bell,
//   Award,
//   Layers,
//   Sparkles,
//   Trophy,
//   Flame,
//   Zap,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// // Mock de conquistas para demonstração
// const mockConquistas = [
//   {
//     id: "1",
//     nome: "Primeiro Passo",
//     descricao: "Complete sua primeira tarefa",
//     icone: <Sparkles className="size-6" />,
//     tier: "bronze" as const,
//     desbloqueada: true,
//     desbloqueadaEm: new Date().toISOString(),
//     xp: 100,
//   },
//   {
//     id: "2",
//     nome: "Em Chamas",
//     descricao: "7 dias consecutivos",
//     icone: <Flame className="size-6" />,
//     tier: "prata" as const,
//     desbloqueada: true,
//     desbloqueadaEm: new Date().toISOString(),
//     xp: 250,
//   },
//   {
//     id: "3",
//     nome: "Mestre dos Estudos",
//     descricao: "Complete 100 tarefas de estudo",
//     icone: <Trophy className="size-6" />,
//     tier: "ouro" as const,
//     progresso: 67,
//     progressoMax: 100,
//     desbloqueada: false,
//     xp: 500,
//   },
//   {
//     id: "4",
//     nome: "Velocista",
//     descricao: "Complete 10 tarefas em um dia",
//     icone: <Zap className="size-6" />,
//     tier: "prata" as const,
//     desbloqueada: false,
//     progresso: 7,
//     progressoMax: 10,
//     xp: 200,
//   },
//   {
//     id: "5",
//     nome: "Lendário",
//     descricao: "Alcance o nível 50",
//     icone: <Award className="size-6" />,
//     tier: "diamante" as const,
//     desbloqueada: false,
//     progresso: 32,
//     progressoMax: 50,
//     xp: 1000,
//   },
// ];

// export default function DemoNucleosPage() {
//   const [isClient, setIsClient] = useState(false);
//   const [modo, setModo] = useState<"lista" | "detalhe">("lista");
//   const [nucleoSelecionado, setNucleoSelecionado] = useState(mockNucleos[0]);
//   const [mostrarNotificacoes, setMostrarNotificacoes] = useState(true);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">
//             Carregando demonstração...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header da demonstração */}
//       <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b sticky top-0 z-40 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <h1 className="text-2xl font-bold">
//                   🧪 Nucleos - Demonstração Completa
//                 </h1>
//                 <Badge
//                   variant="outline"
//                   className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
//                 >
//                   <Database className="size-3 mr-1" />
//                   Dados Mock
//                 </Badge>
//               </div>
//               <p className="text-muted-foreground flex items-center gap-2">
//                 <Info className="size-4" />
//                 Todos os componentes disponíveis para visualização
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
//                 className="gap-2"
//               >
//                 <Bell className="size-4" />
//                 {mostrarNotificacoes ? "Ocultar" : "Mostrar"} Notificações
//               </Button>
//               <Link href="/">
//                 <Button variant="outline">
//                   <ArrowLeft className="size-4 mr-2" />
//                   Voltar
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notificações flutuantes (opcional) */}
//       {mostrarNotificacoes && <NotificacoesTempoReal />}

//       {/* Conteúdo principal */}
//       <div className="container mx-auto px-4 py-8">
//         <Tabs defaultValue="nucleos" className="space-y-8">
//           <TabsList className="grid w-full grid-cols-5 lg:w-auto">
//             <TabsTrigger value="nucleos" className="gap-2">
//               <Layers className="size-4" />
//               <span className="hidden sm:inline">Nucleos</span>
//             </TabsTrigger>
//             <TabsTrigger value="cards" className="gap-2">
//               <LayoutGrid className="size-4" />
//               <span className="hidden sm:inline">Cards</span>
//             </TabsTrigger>
//             <TabsTrigger value="conquistas" className="gap-2">
//               <Award className="size-4" />
//               <span className="hidden sm:inline">Conquistas</span>
//             </TabsTrigger>
//             <TabsTrigger value="notificacoes" className="gap-2">
//               <Bell className="size-4" />
//               <span className="hidden sm:inline">Notificações</span>
//             </TabsTrigger>
//             <TabsTrigger value="api" className="gap-2">
//               <Database className="size-4" />
//               <span className="hidden sm:inline">API</span>
//             </TabsTrigger>
//           </TabsList>

//           {/* ===== ABA 1: Nucleos (Demo principal) ===== */}
//           <TabsContent value="nucleos" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>📦 Demonstração de Nucleos</CardTitle>
//                 <CardDescription>
//                   Navegação completa entre lista e detalhe de Nucleos com blocos
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {modo === "lista" ? (
//                   <div className="space-y-6">
//                     <NucleoGrid
//                       nucleos={mockNucleos}
//                       onNucleoClick={(nucleo) => {
//                         setNucleoSelecionado(nucleo);
//                         setModo("detalhe");
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <Button
//                       variant="ghost"
//                       onClick={() => setModo("lista")}
//                       className="mb-2"
//                     >
//                       <ArrowLeft className="size-4 mr-2" />
//                       Voltar para lista
//                     </Button>

//                     <NucleoDetailPage
//                       nucleo={nucleoSelecionado}
//                       blocos={getBlocosPorNucleo(nucleoSelecionado.id)}
//                       xpTotal={nucleoSelecionado.xpTotal}
//                       nivel={nucleoSelecionado.level}
//                       nextLevelXp={nucleoSelecionado.nextLevelXp}
//                       onAddBloco={(tipo) =>
//                         console.log("🔹 Ação mock: Adicionar bloco", tipo)
//                       }
//                       onUpdateBloco={(id, dados) =>
//                         console.log("🔹 Ação mock: Atualizar bloco", id)
//                       }
//                       onDeleteBloco={(id) =>
//                         console.log("🔹 Ação mock: Deletar bloco", id)
//                       }
//                       onReorderBlocos={(blocos) =>
//                         console.log("🔹 Ação mock: Reordenar blocos")
//                       }
//                     />
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 2: VARIAÇÕES DE CARDS ===== */}
//           <TabsContent value="cards" className="space-y-8">
//             {/* Core Cards */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Grid3X3 className="size-5 text-primary" />
//                   NucleoCoreCard
//                 </CardTitle>
//                 <CardDescription>
//                   Versão principal com estatísticas detalhadas
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                   {mockNucleos.slice(0, 3).map((nucleo, index) => (
//                     <NucleoCoreCard
//                       key={nucleo.id}
//                       nucleo={nucleo}
//                       index={index}
//                       onClick={() =>
//                         console.log("Core card clicado:", nucleo.nome)
//                       }
//                     />
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cards Compactos */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <List className="size-5 text-accent" />
//                   NucleoCardCompact
//                 </CardTitle>
//                 <CardDescription>
//                   Versão ultra compacta para listas densas
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 max-w-2xl">
//                   {mockNucleos.slice(0, 4).map((nucleo) => (
//                     <NucleoCardCompact
//                       key={nucleo.id}
//                       nucleo={nucleo}
//                       onClick={() =>
//                         console.log("Compact card clicado:", nucleo.nome)
//                       }
//                     />
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cards do Grid (NucleoCard) */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <LayoutGrid className="size-5 text-chart-2" />
//                   NucleoCard (Grid)
//                 </CardTitle>
//                 <CardDescription>
//                   Versões: compact, default e detailed
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-3">
//                   <div>
//                     <Badge variant="outline" className="mb-3">
//                       Compact
//                     </Badge>
//                     <NucleoCardCompact
//                       nucleo={mockNucleos[0]}
//                       onClick={() => console.log("Compact")}
//                     />
//                   </div>
//                   <div>
//                     <Badge variant="outline" className="mb-3">
//                       Default
//                     </Badge>
//                     <div className="border rounded-lg p-4 bg-card">
//                       <p className="text-xs text-muted-foreground">
//                         (Usado no NucleoGrid)
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <Badge variant="outline" className="mb-3">
//                       Core
//                     </Badge>
//                     <NucleoCoreCard
//                       nucleo={mockNucleos[0]}
//                       onClick={() => console.log("Core")}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 3: CONQUISTAS ===== */}
//           <TabsContent value="conquistas" className="space-y-8">
//             {/* Badges individuais */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award className="size-5 text-yellow-500" />
//                   Badges Individuais
//                 </CardTitle>
//                 <CardDescription>
//                   Variações mini e card de conquistas
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {/* Mini badges */}
//                   <div>
//                     <h4 className="text-sm font-medium mb-3">Mini Variant</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {mockConquistas.slice(0, 5).map((c) => (
//                         <BadgeConquista
//                           key={c.id}
//                           conquista={c}
//                           variant="mini"
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Card badges */}
//                   <div>
//                     <h4 className="text-sm font-medium mb-3">Card Variant</h4>
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                       {mockConquistas.slice(0, 3).map((c) => (
//                         <BadgeConquista
//                           key={c.id}
//                           conquista={c}
//                           variant="card"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Grid completo de conquistas */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Grid de Conquistas</CardTitle>
//                 <CardDescription>
//                   Visualização completa com filtros por tier
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ConquistasGrid conquistas={mockConquistas} />
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 4: NOTIFICAÇÕES ===== */}
//           <TabsContent value="notificacoes" className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Bell className="size-5 text-primary" />
//                   Notificações iOS Style
//                 </CardTitle>
//                 <CardDescription>
//                   Notificações estilo iOS com diferentes tipos e estados
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   {/* Notificação de Sucesso */}
//                   <NotificacaoIOS
//                     notificacao={{
//                       id: "demo1",
//                       titulo: "Conquista desbloqueada!",
//                       mensagem: "Você completou 7 dias seguidos",
//                       tipo: "conquista",
//                       tempo: "agora",
//                       lida: false,
//                     }}
//                     variant="lista"
//                   />

//                   {/* Notificação de Info */}
//                   <NotificacaoIOS
//                     notificacao={{
//                       id: "demo2",
//                       titulo: "Level Up!",
//                       mensagem: "Nucleo 'Estudos' atingiu nível 12",
//                       tipo: "info",
//                       tempo: "2 min",
//                       lida: true,
//                     }}
//                     variant="lista"
//                   />

//                   {/* Notificação de Aviso */}
//                   <NotificacaoIOS
//                     notificacao={{
//                       id: "demo3",
//                       titulo: "Meta atingida",
//                       mensagem: "Você completou 100% das tarefas de hoje",
//                       tipo: "sucesso",
//                       tempo: "15 min",
//                       lida: false,
//                     }}
//                     variant="lista"
//                   />

//                   {/* Notificação com ação */}
//                   <NotificacaoIOS
//                     notificacao={{
//                       id: "demo4",
//                       titulo: "Novo badge disponível",
//                       mensagem: "Mestre dos Estudos - Tier Ouro",
//                       tipo: "info",
//                       tempo: "1 hora",
//                       lida: true,
//                       acao: {
//                         label: "Ver badge",
//                         onClick: () => console.log("Ver badge"),
//                       },
//                     }}
//                     variant="lista"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Container de notificações flutuantes */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Notificações em Tempo Real</CardTitle>
//                 <CardDescription>
//                   Simulação de notificações que aparecem gradualmente
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative h-[300px] bg-muted/30 rounded-lg overflow-hidden">
//                   <NotificacoesContainer>
//                     <NotificacaoIOS
//                       notificacao={{
//                         id: "rt1",
//                         titulo: "Conquista desbloqueada!",
//                         mensagem: "Você completou 7 dias seguidos",
//                         icone: <Flame className="size-5 text-orange-500" />,
//                         tempo: "agora",
//                         tipo: "conquista",
//                       }}
//                       variant="flutuante"
//                     />
//                     <NotificacaoIOS
//                       notificacao={{
//                         id: "rt2",
//                         titulo: "Level Up!",
//                         mensagem: "Nucleo 'Estudos' atingiu nível 12",
//                         icone: <Zap className="size-5 text-primary" />,
//                         tempo: "2 min",
//                         tipo: "sucesso",
//                       }}
//                       variant="flutuante"
//                     />
//                   </NotificacoesContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 5: EXEMPLO DE API ===== */}
//           <TabsContent value="api" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>📦 Como usar com dados reais de API</CardTitle>
//                 <CardDescription>
//                   Exemplo de integração com os serviços reais
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-card p-4 rounded-lg border">
//                   <pre className="text-sm overflow-x-auto">
//                     <code>{`// Exemplo de página real com API
// "use client";

// import { useEffect, useState } from "react";
// import { nucleosService } from "@/services/nucleos.service";
// import { progressService } from "@/services/progress.service";
// import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";

// export default function MeusNucleosPage() {
//   const [nucleos, setNucleos] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     carregarNucleos();
//   }, []);

//   const carregarNucleos = async () => {
//     try {
//       const dados = await nucleosService.getNucleos();
      
//       const dadosEnriquecidos = await Promise.all(
//         dados.map(async (nucleo) => {
//           const xpLogs = await progressService.getXpHistory({ 
//             nucleoId: nucleo.id 
//           });
//           const xpTotal = xpLogs.reduce((sum, log) => sum + log.xp_amount, 0);
          
//           return {
//             ...nucleo,
//             xpTotal,
//             level: Math.floor(xpTotal / 1000) + 1,
//             nextLevelXp: (Math.floor(xpTotal / 1000) + 1) * 1000
//           };
//         })
//       );
      
//       setNucleos(dadosEnriquecidos);
//     } catch (error) {
//       console.error("Erro:", error);
//     } finally {
//       setCarregando(false);
//     }
//   };

//   if (carregando) return <div>Carregando...</div>;

//   return (
//     &lt;NucleoGrid
//       nucleos={nucleos}
//       onNucleoClick={(nucleo) => router.push(\`/nucleos/\${nucleo.id}\`)}
//     /&gt;
//   );
// }`}</code>
//                   </pre>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mt-6">
//                   <div className="p-4 bg-card rounded-lg border">
//                     <h4 className="font-medium mb-2 flex items-center gap-2">
//                       <Database className="size-4 text-yellow-500" />
//                       Com dados mock (demo)
//                     </h4>
//                     <p className="text-sm text-muted-foreground">
//                       Usa dados locais de exemplo. Ideal para apresentar o
//                       produto e testes.
//                     </p>
//                   </div>
//                   <div className="p-4 bg-card rounded-lg border">
//                     <h4 className="font-medium mb-2 flex items-center gap-2">
//                       <Database className="size-4 text-green-500" />
//                       Com dados reais (API)
//                     </h4>
//                     <p className="text-sm text-muted-foreground">
//                       Conecta com o backend e mostra os dados reais do usuário.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
