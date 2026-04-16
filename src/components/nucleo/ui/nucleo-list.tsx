// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { NucleoCardCompact } from "./nucleo-card-compact";
// import { Skeleton } from "@/components/ui/skeleton";
// import type { NucleoComStats } from "@/types";
// import { Plus, FolderOpen } from "lucide-react";

// interface NucleoListProps {
//   nucleos: NucleoComStats[];
//   loading?: boolean;
//   onNucleoClick?: (nucleo: NucleoComStats) => void;
//   onAddNucleo?: () => void;
//   className?: string;
// }

// export function NucleoList({
//   nucleos,
//   loading = false,
//   onNucleoClick,
//   onAddNucleo,
//   className,
// }: NucleoListProps) {
//   if (loading) {
//     return (
//       <div className={cn("space-y-2", className)}>
//         {Array.from({ length: 5 }).map((_, i) => (
//           <NucleoListSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (nucleos.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
//         <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
//           <FolderOpen className="size-6 text-muted-foreground" />
//         </div>
//         <h3 className="font-semibold mb-1">Nenhum núcleo</h3>
//         <p className="text-sm text-muted-foreground text-center mb-4">
//           Comece criando seu primeiro núcleo.
//         </p>
//         {onAddNucleo && (
//           <Button size="sm" onClick={onAddNucleo}>
//             <Plus className="size-4 mr-2" />
//             Criar núcleo
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-2", className)}>
//       {nucleos.map((nucleo) => (
//         <NucleoCardCompact
//           key={nucleo.id}
//           nucleo={nucleo}
//           onClick={() => onNucleoClick?.(nucleo)}
//         />
//       ))}
//     </div>
//   );
// }

// function NucleoListSkeleton() {
//   return (
//     <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
//       <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
//       <div className="flex-1 space-y-2">
//         <Skeleton className="h-4 w-32" />
//         <Skeleton className="h-1.5 w-full" />
//       </div>
//       <Skeleton className="w-4 h-4 shrink-0" />
//     </div>
//   );
// }
