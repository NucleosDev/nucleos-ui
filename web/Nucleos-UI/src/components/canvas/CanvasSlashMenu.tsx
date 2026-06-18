// src/components/canvas/CanvasSlashMenu.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SlashCommand {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  desc?: string;
}

interface CanvasSlashMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  commands: SlashCommand[]; // ← mudamos de formatCommands para commands
  blockCommands?: SlashCommand[];
  onSelect: (type: string) => void; // ← unificado
  onSelectBlock?: (tipo: string) => void;
  onClose: () => void;
}

export function CanvasSlashMenu({
  isOpen,
  position,
  commands, // ← agora é commands
  blockCommands,
  onSelect,
  onSelectBlock,
  onClose,
}: CanvasSlashMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 w-72 bg-popover border rounded-xl shadow-xl overflow-hidden"
          style={{ top: position.top, left: position.left }}
        >
          <div className="p-2 max-h-80 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase">
              Formatação
            </p>
            {commands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.type}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                  onClick={() => {
                    onSelect(cmd.type);
                    onClose();
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{cmd.label}</p>
                    {cmd.shortcut && (
                      <p className="text-xs text-muted-foreground">
                        {cmd.shortcut}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {blockCommands && blockCommands.length > 0 && (
              <>
                <div className="h-px bg-border my-2" />
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase">
                  Inserir Bloco
                </p>
                {blockCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.type}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                      onClick={() => {
                        onSelectBlock?.(cmd.type);
                        onClose();
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{cmd.label}</p>
                        {cmd.desc && (
                          <p className="text-xs text-muted-foreground truncate">
                            {cmd.desc}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
