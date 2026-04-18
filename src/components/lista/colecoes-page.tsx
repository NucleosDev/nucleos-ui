// // components/colecoes/ColecaoPage.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useColecoes } from "@/hooks/useColecoes";
// import { CampoLists } from "@/components/colecoes/CampoList";
// import { ItemList } from "@/components/colecoes/ItemList";
// import type { Campo } from "@/types/colecao";

// interface ColecaoPageProps {
//   colecaoId: string;
// }

// export function ColecaoPage({ colecaoId }: ColecaoPageProps) {
//   const router = useRouter();
//   const { getColecao, getCampos } = useColecoes();
//   const [colecao, setColecao] = useState<any>(null);
//   const [campos, setCampos] = useState<Campo[]>([]);

//   useEffect(() => {
//     carregarDados();
//   }, [colecaoId]);

//   const carregarDados = async () => {
//     const colecaoData = await getColecao(colecaoId);
//     const camposData = await getCampos(colecaoId);
//     setColecao(colecaoData);
//     setCampos(camposData || []);
//   };

//   if (!colecao) return <div>Carregando...</div>;

//   return (
//     <div className="container py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" onClick={() => router.back()}>
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold">{colecao.nome}</h1>
//           <p className="text-muted-foreground">
//             {campos.length} campos • Gerenciamento de dados
//           </p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="itens" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="itens">Itens</TabsTrigger>
//           <TabsTrigger value="campos">Campos</TabsTrigger>
//         </TabsList>

//         <TabsContent value="itens">
//           <ItemList colecaoId={colecaoId} campos={campos} />
//         </TabsContent>

//         <TabsContent value="campos">
//           <CampoLists colecaoId={colecaoId} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }