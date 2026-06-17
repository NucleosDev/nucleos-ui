// src/services/canvas.service.ts
import { api } from "@/lib/api";

export interface CanvasData {
  id: string | null;
  content: string; // JSON string do array de TextBlock
}

export const canvasService = {
  async getCanvas(nucleoId: string): Promise<CanvasData> {
    return api.get<CanvasData>(`/blocos/canvas/${nucleoId}`);
  },

  async saveCanvas(nucleoId: string, content: string): Promise<void> {
    await api.put(`/blocos/canvas/${nucleoId}`, { content });
  },
};