"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  MoreVertical,
  Pencil,
  Trash2,
  Timer as TimerIcon,
  Loader2,
  TrendingUp,
  TrendingDown,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimerCard } from "@/components/timer/TimerCard";
import { useTimers } from "@/hooks/useTimers";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Bloco } from "@/types/bloco";

const TIME_PRESETS = [
  { label: "Pomodoro", minutes: 25 },
  { label: "Pausa", minutes: 5 },
  { label: "Foco", minutes: 45 },
  { label: "Estudo", minutes: 60 },
];

interface TimersBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function TimersBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: TimersBlocoCardProps) {
  const {
    timers = [],
    isLoading,
    start,
    stop,
    deletar,
    atualizar,
    isStarting,
    isStopping,
    isDeleting: isDeletingTimer,
    isUpdating,
  } = useTimers(nucleoId);

  const [novaDescricao, setNovaDescricao] = useState("");
  const [tempoMinutos, setTempoMinutos] = useState<number>(25);
  const [modo, setModo] = useState<"crescente" | "decrescente">("decrescente");
  const [somAtivado, setSomAtivado] = useState(true);
  const [isStartingTimer, setIsStartingTimer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTimer = timers.find((t) => !t.fim && t.inicio);
  const hasRunningTimer = !!activeTimer;

  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer-complete.mp3");
  }, []);

  const handleStartTimer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDescricao.trim()) {
      toast({
        title: "Informe uma descrição para o timer",
        variant: "destructive",
      });
      return;
    }
    setIsStartingTimer(true);
    try {
      const duracaoSegundos =
        modo === "decrescente" ? tempoMinutos * 60 : undefined;
      await start({
        nucleoId,
        titulo: novaDescricao.trim(),
        duracaoSegundos,
        modo,
      });
      setNovaDescricao("");
      toast({
        title: "Timer iniciado!",
        description: `${novaDescricao.trim()} - ${modo === "decrescente" ? `${tempoMinutos}min` : "cronômetro"}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar timer",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setIsStartingTimer(false);
    }
  };

  const handleStopTimer = async (id: string) => {
    try {
      await stop(id);
      toast({ title: "Timer finalizado!" });
      if (somAtivado && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    } catch (error: any) {
      toast({
        title: "Erro ao parar timer",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimer = async (id: string) => {
    if (!confirm("Excluir este timer permanentemente?")) return;
    try {
      await deletar(id);
      toast({ title: "Timer excluído!" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir timer",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTimer = async (id: string, titulo: string) => {
    try {
      await atualizar({ id, titulo });
      toast({ title: "Timer atualizado!" });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectPreset = (minutes: number) => {
    setTempoMinutos(minutes);
    setModo("decrescente");
  };

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardContent className="space-y-4">
        {/* Timer ativo */}
        {hasRunningTimer && activeTimer && (
          <div className="mb-4">
            <TimerCard
              timer={activeTimer}
              onStop={handleStopTimer}
              onDelete={handleDeleteTimer}
              onUpdate={handleUpdateTimer}
              isStopping={isStopping}
              isDeleting={isDeletingTimer}
              isUpdating={isUpdating}
            />
          </div>
        )}

        {/* Formulário para iniciar novo timer */}
        {!hasRunningTimer && (
          <form onSubmit={handleStartTimer} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="descricao"
                className="text-xs text-muted-foreground"
              >
                Você vai..?
              </Label>
              <Input
                id="descricao"
                placeholder="Ex: Estudar, Trabalhar, Meditar..."
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                className="h-9"
                disabled={isStartingTimer}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Duração</Label>
              <ToggleGroup type="single" className="grid grid-cols-4 gap-1">
                {TIME_PRESETS.map((preset) => (
                  <ToggleGroupItem
                    key={preset.label}
                    value={preset.minutes.toString()}
                    onClick={() => handleSelectPreset(preset.minutes)}
                    className="h-8 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {preset.minutes}min
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={modo}
                  onValueChange={(v) =>
                    setModo(v as "crescente" | "decrescente")
                  }
                  disabled={isStartingTimer}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crescente">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Crescente</span>
                        <span className="text-xs text-muted-foreground">
                          (cronômetro)
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="decrescente">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-blue-500" />
                        <span>Decrescente</span>
                        <span className="text-xs text-muted-foreground">
                          (temporizador)
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {modo === "decrescente" && (
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    max="480"
                    value={tempoMinutos}
                    onChange={(e) =>
                      setTempoMinutos(parseInt(e.target.value) || 25)
                    }
                    className="h-9"
                    disabled={isStartingTimer}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {somAtivado ? (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="som" className="text-xs cursor-pointer">
                  Som ao finalizar
                </Label>
              </div>
              <Switch
                id="som"
                checked={somAtivado}
                onCheckedChange={setSomAtivado}
                disabled={isStartingTimer}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isStartingTimer || !novaDescricao.trim()}
            >
              {isStartingTimer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar{" "}
                  {modo === "decrescente" ? `${tempoMinutos}min` : "cronômetro"}
                </>
              )}
            </Button>
          </form>
        )}

        {/* Histórico de timers */}
        {!hasRunningTimer && (
          <>
            <div className="flex items-center gap-2 pt-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Histórico recente
              </h4>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : timers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm bg-muted/20 rounded-lg">
                <TimerIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Nenhum timer ainda.</p>
                <p className="text-xs mt-1">Inicie seu primeiro timer acima!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {timers.slice(0, 5).map((timer) => (
                  <TimerCard
                    key={timer.id}
                    timer={timer}
                    onStop={handleStopTimer}
                    onDelete={handleDeleteTimer}
                    onUpdate={handleUpdateTimer}
                    isStopping={isStopping}
                    isDeleting={isDeletingTimer}
                    isUpdating={isUpdating}
                  />
                ))}
                {timers.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{timers.length - 5} timers anteriores
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
