// // src/components/canvas/CanvasToolbar.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Bold,
//   Italic,
//   Underline,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   List,
//   ListOrdered,
//   Heading1,
//   Heading2,
//   Heading3,
//   Quote,
//   Code2,
//   Minus,
//   CheckSquare,
//   Type,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// interface CanvasToolbarProps {
//   onFormat?: (format: string) => void;
//   onAlign?: (align: "left" | "center" | "right") => void;
//   onInsertBlock?: (type: string) => void;
//   className?: string;
// }

// const INSERT_COMMANDS = [
//   { type: "h1", label: "Título 1", icon: Heading1 },
//   { type: "h2", label: "Título 2", icon: Heading2 },
//   { type: "h3", label: "Título 3", icon: Heading3 },
//   { type: "paragraph", label: "Parágrafo", icon: Type },
//   { type: "quote", label: "Citação", icon: Quote },
//   { type: "code", label: "Código", icon: Code2 },
//   { type: "divider", label: "Divisor", icon: Minus },
//   { type: "bullet-list", label: "Lista", icon: List },
//   { type: "numbered-list", label: "Lista numerada", icon: ListOrdered },
//   { type: "todo", label: "Checklist", icon: CheckSquare },
// ];

// export function CanvasToolbar({
//   onFormat,
//   onAlign,
//   onInsertBlock,
//   className,
// }: CanvasToolbarProps) {
//   return (
//     <div
//       className={cn(
//         "flex items-center gap-1 p-1 bg-popover border rounded-lg shadow-sm",
//         className,
//       )}
//     >
//       {/* Formatação de texto */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onFormat?.("bold")}
//       >
//         <Bold className="h-4 w-4" />
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onFormat?.("italic")}
//       >
//         <Italic className="h-4 w-4" />
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onFormat?.("underline")}
//       >
//         <Underline className="h-4 w-4" />
//       </Button>

//       <div className="w-px h-6 bg-border mx-1" />

//       {/* Alinhamento */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onAlign?.("left")}
//       >
//         <AlignLeft className="h-4 w-4" />
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onAlign?.("center")}
//       >
//         <AlignCenter className="h-4 w-4" />
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8"
//         onClick={() => onAlign?.("right")}
//       >
//         <AlignRight className="h-4 w-4" />
//       </Button>

//       <div className="w-px h-6 bg-border mx-1" />

//       {/* Inserir blocos */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 gap-1">
//             <List className="h-4 w-4" />
//             <span className="text-xs">Inserir</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start" className="w-56">
//           {INSERT_COMMANDS.map((cmd) => (
//             <DropdownMenuItem
//               key={cmd.type}
//               onClick={() => onInsertBlock?.(cmd.type)}
//             >
//               <cmd.icon className="mr-2 h-4 w-4" />
//               <span>{cmd.label}</span>
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }
