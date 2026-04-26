// src/components/canvas/CanvasEditor.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanvasBlock } from "./CanvasBlock";
import type {
  CanvasBlock as CanvasBlockType,
  CanvasBlockType as BlockType,
} from "./types";

interface CanvasEditorProps {
  blocks: CanvasBlockType[];
  onBlocksChange: (blocks: CanvasBlockType[]) => void;
  onAddFunctionalBlock?: () => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function CanvasEditor({
  blocks,
  onBlocksChange,
  onAddFunctionalBlock,
  readOnly = false,
  placeholder = "Digite '/' para comandos...",
}: CanvasEditorProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // 🔥 LOG: Verificar o que está chegando
  console.log("🎨 CanvasEditor renderizando com blocks:", blocks);

  const handleUpdateBlock = (id: string, content: string) => {
    console.log("📝 Atualizando block:", id, content);
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, content } : b));
    onBlocksChange(newBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    console.log("🗑️ Deletando block:", id);
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  const handleAddBlockBelow = (id: string, type: BlockType) => {
    const index = blocks.findIndex((b) => b.id === id);
    const newBlock: CanvasBlockType = {
      id: crypto.randomUUID(),
      type,
      content: "",
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onBlocksChange(newBlocks);
    setActiveBlockId(newBlock.id);
  };

  const handleTypeChange = (id: string, type: BlockType) => {
    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, type, content: "" } : b)),
    );
  };

  const handleAddBlock = () => {
    const newBlock: CanvasBlockType = {
      id: crypto.randomUUID(),
      type: "paragraph",
      content: "",
    };
    onBlocksChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  // 🔥 Se não tem blocks, mostra estado vazio
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum conteúdo. Clique em "Adicionar texto" para começar.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-1 mb-8">
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <CanvasBlock
                block={block}
                isActive={activeBlockId === block.id}
                onActivate={() => setActiveBlockId(block.id)}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onAddBelow={handleAddBlockBelow}
                onTypeChange={handleTypeChange}
                readOnly={readOnly}
                placeholder={placeholder}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2"
            onClick={handleAddBlock}
          >
            <Plus className="h-4 w-4" /> Adicionar texto
          </Button>
          {onAddFunctionalBlock && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2"
              onClick={onAddFunctionalBlock}
            >
              <Sparkles className="h-4 w-4" /> Inserir bloco funcional
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
