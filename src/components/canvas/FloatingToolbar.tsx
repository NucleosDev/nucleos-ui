// // src/components/canvas/FloatingToolbar.tsx
// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Type, Bold, Italic, Underline, ChevronDown } from "lucide-react";
// import { FORMAT_COMMANDS, INLINE_FORMAT_COMMANDS } from "./commands";

// interface FloatingToolbarProps {
//   isVisible: boolean;
//   position: { top: number; left: number };
//   onTypeChange: (type: string) => void;
//   onFormat?: (format: string) => void;
//   onDelete?: () => void;
// }

// export function FloatingToolbar({
//   isVisible,
//   position,
//   onTypeChange,
//   onFormat,
//   onDelete,
// }: FloatingToolbarProps) {
//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: -10 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: -10 }}
//           transition={{ duration: 0.15 }}
//           className="fixed z-50 bg-popover rounded-lg shadow-lg border overflow-hidden"
//           style={{ top: position.top, left: position.left }}
//         >
//           <div className="flex items-center gap-0.5 p-1">
//             {/* Tipo de bloco */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
//                   <Type className="h-3.5 w-3.5" />
//                   <ChevronDown className="h-3 w-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 {FORMAT_COMMANDS.map((cmd) => {
//                   const Icon = cmd.icon;
//                   return (
//                     <DropdownMenuItem
//                       key={cmd.type}
//                       onClick={() => onTypeChange(cmd.type)}
//                       className="gap-2"
//                     >
//                       <Icon className="h-4 w-4" />
//                       <span>{cmd.label}</span>
//                       {cmd.shortcut && (
//                         <span className="ml-auto text-xs text-muted-foreground">
//                           {cmd.shortcut}
//                         </span>
//                       )}
//                     </DropdownMenuItem>
//                   );
//                 })}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <div className="w-px h-5 bg-border mx-0.5" />

//             {/* Formatação inline */}
//             {INLINE_FORMAT_COMMANDS.map((cmd) => {
//               const Icon = cmd.icon;
//               return (
//                 <Button
//                   key={cmd.type}
//                   variant="ghost"
//                   size="icon"
//                   className="h-7 w-7"
//                   onClick={() => onFormat?.(cmd.type)}
//                   title={cmd.label}
//                 >
//                   <Icon className="h-3.5 w-3.5" />
//                 </Button>
//               );
//             })}

//             {onDelete && (
//               <>
//                 <div className="w-px h-5 bg-border mx-0.5" />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-7 w-7 text-destructive hover:text-destructive"
//                   onClick={onDelete}
//                   title="Excluir"
//                 >
//                   <Trash2 className="h-3.5 w-3.5" />
//                 </Button>
//               </>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// import { Trash2 } from "lucide-react";
