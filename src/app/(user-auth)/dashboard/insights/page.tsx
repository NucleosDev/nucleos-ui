// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Sparkles, Send, Bot, User, RefreshCw, Check, Lightbulb } from "lucide-react";
// import { insightsService } from "@/services/tarefas.service";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "@/hooks/use-toast";
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";

// interface Message { role: "user" | "assistant"; content: string; ts: Date; }
// interface Insight { id: string; mensagem: string; insightType: string; priority: number; applied: boolean; createdAt: string; }

// export default function InsightsPage() {
//   const router = useRouter();
//   const [insights, setInsights] = useState<Insight[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [sending, setSending] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState<"chat" | "insights">("chat");
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     insightsService.getInsights().then(d => setInsights(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
//     setMessages([{ role: "assistant", content: "Olá! Sou seu assistente de produtividade. Pode me perguntar sobre seus Nucleos, progresso ou pedir sugestões de como melhorar sua rotina!", ts: new Date() }]);
//   }, []);

//   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || sending) return;
//     const msg = input.trim();
//     setInput("");
//     setMessages(p => [...p, { role: "user", content: msg, ts: new Date() }]);
//     setSending(true);
//     try {
//       const res = await insightsService.chat(msg);
//       setMessages(p => [...p, { role: "assistant", content: res.conteudo || res.message || "Entendido! Aqui vai minha resposta baseada no seu histórico de produtividade.", ts: new Date() }]);
//     } catch {
//       setMessages(p => [...p, { role: "assistant", content: "Desculpe, não consegui processar sua mensagem. Tente novamente.", ts: new Date() }]);
//     } finally { setSending(false); }
//   };

//   const gerarInsight = async () => {
//     setGenerating(true);
//     try {
//       const novo = await insightsService.gerarInsight();
//       setInsights(p => [novo, ...p]);
//       toast({ title: "Insight gerado! ✨" });
//       setTab("insights");
//     } catch { toast({ title: "Erro ao gerar insight", variant: "destructive" }); }
//     finally { setGenerating(false); }
//   };

//   const aplicar = async (id: string) => {
//     try {
//       await insightsService.aplicarInsight(id);
//       setInsights(p => p.map(i => i.id === id ? { ...i, applied: true } : i));
//       toast({ title: "Insight aplicado! +5 XP" });
//     } catch { toast({ title: "Erro", variant: "destructive" }); }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <header className="border-b border-border sticky top-0 z-10 bg-background/95">
//         <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
//             <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /><span className="font-semibold">Insights IA</span></div>
//           </div>
//           <div className="flex gap-1 bg-muted/60 rounded-lg p-1">
//             {(["chat","insights"] as const).map(t => (
//               <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t === "chat" ? "Chat" : "Insights"}</button>
//             ))}
//           </div>
//         </div>
//       </header>

//       {tab === "chat" ? (
//         <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((m, i) => (
//               <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-violet-500/10" : "bg-primary/10"}`}>
//                   {m.role === "assistant" ? <Bot className="w-4 h-4 text-violet-500" /> : <User className="w-4 h-4 text-primary" />}
//                 </div>
//                 <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "assistant" ? "bg-muted/60 rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
//                   {m.content}
//                   <p className={`text-xs mt-1 ${m.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{format(m.ts, "HH:mm", { locale: ptBR })}</p>
//                 </div>
//               </div>
//             ))}
//             {sending && (
//               <div className="flex gap-3">
//                 <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center"><Bot className="w-4 h-4 text-violet-500" /></div>
//                 <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3"><span className="inline-flex gap-1">{[...Array(3)].map((_, i) => <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>
//           <div className="border-t border-border p-4">
//             <div className="flex gap-2">
//               <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Pergunte sobre sua produtividade..." onKeyDown={e => e.key === "Enter" && sendMessage()} className="flex-1" />
//               <Button onClick={sendMessage} disabled={sending || !input.trim()} size="icon"><Send className="w-4 h-4" /></Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
//           <Button onClick={gerarInsight} disabled={generating} className="w-full"><Sparkles className="w-4 h-4 mr-2" />{generating ? "Gerando..." : "Gerar novo insight"}</Button>
//           {loading ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />) :
//             insights.length === 0 ? (
//               <div className="text-center py-16"><Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Clique para gerar seu primeiro insight</p></div>
//             ) : insights.map(ins => (
//               <div key={ins.id} className={`p-4 rounded-xl border ${ins.applied ? "bg-muted/30 border-border opacity-70" : "bg-card border-violet-500/20 shadow-sm"}`}>
//                 <div className="flex items-start gap-3">
//                   <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${ins.applied ? "text-muted-foreground" : "text-violet-500"}`} />
//                   <div className="flex-1">
//                     <p className="text-sm">{ins.mensagem}</p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <Badge variant="outline" className="text-xs">{ins.insightType}</Badge>
//                       <span className="text-xs text-muted-foreground">{format(new Date(ins.createdAt), "d MMM", { locale: ptBR })}</span>
//                     </div>
//                   </div>
//                   {!ins.applied && <Button size="sm" variant="outline" onClick={() => aplicar(ins.id)} className="shrink-0 h-7 text-xs"><Check className="w-3 h-3 mr-1" />Aplicar</Button>}
//                   {ins.applied && <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-xs shrink-0">Aplicado</Badge>}
//                 </div>
//               </div>
//             ))}
//         </main>
//       )}
//     </div>
//   );
// }
