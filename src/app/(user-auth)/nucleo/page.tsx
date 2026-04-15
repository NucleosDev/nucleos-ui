// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";
// import { NucleoDetailPage } from "@/components/nucleo/ui/nucleo-main";
// import { NucleoCoreCard } from "@/components/nucleo/ui/nucleo-core-card";
// import { NucleoCardCompact } from "@/components/nucleo/ui/nucleo-card-compact";
// import { NotificacoesTempoReal } from "@/components/nucleo/ui/notification-real-time";
// import {
//   BadgeConquista,
//   ConquistasGrid,
// } from "@/components/nucleo/ui/badge-conquist";
// import { NotificacoesList } from "@/components/nucleo/ui/notifications-list";
// import { nucleosService } from "@/services/index.service";
// import { blocosService } from "@/services/index.service";
// import { gamificacaoService } from "@/services/index.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import {
//   ArrowLeft,
//   Info,
//   Database,
//   LayoutGrid,
//   List,
//   Grid3X3,
//   Bell,
//   Award,
//   Layers,
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
// import { Skeleton } from "@/components/ui/skeleton";
// import { useRouter } from "next/navigation";
// import { UserRoundPlus } from "lucide-react";

// // Tipo para o NucleoGrid (compatível com NucleoWithStats)
// interface NucleoForGrid {
//   id: string;
//   userId: string;
//   nome: string;
//   descricao?: string;
//   tipo: string;
//   corDestaque?: string;
//   imagemCapa?: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string | null;
//   iconId?: string;
//   blocos?: any[];
//   totalBlocos?: number;
//   xpTotal?: number;
//   level?: number;
//   nextLevelXp?: number;
//   conquistasDesbloqueadas?: number;
//   xpHoje?: number;
// }

// // Tipo para o NucleoCoreCard e NucleoCardCompact
// interface NucleoForCard {
//   id: string;
//   nome: string;
//   descricao?: string;
//   tipo: string;
//   corDestaque?: string;
//   imagemCapa?: string;
//   xpTotal?: number;
//   level?: number;
//   nextLevelXp?: number;
//   conquistasDesbloqueadas?: number;
//   xpHoje?: number;
// }

// // Tipo para Bloco
// interface BlocoLocal {
//   id: string;
//   nucleoId: string;
//   tipo: string;
//   titulo?: string;
//   posicao: number;
//   configuracoes: Record<string, any>;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string | null;
// }

// // Tipo para Conquista
// interface ConquistaLocal {
//   id: string;
//   nome: string;
//   descricao: string;
//   iconeUrl: string | null;
//   desbloqueadoEm: string | null;
//   xpRecompensa: number;
//   progresso?: number;
//   desbloqueado?: boolean;
// }

// export default function NucleosPage() {
//   const router = useRouter();
//   const [nucleos, setNucleos] = useState<NucleoForGrid[]>([]);
//   const [nucleosCards, setNucleosCards] = useState<NucleoForCard[]>([]);
//   const [blocos, setBlocos] = useState<BlocoLocal[]>([]);
//   const [conquistas, setConquistas] = useState<ConquistaLocal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingConquistas, setLoadingConquistas] = useState(true);
//   const [modo, setModo] = useState<"lista" | "detalhe">("lista");
//   const [nucleoSelecionadoId, setNucleoSelecionadoId] = useState<string | null>(
//     null,
//   );
//   const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     setMounted(true);
//     carregarNucleos();
//     carregarConquistas();
//   }, []);

//   async function carregarNucleos() {
//     try {
//       setLoading(true);
//       const dados = await nucleosService.listar();

//       // Para o NucleoGrid (com userId e outras propriedades)
//       const dadosGrid: NucleoForGrid[] = dados.map((n: any) => ({
//         id: n.id,
//         userId: n.userId || n.user_id,
//         nome: n.nome,
//         descricao: n.descricao || undefined,
//         tipo: n.tipo || "pessoal",
//         corDestaque: n.corDestaque || n.cor_destaque || "#4D7CFF",
//         imagemCapa: n.imagemCapa || n.imagem_capa,
//         createdAt: n.createdAt || n.created_at,
//         updatedAt: n.updatedAt || n.updated_at,
//         deletedAt: n.deletedAt || n.deleted_at,
//         iconId: n.iconId || n.icon_id,
//         blocos: n.blocos,
//         totalBlocos: n.totalBlocos || n.blocos?.length || 0,
//         xpTotal: n.xpTotal,
//         level: n.level,
//         nextLevelXp: n.nextLevelXp,
//         conquistasDesbloqueadas: n.conquistasDesbloqueadas,
//         xpHoje: n.xpHoje,
//       }));

//       // Para os cards (apenas propriedades necessárias)
//       const dadosCards: NucleoForCard[] = dados.map((n: any) => ({
//         id: n.id,
//         nome: n.nome,
//         descricao: n.descricao || undefined,
//         tipo: n.tipo || "pessoal",
//         corDestaque: n.corDestaque || n.cor_destaque || "#4D7CFF",
//         imagemCapa: n.imagemCapa || n.imagem_capa,
//         xpTotal: n.xpTotal,
//         level: n.level,
//         nextLevelXp: n.nextLevelXp,
//         conquistasDesbloqueadas: n.conquistasDesbloqueadas,
//         xpHoje: n.xpHoje,
//       }));

//       setNucleos(dadosGrid);
//       setNucleosCards(dadosCards);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar núcleos",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function carregarConquistas() {
//     try {
//       setLoadingConquistas(true);
//       const dados = await gamificacaoService.listarConquistas();
//       const dadosNormalizados: ConquistaLocal[] = dados.map((c: any) => ({
//         id: c.id,
//         nome: c.nome,
//         descricao: c.descricao,
//         iconeUrl: c.iconeUrl || c.icone_url,
//         desbloqueadoEm: c.desbloqueadoEm || c.desbloqueado_em,
//         xpRecompensa: c.xpRecompensa || c.xp_recompensa,
//         progresso: c.progresso,
//         desbloqueado: !!c.desbloqueadoEm,
//       }));
//       setConquistas(dadosNormalizados);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar conquistas",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoadingConquistas(false);
//     }
//   }

//   async function carregarBlocos(nucleoId: string) {
//     try {
//       const dados = await blocosService.listarPorNucleo(nucleoId);
//       const dadosNormalizados: BlocoLocal[] = dados.map((b: any) => ({
//         id: b.id,
//         nucleoId: b.nucleoId || b.nucleo_id,
//         tipo: b.tipo,
//         titulo: b.titulo,
//         posicao: b.posicao,
//         configuracoes: b.configuracoes,
//         createdAt: b.createdAt || b.created_at,
//         updatedAt: b.updatedAt || b.updated_at,
//         deletedAt: b.deletedAt || b.deleted_at,
//       }));
//       setBlocos(dadosNormalizados.sort((a, b) => a.posicao - b.posicao));
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar blocos",
//         description: handleApiError(error),
//       });
//     }
//   }

//   async function selecionarNucleo(nucleo: NucleoForGrid | NucleoForCard) {
//     router.prefetch(`/dashboard/nucleos/${nucleo.id}`);

//     setTimeout(() => {
//       router.push(`/nucleos/${nucleo.id}`);
//     }, 100);
//   }

//   // Encontrar o núcleo selecionado para passar para o detalhe
//   const nucleoSelecionado = nucleos.find((n) => n.id === nucleoSelecionadoId);

//   // Evita renderização no servidor para prevenir erro de hidratação
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="border-b sticky top-0 z-40 backdrop-blur-sm w-full">
//           <div className="container mx-auto px-4 py-6 w-full">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <h1 className="text-2xl font-bold">Meus Nucleos</h1>
//                   <Badge
//                     variant="outline"
//                     className="bg-green-500/10 text-green-600 border-green-500/20"
//                   >
//                     <Database className="size-3 mr-1" />
//                   </Badge>
//                 </div>
//                 <p className="text-muted-foreground flex items-center gap-2">
//                   <Info className="size-4" />
//                   Gerencie seus nucleos, blocos e confira seu XP!
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" disabled className="gap-2">
//                   <Bell className="size-4" />
//                   Mostrar Notificações
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <Skeleton key={i} className="h-48" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b sticky top-0 z-40 backdrop-blur-sm w-full">
//         <div className="container mx-auto px-4 py-6 w-full">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <h1 className="text-2xl font-bold">Meus Nucleos</h1>
//                 <Badge
//                   variant="outline"
//                   className="bg-green-500/10 text-green-600 border-green-500/20"
//                 >
//                   <Database className="size-3 mr-1" />
//                 </Badge>
//               </div>
//               <p className="text-muted-foreground flex items-center gap-2">
//                 <Info className="size-4" />
//                 Gerencie seus nucleos, blocos e confira seu XP!
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
//             </div>
//           </div>
//         </div>
//       </div>

//       {mostrarNotificacoes && <NotificacoesTempoReal />}

//       {/* Conteúdo principal */}
//       <div className="container mx-auto px-4 py-8">
//         <Tabs defaultValue="nucleos" className="space-y-8">
//           <TabsList className="grid w-full grid-cols-5 lg:w-auto">
//             <TabsTrigger value="nucleos" className="gap-2">
//               <Layers className="size-4" />
//               <span className="hidden sm:inline">Núcleos</span>
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
//             <TabsTrigger value="social" className="gap-2">
//               <UserRoundPlus className="size-4" />
//               <span className="hidden sm:inline">API</span>
//             </TabsTrigger>
//           </TabsList>

//           {/* ===== ABA 1: Nucleos ===== */}
//           <TabsContent value="nucleos" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Meus Núcleos</CardTitle>
//                 <CardDescription>
//                   Navegação completa entre lista e detalhe de Núcleos com blocos
//                   reais
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {loading ? (
//                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {Array.from({ length: 6 }).map((_, i) => (
//                       <Skeleton key={i} className="h-48" />
//                     ))}
//                   </div>
//                 ) : modo === "lista" ? (
//                   <div className="space-y-6">
//                     <NucleoGrid
//                       nucleos={nucleos}
//                       onNucleoClick={selecionarNucleo}
//                       onAddNucleo={() =>
//                         toast({
//                           title: "Em breve",
//                           description: "Funcionalidade de criar núcleo",
//                         })
//                       }
//                     />
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <Button
//                       variant="ghost"
//                       onClick={() => {
//                         setModo("lista");
//                         setNucleoSelecionadoId(null);
//                       }}
//                       className="mb-2"
//                     >
//                       <ArrowLeft className="size-4 mr-2" />
//                       Voltar para lista
//                     </Button>

//                     {nucleoSelecionado && (
//                       <NucleoDetailPage nucleoId={nucleoSelecionado.id} />
//                     )}
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
//                 {loading ? (
//                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <Skeleton key={i} className="h-48" />
//                     ))}
//                   </div>
//                 ) : nucleosCards.length > 0 ? (
//                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {nucleosCards.slice(0, 3).map((nucleo, index) => (
//                       <NucleoCoreCard
//                         key={nucleo.id}
//                         nucleo={nucleo}
//                         index={index}
//                         onClick={() => selecionarNucleo(nucleo)}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground text-center py-8">
//                     Nenhum núcleo disponível
//                   </p>
//                 )}
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
//                 {loading ? (
//                   <div className="space-y-2 max-w-2xl">
//                     {Array.from({ length: 4 }).map((_, i) => (
//                       <Skeleton key={i} className="h-16" />
//                     ))}
//                   </div>
//                 ) : nucleosCards.length > 0 ? (
//                   <div className="space-y-2 max-w-2xl">
//                     {nucleosCards.slice(0, 4).map((nucleo) => (
//                       <NucleoCardCompact
//                         key={nucleo.id}
//                         nucleo={nucleo}
//                         onClick={() => selecionarNucleo(nucleo)}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground text-center py-8">
//                     Nenhum núcleo disponível
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 3: CONQUISTAS ===== */}
//           <TabsContent value="conquistas" className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award className="size-5 text-yellow-500" />
//                   Conquistas!
//                 </CardTitle>
//                 <CardDescription>
//                   Seja recompensado enquanto cresce!
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {loadingConquistas ? (
//                   <div className="space-y-6">
//                     <div className="flex gap-2 flex-wrap">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Skeleton key={i} className="w-12 h-12 rounded-full" />
//                       ))}
//                     </div>
//                     <Separator />
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                       {Array.from({ length: 3 }).map((_, i) => (
//                         <Skeleton key={i} className="h-32" />
//                       ))}
//                     </div>
//                   </div>
//                 ) : conquistas.length > 0 ? (
//                   <div className="space-y-6">
//                     <div>
//                       <h4 className="text-sm font-medium mb-3">Mini Variant</h4>
//                       <div className="flex gap-2 flex-wrap">
//                         {conquistas.slice(0, 5).map((c) => (
//                           <BadgeConquista
//                             key={c.id}
//                             conquista={c}
//                             variant="mini"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <Separator />
//                     <div>
//                       <h4 className="text-sm font-medium mb-3">Card Variant</h4>
//                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                         {conquistas.slice(0, 3).map((c) => (
//                           <BadgeConquista
//                             key={c.id}
//                             conquista={c}
//                             variant="card"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground text-center py-8">
//                     Em breve.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Grid de Conquistas</CardTitle>
//                 <CardDescription>Em breve.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ConquistasGrid />
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 4: NOTIFICAÇÕES ===== */}
//           <TabsContent value="notificacoes" className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Bell className="size-5 text-primary" />
//                   Notificações
//                 </CardTitle>
//                 <CardDescription>Veja suas interações!</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <NotificacoesList />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Notificações em Tempo Real</CardTitle>
//                 <CardDescription>
//                   Clique no botão no cabeçalho para ativar as notificações!
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="p-4 bg-muted/30 rounded-lg text-center">
//                   <Bell className="size-8 text-muted-foreground mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">Em breve.</p>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="mt-4"
//                     onClick={() => setMostrarNotificacoes(true)}
//                   >
//                     Ativar Notificações
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ===== ABA 5: SOCIAL/API ===== */}
//           <TabsContent value="social" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Veja suas interações!</CardTitle>
//                 <CardDescription>
//                   Todos os componentes estão conectados ao backend real
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
//                   <p className="text-sm text-yellow-700 dark:text-yellow-400">
//                     <strong>Em breve!</strong>
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
