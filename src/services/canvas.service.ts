// src/services/canvas.service.ts
import { api } from "@/lib/api";

export interface CanvasData {
  id: string | null;
  content: string; // JSON string do array de TextBlock
}

export const canvasService = {
  async getCanvas(nucleoId: string): Promise<CanvasData> {
    const response = await api.get<CanvasData>(`/blocos/canvas/${nucleoId}`);
    console.log("📥 Canvas carregado:", response);
    return response;
  },

  async saveCanvas(nucleoId: string, content: string): Promise<void> {
    console.log("💾 Salvando canvas:", { nucleoId, content });
    await api.put(`/blocos/canvas/${nucleoId}`, { content });
  },
};