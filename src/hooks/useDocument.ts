import { useState, useCallback } from "react";
import type { DocumentBlock, DocumentBlockType } from "@/types/document";

const genId = () => crypto.randomUUID();

export function useDocument(initialBlocks: DocumentBlock[] = []) {
  const [blocks, setBlocks] = useState<DocumentBlock[]>(initialBlocks);

  const updateBlock = useCallback(
    (id: string, updates: Partial<DocumentBlock>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block,
        ),
      );
    },
    [],
  );

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
  }, []);

  const addBlock = useCallback(
    (type: DocumentBlockType, nucleoId: string, afterBlockId?: string) => {
      const newBlock: DocumentBlock = {
        id: genId(),
        nucleoId,
        tipo: type,
        conteudo: "",
        posicao: blocks.length,
      };

      if (afterBlockId) {
        const index = blocks.findIndex((b) => b.id === afterBlockId);
        if (index !== -1) {
          const newBlocks = [...blocks];
          newBlocks.splice(index + 1, 0, newBlock);
          setBlocks(newBlocks.map((b, i) => ({ ...b, posicao: i })));
          return newBlock;
        }
      }

      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      return newBlock;
    },
    [blocks.length],
  );

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prevBlocks) => {
      const blockToDuplicate = prevBlocks.find((b) => b.id === id);
      if (!blockToDuplicate) return prevBlocks;

      const newBlock: DocumentBlock = {
        ...blockToDuplicate,
        id: genId(),
        posicao: blockToDuplicate.posicao + 1,
      };

      const index = prevBlocks.findIndex((b) => b.id === id);
      if (index !== -1) {
        const newBlocks = [...prevBlocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks.map((b, i) => ({ ...b, posicao: i }));
      }

      return prevBlocks;
    });
  }, []);

  const reorderBlocks = useCallback((fromId: string, toId: string) => {
    setBlocks((prevBlocks) => {
      const oldIndex = prevBlocks.findIndex((b) => b.id === fromId);
      const newIndex = prevBlocks.findIndex((b) => b.id === toId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prevBlocks;
      }

      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return newBlocks.map((block, index) => ({
        ...block,
        posicao: index,
      }));
    });
  }, []);

  return {
    blocks,
    updateBlock,
    deleteBlock,
    addBlock,
    duplicateBlock,
    reorderBlocks,
    setBlocks,
  };
}
