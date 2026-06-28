// // src/hooks/useListaFinanceira.ts
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { listasService } from "@/services/lista.service";
// import type { GrupoFinanceiro } from "@/types/lista";

// export function useListaFinanceira(listaId: string) {
//   const queryClient = useQueryClient();

//   const { data: grupos = [], isLoading } = useQuery<GrupoFinanceiro[]>({
//     queryKey: ["grupos-financeiros", listaId],
//     queryFn: () => listasService.listarGrupos(listaId),
//     enabled: !!listaId,
//   });

//   // ✅ Tipagem explícita compatível
//   const addItemMutation = useMutation({
//     mutationFn: async (payload: any) => {
//       await listasService.criarItem(payload);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const updateItemMutation = useMutation({
//     mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
//       await listasService.atualizarItem(id, payload);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const deleteItemMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await listasService.deletarItem(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const toggleItemMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await listasService.toggleItem(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const addGrupoMutation = useMutation({
//     mutationFn: async (nome: string) => {
//       await listasService.criarGrupo({ listaId, nome });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const updateGrupoMutation = useMutation({
//     mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
//       await listasService.atualizarGrupo(id, payload);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   const deleteGrupoMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await listasService.deletarGrupo(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["grupos-financeiros", listaId],
//       });
//     },
//   });

//   return {
//     grupos,
//     isLoading,
//     addItem: addItemMutation.mutateAsync,
//     updateItem: updateItemMutation.mutateAsync,
//     deleteItem: deleteItemMutation.mutateAsync,
//     toggleItem: toggleItemMutation.mutateAsync,
//     addGrupo: addGrupoMutation.mutateAsync,
//     updateGrupo: updateGrupoMutation.mutateAsync,
//     deleteGrupo: deleteGrupoMutation.mutateAsync,
//   };
// }
