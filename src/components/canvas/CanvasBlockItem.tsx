// // src/components/canvas/CanvasBlockItem.tsx
// "use client";

// import { useState } from "react";
// import { cn } from "@/lib/utils";
// import {
//   CanvasDivider,
//   DragHandle,
//   BlockHoverActions,
//   TextFormatMenu,
//   CanvasSlashMenu,
//   MoreActionsMenu,
// } from "@/components/canvas";
// import { FORMAT_COMMANDS, BLOCK_COMMANDS } from "./commands";
// import type {
//   CanvasBlock as CanvasBlockType,
//   CanvasBlockType as BlockType,
// } from "./types";

// interface CanvasBlockItemProps {
//   block: CanvasBlockType;
//   isActive: boolean;
//   onActivate: () => void;
//   onUpdate: (content: string) => void;
//   onDelete: () => void;
//   onAddBelow: () => void;
//   onTypeChange: (type: BlockType) => void;
//   onOpenFunctionalBlock?: () => void;
//   onDuplicate?: () => void;
//   isDeleting?: boolean;
//   readOnly?: boolean;
//   placeholder?: string;
// }

// export function CanvasBlockItem({
//   block,
//   isActive,
//   onActivate,
//   onUpdate,
//   onDelete,
//   onAddBelow,
//   onTypeChange,
//   onOpenFunctionalBlock,
//   onDuplicate,
//   isDeleting = false,
//   readOnly = false,
//   placeholder = "Digite '/' para comandos...",
// }: CanvasBlockItemProps) {
//   const [showSlashMenu, setShowSlashMenu] = useState(false);
//   const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
//   const [showFormatMenu, setShowFormatMenu] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const contentRef = useState<HTMLDivElement | null>(null);

//   const isFunctionalBlock = [
//     "tarefas",
//     "habitos",
//     "lista",
//     "calendario",
//     "timer",
//     "colecoes",
//     "notas",
//   ].includes(block.type);

//   const handleInput = () => {
//     if (isFunctionalBlock || readOnly) return;
//     const content = contentRef.current?.textContent || "";
//     if (content.startsWith("/") && content.length <= 10) {
//       const rect = contentRef.current?.getBoundingClientRect();
//       if (rect) setSlashPosition({ top: rect.bottom + 4, left: rect.left });
//       setShowSlashMenu(true);
//     } else {
//       setShowSlashMenu(false);
//     }
//     onUpdate(content);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (isFunctionalBlock || readOnly) return;
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       onAddBelow();
//     }
//     if (e.key === "Backspace" && !contentRef.current?.textContent?.trim()) {
//       e.preventDefault();
//       onDelete();
//     }
//   };

//   const handleDragStart = (e: React.DragEvent) => {
//     e.dataTransfer.setData("text/plain", block.id);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   if (block.type === "divider") {
//     return (
//       <CanvasDivider
//         onAddBelow={onAddBelow}
//         onDelete={onDelete}
//         onClick={onActivate}
//       />
//     );
//   }

//   const typeClasses: Record<string, string> = {
//     h1: "text-4xl font-bold leading-tight",
//     h2: "text-3xl font-semibold leading-tight",
//     h3: "text-2xl font-medium leading-tight",
//     paragraph: "text-base leading-relaxed",
//     quote: "border-l-4 border-primary pl-4 italic text-muted-foreground",
//     code: "font-mono text-sm bg-muted/50 rounded-lg px-3 py-1.5",
//     "bullet-list": "",
//     "numbered-list": "",
//     todo: "",
//   };

//   return (
//     <div
//       className={cn(
//         "group relative flex items-start gap-2 py-1.5 rounded-lg transition-colors",
//         isActive && "bg-muted/30",
//       )}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={onActivate}
//     >
//       {/* Drag Handle */}
//       {!readOnly && (
//         <DragHandle
//           onAddBelow={onAddBelow}
//           onDragStart={handleDragStart}
//           isVisible={isActive || isHovered}
//         />
//       )}

//       {/* Conteúdo do bloco */}
//       <div className="flex-1 min-w-0">
//         <div
//           ref={(el) => {
//             contentRef.current = el;
//           }}
//           contentEditable={!readOnly && !isFunctionalBlock}
//           suppressContentEditableWarning
//           className={cn(
//             "outline-none",
//             typeClasses[block.type],
//             isFunctionalBlock && "cursor-pointer",
//           )}
//           data-placeholder={placeholder}
//           onInput={handleInput}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setShowFormatMenu(true)}
//           onBlur={() => setTimeout(() => setShowFormatMenu(false), 200)}
//         >
//           {block.content}
//         </div>
//       </div>

//       {/* Menu de formatação flutuante */}
//       {!readOnly && !isFunctionalBlock && (
//         <TextFormatMenu
//           onTypeChange={(type) => onTypeChange(type as BlockType)}
//           onDelete={onDelete}
//           formatCommands={FORMAT_COMMANDS}
//           isVisible={showFormatMenu && isActive}
//         />
//       )}

//       {/* Slash Menu */}
//       {!readOnly && !isFunctionalBlock && (
//         <CanvasSlashMenu
//           isOpen={showSlashMenu}
//           position={slashPosition}
//           formatCommands={FORMAT_COMMANDS}
//           blockCommands={BLOCK_COMMANDS}
//           onSelectFormat={(type) => onTypeChange(type as BlockType)}
//           onSelectBlock={onOpenFunctionalBlock}
//           onClose={() => setShowSlashMenu(false)}
//         />
//       )}

//       {/* Ações de hover (3 pontinhos) */}
//       {!readOnly && !isFunctionalBlock && (
//         <MoreActionsMenu
//           onEdit={onActivate}
//           onDelete={onDelete}
//           onDuplicate={onDuplicate}
//           onAddBelow={onAddBelow}
//           className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
//         />
//       )}

//       {/* Ações de hover para blocos funcionais */}
//       {isFunctionalBlock && (
//         <BlockHoverActions
//           onEdit={onOpenFunctionalBlock}
//           onDelete={onDelete}
//           onAddSubBloco={onAddBelow}
//           onDuplicate={onDuplicate}
//           isVisible={isActive || isHovered}
//           className="absolute -top-8 right-0"
//         />
//       )}
//     </div>
//   );
// }
