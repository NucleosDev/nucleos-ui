// // src/components/blocos/BlocoFullPage.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   Layers,
//   Loader2,
//   Plus,
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   Copy,
//   Check,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";
// import { CanvasEditor } from "@/components/canvas/";
// import { BlockRenderer } from "@/components/canvas/BlockRenderer";
// import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import type { Bloco, CreateBlocoPayload } from "@/types/bloco";
// import type { CanvasBlock } from "@/components/canvas/types";

// interface BlocoFullPageProps {
//   bloco: Bloco;
//   nucleo: {
//     id: string;
//     nome: string;
//     imagemCapa?: string;
//     corDestaque?: string;
//   };
//   isLoading?: boolean;
//   onUpdateBloco?: (id: string, data: Partial<Bloco>) => Promise<void>;
//   onDeleteBloco?: (id: string) => Promise<void>;
//   onDuplicateBloco?: (bloco: Bloco) => Promise<void>;
//   onCreateSubBloco?: (payload: CreateBlocoPayload) => Promise<void>;
//   subBlocos?: Bloco[];
//   onUpdateSubBloco?: (id: string, data: Partial<Bloco>) => Promise<void>;
//   onDeleteSubBloco?: (id: string) => Promise<void>;
// }

// export function BlocoFullPage({
//   bloco,
//   nucleo,
//   isLoading = false,
//   onUpdateBloco,
//   onDeleteBloco,
//   onDuplicateBloco,
//   onCreateSubBloco,
//   subBlocos = [],
//   onUpdateSubBloco,
//   onDeleteSubBloco,
// }: BlocoFullPageProps) {
//   const router = useRouter();
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [editedTitle, setEditedTitle] = useState(bloco.titulo || "");
//   const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([]);
//   const [modalCriarAberto, setModalCriarAberto] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Carregar canvas blocks do bloco (se existir)
//   useEffect(() => {
//     if (bloco.configuracoes?.canvasBlocks) {
//       setCanvasBlocks(bloco.configuracoes.canvasBlocks);
//     } else {
//       // Blocos iniciais vazios
//       setCanvasBlocks([{ id: "welcome", type: "paragraph", content: "" }]);
//     }
//   }, [bloco]);

//   const handleSaveTitle = async () => {
//     if (!onUpdateBloco) return;
//     setIsSubmitting(true);
//     try {
//       await onUpdateBloco(bloco.id, { titulo: editedTitle.trim() });
//       setIsEditingTitle(false);
//       toast({ title: "Título atualizado!" });
//     } catch {
//       toast({ title: "Erro ao atualizar", variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCanvasChange = (blocks: CanvasBlock[]) => {
//     setCanvasBlocks(blocks);
//     // Salvar automaticamente (debounce)
//     if (onUpdateBloco) {
//       onUpdateBloco(bloco.id, {
//         configuracoes: { ...bloco.configuracoes, canvasBlocks: blocks },
//       });
//     }
//   };

//   const handleDeleteBloco = async () => {
//     if (!onDeleteBloco) return;
//     if (
//       !confirm(
//         "Tem certeza que deseja excluir este bloco? Esta ação não pode ser desfeita.",
//       )
//     )
//       return;
//     try {
//       await onDeleteBloco(bloco.id);
//       toast({ title: "Bloco excluído!" });
//       router.back();
//     } catch {
//       toast({ title: "Erro ao excluir", variant: "destructive" });
//     }
//   };

//   const handleDuplicateBloco = async () => {
//     if (!onDuplicateBloco) return;
//     try {
//       await onDuplicateBloco(bloco);
//       toast({ title: "Bloco duplicado!" });
//     } catch {
//       toast({ title: "Erro ao duplicar", variant: "destructive" });
//     }
//   };

//   const handleCreateSubBloco = async (payload: CreateBlocoPayload) => {
//     if (!onCreateSubBloco) return;
//     try {
//       await onCreateSubBloco(payload);
//       toast({ title: "Sub-bloco criado!" });
//       setModalCriarAberto(false);
//     } catch {
//       toast({ title: "Erro ao criar sub-bloco", variant: "destructive" });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   const randomImageUrl = `https://picsum.photos/seed/${nucleo.id}/1200/400`;
//   const capaUrl = nucleo.imagemCapa || randomImageUrl;
//   const corDestaque = nucleo.corDestaque || "#6366f1";

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Banner */}
//       <div className="relative w-full h-[280px] overflow-hidden">
//         <Image
//           src={capaUrl}
//           alt={nucleo.nome}
//           fill
//           className="object-cover scale-105"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

//         {/* Onda decorativa */}
//         <div className="absolute bottom-0 left-0 w-full">
//           <svg
//             viewBox="0 0 500 100"
//             preserveAspectRatio="none"
//             className="w-full h-[60px]"
//             fill="hsl(var(--background))"
//           >
//             <path
//               d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z"
//               fill="currentColor"
//             />
//           </svg>
//         </div>

//         {/* Botão voltar */}
//         <Button
//           variant="ghost"
//           className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm text-white hover:bg-background/40"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Voltar
//         </Button>
//       </div>

//       <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
//         {/* Ícone flutuante */}
//         <div className="relative -mt-12 mb-6 z-30">
//           <div
//             className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-background"
//             style={{ backgroundColor: corDestaque }}
//           >
//             <Layers className="w-8 h-8" />
//           </div>
//         </div>

//         {/* Cabeçalho com título e ações */}
//         <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
//           <div className="flex-1">
//             {isEditingTitle ? (
//               <div className="flex items-center gap-2">
//                 <Input
//                   value={editedTitle}
//                   onChange={(e) => setEditedTitle(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleSaveTitle();
//                     if (e.key === "Escape") {
//                       setIsEditingTitle(false);
//                       setEditedTitle(bloco.titulo || "");
//                     }
//                   }}
//                   className="text-2xl font-bold h-auto py-2"
//                   autoFocus
//                 />
//                 <Button
//                   size="sm"
//                   onClick={handleSaveTitle}
//                   disabled={isSubmitting}
//                 >
//                   <Check className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => {
//                     setIsEditingTitle(false);
//                     setEditedTitle(bloco.titulo || "");
//                   }}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//                 {bloco.titulo || `Bloco ${bloco.tipo}`}
//               </h1>
//             )}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="text-sm text-muted-foreground capitalize">
//                 Tipo: {bloco.tipo}
//               </span>
//               <span className="text-xs text-muted-foreground">•</span>
//               <span className="text-sm text-muted-foreground">
//                 Criado em{" "}
//                 {new Date(bloco.createdAt).toLocaleDateString("pt-BR")}
//               </span>
//             </div>
//           </div>

//           {/* Menu de ações do bloco */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="gap-2">
//                 <MoreHorizontal className="h-4 w-4" />
//                 Ações
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Renomear
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handleDuplicateBloco}>
//                 <Copy className="mr-2 h-4 w-4" />
//                 Duplicar
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => setModalCriarAberto(true)}
//                 className="text-primary"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Adicionar sub-bloco
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={handleDeleteBloco}
//                 className="text-destructive"
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Excluir bloco
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Canvas do Bloco (texto livre) */}
//         <div className="mb-12">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Layers className="h-4 w-4 text-primary" />
//             Conteúdo
//           </h2>
//           <CanvasEditor
//             blocks={canvasBlocks}
//             onBlocksChange={handleCanvasChange}
//             placeholder="Escreva aqui... Use '/' para comandos"
//           />
//         </div>

//         {/* Sub-blocos */}
//         {subBlocos.length > 0 && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 <Plus className="h-4 w-4 text-primary" />
//                 Sub-blocos
//               </h2>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => setModalCriarAberto(true)}
//               >
//                 <Plus className="h-3 w-3 mr-1" />
//                 Adicionar
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {subBlocos.map((subBloco) => (
//                 <BlockRenderer
//                   key={subBloco.id}
//                   bloco={subBloco}
//                   nucleoId={nucleo.id}
//                   isSubBloco
//                   onDelete={
//                     onDeleteSubBloco
//                       ? () => onDeleteSubBloco(subBloco.id)
//                       : undefined
//                   }
//                   onEdit={
//                     onUpdateSubBloco
//                       ? () => onUpdateSubBloco(subBloco.id, {})
//                       : undefined
//                   }
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Estado vazio de sub-blocos */}
//         {subBlocos.length === 0 && (
//           <div className="text-center py-12 border-2 border-dashed rounded-xl">
//             <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground mb-2">Nenhum sub-bloco ainda</p>
//             <Button variant="outline" onClick={() => setModalCriarAberto(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Adicionar sub-bloco
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Modal para criar sub-bloco */}
//       <CriarBlocoModal
//         open={modalCriarAberto}
//         onClose={() => setModalCriarAberto(false)}
//         onConfirm={handleCreateSubBloco}
//         nucleoId={nucleo.id}
//         isCreating={isSubmitting}
//       />
//     </div>
//   );
// }
