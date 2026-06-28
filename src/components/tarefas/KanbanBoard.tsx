// src/components/tarefas/KanbanBoard.tsx
"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TarefaCard } from "./TarefaCard";
import { ClipboardList, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

interface KanbanBoardProps {
  tasks: Tarefa[];
  onTaskMove: (taskId: string, newStatus: TarefaStatus) => Promise<void>;
  onTaskEdit: (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => Promise<void>;
  onTaskDelete: (id: string) => void | Promise<void>;
  isUpdating?: boolean;
}

const COLUMNS: Array<{
  id: TarefaStatus;
  title: string;
  icon: React.ElementType;
  accent: string;
}> = [
  { id: "pendente", title: "Pendente", icon: ClipboardList, accent: "#3b82f6" },
  { id: "atrasada", title: "Atrasada", icon: AlertTriangle, accent: "#ef4444" },
  { id: "fazendo",  title: "Fazendo",  icon: Zap,          accent: "#8b5cf6" },
  { id: "concluida",title: "Concluída",icon: CheckCircle2, accent: "#22c55e" },
];

// ─── Draggable task wrapper ────────────────────────────────────────────────

function DraggableTask({
  task,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
}: {
  task: Tarefa;
  onToggle: (id: string, status: TarefaStatus) => Promise<void>;
  onEdit: (id: string, titulo: string, prioridade?: TarefaPrioridade) => Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  isUpdating?: boolean;
}) {
  const canDrag = task.status !== "concluida";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task, status: task.status },
      disabled: !canDrag,
    });

  const style = transform
    ? { transform: CSS.Transform.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none",
        canDrag && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-0",
      )}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
    >
      <TarefaCard
        tarefa={task}
        onToggle={onToggle}
        onUpdate={onEdit}
        onDelete={onDelete}
        isUpdating={isUpdating}
        isDragging={false}
        draggable={false}
      />
    </div>
  );
}

// ─── Column with drop zone ─────────────────────────────────────────────────

function KanbanColumn({
  col,
  tasks,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
  isDragActive,
}: {
  col: (typeof COLUMNS)[0];
  tasks: Tarefa[];
  onToggle: (id: string, status: TarefaStatus) => Promise<void>;
  onEdit: (id: string, titulo: string, prioridade?: TarefaPrioridade) => Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  isUpdating?: boolean;
  isDragActive: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: col.id });
  const Icon = col.icon;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl border overflow-hidden transition-all duration-200",
        "bg-card/40 backdrop-blur-sm",
        isOver
          ? "border-primary/40 shadow-[0_0_0_2px_oklch(0.58_0.19_245_/_0.14),0_8px_24px_oklch(0.58_0.19_245_/_0.10)]"
          : isDragActive
            ? "border-border/60"
            : "border-border/50",
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-border/30 transition-colors duration-200"
        style={{ background: isOver ? `${col.accent}1a` : `${col.accent}0a` }}
      >
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md transition-transform duration-200",
            isOver && "scale-110",
          )}
          style={{ background: `${col.accent}18` }}
        >
          <Icon className="h-3 w-3" style={{ color: col.accent }} />
        </div>
        <span className="text-xs font-semibold flex-1" style={{ color: col.accent }}>
          {col.title}
        </span>
        <span
          className="text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md transition-colors duration-200"
          style={{
            background: isOver ? `${col.accent}28` : `${col.accent}18`,
            color: col.accent,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-[400px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{
                layout: { type: "spring", stiffness: 380, damping: 30 },
                opacity: { duration: 0.14 },
                scale: { duration: 0.14 },
                y: { duration: 0.14 },
              }}
            >
              <DraggableTask
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                isUpdating={isUpdating}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {tasks.length === 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={isOver ? "over" : "empty"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              {isOver ? (
                <div
                  className="h-10 w-10 rounded-xl border-2 border-dashed flex items-center justify-center mb-2 transition-colors duration-200"
                  style={{
                    borderColor: `${col.accent}50`,
                    background: `${col.accent}0a`,
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: col.accent }} />
                </div>
              ) : (
                <Icon className="h-6 w-6 mb-2 opacity-15" style={{ color: col.accent }} />
              )}
              <p className="text-[11px] text-muted-foreground/50">
                {isOver ? "Solte aqui" : "Nenhuma tarefa"}
              </p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Drop hint when column has tasks and is being hovered */}
        {tasks.length > 0 && isOver && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 36 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: `${col.accent}40`, background: `${col.accent}06` }}
          >
            <p className="text-[10px] font-medium" style={{ color: col.accent }}>
              Soltar aqui
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Board ─────────────────────────────────────────────────────────────────

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  isUpdating = false,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Tarefa | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const getColumnTasks = useCallback(
    (status: TarefaStatus) => tasks.filter((t) => t.status === status),
    [tasks],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;
      const taskId  = active.id as string;
      const newStatus = over.id as TarefaStatus;
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== newStatus) {
        await onTaskMove(taskId, newStatus);
      }
    },
    [tasks, onTaskMove],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 min-h-[400px]">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            col={col}
            tasks={getColumnTasks(col.id)}
            onToggle={onTaskMove}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            isUpdating={isUpdating}
            isDragActive={!!activeTask}
          />
        ))}
      </div>

      {/* Floating drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <motion.div
            initial={{ scale: 1, rotate: 0, boxShadow: "none" }}
            animate={{
              scale: 1.04,
              rotate: 1.2,
              boxShadow:
                "0 20px 48px -8px oklch(0.18 0.02 250 / 0.32), 0 4px 16px oklch(0.58 0.19 245 / 0.14)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.6 }}
            style={{ borderRadius: 12, willChange: "transform" }}
          >
            <TarefaCard
              tarefa={activeTask}
              onToggle={async () => {}}
              onUpdate={async () => {}}
              onDelete={async () => {}}
              isDragging={true}
              draggable={false}
              isUpdating={false}
            />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
