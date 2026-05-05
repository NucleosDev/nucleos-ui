// // src/components/canvas/BlockRenderer.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { BlocoCard } from "@/components/blocos/BlocoCard";
// import type { Bloco } from "@/types/bloco";

// interface BlockRendererProps {
//   bloco: Bloco;
//   nucleoId: string;
//   isSubBloco?: boolean;
//   onDelete?: () => void;
//   onEdit?: () => void;
//   onDuplicate?: () => void;
//   className?: string;
// }

// export function BlockRenderer({
//   bloco,
//   nucleoId,
//   isSubBloco = false,
//   onDelete,
//   onEdit,
//   onDuplicate,
//   className,
// }: BlockRendererProps) {
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);

//   const handleOpenFullPage = () => {
//     router.push(`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ duration: 0.2 }}
//       className={cn("group relative", className)}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Wrap do BlocoCard com ações customizadas */}
//       <div className="relative">
//         <BlocoCard
//           bloco={bloco}
//           nucleoId={nucleoId}
//           compact={true}
//           onDelete={onDelete}
//           onEdit={onEdit}
//           onDuplicate={onDuplicate}
//           onCreateBloco={undefined}
//           isDeleting={false}
//           isCreating={false}
//           depth={isSubBloco ? 1 : 0}
//         />

//         {/* Badge de sub-bloco sobreposto */}
//         {isSubBloco && (
//           <div className="absolute -top-2 -left-2 z-10">
//             <div className="bg-primary/10 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-primary/20 backdrop-blur-sm">
//               Sub-bloco
//             </div>
//           </div>
//         )}

//         {/* Botão de tela cheia flutuante */}
//         {isHovered && (
//           <button
//             onClick={handleOpenFullPage}
//             className="absolute top-2 right-2 z-10 p-1 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent transition-colors"
//           >
//             <ExternalLink className="h-3 w-3 text-muted-foreground" />
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// import { cn } from "@/lib/utils";
// import { ExternalLink } from "lucide-react";
