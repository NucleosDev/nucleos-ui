// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { NucleoCard } from "./nucleo-card";
// import { Skeleton } from "@/components/ui/skeleton";
// import type { NucleoComStats } from "@/types";
// import { Plus, FolderOpen } from "lucide-react";

// interface NucleoGridProps {
//   nucleos: NucleoComStats[];
//   loading?: boolean;
//   onNucleoClick?: (nucleo: NucleoComStats) => void;
//   onNucleoEdit?: (nucleo: NucleoComStats) => void;
//   onNucleoDelete?: (nucleo: NucleoComStats) => void;
//   onAddNucleo?: () => void;
//   className?: string;
// }

// export function NucleoGrid({
//   nucleos,
//   loading = false,
//   onNucleoClick,
//   onNucleoEdit,
//   onNucleoDelete,
//   onAddNucleo,
//   className,
// }: NucleoGridProps) {
//   if (loading) {
//     return (
//       <div
//         className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
//       >
//         {Array.from({ length: 6 }).map((_, i) => (
//           <NucleoCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (nucleos.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
//         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
//           <FolderOpen className="size-8 text-muted-foreground" />
//         </div>
//         <h3 className="text-lg font-semibold mb-2">Nenhum núcleo encontrado</h3>
//         <p className="text-muted-foreground text-center mb-6 max-w-sm">
//           Crie seu primeiro núcleo para começar a organizar suas tarefas,
//           hábitos e muito mais.
//         </p>
//         {onAddNucleo && (
//           <Button onClick={onAddNucleo}>
//             <Plus className="size-4 mr-2" />
//             Criar primeiro núcleo
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
//       {nucleos.map((nucleo) => (
//         <NucleoCard
//           key={nucleo.id}
//           nucleo={nucleo}
//           onClick={() => onNucleoClick?.(nucleo)}
//           onEdit={() => onNucleoEdit?.(nucleo)}
//           onDelete={() => onNucleoDelete?.(nucleo)}
//         />
//       ))}
//     </div>
//   );
// }

// function NucleoCardSkeleton() {
//   return (
//     <div className="rounded-lg border bg-card overflow-hidden">
//       <Skeleton className="h-24 w-full" />
//       <div className="p-4 space-y-3">
//         <div className="flex items-start justify-between">
//           <div className="space-y-1">
//             <Skeleton className="h-5 w-32" />
//             <Skeleton className="h-3 w-16" />
//           </div>
//           <Skeleton className="h-5 w-12" />
//         </div>
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-2 w-full" />
//       </div>
//     </div>
//   );
// }
