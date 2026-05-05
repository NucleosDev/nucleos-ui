// src/components/blocos/cruds/TarefasBlocoCard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  CheckSquare,
  Loader2,
  LayoutGrid,
  List,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTarefas } from "@/hooks/useTarefas";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Bloco } from "@/types/bloco";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";
import { KanbanBoard } from "@/components/tarefas/KanbanBoard";
import { TaskListView } from "@/components/tarefas/TaskListView";
import { DailyTrackerDialog } from "@/components/tarefas/DailyTrackerDialog";
import { AddTaskDialog } from "@/components/tarefas/AddTaskDialog";

interface TarefasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function TarefasBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: TarefasBlocoCardProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [dailyTrackerOpen, setDailyTrackerOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    tarefas = [],
    isLoading,
    criar,
    atualizar,
    concluir,
    excluir,
    isCreating,
    isUpdating,
  } = useTarefas(bloco.id);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleAddTask = async (
    titulo: string,
    prioridade: TarefaPrioridade,
    dataVencimento?: string,
  ) => {
    try {
      await criar({
        blocoId: bloco.id,
        titulo: titulo.trim(),
        prioridade,
        dataVencimento,
      });
      toast({ title: "Tarefa adicionada!" });
      handleRefresh();
      return true;
    } catch (error: any) {
      toast({ title: "Erro ao adicionar tarefa", variant: "destructive" });
      return false;
    }
  };

  const handleUpdateTask = async (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => {
    try {
      await atualizar({ id, payload: { titulo, prioridade } });
      toast({ title: "Tarefa atualizada!" });
      handleRefresh();
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (id: string, status: TarefaStatus) => {
    try {
      await concluir(id);
      handleRefresh();
    } catch (error: any) {
      toast({ title: "Erro ao mover tarefa", variant: "destructive" });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Excluir esta tarefa?")) return;
    try {
      await excluir(id);
      toast({ title: "Tarefa excluída!" });
      handleRefresh();
    } catch (error: any) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const completedCount = tarefas.filter((t) => t.status === "concluida").length;
  const totalCount = tarefas.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="group relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="group relative hover:shadow-md transition-shadow">
        {/* Barra de ferramentas flutuante */}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "kanban" && "bg-background shadow-sm",
                  )}
                  title="Kanban"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list" && "bg-background shadow-sm",
                  )}
                  title="Lista"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* <Badge className="text-xs">
                {completedCount}/{totalCount}
              </Badge> */}
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setDailyTrackerOpen(true)}
              >
                <Flame className="h-4 w-4 mr-1" />
                Diário
              </Button>

              <Button
                size="sm"
                onClick={() => setAddTaskOpen(true)}
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova tarefa
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar bloco
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {viewMode === "kanban" ? (
            <KanbanBoard
              tasks={tarefas}
              onTaskMove={handleToggleStatus}
              onTaskEdit={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              isUpdating={isUpdating}
            />
          ) : (
            <TaskListView
              tasks={tarefas}
              onTaskToggle={handleToggleStatus}
              onTaskEdit={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              isUpdating={isUpdating}
            />
          )}
        </CardContent>
      </Card>

      <AddTaskDialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onAdd={handleAddTask}
        isSubmitting={isCreating}
      />

      <DailyTrackerDialog
        open={dailyTrackerOpen}
        onClose={() => setDailyTrackerOpen(false)}
        tasks={tarefas}
        onTaskToggle={handleToggleStatus}
        onAddTask={handleAddTask}
      />
    </>
  );
}
// // src/components/blocos/cruds/TarefasBlocoCard.tsx
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus,
//   MoreVertical,
//   Pencil,
//   Trash2,
//   CheckSquare,
//   Loader2,
//   LayoutGrid,
//   List,
//   Flame,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { useTarefas } from "@/hooks/useTarefas";
// import { toast } from "@/hooks/use-toast";
// import { cn } from "@/lib/utils";
// import type { Bloco } from "@/types/bloco";
// import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";
// import { KanbanBoard } from "@/components/tarefas/KanbanBoard";
// import { TaskListView } from "@/components/tarefas/TaskListView";
// import { DailyTrackerDialog } from "@/components/tarefas/DailyTrackerDialog";
// import { AddTaskDialog } from "@/components/tarefas/AddTaskDialog";

// interface TarefasBlocoCardProps {
//   bloco: Bloco;
//   nucleoId: string;
//   onDelete?: () => void;
//   onEdit?: () => void;
//   isDeleting?: boolean;
// }

// export function TarefasBlocoCard({
//   bloco,
//   nucleoId,
//   onDelete,
//   onEdit,
//   isDeleting,
// }: TarefasBlocoCardProps) {
//   const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
//   const [dailyTrackerOpen, setDailyTrackerOpen] = useState(false);
//   const [addTaskOpen, setAddTaskOpen] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const {
//     tarefas = [],
//     isLoading,
//     criar,
//     atualizar,
//     concluir,
//     excluir,
//     isCreating,
//     isUpdating,
//   } = useTarefas(bloco.id);

//   const handleRefresh = () => setRefreshKey(prev => prev + 1);

//   const handleAddTask = async (titulo: string, prioridade: TarefaPrioridade, dataVencimento?: string) => {
//     try {
//       await criar({
//         blocoId: bloco.id,
//         titulo: titulo.trim(),
//         prioridade,
//         dataVencimento,
//       });
//       toast({ title: "Tarefa adicionada!" });
//       handleRefresh();
//       return true;
//     } catch (error: any) {
//       toast({ title: "Erro ao adicionar tarefa", variant: "destructive" });
//       return false;
//     }
//   };

//   const handleUpdateTask = async (id: string, titulo: string, prioridade?: TarefaPrioridade) => {
//     try {
//       await atualizar({ id, payload: { titulo, prioridade } });
//       toast({ title: "Tarefa atualizada!" });
//       handleRefresh();
//     } catch (error: any) {
//       toast({ title: "Erro ao atualizar", variant: "destructive" });
//     }
//   };

//   const handleToggleStatus = async (id: string, status: TarefaStatus) => {
//     try {
//       await concluir(id);
//       handleRefresh();
//     } catch (error: any) {
//       toast({ title: "Erro ao mover tarefa", variant: "destructive" });
//     }
//   };

//   const handleDeleteTask = async (id: string) => {
//     if (!confirm("Excluir esta tarefa?")) return;
//     try {
//       await excluir(id);
//       toast({ title: "Tarefa excluída!" });
//       handleRefresh();
//     } catch (error: any) {
//       toast({ title: "Erro ao excluir", variant: "destructive" });
//     }
//   };

//   const completedCount = tarefas.filter(t => t.status === "concluida").length;
//   const totalCount = tarefas.length;
//   const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

//   if (isLoading) {
//     return (
//       <Card className="group relative hover:shadow-md transition-shadow">
//         <CardHeader className="pb-3">
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-5 w-5 rounded" />
//             <Skeleton className="h-6 w-32" />
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-24 w-full" />
//           <Skeleton className="h-24 w-full" />
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card className="group relative hover:shadow-md transition-shadow">
//         {/* Barra de ferramentas flutuante */}
//         <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
//           {onEdit && (
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-7 w-7 bg-background shadow-sm"
//               onClick={onEdit}
//             >
//               <Pencil className="h-3.5 w-3.5" />
//             </Button>
//           )}
//           {onDelete && (
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-7 w-7 bg-background shadow-sm text-destructive hover:text-destructive"
//               onClick={onDelete}
//               disabled={isDeleting}
//             >
//               <Trash2 className="h-3.5 w-3.5" />
//             </Button>
//           )}
//           <div className="cursor-move">
//             <div className="p-1 bg-background/80 backdrop-blur-sm rounded shadow-sm">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="9" cy="6" r="1.5" fill="currentColor" />
//                 <circle cx="9" cy="12" r="1.5" fill="currentColor" />
//                 <circle cx="9" cy="18" r="1.5" fill="currentColor" />
//                 <circle cx="15" cy="6" r="1.5" fill="currentColor" />
//                 <circle cx="15" cy="12" r="1.5" fill="currentColor" />
//                 <circle cx="15" cy="18" r="1.5" fill="currentColor" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <CheckSquare className="h-5 w-5 text-primary" />
//               <CardTitle className="text-lg">{bloco.titulo || "Tarefas"}</CardTitle>
//               <Badge variant="secondary" className="text-xs">
//                 {completedCount}/{totalCount} concluídas
//               </Badge>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* View Toggle */}
//               <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
//                 <button
//                   onClick={() => setViewMode("kanban")}
//                   className={cn(
//                     "p-1.5 rounded-md transition-colors",
//                     viewMode === "kanban" && "bg-background shadow-sm"
//                   )}
//                   title="Kanban"
//                 >
//                   <LayoutGrid className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={cn(
//                     "p-1.5 rounded-md transition-colors",
//                     viewMode === "list" && "bg-background shadow-sm"
//                   )}
//                   title="Lista"
//                 >
//                   <List className="h-3.5 w-3.5" />
//                 </button>
//               </div>

//               <Button size="sm" variant="outline" onClick={() => setDailyTrackerOpen(true)}>
//                 <Flame className="h-4 w-4 mr-1" />
//                 Diário
//               </Button>

//               <Button size="sm" onClick={() => setAddTaskOpen(true)} disabled={isCreating}>
//                 <Plus className="h-4 w-4 mr-1" />
//                 Nova tarefa
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="h-8 w-8">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {onEdit && (
//                     <DropdownMenuItem onClick={onEdit}>
//                       <Pencil className="mr-2 h-4 w-4" /> Editar bloco
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuSeparator />
//                   {onDelete && (
//                     <DropdownMenuItem onClick={onDelete} className="text-destructive" disabled={isDeleting}>
//                       <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
//                     </DropdownMenuItem>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           {totalCount > 0 && (
//             <div className="mt-3">
//               <div className="flex justify-between text-xs text-muted-foreground mb-1">
//                 <span>Progresso</span>
//                 <span>{Math.round(progressPercentage)}%</span>
//               </div>
//               <div className="h-1.5 bg-muted rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
//                   style={{ width: `${progressPercentage}%` }}
//                 />
//               </div>
//             </div>
//           )}
//         </CardHeader>

//         <CardContent className="pt-0">
//           {viewMode === "kanban" ? (
//             <KanbanBoard
//               tasks={tarefas}
//               onTaskMove={handleToggleStatus}
//               onTaskEdit={handleUpdateTask}
//               onTaskDelete={handleDeleteTask}
//               isUpdating={isUpdating}
//             />
//           ) : (
//             <TaskListView
//               tasks={tarefas}
//               onTaskToggle={handleToggleStatus}
//               onTaskEdit={handleUpdateTask}
//               onTaskDelete={handleDeleteTask}
//               isUpdating={isUpdating}
//             />
//           )}
//         </CardContent>
//       </Card>

//       <AddTaskDialog
//         open={addTaskOpen}
//         onClose={() => setAddTaskOpen(false)}
//         onAdd={handleAddTask}
//         isSubmitting={isCreating}
//       />

//       <DailyTrackerDialog
//         open={dailyTrackerOpen}
//         onClose={() => setDailyTrackerOpen(false)}
//         tasks={tarefas}
//         onTaskToggle={handleToggleStatus}
//         onAddTask={handleAddTask}
//       />
//     </>
//   );
// }
