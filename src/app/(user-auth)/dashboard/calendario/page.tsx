// "use client";

// import api from "@/services/api";
// import { API_ROUTES } from "@/constants/routes";
// import { useState, useCallback, useEffect } from "react";
// import type { CalendarioEvento } from "@/types/calendar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/hooks/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Plus, Calendar as CalendarIcon, Clock, AlignLeft, Trash2 } from "lucide-react";

// // ========== TIPOS ==========
// export interface CriarEventoDTO {
//   titulo: string;
//   descricao?: string;
//   data_evento: string;
//   duracao_minutos?: number;
// }

// // ========== SERVICE ==========
// export const eventosService = {
//   async getEventosPorNucleo(nucleoId: string): Promise<CalendarioEvento[]> {
//     const response = await api.get<CalendarioEvento[]>(API_ROUTES.CALENDARIO.LIST(nucleoId));
//     return response.data;
//   },

//   async createEvento(nucleoId: string, data: CriarEventoDTO): Promise<CalendarioEvento> {
//     const response = await api.post<CalendarioEvento>(API_ROUTES.CALENDARIO.CREATE(nucleoId), data);
//     return response.data;
//   },

//   async deleteEvento(id: string): Promise<void> {
//     await api.delete(API_ROUTES.CALENDARIO.DELETE(id));
//   },
// };

// // ========== MODAL DE FORMULÁRIO (BASEADO NO SEU DOC) ==========
// function EventoFormModal({
//   open,
//   onClose,
//   onSaved,
//   nucleoId,
// }: {
//   open: boolean;
//   onClose: () => void;
//   onSaved: () => void;
//   nucleoId: string;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<CriarEventoDTO>({
//     titulo: "",
//     descricao: "",
//     data_evento: new Date().toISOString().split("T")[0],
//     duracao_minutos: 60,
//   });

//   const handleSubmit = async () => {
//     if (!form.titulo.trim()) {
//       toast({ title: "Título é obrigatório", variant: "destructive" });
//       return;
//     }

//     setLoading(true);
//     try {
//       await eventosService.createEvento(nucleoId, form);
//       toast({ title: "Evento criado com sucesso!" });
//       onSaved();
//       onClose();
//       setForm({
//         titulo: "",
//         descricao: "",
//         data_evento: new Date().toISOString().split("T")[0],
//         duracao_minutos: 60,
//       });
//     } catch (error) {
//       toast({ title: "Erro ao criar evento", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Novo Evento</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 py-2">
//           <div>
//             <label className="text-sm font-medium block mb-1.5">Título *</label>
//             <Input
//               placeholder="Ex: Reunião de Planejamento"
//               value={form.titulo}
//               onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium block mb-1.5">Descrição</label>
//             <Textarea
//               placeholder="Detalhes do evento..."
//               value={form.descricao}
//               onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
//               rows={3}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium block mb-1.5">Data</label>
//               <Input
//                 type="date"
//                 value={form.data_evento}
//                 onChange={(e) => setForm((f) => ({ ...f, data_evento: e.target.value }))}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium block mb-1.5">Duração (min)</label>
//               <Input
//                 type="number"
//                 value={form.duracao_minutos}
//                 onChange={(e) => setForm((f) => ({ ...f, duracao_minutos: Number(e.target.value) }))}
//               />
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancelar</Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Salvando..." : "Criar Evento"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ========== PÁGINA PRINCIPAL ==========
// export default function CalendarioPage() {
//   const nucleoId = "seu-id-de-exemplo"; // Substitua pelo ID real
//   const [eventos, setEventos] = useState<CalendarioEvento[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);

//   const carregarEventos = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await eventosService.getEventosPorNucleo(nucleoId);
//       setEventos(data);
//     } catch (error) {
//       toast({ title: "Erro ao carregar eventos", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   }, [nucleoId]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Excluir este evento?")) return;
//     try {
//       await eventosService.deleteEvento(id);
//       setEventos((prev) => prev.filter((e) => e.id !== id));
//       toast({ title: "Evento excluído" });
//     } catch (error) {
//       toast({ title: "Erro ao excluir", variant: "destructive" });
//     }
//   };

//   useEffect(() => {
//     carregarEventos();
//   }, [carregarEventos]);

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <CalendarIcon className="h-8 w-8 text-primary" />
//             Calendário
//           </h1>
//           <p className="text-muted-foreground">Gerencie seus compromissos.</p>
//         </div>
//         <Button onClick={() => setShowForm(true)}>
//           <Plus className="mr-2 h-4 w-4" /> Novo Evento
//         </Button>
//       </div>

//       {loading ? (
//         <p>Carregando...</p>
//       ) : eventos.length === 0 ? (
//         <div className="text-center py-20 border-2 border-dashed rounded-xl">
//           <p className="text-muted-foreground">Nenhum evento encontrado.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {eventos.map((evento) => (
//             <div key={evento.id} className="group p-5 border rounded-xl bg-card hover:shadow-md transition-all relative">
//               <button
//                 onClick={() => handleDelete(evento.id)}
//                 className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-2 rounded-full transition-all"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </button>

//               <h3 className="font-bold text-lg mb-2">{evento.titulo}</h3>

//               {evento.descricao && (
//                 <p className="text-sm text-muted-foreground flex items-start gap-2 mb-4">
//                   <AlignLeft className="h-4 w-4 mt-0.5 shrink-0" />
//                   {evento.descricao}
//                 </p>
//               )}

//               <div className="flex gap-3">
//                 <div className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
//                   <CalendarIcon className="h-3 w-3" />
//                   {evento.dataEvento ? new Date(evento.dataEvento).toLocaleDateString('pt-BR') : 'Sem data'}
//                 </div>
//                 {evento.duracaoMinutos && (
//                   <div className="flex items-center gap-1.5 text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
//                     <Clock className="h-3 w-3" />
//                     {evento.duracaoMinutos} min
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <EventoFormModal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         onSaved={carregarEventos}
//         nucleoId={nucleoId}
//       />
//     </div>
//   );
// }
