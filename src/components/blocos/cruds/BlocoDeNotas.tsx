"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, FileText } from "lucide-react";
import { useBlocoNotas } from "@/hooks/useBlocoNotas";
import { toast } from "@/hooks/use-toast";
import { useBlocos } from "@/hooks/useBlocos";

interface BlocoDeNotasProps {
  bloco: {
    id: string;
    titulo: string | null;
    configuracoes?: Record<string, any> | null;
  };
  nucleoId: string;
  onDelete?: () => void;
}

export function BlocoDeNotas({ bloco, nucleoId, onDelete }: BlocoDeNotasProps) {
  const { update } = useBlocos();
  const [conteudo, setConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvo, setSalvo] = useState(false);

  // Converter null para undefined para compatibilidade
  const blocoAdaptado = {
    id: bloco.id,
    titulo: bloco.titulo || "",
    configuracoes: bloco.configuracoes || undefined,
  };

  const { carregarConteudo, salvarConteudo, hasColecao } = useBlocoNotas({
    bloco: blocoAdaptado,
    blocoId: bloco.id,
    onUpdateBloco: update,
  });

  useEffect(() => {
    const load = async () => {
      setCarregando(true);
      const texto = await carregarConteudo();
      setConteudo(texto);
      setCarregando(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSalvando(true);
    try {
      await salvarConteudo(conteudo);
      setSalvo(true);
      toast({ title: "Nota salva!" });
      setTimeout(() => setSalvo(false), 2000);
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (!conteudo) return;
    const interval = setInterval(() => {
      if (!salvando) {
        salvarConteudo(conteudo).catch(console.error);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [conteudo, salvando]);

  if (carregando) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          {bloco.titulo || "Bloco de Notas"}
        </CardTitle>
        <div className="flex items-center gap-2">
          {salvo && (
            <span className="text-xs text-green-500 animate-in fade-in">
              Salvo!
            </span>
          )}
          <Button size="sm" onClick={handleSave} disabled={salvando}>
            {salvando ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Digite suas anotações aqui..."
          className="min-h-[400px] resize-y font-mono text-sm bg-background"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{conteudo.length} caracteres</span>
          <span>Auto-salva a cada 30 segundos</span>
        </div>
      </CardContent>
    </Card>
  );
}
