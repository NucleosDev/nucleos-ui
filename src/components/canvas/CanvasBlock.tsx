// // src/components/canvas/CanvasBlock.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   GripVertical,
//   Plus,
//   Trash2,
//   Heading1,
//   Heading2,
//   Heading3,
//   Type,
//   List,
//   ListOrdered,
//   Quote,
//   Code2,
//   Minus,
//   CheckSquare,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { CanvasSlashMenu } from "./CanvasSlashMenu";
// import type { TextBlock, TextBlockType } from "@/types/canvas";

// interface CanvasBlockProps {
//   block: TextBlock;
//   isActive: boolean;
//   onActivate: () => void;
//   onUpdate: (id: string, content: string) => void;
//   onDelete: (id: string) => void;
//   onAddBelow: (id: string, type?: TextBlockType) => void;
//   onTypeChange: (id: string, type: TextBlockType) => void;
//   readOnly?: boolean;
// }

// export const TEXT_FORMAT_COMMANDS = [
//   { type: "h1" as const, label: "Título 1", icon: Heading1, shortcut: "⌘⌥1" },
//   { type: "h2" as const, label: "Título 2", icon: Heading2, shortcut: "⌘⌥2" },
//   { type: "h3" as const, label: "Título 3", icon: Heading3, shortcut: "⌘⌥3" },
//   { type: "paragraph" as const, label: "Texto", icon: Type, shortcut: "⌘⌥0" },
//   { type: "quote" as const, label: "Citação", icon: Quote, shortcut: ">" },
//   { type: "code" as const, label: "Código", icon: Code2, shortcut: "```" },
//   { type: "divider" as const, label: "Divisor", icon: Minus, shortcut: "---" },
//   { type: "bullet-list" as const, label: "Lista", icon: List, shortcut: "-" },
//   {
//     type: "numbered-list" as const,
//     label: "Lista numerada",
//     icon: ListOrdered,
//     shortcut: "1.",
//   },
//   {
//     type: "todo" as const,
//     label: "Checklist",
//     icon: CheckSquare,
//     shortcut: "[]",
//   },
// ];

// const typeClasses: Record<TextBlockType, string> = {
//   h1: "text-[2rem] font-bold leading-tight tracking-tight",
//   h2: "text-[1.5rem] font-semibold leading-tight",
//   h3: "text-[1.25rem] font-medium leading-tight",
//   paragraph: "text-base leading-relaxed",
//   quote: "border-l-[3px] border-primary/40 pl-4 italic text-muted-foreground",
//   code: "font-mono text-sm bg-muted/60 rounded-lg px-3 py-1.5",
//   divider: "",
//   "bullet-list": "ml-2",
//   "numbered-list": "ml-2",
//   todo: "ml-2",
// };

// export function CanvasBlock({
//   block,
//   isActive,
//   onActivate,
//   onUpdate,
//   onDelete,
//   onAddBelow,
//   onTypeChange,
//   readOnly = false,
// }: CanvasBlockProps) {
//   const [showSlashMenu, setShowSlashMenu] = useState(false);
//   const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (
//       contentRef.current &&
//       contentRef.current.textContent !== block.content
//     ) {
//       contentRef.current.textContent = block.content || "";
//     }
//   }, [block.id]); // Só sincroniza quando o bloco muda de ID

//   const handleInput = () => {
//     const text = contentRef.current?.textContent || "";
//     if (text === "/" && !readOnly) {
//       const r = contentRef.current?.getBoundingClientRect();
//       if (r) setSlashPos({ top: r.bottom + 4, left: r.left });
//       setShowSlashMenu(true);
//     } else {
//       setShowSlashMenu(false);
//     }
//     onUpdate(block.id, text);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (readOnly) return;
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       onAddBelow(block.id);
//     }
//     if (
//       e.key === "Backspace" &&
//       !contentRef.current?.textContent?.trim() &&
//       !readOnly
//     ) {
//       e.preventDefault();
//       onDelete(block.id);
//     }
//   };

//   // Divisor
//   if (block.type === "divider") {
//     return (
//       <div className="group relative py-2" onClick={onActivate}>
//         <div className="flex items-center gap-3">
//           <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6"
//               onClick={() => onAddBelow(block.id)}
//             >
//               <Plus className="h-3 w-3" />
//             </Button>
//             <GripVertical className="h-3 w-3 text-muted-foreground" />
//           </div>
//           <div className="flex-1 border-t border-border" />
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-6 w-6 opacity-0 group-hover:opacity-100"
//             onClick={() => onDelete(block.id)}
//           >
//             <Trash2 className="h-3 w-3 text-muted-foreground" />
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const placeholderMap: Record<string, string> = {
//     h1: "Título 1",
//     h2: "Título 2",
//     h3: "Título 3",
//     quote: "Citação...",
//     code: "Código...",
//     "bullet-list": "Item da lista",
//     "numbered-list": "Item numerado",
//     todo: "Tarefa",
//     paragraph: "Pressione '/' para comandos",
//   };

//   return (
//     <div
//       className={cn(
//         "group relative flex items-start gap-2 py-1 px-1 -mx-1 rounded-lg transition-colors",
//         isActive && "bg-muted/20",
//       )}
//       onClick={onActivate}
//     >
//       {/* Handles */}
//       {!readOnly && (
//         <div
//           className={cn(
//             "flex items-center gap-0.5 pt-[0.35rem] transition-opacity flex-shrink-0",
//             isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
//           )}
//         >
//           <button
//             className="p-0.5 cursor-grab active:cursor-grabbing rounded hover:bg-accent/50 transition-colors"
//             draggable
//           >
//             <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
//           </button>
//           <button
//             className="p-0.5 rounded hover:bg-accent/50 transition-colors"
//             onClick={() => onAddBelow(block.id)}
//           >
//             <Plus className="h-3.5 w-3.5 text-muted-foreground" />
//           </button>
//         </div>
//       )}

//       {/* Conteúdo */}
//       <div className={cn("flex-1 min-w-0", typeClasses[block.type])}>
//         {block.type === "bullet-list" ? (
//           <div className="flex items-start gap-2">
//             <span className="text-primary font-bold mt-[0.15rem] select-none">
//               •
//             </span>
//             <div
//               ref={contentRef}
//               contentEditable={!readOnly}
//               suppressContentEditableWarning
//               className="outline-none flex-1 min-w-0 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50"
//               data-placeholder={placeholderMap[block.type]}
//               onInput={handleInput}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//         ) : block.type === "todo" ? (
//           <div className="flex items-start gap-2">
//             <div className="w-4 h-4 mt-1 rounded border-2 border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors flex-shrink-0" />
//             <div
//               ref={contentRef}
//               contentEditable={!readOnly}
//               suppressContentEditableWarning
//               className="outline-none flex-1 min-w-0 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50"
//               data-placeholder={placeholderMap[block.type]}
//               onInput={handleInput}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//         ) : block.type === "numbered-list" ? (
//           <div className="flex items-start gap-2">
//             <span className="text-primary font-medium min-w-[1.5rem] select-none">
//               1.
//             </span>
//             <div
//               ref={contentRef}
//               contentEditable={!readOnly}
//               suppressContentEditableWarning
//               className="outline-none flex-1 min-w-0 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50"
//               data-placeholder={placeholderMap[block.type]}
//               onInput={handleInput}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//         ) : (
//           <div
//             ref={contentRef}
//             contentEditable={!readOnly}
//             suppressContentEditableWarning
//             className="outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50"
//             data-placeholder={
//               placeholderMap[block.type] || placeholderMap.paragraph
//             }
//             onInput={handleInput}
//             onKeyDown={handleKeyDown}
//           />
//         )}
//       </div>

//       {/* Botão de deletar */}
//       {!readOnly && (
//         <button
//           className={cn(
//             "p-0.5 rounded hover:bg-destructive/10 transition-all flex-shrink-0 mt-[0.35rem]",
//             isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
//           )}
//           onClick={() => onDelete(block.id)}
//         >
//           <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
//         </button>
//       )}

//       {/* Slash Menu */}
//       <CanvasSlashMenu
//         isOpen={showSlashMenu}
//         position={slashPos}
//         commands={TEXT_FORMAT_COMMANDS}
//         onSelect={(type) => {
//           onTypeChange(block.id, type);
//           setShowSlashMenu(false);
//         }}
//         onClose={() => setShowSlashMenu(false)}
//       />
//     </div>
//   );
// }
