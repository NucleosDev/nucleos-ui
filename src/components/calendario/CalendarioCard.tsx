"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  CalendarDays,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CalendarioEvento } from "@/types/calendar";

interface CalendarioCardProps {
  eventos: CalendarioEvento[];
  isLoading?: boolean;
  onAddEvento: (
    data: Date,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
  ) => Promise<void>;
  onUpdateEvento: (
    id: string,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
    dataEvento?: Date,
  ) => Promise<void>;
  onDeleteEvento: (id: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function CalendarioCard({
  eventos,
  isLoading = false,
  onAddEvento,
  onUpdateEvento,
  onDeleteEvento,
  isSubmitting = false,
}: CalendarioCardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<CalendarioEvento | null>(
    null,
  );
  const [viewingEvento, setViewingEvento] = useState<CalendarioEvento | null>(
    null,
  );
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    duracaoMinutos: 60,
    dataEvento: new Date(),
    hora: "12:00",
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = [
    { label: "DOM", full: "Domingo" },
    { label: "SEG", full: "Segunda" },
    { label: "TER", full: "Terça" },
    { label: "QUA", full: "Quarta" },
    { label: "QUI", full: "Quinta" },
    { label: "SEX", full: "Sexta" },
    { label: "SÁB", full: "Sábado" },
  ];
  const startDayOfWeek = getDay(monthStart);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getEventosForDay = (day: Date) => {
    return eventos.filter((evento) =>
      isSameDay(new Date(evento.dataEvento), day),
    );
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setEditingEvento(null);
    setFormData({
      titulo: "",
      descricao: "",
      duracaoMinutos: 60,
      dataEvento: day,
      hora: "12:00",
    });
    setDialogOpen(true);
  };

  const handleEditEvento = (evento: CalendarioEvento) => {
    const eventoDate = new Date(evento.dataEvento);
    const hours = eventoDate.getHours().toString().padStart(2, "0");
    const minutes = eventoDate.getMinutes().toString().padStart(2, "0");

    setEditingEvento(evento);
    setSelectedDate(eventoDate);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao || "",
      duracaoMinutos: evento.duracaoMinutos || 60,
      dataEvento: eventoDate,
      hora: `${hours}:${minutes}`,
    });
    setDialogOpen(true);
  };

  const handleViewEvento = (evento: CalendarioEvento) => {
    setViewingEvento(evento);
    setViewDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    const [hours, minutes] = formData.hora.split(":").map(Number);
    const dataCompleta = setHours(
      setMinutes(formData.dataEvento, minutes),
      hours,
    );

    try {
      if (editingEvento) {
        await onUpdateEvento(
          editingEvento.id,
          formData.titulo.trim(),
          formData.descricao.trim() || undefined,
          formData.duracaoMinutos,
          dataCompleta,
        );
      } else {
        await onAddEvento(
          dataCompleta,
          formData.titulo.trim(),
          formData.descricao.trim() || undefined,
          formData.duracaoMinutos,
        );
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no componente pai
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setEditingEvento(null);
    setFormData({
      titulo: "",
      descricao: "",
      duracaoMinutos: 60,
      dataEvento: new Date(),
      hora: "12:00",
    });
  };

  const handleDelete = async () => {
    if (!editingEvento) return;
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await onDeleteEvento(editingEvento.id);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no componente pai
    }
  };

  const dayEventos = selectedDate ? getEventosForDay(selectedDate) : [];
  const eventosOrdenados = [...dayEventos].sort(
    (a, b) =>
      new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime(),
  );

  return (
    <div className="space-y-4">
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={prevMonth}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextMonth}
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            disabled={isLoading}
            className="h-8 text-xs"
          >
            Hoje
          </Button>
          <span className="text-sm font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
        </div>
        <div className="w-16" />
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day, i) => (
          <div key={i} className="text-xs font-medium text-muted-foreground">
            <span className="hidden sm:inline">{day.label}</span>
            <span className="sm:hidden">{day.label.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const dayEventos = getEventosForDay(day);
          const hasEventos = dayEventos.length > 0;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              disabled={isLoading}
              className={cn(
                "aspect-square p-1 rounded-lg text-sm transition-all relative",
                "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                !isCurrentMonth && "text-muted-foreground/40",
                isToday(day) &&
                  "bg-primary/10 ring-1 ring-primary/30 font-semibold",
                isSelected && "bg-primary/20 ring-2 ring-primary",
                hasEventos && !isSelected && "bg-primary/5",
              )}
            >
              <span className="absolute top-1 left-1 text-xs font-medium">
                {format(day, "d")}
              </span>
              {hasEventos && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                  {dayEventos.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  ))}
                  {dayEventos.length > 3 && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dialog principal - Lista de eventos + Formulário */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {editingEvento ? "Editar evento" : "Novo evento"}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && !editingEvento && (
                <span className="capitalize">
                  {format(selectedDate, "EEEE, dd 'de' MMMM yyyy", {
                    locale: ptBR,
                  })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Lista de eventos do dia (modo criação) */}
          {!editingEvento && dayEventos.length > 0 && (
            <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Eventos neste dia
                </span>
                <Badge variant="secondary" className="text-xs">
                  {dayEventos.length} evento{dayEventos.length !== 1 && "s"}
                </Badge>
              </div>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {eventosOrdenados.map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-all group"
                    >
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => handleViewEvento(evento)}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-mono">
                            {format(new Date(evento.dataEvento), "HH:mm")}
                          </span>
                          {evento.duracaoMinutos && (
                            <span className="text-xs text-muted-foreground">
                              ({evento.duracaoMinutos} min)
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate mt-1">
                          {evento.titulo}
                        </p>
                        {evento.descricao && (
                          <p className="text-xs text-muted-foreground truncate">
                            {evento.descricao}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {/* 👁️ BOTÃO DE VISUALIZAR (OLHO) */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewEvento(evento);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {/* ✏️ BOTÃO DE EDITAR */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvento(evento);
                          }}
                          title="Editar"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {/* 🗑️ BOTÃO DE EXCLUIR */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvento(evento.id);
                          }}
                          title="Excluir"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEditingEvento(null);
                  setFormData({
                    titulo: "",
                    descricao: "",
                    duracaoMinutos: 60,
                    dataEvento: selectedDate!,
                    hora: "12:00",
                  });
                }}
              >
                <Plus className="mr-2 h-3 w-3" />
                Adicionar novo evento
              </Button>
            </div>
          )}

          {/* Formulário de evento */}
          {(editingEvento ||
            dayEventos.length === 0 ||
            (dayEventos.length > 0 && !editingEvento)) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ex: Reunião de planejamento"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Detalhes do evento..."
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dataEvento">Data</Label>
                  <Input
                    id="dataEvento"
                    type="date"
                    value={format(formData.dataEvento, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataEvento: new Date(e.target.value),
                      })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Horário</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData({ ...formData, hora: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (minutos)</Label>
                <div className="flex gap-2">
                  {[15, 30, 60, 90, 120].map((min) => (
                    <Button
                      key={min}
                      type="button"
                      variant={
                        formData.duracaoMinutos === min ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setFormData({ ...formData, duracaoMinutos: min })
                      }
                      disabled={isSubmitting}
                    >
                      {min}min
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingEvento && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.titulo.trim()}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 👁️ DIALOG DE VISUALIZAÇÃO DETALHADA */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Detalhes do evento
            </DialogTitle>
          </DialogHeader>

          {viewingEvento && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {viewingEvento.titulo}
                </h3>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data e hora</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(viewingEvento.dataEvento),
                        "EEEE, dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR },
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Horário:{" "}
                      {format(new Date(viewingEvento.dataEvento), "HH:mm")}
                      {viewingEvento.duracaoMinutos && (
                        <span>
                          {" "}
                          • Duração: {viewingEvento.duracaoMinutos} minutos
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {viewingEvento.descricao && (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Descrição</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {viewingEvento.descricao}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Criado em</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(viewingEvento.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEditEvento(viewingEvento);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Excluir este evento?")) {
                      onDeleteEvento(viewingEvento.id);
                      setViewDialogOpen(false);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
